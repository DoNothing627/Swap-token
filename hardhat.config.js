require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-etherscan");
const secret = require("./secret.json"); // import url and private key

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: secret.url, // endpoint moralis: https://speedy-nodes-nyc.moralis.io/87f0f3c9b5d2374c1f1eb707/eth/ropsten
      accounts: [secret.private_key] // private key metamask wallet
    }
  },
  etherscan: {
    apiKey: {
      rinkeby: "JC3QGY1H4QJATSWTD9Y6SXGYHGZHFJH82Q"
    }
  }
};
