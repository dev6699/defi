"use client"

import { useAccount } from "wagmi"
import { formatUnits } from "viem"
import {
    useReadErc20Name,
    useReadErc20Decimals,
    useReadErc20BalanceOf,
    useReadErc20TotalSupply
} from "@/generated"

interface UseTokenProps {
    address: `0x${string}`
}

export const useToken = ({ address }: UseTokenProps) => {
    const account = useAccount()

    const name = useReadErc20Name({ address })
    const totalSupply = useReadErc20TotalSupply({ address })
    const balanceOf = useReadErc20BalanceOf({
        address,
        args: [account.address!],
    })
    const decimals = useReadErc20Decimals({ address })

    const formattedTotalSupply = totalSupply.data && decimals.data ? formatUnits(totalSupply.data, decimals.data) : "0"
    const formattedBalance = balanceOf.data && decimals.data ? formatUnits(balanceOf.data, decimals.data) : "0"

    return {
        name: name.data,
        totalSupply: formattedTotalSupply,
        balance: formattedBalance,
        decimals: decimals.data,
        isLoading: name.isLoading || totalSupply.isLoading || balanceOf.isLoading || decimals.isLoading,
        isError: name.isError || totalSupply.isError || balanceOf.isError || decimals.isError,
    }
}
