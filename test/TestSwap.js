const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Swaper", async function () {
    const inital = 1000000;
    const amount = 30000;





    it("Swap and transfer token", async function () {
        let [Alice, Bob] = await ethers.getSigners();

        const VND = await ethers.getContractFactory("VND");
        const EUR = await ethers.getContractFactory("EUR");
        const Swaper = await ethers.getContractFactory("Swaper");

        const vnd = await VND.deploy();
        const eur = await EUR.deploy();

        await vnd.deployed();
        await eur.deployed();

        await vnd.setAccount(inital, Alice.address);
        await vnd.setAccount(inital, Bob.address);
        await eur.setAccount(inital, Bob.address);
        await eur.setAccount(inital, Alice.address);

        const swaper = await Swaper.deploy(Alice.address, Bob.address, vnd.address, eur.address);

        await swaper.deployed();

        await vnd.approve(swaper.address, amount);
        await eur.approve(swaper.address, amount);

        //console.log(Alice.address);

        await swaper.swap(amount);

        expect(await vnd.balanceOf(Alice.address)).to.equal(inital - amount);
        expect(await vnd.balanceOf(Bob.address)).to.equal(inital + amount);
        expect(await eur.balanceOf(Alice.address)).to.equal(inital + amount);
        //expect(await eurBob.balanceOf(Bob.address)).to.equal(inital - amount);

    });
});