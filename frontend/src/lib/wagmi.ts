import { createClient } from 'viem'
import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { hardhat, mainnet, sepolia } from 'wagmi/chains'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'

export function getConfig() {
  return createConfig({
    chains: [hardhat],//[mainnet, sepolia],
    client({ chain }) {
      return createClient({ chain, transport: http() })
    },
    connectors: [
      injected(),
      // coinbaseWallet(),
      // walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID! }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    // transports: {
    //   [mainnet.id]: http(),
    //   [sepolia.id]: http(),
    //   [hardhat.id]: http(),
    // },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
