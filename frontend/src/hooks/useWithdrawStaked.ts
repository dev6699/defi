"use client"

import { ChangeEvent, useState } from "react"
import { formatUnits, parseUnits } from "viem"
import { useAccount, useWaitForTransactionReceipt } from "wagmi"

import {
    useReadStakingPoolStakedToken,
    useReadStakingPoolUserInfo,
    useWriteStakingPoolWithdraw
} from "@/generated"
import { useToken } from "./useToken"
import { useTokenPair } from "./useTokenPair"

export const useWithdrawStaked = (pool: `0x${string}`) => {

    const [hash, setHash] = useState('' as `0x${string}`);
    const [amount, setAmount] = useState('')

    const account = useAccount()
    const stakedTokenAddr = useReadStakingPoolStakedToken({
        address: pool
    })
    const stakedToken = useToken({ address: stakedTokenAddr.data })
    const tokenPair = useTokenPair(stakedTokenAddr.data)
    const userInfo = useReadStakingPoolUserInfo({ address: pool, args: [account.address!] })
    const stakedTokenAmount = userInfo.data?.[0] || BigInt(0)

    const writeStakingPoolWithdraw = useWriteStakingPoolWithdraw()
    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({ hash })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value)
    }

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stakedTokenAddr.data || !stakedToken.decimals) {
            return
        }

        const val = parseUnits(amount, stakedToken.decimals)
        const res = await writeStakingPoolWithdraw.writeContractAsync({
            args: [val],
            address: pool
        })

        setHash(res)
        setAmount('')
        await userInfo.refetch()
    }

    return {
        transactionStatus: {
            isPending: writeStakingPoolWithdraw.isPending,
            error: writeStakingPoolWithdraw.error,
            isConfirming,
            isConfirmed,
            hash,
        },
        amount,
        stakedTokenAmount: stakedToken.decimals ? formatUnits(stakedTokenAmount, stakedToken.decimals) : BigInt(0),
        stakedToken,
        tokenPair,
        handleChange,
        handleWithdraw
    }
}