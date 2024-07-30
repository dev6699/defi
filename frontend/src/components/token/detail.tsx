"use client"

import { useReadSimpleDeFiTokenBalanceOf, useReadSimpleDeFiTokenName, useReadSimpleDeFiTokenTotalSupply } from "@/generated"
import { useAccount } from "wagmi"

export default function Token() {
    const account = useAccount()
    const name = useReadSimpleDeFiTokenName()
    const totalSupply = useReadSimpleDeFiTokenTotalSupply()
    const balanceOf = useReadSimpleDeFiTokenBalanceOf({
        args: [account.address!],
    })

    return (
        <div className="bg-white border border-black p-4 rounded mb-4 text-black">
            <h2 className="text-xl font-bold mb-2">{name.data}</h2>
            <p>Total Supply: {totalSupply.data?.toString()}</p>
            <p>Your Balance: {balanceOf.data?.toString()}</p>
        </div>
    )
}
