"use client"

import { formatUnits } from 'viem';

import { SWAP_MODE, useSwap } from '@/hooks/useSwap';
import { TokenPair } from '@/hooks/useTokenPair';

import TransactionStatus from '@/components/transaction-status';
import { ETH } from '@/lib/tokens';
import WithTokenPairs from '@/components/with-token-pairs';

export default function Swap() {
    return (
        <WithTokenPairs>
            {(tokenPairs) => <_Swap tokenPairs={tokenPairs} />}
        </WithTokenPairs>
    )
}

interface SwapProps {
    tokenPairs: TokenPair[]
}
function _Swap({ tokenPairs }: SwapProps) {
    const {
        transactionStatus,
        swapMode,
        canSwap,
        tokenSymbols,
        tokenA,
        tokenB,
        amountA,
        amountB,
        tokenABalanceData,
        tokenBBalanceData,
        bestSwapPath,
        price,
        priceImpact,
        selectTokenA,
        selectTokenB,
        reorderToken,
        handleAmountChange,
        handleSwap,
        handleWrap
    } = useSwap(tokenPairs)

    const enoughBalance = tokenABalanceData && tokenA ? +amountA <= +formatUnits(tokenABalanceData, tokenA.decimals) : false

    let tokenAValue = `${tokenSymbols.data?.findIndex(t => t.result === tokenA?.symbol)}`
    if (tokenAValue === '-1') {
        tokenAValue = tokenA?.symbol!
    }
    let tokenBValue = `${tokenSymbols.data?.findIndex(t => t.result === tokenB?.symbol)}`
    if (tokenBValue === '-1') {
        tokenBValue = tokenB?.symbol!
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-2">Swap</h1>
            <h2 className="text-lg mb-4">Exchange one token with another token</h2>

            <div className="mb-4">
                <div className="flex items-start">
                    <div>
                        <label htmlFor="buy-token" className="mr-2">
                            Buy with:
                        </label>
                        <select
                            id="buy-token"
                            value={tokenAValue ?? ''}
                            onChange={(e) => selectTokenA(e.target.value)}
                            className="w-full p-2 border border-black rounded text-black"
                        >
                            <option value="">Select Token</option>
                            <option value={ETH.symbol}>{ETH.symbol}</option>
                            {tokenSymbols.data?.map((token, i) => (
                                <option key={token.result} value={`${i}`}>{token.result}</option>
                            ))}
                        </select>
                    </div>

                    <div className='flex flex-col flex-1 ml-4'>
                        <label htmlFor="amount-spend" className="mr-2">
                            Amount to spend
                        </label>

                        <input
                            className="w-full p-2 border border-black rounded text-black"
                            type="number"
                            id="tokenA"
                            placeholder="Amount"
                            value={amountA}
                            onChange={handleAmountChange}
                            max={tokenABalanceData && tokenA ? +formatUnits(tokenABalanceData, tokenA.decimals) : 0}
                        />

                        <div className='flex items-center mt-2'>
                            <p className="text-sm">
                                Balance: {tokenABalanceData && tokenA ? formatUnits(tokenABalanceData, tokenA.decimals) : "-"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <button
                className="my-8 w-12 h-12 rounded-full flex items-center justify-center  text-white border-2 border-white font-bold mx-auto hover:bg-gray-700 text-2xl"
                onClick={reorderToken}
            >
                ↓
            </button>

            <div className="mb-4">
                <div className="flex items-start">
                    <div>
                        <label htmlFor="sell-token" className="mr-2">
                            You'll get:
                        </label>
                        <select
                            id="sell-token"
                            value={tokenBValue ?? ''}
                            onChange={(e) => selectTokenB(e.target.value)}
                            className="w-full p-2 border border-black rounded text-black"
                        >
                            <option value="">Select Token</option>
                            <option value={ETH.symbol}>{ETH.symbol}</option>
                            {tokenSymbols.data?.map((token, i) => (
                                <option key={token.result} value={`${i}`}>{token.result}</option>
                            ))}
                        </select>
                    </div>

                    <div className='flex flex-col flex-1 ml-4'>
                        <label htmlFor="amount-receive" className="mr-2">
                            Amount to receive
                        </label>
                        <input
                            className="w-full p-2 border border-black rounded text-black"
                            type="number"
                            id="tokenB"
                            placeholder="Amount"
                            value={amountB}
                            onChange={handleAmountChange}
                            max={tokenBBalanceData && tokenB ? +formatUnits(tokenBBalanceData, tokenB.decimals) : 0}
                        />

                        <div className='flex items-center mt-2'>
                            <p className="text-sm">
                                Balance: {tokenBBalanceData && tokenB ? formatUnits(tokenBBalanceData, tokenB.decimals) : "-"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {
                canSwap && swapMode === SWAP_MODE.SWAP && (tokenA && tokenB && price > 0) ?
                    <div className="mb-4 bg-gray-800 p-4 rounded">
                        <div className="flex justify-between items-center mb-2">
                            <span>Price:</span>
                            <span className="font-semibold">{price.toFixed(6)} {tokenA.symbol} per {tokenB.symbol}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span>Price Impact:</span>
                            <span className="font-semibold">{priceImpact.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Path:</span>
                            <span className="font-semibold">{bestSwapPath}</span>
                        </div>
                    </div>
                    :
                    null
            }

            {
                !canSwap && swapMode === SWAP_MODE.SWAP && amountA && amountB ?
                    <div className="mb-4 bg-gray-800 p-4 rounded">
                        {tokenA?.symbol}/{tokenB?.symbol} is not supported
                    </div>
                    :
                    null
            }

            {
                swapMode !== SWAP_MODE.SWAP ?
                    <div className="mb-4 bg-gray-800 p-4 rounded">
                        The exchange rate from {swapMode === SWAP_MODE.WRAP ? "ETH to WETH" : "WETH to ETH"} is always 1 : 1
                    </div>
                    : null
            }

            <button
                className={`
            w-full text-black border border-black px-4 py-2 rounded transition-colors mt-4
            ${!enoughBalance && price > 0 ?
                        'bg-red-500 cursor-not-allowed text-white hover:bg-red-300'
                        : 'bg-white hover:bg-gray-100'
                    }
            `}
                onClick={() => swapMode === SWAP_MODE.SWAP ? handleSwap() : handleWrap()}
                disabled={
                    transactionStatus.isPending ||
                    (!enoughBalance || !canSwap) && swapMode === SWAP_MODE.SWAP}
            >
                {!enoughBalance && price > 0 ?
                    "Insufficient Balance" :
                    swapMode === SWAP_MODE.SWAP ?
                        transactionStatus.isPending ? 'Swapping...' : 'Swap'
                        :
                        swapMode === SWAP_MODE.WRAP ?
                            transactionStatus.isPending ? 'Wraping...' : 'Wrap'
                            :
                            transactionStatus.isPending ? 'Unwraping...' : 'Unwrap'
                }
            </button>
            <TransactionStatus transactionStatus={transactionStatus} />
        </div>
    );
}