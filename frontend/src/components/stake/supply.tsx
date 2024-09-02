"use client"

import { useSearchParams } from "next/navigation";

import { useSupplyReward } from "@/hooks/useSupplyReward";

import TransactionStatus from "@/components/transaction-status";

export default function SupplyReward() {
    const searchParams = useSearchParams()
    const pool = searchParams.get('pool') as `0x${string}`

    const {
        transactionStatus,
        rewardToken,
        amount,
        balance,
        handleChange,
        handleSupply
    } = useSupplyReward(pool)

    return (
        < form onSubmit={handleSupply} className="flex flex-col w-full px-4">
            <h1 className="text-3xl font-bold mb-6">Supply Reward Token ({rewardToken.symbol})</h1>

            <div className="grid grid-cols-3 gap-4">
                <div className="text-white mt-2 col-span-1">Amount to Supply</div>
                <div className="col-span-2">
                    <input
                        type="text"
                        placeholder={`Please enter reward token (${rewardToken.symbol}) amount`}
                        value={amount}
                        onChange={handleChange}
                        className="bg-white text-black p-2 rounded w-full"
                    />
                    <p className="text-white mt-2">Balance of {rewardToken.symbol}: {balance}</p>
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
                        Supply
                    </button>
                </div>
            </div>
            <TransactionStatus transactionStatus={transactionStatus} />
        </form>
    );
};
