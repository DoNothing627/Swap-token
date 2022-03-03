const { expect } = require("chai");
const { ethers } = require("hardhat");
const { utils } = ethers;

const addressZero = "0x0000000000000000000000000000000000000000";
describe("Initial and change rate", function () {
    let swaper, vnd, usd, admin, user;
    beforeEach(async function () {
        [admin, user] = await ethers.getSigners();

        const Swaper = await ethers.getContractFactory("Swaper");
        const Token = await ethers.getContractFactory("Token");

        swaper = await Swaper.deploy();
        vnd = await Token.deploy("Vietnam Dong", "VND", 100);
        usd = await Token.deploy("Dollar", "USD", 100);

        await swaper.deployed();
        await vnd.deployed();
        await usd.deployed();
    });
    it("initial state", async function () {
        const vndAdminValue = await vnd.balanceOf(admin.address);
        const usdAdminValue = await usd.balanceOf(admin.address);

        expect(vndAdminValue.toString()).to.equal((100 * 10 ** 18).toString());
        expect(usdAdminValue.toString()).to.equal((100 * 10 ** 18).toString());

        await vnd.transfer(user.address, 10);
        const vndUserValue = await vnd.balanceOf(user.address);

        expect(vndUserValue).to.equal(10);
    });
    it("change rate to 0", async function () {
        await expect(swaper.changeRate(vnd.address, usd.address, 0, 0)).to.be.revertedWith("Rate must be greater than 0");
    });
    it("change rate to 0.05", async function () {
        await swaper.changeRate(vnd.address, usd.address, 5, 2);
        const Rate = await swaper.tokenRate(vnd.address, usd.address);

        expect(Rate.rate).to.equal(5);
        expect(Rate.rateDecimals).to.equal(2);
    });
});

describe("Swap token error", function () {
    let swaper, vnd, usd, admin, user;
    beforeEach(async function () {
        [admin, user] = await ethers.getSigners();

        const Swaper = await ethers.getContractFactory("Swaper");
        const Token = await ethers.getContractFactory("Token");

        swaper = await Swaper.deploy();
        vnd = await Token.deploy("Vietnam Dong", "VND", 100);
        usd = await Token.deploy("Dollar", "USD", 100);

        await swaper.deployed();
        await vnd.deployed();
        await usd.deployed();
    });
    it("swap with rate equal 0", async function () {
        const Rate = await swaper.tokenRate(vnd.address, usd.address);
        await expect(Rate.rate).to.equal(0);
        await vnd.connect(user).approve(swaper.address, 10);
        await expect(swaper.swap(vnd.address, usd.address, 5)).to.be.revertedWith("Rate between 2 tokens is unavailable");
    });
    it("swap with amount equal 0", async function () {
        await swaper.changeRate(vnd.address, usd.address, 1, 0);
        await expect(swaper.swap(vnd.address, usd.address, 0)).to.be.revertedWith("Transfer value must be greater than 0");
    });
    it("swap 2 tokens with same address", async function () {
        await expect(swaper.swap(vnd.address, vnd.address, 5)).to.be.revertedWith("Can not change 2 token with same address");
    });
});

describe("Swap token successful", function () {
    let swaper, vnd, usd, admin, user;
    beforeEach(async function () {
        [admin, user] = await ethers.getSigners();

        const Swaper = await ethers.getContractFactory("Swaper");
        const Token = await ethers.getContractFactory("Token");

        swaper = await Swaper.deploy();
        vnd = await Token.deploy("Vietnam Dong", "VND", 100);
        usd = await Token.deploy("Dollar", "USD", 100);

        await swaper.deployed();
        await vnd.deployed();
        await usd.deployed();

        await vnd.transfer(user.address, (50 * 10 ** 18).toString());
        await vnd.transfer(swaper.address, (50 * 10 ** 18).toString());
        await usd.transfer(user.address, (50 * 10 ** 18).toString());
        await usd.transfer(swaper.address, (50 * 10 ** 18).toString());

        await admin.sendTransaction({
            to: swaper.address,
            value: utils.parseEther("2"),// 1 ether
        })

        await swaper.changeRate(vnd.address, usd.address, 5, 2);
        await swaper.changeRate(addressZero, vnd.address, 1, 0);
        await swaper.changeRate(vnd.address, addressZero, 1, 0);
    });
    it("swap 20 vnd to 1 usd", async function () {
        await vnd.connect(user).approve(swaper.address, (20 * 10 ** 18).toString());
        await swaper.connect(user).swap(vnd.address, usd.address, (20 * 10 ** 18).toString());

        const vndUserBalance = await vnd.balanceOf(user.address);
        const vndSwaperBalance = await vnd.balanceOf(swaper.address);
        const usdUserBalance = await usd.balanceOf(user.address);
        const usdSwaperBalance = await usd.balanceOf(swaper.address);

        expect(vndUserBalance).to.equal((30 * 10 ** 18).toString());
        expect(vndSwaperBalance).to.equal((70 * 10 ** 18).toString());
        expect(usdUserBalance).to.equal((51 * 10 ** 18).toString());
        expect(usdSwaperBalance).to.equal((49 * 10 ** 18).toString());
    });
    it("swap 1 ETH to 1 vnd", async function () {
        await swaper.connect(user).swap(addressZero, vnd.address, 0,
            { value: ethers.utils.parseEther("1") });

        const vndUserBalance = await vnd.balanceOf(user.address);

        expect(vndUserBalance).to.equal((51 * 10 ** 18).toString());
    });
    it("swap 1 vnd to 1 ETH", async function () {
        await vnd.connect(user).approve(swaper.address, (10 ** 18).toString());
        await swaper.connect(user).swap(vnd.address, "0x0000000000000000000000000000000000000000", (10 ** 18).toString());

        const vndUserBalance = await vnd.balanceOf(user.address);
        const ethSwaperBalance = await ethers.provider.getBalance(swaper.address);

        expect(vndUserBalance).to.equal((49 * 10 ** 18).toString());
        expect(ethSwaperBalance).to.equal((10 ** 18).toString());
    });
});
