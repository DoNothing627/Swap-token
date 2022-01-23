const hre = require("hardhat"); //import the hardhat

async function main() {
  const [deployer, Alice, Bob] = await ethers.getSigners(); //get the account to deploy the contract

  console.log("Deploying contracts with the account:", deployer.address);


  const VND = await ethers.getContractFactory("VND");
  const EUR = await ethers.getContractFactory("EUR");
  const Swaper = await hre.ethers.getContractFactory("Swaper"); // Getting the Contract

  const vnd = await VND.deploy(); //init agrument
  const eur = await EUR.deploy(); //init agrument

  const swaper = await Swaper.deploy(Alice.address, Bob.address, vnd.address, eur.address);//deploying the contract

  await swaper.deployed(); // waiting for the contract to be deployed

  console.log("Swaper deployed to:", swaper.address); // Returning the contract address on the rinkeby
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); // Calling the function to deploy the contract 