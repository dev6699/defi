"use client"

import Error from "@/components/error"
import Loader from "@/components/loader"
import { useToken } from "@/hooks/useToken"
import NormalTransfer from "./normal-transfer"

interface TokenProps {
    address: `0x${string}`
}
export default function Token({ address }: TokenProps) {
    const {
        name,
        totalSupply,
        balance,
        decimals,
        isLoading,
        isError
    } = useToken({ address })

    if (isLoading) {
        return <Loader />
    }

    if (isError) {
        return <Error message="Error loading token data" />
    }

    return (
        <div className="border border-white p-4 rounded w-full">
            <h2 className="text-xl font-bold mb-2">{name}</h2>
            <p>Total Supply: {totalSupply}</p>
            <p>Your Balance: {balance}</p>
            <NormalTransfer address={address} decimals={decimals!} />
        </div>
    )
}
