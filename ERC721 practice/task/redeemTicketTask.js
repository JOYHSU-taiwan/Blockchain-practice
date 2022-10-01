// run command : npx hardhat run task/redeemTicketTask.js --network localhost
async function main() {
    const [owner, eventHolder, customer1, customer2] = await ethers.getSigners();

    const ServiceContract = await ethers.getContractFactory("Service");

    const ServiceContract_address = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

    const ServiceContract_instance = await ServiceContract.attach(ServiceContract_address);

    console.log("Customer2 redeem ticket.");
    const redeem_tx = await ServiceContract_instance.connect(customer2).redeemEventFee(1);
    await redeem_tx.wait();
    console.log();

    console.log("TicketRecords(1) is...");
    console.log(await ServiceContract_instance.TicketRecords(1));

  };

  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
