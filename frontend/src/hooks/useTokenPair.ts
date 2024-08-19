"use client"

import { useEffect, useState } from "react"
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import {
    useReadErc20Symbol,
    useReadErc20Decimals,
    useReadTokenPairDecimals,
    useReadTokenPairBalanceOf,
    useReadTokenPairTotalSupply,
    useReadTokenPairGetReserves,
    useReadTokenPairTokenA,
    useReadTokenPairTokenB,
} from "@/generated"

export interface Token {
    symbol: string;
    address: `0x${string}`
    decimals: number
}

export type TokenPair = ReturnType<typeof useTokenPair>

export const useTokenPair = (address: `0x${string}`) => {
    const [tokenA, setTokenA] = useState<Token | null>(null);
    const [tokenB, setTokenB] = useState<Token | null>(null);

    const account = useAccount()
    const tokenPairBalanceOf = useReadTokenPairBalanceOf({
        address,
        args: [account.address!]
    })
    const tokenPairTotalSupply = useReadTokenPairTotalSupply({
        address,
    })
    const tokenPairDecimals = useReadTokenPairDecimals({
        address
    })
    const tokenPairGetReserves = useReadTokenPairGetReserves({
        address
    })
    const tokenAReserve = tokenPairGetReserves.data && tokenA ? tokenPairGetReserves.data[0] : BigInt(0)
    const tokenBReserve = tokenPairGetReserves.data && tokenB ? tokenPairGetReserves.data[1] : BigInt(0)
    const tokenPairBalance = tokenPairBalanceOf.data && tokenPairDecimals.data ? formatUnits(tokenPairBalanceOf.data, tokenPairDecimals.data) : "0"

    const tokenAAddress = useReadTokenPairTokenA({
        address,
    })
    const tokenASymbol = useReadErc20Symbol({
        address: tokenAAddress.data
    })
    const tokenADecimals = useReadErc20Decimals({
        address: tokenAAddress.data
    })

    const tokenBAddress = useReadTokenPairTokenB({
        address,
    })
    const tokenBSymbol = useReadErc20Symbol({
        address: tokenBAddress.data
    })
    const tokenBDecimals = useReadErc20Decimals({
        address: tokenBAddress.data
    })

    useEffect(() => {
        if (!tokenAAddress.data ||
            !tokenBAddress.data ||
            !tokenASymbol.data ||
            !tokenBSymbol.data ||
            !tokenADecimals.data ||
            !tokenBDecimals.data
        ) {
            return
        }

        setTokenA({
            address: tokenAAddress.data,
            symbol: tokenASymbol.data,
            decimals: tokenADecimals.data
        })
        setTokenB({
            address: tokenBAddress.data,
            symbol: tokenBSymbol.data,
            decimals: tokenBDecimals.data
        })

    }, [
        tokenAAddress.data,
        tokenBAddress.data,
        tokenASymbol.data,
        tokenBSymbol.data,
        tokenADecimals.data,
        tokenBDecimals.data
    ])

    return {
        address,
        tokenPairBalance,
        tokenPairBalanceOf,
        tokenPairDecimals,
        tokenPairTotalSupply,
        tokenPairGetReserves,
        tokenAReserve,
        tokenBReserve,
        tokenA,
        tokenB,
        setTokenA,
        setTokenB
    }
}