"use client"

import { useState } from 'react';
import TokenPairDetail from './detail';
import { useTokenPair } from '@/hooks/useTokenPair';

interface TokenPairProps {
    address: `0x${string}`
}

export default function TokenPair({
    address
}: TokenPairProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const tokenPair = useTokenPair(address)
    const {
        tokenA,
        tokenB,
        tokenPairBalance,
    } = tokenPair

    if (tokenPairBalance === "0") {
        return null
    }

    return (
        <div className="border border-gray-300 rounded-lg mb-4">
            <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex justify-between items-center w-full">
                    <h3 className="font-bold">{tokenA?.symbol}/{tokenB?.symbol}</h3>
                    <p>Liquidity Pool Balance: {tokenPairBalance}</p>
                </div>
                <span className="ml-4">{isExpanded ? '▲' : '▼'}</span>
            </div>

            {isExpanded && (
                <TokenPairDetail tokenPair={tokenPair} />
            )}
        </div>
    );
};
