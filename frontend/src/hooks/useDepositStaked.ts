"use client"

import { ChangeEvent, useState } from "react"
import { formatUnits, parseUnits } from "viem"
import { useAccount, useWaitForTransactionReceipt } from "wagmi"

import {
    useReadErc20Allowance,
    useReadErc20BalanceOf,
    useReadStakingPoolStakedToken,
    useWriteErc20Approve,
    useWriteStakingPoolDeposit
} from "@/generated"
import { useToken } from "./useToken"
import { useTokenPair } from "./useTokenPair"

export const useDepositStaked = (pool: `0x${string}`) => {

    const [hash, setHash] = useState('' as `0x${string}`);
    const [amount, setAmount] = useState('')

    const account = useAccount()
    const stakedTokenAddr = useReadStakingPoolStakedToken({
        address: pool
    })

    const stakedToken = useToken({ address: stakedTokenAddr.data })
    const tokenPair = useTokenPair(stakedTokenAddr.data)

    const stakedTokenBalance = useReadErc20BalanceOf({
        address: stakedTokenAddr.data,
        args: [account.address!],
    })
    const stakedTokenAllowance = useReadErc20Allowance({
        address: stakedTokenAddr?.data,
        args: [
            account.address!,
            pool
        ],
    })

    const writeStakingPoolDeposit = useWriteStakingPoolDeposit()
    const writeErc20Approve = useWriteErc20Approve()
    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({ hash })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value)
    }

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (stakedTokenAllowance.data === undefined) {
            return
        }

        if (!stakedTokenAddr.data || !stakedToken.decimals) {
            return
        }

        const val = parseUnits(amount, stakedToken.decimals)
        if (stakedTokenAllowance.data < val) {
            const res = await writeErc20Approve.writeContractAsync({
                account: account.address,
                address: stakedTokenAddr.data,
                args: [pool, val],
            })
            setHash(res)
        }

        const res = await writeStakingPoolDeposit.writeContractAsync({
            args: [val],
            address: pool
        })

        setHash(res)
        setAmount('')
        await stakedTokenBalance.refetch()
    }

    return {
        transactionStatus: {
            isPending: writeErc20Approve.isPending || writeStakingPoolDeposit.isPending,
            error: writeErc20Approve.error || writeStakingPoolDeposit.error,
            isConfirming,
            isConfirmed,
            hash,
        },
        amount,
        balance: stakedTokenBalance.data && stakedToken.decimals ? formatUnits(stakedTokenBalance.data, stakedToken.decimals) : BigInt(0),
        stakedToken,
        tokenPair,
        handleChange,
        handleDeposit
    }
}