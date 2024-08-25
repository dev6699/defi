"use client"

import { useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useChainId, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import {
    ammRouterAddress,
    useWriteErc20Approve,
    useReadErc20Allowance,
    useWriteAmmRouterRemoveLiquidity,
    useWriteAmmRouterRemoveLiquidityEth,
} from '@/generated';
import { useTokenPair } from '@/hooks/useTokenPair';

export function useRemoveLiquidity(pair: `0x${string}`) {

    const [hash, setHash] = useState('' as `0x${string}`);

    const [amount, setAmount] = useState('');
    const [percentage, setPercentage] = useState(0);

    const account = useAccount();
    const {
        tokenA,
        tokenB,
        tokenPairTotalSupply,
        tokenPairBalance,
        tokenPairBalanceOf,
        tokenPairDecimals,
        tokenAReserve,
        tokenBReserve,
    } = useTokenPair(pair);

    const chainId = useChainId();
    const tokenPairAllowance = useReadErc20Allowance({
        address: pair,
        args: [
            account.address!,
            ammRouterAddress[chainId]
        ],
    });

    const writeErc20Approve = useWriteErc20Approve();
    const writeAmmRouterRemoveLiquidity = useWriteAmmRouterRemoveLiquidity();
    const writeAmmRouterRemoveLiquidityEth = useWriteAmmRouterRemoveLiquidityEth();
    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({ hash })

    // Estimation
    const shareRatio = tokenPairTotalSupply.data && tokenPairDecimals.data && amount ?
        (+parseUnits(amount, tokenPairDecimals.data).toString() / +tokenPairTotalSupply.data.toString()) : 0
    const tokenAPooled = tokenA ? +formatUnits(BigInt(Math.round(shareRatio * +tokenAReserve.toString())), tokenA.decimals) : 0
    const tokenBPooled = tokenB ? +formatUnits(BigInt(Math.round(shareRatio * +tokenBReserve.toString())), tokenB.decimals) : 0

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!tokenPairDecimals.data || !tokenPairBalanceOf.data) {
            return;
        }

        const v = e.target.value;
        const valV = parseUnits(v, tokenPairDecimals.data);
        if (valV > tokenPairBalanceOf.data) {
            return;
        }
        setAmount(v);
        setPercentage((+valV.toString() / +tokenPairBalanceOf.data.toString()) * 100);
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handlePercentChange(+e.target.value);
    };

    const handlePercentChange = (percent: number) => {
        if (!tokenPairBalanceOf.data || !tokenPairDecimals.data) {
            return;
        }
        setPercentage(percent);
        if (percent == 100) {
            setAmount(formatUnits(tokenPairBalanceOf.data, tokenPairDecimals.data));
        } else {
            const amt = BigInt(+tokenPairBalanceOf.data.toString() * (percent / 100));
            setAmount(formatUnits(amt, tokenPairDecimals.data));
        }
    };

    const handleRemove = async () => {
        if (!account.address) {
            return;
        }

        if (!tokenA || !tokenB) {
            return;
        }

        if (
            tokenPairAllowance.data === undefined ||
            tokenPairDecimals.data === undefined ||
            tokenPairBalanceOf.data == undefined
        ) {
            return;
        }

        const amt = parseUnits(amount, tokenPairDecimals.data);
        if (tokenPairAllowance.data < amt) {
            await writeErc20Approve.writeContractAsync({
                account: account.address,
                address: pair,
                args: [ammRouterAddress[chainId], amt],
            });
        }

        let res = '' as `0x${string}`
        if (tokenA.isETH) {
            res = await writeAmmRouterRemoveLiquidityEth.writeContractAsync({
                args: [
                    tokenB.address,
                    amt,
                    BigInt(0),
                    BigInt(0),
                    account.address,
                    BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                ],
            })

        } else if (tokenB.isETH) {
            res = await writeAmmRouterRemoveLiquidityEth.writeContractAsync({
                args: [
                    tokenA.address,
                    amt,
                    BigInt(0),
                    BigInt(0),
                    account.address,
                    BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                ],
            })
        } else {
            res = await writeAmmRouterRemoveLiquidity.writeContractAsync({
                args: [
                    tokenA.address,
                    tokenB.address,
                    amt,
                    BigInt(0),
                    BigInt(0),
                    account.address,
                    BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                ],
            });
        }
        setHash(res)
        handlePercentChange(0);
    };

    return {
        transactionStatus: {
            isPending: writeErc20Approve.isPending ||
                writeAmmRouterRemoveLiquidityEth.isPending ||
                writeAmmRouterRemoveLiquidity.isPending,
            error: writeErc20Approve.error ||
                writeAmmRouterRemoveLiquidityEth.error ||
                writeAmmRouterRemoveLiquidity.error,
            isConfirming,
            isConfirmed,
            hash,
        },
        amount,
        percentage,
        tokenA,
        tokenB,
        tokenAPooled,
        tokenBPooled,
        tokenPairDecimals,
        tokenPairBalance,
        tokenPairBalanceOf,
        handleAmountChange,
        handleSliderChange,
        handlePercentChange,
        handleRemove,
    };
}
