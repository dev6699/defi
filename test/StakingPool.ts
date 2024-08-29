import {
    loadFixture,
    mine,
    mineUpTo,
    reset
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

import { toWei } from "./utils";

describe("StakingPool", function () {
    async function deployStakingPoolFixture() {
        const [owner, otherAccount, otherAccount2] = await hre.ethers.getSigners();

        const rewardPerBlock = toWei(100)
        const rewardStartBlock = 100
        const rewardEndBlock = 200
        const WrongToken = await hre.ethers.getContractFactory("BarToken");
        const wrongToken = await WrongToken.deploy();
        const StakedToken = await hre.ethers.getContractFactory("SimpleDeFiToken");
        const stakedToken = await StakedToken.deploy();
        const RewardToken = await hre.ethers.getContractFactory("MemeToken");
        const rewardToken = await RewardToken.deploy();
        const StakingPool = await hre.ethers.getContractFactory("StakingPool");
        const stakingPool = await StakingPool.deploy(
            stakedToken,
            rewardToken,
            rewardPerBlock,
            rewardStartBlock,
            rewardEndBlock
        );
        // transfer rewardToken to stakingPool as reward to be given to user
        await rewardToken.transfer(stakingPool, await rewardToken.totalSupply())

        return {
            owner,
            otherAccount,
            otherAccount2,
            stakingPool,
            wrongToken,
            stakedToken,
            rewardToken,
            rewardPerBlock,
            rewardStartBlock,
            rewardEndBlock
        };
    }

    describe("Deployment", function () {
        it("Should set the correct initial values", async function () {
            const {
                stakingPool,
                stakedToken,
                rewardToken,
                rewardPerBlock,
                rewardStartBlock,
                rewardEndBlock
            } = await loadFixture(deployStakingPoolFixture);
            expect(await stakingPool.stakedToken()).to.eq(stakedToken)
            expect(await stakingPool.rewardToken()).to.eq(rewardToken)
            expect(await stakingPool.rewardPerBlock()).to.eq(rewardPerBlock)
            expect(await stakingPool.rewardStartBlock()).to.eq(rewardStartBlock)
            expect(await stakingPool.rewardEndBlock()).to.eq(rewardEndBlock)
            expect(await stakingPool.lastRewardBlock()).to.eq(rewardStartBlock)
            expect(await stakingPool.PRECISION_FACTOR()).to.eq(10 ** +(BigInt(30) - await rewardToken.decimals()).toString())
        });
    })

    describe("Deposit", function () {
        it("Should update user staked token amount, stakedTokenSupply but no reward when deposit before stake period started", async function () {
            await reset()
            const {
                owner,
                stakingPool,
                stakedToken,
                rewardPerBlock,
                rewardStartBlock,
            } = await loadFixture(deployStakingPoolFixture);

            const stakedTokenBalanceBefore = await stakedToken.balanceOf(owner)

            expect(await stakingPool.stakedTokenSupply()).to.eq(BigInt(0))
            const [userAmountBefore, userRewardDebtBefore] = await stakingPool.userInfo(owner)
            expect(userAmountBefore).to.eq(BigInt(0))
            expect(userRewardDebtBefore).to.eq(BigInt(0))

            const depositAmount = toWei(100)
            await stakedToken.approve(stakingPool, depositAmount)
            await expect(
                stakingPool.deposit(depositAmount)
            ).to.emit(stakingPool, "Deposit")
                .withArgs(owner.address, depositAmount)

            expect(await stakingPool.stakedTokenSupply()).to.eq(depositAmount)
            const [userAmountAfter, userRewardDebtAfter] = await stakingPool.userInfo(owner)
            expect(userAmountAfter).to.eq(depositAmount)
            expect(userRewardDebtAfter).to.eq(BigInt(0))
            expect(stakedTokenBalanceBefore - await stakedToken.balanceOf(owner)).to.eq(depositAmount)
            expect(await stakedToken.balanceOf(stakingPool)).to.eq(depositAmount)

            expect(await stakingPool.getPendingReward(owner)).to.eq(BigInt(0))

            await stakedToken.approve(stakingPool, depositAmount)
            await stakingPool.deposit(depositAmount)
            expect(await stakingPool.stakedTokenSupply()).to.eq(depositAmount * BigInt(2))
            expect(await stakingPool.getPendingReward(owner)).to.eq(BigInt(0))
            const [userAmountAfter2, userRewardDebtAfter2] = await stakingPool.userInfo(owner)
            expect(userAmountAfter2).to.eq(depositAmount * BigInt(2))
            expect(userRewardDebtAfter2).to.eq(BigInt(0))

            expect(await stakingPool.lastRewardBlock()).to.eq(rewardStartBlock)
            expect(await stakingPool.accTokenPerShare()).to.eq(BigInt(0))

            const numberOfBlock = 10
            await mineUpTo(rewardStartBlock + numberOfBlock)
            expect(await stakingPool.getPendingReward(owner)).to.eq(rewardPerBlock * BigInt(numberOfBlock))
        })

        it("Should store user staked token amount seperately", async function () {
            const {
                owner,
                otherAccount,
                stakingPool,
                stakedToken,
            } = await loadFixture(deployStakingPoolFixture);

            const depositAmount = toWei(100)
            const depositAmount2 = toWei(200)
            await stakedToken.transfer(otherAccount, depositAmount2)
            await stakedToken.approve(stakingPool, depositAmount)
            await stakedToken.connect(otherAccount).approve(stakingPool, depositAmount2)
            await stakingPool.deposit(depositAmount)
            await stakingPool.connect(otherAccount).deposit(depositAmount2)

            expect(await stakingPool.stakedTokenSupply()).to.eq(depositAmount + depositAmount2)
            const user1 = await stakingPool.userInfo(owner)
            const user2 = await stakingPool.userInfo(otherAccount)
            expect(user1[0]).to.eq(depositAmount)
            expect(user2[0]).to.eq(depositAmount2)
        })

        it("Should calculate reward when deposit within stake period", async function () {
            await reset()
            const {
                owner,
                stakingPool,
                stakedToken,
                rewardToken,
                rewardPerBlock,
                rewardStartBlock,
            } = await loadFixture(deployStakingPoolFixture);

            const depositAmount = toWei(100)
            await stakedToken.approve(stakingPool, depositAmount * BigInt(10))

            await mineUpTo(rewardStartBlock)
            const res = await stakingPool.deposit(depositAmount)
            const block = await res.getBlock()
            // update lastRewardBlock to current block
            expect(await stakingPool.lastRewardBlock()).to.eq(block?.number)

            const rewardTokenBalanceBefore = await rewardToken.balanceOf(owner)
            const stakeDuration = 3
            const pendingReward = rewardPerBlock * BigInt(stakeDuration)
            const mineToBlock = block?.number! + stakeDuration - 1

            await mineUpTo(mineToBlock)
            expect(await stakingPool.getPendingReward(owner)).to.eq(depositAmount * BigInt(stakeDuration - 1))

            await stakingPool.deposit(depositAmount)

            // subsequence deposit will calculate and pay pending reward to user
            const rewardTokenBalanceAfter = await rewardToken.balanceOf(owner)
            expect(rewardTokenBalanceAfter - rewardTokenBalanceBefore).to.eq(pendingReward)

            const [userAmount, userRewardDebt] = await stakingPool.userInfo(owner)
            expect(userAmount).to.eq(depositAmount + depositAmount)
            // rewardDebt is used to keep track how long user staked the token
            expect(userRewardDebt).to.eq(userAmount * BigInt(stakeDuration))

            expect(await stakingPool.getPendingReward(owner)).to.eq(BigInt(0))
            await stakingPool.deposit(depositAmount)
        })
    })

    describe("Withdraw", function () {
        it("Should revert if insufficient amount", async function () {
            const {
                stakingPool,
                stakedToken,
            } = await loadFixture(deployStakingPoolFixture);
            const withdrawAmount = toWei(101)
            // no amount at all
            await expect(stakingPool.withdraw(withdrawAmount)).to.be.revertedWith("Insufficient amount to withdraw")

            const depositAmount = toWei(100)
            await stakedToken.approve(stakingPool, depositAmount)
            await stakingPool.deposit(depositAmount)
            // not enough amount
            await expect(stakingPool.withdraw(withdrawAmount)).to.be.revertedWith("Insufficient amount to withdraw")
        })

        it("Should update user staked token amount, stakedTokenSupply but no reward when withdraw before stake period started", async function () {
            const {
                owner,
                stakingPool,
                stakedToken,
                rewardPerBlock,
                rewardStartBlock,
            } = await loadFixture(deployStakingPoolFixture);

            const depositAmount = toWei(100)
            await stakedToken.approve(stakingPool, depositAmount)
            await stakingPool.deposit(depositAmount)

            const stakedTokenBalanceBefore = await stakedToken.balanceOf(owner)
            const [userAmountBefore, userRewardDebtBefore] = await stakingPool.userInfo(owner)
            const stakedTokenSupplyBefore = await stakingPool.stakedTokenSupply()
            const withdrawAmount = toWei(30)
            await expect(stakingPool.withdraw(withdrawAmount))
                .to.emit(stakingPool, "Withdraw")
                .withArgs(owner.address, withdrawAmount)

            const stakedTokenBalanceAfter = await stakedToken.balanceOf(owner)
            const [userAmountAfter, userRewardDebtAfter] = await stakingPool.userInfo(owner)
            const stakedTokenSupplyAfter = await stakingPool.stakedTokenSupply()

            expect(stakedTokenBalanceAfter - stakedTokenBalanceBefore).to.eq(withdrawAmount)
            expect(userAmountBefore - userAmountAfter).to.eq(withdrawAmount)
            expect(stakedTokenSupplyBefore - stakedTokenSupplyAfter).to.eq(withdrawAmount)
            expect(userRewardDebtBefore).to.eq(userRewardDebtAfter).to.eq(BigInt(0))
        })

        it("Should calculate reward when withdraw after stake period started/ended", async function () {
            await reset()
            const {
                owner,
                stakingPool,
                stakedToken,
                rewardToken,
                rewardPerBlock,
                rewardStartBlock,
            } = await loadFixture(deployStakingPoolFixture);

            await mine(rewardStartBlock)

            const depositAmount = toWei(100)
            await stakedToken.approve(stakingPool, depositAmount)
            await stakingPool.deposit(depositAmount)

            // partial withdraw after 3 block
            const stakeDuration = 3
            await mine(stakeDuration - 1)
            const withdrawAmount = toWei(30)
            await stakingPool.withdraw(withdrawAmount)
            expect(await rewardToken.balanceOf(owner)).to.eq(rewardPerBlock * BigInt(stakeDuration))

            const [userAmountAfterPartial, userRewardDebtAfterPartial] = await stakingPool.userInfo(owner)
            expect(userAmountAfterPartial).to.eq(depositAmount - withdrawAmount)
            expect(userRewardDebtAfterPartial).to.eq((depositAmount - withdrawAmount) * BigInt(stakeDuration))

            const withdrawAmountRemaining = depositAmount - withdrawAmount
            await stakingPool.withdraw(withdrawAmountRemaining)
            const [userAmountAfterFull, userRewardDebtAfterFull] = await stakingPool.userInfo(owner)
            expect(userAmountAfterFull).to.eq(BigInt(0))
            expect(userRewardDebtAfterFull).to.eq(BigInt(0))
        })

    })

    describe("Utilities", function () {
        describe("getPendingReward", function () {
            it("Should get correct pendingReward amount from time to time", async function () {
                await reset()
                const {
                    owner,
                    stakingPool,
                    stakedToken,
                    rewardPerBlock,
                    rewardStartBlock,
                    rewardEndBlock
                } = await loadFixture(deployStakingPoolFixture);

                const depositAmount = toWei(100)
                await stakedToken.approve(stakingPool, depositAmount * BigInt(2))

                await stakingPool.deposit(depositAmount)

                // no reward if stake period not started
                expect(await stakingPool.getPendingReward(owner)).to.eq(BigInt(0))

                // first block reward
                await mineUpTo(rewardStartBlock + 1)
                expect(await stakingPool.getPendingReward(owner)).to.eq(rewardPerBlock)

                // last before end reward
                await mineUpTo(rewardEndBlock - 1)
                expect(await stakingPool.getPendingReward(owner)).to.eq(rewardPerBlock * BigInt(rewardEndBlock - rewardStartBlock - 1))

                // end block reward
                await mineUpTo(rewardEndBlock)
                expect(await stakingPool.getPendingReward(owner)).to.eq(rewardPerBlock * BigInt(rewardEndBlock - rewardStartBlock))

                // will only calculate until preset endBlock
                await mineUpTo(rewardEndBlock + 100)
                expect(await stakingPool.getPendingReward(owner)).to.eq(rewardPerBlock * BigInt(rewardEndBlock - rewardStartBlock))

                // will pay pending reward and no more reward since stake period ended
                await stakingPool.deposit(depositAmount)
                await mine(1)
                expect(await stakingPool.getPendingReward(owner)).to.eq(BigInt(0))
            })

            it("Should get different pendingReward for different user", async function () {
                await reset()
                const {
                    owner,
                    otherAccount,
                    stakingPool,
                    stakedToken,
                    rewardPerBlock,
                    rewardStartBlock,
                } = await loadFixture(deployStakingPoolFixture);

                const depositAmount = toWei(100)
                await stakedToken.transfer(otherAccount, depositAmount)

                await stakedToken.approve(stakingPool, depositAmount)
                await stakedToken.connect(otherAccount).approve(stakingPool, depositAmount)

                await mineUpTo(rewardStartBlock - 1)

                await (async () => {
                    await stakingPool.connect(owner).deposit(depositAmount) // block 10
                    await mine(1) // block 11
                    const reward1 = await stakingPool.getPendingReward(owner) // stake through 1 block (10-11)
                    const reward2 = await stakingPool.getPendingReward(otherAccount) // no stake no reward
                    expect(reward1).to.eq(rewardPerBlock)
                    expect(reward2).to.eq(BigInt(0))
                })()

                await (async () => {
                    await stakingPool.connect(otherAccount).deposit(depositAmount) // block 12
                    await mine(1) // block 13
                    const reward1 = await stakingPool.getPendingReward(owner) // stake through 3 block (10, 11, 12)
                    const reward2 = await stakingPool.getPendingReward(otherAccount) // stake through 1 block (12)
                    expect(reward1).to.eq(rewardPerBlock * BigInt(2) + rewardPerBlock / BigInt(2)) // full reward for block 10, 11, half for block 12
                    expect(reward2).to.eq(rewardPerBlock / BigInt(2)) // half for block 12
                })()
            })
        })

        it("recoverWrongTokens", async function () {
            const {
                owner,
                otherAccount,
                stakingPool,
                wrongToken,
                rewardToken,
                stakedToken
            } = await loadFixture(deployStakingPoolFixture)

            await expect(stakingPool.connect(otherAccount).recoverWrongTokens(await rewardToken.getAddress(), 1))
                .to.be.revertedWithCustomError(stakingPool, "OwnableUnauthorizedAccount")

            await expect(stakingPool.recoverWrongTokens(await rewardToken.getAddress(), 1))
                .to.be.rejectedWith("Cannot be reward token")

            await expect(stakingPool.recoverWrongTokens(await stakedToken.getAddress(), 1))
                .to.be.rejectedWith("Cannot be staked token")

            await wrongToken.transfer(await stakingPool.getAddress(), 100)
            expect(await wrongToken.balanceOf(stakingPool)).to.eq(100)
            expect(await wrongToken.balanceOf(owner)).to.eq(await wrongToken.totalSupply() - BigInt(100))
            await expect(stakingPool.recoverWrongTokens(await wrongToken.getAddress(), 100))
                .to.emit(stakingPool, "RecoverToken")
                .withArgs(await wrongToken.getAddress(), 100)

            expect(await wrongToken.balanceOf(stakingPool)).to.eq(0)
            // wrong token will be transfer to stakingPool owner
            expect(await wrongToken.balanceOf(owner)).to.eq(await wrongToken.totalSupply())
        })

        it("stopRewards", async function () {
            const {
                otherAccount,
                stakingPool,
            } = await loadFixture(deployStakingPoolFixture)

            await expect(stakingPool.connect(otherAccount).stopRewards())
                .to.be.revertedWithCustomError(stakingPool, "OwnableUnauthorizedAccount")

            const nexBlockNumber = await hre.ethers.provider.getBlockNumber() + 1
            await expect(stakingPool.stopRewards())
                .to.emit(stakingPool, "StopRewards")
                .withArgs(nexBlockNumber)

            expect(await stakingPool.rewardEndBlock()).to.eq(nexBlockNumber)
        })

        it("updateRewardPerBlock", async function () {
            await reset()
            const {
                otherAccount,
                stakingPool,
                rewardStartBlock
            } = await loadFixture(deployStakingPoolFixture)

            const newRewardPerBlock = toWei(5)
            await expect(stakingPool.connect(otherAccount).updateRewardPerBlock(newRewardPerBlock))
                .to.be.revertedWithCustomError(stakingPool, "OwnableUnauthorizedAccount")

            await expect(stakingPool.updateRewardPerBlock(newRewardPerBlock))
                .to.emit(stakingPool, "UpdateRewardPerBlock")
                .withArgs(newRewardPerBlock)

            expect(await stakingPool.rewardPerBlock()).to.eq(newRewardPerBlock)

            await mineUpTo(rewardStartBlock)
            await expect(stakingPool.updateRewardPerBlock(newRewardPerBlock))
                .to.be.revertedWith("Pool has started")
        })

        it("updateStartAndEndBlocks", async function () {
            // https://hardhat.org/hardhat-network-helpers/docs/reference#reset([url],-[blocknumber])
            await reset()
            const {
                otherAccount,
                stakingPool,
            } = await loadFixture(deployStakingPoolFixture);

            await expect(stakingPool.connect(otherAccount).updateStartAndEndBlocks(1, 2))
                .to.be.revertedWithCustomError(stakingPool, "OwnableUnauthorizedAccount")

            await expect(stakingPool.updateStartAndEndBlocks(10, 5))
                .to.be.revertedWith("New start block must be lower than new end block")

            await expect(stakingPool.updateStartAndEndBlocks(0, 5))
                .to.be.revertedWith("New start block must be higher than current block")

            const newStart = 20
            const newEnd = 30
            await expect(stakingPool.updateStartAndEndBlocks(newStart, newEnd))
                .to.emit(stakingPool, "UpdateStartAndEndBlocks")
                .withArgs(newStart, newEnd)

            expect(await stakingPool.rewardStartBlock()).to.eq(newStart)
            expect(await stakingPool.rewardEndBlock()).to.eq(newEnd)
            expect(await stakingPool.lastRewardBlock()).to.eq(newStart)

            await mineUpTo(newStart)
            await expect(stakingPool.updateStartAndEndBlocks(newStart, newEnd))
                .to.be.revertedWith("Pool has started")
        })
    })
})

