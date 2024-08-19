"use client"

import { useWriteErc20Transfer } from '@/generated';
import { parseUnits } from 'viem';
import { useWaitForTransactionReceipt } from 'wagmi';

interface UseNormalTransferProps {
    address: `0x${string}`;
    decimals: number;
}

export const useNormalTransfer = ({ address, decimals }: UseNormalTransferProps) => {

    const {
        data: hash,
        error,
        isPending,
        writeContractAsync,
    } = useWriteErc20Transfer();

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({ hash });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const recipient = formData.get('recipient') as `0x${string}`
        const amount = formData.get('amount') as string
        if (!recipient || !amount) {
            return
        }
        await writeContractAsync({
            address,
            args: [recipient, parseUnits(amount, decimals)]
        })
    };

    return {
        transactionStatus: {
            isPending,
            isConfirming,
            isConfirmed,
            error,
            hash,
        },
        handleSubmit,
    };
};
