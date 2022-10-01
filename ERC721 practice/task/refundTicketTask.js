// run command : npx hardhat run task/refundTicketTask.js --network localhost
async function main() {
    const [owner, eventHolder, customer1, customer2] = await ethers.getSigners();

    const ServiceContract = await ethers.getContractFactory("Service");

    const ServiceContract_address = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

    const ServiceContract_instance = await ServiceContract.attach(ServiceContract_address);

    console.log("Customer1 refund ticket.");
    const refund_tx = await ServiceContract_instance.connect(customer1).refundEventFee(0);
    await refund_tx.wait();
    console.log();

    console.log("TicketRecords(0) is...");
    console.log(await ServiceContract_instance.TicketRecords(0));

  };

  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });