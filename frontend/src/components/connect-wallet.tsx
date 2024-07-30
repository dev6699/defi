"use client"

import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, Connector } from 'wagmi'

interface Message {
    type: 'success' | 'error';
    content: string;
}

export default function ConnectWallet() {
    const [showConnectors, setShowConnectors] = useState(false);
    const [message, setMessage] = useState<Message | null>(null);

    const account = useAccount()
    const { connectors, connect } = useConnect()
    const { disconnect } = useDisconnect()
    const balance = useBalance({ address: account.address })

    const handleConnect = (connector: Connector) => {
        console.log(`Connecting with ${connector}`);
        connect({ connector }, {
            onError(error, variables, context) {
                setMessage({ type: 'error', content: `Failed to connect: ${error.message}` });
                console.log('error', error, variables, context)
            },
            onSuccess(data, variables, context) {
                setMessage({ type: 'success', content: `Successfully connected with ${connector.name}` });
                console.log('sucess', data, variables, context)
            },
        })
        setShowConnectors(false)
    };

    const handleDisconnect = () => {
        disconnect({}, {
            onError(error, variables, context) {
                setMessage({ type: 'success', content: `Failed to disconnect wallet: ${error.message}` });
            },
            onSuccess(data, variables, context) {
                setMessage({ type: 'success', content: 'Wallet disconnected' });
            },
        })
        setShowConnectors(false)
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className="relative">
            {account.status === 'connected' ?
                <button
                    className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100"
                    onClick={() => setShowConnectors(!showConnectors)}
                >
                    {account.address.slice(0, 6)}...{account.address.slice(-4)}
                </button>
                :
                <button
                    className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100"
                    onClick={() => setShowConnectors(!showConnectors)}
                >
                    Connect Wallet
                </button>
            }

            {showConnectors && (
                <div className="absolute right-0 mt-2 w-100 bg-white border border-gray-300 rounded shadow-lg text-black">
                    {account.status === 'connected' ?
                        <>
                            <div className="p-2 border-b">
                                <p>Balance: {balance?.data?.formatted} {balance.data?.symbol}</p>
                                <p>Chain ID: {account.chainId}</p>
                                <p className="truncate">Address: {account.address}</p>
                            </div>
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={handleDisconnect}
                            >
                                Disconnect
                            </button>
                        </>
                        :
                        connectors.map((connector) => (
                            <button
                                key={connector.name}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={() => handleConnect(connector)}
                            >
                                {connector.name}
                            </button>
                        ))
                    }
                </div>
            )}

            {message && (
                <div className={`text-sm absolute right-0 mt-2 p-2 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.content}
                </div>
            )}
        </div>
    )
}