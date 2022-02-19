const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Swaper", async function () {
    const inital = 1000000;


    it("Swap and transfer token", async function () {
        const [USER] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("Token");
        const Swaper = await ethers.getContractFactory("Swaper");

        const vnd = await Token.deploy("Vietnamese Dong", "VND"); //init agrument
        const usd = await Token.deploy("Dollar", "USD"); //init agrument
        const swaper = await Swaper.deploy();

        await vnd.deployed();
        await usd.deployed();
        await swaper.deployed();

        await vnd.setAccount(USER.address, inital);
        await vnd.setAccount(swaper.address, inital);
        await usd.setAccount(USER.address, inital);
        await usd.setAccount(swaper.address, inital);

        const amount = 400000; // lượng VND muốm đổi
        const rate = 20000
        const get = 20; // lượng EUR nhận về 20= 400000/ 20000;

        await vnd.approve(swaper.address, amount);
        
        await swaper.swap(USER.address, vnd.address, usd.address, amount, rate);

        expect(await vnd.balanceOf(USER.address)).to.equal(inital- amount);
        expect(await vnd.balanceOf(swaper.address)).to.equal(inital+ amount);
        expect(await usd.balanceOf(swaper.address)).to.equal(inital- get);
        expect(await usd.balanceOf(USER.address)).to.equal(inital+ get);

    });
});