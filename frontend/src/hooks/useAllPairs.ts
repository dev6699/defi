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

    return {
        allPairs
    }
}