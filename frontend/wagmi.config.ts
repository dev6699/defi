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
          31337: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
        }
      }
    })
  ],
})
