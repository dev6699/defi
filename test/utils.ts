import { ethers } from "hardhat";

export const toWei = (n: number) => ethers.parseEther(n.toString())
export const fromWei = (n: number) => ethers.formatEther(n)