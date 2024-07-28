import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

import { toWei } from "./utils";

describe("SimpleDeFiToken", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deploySimpleDeFiTokenFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await hre.ethers.getSigners();
        const SimpleDeFiToken = await hre.ethers.getContractFactory("SimpleDeFiToken");
        const simpleDeFiToken = await SimpleDeFiToken.deploy();
        return { simpleDeFiToken, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should set the right name", async function () {
            const { simpleDeFiToken } = await loadFixture(deploySimpleDeFiTokenFixture);
            expect(await simpleDeFiToken.name()).to.equal("Simple DeFi Token");
        });

        it("Should set the right symbol", async function () {
            const { simpleDeFiToken } = await loadFixture(deploySimpleDeFiTokenFixture);
            expect(await simpleDeFiToken.symbol()).to.equal("SDFT");
        });

        it("Should set the right total supply", async function () {
            const { simpleDeFiToken } = await loadFixture(deploySimpleDeFiTokenFixture);
            expect(await simpleDeFiToken.totalSupply()).to.equal(toWei(1000000));
        });
    });

    describe("Transfers", function () {
        it("Should transfer the token from one to another", async function () {
            const { simpleDeFiToken, owner, otherAccount } = await loadFixture(deploySimpleDeFiTokenFixture);
            expect(await simpleDeFiToken.balanceOf(owner.address)).to.equal(toWei(1000000))
            await simpleDeFiToken.connect(owner).transfer(otherAccount.address, toWei(5))
            expect(await simpleDeFiToken.balanceOf(otherAccount.address)).to.equal(toWei(5))
            expect(await simpleDeFiToken.balanceOf(owner.address)).to.equal(toWei(1000000 - 5))
        });

        it("Cannot transfer when transfer amount exceed the balance", async function () {
            const { simpleDeFiToken, owner, otherAccount } = await loadFixture(deploySimpleDeFiTokenFixture);
            await simpleDeFiToken.connect(owner).transfer(otherAccount.address, toWei(5))
            expect(await simpleDeFiToken.balanceOf(otherAccount.address)).to.equal(toWei(5))
            await (
                expect(
                    simpleDeFiToken.connect(otherAccount).transfer(owner.address, toWei(10))
                    // https://hardhat.org/hardhat-chai-matchers/docs/reference#.revertedwithcustomerror
                ).to.be.revertedWithCustomError(simpleDeFiToken, "ERC20InsufficientBalance")
            )
            expect(await simpleDeFiToken.balanceOf(otherAccount.address)).to.equal(toWei(5))
            expect(await simpleDeFiToken.balanceOf(owner.address)).to.equal(toWei(1000000 - 5))
        });

        it("Should burn token automatically when calling transferWithAutoBurn", async () => {
            const { simpleDeFiToken, owner, otherAccount } = await loadFixture(deploySimpleDeFiTokenFixture);
            await simpleDeFiToken.connect(owner).transfer(otherAccount.address, toWei(1))
            await simpleDeFiToken.connect(otherAccount).transferWithAutoBurn(owner.address, toWei(1))
        })
    });

});
