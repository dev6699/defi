"use client"

import { parseUnits } from 'viem';
import { useState, ChangeEvent, SetStateAction } from 'react';
import { useAccount, useBlockNumber, useChainId, useReadContracts, useWaitForTransactionReceipt } from 'wagmi';
import {
    erc20Abi,
    useWriteStakingPoolManagerCreateStakingPool,
} from '@/generated';
import { SUPPORTED_TOKENS } from '@/lib/tokens';
import { Token, TokenPair } from '@/hooks/useTokenPair';

export function useCreateStakingPool(tokenPairs: TokenPair[]) {

    const [hash, setHash] = useState('' as `0x${string}`);

    const [stakedToken, setStakedToken] = useState<Token | null>(null)
    const [rewardToken, setRewardToken] = useState<Token | null>(null)
    const [rewardPerBlock, setRewardPerBlock] = useState('')
    const [startBlock, setStartBlock] = useState('')
    const [endBlock, setEndBlock] = useState('')

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
    const writeStakingPoolManagerCreateStakingPool = useWriteStakingPoolManagerCreateStakingPool()
    const blockNumber = useBlockNumber()
    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({ hash })

    const selectToken = (symbol: string, tokenCheck: Token | null, setToken: (value: SetStateAction<Token | null>) => void) => {
        if (!symbol) {
            return
        }

        if (!tokenSymbols.data || !tokenDecimals.data) {
            return
        }

        const idx = tokenSymbols.data.findIndex(s => s.result === symbol)
        if (idx < 0) {
            return
        }
        if (!symbol || symbol === tokenCheck?.symbol) {
            return
        }

        const decimals = tokenDecimals.data[idx].result as number
        const address = SUPPORTED_TOKENS[idx][chainId]

        setToken({
            symbol,
            decimals,
            address,
            isETH: false
        })
    }

    const selectStakedLPToken = (address: string) => {
        const lpToken = tokenPairs.find(t => t.address === address)
        if (!lpToken) {
            return
        }

        setStakedToken({
            symbol: `${lpToken.tokenA?.symbol}-${lpToken.tokenB?.symbol}`,
            decimals: lpToken.tokenPairDecimals.data!,
            address: address as `0x${string}`,
            isETH: false
        })
    }

    const selectStakedToken = (val: string) => {
        selectToken(val, rewardToken, setStakedToken)
    }

    const selectRewardToken = (val: string) => {
        selectToken(val, stakedToken, setRewardToken)
    }

    const handleRewardPerBlockChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRewardPerBlock(e.target.value)
    }

    const handleStartBlockChange = (e: ChangeEvent<HTMLInputElement>) => {
        setStartBlock(e.target.value)
    }

    const handleEndBlockChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEndBlock(e.target.value)
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!account.address) {
            return
        }

        if (!stakedToken || !rewardToken) {
            return
        }

        const res = await writeStakingPoolManagerCreateStakingPool.writeContractAsync({
            args: [
                stakedToken.address,
                rewardToken.address,
                parseUnits(rewardPerBlock, rewardToken.decimals),
                BigInt(startBlock),
                BigInt(endBlock)
            ],
        })

        setHash(res)
    }

    return {
        transactionStatus: {
            isPending: writeStakingPoolManagerCreateStakingPool.isPending,
            error: writeStakingPoolManagerCreateStakingPool.error,
            isConfirming,
            isConfirmed,
            hash,
        },
        loading: tokenSymbols.isLoading ||
            tokenDecimals.isLoading,
        tokenSymbols,
        currentBlock: blockNumber.data?.toString(),
        rewardPerBlock,
        startBlock,
        endBlock,
        rewardToken,
        stakedToken,
        selectStakedLPToken,
        selectStakedToken,
        selectRewardToken,
        handleCreate,
        handleRewardPerBlockChange,
        handleStartBlockChange,
        handleEndBlockChange
    }
}
