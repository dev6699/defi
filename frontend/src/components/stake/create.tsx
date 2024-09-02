"use client"

import { TokenPair } from "@/hooks/useTokenPair";
import { useCreateStakingPool } from "@/hooks/useCreateStakingPool"

import TransactionStatus from "@/components/transaction-status";

interface CreateStakeProps {
    variant: 'stake' | 'farm'
    tokenPairs: TokenPair[]
}
export default function CreateStake({ variant, tokenPairs }: CreateStakeProps) {
    const {
        transactionStatus,
        tokenSymbols,
        stakedToken,
        rewardToken,
        currentBlock,
        rewardPerBlock,
        startBlock,
        endBlock,
        selectStakedLPToken,
        selectStakedToken,
        selectRewardToken,
        handleRewardPerBlockChange,
        handleStartBlockChange,
        handleEndBlockChange,
        handleCreate
    } = useCreateStakingPool(tokenPairs)

    const isFarm = variant === 'farm'

    return (
        <form onSubmit={handleCreate} className="mx-auto">
            <h1 className="text-3xl font-bold mb-6">Create {isFarm ? 'Farming' : 'Staking'} Pool</h1>

            <div className="grid grid-cols-2 gap-4">
                {
                    isFarm ?
                        <>
                            <label htmlFor="staked_lp_token" className="text-white mt-2">Staked Liquidity</label>
                            <select
                                id="staked_lp_token"
                                className="w-full p-2 border rounded text-black"
                                value={stakedToken?.address}
                                onChange={(e) => selectStakedLPToken(e.target.value)}
                            >
                                <option value="">Select a liquidity pool</option>
                                {tokenPairs.map((t) => (
                                    <option key={t.address} value={`${t.address}`}>LP Token for {t.tokenA?.symbol} and {t.tokenB?.symbol} ({t.tokenA?.symbol}-{t.tokenB?.symbol})</option>
                                ))}
                            </select>
                        </>
                        :
                        <>
                            <label htmlFor="staked_token" className="text-white mt-2">Staked Token</label>
                            <select
                                id="staked_token"
                                className="w-full p-2 border rounded text-black"
                                value={stakedToken?.symbol}
                                onChange={(e) => selectStakedToken(e.target.value)}
                            >
                                <option value="">Select Staked Token</option>
                                {tokenSymbols.data?.map((token) => (
                                    <option key={token.result} value={`${token.result}`}>{token.result}</option>
                                ))}
                            </select>
                        </>
                }

                <label htmlFor="reward_token" className="text-white mt-2">Reward Token</label>
                <select
                    id="reward_token"
                    className="w-full p-2 border rounded text-black"
                    value={rewardToken?.symbol}
                    onChange={(e) => selectRewardToken(e.target.value)}
                >
                    <option value="">{'Select Reward Token'}</option>
                    {tokenSymbols.data?.map((token) => (
                        <option key={token.result} value={`${token.result}`}>{token.result}</option>
                    ))}
                </select>


                <label htmlFor="reward_per_block" className="text-white mt-2">Reward Per Block</label>
                <input
                    id="reward_per_block"
                    type="number"
                    placeholder="Please enter reward per block"
                    value={rewardPerBlock}
                    onChange={handleRewardPerBlockChange}
                    className="bg-white text-black p-2 rounded w-full"
                />

                <label htmlFor="start_block" className="text-white mt-2">Start Block</label>
                <input
                    id="start_block"
                    type="number"
                    placeholder="Please enter start block number"
                    value={startBlock}
                    onChange={handleStartBlockChange}
                    className="bg-white text-black p-2 rounded w-full"
                />

                <label htmlFor="end_block" className="text-white mt-2">End Block</label>
                <input
                    id="end_block"
                    type="number"
                    placeholder="Please enter end block number"
                    value={endBlock}
                    onChange={handleEndBlockChange}
                    className="bg-white text-black p-2 rounded w-full"
                />
            </div>

            <div className="my-4 text-white border-gray-100 border p-4 rounded">
                <h3 className="text-lg">Note</h3>
                <p>We highly recommend setting block number greater than the current block number {currentBlock}.</p>

                {+startBlock >= +endBlock && (
                    <p className="text-red-300">Start block number should be less than the end block number.</p>
                )}

                {(!stakedToken || !rewardToken) && (
                    <p className="text-red-300">Please select both staked and reward tokens.</p>
                )}
            </div>

            <button
                disabled={+startBlock >= +endBlock || (!stakedToken || !rewardToken)}
                type="submit"
                className={`
                        w-full text-black border border-black px-4 py-2 rounded transition-colors
                        ${+startBlock >= +endBlock || (!stakedToken || !rewardToken) ?
                        'bg-gray-600 cursor-not-allowed text-white hover:bg-gray-400'
                        : 'bg-white hover:bg-gray-100'
                    }
                    `}
            >
                Create
            </button>
            <TransactionStatus transactionStatus={transactionStatus} />
        </form>
    );

};
