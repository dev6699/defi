"use client"

import { formatUnits } from 'viem';

import { useSwap } from '@/hooks/useSwap';
import { useAllPairs } from '@/hooks/useAllPairs';
import { TokenPair, useTokenPair } from '@/hooks/useTokenPair';

import Loader from '@/components/loader';
import TransactionStatus from '@/components/transaction-status';

export default function Swap() {
    const { allPairs } = useAllPairs()
    if (!allPairs.data) {
        return <Loader />
    }
    const allPairsResult = allPairs.data.map(p => p.result as `0x${string}`)
    return <EnsureTokenPairsSwap allPairs={allPairsResult} />
}

interface EnsureTokenPairsSwapProps {
    allPairs: `0x${string}`[]
}
function EnsureTokenPairsSwap({ allPairs }: EnsureTokenPairsSwapProps) {
    const tokenPairs = allPairs.map(pair => useTokenPair(pair))
    if (tokenPairs.length !== allPairs.length) {
        return <Loader />
    }
    return <_Swap tokenPairs={tokenPairs} />
}

interface SwapProps {
    tokenPairs: TokenPair[]
}
function _Swap({ tokenPairs }: SwapProps) {
    const {
        transactionStatus,
        tokenSymbols,
        tokenA,
        tokenB,
        amountA,
        amountB,
        tokenABalance,
        tokenBBalance,
        bestSwapPath,
        price,
        priceImpact,
        selectTokenA,
        selectTokenB,
        reorderToken,
        handleAmountChange,
        handleSwap
    } = useSwap(tokenPairs)
    const enoughBalance = tokenABalance.data && tokenA ? +amountA < +formatUnits(tokenABalance.data, tokenA.decimals) : false

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
                            value={tokenA?.symbol ?? ''}
                            onChange={(e) => selectTokenA(e.target.value)}
                            className="w-full p-2 border border-black rounded text-black"
                        >
                            <option value="">Select Token</option>
                            {tokenSymbols.data?.map((token, i) => (
                                <option key={token.result} value={`${token.result}`}>{token.result}</option>
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
                            max={tokenABalance.data && tokenA ? +formatUnits(tokenABalance.data, tokenA.decimals) : 0}
                        />

                        <div className='flex items-center mt-2'>
                            <p className="text-sm">
                                Balance: {tokenABalance.data && tokenA ? formatUnits(tokenABalance.data, tokenA.decimals) : "-"}
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
                            value={tokenB?.symbol ?? ''}
                            onChange={(e) => selectTokenB(e.target.value)}
                            className="w-full p-2 border border-black rounded text-black"
                        >
                            <option value="">Select Token</option>
                            {tokenSymbols.data?.map((token, i) => (
                                <option key={token.result} value={`${token.result}`}>{token.result}</option>
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
                            max={tokenBBalance.data && tokenB ? +formatUnits(tokenBBalance.data, tokenB.decimals) : 0}
                        />

                        <div className='flex items-center mt-2'>
                            <p className="text-sm">
                                Balance: {tokenBBalance.data && tokenB ? formatUnits(tokenBBalance.data, tokenB.decimals) : "Insuficient tokens"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {
                (tokenA && tokenB && price > 0) ?
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
                    : null
            }

            <button
                className={`
            w-full text-black border border-black px-4 py-2 rounded transition-colors
            ${!enoughBalance && price > 0 ?
                        'bg-red-500 cursor-not-allowed text-white hover:bg-red-300'
                        : 'bg-white hover:bg-gray-100'
                    }
            `}
                onClick={handleSwap}
                disabled={!enoughBalance || transactionStatus.isPending}
            >
                {enoughBalance ?
                    transactionStatus.isPending ? 'Swapping...' :
                        'Swap' : 'Insufficient Balance'}
            </button>
            <TransactionStatus transactionStatus={transactionStatus} />
        </div>
    );
}