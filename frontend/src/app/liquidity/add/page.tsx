"use client"

import { formatUnits } from 'viem';
import { useSearchParams } from 'next/navigation';

import { useAddLiquidity } from '@/hooks/useAddLiquidity';
import Loader from '@/components/loader';
import TransactionStatus from '@/components/transaction-status';
import { ETH } from '@/lib/tokens';

export default function AddLiquidity() {
    const searchParams = useSearchParams()
    const pair = searchParams.get('pair') as `0x${string}`

    const {
        transactionStatus,
        loading,
        tokenA,
        tokenB,
        amountA,
        amountB,
        priceBPerA,
        priceAPerB,
        tokenABalanceData,
        tokenBBalanceData,
        tokenSymbols,
        shareOfPool,
        enoughBalance,
        selectTokenA,
        selectTokenB,
        handleSupply,
        handleAmountChange,
    } = useAddLiquidity(pair)

    if (loading) {
        return <Loader />
    }

    let tokenAValue = `${tokenSymbols.data?.findIndex(t => t.result === tokenA?.symbol)}`
    if (tokenAValue === '-1') {
        tokenAValue = tokenA?.symbol!
    }
    let tokenBValue = `${tokenSymbols.data?.findIndex(t => t.result === tokenB?.symbol)}`
    if (tokenBValue === '-1') {
        tokenBValue = tokenB?.symbol!
    }

    return (
        <div className="mx-auto">
            <h1 className="text-3xl font-bold mb-6">Add Liquidity</h1>
            <div className="mb-4">
                <select
                    disabled={!!pair}
                    className="w-full p-2 border rounded text-black"
                    value={tokenAValue ?? ''}
                    onChange={(e) => selectTokenA(e.target.value)}
                >
                    <option value="">{!!pair ? tokenA?.symbol : 'Select Token A'}</option>
                    <option value={ETH.symbol}>{ETH.symbol}</option>
                    {tokenSymbols.data?.map((token, i) => (
                        <option key={token.result} value={`${i}`}>{token.result}</option>
                    ))}
                </select>
                {tokenA && tokenABalanceData && (
                    <div className="mt-2">
                        <input
                            type="number"
                            className="w-full p-2 border rounded text-black"
                            value={amountA}
                            id="tokenA"
                            onChange={handleAmountChange}
                            placeholder="Amount"
                            max={+formatUnits(tokenABalanceData, tokenA.decimals)}
                        />
                        <p className="text-sm mt-1">Balance: {formatUnits(tokenABalanceData, tokenA.decimals)}</p>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <select
                    disabled={!!pair}
                    className="w-full p-2 border rounded text-black"
                    value={tokenBValue ?? ''}
                    onChange={(e) => selectTokenB(e.target.value)}
                >
                    <option value=""> {!!pair ? tokenB?.symbol : 'Select Token B'}</option>
                    <option value={ETH.symbol}>{ETH.symbol}</option>
                    {tokenSymbols.data?.map((token, i) => (
                        <option key={token.result} value={`${i}`}>{token.result}</option>
                    ))}
                </select>
                {tokenB && tokenBBalanceData && (
                    <div className="mt-2">
                        <input
                            type="number"
                            className="w-full p-2 border rounded text-black"
                            value={amountB}
                            id="tokenB"
                            onChange={handleAmountChange}
                            placeholder="Amount"
                            max={+formatUnits(tokenBBalanceData, tokenB.decimals)}
                        />
                        <p className="text-sm mt-1">Balance: {formatUnits(tokenBBalanceData, tokenB.decimals)}</p>
                    </div>
                )}
            </div>

            {tokenA && tokenB && amountA && amountB && (
                <div className="mb-4 bg-gray-800 p-4 rounded">
                    <div className="flex justify-between items-center mb-2">
                        <span>Price {tokenA.symbol} per {tokenB.symbol}:</span>
                        <span className="font-semibold">{priceAPerB}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span>Price {tokenB.symbol} per {tokenA.symbol}:</span>
                        <span className="font-semibold">{priceBPerA}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Share of Pool:</span>
                        <span className="font-semibold">{shareOfPool}%</span>
                    </div>
                </div>
            )}

            <button
                className={`
                w-full text-black border border-black px-4 py-2 rounded transition-colors
                ${!enoughBalance ?
                        'bg-red-500 cursor-not-allowed text-white hover:bg-red-300'
                        : 'bg-white hover:bg-gray-100'
                    }
                `}
                onClick={handleSupply}
                disabled={!enoughBalance || transactionStatus.isPending}
            >
                {enoughBalance ?
                    transactionStatus.isPending ? 'Supplying...' :
                        'Supply' : 'Insufficient Balance'}
            </button>
            <TransactionStatus transactionStatus={transactionStatus} />
        </div>
    );
};
