"use client"

import { useEffect, useState } from "react"
import { formatUnits } from "viem";
import { useAccount, useChainId } from "wagmi";
import {
    useReadErc20Symbol,
    useReadErc20Decimals,
    useReadTokenPairDecimals,
    useReadTokenPairBalanceOf,
    useReadTokenPairTotalSupply,
    useReadTokenPairGetReserves,
    useReadTokenPairTokenA,
    useReadTokenPairTokenB,
    wethAddress,
} from "@/generated"
import { ETH, WETHSymbol } from "@/lib/tokens";

export interface Token {
    symbol: string;
    address: `0x${string}`
    decimals: number
    isETH: boolean
}

export type TokenPair = ReturnType<typeof useTokenPair>

export const useTokenPair = (address?: `0x${string}`) => {
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

    const chainId = useChainId()
    const wethAddr = wethAddress[chainId]

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

        let isTokenAETH = false
        let _tokenASymbol = tokenASymbol.data
        let _tokenAAddress = tokenAAddress.data
        if (_tokenASymbol === WETHSymbol && tokenAAddress.data === wethAddr) {
            _tokenASymbol = ETH.symbol
            _tokenAAddress = wethAddr
            isTokenAETH = true
        }

        let isTokenBETH = false
        let _tokenBAddress = tokenBAddress.data
        let _tokenBSymbol = tokenBSymbol.data
        if (_tokenBSymbol === WETHSymbol && tokenBAddress.data === wethAddr) {
            _tokenBSymbol = ETH.symbol
            _tokenBAddress = wethAddr
            isTokenBETH = true
        }

        setTokenA({
            address: _tokenAAddress,
            symbol: _tokenASymbol,
            decimals: tokenADecimals.data,
            isETH: isTokenAETH
        })
        setTokenB({
            address: _tokenBAddress,
            symbol: _tokenBSymbol,
            decimals: tokenBDecimals.data,
            isETH: isTokenBETH
        })

    }, [
        tokenAAddress.data,
        tokenBAddress.data,
        tokenASymbol.data,
        tokenBSymbol.data,
        tokenADecimals.data,
        tokenBDecimals.data,
        wethAddr
    ])

    return {
        wethAddr,
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