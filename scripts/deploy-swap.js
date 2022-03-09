const hre = require("hardhat"); //import the hardhat

async function main() {
    const [deployer] = await ethers.getSigners(); //get the account to deploy the contract

    console.log("Deploying contracts with the account:", deployer.address);

    const Swaper = await hre.ethers.getContractFactory("Swaper"); // Getting the Contract
    // const Token = await hre.ethers.getContractFactory("Token");
    // const swaper = await upgrades.deployProxy(Swaper, [42], { initializer: 'store' });//deploying the contract
    // const vnd= await upgrades.deployProxy(Token("VietnamDong", "VND", 100), [41], { initializer: 'store' });//deploying the contract

    //const usd= await upgrades.deployProxy(Token("Dollar", "USD", 100), [40], { initializer: 'store' });//deploying the contract
    const swaper = await Swaper.deploy();//deploying the contract

    await swaper.deployed(); // waiting for the contract to be deployed
    //await vnd.deployed();
    //await usd.deployed();

    console.log("Swaper deployed to:", swaper.address); // Returning the contract address on the rinkeby
    //console.log("vnd deploy to: ", )
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); // Calling the function to deploy the contract 