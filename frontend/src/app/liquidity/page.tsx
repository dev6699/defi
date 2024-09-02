"use client"

import Link from 'next/link';

import { useAllPairs } from '@/hooks/useAllPairs';

import Loader from '@/components/loader';
import TokenPair from "@/components/token-pair";

export default function Liquidity() {

    const { allPairsResult, loaded } = useAllPairs()

    if (!loaded) {
        return <Loader />
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Liquidity</h1>
                <Link href={"liquidity/add"}>
                    <button className="bg-white text-black px-4 py-2 rounded">Add Liquidity</button>
                </Link>
            </div>
            <div>
                {allPairsResult.map((address, index) => (
                    <TokenPair key={index} address={address} />
                ))}
            </div>
        </div>
    );
};
