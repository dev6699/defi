"use client"

import { erc20Abi, formatUnits, parseUnits } from "viem"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useAccount, useBalance, useChainId, useReadContracts, useWaitForTransactionReceipt } from "wagmi"

import { ETH, SUPPORTED_TOKENS } from "@/lib/tokens"
import { Address, Graph, buildGraphFromEdges, findAllPaths } from "@/lib/graph"
import {
    ammRouterAbi,
    ammRouterAddress,
    useReadErc20Allowance,
    useReadErc20BalanceOf,
    useWriteAmmRouterSwapEthForExactTokens,
    useWriteAmmRouterSwapExactEthForTokens,
    useWriteAmmRouterSwapExactTokensForEth,
    useWriteAmmRouterSwapExactTokensForTokens,
    useWriteAmmRouterSwapTokensForExactEth,
    useWriteAmmRouterSwapTokensForExactTokens,
    useWriteErc20Approve,
    useWriteWethDeposit,
    useWriteWethWithdraw,
    wethAddress
} from "@/generated"
import { Token, TokenPair } from "./useTokenPair"

export enum SWAP_MODE {
    SWAP = "SWAP",
    WRAP = "WRAP",
    UNWRAP = "UNWRAP"
}

export const useSwap = (tokenPairs: TokenPair[]) => {
    const [hash, setHash] = useState('' as `0x${string}`);
    const [tokenA, setTokenA] = useState<Token | null>(null);
    const [tokenB, setTokenB] = useState<Token | null>(null);

    const amountARef = useRef("");
    const amountBRef = useRef("");
    const lastInteractTokenRef = useRef({ token: '', amount: '' });

    const [amountA, setAmountA] = useState('')
    const [amountB, setAmountB] = useState('')
    const [price, setPrice] = useState(0)
    const [priceImpact, setPriceImpact] = useState(0)

    const [graph, setGraph] = useState<Graph>(new Map())
    const [paths, setPaths] = useState<Address[][]>([])
    const [bestPath, setBestPaths] = useState<Address[]>([])

    useEffect(() => {
        // Build graph from tokenPairs
        const edges: [Token, Token][] = []
        for (const p of tokenPairs) {
            if (!p.tokenA || !p.tokenB) {
                continue
            }
            edges.push([p.tokenA, p.tokenB])
        }

        setGraph(buildGraphFromEdges(edges))
        if (edges.length) {
            // Set tokenA and tokenB from the first token pair
            const [_tokenA, _tokenB] = edges[0]
            setTokenA(_tokenA)
            setTokenB(_tokenB)
        }
    }, [tokenPairs])

    useEffect(() => {
        if (!tokenA || !tokenB) {
            return
        }

        if (tokenA.address === tokenB.address) {
            return
        }

        // find all available paths from tokenA to tokenB
        const _paths = findAllPaths(tokenA.address, tokenB.address, graph)
        setPaths(_paths)
        if (JSON.stringify(_paths) !== JSON.stringify(paths)) {
            // only clear best paths when new paths is different
            // changing of ETH <-> WETH will get same paths
            setBestPaths([])
        }
    }, [tokenA, tokenB, graph])

    const account = useAccount()
    const chainId = useChainId()
    const ethBalance = useBalance({
        address: account.address
    })
    const wethAddr = wethAddress[chainId]

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

    const getAmountsOut = useReadContracts({
        contracts: paths.map(
            (p) => ({
                abi: ammRouterAbi,
                address: ammRouterAddress[chainId],
                functionName: "getAmountsOut",
                args: [parseUnits(amountA, tokenA?.decimals!), p],
            })
        )
    })

    const getAmountsIn = useReadContracts({
        contracts: paths.map(
            (p) => ({
                abi: ammRouterAbi,
                address: ammRouterAddress[chainId],
                functionName: "getAmountsIn",
                args: [parseUnits(amountB, tokenB?.decimals!), p],
            })
        )
    })

    const getReserves = useReadContracts({
        contracts: Array.from({ length: bestPath.length - 1 }).map(
            (_, i) => ({
                abi: ammRouterAbi,
                address: ammRouterAddress[chainId],
                functionName: "getReserves",
                args: [bestPath[i], bestPath[i + 1]],
            })
        )
    })

    const tokenAAllowance = useReadErc20Allowance({
        address: tokenA?.address,
        args: [
            account.address!,
            ammRouterAddress[chainId]
        ],
    })
    const tokenAAllowanceData = tokenA?.isETH ? ethBalance.data?.value : tokenAAllowance.data

    const swapMode = tokenA?.isETH && tokenB?.address === wethAddr ? SWAP_MODE.WRAP
        : tokenA?.address === wethAddr && tokenB?.isETH ? SWAP_MODE.UNWRAP : SWAP_MODE.SWAP

    const writeErc20Approve = useWriteErc20Approve()
    const writeAmmRouterSwapExactTokensForTokens = useWriteAmmRouterSwapExactTokensForTokens()
    const writeAmmRouterSwapTokensForExactTokens = useWriteAmmRouterSwapTokensForExactTokens()
    const writeAmmRouterSwapExactEthForTokens = useWriteAmmRouterSwapExactEthForTokens()
    const writeAmmRouterSwapEthForExactTokens = useWriteAmmRouterSwapEthForExactTokens()
    const writeAmmRouterSwapTokensForExactEth = useWriteAmmRouterSwapTokensForExactEth()
    const writeAmmRouterSwapExactTokensForEth = useWriteAmmRouterSwapExactTokensForEth()
    const writeWethDeposit = useWriteWethDeposit()
    const writeWethWithdraw = useWriteWethWithdraw()

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({ hash })

    useEffect(() => {
        if (!getReserves.data || !price) {
            return
        }

        let oldPrice = 1
        getReserves.data.forEach((d, i) => {
            const [reserveA, reserveB] = d.result as unknown as [bigint, bigint]
            oldPrice = oldPrice * Number(formatUnits(reserveA, graph.get(bestPath[i])!.token.decimals))
                / Number(formatUnits(reserveB, graph.get(bestPath[i + 1])!.token.decimals))
        })

        setPriceImpact(100 * (price / oldPrice - 1))
    }, [getReserves.data, price])

    useEffect(() => {
        if (swapMode !== SWAP_MODE.SWAP) {
            return
        }

        if (!getAmountsOut.data || !tokenB) {
            return
        }

        if (!amountA) {
            setAmountB('')
            amountBRef.current = ''
            return
        }

        if (amountA === amountARef.current) {
            return
        }

        let _bestPath: Address[] = []
        let max = `${Number.MIN_SAFE_INTEGER}`
        getAmountsOut.data.forEach((d, idx) => {
            if (!d.result) {
                return
            }

            const result = d.result as unknown as bigint[]
            const amountOut = formatUnits(result[result.length - 1], tokenB.decimals)
            if (+amountOut > +max) {
                max = amountOut
                _bestPath = paths[idx]
            }
        })
        if (!_bestPath.length) {
            return
        }

        amountBRef.current = max
        setAmountB(max)
        setBestPaths(_bestPath)
        setPrice(+amountA / +max)
    }, [getAmountsOut.data, swapMode])

    useEffect(() => {
        if (swapMode !== SWAP_MODE.SWAP) {
            return
        }

        if (!getAmountsIn.data || !tokenA) {
            return
        }

        if (!amountB) {
            setAmountA('')
            amountARef.current = ''
            return
        }

        if (amountB === amountBRef.current) {
            return
        }

        let _bestPath: Address[] = []
        let min = `${Number.MAX_SAFE_INTEGER}`
        getAmountsIn.data.forEach((d, idx) => {
            if (!d.result) {
                return
            }

            const result = d.result as unknown as bigint[]
            const amountIn = formatUnits(result[0], tokenA.decimals)
            if (+amountIn < +min) {
                min = amountIn
                _bestPath = paths[idx]
            }
        })
        if (!_bestPath.length) {
            return
        }

        amountARef.current = min
        setAmountA(min)
        setBestPaths(_bestPath)
        setPrice(+min / +amountB)
    }, [getAmountsIn.data, swapMode])

    const reorderToken = () => {
        if (lastInteractTokenRef.current.token === tokenA?.symbol) {
            setAmountB(lastInteractTokenRef.current.amount)
        }
        if (lastInteractTokenRef.current.token === tokenB?.symbol) {
            setAmountA(lastInteractTokenRef.current.amount)
        }
        setTokenA(tokenB)
        setTokenB(tokenA)
    }

    const selectToken = (
        val: string,
        t: "A" | "B"
    ) => {
        const isA = t === 'A'
        const tokenCheck = isA ? tokenB : tokenA
        const setToken = isA ? setTokenA : setTokenB

        if (!val) {
            return
        }

        if (val === ETH.symbol) {
            if (val === tokenCheck?.symbol) {
                return
            }

            setToken({
                symbol: ETH.symbol,
                decimals: ETH.decimals,
                address: wethAddr,
                isETH: true
            })

            if (tokenCheck?.address === wethAddr) {
                if (isA) {
                    setAmountA(amountB)
                } else {
                    setAmountB(amountA)
                }
            }
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
        lastInteractTokenRef.current.token = symbol
        setToken({
            symbol,
            decimals,
            address,
            isETH: false
        })
        if (address === wethAddr && tokenCheck?.isETH) {
            if (isA) {
                setAmountA(amountB)
            } else {
                setAmountB(amountA)
            }
        }
    }

    const selectTokenA = (val: string) => {
        selectToken(val, "A")
    }

    const selectTokenB = (val: string) => {
        selectToken(val, "B")
    }

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value
        const id = e.target.id
        const isTokenA = id === 'tokenA'
        const isSwap = swapMode === SWAP_MODE.SWAP
        if (isTokenA) {
            setAmountA(v)
            if (!isSwap) {
                setAmountB(v)
            }
        } else {
            setAmountB(v)
            if (!isSwap) {
                setAmountA(v)
            }
        }
        const token = (isTokenA ? tokenA?.symbol : tokenB?.symbol) || ''
        lastInteractTokenRef.current = { token, amount: v }
    }

    const handleSwap = async () => {
        if (!account.address) {
            return
        }

        if (!tokenA || !tokenB) {
            return
        }

        if (tokenAAllowanceData === undefined) {
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

        let res = '' as `0x${string}`
        const swapWithExact = lastInteractTokenRef.current.token === tokenA.symbol
        if (swapWithExact) {
            // Mininum amount to receive
            const amountOutMin = parseUnits(`${+amountB * 0.9}`, tokenB.decimals)
            if (tokenA.isETH) {
                res = await writeAmmRouterSwapExactEthForTokens.writeContractAsync({
                    args: [
                        amountOutMin,
                        bestPath,
                        account.address,
                        BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                    ],
                    value: valA
                })
            } else if (tokenB.isETH) {
                res = await writeAmmRouterSwapExactTokensForEth.writeContractAsync({
                    args: [
                        valA,
                        amountOutMin,
                        bestPath,
                        account.address,
                        BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                    ],
                })
            } else {
                res = await writeAmmRouterSwapExactTokensForTokens.writeContractAsync({
                    args: [
                        valA,
                        amountOutMin,
                        bestPath,
                        account.address,
                        BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                    ],
                })
            }
        } else {
            // Maximum amount to spent
            const amountInMax = parseUnits(`${+amountA * 1.1}`, tokenA.decimals)
            const amountOut = parseUnits(amountB, tokenB.decimals)
            if (tokenA.isETH) {
                res = await writeAmmRouterSwapEthForExactTokens.writeContractAsync({
                    args: [
                        amountInMax,
                        bestPath,
                        account.address,
                        BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                    ],
                    value: amountOut
                })
            } else if (tokenB.isETH) {
                res = await writeAmmRouterSwapTokensForExactEth.writeContractAsync({
                    args: [
                        amountOut,
                        amountInMax,
                        bestPath,
                        account.address,
                        BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                    ],
                })
            } else {
                res = await writeAmmRouterSwapTokensForExactTokens.writeContractAsync({
                    args: [
                        amountOut,
                        amountInMax,
                        bestPath,
                        account.address,
                        BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                    ],
                })
            }
        }
        setHash(res)
    };

    const handleWrap = async () => {
        if (!account.address) {
            return
        }

        if (!tokenA || !tokenB) {
            return
        }

        if (tokenAAllowanceData === undefined) {
            return
        }

        if (amountA === '0' || amountB === '0') {
            return
        }

        const valA = parseUnits(amountA, tokenA.decimals)
        let res = '' as `0x${string}`
        if (swapMode === SWAP_MODE.WRAP) {
            res = await writeWethDeposit.writeContractAsync({
                value: valA
            })
        }
        if (swapMode === SWAP_MODE.UNWRAP) {
            res = await writeWethWithdraw.writeContractAsync({
                args: [
                    valA
                ]
            })
        }

        setHash(res)
    }

    return {
        transactionStatus: {
            isPending: writeErc20Approve.isPending ||
                writeAmmRouterSwapExactTokensForTokens.isPending ||
                writeAmmRouterSwapTokensForExactTokens.isPending,
            error: writeErc20Approve.error ||
                writeAmmRouterSwapExactTokensForTokens.error ||
                writeAmmRouterSwapTokensForExactTokens.error,
            isConfirming,
            isConfirmed,
            hash,
        },
        swapMode,
        canSwap: !!bestPath.length,
        tokenSymbols,
        tokenA,
        tokenB,
        amountA,
        amountB,
        tokenABalanceData,
        tokenBBalanceData,
        bestSwapPath: printSwapPath(bestPath, graph),
        price,
        priceImpact,
        selectTokenA,
        selectTokenB,
        reorderToken,
        handleAmountChange,
        handleSwap,
        handleWrap
    }
}

const printSwapPath = (path: Address[], graph: Graph) => {
    let result = '';
    if (!path || path.length < 2) {
        return result;
    }
    for (const address of path) {
        result += ` => ${graph.get(address)?.token.symbol}`;
    }
    return result.substring(4);
}