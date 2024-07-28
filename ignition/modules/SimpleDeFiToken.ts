import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SimpleDeFiTokenModule = buildModule("SimpleDeFiToken", (m) => {
    const simpleDeFiToken = m.contract("SimpleDeFiToken");
    return { simpleDeFiToken };
});

export default SimpleDeFiTokenModule;
