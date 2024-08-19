"use client"

import { useAccount } from "wagmi"

export default function Home() {

  const account = useAccount()

  if (!account.isConnected) {
    return (
      <div className='text-center'>
        Please connect to a wallet to start.
      </div>
    )
  }

  return (
    <div className='flex flex-col w-full'>
      <h1 className="text-4xl font-bold mb-4">Welcome to DeFi Application</h1>
      <p className="mb-4">Connected as <span className="font-bold">{account.address}</span></p>
      <h3 className="font-bold">Connected Addresses:</h3>
      {
        account?.addresses?.map(a => {
          return (
            <p key={a}>{a}</p>
          )
        })
      }
      <p className="my-4">Connector: {account.connector?.name}</p>
      {
        account.chain &&
        <>
          <p className="mb-4">Chain Name: {account.chain?.name}</p>
          <p className="mb-4">Chain Id: {account.chain?.id}</p>
        </>
      }
    </div >
  )
}