// run command : npx hardhat run task/3.PlayGameTask.js --network goerli
async function main() {
    const EGAME_TOKEN_ADDRESS = process.env.EGAME_TOKEN_ADDRESS;
    const EGAME_SERVICE_ADDRESS = process.env.EGAME_SERVICE_ADDRESS;

    const [owner, player] = await ethers.getSigners();

    const EGameToken = await ethers.getContractFactory("EGameToken");
    const EGameService = await ethers.getContractFactory("EGameService");

    const EGameToken_instance = await EGameToken.attach(EGAME_TOKEN_ADDRESS);
    const EGameService_instance = await EGameService.attach(EGAME_SERVICE_ADDRESS);

    console.log("Player approve EGameService contract.");
    const approve_tx = await EGameToken_instance.connect(player).approve(EGAME_SERVICE_ADDRESS, 10);
    await approve_tx.wait();

    console.log("How much score is player having before playing game?");
    console.log((await EGameService_instance.getScore(player.address)).toString());

    console.log("Player plays game.");
    const playGame_tx = await EGameService_instance.connect(player).playGame(10);
    let rc = await playGame_tx.wait();

    console.log("How many score is gained?");
    let event = rc.events.find((event) => event.event === 'GameResult'); 
    let results = event.args;
    console.log((results.gainedScore).toString());

    console.log("How much score is player having after playing game?");
    console.log((await EGameService_instance.getScore(player.address)).toString());
  };

  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });