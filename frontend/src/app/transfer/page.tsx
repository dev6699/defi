"use client"

import { useChainId } from 'wagmi'
import { barTokenAddress, fooTokenAddress, memeTokenAddress, simpleDeFiTokenAddress, wethAddress } from '@/generated'

import Token from '@/components/token'

export default function Transfer() {
  const chainId = useChainId()

  return (
    <div className='flex flex-col w-full gap-4'>
      <Token address={wethAddress[chainId]} />
      <Token address={simpleDeFiTokenAddress[chainId]} />
      <Token address={memeTokenAddress[chainId]} />
      <Token address={fooTokenAddress[chainId]} />
      <Token address={barTokenAddress[chainId]} />
    </div >
  )
}