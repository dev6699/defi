// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "./interfaces/ITokenPair.sol";
import "./interfaces/IPairFactory.sol";

contract TokenPair is ITokenPair, ERC20, ReentrancyGuard {
    bytes4 private constant SELECTOR =
        bytes4(keccak256(bytes("transfer(address,uint256)")));

    address public factory;
    address public tokenA;
    address public tokenB;
    uint256 public kLast;
    uint256 public constant MINIMUM_LIQUIDITY = 10 ** 3;

    uint256 private reserveA; // The reserve amount of tokenA
    uint256 private reserveB; // The reserver amount of tokenB
    uint256 private blockTimestampLast; // The timestamp of the last change for the reserves

    function getReserves()
        public
        view
        returns (
            uint256 _reserveA,
            uint256 _reserveB,
            uint256 _blockTimestampLast
        )
    {
        _reserveA = reserveA;
        _reserveB = reserveB;
        _blockTimestampLast = blockTimestampLast;
    }

    function _safeTransfer(address token, address to, uint256 value) private {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(SELECTOR, to, value)
        );
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            "TRANSFER_FAILED"
        );
    }

    constructor() ERC20("DEX Token Pair", "DEX-TP") {
        factory = msg.sender;
    }

    function initialize(address _tokenA, address _tokenB) external {
        require(msg.sender == factory, "NOT_FACTORY");
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    function _setReserves(uint256 balance0, uint256 balance1) private {
        reserveA = balance0;
        reserveB = balance1;
        blockTimestampLast = block.timestamp;
        emit Sync(reserveA, reserveB);
    }

    // Mint reward for DEX owner
    function _mintReward(
        uint256 _reserveA,
        uint256 _reserveB
    ) private returns (bool hasReward) {
        address rewardTo = IPairFactory(factory).rewardTo();
        hasReward = rewardTo != address(0);
        uint256 _kLast = kLast; // gas savings
        if (hasReward) {
            if (_kLast != 0) {
                uint256 rootK = Math.sqrt(_reserveA * _reserveB);
                uint256 rootKLast = Math.sqrt(_kLast);
                if (rootK > rootKLast) {
                    uint256 liquidity = (totalSupply() * (rootK - rootKLast)) /
                        (rootKLast + rootK * 9); // 10% reward goes to DEX owner
                    if (liquidity > 0) _mint(rewardTo, liquidity);
                }
            }
        } else if (_kLast != 0) {
            kLast = 0;
        }
    }

    function mint(
        address to
    ) external nonReentrant returns (uint256 liquidity) {
        // Step 1: Calculate amounts of LP Tokens to be minted
        (uint256 _reserveA, uint256 _reserveB, ) = getReserves();
        uint256 balanceA = IERC20(tokenA).balanceOf(address(this));
        uint256 balanceB = IERC20(tokenB).balanceOf(address(this));

        uint256 amountA = balanceA - _reserveA;
        uint256 amountB = balanceB - _reserveB;

        bool hasReward = _mintReward(_reserveA, _reserveB);
        uint256 _totalSupply = totalSupply();
        if (_totalSupply == 0) {
            liquidity = Math.sqrt(amountA * amountB) - MINIMUM_LIQUIDITY;
            // permanently lock the first MINIMUM_LIQUIDITY tokens to prevent somebody drain all LP tokens
            // by sending the MINIMUM_LIQUIDITY tokens to a dead address (address(0xdEaD))
            _mint(address(0xdEaD), MINIMUM_LIQUIDITY);
        } else {
            liquidity = Math.min(
                (amountA * _totalSupply) / _reserveA,
                (amountB * _totalSupply) / _reserveB
            );
        }
        require(liquidity > 0, "INSUFFICIENT_LIQUIDITY_MINTED");

        // Step 2: Mint the LP tokens and send to user
        _mint(to, liquidity);

        // Step 3: Update the reserves
        _setReserves(balanceA, balanceB);

        if (hasReward) kLast = reserveA * reserveB;
        emit Mint(msg.sender, amountA, amountB);
    }

    function burn(
        address to
    ) external nonReentrant returns (uint256 amountA, uint256 amountB) {
        // Step 1: Calculate token amounts sent back to user
        (uint256 _reserveA, uint256 _reserveB, ) = getReserves();
        address _tokenA = tokenA;
        address _tokenB = tokenB;
        uint256 balanceA = IERC20(_tokenA).balanceOf(address(this));
        uint256 balanceB = IERC20(_tokenB).balanceOf(address(this));
        uint256 liquidity = balanceOf(address(this));

        bool hasReward = _mintReward(_reserveA, _reserveB);
        uint256 _totalSupply = totalSupply();
        amountA = (liquidity * balanceA) / _totalSupply;
        amountB = (liquidity * balanceB) / _totalSupply;
        require(amountA > 0 && amountB > 0, "INSUFFICIENT_BURNING_LIQUIDITY");

        // Step 2: Burn the LP tokens and send paired tokens
        _burn(address(this), liquidity);
        _safeTransfer(_tokenA, to, amountA);
        _safeTransfer(_tokenB, to, amountB);

        // Step 3: Set the reserves with token balances
        balanceA = IERC20(_tokenA).balanceOf(address(this));
        balanceB = IERC20(_tokenB).balanceOf(address(this));
        _setReserves(balanceA, balanceB);
        if (hasReward) kLast = reserveA * reserveB;
        emit Burn(msg.sender, amountA, amountB, to);
    }

    function swap(
        uint256 amountAOut,
        uint256 amountBOut,
        address to
    ) external nonReentrant {
        // Step 1: Pre-transfer verification
        // only 1 outputAmount can be zero
        // the one with zero amount will be transferred in
        // while the one with non-zero amount will be transferred out to user
        require(amountAOut > 0 || amountBOut > 0, "INVALID_OUTPUT_AMOUNT");
        (uint256 _reserveA, uint256 _reserveB, ) = getReserves();
        require(
            amountAOut < _reserveA && amountBOut < _reserveB,
            "INSUFFICIENT_RESERVE"
        );
        address _tokenA = tokenA;
        address _tokenB = tokenB;
        require(to != _tokenA && to != _tokenB, "INVALID_OUTPUT_ADDRESS");

        // Step 2: Perform the transfer
        if (amountAOut > 0) _safeTransfer(_tokenA, to, amountAOut);
        if (amountBOut > 0) _safeTransfer(_tokenB, to, amountBOut);

        // Step 3: Verify if the input amount is sufficient
        uint256 balanceA = IERC20(_tokenA).balanceOf(address(this));
        uint256 balanceB = IERC20(_tokenB).balanceOf(address(this));

        // Token transferred in will increase token balance,
        // we can get the amount of token transferred in
        // by subtracting current token reserve from balance(amountOut zero)
        // ---
        // Token transferred out (amountOut non-zero),
        // amountIn sure to be zero because balance is value after deduct amountOut from reserve
        uint256 amountAIn = balanceA > _reserveA - amountAOut
            ? balanceA - (_reserveA - amountAOut)
            : 0;
        uint256 amountBIn = balanceB > _reserveB - amountBOut
            ? balanceB - (_reserveB - amountBOut)
            : 0;
        require(amountAIn > 0 || amountBIn > 0, "INSUFFICIENT_INPUT_AMOUNT");

        // Step 4: Verify if the balances are sufficient for rewards
        {
            // Scope for balance{A,B}Adjusted, avoids stack to deep error.
            // balanceAdjusted = balance - 0.2% * amountIn (0.2% transaction fee)
            uint256 balanceAAdjusted = balanceA * 1000 - amountAIn * 2;
            uint256 balanceBAdjusted = balanceB * 1000 - amountBIn * 2;

            // ensure liquidity pool still holds enough reserves
            // after accouting for the swap and fee
            // 1000 ** 2 is to ensure balanceAdjusted(both balance been multiple by 1000)
            // and reserves is compared in the same scale
            require(
                balanceAAdjusted * balanceBAdjusted >=
                    _reserveA * _reserveB * 1000 ** 2,
                "INSUFFICIENT_LIQUIDITY"
            );
        }

        // Step 5: Update the reserves with token balances
        _setReserves(balanceA, balanceB);
        emit Swap(msg.sender, amountAIn, amountBIn, amountAOut, amountBOut, to);
    }

    // Force balances to match reserves
    function skim(address to) external nonReentrant {
        address _tokenA = tokenA;
        address _tokenB = tokenB;
        _safeTransfer(
            _tokenA,
            to,
            IERC20(_tokenA).balanceOf(address(this)) - reserveA
        );
        _safeTransfer(
            _tokenB,
            to,
            IERC20(_tokenB).balanceOf(address(this)) - reserveB
        );
    }

    // Force reserves to match balances
    function sync() external nonReentrant {
        _setReserves(
            IERC20(tokenA).balanceOf(address(this)),
            IERC20(tokenB).balanceOf(address(this))
        );
    }
}
