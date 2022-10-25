async function main () {
    
    EGameToken = await ethers.getContractFactory("EGameToken");
    DeployedEGameToken = await EGameToken.deploy();
    await DeployedEGameToken.deployed();
    console.log("EGameToken deployed to:", DeployedEGameToken.address);

    EGameService = await ethers.getContractFactory("EGameService");
    DeployedEGameService = await EGameService.deploy(DeployedEGameToken.address);
    await DeployedEGameService.deployed();
    console.log("EGameService deployed to:", DeployedEGameService.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });