import { BaseError } from "viem";

import Error from "./error";
import Loader from "./loader";

interface TransactionStatusProps {
    transactionStatus: {
        isPending: boolean
        error: any
        hash?: string
        isConfirming: boolean
        isConfirmed: boolean
    }
}

export default function TransactionStatus({
    transactionStatus
}: TransactionStatusProps) {
    const {
        error,
        isConfirmed,
        isConfirming,
        isPending,
        hash
    } = transactionStatus

    if (!isPending && !isConfirmed && !isConfirming && !error) {
        return null
    }

    return (
        <div className="mt-4 border p-2 rounded-sm">
            <h2 className="font-bold text-xl">Transaction Status:</h2>
            <div className="w-min mt-2">
                {
                    isPending &&
                    <Loader />
                }
            </div>
            {error && (
                <Error message={(error as BaseError).shortMessage || error.message} />
            )}
            {
                !isPending && !error &&
                <>
                    {hash && <div className='mt-2'>Transaction Hash: {hash}</div>}
                    {isConfirming && <div>Waiting for confirmation...</div>}
                    {isConfirmed && <div>Transaction confirmed.</div>}
                </>
            }
        </div>
    )
}