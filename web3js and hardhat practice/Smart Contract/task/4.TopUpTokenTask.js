// run command : npx hardhat run task/4.TopUpTokenTask.js --network goerli
async function main() {
    const EGAME_TOKEN_ADDRESS = process.env.EGAME_TOKEN_ADDRESS;

    const [owner, player] = await ethers.getSigners();

    const EGameToken = await ethers.getContractFactory("EGameToken");

    const EGameToken_instance = await EGameToken.attach(EGAME_TOKEN_ADDRESS);

    console.log("Player token balance before top up is?");
    console.log((await EGameToken_instance.balanceOf(player.address)).toString());

    console.log("Player Top Up 10 Token.");
    const topUpTokenByETH_tx = await EGameToken_instance.connect(player).topUpTokenByETH(10, { value: 10 });
    await topUpTokenByETH_tx.wait();

    console.log("Player token balance after top up is?");
    console.log((await EGameToken_instance.balanceOf(player.address)).toString());

  };

  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });