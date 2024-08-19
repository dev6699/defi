'use client'

import { useWriteSimpleDeFiTokenTransferWithAutoBurn } from '@/generated';
import { BaseError, useWaitForTransactionReceipt } from 'wagmi';

export default function TransferWithBurn() {
    const {
        data: hash,
        error,
        isPending,
        writeContract,
    } = useWriteSimpleDeFiTokenTransferWithAutoBurn()
    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed
    } = useWaitForTransactionReceipt({ hash })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const recipient = formData.get('recipient') as `0x${string}`
        const amount = formData.get('amount') as string
        if (!recipient || !amount) {
            return
        }
        writeContract({
            args: [recipient, BigInt(amount)]
        })
    }

    return (
        <form onSubmit={handleSubmit} className="border border-white p-4 rounded">
            <h2 className="text-xl font-bold mb-4">Transfer with Burn</h2>
            <div className="mb-4">
                <label htmlFor="recipient" className="block mb-2">Recipient Address</label>
                <input
                    type="text"
                    id="recipient"
                    name="recipient"
                    className="w-full p-2 text-black"
                    placeholder="Enter recipient address"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="amount" className="block mb-2">Transfer Amount</label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    className="w-full p-2 text-black"
                    placeholder="Enter amount to transfer (10% of tokens will be burnt automatically)"
                    required
                />
            </div>

            <button
                disabled={isPending}
                type="submit" className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200">
                {isPending ? 'Transfering...' : 'Transfer with Burn'}
            </button>
            {hash && <div>Transaction Hash: {hash}</div>}
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed && <div>Transaction confirmed.</div>}
            {error && (
                <div>Error: {(error as BaseError).shortMessage || error.message}</div>
            )}
        </form>
    )
}