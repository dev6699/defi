import { ethers } from "hardhat";

export const toWei = (n: number) => ethers.parseEther(n.toString())
export const fromWei = (n: string) => ethers.formatEther(n)

export const getAmountOut = (
    amountIn: bigint,
    reserveIn: bigint,
    reserveOut: bigint
) => {
    const amountInWithFee = amountIn * BigInt(998); // 0.2% fee
    const numerator = amountInWithFee * reserveOut;
    const denominator = (reserveIn * BigInt(1000)) + amountInWithFee;
    const amountOut = numerator / denominator;
    return amountOut;
}

export const getAmountIn = (
    amountOut: bigint,
    reserveIn: bigint,
    reserveOut: bigint
) => {
    const numerator = reserveIn * amountOut * BigInt(1000);
    const denominator = (reserveOut - amountOut) * BigInt(998); // 0.2% fee
    const amountIn = numerator / denominator + BigInt(1);

    return amountIn;
}

export const quote = (
    amountA: bigint,
    reserveA: bigint,
    reserveB: bigint
) => (amountA * reserveB) / reserveA

