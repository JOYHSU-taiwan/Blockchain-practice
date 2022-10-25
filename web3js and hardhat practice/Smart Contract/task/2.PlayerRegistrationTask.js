// run command : npx hardhat run task/2.PlayerRegistrationTask.js --network goerli
async function main() {
    const EGAME_TOKEN_ADDRESS = process.env.EGAME_TOKEN_ADDRESS;
    const EGAME_SERVICE_ADDRESS = process.env.EGAME_SERVICE_ADDRESS;

    const [owner, player] = await ethers.getSigners();

    const EGameToken = await ethers.getContractFactory("EGameToken");
    const EGameService = await ethers.getContractFactory("EGameService");

    const EGameToken_instance = await EGameToken.attach(EGAME_TOKEN_ADDRESS);
    const EGameService_instance = await EGameService.attach(EGAME_SERVICE_ADDRESS);

    console.log("New player register and get free token.");
    const playerRegistration_tx = await EGameService_instance.connect(player).playerRegistration();
    await playerRegistration_tx.wait();

    console.log("Is player registered in EGameService contract?");
    console.log(await EGameService_instance.isRegistered(player.address));

    console.log("How many token is player having now?");
    console.log((await EGameToken_instance.balanceOf(player.address)).toString());

    console.log("How much score is player having now?");
    console.log((await EGameService_instance.getScore(player.address)).toString());
  };

  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });