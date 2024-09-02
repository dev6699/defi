"use client"

import { useAccount } from "wagmi"
import {
    useReadStakingPoolGetPendingReward,
    useReadStakingPoolRewardEndBlock,
    useReadStakingPoolRewardPerBlock,
    useReadStakingPoolRewardStartBlock,
    useReadStakingPoolRewardToken,
    useReadStakingPoolStakedToken,
    useReadStakingPoolStakedTokenSupply,
    useReadStakingPoolUserInfo
} from "@/generated"
import { useToken } from "./useToken"

interface UseStakingPoolProps {
    address: `0x${string}`
}

export type StakingPool = ReturnType<typeof useStakingPool>

export const useStakingPool = ({ address }: UseStakingPoolProps) => {
    const account = useAccount()
    const rewardStartBlock = useReadStakingPoolRewardStartBlock({ address })
    const rewardEndBlock = useReadStakingPoolRewardEndBlock({ address })
    const rewardPerBlock = useReadStakingPoolRewardPerBlock({ address })
    const userInfo = useReadStakingPoolUserInfo({ address, args: [account.address!] })
    const stakedTotal = useReadStakingPoolStakedTokenSupply({ address })
    const pendingReward = useReadStakingPoolGetPendingReward({ address, args: [account.address!] })
    const stakedTokenAddr = useReadStakingPoolStakedToken({ address })
    const rewardTokenAddr = useReadStakingPoolRewardToken({ address })
    const stakedToken = useToken({ address: stakedTokenAddr.data })
    const rewardToken = useToken({ address: rewardTokenAddr.data })

    return {
        isLoading: rewardStartBlock.isLoading ||
            rewardEndBlock.isLoading ||
            rewardPerBlock.isLoading ||
            userInfo.isLoading ||
            stakedTotal.isLoading ||
            pendingReward.isLoading ||
            stakedTokenAddr.isLoading ||
            rewardTokenAddr.isLoading ||
            stakedToken.isLoading ||
            rewardToken.isLoading,
        address,
        rewardStartBlock: rewardStartBlock.data || BigInt(0),
        rewardEndBlock: rewardEndBlock.data || BigInt(0),
        rewardPerBlock: rewardPerBlock.data || BigInt(0),
        stakedAmount: userInfo.data?.[0] || BigInt(0),
        stakedTotal: stakedTotal.data || BigInt(0),
        pendingReward: pendingReward.data || BigInt(0),
        stakedToken,
        rewardToken
    }
}