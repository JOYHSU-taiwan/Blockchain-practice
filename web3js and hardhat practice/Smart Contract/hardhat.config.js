// npm install --save-dev @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai
require("@nomiclabs/hardhat-waffle"); 
// npm install --save-dev @nomiclabs/hardhat-etherscan
require("@nomiclabs/hardhat-etherscan"); 
// npm i dotenv
require('dotenv').config(); 

const INFURA_URL = process.env.INFURA_URL;
const PRIVATE_KEY1 = process.env.PRIVATE_KEY1;
const PRIVATE_KEY2 = process.env.PRIVATE_KEY2;
const ETHERSCAN_APIKEY = process.env.ETHERSCAN_APIKEY;

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: INFURA_URL, 
      accounts: [PRIVATE_KEY1, PRIVATE_KEY2],
      chainId: 5
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_APIKEY
  }
};
