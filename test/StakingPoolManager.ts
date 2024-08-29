import {
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("StakingPoolManager", function () {
    async function deployStakingPoolManagerFixture() {
        const [owner, otherAccount, otherAccount2] = await hre.ethers.getSigners();
        const StakedToken = await hre.ethers.getContractFactory("SimpleDeFiToken");
        const stakedToken = await StakedToken.deploy();
        const RewardToken = await hre.ethers.getContractFactory("MemeToken");
        const rewardToken = await RewardToken.deploy();
        const StakingPoolManager = await hre.ethers.getContractFactory("StakingPoolManager");
        const stakingPoolManager = await StakingPoolManager.deploy();

        return {
            owner,
            otherAccount,
            otherAccount2,
            stakedToken,
            rewardToken,
            stakingPoolManager
        };
    }

    describe("Deployment", function () {
        it("Should start with empty staking pools", async function () {
            const {
                stakingPoolManager,
            } = await loadFixture(deployStakingPoolManagerFixture);
            expect((await stakingPoolManager.getAllStakingPools()).length).to.eq(0)
        });
    })

    describe("createStakingPool", function () {
        it("Should create and store staking pool", async function () {
            const {
                owner,
                stakedToken,
                rewardToken,
                stakingPoolManager,
            } = await loadFixture(deployStakingPoolManagerFixture);

            await expect(stakingPoolManager.createStakingPool(
                stakedToken,
                rewardToken,
                1,
                100,
                200
            )).to.emit(stakingPoolManager, "CreateStakingPool")
                .withArgs(owner.address, anyValue) // stakingPool address

            expect((await stakingPoolManager.getAllStakingPools()).length).to.eq(1)
            const createdStakingPoolAddress = await stakingPoolManager.stakingPools(0)
            const createdStakingPool = await hre.ethers.getContractAt("StakingPool", createdStakingPoolAddress)
            expect(await createdStakingPool.owner()).to.eq(owner.address)

            await stakingPoolManager.createStakingPool(
                stakedToken,
                rewardToken,
                1,
                100,
                200
            )
            expect((await stakingPoolManager.getAllStakingPools()).length).to.eq(2)
        })
    })
})