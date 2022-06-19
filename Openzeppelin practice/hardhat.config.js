require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades'); // for upgradable contract plugin

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  // setting for test testnet contract
  // networks: {
  //   rinkeby: {
  //     url: "", //Infura url with projectId
  //     accounts: [""] // add the account that will deploy the contract (private key)
  //   },
  // }
};
