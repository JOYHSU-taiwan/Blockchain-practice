// run command : npx hardhat run task/1.SetEGameServiceAddressTask.js --network goerli
async function main() {
    const EGAME_TOKEN_ADDRESS = process.env.EGAME_TOKEN_ADDRESS;
    const EGAME_SERVICE_ADDRESS = process.env.EGAME_SERVICE_ADDRESS;

    const EGameToken = await ethers.getContractFactory("EGameToken");

    const EGameToken_instance = await EGameToken.attach(EGAME_TOKEN_ADDRESS);

    console.log("Contract preparation: Owner set EGame Service Address in EGameToken contract.");
    const setEGameServiceAddress_tx = await EGameToken_instance.setEGameServiceAddress(EGAME_SERVICE_ADDRESS);
    await setEGameServiceAddress_tx.wait();

    console.log("Is EGameService contract has EGAME_SERVICE role in EGameToken contract?");
    console.log(await EGameToken_instance.hasRole(EGameToken_instance.EGAME_SERVICE(), EGAME_SERVICE_ADDRESS));
  };

  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
