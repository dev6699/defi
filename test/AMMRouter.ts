import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { quote, toWei } from "./utils";

describe("AMMRouter", function () {

    async function deployAMMRouterFixture() {
        const [owner, otherAccount] = await hre.ethers.getSigners();
        const PairFactory = await hre.ethers.getContractFactory("PairFactory");
        const pairFactory = await PairFactory.deploy();
        const AMMRouter = await hre.ethers.getContractFactory("AMMRouter");
        const ammRouter = await AMMRouter.deploy(pairFactory);
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
            ammRouter,
            token0,
            token1,
            token2,
            token3,
            owner,
            otherAccount,
        };
    }

    describe("Deployment", function () {
        it("Should set the correct factory address", async function () {
            const { pairFactory, ammRouter } = await loadFixture(deployAMMRouterFixture);
            expect(await ammRouter.factory()).to.equal(await pairFactory.getAddress());
        });
    });

    describe("AddLiquidity", function () {

        it("Should create tokenPair if not exist", async function () {
            const { pairFactory, ammRouter, token0, token1, owner } = await loadFixture(deployAMMRouterFixture);

            const ammRouterAddress = await ammRouter.getAddress()
            const token0Address = await token0.getAddress()
            const token1Address = await token1.getAddress()
            expect(await pairFactory.getPair(token0Address, token1Address)).to.eq(ethers.ZeroAddress)
            expect(await pairFactory.allPairsLength()).to.eq(0)

            const token0Amount = toWei(10)
            const token1Amount = toWei(10)

            const token0BalanceBefore = await token0.balanceOf(owner)
            const token1BalanceBefore = await token1.balanceOf(owner)

            await token0.connect(owner).approve(ammRouterAddress, token0Amount)
            await token1.connect(owner).approve(ammRouterAddress, token1Amount)
            await ammRouter.addLiquidity(
                token0Address,
                token1Address,
                token0Amount,
                token1Amount,
                BigInt(0),
                BigInt(0),
                owner.address,
                BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
            )

            expect(await pairFactory.allPairsLength()).to.eq(1)
            const tokenPairAddress = await pairFactory.getPair(token0Address, token1Address)
            const tokenPair = await hre.ethers.getContractAt("TokenPair", tokenPairAddress)
            expect(await tokenPair.balanceOf(owner)).to.greaterThan(BigInt(0))
            expect(await tokenPair.tokenA()).to.eq(token0Address)
            expect(await tokenPair.tokenB()).to.eq(token1Address)

            const [token0Reserve, token1Reserve] = await tokenPair.getReserves()
            expect(token0Reserve).to.eq(token0Amount)
            expect(token1Reserve).to.eq(token1Amount)

            const token0BalanceAfter = await token0.balanceOf(owner)
            const token1BalanceAfter = await token1.balanceOf(owner)
            expect(token0BalanceBefore - token0BalanceAfter).to.eq(token0Reserve)
            expect(token1BalanceBefore - token1BalanceAfter).to.eq(token1Reserve)
        })

        it("Should add to existing tokenPair reserve if exist", async function () {
            const { pairFactory, ammRouter, token0, token1, owner } = await loadFixture(deployAMMRouterFixture);

            const ammRouterAddress = await ammRouter.getAddress()
            const token0Address = await token0.getAddress()
            const token1Address = await token1.getAddress()

            const token0Amount = toWei(10)
            const token1Amount = toWei(10)

            const token0BalanceBefore = await token0.balanceOf(owner)
            const token1BalanceBefore = await token1.balanceOf(owner)

            await token0.connect(owner).approve(ammRouterAddress, token0Amount)
            await token1.connect(owner).approve(ammRouterAddress, token1Amount)
            expect(await pairFactory.allPairsLength()).to.eq(0)
            await ammRouter.addLiquidity(
                token0Address,
                token1Address,
                token0Amount / BigInt(2),
                token1Amount / BigInt(2),
                BigInt(0),
                BigInt(0),
                owner.address,
                BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
            )
            expect(await pairFactory.allPairsLength()).to.eq(1)
            await ammRouter.addLiquidity(
                token1Address,
                token0Address, // order doesn't matter as it will be sorted
                token1Amount / BigInt(2),
                token0Amount / BigInt(2),
                BigInt(0),
                BigInt(0),
                owner.address,
                BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
            )
            expect(await pairFactory.allPairsLength()).to.eq(1)

            const tokenPairAddress = await pairFactory.getPair(token0Address, token1Address)
            const tokenPair = await hre.ethers.getContractAt("TokenPair", tokenPairAddress)
            const [token0Reserve, token1Reserve] = await tokenPair.getReserves()
            expect(token0Reserve).to.eq(token0Amount)
            expect(token1Reserve).to.eq(token1Amount)

            const token0BalanceAfter = await token0.balanceOf(owner)
            const token1BalanceAfter = await token1.balanceOf(owner)
            expect(token0BalanceBefore - token0BalanceAfter).to.eq(token0Reserve)
            expect(token1BalanceBefore - token1BalanceAfter).to.eq(token1Reserve)
        })

        it("Should use optimal amount for existing tokenPair", async function () {
            const { pairFactory, ammRouter, token0, token1, owner } = await loadFixture(deployAMMRouterFixture);

            const ammRouterAddress = await ammRouter.getAddress()
            const token0Address = await token0.getAddress()
            const token1Address = await token1.getAddress()

            const token0Amount = toWei(10)
            const token1Amount = toWei(10)
            const token0AmountAdd = toWei(10)
            const token1AmountAdd = toWei(15)
            const token1AmountAddOptimal = quote(token0AmountAdd, token0Amount, token1Amount)

            const token0BalanceBefore = await token0.balanceOf(owner)
            const token1BalanceBefore = await token1.balanceOf(owner)

            await token0.connect(owner).approve(ammRouterAddress, token0Amount + token0AmountAdd)
            await token1.connect(owner).approve(ammRouterAddress, token1Amount + token1AmountAdd)

            await ammRouter.addLiquidity(
                token0Address,
                token1Address,
                token0Amount,
                token1Amount,
                BigInt(0),
                BigInt(0),
                owner.address,
                BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
            )

            await expect(
                ammRouter.addLiquidity(
                    token0Address,
                    token1Address,
                    token0AmountAdd,
                    token1AmountAdd,
                    BigInt(0),
                    token1AmountAdd,
                    owner.address,
                    BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
                )
                // revert because optimal amount less than desired amount
            ).to.be.revertedWith('INSUFFICIENT_tokenB_AMOUNT')

            await expect(
                ammRouter.addLiquidity(
                    token1Address,
                    token0Address,
                    token1AmountAdd,
                    token0AmountAdd,
                    token1AmountAdd,
                    BigInt(0),
                    owner.address,
                    BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
                )
                // revert because optimal amount less than desired amount
            ).to.be.revertedWith('INSUFFICIENT_tokenA_AMOUNT')

            await ammRouter.addLiquidity(
                token0Address,
                token1Address,
                token0AmountAdd,
                token1AmountAdd,
                BigInt(0),
                BigInt(0),
                owner.address,
                BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
            )

            const tokenPairAddress = await pairFactory.getPair(token0Address, token1Address)
            const tokenPair = await hre.ethers.getContractAt("TokenPair", tokenPairAddress)
            const [token0Reserve, token1Reserve] = await tokenPair.getReserves()
            expect(token0Reserve).to.eq(token0Amount + token0AmountAdd)
            expect(token1Reserve).to.eq(token1Amount + token1AmountAddOptimal)

            const token0BalanceAfter = await token0.balanceOf(owner)
            const token1BalanceAfter = await token1.balanceOf(owner)
            expect(token0BalanceBefore - token0BalanceAfter).to.eq(token0Reserve)
            expect(token1BalanceBefore - token1BalanceAfter).to.eq(token1Reserve)
        })
    })

    describe("RemoveLiquidity", function () {

        it("Should burn liquidity tokens and return token pairs", async function () {
            const { pairFactory, ammRouter, token0, token1, owner } = await loadFixture(deployAMMRouterFixture);

            const ammRouterAddress = await ammRouter.getAddress()
            const token0Address = await token0.getAddress()
            const token1Address = await token1.getAddress()

            const token0BalanceBefore = await token0.balanceOf(owner)
            const token1BalanceBefore = await token1.balanceOf(owner)

            const token0Amount = toWei(10)
            const token1Amount = toWei(10)

            await token0.connect(owner).approve(ammRouterAddress, token0Amount)
            await token1.connect(owner).approve(ammRouterAddress, token1Amount)
            await ammRouter.addLiquidity(
                token0Address,
                token1Address,
                token0Amount,
                token1Amount,
                BigInt(0),
                BigInt(0),
                owner.address,
                BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
            )

            const tokenPairAddress = await pairFactory.getPair(token0Address, token1Address)
            const tokenPair = await hre.ethers.getContractAt("TokenPair", tokenPairAddress)
            const liquidity = await tokenPair.balanceOf(owner)
            expect(liquidity).to.be.greaterThan(BigInt(0))

            await tokenPair.connect(owner).approve(ammRouterAddress, liquidity)

            await expect(
                ammRouter.connect(owner).removeLiquidity(
                    token0Address,
                    token1Address,
                    liquidity,
                    token0Amount,
                    BigInt(0),
                    owner.address,
                    BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
                )
            ).to.be.revertedWith("INSUFFICIENT_A_AMOUNT")

            await expect(
                ammRouter.connect(owner).removeLiquidity(
                    token0Address,
                    token1Address,
                    liquidity,
                    BigInt(0),
                    token1Amount,
                    owner.address,
                    BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
                )
            ).to.be.revertedWith("INSUFFICIENT_B_AMOUNT")

            await ammRouter.connect(owner).removeLiquidity(
                token0Address,
                token1Address,
                liquidity,
                BigInt(0),
                BigInt(0),
                owner.address,
                BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
            )

            const liquidityAfter = await tokenPair.balanceOf(owner)
            expect(liquidityAfter).to.eq(BigInt(0))

            const token0BalanceAfter = await token0.balanceOf(owner)
            const token1BalanceAfter = await token1.balanceOf(owner)
            // 1000n burnt when creating initial tokenPair
            expect(token0BalanceAfter).to.eq(token0BalanceBefore - BigInt(1000))
            expect(token1BalanceAfter).to.eq(token1BalanceBefore - BigInt(1000))

            // tokenPair still exist even all liquidity has been removed
            expect(await pairFactory.allPairsLength()).to.eq(1)
            expect(await pairFactory.allPairs(0)).to.eq(tokenPairAddress)
        })
    })

    describe("Swap", function () {

        const setupLiquidity = async () => {
            const { ammRouter, token0, token1, token2, token3, owner } = await loadFixture(deployAMMRouterFixture);

            const ammRouterAddress = await ammRouter.getAddress()
            const token0Address = await token0.getAddress()
            const token1Address = await token1.getAddress()
            const token2Address = await token2.getAddress()
            const token3Address = await token3.getAddress()

            const token0Amount = toWei(10000)
            const token1Amount = toWei(10000)
            const token2Amount = toWei(10000)
            const token3Amount = toWei(10000)

            await token0.connect(owner).approve(ammRouterAddress, token0Amount)
            await token1.connect(owner).approve(ammRouterAddress, token1Amount)
            await token2.connect(owner).approve(ammRouterAddress, token2Amount)
            await token3.connect(owner).approve(ammRouterAddress, token3Amount)

            await ammRouter.addLiquidity(
                token0Address,
                token1Address,
                toWei(1000),
                toWei(1000),
                BigInt(0),
                BigInt(0),
                owner.address,
                BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
            )
            await ammRouter.addLiquidity(
                token1Address,
                token2Address,
                toWei(1000),
                toWei(2000),
                BigInt(0),
                BigInt(0),
                owner.address,
                BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
            )
            await ammRouter.addLiquidity(
                token2Address,
                token3Address,
                toWei(1000),
                toWei(5000),
                BigInt(0),
                BigInt(0),
                owner.address,
                BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
            )
            await ammRouter.addLiquidity(
                token3Address,
                token0Address,
                toWei(1000),
                toWei(1000),
                BigInt(0),
                BigInt(0),
                owner.address,
                BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
            )
            // token0 ---------------------- token1
            //    |    1 token0 for 1 token1    |
            //    |    1 token1 for 2 token2    |
            //    |    1 token2 for 5 token3    |
            //    |    1 token3 for 1 token0    |
            // token3 ---------------------- token2

            // optimal path to swap token0 with token1: token0 -> token1
            // non-optimal path to swap token0 with token1: token0 -> token3 -> token2 -> token1
            return {
                owner,
                ammRouter,
                token0Address,
                token1Address,
                token2Address,
                token3Address,
                token0,
                token1,
                token2,
                token3
            }
        }

        it("swapExactTokensForTokens", async function () {
            const {
                owner,
                ammRouter,
                token0Address,
                token1Address,
                token2Address,
                token3Address,
                token0,
                token1,
            } = await setupLiquidity()
            await expect(
                ammRouter.swapExactTokensForTokens(
                    toWei(100000000000),
                    toWei(100000000000),
                    [token0Address, token1Address],
                    owner.address,
                    BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
                )
            ).to.be.revertedWith('INSUFFICIENT_OUTPUT_AMOUNT')
            await expect(
                ammRouter.swapExactTokensForTokens(
                    toWei(1),
                    toWei(0.9),
                    [],
                    owner.address,
                    BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
                )
            ).to.be.revertedWith('INVALID_PATH')

            const payExactToken0ToReceiveToken1Optimal = async () => {
                const token0BalanceBeforeSwap = await token0.balanceOf(owner)
                const token1BalanceBeforeSwap = await token1.balanceOf(owner)
                const token0ToPay = toWei(1)
                await ammRouter.swapExactTokensForTokens(
                    token0ToPay,
                    toWei(0),
                    [token0Address, token1Address],
                    owner.address,
                    BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
                )
                const token0BalanceAfterSwap = await token0.balanceOf(owner)
                const token1BalanceAfterSwap = await token1.balanceOf(owner)
                expect(token0BalanceBeforeSwap - token0BalanceAfterSwap).to.eq(token0ToPay)
                const token1Swapped = token1BalanceAfterSwap - token1BalanceBeforeSwap
                expect(token1Swapped).to.greaterThan(BigInt(0))
                return token1Swapped
            }
            const token1ReceivedOpimal = await payExactToken0ToReceiveToken1Optimal()

            const payExactToken0ToReceiveToken1NonOptimal = async () => {
                const token0BalanceBeforeSwap = await token0.balanceOf(owner)
                const token1BalanceBeforeSwap = await token1.balanceOf(owner)
                const token0ToPay = toWei(1)
                await ammRouter.swapExactTokensForTokens(
                    token0ToPay,
                    toWei(0),
                    [token0Address, token3Address, token2Address, token1Address],
                    owner.address,
                    BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
                )
                const token0BalanceAfterSwap = await token0.balanceOf(owner)
                const token1BalanceAfterSwap = await token1.balanceOf(owner)
                expect(token0BalanceBeforeSwap - token0BalanceAfterSwap).to.eq(token0ToPay)
                const token1Swapped = token1BalanceAfterSwap - token1BalanceBeforeSwap
                expect(token1Swapped).to.greaterThan(BigInt(0))
                return token1Swapped
            }
            const token1ReceivedNonOpimal = await payExactToken0ToReceiveToken1NonOptimal()
            expect(token1ReceivedOpimal).to.greaterThan(token1ReceivedNonOpimal)
        })

        it("swapTokensForExactTokens", async function () {
            const {
                owner,
                ammRouter,
                token0Address,
                token1Address,
                token2Address,
                token3Address,
                token0,
                token1,
            } = await setupLiquidity()
            await expect(
                ammRouter.swapTokensForExactTokens(
                    toWei(1),
                    toWei(0),
                    [token0Address, token1Address],
                    owner.address,
                    BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
                )
            ).to.be.revertedWith('EXCESSIVE_INPUT_AMOUNT')

            const payToken0ToReceiveExactToken1Optimal = async () => {
                const token0BalanceBeforeSwap = await token0.balanceOf(owner)
                const token1BalanceBeforeSwap = await token1.balanceOf(owner)
                const token1ToReceive = toWei(1)

                await ammRouter.swapTokensForExactTokens(
                    token1ToReceive,
                    toWei(999),
                    [token0Address, token1Address],
                    owner.address,
                    BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
                )
                const token0BalanceAfterSwap = await token0.balanceOf(owner)
                const token1BalanceAfterSwap = await token1.balanceOf(owner)
                const token0Paid = token0BalanceBeforeSwap - token0BalanceAfterSwap
                expect(token0Paid).to.greaterThan(BigInt(0))
                const token1Swapped = token1BalanceAfterSwap - token1BalanceBeforeSwap
                expect(token1Swapped).to.eq(token1ToReceive)
                return token0Paid
            }
            const token0PaidOpimal = await payToken0ToReceiveExactToken1Optimal()

            const payToken0ToReceiveToken1NonOptimal = async () => {
                const token0BalanceBeforeSwap = await token0.balanceOf(owner)
                const token1BalanceBeforeSwap = await token1.balanceOf(owner)
                const token1ToReceive = toWei(1)

                await ammRouter.swapTokensForExactTokens(
                    token1ToReceive,
                    toWei(999),
                    [token0Address, token3Address, token2Address, token1Address],
                    owner.address,
                    BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
                )
                const token0BalanceAfterSwap = await token0.balanceOf(owner)
                const token1BalanceAfterSwap = await token1.balanceOf(owner)
                const token0Paid = token0BalanceBeforeSwap - token0BalanceAfterSwap
                expect(token0Paid).to.greaterThan(BigInt(0))
                const token1Swapped = token1BalanceAfterSwap - token1BalanceBeforeSwap
                expect(token1Swapped).to.eq(token1ToReceive)
                return token0Paid
            }
            const token0PaidNonOpimal = await payToken0ToReceiveToken1NonOptimal()
            expect(token0PaidNonOpimal).to.greaterThan(token0PaidOpimal)
        })
    })
});
