const { ethers, upgrades } = require('hardhat');

async function main() {
  const Box = await ethers.getContractFactory('UpgradeableBoxV1');
  console.log('Deploying Box...');
  const box = await upgrades.deployProxy(Box, [42], { initializer: 'store' });
  await box.deployed();
  console.log('Box deployed to:', box.address);
}

main();