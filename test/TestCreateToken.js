const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", async function () {
    const inital = 1000000;

    beforeEach(async () => {
        [owner] = await ethers.getSigners();
    })

    it("Should return the new USD", async function () {
        const USD = await ethers.getContractFactory("USD");
        const usd = await USD.deploy(inital, owner.address);
        await usd.deployed();

        expect(await usd.getOwner()).to.equal(owner.address);
        expect(await usd.balanceOf(owner.address)).to.equal(inital);
        expect(await usd.name()).to.equal("Dollars");
    });

    it("Should return the new VND", async function () {
        const VND = await ethers.getContractFactory("VND");
        const vnd = await VND.deploy(inital, owner.address);
        await vnd.deployed();

        expect(await vnd.getOwner()).to.equal(owner.address);
        expect(await vnd.balanceOf(owner.address)).to.equal(inital);
        expect(await vnd.name()).to.equal("Vietnam");
    });

    it("Should return the new EUR", async function () {
        const EUR = await ethers.getContractFactory("EUR");
        const eur = await EUR.deploy(inital, owner.address);
        await eur.deployed();

        expect(await eur.getOwner()).to.equal(owner.address);
        expect(await eur.balanceOf(owner.address)).to.equal(inital);
        expect(await eur.name()).to.equal("Euros");
    });
});
