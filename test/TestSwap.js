const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Swaper", async function () {
    const inital = 1000000;


    it("Swap and transfer token", async function () {
        let [Alice, Bob] = await ethers.getSigners();

        const VND = await ethers.getContractFactory("VND");
        const EUR = await ethers.getContractFactory("EUR");
        const Swaper = await ethers.getContractFactory("Swaper");

        const vnd = await VND.deploy(); //init agrument
        const eur = await EUR.deploy(); //init agrument

        await vnd.deployed();
        await eur.deployed();

        await vnd.setAccount(inital, Alice.address);
        await vnd.setAccount(inital, Bob.address);
        await eur.setAccount(inital, Alice.address);
        await eur.setAccount(inital, Bob.address);

        const swaper = await Swaper.deploy(Alice.address, Bob.address, vnd.address, eur.address);

        const amount = 30000; // lượng VND muốm đổi
        const get = 3; // lượng EUR nhận về 3= 30000/ 20000* 2;

        await swaper.deployed();
        await swaper.swap(amount);

        expect(await vnd.balanceOf(Alice.address)).to.equal(inital - amount);
        expect(await vnd.balanceOf(Bob.address)).to.equal(inital + amount);
        expect(await eur.balanceOf(Alice.address)).to.equal(inital + get);
        expect(await eur.balanceOf(Bob.address)).to.equal(inital - get);

    });
});