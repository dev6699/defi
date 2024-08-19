"use client"

import Link from 'next/link';
import { formatUnits } from 'viem';
import { TokenPair } from '@/hooks/useTokenPair';

interface TokenPairDetailProps {
    tokenPair: TokenPair
}

export default function TokenPairDetail({
    tokenPair
}: TokenPairDetailProps) {
    const {
        address,
        tokenPairTotalSupply,
        tokenPairBalanceOf,
        tokenAReserve,
        tokenBReserve,
        tokenA,
        tokenB,
    } = tokenPair

    // Estimation
    const shareRatio = tokenPairTotalSupply.data && tokenPairBalanceOf.data ? (+tokenPairBalanceOf.data.toString() / +tokenPairTotalSupply.data.toString()) : 0
    const tokenAPooled = +formatUnits(BigInt(Math.round(shareRatio * +tokenAReserve.toString())), tokenA!.decimals)
    const tokenBPooled = +formatUnits(BigInt(Math.round(shareRatio * +tokenBReserve.toString())), tokenB!.decimals)

    return (
        <div className="p-4 border-t border-gray-300">

            <div className="flex justify-between items-center mb-2">
                <span>Pooled {tokenA?.symbol}:</span>
                <span> {tokenAPooled.toFixed(6)} </span>
            </div>
            <div className="flex justify-between items-center mb-2">
                <span>Pooled {tokenB?.symbol}:</span>
                <span>{tokenBPooled.toFixed(6)} </span>
            </div>

            <div className="flex justify-between items-center mb-4">
                <span>Share of Pool:</span>
                <span>{(+(100 * shareRatio).toString()).toFixed(2)}%</span>
            </div>

            <div className="flex justify-end space-x-2">
                <Link href={`liquidity/remove?pair=${address}`}>
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                        Remove
                    </button>
                </Link>
                <Link href={`liquidity/add?pair=${address}`}>
                    <button className="bg-white text-black px-4 py-2 rounded border border-black hover:bg-gray-100 transition-colors">
                        Add
                    </button>
                </Link>
            </div>
        </div>
    );
};
