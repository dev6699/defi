"use client"

import { useSearchParams } from "next/navigation";

import { useDepositStaked } from "@/hooks/useDepositStaked";

import TransactionStatus from "@/components/transaction-status";

interface DepositStakeProps {
    variant: 'stake' | 'farm'
}
export default function DepositStake({ variant }: DepositStakeProps) {
    const searchParams = useSearchParams()
    const pool = searchParams.get('pool') as `0x${string}`

    const {
        transactionStatus,
        stakedToken,
        tokenPair,
        amount,
        balance,
        handleChange,
        handleDeposit
    } = useDepositStaked(pool)

    const symbol = variant === 'stake' ? stakedToken.symbol : `LP Token for ${tokenPair.tokenA?.symbol || ''}-${tokenPair.tokenB?.symbol || ''}`

    return (
        <form onSubmit={handleDeposit} className="flex flex-col w-full px-4">
            <h1 className="text-3xl font-bold mb-6">Deposit Staked Token ({symbol})</h1>

            <div className="grid grid-cols-3 gap-4">
                <div className="text-white mt-2 col-span-1">Amount to Deposit</div>
                <div className="col-span-2">
                    <input
                        type="text"
                        placeholder={`Please enter staked token (${symbol}) amount`}
                        value={amount}
                        onChange={handleChange}
                        className="bg-white text-black p-2 rounded w-full"
                    />
                    <p className="text-white mt-2">Balance of {symbol}: {balance}</p>
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
                        Deposit
                    </button>
                </div>
            </div>
            <TransactionStatus transactionStatus={transactionStatus} />
        </form>
    );
};
