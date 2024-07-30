import ConnectWallet from '../components/connect-wallet'

import Token from '../components/token/detail'
import NormalTransfer from '../components/token/normal-transfer'
import TransferWithBurn from '../components/token/transfer-with-burn'

export default function Home() {

  return (
    <div className="min-h-screen bg-white text-black">
      <nav className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">DeFi Application</h1>
          <ConnectWallet />
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <Token />
          <div className="space-y-4">
            <NormalTransfer />
            <TransferWithBurn />
          </div>
        </div>
      </main>
    </div>
  )
}