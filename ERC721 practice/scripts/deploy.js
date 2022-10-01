// scripts/deploy.js
async function main () {
    // deploy mock token contract
    MockToken = await ethers.getContractFactory("MockToken");
    DeployedMockToken = await MockToken.deploy();
    console.log("MockToken deployed to:", DeployedMockToken.address);

    // deploy ticket contract
    TicketContract = await ethers.getContractFactory("Ticket");
    DeployedTicketContract = await TicketContract.deploy(DeployedMockToken.address);
    console.log("TicketContract deployed to:", DeployedTicketContract.address);

    // deploy service contract
    ServiceContract = await ethers.getContractFactory("Service");
    DeployedServiceContract = await ServiceContract.deploy(DeployedMockToken.address, DeployedTicketContract.address);
    console.log("ServiceContract deployed to:", DeployedServiceContract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
