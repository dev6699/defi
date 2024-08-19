'use client';

import { useNormalTransfer } from '@/hooks/useNormalTransfer';
import TransactionStatus from '../transaction-status';

interface NormalTransferProps {
    address: `0x${string}`
    decimals: number
}

export default function NormalTransfer({ address, decimals }: NormalTransferProps) {

    const {
        transactionStatus,
        handleSubmit,
    } = useNormalTransfer({ address, decimals });

    return (
        <form onSubmit={handleSubmit} className="border-t border-white mt-4 pt-4">
            <h2 className="text-xl font-bold mb-2">Normal Transfer</h2>
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
                <label htmlFor="amount" className="block mb-2">Amount</label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    className="w-full p-2 text-black"
                    placeholder="Enter amount to transfer"
                    required
                />
            </div>

            <button
                disabled={transactionStatus.isPending}
                type="submit"
                className="w-full bg-white text-black px-4 py-2 rounded hover:bg-gray-200 mr-2">
                {transactionStatus.isPending ? "Transferring..." : "Transfer"}
            </button>
            <TransactionStatus transactionStatus={transactionStatus} />
        </form>
    )
}