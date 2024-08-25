"use client"

import { formatUnits, parseUnits } from 'viem';
import { useState, useEffect, ChangeEvent, SetStateAction } from 'react';
import { useAccount, useBalance, useChainId, useReadContracts } from 'wagmi';
import {
    erc20Abi,
    ammRouterAddress,
    useWriteErc20Approve,
    useReadErc20Allowance,
    useReadErc20BalanceOf,
    useReadAmmRouterGetReserves,
    useWriteAmmRouterAddLiquidity,
    useWriteAmmRouterAddLiquidityEth,
} from '@/generated';
import { ETH, SUPPORTED_TOKENS } from '@/lib/tokens';
import { Token, useTokenPair } from '@/hooks/useTokenPair';
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
    const writeAmmRouterAddLiquidityEth = useWriteAmmRouterAddLiquidityEth()

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({ hash })

    const { wethAddr, tokenA, tokenB, setTokenA, setTokenB } = useTokenPair(pair)

    const ammRouterGetReserves = useReadAmmRouterGetReserves({
        args: [tokenA?.address!, tokenB?.address!],
    })
    const tokenAReserve = ammRouterGetReserves.data ? ammRouterGetReserves.data[0] : BigInt(0)
    const tokenBReserve = ammRouterGetReserves.data ? ammRouterGetReserves.data[1] : BigInt(0)
    const tokenPair = ammRouterGetReserves.data ? ammRouterGetReserves.data[2] : undefined

    const ethBalance = useBalance({
        address: account.address
    })
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
    const tokenAAllowanceData = tokenA?.isETH ? ethBalance.data?.value : tokenAAllowance.data
    const tokenBAllowanceData = tokenB?.isETH ? ethBalance.data?.value : tokenBAllowance.data

    const tokenABalance = useReadErc20BalanceOf({
        address: tokenA?.address,
        args: [account.address!],
    })
    const tokenBBalance = useReadErc20BalanceOf({
        address: tokenB?.address,
        args: [account.address!],
    })
    const tokenABalanceData = tokenA?.isETH ? ethBalance.data?.value : tokenABalance.data
    const tokenBBalanceData = tokenB?.isETH ? ethBalance.data?.value : tokenBBalance.data

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

    const selectToken = (val: string, tokenCheck: Token | null, setToken: (value: SetStateAction<Token | null>) => void) => {
        if (!val) {
            return
        }

        if (val === ETH.symbol) {
            if (val === tokenCheck?.symbol) {
                return
            }

            if (tokenCheck?.address === wethAddr) {
                // not support ETH/WETH pair
                return
            }

            setToken({
                symbol: ETH.symbol,
                decimals: ETH.decimals,
                address: wethAddr,
                isETH: true
            })
            return
        }

        if (!tokenSymbols.data || !tokenDecimals.data) {
            return
        }

        const idx = +val
        const symbol = tokenSymbols.data[+idx].result as string
        if (!symbol || symbol === tokenCheck?.symbol) {
            return
        }

        const decimals = tokenDecimals.data[idx].result as number
        const address = SUPPORTED_TOKENS[idx][chainId]
        if (address === wethAddr && tokenCheck?.isETH) {
            // not support ETH/WETH pair
            return
        }

        setToken({
            symbol,
            decimals,
            address,
            isETH: false
        })
    }

    const selectTokenA = (val: string) => {
        selectToken(val, tokenB, setTokenA)
    }

    const selectTokenB = (val: string) => {
        selectToken(val, tokenA, setTokenB)
    }

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!tokenA || !tokenB) {
            return
        }

        if (!tokenABalanceData || !tokenBBalanceData) {
            return
        }

        const v = e.target.value

        const id = e.target.id
        const isTokenA = id === 'tokenA'
        const valV = isTokenA
            ? parseUnits(v, tokenA.decimals)
            : parseUnits(v, tokenB.decimals)
        const balance = isTokenA ? tokenABalanceData : tokenBBalanceData
        if (valV > balance) {
            return
        }

        if (isTokenA) {
            setAmountA(v)
            if (tokenPair) {
                const valB = (valV * tokenBReserve) / tokenAReserve
                setAmountB(formatUnits(valB, tokenB.decimals))
                setEnoughBalance(
                    valV <= tokenABalanceData && valB <= tokenBBalanceData
                )
            }
        } else {
            setAmountB(v)
            if (tokenPair) {
                const valA = (valV * tokenAReserve) / tokenBReserve
                setAmountA(formatUnits(valA, tokenA.decimals))
                setEnoughBalance(
                    valV <= tokenBBalanceData && valA <= tokenABalanceData
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
            tokenAAllowanceData === undefined ||
            tokenBAllowanceData === undefined
        ) {
            return
        }

        if (amountA === '0' || amountB === '0') {
            return
        }

        const valA = parseUnits(amountA, tokenA.decimals)
        if (tokenAAllowanceData < valA && !tokenA.isETH) {
            await writeErc20Approve.writeContractAsync({
                account: account.address,
                address: tokenA.address,
                args: [ammRouterAddress[chainId], valA],
            })
        }

        const valB = parseUnits(amountB, tokenB.decimals)
        if (tokenBAllowanceData < valB && !tokenB.isETH) {
            await writeErc20Approve.writeContractAsync({
                account: account.address,
                address: tokenB.address,
                args: [ammRouterAddress[chainId], valB],
            })
        }

        let res = '' as `0x${string}`
        if (tokenA.isETH) {
            res = await writeAmmRouterAddLiquidityEth.writeContractAsync({
                args: [
                    tokenB.address,
                    valB,
                    BigInt(0),
                    BigInt(0),
                    account.address,
                    BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                ],
                value: valA
            })

        } else if (tokenB.isETH) {
            res = await writeAmmRouterAddLiquidityEth.writeContractAsync({
                args: [
                    tokenA.address,
                    valA,
                    BigInt(0),
                    BigInt(0),
                    account.address,
                    BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                ],
                value: valB
            })
        } else {
            res = await writeAmmRouterAddLiquidity.writeContractAsync({
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
        }

        setHash(res)
        setAmountA('')
        setAmountB('')
    }

    return {
        transactionStatus: {
            isPending: writeErc20Approve.isPending ||
                writeAmmRouterAddLiquidityEth.isPending ||
                writeAmmRouterAddLiquidity.isPending,
            error: writeErc20Approve.error ||
                writeAmmRouterAddLiquidityEth.error ||
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
        tokenABalanceData,
        tokenBBalanceData,
        tokenSymbols,
        shareOfPool,
        enoughBalance,
        selectTokenA,
        selectTokenB,
        handleSupply,
        handleAmountChange,
    }
}
