"use client"

import { useMemo, useState } from "react"
import { useBlockNumber } from "wagmi"

import { useWriteStakingPoolDeposit } from "@/generated"

import { TokenPair } from "./useTokenPair"
import { StakingPool } from "./useStakingPool"

export const useStakingPools = (_stakingPools: StakingPool[], tokenPairs: TokenPair[], isFarm: boolean) => {

    const [hideExpired, setHideExpired] = useState(false)
    const [expanded, setExpanded] = useState(new Set<string>())

    const blockNumber = useBlockNumber()
    const currentBlock = blockNumber.data || BigInt(0)

    const stakingPools = useMemo(() => {
        const pools: StakingPool[] = []
        for (const p of _stakingPools) {

            let stakedTokenSymbol = p.stakedToken.symbol
            const lpToken = tokenPairs.find(t => t.address === p.stakedToken.address)
            if (lpToken) {
                if (!isFarm) {
                    continue
                }
                stakedTokenSymbol = `LP Token ${lpToken.tokenA?.symbol || ''}-${lpToken.tokenB?.symbol || ''}`
            } else {
                if (isFarm) {
                    continue
                }
            }

            if (hideExpired && p.rewardEndBlock > currentBlock) {
                continue
            }

            pools.push({
                ...p,
                stakedToken: {
                    ...p.stakedToken,
                    symbol: stakedTokenSymbol
                }
            })
        }
        return pools
    }, [_stakingPools, tokenPairs, hideExpired, currentBlock, isFarm])

    const writeStakingPoolDeposit = useWriteStakingPoolDeposit()

    const handleHideExpired = () => {
        setHideExpired(e => !e)
    }

    const handleExpand = (addr: string) => {
        if (expanded.has(addr)) {
            expanded.delete(addr)
        } else {
            expanded.add(addr)
        }
        setExpanded(new Set(expanded))
    }

    const handleHarvest = async (address: `0x${string}`) => {
        await writeStakingPoolDeposit.writeContractAsync({ address, args: [BigInt(0)] })
    }

    return {
        hideExpired,
        currentBlock,
        stakingPools,
        expanded,
        handleHideExpired,
        handleExpand,
        handleHarvest
    }
}