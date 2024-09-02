"use client"

import { useChainId, useReadContracts } from "wagmi";
import {
    pairFactoryAbi,
    pairFactoryAddress,
    useReadPairFactoryAllPairsLength
} from "@/generated";

export const useAllPairs = () => {
    const chainId = useChainId()
    const allPairsLength = useReadPairFactoryAllPairsLength()

    const allPairs = useReadContracts({
        contracts: Array.from({ length: Number(allPairsLength.data) }).map(
            (_, index) => ({
                abi: pairFactoryAbi,
                address: pairFactoryAddress[chainId],
                functionName: "allPairs",
                args: [BigInt(index)],
            })
        )
    });

    const loaded = allPairsLength.data !== undefined && !(allPairs.data === undefined && allPairsLength.data > 0)

    const allPairsResult = allPairs.data?.map(p => p.result as `0x${string}`) || []

    return {
        loaded,
        allPairsResult
    }
}