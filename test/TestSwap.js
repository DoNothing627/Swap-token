const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Swaper", async function () {
    const inital = 1000000;
    const amount = 30000;

    it("Swap and transfer token", async function () {
        const [Alice, Bob] = await ethers.getSigners();

        const VND = await ethers.getContractFactory("VND");
        const EUR = await ethers.getContractFactory("EUR");
        const Swaper = await ethers.getContractFactory("Swaper");

        const vnd = await VND.deploy();
        const eur = await EUR.deploy();
        
        await vnd.deployed();
        await eur.deployed();
        
        await vnd.setAccount(inital, Alice.address);
        await vnd.setAccount(inital, Bob.address);
        await eur.setAccount(inital, Alice.address);
        await eur.setAccount(inital, Bob.address);

        const swaper = await Swaper.deploy(vnd.address, eur.address);
        
        await swaper.deployed();

        await vndAlice.approve(swaper.address, amount);
        //await eurBob.approve(swaper.address, amount);

        await swaper.swap(amount);

        expect(await vndAlice.balanceOf(Alice.address)).to.equal(inital - amount);
        expect(await vndAlice.balanceOf(Bob.address)).to.equal(inital + amount);
        //expect(await eurAlice.balanceOf(Alice.address)).to.equal(inital + amount);
        //expect(await eurBob.balanceOf(Bob.address)).to.equal(inital - amount);

    });
});