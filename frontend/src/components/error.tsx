interface ErrorProps {
    message: string
}

export default function Error({ message }: ErrorProps) {
    return (
        <div className="bg-red-700 text-white p-2 rounded-md shadow-md">
            <p>{message}</p>
        </div>
    )
}