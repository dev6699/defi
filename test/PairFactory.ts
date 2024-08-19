import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("PairFactory", function () {

    async function deployPairFactoryFixture() {
        const [owner, otherAccount] = await hre.ethers.getSigners();
        const PairFactory = await hre.ethers.getContractFactory("PairFactory");
        const pairFactory = await PairFactory.deploy();
        const Token0 = await hre.ethers.getContractFactory("SimpleDeFiToken");
        const token0 = await Token0.deploy();
        const Token1 = await hre.ethers.getContractFactory("MemeToken");
        const token1 = await Token1.deploy();
        const Token2 = await hre.ethers.getContractFactory("FooToken");
        const token2 = await Token2.deploy();
        const Token3 = await hre.ethers.getContractFactory("BarToken");
        const token3 = await Token3.deploy();
        return {
            pairFactory,
            token0,
            token1,
            token2,
            token3,
            owner,
            otherAccount,
        };
    }

    describe("Deployment", function () {
        it("Should set the correct owner and rewardTo address", async function () {
            const { pairFactory, owner } = await loadFixture(deployPairFactoryFixture);
            expect(await pairFactory.owner()).to.equal(owner.address);
            expect(await pairFactory.rewardTo()).to.equal(owner.address);
        });

        it("Should have empty pairs", async function () {
            const { pairFactory } = await loadFixture(deployPairFactoryFixture);
            expect(await pairFactory.allPairsLength()).to.equal(0);
        });
    });

    describe("Create Pair", function () {
        it("Should return zero address if pair not created", async function () {
            const { pairFactory, token0, token1 } = await loadFixture(deployPairFactoryFixture);
            const token0Address = await token0.getAddress()
            const token1Address = await token1.getAddress()
            expect(await pairFactory.getPair(token0Address, token1Address)).to.equal(ethers.ZeroAddress)
            expect(await pairFactory.getPair(token1Address, token0Address)).to.equal(ethers.ZeroAddress)
        })

        it("Should add to allPairs after created", async function () {
            const { pairFactory, token0, token1 } = await loadFixture(deployPairFactoryFixture);
            expect(await pairFactory.allPairsLength()).to.equal(0);
            await pairFactory.createPair(
                await token0.getAddress(),
                await token1.getAddress()
            );
            expect(await pairFactory.allPairsLength()).to.equal(1);
        });

        it("Should create a pair and store the address", async function () {
            const { pairFactory, token0, token1 } = await loadFixture(deployPairFactoryFixture);
            const token0Address = await token0.getAddress()
            const token1Address = await token1.getAddress()

            await pairFactory.createPair(token0Address, token1Address)
            const pairAddress = await pairFactory.allPairs(0)
            expect(await pairFactory.getPair(token0Address, token1Address)).to.equal(pairAddress)
            expect(await pairFactory.getPair(token1Address, token0Address)).to.equal(pairAddress)
        })

        it("Should able to create multiple different pairs", async function () {
            const { pairFactory, token0, token1, token2, token3 } = await loadFixture(deployPairFactoryFixture);
            const pairs = [
                [token0, token1],
                [token0, token2],
                [token0, token3],
                [token1, token2],
                [token1, token3],
                [token2, token3],
            ]
            for (let i = 0; i < pairs.length; i++) {
                await pairFactory.createPair(pairs[i][0], pairs[i][1])
            }
            expect(await pairFactory.allPairsLength()).to.equal(pairs.length);
        })

        it("Should not allow creating the same pair twice", async function () {
            const { pairFactory, token0, token1 } = await loadFixture(deployPairFactoryFixture);
            const token0Address = await token0.getAddress()
            const token1Address = await token1.getAddress()

            await pairFactory.createPair(token0Address, token1Address);
            await expect(pairFactory.createPair(token0Address, token1Address)).to.be.revertedWith("PAIR_ALREADY_EXISTS");
            await expect(pairFactory.createPair(token1Address, token0Address)).to.be.revertedWith("PAIR_ALREADY_EXISTS");
        });

        it("Should only allow owner to set rewardTo address", async function () {
            const { pairFactory, otherAccount, owner } = await loadFixture(deployPairFactoryFixture);
            await (
                expect(
                    pairFactory.connect(otherAccount).setRewardTo(otherAccount.address)
                ).to.be.revertedWithCustomError(pairFactory, "OwnableUnauthorizedAccount")
            )
            expect(await pairFactory.rewardTo()).to.equal(owner.address);
            await pairFactory.connect(owner).setRewardTo(otherAccount.address)
            expect(await pairFactory.rewardTo()).to.equal(otherAccount.address);
        });

        it("Should return the correct pair address from Helper.pairFor", async function () {
            const { pairFactory, token0, token1 } = await loadFixture(deployPairFactoryFixture);
            const token0Address = await token0.getAddress()
            const token1Address = await token1.getAddress()
            await pairFactory.createPair(token0Address, token1Address)

            const pairForAddress = await pairFactory.pairFor(token0Address, token1Address)
            expect(await pairFactory.allPairs(0)).to.equal(pairForAddress);
        })
    })
});
