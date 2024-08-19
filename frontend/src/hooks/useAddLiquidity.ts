"use client"

import { formatUnits, parseUnits } from 'viem';
import { useState, useEffect, ChangeEvent } from 'react';
import { useAccount, useChainId, useReadContracts } from 'wagmi';
import {
    erc20Abi,
    ammRouterAddress,
    useWriteErc20Approve,
    useReadErc20Allowance,
    useReadErc20BalanceOf,
    useReadAmmRouterGetReserves,
    useWriteAmmRouterAddLiquidity,
} from '@/generated';
import { SUPPORTED_TOKENS } from '@/lib/tokens';
import { useTokenPair } from '@/hooks/useTokenPair';
import { useWaitForTransactionReceipt } from 'wagmi';

export function useAddLiquidity(pair: `0x${string}`) {

    const [hash, setHash] = useState('' as `0x${string}`);

    const [amountA, setAmountA] = useState<string>('')
    const [amountB, setAmountB] = useState<string>('')
    const [enoughBalance, setEnoughBalance] = useState(true)
    const [priceAPerB, setPriceAPerB] = useState<string>('')
    const [priceBPerA, setPriceBPerA] = useState<string>('')
    const [shareOfPool, setShareOfPool] = useState<string>('')

    const chainId = useChainId()
    const tokenSymbols = useReadContracts({
        contracts: SUPPORTED_TOKENS.map((t) => ({
            abi: erc20Abi,
            address: t[chainId],
            functionName: "symbol",
        })),
    })
    const tokenDecimals = useReadContracts({
        contracts: SUPPORTED_TOKENS.map((t) => ({
            abi: erc20Abi,
            address: t[chainId],
            functionName: "decimals",
        })),
    })

    const account = useAccount()
    const writeErc20Approve = useWriteErc20Approve()
    const writeAmmRouterAddLiquidity = useWriteAmmRouterAddLiquidity()

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({ hash })

    const { tokenA, tokenB, setTokenA, setTokenB } = useTokenPair(pair)

    const ammRouterGetReserves = useReadAmmRouterGetReserves({
        args: [tokenA?.address!, tokenB?.address!],
    })
    const tokenAReserve = ammRouterGetReserves.data ? ammRouterGetReserves.data[0] : BigInt(0)
    const tokenBReserve = ammRouterGetReserves.data ? ammRouterGetReserves.data[1] : BigInt(0)
    const tokenPair = ammRouterGetReserves.data ? ammRouterGetReserves.data[2] : undefined

    const tokenAAllowance = useReadErc20Allowance({
        address: tokenA?.address,
        args: [
            account.address!,
            ammRouterAddress[chainId]
        ],
    })
    const tokenBAllowance = useReadErc20Allowance({
        address: tokenB?.address,
        args: [
            account.address!,
            ammRouterAddress[chainId]
        ],
    })

    const tokenABalance = useReadErc20BalanceOf({
        address: tokenA?.address,
        args: [account.address!],
    })
    const tokenBBalance = useReadErc20BalanceOf({
        address: tokenB?.address,
        args: [account.address!],
    })

    useEffect(() => {
        if (!(tokenA && tokenB && amountA && amountB)) {
            return
        }

        const priceA = parseFloat(amountB) / parseFloat(amountA)
        const priceB = parseFloat(amountA) / parseFloat(amountB)
        setPriceAPerB(priceA.toFixed(6))
        setPriceBPerA(priceB.toFixed(6))

        const valA = parseUnits(amountA, tokenA.decimals)
        const sharePercent =
            (100 * +valA.toString()) /
            (+valA.toString() + +tokenAReserve.toString())
        setShareOfPool(
            sharePercent < 0.01
                ? '<0.01'
                : sharePercent > 99.99 && sharePercent < 100
                    ? '>99.99'
                    : sharePercent.toFixed(2)
        )
    }, [tokenA, tokenB, amountA, amountB, tokenAReserve])

    const selectTokenA = (symbol: string) => {
        if (!symbol || symbol === tokenB?.symbol) {
            return
        }
        if (!tokenSymbols.data || !tokenDecimals.data) {
            return
        }
        const idx = tokenSymbols.data.findIndex(s => s.result === symbol)
        const decimals = tokenDecimals.data[idx].result as number
        const address = SUPPORTED_TOKENS[idx][chainId]
        setTokenA({
            symbol,
            decimals,
            address
        })
    }

    const selectTokenB = (symbol: string) => {
        if (!symbol || symbol === tokenA?.symbol) {
            return
        }
        if (!tokenSymbols.data || !tokenDecimals.data) {
            return
        }
        const idx = tokenSymbols.data.findIndex(s => s.result === symbol)
        const decimals = tokenDecimals.data[idx].result as number
        const address = SUPPORTED_TOKENS[idx][chainId]
        setTokenB({
            symbol,
            decimals,
            address
        })
    }

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!tokenA || !tokenB) {
            return
        }

        if (!tokenABalance.data || !tokenBBalance.data) {
            return
        }

        const v = e.target.value

        const id = e.target.id
        const isTokenA = id === 'tokenA'
        const valV = isTokenA
            ? parseUnits(v, tokenA.decimals)
            : parseUnits(v, tokenB.decimals)
        const balance = isTokenA ? tokenABalance.data : tokenBBalance.data
        if (valV > balance) {
            return
        }

        if (isTokenA) {
            setAmountA(v)
            if (tokenPair) {
                const valB = (valV * tokenBReserve) / tokenAReserve
                setAmountB(formatUnits(valB, tokenB.decimals))
                setEnoughBalance(
                    valV <= tokenABalance.data && valB <= tokenBBalance.data
                )
            }
        } else {
            setAmountB(v)
            if (tokenPair) {
                const valA = (valV * tokenAReserve) / tokenBReserve
                setAmountA(formatUnits(valA, tokenA.decimals))
                setEnoughBalance(
                    valV <= tokenBBalance.data && valA <= tokenABalance.data
                )
            }
        }
    }

    const handleSupply = async () => {
        if (!account.address) {
            return
        }

        if (!tokenA || !tokenB) {
            return
        }

        if (
            tokenAAllowance.data === undefined ||
            tokenBAllowance.data === undefined
        ) {
            return
        }

        if (amountA === '0' || amountB === '0') {
            return
        }

        const valA = parseUnits(amountA, tokenA.decimals)
        if (tokenAAllowance.data < valA) {
            await writeErc20Approve.writeContractAsync({
                account: account.address,
                address: tokenA.address,
                args: [ammRouterAddress[chainId], valA],
            })
        }

        const valB = parseUnits(amountB, tokenB.decimals)
        if (tokenBAllowance.data < valB) {
            await writeErc20Approve.writeContractAsync({
                account: account.address,
                address: tokenB.address,
                args: [ammRouterAddress[chainId], valB],
            })
        }

        const res = await writeAmmRouterAddLiquidity.writeContractAsync({
            args: [
                tokenA.address,
                tokenB.address,
                valA,
                valB,
                BigInt(0),
                BigInt(0),
                account.address,
                BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
            ],
        })

        setHash(res)

        setAmountA('')
        setAmountB('')
    }

    return {
        transactionStatus: {
            isPending: writeErc20Approve.isPending ||
                writeAmmRouterAddLiquidity.isPending,
            error: writeErc20Approve.error ||
                writeAmmRouterAddLiquidity.error,
            isConfirming,
            isConfirmed,
            hash,
        },
        loading: tokenSymbols.isLoading ||
            tokenDecimals.isLoading ||
            tokenABalance.isLoading ||
            tokenBBalance.isLoading,
        tokenA,
        tokenB,
        amountA,
        amountB,
        priceBPerA,
        priceAPerB,
        tokenABalance,
        tokenBBalance,
        tokenSymbols,
        shareOfPool,
        enoughBalance,
        selectTokenA,
        selectTokenB,
        handleSupply,
        handleAmountChange,
    }
}
