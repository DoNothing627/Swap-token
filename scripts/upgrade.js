const { ethers, upgrades } = require('hardhat');


async function main() {
    const [deployer] = await ethers.getSigners(); //get the account to deploy the contract

    console.log("Deploying contracts with the account:", deployer.address);

    const Swaper = await ethers.getContractFactory("SwaperV2");
    const swaper = await upgrades.upgradeProxy("0x4272afBdDaC7e1ee27b10d7eeEF8db6555f34c12", Swaper,);

    console.log("Swaper upgrade to:", swaper.address); // Returning the contract address on the rinkeby
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); // Calling the function to deploy the contract 