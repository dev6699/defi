'use client';

import { useWriteSimpleDeFiTokenTransfer } from '@/generated';
import { BaseError, useWaitForTransactionReceipt } from 'wagmi';

export default function NormalTransfer() {

    const {
        data: hash,
        error,
        isPending,
        writeContract,
    } = useWriteSimpleDeFiTokenTransfer()
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
        <form onSubmit={handleSubmit} className="bg-white border border-black p-4 rounded text-black">
            <h2 className="text-xl font-bold mb-4">Normal Transfer</h2>
            <div className="mb-4">
                <label htmlFor="recipient" className="block mb-2">Recipient Address</label>
                <input
                    type="text"
                    id="recipient"
                    name="recipient"
                    className="w-full p-2 border border-black rounded"
                    placeholder="Enter recipient address"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="amount" className="block mb-2">Amount</label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    className="w-full p-2 border border-black rounded"
                    placeholder="Enter amount to transfer"
                    required
                />
            </div>
            <button
                disabled={isPending}
                type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                {isPending ? 'Transfering...' : 'Transfer'}
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