"use client"

import { formatUnits } from 'viem';
import { useSearchParams } from 'next/navigation';
import { useRemoveLiquidity } from '@/hooks/useRemoveLiquidity';
import TransactionStatus from '@/components/transaction-status';

export default function RemoveLiquidity() {

    const searchParams = useSearchParams()
    const pair = searchParams.get('pair') as `0x${string}`
    const {
        transactionStatus,
        amount,
        percentage,
        tokenA,
        tokenB,
        tokenAPooled,
        tokenBPooled,
        tokenPairDecimals,
        tokenPairBalance,
        tokenPairBalanceOf,
        handleAmountChange,
        handleSliderChange,
        handlePercentChange,
        handleRemove,
    } = useRemoveLiquidity(pair)

    return (
        <div>
            <main className="mx-auto">
                <h1 className="text-2xl font-bold mb-2">Remove {tokenA?.symbol}/{tokenB?.symbol} LP Token</h1>
                <h2 className="text-lg mb-4">To receive {tokenA?.symbol} and {tokenB?.symbol}</h2>

                <div className="mb-4">
                    {tokenPairBalanceOf.data && tokenPairDecimals.data &&
                        <input
                            placeholder='Amount of LP Tokens to remove'
                            type="number"
                            min={0}
                            step={0.01}
                            max={+formatUnits(tokenPairBalanceOf.data, tokenPairDecimals.data)}
                            value={amount}
                            onChange={handleAmountChange}
                            className="w-full p-2 border border-black rounded text-black"
                        />}
                    <p className="text-sm mt-1">Balance: {tokenPairBalance} LP Tokens</p>
                </div>

                <div className="mb-4">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={percentage}
                        onChange={handleSliderChange}
                        className="w-full"
                    />
                    <div className="flex justify-between mt-2">
                        {[25, 50, 75, 100].map((percent) => (
                            <button
                                key={percent}
                                onClick={() => handlePercentChange(percent)}
                                className="px-2 py-1 border border-white rounded"
                            >
                                {percent}%
                            </button>
                        ))}
                    </div>
                </div>

                <div className="my-8">
                    <p className='mb-4'>You will receive approximately:</p>
                    <div className="flex justify-between items-center mb-2">
                        <span>Pooled {tokenA?.symbol}</span>
                        <span className="font-semibold">{tokenAPooled.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span>Pooled {tokenB?.symbol}</span>
                        <span className="font-semibold">{tokenBPooled.toFixed(6)}</span>
                    </div>
                </div>

                <button
                    className="w-full bg-white text-black py-2 rounded"
                    onClick={handleRemove}
                    disabled={transactionStatus.isPending}
                >
                    {transactionStatus.isPending ? "Removing" : "Remove"}
                </button>
                <TransactionStatus transactionStatus={transactionStatus} />
            </main>
        </div>
    );
}