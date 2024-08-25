import {
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

import { toWei } from "./utils";

describe("WETH", function () {
    async function deployWETHFixture() {
        const [owner, otherAccount, otherAccount2] = await hre.ethers.getSigners();
        const WETH = await hre.ethers.getContractFactory("WETH");
        const weth = await WETH.deploy();
        return { weth, owner, otherAccount, otherAccount2 };
    }

    describe("Deployment", function () {
        it("Should set the correct name, symbol, and decimals", async function () {
            const { weth } = await loadFixture(deployWETHFixture);
            expect(await weth.name()).to.equal("Wrapped Ether");
            expect(await weth.symbol()).to.equal("WETH");
            expect(await weth.decimals()).to.equal(18);
        });
    })

    describe("Deposit", function () {
        it("should allow deposit and update balance", async function () {
            const { weth, owner } = await loadFixture(deployWETHFixture);
            const depositAmount = toWei(1)

            await expect(weth.deposit({ value: depositAmount }))
                .to.emit(weth, "Deposit")
                .withArgs(owner.address, depositAmount)

            expect(await weth.balanceOf(owner.address)).to.equal(depositAmount);
        });

        it("should return total supply correctly", async function () {
            const { weth, owner, otherAccount } = await loadFixture(deployWETHFixture);

            const depositAmount = toWei(1)
            await weth.connect(owner).deposit({ value: depositAmount });
            expect(await weth.totalSupply()).to.equal(depositAmount);
            await weth.connect(otherAccount).deposit({ value: depositAmount });
            expect(await weth.totalSupply()).to.equal(depositAmount * BigInt(2));
        });
    })

    describe("Withdrawal", function () {
        it("should allow withdrawal and update balance", async function () {
            const { weth, owner } = await loadFixture(deployWETHFixture);

            const depositAmount = toWei(1)
            await weth.deposit({ value: depositAmount });

            await expect(weth.withdraw(depositAmount))
                .to.emit(weth, "Withdrawal")
                .withArgs(owner.address, depositAmount)

            expect(await weth.balanceOf(owner.address)).to.equal(0);
        });

        it("should return total supply correctly", async function () {
            const { weth } = await loadFixture(deployWETHFixture);

            const depositAmount = toWei(10)
            await weth.deposit({ value: depositAmount });
            expect(await weth.totalSupply()).to.equal(depositAmount);
            await weth.withdraw(depositAmount / BigInt(2));
            expect(await weth.totalSupply()).to.equal(depositAmount / BigInt(2));
            await weth.withdraw(depositAmount / BigInt(2));
            expect(await weth.totalSupply()).to.equal(BigInt(0));
        });
    })

    describe("Transfer", function () {
        it("should allow transfer between accounts", async function () {
            const { weth, owner, otherAccount } = await loadFixture(deployWETHFixture);

            const depositAmount = toWei(1)
            await weth.deposit({ value: depositAmount });

            await expect(weth.transfer(otherAccount.address, depositAmount))
                .to.emit(weth, "Transfer")
                .withArgs(owner.address, otherAccount.address, depositAmount)

            expect(await weth.balanceOf(owner.address)).to.equal(0);
            expect(await weth.balanceOf(otherAccount.address)).to.equal(depositAmount)
        });

        it("should allow approval and transferFrom by another account", async function () {
            const { weth, owner, otherAccount, otherAccount2 } = await loadFixture(deployWETHFixture);

            const depositAmount = toWei(10)
            await weth.deposit({ value: depositAmount });

            await expect(weth
                .connect(otherAccount)
                .transferFrom(owner.address, otherAccount2.address, depositAmount)
            ).to.be.revertedWithoutReason()

            expect(await weth.approve(otherAccount.address, depositAmount))
                .to.emit(weth, "Approval")
                .withArgs(owner.address, otherAccount.address, depositAmount)
            expect(await weth.allowance(owner.address, otherAccount.address)).to.equal(depositAmount);

            const transferAmount = depositAmount / BigInt(2)
            await expect(
                weth.connect(otherAccount).transferFrom(owner.address, otherAccount2.address, transferAmount)
            ).to.emit(weth, "Transfer").withArgs(owner.address, otherAccount2.address, transferAmount)

            expect(await weth.allowance(owner.address, otherAccount.address)).to.equal(transferAmount);
            expect(await weth.balanceOf(owner.address)).to.equal(transferAmount);
            expect(await weth.balanceOf(otherAccount2.address)).to.equal(transferAmount);

            await weth.connect(otherAccount).transferFrom(owner.address, otherAccount2.address, transferAmount)
            expect(await weth.allowance(owner.address, otherAccount.address)).to.equal(BigInt(0));
            expect(await weth.balanceOf(owner.address)).to.equal(BigInt(0));
            expect(await weth.balanceOf(otherAccount2.address)).to.equal(depositAmount);
        });
    })
});
