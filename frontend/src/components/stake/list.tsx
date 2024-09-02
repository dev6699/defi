"use client"

import Link from "next/link"
import { formatUnits } from "viem"

import { TokenPair } from "@/hooks/useTokenPair"
import { StakingPool } from "@/hooks/useStakingPool"
import { useStakingPools } from "@/hooks/useStakingPools"

interface ListStakeProps {
    variant: 'stake' | 'farm'
    stakingPools: StakingPool[]
    tokenPairs: TokenPair[]
}
export default function ListStake({ variant, stakingPools: _stakingPools, tokenPairs }: ListStakeProps) {

    const isFarm = variant === 'farm'
    const {
        stakingPools,
        currentBlock,
        hideExpired,
        expanded,
        handleHideExpired,
        handleExpand,
        handleHarvest
    } = useStakingPools(_stakingPools, tokenPairs, isFarm)

    return (
        <div className="flex flex-col">
            <div className="flex w-1/2">
                <label className="flex items-center text-white">
                    <input
                        type="checkbox"
                        checked={hideExpired}
                        onChange={handleHideExpired}
                        className="form-checkbox text-black bg-white border-white"
                    />
                    <span className="ml-2">Hide Expired Pools</span>
                </label>
            </div>

            {stakingPools.length > 0 ?
                stakingPools
                    .map((item, index) => {
                        const hasStaked = item.stakedAmount > 0
                        const hasReward = item.pendingReward > 0

                        return (
                            <div
                                key={`staking-pool-${index}`}
                                className={`border-2 my-4 border-white p-2`}
                            >
                                <div
                                    className="flex justify-between items-center cursor-pointer text-white"
                                    onClick={() => handleExpand(item.address)}
                                >
                                    <div className="flex flex-col gap-2 p-2 justify-between w-full">
                                        <div className="grid grid-cols-4">
                                            <div>Stake: {item.stakedToken.symbol}</div>
                                            <div>Earn: {item.rewardToken.symbol}</div>
                                            <div>
                                                {item.rewardToken.symbol} Earned: {formatUnits(item.pendingReward, item.rewardToken.decimals!)}
                                            </div>
                                            <div>
                                                Total Staked: {formatUnits(item.stakedTotal, item.stakedToken.decimals!)}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div>
                                                Reward Per Block: {formatUnits(item.rewardPerBlock, item.rewardToken.decimals!)}
                                            </div>
                                            <div>
                                                Status: &nbsp;
                                                {currentBlock >= item.rewardEndBlock
                                                    ? "Expired"
                                                    : currentBlock >= item.rewardStartBlock
                                                        ? `Ends in ${item.rewardEndBlock - currentBlock} block(s)`
                                                        : `Starts in ${item.rewardStartBlock - currentBlock} block(s)`}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mr-2">
                                        <svg
                                            className="w-6 h-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {expanded.has(item.address) && (
                                    <div className="p-2 text-white">
                                        <div className="flex flex-row gap-2">
                                            <Link
                                                className="w-full"
                                                href={`${variant}/deposit?pool=${item.address}`}>
                                                <button
                                                    className={`w-full p-2 border ${currentBlock >= item.rewardEndBlock ? "bg-gray-600" : "bg-white text-black"}`}
                                                    disabled={currentBlock >= item.rewardEndBlock}
                                                >
                                                    Deposit
                                                </button>
                                            </Link>

                                            <Link
                                                className="w-full"
                                                href={`${variant}/withdraw?pool=${item.address}`}>
                                                <button
                                                    className={`w-full p-2 border ${!hasStaked ? "bg-gray-600" : "bg-white text-black"}`}
                                                    disabled={!hasStaked}
                                                >
                                                    Withdraw
                                                </button>
                                            </Link>

                                            <button
                                                className={`w-full p-2 border ${!hasReward ? "bg-gray-600" : "bg-white text-black"}`}
                                                disabled={!hasReward}
                                                onClick={() => handleHarvest(item.address)}
                                            >
                                                Harvest {formatUnits(item.pendingReward, item.rewardToken.decimals!)} {item.rewardToken.symbol}
                                            </button>

                                            <Link
                                                className="w-full"
                                                href={`${variant}/supply?pool=${item.address}`}>
                                                <button
                                                    className="w-full p-2 border bg-white text-black"
                                                >
                                                    Supply Reward
                                                </button>
                                            </Link>

                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })
                :
                <p className="text-white my-4">No Staking Pool Found</p>
            }

            <div className="mt-2">
                <Link href={`${variant}/create`}>
                    <button
                        className="w-full p-2 border bg-white text-black"
                    >
                        Create {isFarm ? "Farming" : "Staking"} Pool
                    </button>
                </Link>
            </div>
        </div>
    );
};
