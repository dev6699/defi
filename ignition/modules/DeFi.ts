import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeFiModule = buildModule("DeFi", (m) => {
    const simpleDeFiToken = m.contract("SimpleDeFiToken");
    const memeToken = m.contract("MemeToken");
    const fooToken = m.contract("FooToken");
    const barToken = m.contract("BarToken");
    const pairFactory = m.contract("PairFactory");
    const weth = m.contract("WETH");
    const ammRouter = m.contract("AMMRouter", [pairFactory, weth]);

    return {
        simpleDeFiToken,
        memeToken,
        fooToken,
        barToken,
        pairFactory,
        weth,
        ammRouter
    };
});

export default DeFiModule;
