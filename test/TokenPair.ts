import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { fromWei, getAmountIn, getAmountOut, toWei } from "./utils";

describe("TokenPair", function () {

    async function deployTokenPairFixture() {
        const [owner, otherAccount] = await hre.ethers.getSigners();
        const PairFactory = await hre.ethers.getContractFactory("PairFactory");
        const pairFactory = await PairFactory.deploy();
        const TokenPair = await hre.ethers.getContractFactory("TokenPair");
        const tokenPair = await TokenPair.deploy();
        const Token0 = await hre.ethers.getContractFactory("SimpleDeFiToken");
        const token0 = await Token0.deploy();
        const Token1 = await hre.ethers.getContractFactory("MemeToken");
        const token1 = await Token1.deploy();

        return {
            pairFactory,
            tokenPair,
            token0,
            token1,
            owner,
            otherAccount,
        };
    }

    describe("Deployment", function () {
        it("Should set the correct factory address, name, symbol", async function () {
            const { tokenPair, owner } = await loadFixture(deployTokenPairFixture);
            expect(await tokenPair.name()).to.equal("DEX Token Pair");
            expect(await tokenPair.symbol()).to.equal("DEX-TP");
            expect(await tokenPair.factory()).to.equal(owner.address);
        });
    });

    describe("Initialize", function () {
        it("Should initialize the token pair with the correct tokens", async function () {
            const { tokenPair, token0, token1 } = await loadFixture(deployTokenPairFixture);
            const token0Address = await token0.getAddress()
            const token1Address = await token1.getAddress()

            await tokenPair.initialize(token0Address, token1Address)
            expect(await tokenPair.tokenA()).to.equal(token0Address);
            expect(await tokenPair.tokenB()).to.equal(token1Address);
        });

        it("Should revert if not factory", async function () {
            const { tokenPair, token0, token1, otherAccount } = await loadFixture(deployTokenPairFixture);
            const token0Address = await token0.getAddress()
            const token1Address = await token1.getAddress()

            await expect(tokenPair.connect(otherAccount).initialize(token0Address, token1Address)).to.be.revertedWith("NOT_FACTORY");
        });
    })

    const MINIMUM_LIQUIDITY = BigInt(10 ** 3)

    const setupTokenPair = async () => {
        const fixture = await loadFixture(deployTokenPairFixture);
        const { token0, token1, pairFactory } = fixture
        const token0Address = await token0.getAddress()
        const token1Address = await token1.getAddress()

        // Need to use factory createPair instead of using initialize directly
        await pairFactory.createPair(token0Address, token1Address)
        const createdTokenPairAddress = await pairFactory.allPairs(0)

        // get the tokenPair contract created by pairFactory contract
        const createdTokenPair = await hre.ethers.getContractAt("TokenPair", createdTokenPairAddress)

        // Provide liquidity by transferring tokens into liquidity pool
        const addLiquidity = async (token0Amount: bigint, token1Amount: bigint) => {
            await token0.transfer(createdTokenPairAddress, token0Amount)
            await token1.transfer(createdTokenPairAddress, token1Amount)
        }

        const removeLiquidity = async (from: HardhatEthersSigner, liquidity: bigint) => {
            // approve tokenPair to transfer tokenPair LP token out from user
            await createdTokenPair.connect(from).approve(createdTokenPairAddress, liquidity)

            // https://hardhat.org/hardhat-network/docs/reference#hardhat_impersonateaccount
            await hre.network.provider.request({
                method: 'hardhat_impersonateAccount',
                params: [createdTokenPairAddress]
            })
            // provide funds to the tokenPair signer to avoid 
            // "ProviderError: Sender doesn't have enough funds to send tx."
            await hre.network.provider.send("hardhat_setBalance", [
                createdTokenPairAddress,
                `0x${Number(toWei(1).toString()).toString(16)}`,
            ]);
            const tokenPairSigner = await hre.ethers.getSigner(createdTokenPairAddress)

            expect(await createdTokenPair.balanceOf(createdTokenPairAddress)).to.eq(BigInt(0))
            // called transferFrom as tokenPair to transfer user's LP tokens to tokenPair balance
            await createdTokenPair.
                connect(tokenPairSigner).
                transferFrom(from.address, createdTokenPairAddress, liquidity)
            expect(await createdTokenPair.balanceOf(createdTokenPairAddress)).to.eq(liquidity)

            await hre.network.provider.request({
                method: "hardhat_stopImpersonatingAccount",
                params: [createdTokenPairAddress],
            });
        }

        return [fixture, { createdTokenPair, createdTokenPairAddress, addLiquidity, removeLiquidity }] as const
    }

    const expectInitialLiquidity = (token0Amount: bigint, token1Amount: bigint) => {
        // formula for initial liquidity to get when there is no liquidity
        return toWei(
            Math.sqrt(
                +fromWei(token0Amount.toString()) * +fromWei(token1Amount.toString())
            )
        ) - MINIMUM_LIQUIDITY
    }

    describe("Mint", async function () {

        it("Should mint liquidity tokens", async function () {
            const token0Amount = toWei(1)
            const token1Amount = toWei(4)
            const [
                { owner, token0, token1 },
                { createdTokenPair, createdTokenPairAddress, addLiquidity }
            ] = await setupTokenPair()
            const expectedLiquidity = expectInitialLiquidity(token0Amount, token1Amount)
            await addLiquidity(token0Amount, token1Amount)

            // Mint liquidity tokens
            await expect(createdTokenPair.mint(owner.address))
                // permanently lock the first MINIMUM_LIQUIDITY tokens
                .to.emit(createdTokenPair, "Transfer")
                .withArgs(ethers.ZeroAddress, "0x000000000000000000000000000000000000dEaD", MINIMUM_LIQUIDITY)
                // transfer minted LP tokens to user
                .to.emit(createdTokenPair, 'Transfer')
                .withArgs(ethers.ZeroAddress, owner.address, expectedLiquidity)
                // set reserves
                .to.emit(createdTokenPair, 'Sync')
                .withArgs(token0Amount, token1Amount)
                .to.emit(createdTokenPair, 'Mint')
                .withArgs(owner.address, token0Amount, token1Amount)

            expect(await createdTokenPair.totalSupply()).to.be.equal(expectedLiquidity + MINIMUM_LIQUIDITY)
            expect(await createdTokenPair.balanceOf(owner.address)).to.eq(expectedLiquidity)
            expect(await token0.balanceOf(createdTokenPairAddress)).to.eq(token0Amount)
            expect(await token1.balanceOf(createdTokenPairAddress)).to.eq(token1Amount)
            const reserves = await createdTokenPair.getReserves()
            expect(reserves[0]).to.eq(token0Amount)
            expect(reserves[1]).to.eq(token1Amount)
        })

        it("Should calculate liquidity based on token reserve when adding new liquidity", async function () {
            const [
                { owner, token0, token1 },
                { createdTokenPair, createdTokenPairAddress, addLiquidity }
            ] = await setupTokenPair()

            const token0Amount = toWei(1)
            const token1Amount = toWei(4)
            const initialLiquidity = expectInitialLiquidity(token0Amount, token1Amount)
            await addLiquidity(token0Amount, token1Amount)
            await createdTokenPair.mint(owner.address)

            const initialTotalSupply = await createdTokenPair.totalSupply()
            expect(initialTotalSupply).to.be.equal(initialLiquidity + MINIMUM_LIQUIDITY)

            const [token0Reserve, token1Reserve] = await createdTokenPair.getReserves()
            // initial amount will be set as reserve
            expect(token0Reserve).to.eq(token0Amount)
            expect(token1Reserve).to.eq(token1Amount)

            // add new liquidity
            const token0Amount1 = toWei(7)
            const token1Amount1 = toWei(2)
            await addLiquidity(token0Amount1, token1Amount1)
            await createdTokenPair.mint(owner.address)

            // new token balance held by tokenPair
            const token0Balance = token0Amount + token0Amount1
            const token1Balance = token1Amount + token1Amount1
            expect(await token0.balanceOf(createdTokenPairAddress)).to.eq(token0Balance)
            expect(await token1.balanceOf(createdTokenPairAddress)).to.eq(token1Balance)

            const token0AmountCounted = token0Balance - token0Reserve
            const token1AmountCounted = token1Balance - token1Reserve
            const liquidity0 = (token0AmountCounted * initialTotalSupply) / token0Reserve
            const liquidity1 = (token1AmountCounted * initialTotalSupply) / token1Reserve
            // User will only get the minimum liquidity based on token reserve
            // extra transferred token will be held by tokenPair
            // NOTE: make sure to only transfer the exact token ratio as liquidity pool to avoid loses
            const minLiquidity = liquidity0 < liquidity1 ? liquidity0 : liquidity1
            expect(await createdTokenPair.totalSupply()).to.be.equal(initialLiquidity + MINIMUM_LIQUIDITY + minLiquidity)
            expect(await createdTokenPair.balanceOf(owner.address)).to.eq(initialLiquidity + minLiquidity)

            const reserves = await createdTokenPair.getReserves()
            expect(reserves[0]).to.eq(token0Balance)
            expect(reserves[1]).to.eq(token1Balance)
        })

        it("Should revert if liquidity less than zero", async function () {
            // liquidity will be less than minimum liquidity
            const token0Amount = MINIMUM_LIQUIDITY
            const token1Amount = MINIMUM_LIQUIDITY
            const [
                { owner },
                { createdTokenPair, addLiquidity }
            ] = await setupTokenPair()
            await addLiquidity(token0Amount, token1Amount)
            await expect(createdTokenPair.mint(owner.address)).to.be.revertedWith("INSUFFICIENT_LIQUIDITY_MINTED");
        })
    })

    describe("Burn", async function () {

        for (const liquidityRemoveRatio of [1, 2, 10]) {

            it("Should get back pair tokens and burn LP tokens. Ratio: " + 1 / liquidityRemoveRatio, async function () {
                const token0Amount = toWei(1)
                const token1Amount = toWei(4)
                const [
                    { otherAccount, token0, token1 },
                    { createdTokenPair, createdTokenPairAddress, addLiquidity, removeLiquidity }
                ] = await setupTokenPair()

                await addLiquidity(token0Amount, token1Amount)
                await createdTokenPair.mint(otherAccount.address)

                expect(await token0.balanceOf(otherAccount.address)).to.eq(BigInt(0))
                expect(await token1.balanceOf(otherAccount.address)).to.eq(BigInt(0))

                const expectedLiquidity = expectInitialLiquidity(token0Amount, token1Amount)
                const liquidityToRemove = expectedLiquidity / BigInt(liquidityRemoveRatio)

                // --check state before burn--
                const totalSupply = await createdTokenPair.totalSupply()
                expect(totalSupply).to.eq(expectedLiquidity + MINIMUM_LIQUIDITY)

                const token0Balance = await token0.balanceOf(createdTokenPairAddress)
                const token1Balance = await token1.balanceOf(createdTokenPairAddress)
                expect(token0Balance).to.eq(token0Amount)
                expect(token1Balance).to.eq(token1Amount)

                const amount0 = liquidityToRemove * token0Balance / totalSupply
                const amount1 = liquidityToRemove * token1Balance / totalSupply

                // Remaining reserves after burnt
                const reserve0 = token0Balance - amount0
                const reserve1 = token1Balance - amount1

                await removeLiquidity(otherAccount, liquidityToRemove)
                // Burn liquidity tokens
                await expect(createdTokenPair.connect(otherAccount).burn(otherAccount))
                    .to.emit(createdTokenPair, "Transfer")
                    // burn LP tokens by transferring to zero address
                    .withArgs(createdTokenPairAddress, ethers.ZeroAddress, liquidityToRemove)
                    // set reserves
                    .to.emit(createdTokenPair, 'Sync')
                    .withArgs(reserve0, reserve1)
                    .to.emit(createdTokenPair, 'Burn')
                    .withArgs(otherAccount, amount0, amount1, otherAccount)

                // --check state after burn--
                expect(await createdTokenPair.totalSupply()).to.eq(expectedLiquidity - liquidityToRemove + MINIMUM_LIQUIDITY)

                // LP tokens will be burnt
                expect(await createdTokenPair.balanceOf(createdTokenPairAddress)).to.eq(BigInt(0))

                // Amount of pair tokens received after burnt
                expect(await token0.balanceOf(otherAccount.address)).to.eq(amount0)
                expect(await token1.balanceOf(otherAccount.address)).to.eq(amount1)

                // Amount of remaining pair tokens in tokenPair
                expect(await token0.balanceOf(createdTokenPairAddress)).to.eq(reserve0)
                expect(await token1.balanceOf(createdTokenPairAddress)).to.eq(reserve1)
            })
        }

        it("Should revert if insufficient liquidity to burn", async function () {
            const token0Amount = toWei(1)
            const token1Amount = toWei(4)
            const [
                { otherAccount },
                { createdTokenPair, addLiquidity }
            ] = await setupTokenPair()

            await addLiquidity(token0Amount, token1Amount)
            await createdTokenPair.mint(otherAccount.address)

            await expect(createdTokenPair.connect(otherAccount).burn(otherAccount)).to.be.revertedWith("INSUFFICIENT_BURNING_LIQUIDITY");
        })
    });

    describe("Swap", async function () {
        it("Should set the correct reserves after swap", async function () {
            const token0Amount = toWei(3)
            const token1Amount = toWei(4)
            const [
                { owner, otherAccount, token0, token1 },
                { createdTokenPair, createdTokenPairAddress, addLiquidity, removeLiquidity }
            ] = await setupTokenPair()

            await addLiquidity(token0Amount, token1Amount)
            await createdTokenPair.mint(otherAccount.address)

            const to = otherAccount.address

            await expect(createdTokenPair.swap(BigInt(0), BigInt(0), to)).to.be.revertedWith("INVALID_OUTPUT_AMOUNT")
            await expect(createdTokenPair.swap(token0Amount, token1Amount, to)).to.be.revertedWith("INSUFFICIENT_RESERVE")

            const token0SwapAmount = toWei(1)
            const token1DummySwapAmount = toWei(1)
            await expect(createdTokenPair.swap(token0SwapAmount, token1DummySwapAmount, await token0.getAddress())).to.be.revertedWith("INVALID_OUTPUT_ADDRESS")
            await expect(createdTokenPair.swap(token0SwapAmount, token1DummySwapAmount, await token1.getAddress())).to.be.revertedWith("INVALID_OUTPUT_ADDRESS")

            const [token0Reserve, token1Reserve] = await createdTokenPair.getReserves()
            // use 1 wei token0 to swap n token1
            const token0SwapAmountIn = BigInt(0)
            const token1SwapAmountOut = getAmountOut(token0SwapAmount, token0Reserve, token1Reserve);

            // input token not transferred in
            await expect(createdTokenPair.swap(token0SwapAmountIn, token1SwapAmountOut, to)).to.be.revertedWith("INSUFFICIENT_INPUT_AMOUNT")

            // transfer token0 into tokenPair
            await token0.transfer(createdTokenPairAddress, token0SwapAmount)
            await expect(
                createdTokenPair
                    .connect(otherAccount)
                    .swap(token0SwapAmountIn, token1SwapAmountOut, otherAccount.address)
            ).to
                .emit(createdTokenPair, "Swap")
                .withArgs(
                    otherAccount.address,
                    token0SwapAmount,
                    BigInt(0),
                    BigInt(0),
                    token1SwapAmountOut,
                    otherAccount.address
                )

            const [token0Reserve1, token1Reserve1] = await createdTokenPair.getReserves()
            expect(token0Reserve1).to.eq(token0Amount + token0SwapAmount)
            expect(token1Reserve1).to.eq(token1Amount - token1SwapAmountOut);

            const checkAddLiquidityRewardDEX = async () => {
                // swap will result next add/remove liquidity to reward DEX owner
                const initialLiquidity = await createdTokenPair.balanceOf(owner)
                expect(initialLiquidity).to.eq(BigInt(0))

                await addLiquidity(token0Amount, token1Amount)
                await expect(createdTokenPair.connect(otherAccount).mint(otherAccount.address))
                    .to.emit(createdTokenPair, 'Transfer')
                    .withArgs(ethers.ZeroAddress, otherAccount.address, anyValue)
                    .to.emit(createdTokenPair, 'Transfer')
                    // should reward DEX owner since swap happen
                    .withArgs(ethers.ZeroAddress, owner.address, anyValue)

                const rewardedLiquidity = await createdTokenPair.balanceOf(owner)
                expect(rewardedLiquidity).to.greaterThan(initialLiquidity)

                await addLiquidity(token0Amount, token1Amount)
                await expect(createdTokenPair.connect(otherAccount).mint(otherAccount.address))
                    .to.emit(createdTokenPair, 'Transfer')
                    .withArgs(ethers.ZeroAddress, otherAccount.address, anyValue)

                // won't get reward since previous reward has been rewarded and no further swap occur
                const unchangedLiquidity = await createdTokenPair.balanceOf(owner)
                expect(unchangedLiquidity).to.eq(rewardedLiquidity)
            }
            await checkAddLiquidityRewardDEX()

            // use x token1 to swap 1 wei token0
            const [token0Reserve2, token1Reserve2] = await createdTokenPair.getReserves()
            const token0SwapAmountOut1 = toWei(1)
            const token1SwapAmountIn1 = getAmountIn(token0SwapAmountOut1, token1Reserve2, token0Reserve2,);
            await token1.transfer(createdTokenPairAddress, token1SwapAmountIn1)
            await expect(
                createdTokenPair
                    .connect(otherAccount)
                    .swap(token0SwapAmountOut1, BigInt(0), otherAccount.address)
            ).to
                .emit(createdTokenPair, "Swap")
                .withArgs(
                    otherAccount.address,
                    BigInt(0),
                    token1SwapAmountIn1,
                    token0SwapAmountOut1,
                    BigInt(0),
                    otherAccount.address
                )

            const checkRemoveLiquidityRewardDEX = async () => {
                // swap will result next add/remove liquidity to reward DEX owner
                const initialLiquidity = await createdTokenPair.balanceOf(owner)

                const liquidityToRemove = initialLiquidity / BigInt(10)
                await removeLiquidity(otherAccount, liquidityToRemove)
                await expect(createdTokenPair.connect(otherAccount).burn(otherAccount.address))
                    .to.emit(createdTokenPair, "Transfer")
                    .withArgs(createdTokenPairAddress, ethers.ZeroAddress, liquidityToRemove)
                    .to.emit(createdTokenPair, 'Transfer')
                    // should reward DEX owner since swap happen
                    .withArgs(ethers.ZeroAddress, owner.address, anyValue)

                const rewardedLiquidity = await createdTokenPair.balanceOf(owner)
                expect(rewardedLiquidity).to.greaterThan(initialLiquidity)

                await removeLiquidity(otherAccount, liquidityToRemove)
                await expect(createdTokenPair.connect(otherAccount).burn(otherAccount.address))
                    .to.emit(createdTokenPair, 'Transfer')
                    .withArgs(createdTokenPairAddress, ethers.ZeroAddress, liquidityToRemove)

                // won't get reward since previous reward has been rewarded and no further swap occur
                const unchangedLiquidity = await createdTokenPair.balanceOf(owner)
                expect(unchangedLiquidity).to.eq(rewardedLiquidity)
            }
            await checkRemoveLiquidityRewardDEX()
        })

    })
});
