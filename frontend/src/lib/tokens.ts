import {
    barTokenAddress,
    fooTokenAddress,
    memeTokenAddress,
    simpleDeFiTokenAddress,
    wethAddress
} from "@/generated";

export const SUPPORTED_TOKENS = [
    wethAddress,
    simpleDeFiTokenAddress,
    memeTokenAddress,
    fooTokenAddress,
    barTokenAddress
]

export const WETHSymbol = 'WETH'

export const ETH = {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
}
