"use client"

import { ChangeEvent, useState } from "react"
import { formatUnits, parseUnits } from "viem"
import { useAccount, useWaitForTransactionReceipt } from "wagmi"

import {
    useReadErc20BalanceOf,
    useReadStakingPoolRewardToken,
    useWriteErc20Transfer
} from "@/generated"
import { useToken } from "./useToken"

export const useSupplyReward = (pool: `0x${string}`) => {

    const [hash, setHash] = useState('' as `0x${string}`);
    const [amount, setAmount] = useState('')

    const account = useAccount()
    const rewardTokenAddr = useReadStakingPoolRewardToken({
        address: pool
    })

    const rewardToken = useToken({ address: rewardTokenAddr.data })
    const rewardTokenBalance = useReadErc20BalanceOf({
        address: rewardTokenAddr.data,
        args: [account.address!],
    })
    const writeErc20Transfer = useWriteErc20Transfer()
    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({ hash })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value)
    }

    const handleSupply = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!rewardTokenAddr.data || !rewardToken.decimals) {
            return
        }

        const res = await writeErc20Transfer.writeContractAsync({
            address: rewardTokenAddr.data,
            args: [pool, parseUnits(amount, rewardToken.decimals)]
        })
        setHash(res)

        setAmount('')
        await rewardTokenBalance.refetch()
    }
    return {
        transactionStatus: {
            isPending: writeErc20Transfer.isPending,
            error: writeErc20Transfer.error,
            isConfirming,
            isConfirmed,
            hash,
        },
        amount,
        balance: rewardTokenBalance.data && rewardToken.decimals ? formatUnits(rewardTokenBalance.data, rewardToken.decimals) : BigInt(0),
        rewardToken,
        handleChange,
        handleSupply
    }
}