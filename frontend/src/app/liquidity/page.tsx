"use client"

import Link from 'next/link';
import TokenPair from "@/components/token-pair";
import { useAllPairs } from '@/hooks/useAllPairs';

export default function Liquidity() {

    const { allPairs } = useAllPairs()

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Liquidity</h1>
                <Link href={"liquidity/add"}>
                    <button className="bg-white text-black px-4 py-2 rounded">Add Liquidity</button>
                </Link>
            </div>
            <div>
                {allPairs.data?.map((pair, index) => (
                    <TokenPair key={index} address={pair.result as `0x${string}`} />
                ))}
            </div>
        </div>
    );
};
