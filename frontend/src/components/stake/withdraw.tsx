"use client"

import { useSearchParams } from "next/navigation";

import { useWithdrawStaked } from "@/hooks/useWithdrawStaked";

import TransactionStatus from "@/components/transaction-status";

interface WithdrawStakeProps {
    variant: 'stake' | 'farm'
}
export default function WithdrawStake({ variant }: WithdrawStakeProps) {
    const searchParams = useSearchParams()
    const pool = searchParams.get('pool') as `0x${string}`

    const {
        transactionStatus,
        stakedToken,
        tokenPair,
        amount,
        stakedTokenAmount,
        handleChange,
        handleWithdraw
    } = useWithdrawStaked(pool)

    const symbol = variant === 'stake' ? stakedToken.symbol : `LP Token for ${tokenPair.tokenA?.symbol || ''}-${tokenPair.tokenB?.symbol || ''}`

    return (
        <form onSubmit={handleWithdraw} className="flex flex-col w-full px-4">
            <h1 className="text-3xl font-bold mb-6">Withdraw Staked Token ({symbol})</h1>

            <div className="grid grid-cols-3 gap-4">
                <div className="text-white mt-2 col-span-1">Amount to Withdraw</div>
                <div className="col-span-2">
                    <input
                        type="text"
                        placeholder={`Please enter the amount of ${symbol} to withdraw`}
                        value={amount}
                        onChange={handleChange}
                        className="bg-white text-black p-2 rounded w-full"
                    />
                    <p className="text-white mt-2">Staked of {symbol}: {stakedTokenAmount}</p>
                </div>

                <div className="col-span-1"></div>
                <div className="col-span-1">
                    <button
                        disabled={+amount <= 0}
                        type="submit"
                        className={`
                        w-full text-black border border-black px-4 py-2 rounded transition-colors
                      ${+amount <= 0 ?
                                'bg-gray-600 cursor-not-allowed text-white hover:bg-gray-400'
                                : 'bg-white hover:bg-gray-100'
                            }
                    `}
                    >
                        Withdraw
                    </button>
                </div>
            </div>
            <TransactionStatus transactionStatus={transactionStatus} />
        </form>
    );
};
