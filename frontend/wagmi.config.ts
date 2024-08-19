import { defineConfig } from '@wagmi/cli'
import { react, hardhat } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [],
  plugins: [
    react(),
    hardhat({
      project: "../",
      deployments: {
        SimpleDeFiToken: {
          31337: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
        },
        MemeToken: {
          31337: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
        },
        FooToken: {
          31337: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
        },
        BarToken: {
          31337: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
        },
        PairFactory: {
          31337: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
        },
        AMMRouter: {
          31337: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
        }
      }
    })
  ],
})
