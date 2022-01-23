const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", async function () {
    const inital = 1000000;

    beforeEach(async () => {
        [owner] = await ethers.getSigners();
    })

    it("Should return the new USD", async function () {
        const USD = await ethers.getContractFactory("USD");
        const usd = await USD.deploy();
        await usd.deployed();

        expect(await usd.getName()).to.equal("Dollar");
        expect(await usd.getSymbol()).to.equal("USD");
        expect(await usd.getRate()).to.equal(1);
    });

    it("Should return the new VND", async function () {
        const VND = await ethers.getContractFactory("VND");
        const vnd = await VND.deploy();
        await vnd.deployed();

        expect(await vnd.getName()).to.equal("Vietnamese Dong");
        expect(await vnd.getSymbol()).to.equal("VND");
        expect(await vnd.getRate()).to.equal(20000);
    });

    it("Should return the new EUR", async function () {
        const EUR = await ethers.getContractFactory("EUR");
        const eur = await EUR.deploy();
        await eur.deployed();

        expect(await eur.getName()).to.equal("Euro");
        expect(await eur.getSymbol()).to.equal("EUR");
        expect(await eur.getRate()).to.equal(2);
    });
});
