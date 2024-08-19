import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AMMRouter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const ammRouterAbi = [
  {
    type: 'constructor',
    inputs: [{ name: '_factory', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenA', internalType: 'address', type: 'address' },
      { name: 'tokenB', internalType: 'address', type: 'address' },
      { name: 'amountADesired', internalType: 'uint256', type: 'uint256' },
      { name: 'amountBDesired', internalType: 'uint256', type: 'uint256' },
      { name: 'amountAMin', internalType: 'uint256', type: 'uint256' },
      { name: 'amountBMin', internalType: 'uint256', type: 'uint256' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addLiquidity',
    outputs: [
      { name: 'amountA', internalType: 'uint256', type: 'uint256' },
      { name: 'amountB', internalType: 'uint256', type: 'uint256' },
      { name: 'liquidity', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
      { name: 'path', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'getAmountsIn',
    outputs: [
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
      { name: 'path', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'getAmountsOut',
    outputs: [
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenA', internalType: 'address', type: 'address' },
      { name: 'tokenB', internalType: 'address', type: 'address' },
    ],
    name: 'getReserves',
    outputs: [
      { name: 'reserveA', internalType: 'uint256', type: 'uint256' },
      { name: 'reserveB', internalType: 'uint256', type: 'uint256' },
      { name: 'pair', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenA', internalType: 'address', type: 'address' },
      { name: 'tokenB', internalType: 'address', type: 'address' },
      { name: 'liquidity', internalType: 'uint256', type: 'uint256' },
      { name: 'amountAMin', internalType: 'uint256', type: 'uint256' },
      { name: 'amountBMin', internalType: 'uint256', type: 'uint256' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'removeLiquidity',
    outputs: [
      { name: 'amountA', internalType: 'uint256', type: 'uint256' },
      { name: 'amountB', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
      { name: 'amountOutMin', internalType: 'uint256', type: 'uint256' },
      { name: 'path', internalType: 'address[]', type: 'address[]' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'swapExactTokensForTokens',
    outputs: [
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
      { name: 'amountInMax', internalType: 'uint256', type: 'uint256' },
      { name: 'path', internalType: 'address[]', type: 'address[]' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'swapTokensForExactTokens',
    outputs: [
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'nonpayable',
  },
] as const

/**
 *
 */
export const ammRouterAddress = {
  31337: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
} as const

/**
 *
 */
export const ammRouterConfig = {
  address: ammRouterAddress,
  abi: ammRouterAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BarToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const barTokenAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

/**
 *
 */
export const barTokenAddress = {
  31337: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
} as const

/**
 *
 */
export const barTokenConfig = {
  address: barTokenAddress,
  abi: barTokenAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20Abi = [
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FooToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const fooTokenAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

/**
 *
 */
export const fooTokenAddress = {
  31337: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
} as const

/**
 *
 */
export const fooTokenConfig = {
  address: fooTokenAddress,
  abi: fooTokenAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IAMMRouter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iammRouterAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'tokenA', internalType: 'address', type: 'address' },
      { name: 'tokenB', internalType: 'address', type: 'address' },
      { name: 'amountADesired', internalType: 'uint256', type: 'uint256' },
      { name: 'amountBDesired', internalType: 'uint256', type: 'uint256' },
      { name: 'amountAMin', internalType: 'uint256', type: 'uint256' },
      { name: 'amountBMin', internalType: 'uint256', type: 'uint256' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addLiquidity',
    outputs: [
      { name: 'amountA', internalType: 'uint256', type: 'uint256' },
      { name: 'amountB', internalType: 'uint256', type: 'uint256' },
      { name: 'liquidity', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenA', internalType: 'address', type: 'address' },
      { name: 'tokenB', internalType: 'address', type: 'address' },
    ],
    name: 'getReserves',
    outputs: [
      { name: 'reserveA', internalType: 'uint256', type: 'uint256' },
      { name: 'reserveB', internalType: 'uint256', type: 'uint256' },
      { name: 'pair', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenA', internalType: 'address', type: 'address' },
      { name: 'tokenB', internalType: 'address', type: 'address' },
      { name: 'liquidity', internalType: 'uint256', type: 'uint256' },
      { name: 'amountAMin', internalType: 'uint256', type: 'uint256' },
      { name: 'amountBMin', internalType: 'uint256', type: 'uint256' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'removeLiquidity',
    outputs: [
      { name: 'amountA', internalType: 'uint256', type: 'uint256' },
      { name: 'amountB', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
      { name: 'amountOutMin', internalType: 'uint256', type: 'uint256' },
      { name: 'path', internalType: 'address[]', type: 'address[]' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'swapExactTokensForTokens',
    outputs: [
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
      { name: 'amountInMax', internalType: 'uint256', type: 'uint256' },
      { name: 'path', internalType: 'address[]', type: 'address[]' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'swapTokensForExactTokens',
    outputs: [
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC1155Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1155ErrorsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidApprover',
  },
  {
    type: 'error',
    inputs: [
      { name: 'idsLength', internalType: 'uint256', type: 'uint256' },
      { name: 'valuesLength', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InvalidArrayLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1155MissingApprovalForAll',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20Abi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20ErrorsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Metadata
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20MetadataAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC721Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc721ErrorsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC721IncorrectOwner',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC721InsufficientApproval',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC721NonexistentToken',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IPairFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iPairFactoryAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenA',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenB',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'pair',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: '', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'PairCreated',
  },
  {
    type: 'function',
    inputs: [],
    name: 'INIT_CODE_PAIR_HASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'allPairs',
    outputs: [{ name: 'pair', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allPairsLength',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenA', internalType: 'address', type: 'address' },
      { name: 'tokenB', internalType: 'address', type: 'address' },
    ],
    name: 'createPair',
    outputs: [{ name: 'pair', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenA', internalType: 'address', type: 'address' },
      { name: 'tokenB', internalType: 'address', type: 'address' },
    ],
    name: 'getPair',
    outputs: [{ name: 'pair', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rewardTo',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'setRewardTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ITokenPair
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iTokenPairAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountA',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountB',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'Burn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountA',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountB',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Mint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountAIn',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountBIn',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountAOut',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountBOut',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'Swap',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'reserveA',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reserveB',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Sync',
  },
  {
    type: 'function',
    inputs: [{ name: 'to', internalType: 'address', type: 'address' }],
    name: 'burn',
    outputs: [
      { name: 'amountA', internalType: 'uint256', type: 'uint256' },
      { name: 'amountB', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getReserves',
    outputs: [
      { name: 'reserveA', internalType: 'uint256', type: 'uint256' },
      { name: 'reserveB', internalType: 'uint256', type: 'uint256' },
      { name: 'blockTimestampLast', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'kLast',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'to', internalType: 'address', type: 'address' }],
    name: 'mint',
    outputs: [{ name: 'liquidity', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'to', internalType: 'address', type: 'address' }],
    name: 'skim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amountAOut', internalType: 'uint256', type: 'uint256' },
      { name: 'amountBOut', internalType: 'uint256', type: 'uint256' },
      { name: 'to', internalType: 'address', type: 'address' },
    ],
    name: 'swap',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sync',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tokenA',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tokenB',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Lock
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const lockAbi = [
  {
    type: 'constructor',
    inputs: [{ name: '_unlockTime', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'when',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Withdrawal',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address payable', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unlockTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Math
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mathAbi = [
  { type: 'error', inputs: [], name: 'MathOverflowedMulDiv' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MemeToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const memeTokenAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

/**
 *
 */
export const memeTokenAddress = {
  31337: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
} as const

/**
 *
 */
export const memeTokenConfig = {
  address: memeTokenAddress,
  abi: memeTokenAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Ownable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ownableAbi = [
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PairFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const pairFactoryAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenA',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenB',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'pair',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: '', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'PairCreated',
  },
  {
    type: 'function',
    inputs: [],
    name: 'INIT_CODE_PAIR_HASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'allPairs',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allPairsLength',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenA', internalType: 'address', type: 'address' },
      { name: 'tokenB', internalType: 'address', type: 'address' },
    ],
    name: 'createPair',
    outputs: [{ name: 'pair', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'getPair',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenA', internalType: 'address', type: 'address' },
      { name: 'tokenB', internalType: 'address', type: 'address' },
    ],
    name: 'pairFor',
    outputs: [{ name: 'pair', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rewardTo',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_rewardTo', internalType: 'address', type: 'address' }],
    name: 'setRewardTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

/**
 *
 */
export const pairFactoryAddress = {
  31337: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
} as const

/**
 *
 */
export const pairFactoryConfig = {
  address: pairFactoryAddress,
  abi: pairFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ReentrancyGuard
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const reentrancyGuardAbi = [
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SimpleDeFiToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const simpleDeFiTokenAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferWithAutoBurn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

/**
 *
 */
export const simpleDeFiTokenAddress = {
  31337: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
} as const

/**
 *
 */
export const simpleDeFiTokenConfig = {
  address: simpleDeFiTokenAddress,
  abi: simpleDeFiTokenAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TokenPair
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tokenPairAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountA',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountB',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'Burn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountA',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountB',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Mint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountAIn',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountBIn',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountAOut',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountBOut',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'Swap',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'reserveA',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reserveB',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Sync',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MINIMUM_LIQUIDITY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'to', internalType: 'address', type: 'address' }],
    name: 'burn',
    outputs: [
      { name: 'amountA', internalType: 'uint256', type: 'uint256' },
      { name: 'amountB', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getReserves',
    outputs: [
      { name: '_reserveA', internalType: 'uint256', type: 'uint256' },
      { name: '_reserveB', internalType: 'uint256', type: 'uint256' },
      { name: '_blockTimestampLast', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenA', internalType: 'address', type: 'address' },
      { name: '_tokenB', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'kLast',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'to', internalType: 'address', type: 'address' }],
    name: 'mint',
    outputs: [{ name: 'liquidity', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'to', internalType: 'address', type: 'address' }],
    name: 'skim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amountAOut', internalType: 'uint256', type: 'uint256' },
      { name: 'amountBOut', internalType: 'uint256', type: 'uint256' },
      { name: 'to', internalType: 'address', type: 'address' },
    ],
    name: 'swap',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sync',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tokenA',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tokenB',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ammRouterAbi}__
 *
 *
 */
export const useReadAmmRouter = /*#__PURE__*/ createUseReadContract({
  abi: ammRouterAbi,
  address: ammRouterAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ammRouterAbi}__ and `functionName` set to `"factory"`
 *
 *
 */
export const useReadAmmRouterFactory = /*#__PURE__*/ createUseReadContract({
  abi: ammRouterAbi,
  address: ammRouterAddress,
  functionName: 'factory',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ammRouterAbi}__ and `functionName` set to `"getAmountsIn"`
 *
 *
 */
export const useReadAmmRouterGetAmountsIn = /*#__PURE__*/ createUseReadContract(
  {
    abi: ammRouterAbi,
    address: ammRouterAddress,
    functionName: 'getAmountsIn',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ammRouterAbi}__ and `functionName` set to `"getAmountsOut"`
 *
 *
 */
export const useReadAmmRouterGetAmountsOut =
  /*#__PURE__*/ createUseReadContract({
    abi: ammRouterAbi,
    address: ammRouterAddress,
    functionName: 'getAmountsOut',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ammRouterAbi}__ and `functionName` set to `"getReserves"`
 *
 *
 */
export const useReadAmmRouterGetReserves = /*#__PURE__*/ createUseReadContract({
  abi: ammRouterAbi,
  address: ammRouterAddress,
  functionName: 'getReserves',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ammRouterAbi}__
 *
 *
 */
export const useWriteAmmRouter = /*#__PURE__*/ createUseWriteContract({
  abi: ammRouterAbi,
  address: ammRouterAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ammRouterAbi}__ and `functionName` set to `"addLiquidity"`
 *
 *
 */
export const useWriteAmmRouterAddLiquidity =
  /*#__PURE__*/ createUseWriteContract({
    abi: ammRouterAbi,
    address: ammRouterAddress,
    functionName: 'addLiquidity',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ammRouterAbi}__ and `functionName` set to `"removeLiquidity"`
 *
 *
 */
export const useWriteAmmRouterRemoveLiquidity =
  /*#__PURE__*/ createUseWriteContract({
    abi: ammRouterAbi,
    address: ammRouterAddress,
    functionName: 'removeLiquidity',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ammRouterAbi}__ and `functionName` set to `"swapExactTokensForTokens"`
 *
 *
 */
export const useWriteAmmRouterSwapExactTokensForTokens =
  /*#__PURE__*/ createUseWriteContract({
    abi: ammRouterAbi,
    address: ammRouterAddress,
    functionName: 'swapExactTokensForTokens',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ammRouterAbi}__ and `functionName` set to `"swapTokensForExactTokens"`
 *
 *
 */
export const useWriteAmmRouterSwapTokensForExactTokens =
  /*#__PURE__*/ createUseWriteContract({
    abi: ammRouterAbi,
    address: ammRouterAddress,
    functionName: 'swapTokensForExactTokens',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ammRouterAbi}__
 *
 *
 */
export const useSimulateAmmRouter = /*#__PURE__*/ createUseSimulateContract({
  abi: ammRouterAbi,
  address: ammRouterAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ammRouterAbi}__ and `functionName` set to `"addLiquidity"`
 *
 *
 */
export const useSimulateAmmRouterAddLiquidity =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ammRouterAbi,
    address: ammRouterAddress,
    functionName: 'addLiquidity',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ammRouterAbi}__ and `functionName` set to `"removeLiquidity"`
 *
 *
 */
export const useSimulateAmmRouterRemoveLiquidity =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ammRouterAbi,
    address: ammRouterAddress,
    functionName: 'removeLiquidity',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ammRouterAbi}__ and `functionName` set to `"swapExactTokensForTokens"`
 *
 *
 */
export const useSimulateAmmRouterSwapExactTokensForTokens =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ammRouterAbi,
    address: ammRouterAddress,
    functionName: 'swapExactTokensForTokens',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ammRouterAbi}__ and `functionName` set to `"swapTokensForExactTokens"`
 *
 *
 */
export const useSimulateAmmRouterSwapTokensForExactTokens =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ammRouterAbi,
    address: ammRouterAddress,
    functionName: 'swapTokensForExactTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link barTokenAbi}__
 *
 *
 */
export const useReadBarToken = /*#__PURE__*/ createUseReadContract({
  abi: barTokenAbi,
  address: barTokenAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link barTokenAbi}__ and `functionName` set to `"allowance"`
 *
 *
 */
export const useReadBarTokenAllowance = /*#__PURE__*/ createUseReadContract({
  abi: barTokenAbi,
  address: barTokenAddress,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link barTokenAbi}__ and `functionName` set to `"balanceOf"`
 *
 *
 */
export const useReadBarTokenBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: barTokenAbi,
  address: barTokenAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link barTokenAbi}__ and `functionName` set to `"decimals"`
 *
 *
 */
export const useReadBarTokenDecimals = /*#__PURE__*/ createUseReadContract({
  abi: barTokenAbi,
  address: barTokenAddress,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link barTokenAbi}__ and `functionName` set to `"name"`
 *
 *
 */
export const useReadBarTokenName = /*#__PURE__*/ createUseReadContract({
  abi: barTokenAbi,
  address: barTokenAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link barTokenAbi}__ and `functionName` set to `"symbol"`
 *
 *
 */
export const useReadBarTokenSymbol = /*#__PURE__*/ createUseReadContract({
  abi: barTokenAbi,
  address: barTokenAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link barTokenAbi}__ and `functionName` set to `"totalSupply"`
 *
 *
 */
export const useReadBarTokenTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: barTokenAbi,
  address: barTokenAddress,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link barTokenAbi}__
 *
 *
 */
export const useWriteBarToken = /*#__PURE__*/ createUseWriteContract({
  abi: barTokenAbi,
  address: barTokenAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link barTokenAbi}__ and `functionName` set to `"approve"`
 *
 *
 */
export const useWriteBarTokenApprove = /*#__PURE__*/ createUseWriteContract({
  abi: barTokenAbi,
  address: barTokenAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link barTokenAbi}__ and `functionName` set to `"transfer"`
 *
 *
 */
export const useWriteBarTokenTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: barTokenAbi,
  address: barTokenAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link barTokenAbi}__ and `functionName` set to `"transferFrom"`
 *
 *
 */
export const useWriteBarTokenTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: barTokenAbi,
    address: barTokenAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link barTokenAbi}__
 *
 *
 */
export const useSimulateBarToken = /*#__PURE__*/ createUseSimulateContract({
  abi: barTokenAbi,
  address: barTokenAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link barTokenAbi}__ and `functionName` set to `"approve"`
 *
 *
 */
export const useSimulateBarTokenApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: barTokenAbi,
    address: barTokenAddress,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link barTokenAbi}__ and `functionName` set to `"transfer"`
 *
 *
 */
export const useSimulateBarTokenTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: barTokenAbi,
    address: barTokenAddress,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link barTokenAbi}__ and `functionName` set to `"transferFrom"`
 *
 *
 */
export const useSimulateBarTokenTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: barTokenAbi,
    address: barTokenAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link barTokenAbi}__
 *
 *
 */
export const useWatchBarTokenEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: barTokenAbi,
  address: barTokenAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link barTokenAbi}__ and `eventName` set to `"Approval"`
 *
 *
 */
export const useWatchBarTokenApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: barTokenAbi,
    address: barTokenAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link barTokenAbi}__ and `eventName` set to `"Transfer"`
 *
 *
 */
export const useWatchBarTokenTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: barTokenAbi,
    address: barTokenAddress,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useReadErc20 = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"allowance"`
 */
export const useReadErc20Allowance = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadErc20BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"decimals"`
 */
export const useReadErc20Decimals = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"name"`
 */
export const useReadErc20Name = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"symbol"`
 */
export const useReadErc20Symbol = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadErc20TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useWriteErc20 = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteErc20Approve = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useWriteErc20Transfer = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteErc20TransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useSimulateErc20 = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateErc20Approve = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateErc20Transfer = /*#__PURE__*/ createUseSimulateContract(
  { abi: erc20Abi, functionName: 'transfer' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateErc20TransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__
 */
export const useWatchErc20Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchErc20ApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20Abi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchErc20TransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20Abi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fooTokenAbi}__
 *
 *
 */
export const useReadFooToken = /*#__PURE__*/ createUseReadContract({
  abi: fooTokenAbi,
  address: fooTokenAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fooTokenAbi}__ and `functionName` set to `"allowance"`
 *
 *
 */
export const useReadFooTokenAllowance = /*#__PURE__*/ createUseReadContract({
  abi: fooTokenAbi,
  address: fooTokenAddress,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fooTokenAbi}__ and `functionName` set to `"balanceOf"`
 *
 *
 */
export const useReadFooTokenBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: fooTokenAbi,
  address: fooTokenAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fooTokenAbi}__ and `functionName` set to `"decimals"`
 *
 *
 */
export const useReadFooTokenDecimals = /*#__PURE__*/ createUseReadContract({
  abi: fooTokenAbi,
  address: fooTokenAddress,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fooTokenAbi}__ and `functionName` set to `"name"`
 *
 *
 */
export const useReadFooTokenName = /*#__PURE__*/ createUseReadContract({
  abi: fooTokenAbi,
  address: fooTokenAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fooTokenAbi}__ and `functionName` set to `"symbol"`
 *
 *
 */
export const useReadFooTokenSymbol = /*#__PURE__*/ createUseReadContract({
  abi: fooTokenAbi,
  address: fooTokenAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fooTokenAbi}__ and `functionName` set to `"totalSupply"`
 *
 *
 */
export const useReadFooTokenTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: fooTokenAbi,
  address: fooTokenAddress,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fooTokenAbi}__
 *
 *
 */
export const useWriteFooToken = /*#__PURE__*/ createUseWriteContract({
  abi: fooTokenAbi,
  address: fooTokenAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fooTokenAbi}__ and `functionName` set to `"approve"`
 *
 *
 */
export const useWriteFooTokenApprove = /*#__PURE__*/ createUseWriteContract({
  abi: fooTokenAbi,
  address: fooTokenAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fooTokenAbi}__ and `functionName` set to `"transfer"`
 *
 *
 */
export const useWriteFooTokenTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: fooTokenAbi,
  address: fooTokenAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fooTokenAbi}__ and `functionName` set to `"transferFrom"`
 *
 *
 */
export const useWriteFooTokenTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: fooTokenAbi,
    address: fooTokenAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fooTokenAbi}__
 *
 *
 */
export const useSimulateFooToken = /*#__PURE__*/ createUseSimulateContract({
  abi: fooTokenAbi,
  address: fooTokenAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fooTokenAbi}__ and `functionName` set to `"approve"`
 *
 *
 */
export const useSimulateFooTokenApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fooTokenAbi,
    address: fooTokenAddress,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fooTokenAbi}__ and `functionName` set to `"transfer"`
 *
 *
 */
export const useSimulateFooTokenTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fooTokenAbi,
    address: fooTokenAddress,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fooTokenAbi}__ and `functionName` set to `"transferFrom"`
 *
 *
 */
export const useSimulateFooTokenTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fooTokenAbi,
    address: fooTokenAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fooTokenAbi}__
 *
 *
 */
export const useWatchFooTokenEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: fooTokenAbi,
  address: fooTokenAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fooTokenAbi}__ and `eventName` set to `"Approval"`
 *
 *
 */
export const useWatchFooTokenApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fooTokenAbi,
    address: fooTokenAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fooTokenAbi}__ and `eventName` set to `"Transfer"`
 *
 *
 */
export const useWatchFooTokenTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fooTokenAbi,
    address: fooTokenAddress,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iammRouterAbi}__
 */
export const useReadIammRouter = /*#__PURE__*/ createUseReadContract({
  abi: iammRouterAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iammRouterAbi}__ and `functionName` set to `"factory"`
 */
export const useReadIammRouterFactory = /*#__PURE__*/ createUseReadContract({
  abi: iammRouterAbi,
  functionName: 'factory',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iammRouterAbi}__ and `functionName` set to `"getReserves"`
 */
export const useReadIammRouterGetReserves = /*#__PURE__*/ createUseReadContract(
  { abi: iammRouterAbi, functionName: 'getReserves' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iammRouterAbi}__
 */
export const useWriteIammRouter = /*#__PURE__*/ createUseWriteContract({
  abi: iammRouterAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iammRouterAbi}__ and `functionName` set to `"addLiquidity"`
 */
export const useWriteIammRouterAddLiquidity =
  /*#__PURE__*/ createUseWriteContract({
    abi: iammRouterAbi,
    functionName: 'addLiquidity',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iammRouterAbi}__ and `functionName` set to `"removeLiquidity"`
 */
export const useWriteIammRouterRemoveLiquidity =
  /*#__PURE__*/ createUseWriteContract({
    abi: iammRouterAbi,
    functionName: 'removeLiquidity',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iammRouterAbi}__ and `functionName` set to `"swapExactTokensForTokens"`
 */
export const useWriteIammRouterSwapExactTokensForTokens =
  /*#__PURE__*/ createUseWriteContract({
    abi: iammRouterAbi,
    functionName: 'swapExactTokensForTokens',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iammRouterAbi}__ and `functionName` set to `"swapTokensForExactTokens"`
 */
export const useWriteIammRouterSwapTokensForExactTokens =
  /*#__PURE__*/ createUseWriteContract({
    abi: iammRouterAbi,
    functionName: 'swapTokensForExactTokens',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iammRouterAbi}__
 */
export const useSimulateIammRouter = /*#__PURE__*/ createUseSimulateContract({
  abi: iammRouterAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iammRouterAbi}__ and `functionName` set to `"addLiquidity"`
 */
export const useSimulateIammRouterAddLiquidity =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iammRouterAbi,
    functionName: 'addLiquidity',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iammRouterAbi}__ and `functionName` set to `"removeLiquidity"`
 */
export const useSimulateIammRouterRemoveLiquidity =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iammRouterAbi,
    functionName: 'removeLiquidity',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iammRouterAbi}__ and `functionName` set to `"swapExactTokensForTokens"`
 */
export const useSimulateIammRouterSwapExactTokensForTokens =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iammRouterAbi,
    functionName: 'swapExactTokensForTokens',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iammRouterAbi}__ and `functionName` set to `"swapTokensForExactTokens"`
 */
export const useSimulateIammRouterSwapTokensForExactTokens =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iammRouterAbi,
    functionName: 'swapTokensForExactTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20Abi}__
 */
export const useReadIerc20 = /*#__PURE__*/ createUseReadContract({
  abi: ierc20Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"allowance"`
 */
export const useReadIerc20Allowance = /*#__PURE__*/ createUseReadContract({
  abi: ierc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadIerc20BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: ierc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadIerc20TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: ierc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20Abi}__
 */
export const useWriteIerc20 = /*#__PURE__*/ createUseWriteContract({
  abi: ierc20Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteIerc20Approve = /*#__PURE__*/ createUseWriteContract({
  abi: ierc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useWriteIerc20Transfer = /*#__PURE__*/ createUseWriteContract({
  abi: ierc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteIerc20TransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: ierc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20Abi}__
 */
export const useSimulateIerc20 = /*#__PURE__*/ createUseSimulateContract({
  abi: ierc20Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateIerc20Approve = /*#__PURE__*/ createUseSimulateContract(
  { abi: ierc20Abi, functionName: 'approve' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateIerc20Transfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20Abi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateIerc20TransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc20Abi}__
 */
export const useWatchIerc20Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ierc20Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc20Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchIerc20ApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc20Abi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchIerc20TransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc20Abi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__
 */
export const useReadIerc20Metadata = /*#__PURE__*/ createUseReadContract({
  abi: ierc20MetadataAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadIerc20MetadataAllowance =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc20MetadataAbi,
    functionName: 'allowance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadIerc20MetadataBalanceOf =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc20MetadataAbi,
    functionName: 'balanceOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadIerc20MetadataDecimals =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc20MetadataAbi,
    functionName: 'decimals',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"name"`
 */
export const useReadIerc20MetadataName = /*#__PURE__*/ createUseReadContract({
  abi: ierc20MetadataAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadIerc20MetadataSymbol = /*#__PURE__*/ createUseReadContract({
  abi: ierc20MetadataAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadIerc20MetadataTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc20MetadataAbi,
    functionName: 'totalSupply',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20MetadataAbi}__
 */
export const useWriteIerc20Metadata = /*#__PURE__*/ createUseWriteContract({
  abi: ierc20MetadataAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteIerc20MetadataApprove =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc20MetadataAbi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteIerc20MetadataTransfer =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc20MetadataAbi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteIerc20MetadataTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc20MetadataAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20MetadataAbi}__
 */
export const useSimulateIerc20Metadata =
  /*#__PURE__*/ createUseSimulateContract({ abi: ierc20MetadataAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateIerc20MetadataApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20MetadataAbi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateIerc20MetadataTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20MetadataAbi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateIerc20MetadataTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20MetadataAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc20MetadataAbi}__
 */
export const useWatchIerc20MetadataEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: ierc20MetadataAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchIerc20MetadataApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc20MetadataAbi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchIerc20MetadataTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc20MetadataAbi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iPairFactoryAbi}__
 */
export const useReadIPairFactory = /*#__PURE__*/ createUseReadContract({
  abi: iPairFactoryAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iPairFactoryAbi}__ and `functionName` set to `"INIT_CODE_PAIR_HASH"`
 */
export const useReadIPairFactoryInitCodePairHash =
  /*#__PURE__*/ createUseReadContract({
    abi: iPairFactoryAbi,
    functionName: 'INIT_CODE_PAIR_HASH',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iPairFactoryAbi}__ and `functionName` set to `"allPairs"`
 */
export const useReadIPairFactoryAllPairs = /*#__PURE__*/ createUseReadContract({
  abi: iPairFactoryAbi,
  functionName: 'allPairs',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iPairFactoryAbi}__ and `functionName` set to `"allPairsLength"`
 */
export const useReadIPairFactoryAllPairsLength =
  /*#__PURE__*/ createUseReadContract({
    abi: iPairFactoryAbi,
    functionName: 'allPairsLength',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iPairFactoryAbi}__ and `functionName` set to `"getPair"`
 */
export const useReadIPairFactoryGetPair = /*#__PURE__*/ createUseReadContract({
  abi: iPairFactoryAbi,
  functionName: 'getPair',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iPairFactoryAbi}__ and `functionName` set to `"rewardTo"`
 */
export const useReadIPairFactoryRewardTo = /*#__PURE__*/ createUseReadContract({
  abi: iPairFactoryAbi,
  functionName: 'rewardTo',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iPairFactoryAbi}__
 */
export const useWriteIPairFactory = /*#__PURE__*/ createUseWriteContract({
  abi: iPairFactoryAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iPairFactoryAbi}__ and `functionName` set to `"createPair"`
 */
export const useWriteIPairFactoryCreatePair =
  /*#__PURE__*/ createUseWriteContract({
    abi: iPairFactoryAbi,
    functionName: 'createPair',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iPairFactoryAbi}__ and `functionName` set to `"setRewardTo"`
 */
export const useWriteIPairFactorySetRewardTo =
  /*#__PURE__*/ createUseWriteContract({
    abi: iPairFactoryAbi,
    functionName: 'setRewardTo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iPairFactoryAbi}__
 */
export const useSimulateIPairFactory = /*#__PURE__*/ createUseSimulateContract({
  abi: iPairFactoryAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iPairFactoryAbi}__ and `functionName` set to `"createPair"`
 */
export const useSimulateIPairFactoryCreatePair =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iPairFactoryAbi,
    functionName: 'createPair',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iPairFactoryAbi}__ and `functionName` set to `"setRewardTo"`
 */
export const useSimulateIPairFactorySetRewardTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iPairFactoryAbi,
    functionName: 'setRewardTo',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iPairFactoryAbi}__
 */
export const useWatchIPairFactoryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: iPairFactoryAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iPairFactoryAbi}__ and `eventName` set to `"PairCreated"`
 */
export const useWatchIPairFactoryPairCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iPairFactoryAbi,
    eventName: 'PairCreated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iTokenPairAbi}__
 */
export const useReadITokenPair = /*#__PURE__*/ createUseReadContract({
  abi: iTokenPairAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iTokenPairAbi}__ and `functionName` set to `"factory"`
 */
export const useReadITokenPairFactory = /*#__PURE__*/ createUseReadContract({
  abi: iTokenPairAbi,
  functionName: 'factory',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iTokenPairAbi}__ and `functionName` set to `"getReserves"`
 */
export const useReadITokenPairGetReserves = /*#__PURE__*/ createUseReadContract(
  { abi: iTokenPairAbi, functionName: 'getReserves' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iTokenPairAbi}__ and `functionName` set to `"kLast"`
 */
export const useReadITokenPairKLast = /*#__PURE__*/ createUseReadContract({
  abi: iTokenPairAbi,
  functionName: 'kLast',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iTokenPairAbi}__ and `functionName` set to `"tokenA"`
 */
export const useReadITokenPairTokenA = /*#__PURE__*/ createUseReadContract({
  abi: iTokenPairAbi,
  functionName: 'tokenA',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iTokenPairAbi}__ and `functionName` set to `"tokenB"`
 */
export const useReadITokenPairTokenB = /*#__PURE__*/ createUseReadContract({
  abi: iTokenPairAbi,
  functionName: 'tokenB',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTokenPairAbi}__
 */
export const useWriteITokenPair = /*#__PURE__*/ createUseWriteContract({
  abi: iTokenPairAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTokenPairAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteITokenPairBurn = /*#__PURE__*/ createUseWriteContract({
  abi: iTokenPairAbi,
  functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTokenPairAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteITokenPairInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: iTokenPairAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTokenPairAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteITokenPairMint = /*#__PURE__*/ createUseWriteContract({
  abi: iTokenPairAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTokenPairAbi}__ and `functionName` set to `"skim"`
 */
export const useWriteITokenPairSkim = /*#__PURE__*/ createUseWriteContract({
  abi: iTokenPairAbi,
  functionName: 'skim',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTokenPairAbi}__ and `functionName` set to `"swap"`
 */
export const useWriteITokenPairSwap = /*#__PURE__*/ createUseWriteContract({
  abi: iTokenPairAbi,
  functionName: 'swap',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTokenPairAbi}__ and `functionName` set to `"sync"`
 */
export const useWriteITokenPairSync = /*#__PURE__*/ createUseWriteContract({
  abi: iTokenPairAbi,
  functionName: 'sync',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTokenPairAbi}__
 */
export const useSimulateITokenPair = /*#__PURE__*/ createUseSimulateContract({
  abi: iTokenPairAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTokenPairAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateITokenPairBurn =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iTokenPairAbi,
    functionName: 'burn',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTokenPairAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateITokenPairInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iTokenPairAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTokenPairAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateITokenPairMint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iTokenPairAbi,
    functionName: 'mint',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTokenPairAbi}__ and `functionName` set to `"skim"`
 */
export const useSimulateITokenPairSkim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iTokenPairAbi,
    functionName: 'skim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTokenPairAbi}__ and `functionName` set to `"swap"`
 */
export const useSimulateITokenPairSwap =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iTokenPairAbi,
    functionName: 'swap',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTokenPairAbi}__ and `functionName` set to `"sync"`
 */
export const useSimulateITokenPairSync =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iTokenPairAbi,
    functionName: 'sync',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTokenPairAbi}__
 */
export const useWatchITokenPairEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: iTokenPairAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTokenPairAbi}__ and `eventName` set to `"Burn"`
 */
export const useWatchITokenPairBurnEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTokenPairAbi,
    eventName: 'Burn',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTokenPairAbi}__ and `eventName` set to `"Mint"`
 */
export const useWatchITokenPairMintEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTokenPairAbi,
    eventName: 'Mint',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTokenPairAbi}__ and `eventName` set to `"Swap"`
 */
export const useWatchITokenPairSwapEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTokenPairAbi,
    eventName: 'Swap',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTokenPairAbi}__ and `eventName` set to `"Sync"`
 */
export const useWatchITokenPairSyncEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTokenPairAbi,
    eventName: 'Sync',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lockAbi}__
 */
export const useReadLock = /*#__PURE__*/ createUseReadContract({ abi: lockAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lockAbi}__ and `functionName` set to `"owner"`
 */
export const useReadLockOwner = /*#__PURE__*/ createUseReadContract({
  abi: lockAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lockAbi}__ and `functionName` set to `"unlockTime"`
 */
export const useReadLockUnlockTime = /*#__PURE__*/ createUseReadContract({
  abi: lockAbi,
  functionName: 'unlockTime',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lockAbi}__
 */
export const useWriteLock = /*#__PURE__*/ createUseWriteContract({
  abi: lockAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lockAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteLockWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: lockAbi,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lockAbi}__
 */
export const useSimulateLock = /*#__PURE__*/ createUseSimulateContract({
  abi: lockAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lockAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateLockWithdraw = /*#__PURE__*/ createUseSimulateContract({
  abi: lockAbi,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lockAbi}__
 */
export const useWatchLockEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: lockAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lockAbi}__ and `eventName` set to `"Withdrawal"`
 */
export const useWatchLockWithdrawalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lockAbi,
    eventName: 'Withdrawal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link memeTokenAbi}__
 *
 *
 */
export const useReadMemeToken = /*#__PURE__*/ createUseReadContract({
  abi: memeTokenAbi,
  address: memeTokenAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link memeTokenAbi}__ and `functionName` set to `"allowance"`
 *
 *
 */
export const useReadMemeTokenAllowance = /*#__PURE__*/ createUseReadContract({
  abi: memeTokenAbi,
  address: memeTokenAddress,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link memeTokenAbi}__ and `functionName` set to `"balanceOf"`
 *
 *
 */
export const useReadMemeTokenBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: memeTokenAbi,
  address: memeTokenAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link memeTokenAbi}__ and `functionName` set to `"decimals"`
 *
 *
 */
export const useReadMemeTokenDecimals = /*#__PURE__*/ createUseReadContract({
  abi: memeTokenAbi,
  address: memeTokenAddress,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link memeTokenAbi}__ and `functionName` set to `"name"`
 *
 *
 */
export const useReadMemeTokenName = /*#__PURE__*/ createUseReadContract({
  abi: memeTokenAbi,
  address: memeTokenAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link memeTokenAbi}__ and `functionName` set to `"symbol"`
 *
 *
 */
export const useReadMemeTokenSymbol = /*#__PURE__*/ createUseReadContract({
  abi: memeTokenAbi,
  address: memeTokenAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link memeTokenAbi}__ and `functionName` set to `"totalSupply"`
 *
 *
 */
export const useReadMemeTokenTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: memeTokenAbi,
  address: memeTokenAddress,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link memeTokenAbi}__
 *
 *
 */
export const useWriteMemeToken = /*#__PURE__*/ createUseWriteContract({
  abi: memeTokenAbi,
  address: memeTokenAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link memeTokenAbi}__ and `functionName` set to `"approve"`
 *
 *
 */
export const useWriteMemeTokenApprove = /*#__PURE__*/ createUseWriteContract({
  abi: memeTokenAbi,
  address: memeTokenAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link memeTokenAbi}__ and `functionName` set to `"transfer"`
 *
 *
 */
export const useWriteMemeTokenTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: memeTokenAbi,
  address: memeTokenAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link memeTokenAbi}__ and `functionName` set to `"transferFrom"`
 *
 *
 */
export const useWriteMemeTokenTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: memeTokenAbi,
    address: memeTokenAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link memeTokenAbi}__
 *
 *
 */
export const useSimulateMemeToken = /*#__PURE__*/ createUseSimulateContract({
  abi: memeTokenAbi,
  address: memeTokenAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link memeTokenAbi}__ and `functionName` set to `"approve"`
 *
 *
 */
export const useSimulateMemeTokenApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: memeTokenAbi,
    address: memeTokenAddress,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link memeTokenAbi}__ and `functionName` set to `"transfer"`
 *
 *
 */
export const useSimulateMemeTokenTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: memeTokenAbi,
    address: memeTokenAddress,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link memeTokenAbi}__ and `functionName` set to `"transferFrom"`
 *
 *
 */
export const useSimulateMemeTokenTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: memeTokenAbi,
    address: memeTokenAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link memeTokenAbi}__
 *
 *
 */
export const useWatchMemeTokenEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: memeTokenAbi, address: memeTokenAddress },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link memeTokenAbi}__ and `eventName` set to `"Approval"`
 *
 *
 */
export const useWatchMemeTokenApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: memeTokenAbi,
    address: memeTokenAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link memeTokenAbi}__ and `eventName` set to `"Transfer"`
 *
 *
 */
export const useWatchMemeTokenTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: memeTokenAbi,
    address: memeTokenAddress,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ownableAbi}__
 */
export const useReadOwnable = /*#__PURE__*/ createUseReadContract({
  abi: ownableAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"owner"`
 */
export const useReadOwnableOwner = /*#__PURE__*/ createUseReadContract({
  abi: ownableAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableAbi}__
 */
export const useWriteOwnable = /*#__PURE__*/ createUseWriteContract({
  abi: ownableAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteOwnableRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ownableAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteOwnableTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ownableAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableAbi}__
 */
export const useSimulateOwnable = /*#__PURE__*/ createUseSimulateContract({
  abi: ownableAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateOwnableRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ownableAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateOwnableTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ownableAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ownableAbi}__
 */
export const useWatchOwnableEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ownableAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ownableAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchOwnableOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ownableAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pairFactoryAbi}__
 *
 *
 */
export const useReadPairFactory = /*#__PURE__*/ createUseReadContract({
  abi: pairFactoryAbi,
  address: pairFactoryAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pairFactoryAbi}__ and `functionName` set to `"INIT_CODE_PAIR_HASH"`
 *
 *
 */
export const useReadPairFactoryInitCodePairHash =
  /*#__PURE__*/ createUseReadContract({
    abi: pairFactoryAbi,
    address: pairFactoryAddress,
    functionName: 'INIT_CODE_PAIR_HASH',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pairFactoryAbi}__ and `functionName` set to `"allPairs"`
 *
 *
 */
export const useReadPairFactoryAllPairs = /*#__PURE__*/ createUseReadContract({
  abi: pairFactoryAbi,
  address: pairFactoryAddress,
  functionName: 'allPairs',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pairFactoryAbi}__ and `functionName` set to `"allPairsLength"`
 *
 *
 */
export const useReadPairFactoryAllPairsLength =
  /*#__PURE__*/ createUseReadContract({
    abi: pairFactoryAbi,
    address: pairFactoryAddress,
    functionName: 'allPairsLength',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pairFactoryAbi}__ and `functionName` set to `"getPair"`
 *
 *
 */
export const useReadPairFactoryGetPair = /*#__PURE__*/ createUseReadContract({
  abi: pairFactoryAbi,
  address: pairFactoryAddress,
  functionName: 'getPair',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pairFactoryAbi}__ and `functionName` set to `"owner"`
 *
 *
 */
export const useReadPairFactoryOwner = /*#__PURE__*/ createUseReadContract({
  abi: pairFactoryAbi,
  address: pairFactoryAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pairFactoryAbi}__ and `functionName` set to `"pairFor"`
 *
 *
 */
export const useReadPairFactoryPairFor = /*#__PURE__*/ createUseReadContract({
  abi: pairFactoryAbi,
  address: pairFactoryAddress,
  functionName: 'pairFor',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pairFactoryAbi}__ and `functionName` set to `"rewardTo"`
 *
 *
 */
export const useReadPairFactoryRewardTo = /*#__PURE__*/ createUseReadContract({
  abi: pairFactoryAbi,
  address: pairFactoryAddress,
  functionName: 'rewardTo',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pairFactoryAbi}__
 *
 *
 */
export const useWritePairFactory = /*#__PURE__*/ createUseWriteContract({
  abi: pairFactoryAbi,
  address: pairFactoryAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pairFactoryAbi}__ and `functionName` set to `"createPair"`
 *
 *
 */
export const useWritePairFactoryCreatePair =
  /*#__PURE__*/ createUseWriteContract({
    abi: pairFactoryAbi,
    address: pairFactoryAddress,
    functionName: 'createPair',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pairFactoryAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 *
 */
export const useWritePairFactoryRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: pairFactoryAbi,
    address: pairFactoryAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pairFactoryAbi}__ and `functionName` set to `"setRewardTo"`
 *
 *
 */
export const useWritePairFactorySetRewardTo =
  /*#__PURE__*/ createUseWriteContract({
    abi: pairFactoryAbi,
    address: pairFactoryAddress,
    functionName: 'setRewardTo',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pairFactoryAbi}__ and `functionName` set to `"transferOwnership"`
 *
 *
 */
export const useWritePairFactoryTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: pairFactoryAbi,
    address: pairFactoryAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pairFactoryAbi}__
 *
 *
 */
export const useSimulatePairFactory = /*#__PURE__*/ createUseSimulateContract({
  abi: pairFactoryAbi,
  address: pairFactoryAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pairFactoryAbi}__ and `functionName` set to `"createPair"`
 *
 *
 */
export const useSimulatePairFactoryCreatePair =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pairFactoryAbi,
    address: pairFactoryAddress,
    functionName: 'createPair',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pairFactoryAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 *
 */
export const useSimulatePairFactoryRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pairFactoryAbi,
    address: pairFactoryAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pairFactoryAbi}__ and `functionName` set to `"setRewardTo"`
 *
 *
 */
export const useSimulatePairFactorySetRewardTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pairFactoryAbi,
    address: pairFactoryAddress,
    functionName: 'setRewardTo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pairFactoryAbi}__ and `functionName` set to `"transferOwnership"`
 *
 *
 */
export const useSimulatePairFactoryTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pairFactoryAbi,
    address: pairFactoryAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link pairFactoryAbi}__
 *
 *
 */
export const useWatchPairFactoryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: pairFactoryAbi,
    address: pairFactoryAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link pairFactoryAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 *
 */
export const useWatchPairFactoryOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: pairFactoryAbi,
    address: pairFactoryAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link pairFactoryAbi}__ and `eventName` set to `"PairCreated"`
 *
 *
 */
export const useWatchPairFactoryPairCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: pairFactoryAbi,
    address: pairFactoryAddress,
    eventName: 'PairCreated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleDeFiTokenAbi}__
 *
 *
 */
export const useReadSimpleDeFiToken = /*#__PURE__*/ createUseReadContract({
  abi: simpleDeFiTokenAbi,
  address: simpleDeFiTokenAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleDeFiTokenAbi}__ and `functionName` set to `"allowance"`
 *
 *
 */
export const useReadSimpleDeFiTokenAllowance =
  /*#__PURE__*/ createUseReadContract({
    abi: simpleDeFiTokenAbi,
    address: simpleDeFiTokenAddress,
    functionName: 'allowance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleDeFiTokenAbi}__ and `functionName` set to `"balanceOf"`
 *
 *
 */
export const useReadSimpleDeFiTokenBalanceOf =
  /*#__PURE__*/ createUseReadContract({
    abi: simpleDeFiTokenAbi,
    address: simpleDeFiTokenAddress,
    functionName: 'balanceOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleDeFiTokenAbi}__ and `functionName` set to `"decimals"`
 *
 *
 */
export const useReadSimpleDeFiTokenDecimals =
  /*#__PURE__*/ createUseReadContract({
    abi: simpleDeFiTokenAbi,
    address: simpleDeFiTokenAddress,
    functionName: 'decimals',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleDeFiTokenAbi}__ and `functionName` set to `"name"`
 *
 *
 */
export const useReadSimpleDeFiTokenName = /*#__PURE__*/ createUseReadContract({
  abi: simpleDeFiTokenAbi,
  address: simpleDeFiTokenAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleDeFiTokenAbi}__ and `functionName` set to `"symbol"`
 *
 *
 */
export const useReadSimpleDeFiTokenSymbol = /*#__PURE__*/ createUseReadContract(
  {
    abi: simpleDeFiTokenAbi,
    address: simpleDeFiTokenAddress,
    functionName: 'symbol',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleDeFiTokenAbi}__ and `functionName` set to `"totalSupply"`
 *
 *
 */
export const useReadSimpleDeFiTokenTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: simpleDeFiTokenAbi,
    address: simpleDeFiTokenAddress,
    functionName: 'totalSupply',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleDeFiTokenAbi}__
 *
 *
 */
export const useWriteSimpleDeFiToken = /*#__PURE__*/ createUseWriteContract({
  abi: simpleDeFiTokenAbi,
  address: simpleDeFiTokenAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleDeFiTokenAbi}__ and `functionName` set to `"approve"`
 *
 *
 */
export const useWriteSimpleDeFiTokenApprove =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleDeFiTokenAbi,
    address: simpleDeFiTokenAddress,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleDeFiTokenAbi}__ and `functionName` set to `"transfer"`
 *
 *
 */
export const useWriteSimpleDeFiTokenTransfer =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleDeFiTokenAbi,
    address: simpleDeFiTokenAddress,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleDeFiTokenAbi}__ and `functionName` set to `"transferFrom"`
 *
 *
 */
export const useWriteSimpleDeFiTokenTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleDeFiTokenAbi,
    address: simpleDeFiTokenAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleDeFiTokenAbi}__ and `functionName` set to `"transferWithAutoBurn"`
 *
 *
 */
export const useWriteSimpleDeFiTokenTransferWithAutoBurn =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleDeFiTokenAbi,
    address: simpleDeFiTokenAddress,
    functionName: 'transferWithAutoBurn',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleDeFiTokenAbi}__
 *
 *
 */
export const useSimulateSimpleDeFiToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleDeFiTokenAbi,
    address: simpleDeFiTokenAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleDeFiTokenAbi}__ and `functionName` set to `"approve"`
 *
 *
 */
export const useSimulateSimpleDeFiTokenApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleDeFiTokenAbi,
    address: simpleDeFiTokenAddress,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleDeFiTokenAbi}__ and `functionName` set to `"transfer"`
 *
 *
 */
export const useSimulateSimpleDeFiTokenTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleDeFiTokenAbi,
    address: simpleDeFiTokenAddress,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleDeFiTokenAbi}__ and `functionName` set to `"transferFrom"`
 *
 *
 */
export const useSimulateSimpleDeFiTokenTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleDeFiTokenAbi,
    address: simpleDeFiTokenAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleDeFiTokenAbi}__ and `functionName` set to `"transferWithAutoBurn"`
 *
 *
 */
export const useSimulateSimpleDeFiTokenTransferWithAutoBurn =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleDeFiTokenAbi,
    address: simpleDeFiTokenAddress,
    functionName: 'transferWithAutoBurn',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleDeFiTokenAbi}__
 *
 *
 */
export const useWatchSimpleDeFiTokenEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: simpleDeFiTokenAbi,
    address: simpleDeFiTokenAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleDeFiTokenAbi}__ and `eventName` set to `"Approval"`
 *
 *
 */
export const useWatchSimpleDeFiTokenApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: simpleDeFiTokenAbi,
    address: simpleDeFiTokenAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleDeFiTokenAbi}__ and `eventName` set to `"Transfer"`
 *
 *
 */
export const useWatchSimpleDeFiTokenTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: simpleDeFiTokenAbi,
    address: simpleDeFiTokenAddress,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenPairAbi}__
 */
export const useReadTokenPair = /*#__PURE__*/ createUseReadContract({
  abi: tokenPairAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"MINIMUM_LIQUIDITY"`
 */
export const useReadTokenPairMinimumLiquidity =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenPairAbi,
    functionName: 'MINIMUM_LIQUIDITY',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadTokenPairAllowance = /*#__PURE__*/ createUseReadContract({
  abi: tokenPairAbi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadTokenPairBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: tokenPairAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadTokenPairDecimals = /*#__PURE__*/ createUseReadContract({
  abi: tokenPairAbi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"factory"`
 */
export const useReadTokenPairFactory = /*#__PURE__*/ createUseReadContract({
  abi: tokenPairAbi,
  functionName: 'factory',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"getReserves"`
 */
export const useReadTokenPairGetReserves = /*#__PURE__*/ createUseReadContract({
  abi: tokenPairAbi,
  functionName: 'getReserves',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"kLast"`
 */
export const useReadTokenPairKLast = /*#__PURE__*/ createUseReadContract({
  abi: tokenPairAbi,
  functionName: 'kLast',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"name"`
 */
export const useReadTokenPairName = /*#__PURE__*/ createUseReadContract({
  abi: tokenPairAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadTokenPairSymbol = /*#__PURE__*/ createUseReadContract({
  abi: tokenPairAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"tokenA"`
 */
export const useReadTokenPairTokenA = /*#__PURE__*/ createUseReadContract({
  abi: tokenPairAbi,
  functionName: 'tokenA',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"tokenB"`
 */
export const useReadTokenPairTokenB = /*#__PURE__*/ createUseReadContract({
  abi: tokenPairAbi,
  functionName: 'tokenB',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadTokenPairTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: tokenPairAbi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenPairAbi}__
 */
export const useWriteTokenPair = /*#__PURE__*/ createUseWriteContract({
  abi: tokenPairAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteTokenPairApprove = /*#__PURE__*/ createUseWriteContract({
  abi: tokenPairAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteTokenPairBurn = /*#__PURE__*/ createUseWriteContract({
  abi: tokenPairAbi,
  functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteTokenPairInitialize = /*#__PURE__*/ createUseWriteContract(
  { abi: tokenPairAbi, functionName: 'initialize' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteTokenPairMint = /*#__PURE__*/ createUseWriteContract({
  abi: tokenPairAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"skim"`
 */
export const useWriteTokenPairSkim = /*#__PURE__*/ createUseWriteContract({
  abi: tokenPairAbi,
  functionName: 'skim',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"swap"`
 */
export const useWriteTokenPairSwap = /*#__PURE__*/ createUseWriteContract({
  abi: tokenPairAbi,
  functionName: 'swap',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"sync"`
 */
export const useWriteTokenPairSync = /*#__PURE__*/ createUseWriteContract({
  abi: tokenPairAbi,
  functionName: 'sync',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteTokenPairTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: tokenPairAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteTokenPairTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenPairAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenPairAbi}__
 */
export const useSimulateTokenPair = /*#__PURE__*/ createUseSimulateContract({
  abi: tokenPairAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateTokenPairApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenPairAbi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateTokenPairBurn = /*#__PURE__*/ createUseSimulateContract(
  { abi: tokenPairAbi, functionName: 'burn' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateTokenPairInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenPairAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateTokenPairMint = /*#__PURE__*/ createUseSimulateContract(
  { abi: tokenPairAbi, functionName: 'mint' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"skim"`
 */
export const useSimulateTokenPairSkim = /*#__PURE__*/ createUseSimulateContract(
  { abi: tokenPairAbi, functionName: 'skim' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"swap"`
 */
export const useSimulateTokenPairSwap = /*#__PURE__*/ createUseSimulateContract(
  { abi: tokenPairAbi, functionName: 'swap' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"sync"`
 */
export const useSimulateTokenPairSync = /*#__PURE__*/ createUseSimulateContract(
  { abi: tokenPairAbi, functionName: 'sync' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateTokenPairTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenPairAbi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenPairAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateTokenPairTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenPairAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenPairAbi}__
 */
export const useWatchTokenPairEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: tokenPairAbi },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenPairAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchTokenPairApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenPairAbi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenPairAbi}__ and `eventName` set to `"Burn"`
 */
export const useWatchTokenPairBurnEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenPairAbi,
    eventName: 'Burn',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenPairAbi}__ and `eventName` set to `"Mint"`
 */
export const useWatchTokenPairMintEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenPairAbi,
    eventName: 'Mint',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenPairAbi}__ and `eventName` set to `"Swap"`
 */
export const useWatchTokenPairSwapEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenPairAbi,
    eventName: 'Swap',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenPairAbi}__ and `eventName` set to `"Sync"`
 */
export const useWatchTokenPairSyncEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenPairAbi,
    eventName: 'Sync',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenPairAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchTokenPairTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenPairAbi,
    eventName: 'Transfer',
  })
