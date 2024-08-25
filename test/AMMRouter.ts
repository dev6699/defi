import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { quote, toWei } from "./utils";

describe("AMMRouter", function () {

    async function deployAMMRouterFixture() {
        const [owner, otherAccount] = await hre.ethers.getSigners();
        const PairFactory = await hre.ethers.getContractFactory("PairFactory");
        const pairFactory = await PairFactory.deploy();
        const WETH = await hre.ethers.getContractFactory("WETH");
        const weth = await WETH.deploy();
        const AMMRouter = await hre.ethers.getContractFactory("AMMRouter");
        const ammRouter = await AMMRouter.deploy(pairFactory, weth);
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
            weth,
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
        it("Should set the correct factory, WETH address", async function () {
            const { pairFactory, ammRouter, weth } = await loadFixture(deployAMMRouterFixture);
            expect(await ammRouter.factory()).to.equal(await pairFactory.getAddress());
            expect(await ammRouter.WETH()).to.equal(await weth.getAddress());
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
            expect(await tokenPair.tokenA()).to.eq(token1Address)
            expect(await tokenPair.tokenB()).to.eq(token0Address)

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

        describe("addWithETH", function () {
            it("Should wrap ETH into WETH and create tokenPair with WETH and token", async function () {
                const { pairFactory, ammRouter, weth, token0, owner } = await loadFixture(deployAMMRouterFixture);

                const ammRouterAddress = await ammRouter.getAddress()
                const tokenAddress = await token0.getAddress()

                const ethAmount = toWei(10)
                const tokenAmount = toWei(10)

                const ethBalanceBefore = await hre.ethers.provider.getBalance(owner.address)
                const tokenBalanceBefore = await token0.balanceOf(owner)

                await token0.connect(owner).approve(ammRouterAddress, tokenAmount)

                expect(await pairFactory.allPairsLength()).to.eq(0)
                await expect(
                    ammRouter.addLiquidityETH(
                        tokenAddress,
                        tokenAmount,
                        BigInt(0),
                        BigInt(0),
                        owner.address,
                        BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                        {
                            value: ethAmount
                        }
                    )
                )
                    // eth wrapped into WETH
                    .to.emit(weth, "Deposit")
                    .withArgs(ammRouterAddress, ethAmount)
                    // transfer WETH to tokenPair
                    .to.emit(weth, "Transfer")
                    .withArgs(ammRouterAddress, anyValue, ethAmount)

                expect(await pairFactory.allPairsLength()).to.eq(1)

                const wethAddress = await weth.getAddress()
                const tokenPairAddress = await pairFactory.getPair(wethAddress, tokenAddress)
                const tokenPair = await hre.ethers.getContractAt("TokenPair", tokenPairAddress)
                expect(await tokenPair.balanceOf(owner)).to.greaterThan(BigInt(0))
                expect(await tokenPair.tokenA()).to.eq(wethAddress)
                expect(await tokenPair.tokenB()).to.eq(tokenAddress)

                const [tokenReserve, wethReserve] = await tokenPair.getReserves()
                expect(tokenReserve).to.eq(tokenAmount)
                expect(wethReserve).to.eq(ethAmount)

                const ethBalanceAfter = await hre.ethers.provider.getBalance(owner.address)
                const tokenBalanceAfter = await token0.balanceOf(owner)

                expect(tokenBalanceBefore - tokenBalanceAfter).to.eq(tokenReserve)
                // won't be exactly equal because some goes with gas fee
                expect(ethBalanceBefore - ethBalanceAfter).to.greaterThan(wethReserve)

                // send extra eth, should expect refund
                await token0.connect(owner).approve(ammRouterAddress, tokenAmount)
                const extaEthAmount = ethAmount * BigInt(2)
                await ammRouter.addLiquidityETH(
                    tokenAddress,
                    tokenAmount,
                    BigInt(0),
                    BigInt(0),
                    owner.address,
                    BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                    {
                        value: extaEthAmount
                    }
                )
                const ethBalanceRefund = await hre.ethers.provider.getBalance(owner.address)
                expect(ethBalanceAfter - ethBalanceRefund).to.greaterThan(ethAmount).and.lessThan(extaEthAmount)
            })
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


        describe("removeWithETH", function () {
            it("Should wrap ETH into WETH and create tokenPair with WETH and token", async function () {
                const { pairFactory, ammRouter, weth, token0, token1, owner } = await loadFixture(deployAMMRouterFixture);

                const ammRouterAddress = await ammRouter.getAddress()
                const tokenAddress = await token0.getAddress()
                const wethAddress = await weth.getAddress()

                const ethAmount = toWei(10)
                const tokenAmount = toWei(10)

                const ethBalanceBefore = await hre.ethers.provider.getBalance(owner.address)
                const tokenBalanceBefore = await token0.balanceOf(owner)

                await token0.connect(owner).approve(ammRouterAddress, tokenAmount)

                await ammRouter.addLiquidityETH(
                    tokenAddress,
                    tokenAmount,
                    BigInt(0),
                    BigInt(0),
                    owner.address,
                    BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                    {
                        value: ethAmount
                    }
                )

                const tokenPairAddress = await pairFactory.getPair(tokenAddress, wethAddress)
                const tokenPair = await hre.ethers.getContractAt("TokenPair", tokenPairAddress)
                const liquidity = await tokenPair.balanceOf(owner)
                expect(liquidity).to.be.greaterThan(BigInt(0))

                await tokenPair.connect(owner).approve(ammRouterAddress, liquidity)
                await expect(
                    ammRouter.connect(owner).removeLiquidityETH(
                        tokenAddress,
                        liquidity,
                        BigInt(0),
                        BigInt(0),
                        owner.address,
                        BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
                    )
                )
                    // unwrap WETH to ETH and send back to user
                    .to.emit(weth, "Withdrawal")
                    .withArgs(ammRouterAddress, anyValue)

                const liquidityAfter = await tokenPair.balanceOf(owner)
                expect(liquidityAfter).to.eq(BigInt(0))

                const ethBalanceAfter = await hre.ethers.provider.getBalance(owner.address)
                const tokenBalanceAfter = await token0.balanceOf(owner)

                // 1000n burnt when creating initial tokenPair
                expect(tokenBalanceBefore - tokenBalanceAfter).to.eq(BigInt(1000))
                // won't be exactly equal because some goes with gas fee
                expect(ethBalanceBefore - ethBalanceAfter).to.greaterThan(BigInt(1000))

                // tokenPair still exist even all liquidity has been removed
                expect(await pairFactory.allPairsLength()).to.eq(1)
                expect(await pairFactory.allPairs(0)).to.eq(tokenPairAddress)
            })
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

        describe("swapWithETH", function () {

            const setupETHLiquidity = async () => {
                const { pairFactory, ammRouter, weth, token0, owner } = await loadFixture(deployAMMRouterFixture);

                const ammRouterAddress = await ammRouter.getAddress()
                const wethAddress = await weth.getAddress()
                const tokenAddress = await token0.getAddress()

                const ethAmount = toWei(100)
                const tokenAmount = toWei(100)

                await token0.connect(owner).approve(ammRouterAddress, tokenAmount * BigInt(10))

                await ammRouter.addLiquidityETH(
                    tokenAddress,
                    tokenAmount,
                    BigInt(0),
                    BigInt(0),
                    owner.address,
                    BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                    {
                        value: ethAmount
                    }
                )
                const tokenPairAddress = await pairFactory.getPair(tokenAddress, wethAddress)

                return {
                    owner,
                    ammRouter,
                    ammRouterAddress,
                    tokenPairAddress,
                    wethAddress,
                    tokenAddress,
                    weth,
                    token: token0,
                }
            }

            it("swapExactETHForTokens", async function () {
                const {
                    owner,
                    ammRouter,
                    ammRouterAddress,
                    tokenPairAddress,
                    weth,
                    token,
                    wethAddress,
                    tokenAddress,
                } = await setupETHLiquidity()

                // first element in path must be wethAddress
                await expect(
                    ammRouter.swapExactETHForTokens(
                        toWei(100),
                        [tokenAddress, wethAddress],
                        owner.address,
                        BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
                    )
                ).to.be.revertedWith('INVALID_PATH')

                await expect(
                    ammRouter.swapExactETHForTokens(
                        toWei(100),
                        [wethAddress, tokenAddress],
                        owner.address,
                        BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                        {
                            value: toWei(100),
                        }
                    )
                ).to.be.revertedWith('INSUFFICIENT_OUTPUT_AMOUNT')

                const ethBalanceBeforeSwap = await hre.ethers.provider.getBalance(owner.address)
                const tokenBalanceBeforeSwap = await token.balanceOf(owner)

                const ethToPay = toWei(1)
                await expect(
                    ammRouter.swapExactETHForTokens(
                        toWei(0),
                        [wethAddress, tokenAddress],
                        owner.address,
                        BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                        {
                            value: ethToPay,
                        }
                    )
                )
                    // wrap ETH into WETH
                    .to.emit(weth, "Deposit")
                    .withArgs(ammRouterAddress, ethToPay)
                    // transfer WETH to tokenPair
                    .to.emit(weth, "Transfer")
                    .withArgs(ammRouterAddress, tokenPairAddress, ethToPay)

                const ethBalanceAfterSwap = await hre.ethers.provider.getBalance(owner.address)
                const tokenBalanceAfterSwap = await token.balanceOf(owner)
                expect(ethBalanceBeforeSwap - ethBalanceAfterSwap).to.greaterThan(ethToPay)
                expect(tokenBalanceAfterSwap - tokenBalanceBeforeSwap).to.greaterThan(BigInt(0))
            })

            it("swapTokensForExactETH", async function () {
                const {
                    owner,
                    ammRouter,
                    ammRouterAddress,
                    weth,
                    token,
                    wethAddress,
                    tokenAddress,
                } = await setupETHLiquidity()

                // last element in path must be wethAddress
                await expect(
                    ammRouter.swapTokensForExactETH(
                        toWei(0),
                        toWei(0),
                        [wethAddress, tokenAddress],
                        owner.address,
                        BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
                    )
                ).to.be.revertedWith('INVALID_PATH')

                await expect(
                    ammRouter.swapTokensForExactETH(
                        toWei(1),
                        toWei(0),
                        [tokenAddress, wethAddress],
                        owner.address,
                        BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                    )
                ).to.be.revertedWith('EXCESSIVE_INPUT_AMOUNT')

                const ethBalanceBeforeSwap = await hre.ethers.provider.getBalance(owner.address)
                const tokenBalanceBeforeSwap = await token.balanceOf(owner)

                const ethToReceive = toWei(1)
                await expect(
                    ammRouter.swapTokensForExactETH(
                        ethToReceive,
                        toWei(100),
                        [tokenAddress, wethAddress],
                        owner.address,
                        BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                    )
                )
                    // unwrap WETH to ETH
                    .to.emit(weth, "Withdrawal")
                    .withArgs(ammRouterAddress, anyValue)

                const ethBalanceAfterSwap = await hre.ethers.provider.getBalance(owner.address)
                const tokenBalanceAfterSwap = await token.balanceOf(owner)
                expect(ethBalanceAfterSwap).to.greaterThan(ethBalanceBeforeSwap)
                expect(tokenBalanceBeforeSwap - tokenBalanceAfterSwap).to.greaterThan(BigInt(0))
            })

            it("swapExactTokensForETH", async function () {
                const {
                    owner,
                    ammRouter,
                    ammRouterAddress,
                    weth,
                    token,
                    wethAddress,
                    tokenAddress,
                } = await setupETHLiquidity()

                // last element in path must be wethAddress
                await expect(
                    ammRouter.swapExactTokensForETH(
                        toWei(0),
                        toWei(0),
                        [wethAddress, tokenAddress],
                        owner.address,
                        BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
                    )
                ).to.be.revertedWith('INVALID_PATH')

                await expect(
                    ammRouter.swapExactTokensForETH(
                        toWei(100),
                        toWei(100),
                        [tokenAddress, wethAddress],
                        owner.address,
                        BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                    )
                ).to.be.revertedWith('INSUFFICIENT_OUTPUT_AMOUNT')

                const ethBalanceBeforeSwap = await hre.ethers.provider.getBalance(owner.address)
                const tokenBalanceBeforeSwap = await token.balanceOf(owner)

                const tokenToPay = toWei(1)
                await expect(
                    ammRouter.swapExactTokensForETH(
                        tokenToPay,
                        toWei(0),
                        [tokenAddress, wethAddress],
                        owner.address,
                        BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                    )
                )
                    // unwrap WETH to ETH
                    .to.emit(weth, "Withdrawal")
                    .withArgs(ammRouterAddress, anyValue)

                const ethBalanceAfterSwap = await hre.ethers.provider.getBalance(owner.address)
                const tokenBalanceAfterSwap = await token.balanceOf(owner)
                expect(ethBalanceAfterSwap - ethBalanceBeforeSwap).to.greaterThan(BigInt(0))
                expect(tokenBalanceBeforeSwap - tokenBalanceAfterSwap).to.eq(tokenToPay)
            })

            it("swapETHForExactTokens", async function () {
                const {
                    owner,
                    ammRouter,
                    ammRouterAddress,
                    tokenPairAddress,
                    weth,
                    token,
                    wethAddress,
                    tokenAddress,
                } = await setupETHLiquidity()

                // first element in path must be wethAddress
                await expect(
                    ammRouter.swapETHForExactTokens(
                        toWei(100),
                        [tokenAddress, wethAddress],
                        owner.address,
                        BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30)
                    )
                ).to.be.revertedWith('INVALID_PATH')

                await expect(
                    ammRouter.swapETHForExactTokens(
                        toWei(1),
                        [wethAddress, tokenAddress],
                        owner.address,
                        BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                        {
                            value: toWei(1),
                        }
                    )
                ).to.be.revertedWith('EXCESSIVE_INPUT_AMOUNT')

                const ethBalanceBeforeSwap = await hre.ethers.provider.getBalance(owner.address)
                const tokenBalanceBeforeSwap = await token.balanceOf(owner)

                const tokenToReceive = toWei(1)
                await expect(
                    ammRouter.swapETHForExactTokens(
                        tokenToReceive,
                        [wethAddress, tokenAddress],
                        owner.address,
                        BigInt(parseInt(`${new Date().getTime() / 1000}`) + 30),
                        {
                            value: toWei(10),
                        }
                    )
                )
                    // wrap ETH into WETH
                    .to.emit(weth, "Deposit")
                    .withArgs(ammRouterAddress, anyValue)
                    // transfer WETH to tokenPair
                    .to.emit(weth, "Transfer")
                    .withArgs(ammRouterAddress, tokenPairAddress, anyValue)

                const ethBalanceAfterSwap = await hre.ethers.provider.getBalance(owner.address)
                const tokenBalanceAfterSwap = await token.balanceOf(owner)
                expect(ethBalanceBeforeSwap - ethBalanceAfterSwap).to.greaterThan(BigInt(0))
                expect(tokenBalanceAfterSwap - tokenBalanceBeforeSwap).to.eq(tokenToReceive)
            })
        })
    })
});
