// run command : npx hardhat run task/buyTicketTask.js --network localhost
async function main() {
    const [owner, eventHolder, customer1, customer2] = await ethers.getSigners();

    const MockToken = await ethers.getContractFactory("MockToken");
    const TicketContract = await ethers.getContractFactory("Ticket");
    const ServiceContract = await ethers.getContractFactory("Service");

    const MockToken_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const TicketContract_address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const ServiceContract_address = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

    const MockToken_instance = await MockToken.attach(MockToken_address);
    const TicketContract_instance = await TicketContract.attach(TicketContract_address);
    const ServiceContract_instance = await ServiceContract.attach(ServiceContract_address);

    const decimals = 18;
    const eventNumber = 123456789;
    const ticketPrice = ethers.utils.parseUnits("10", decimals);

    console.log("Contract preparation: Owner set up EVENT_HOLDER role in Service Contract.");
    const addEventHolder_tx = await ServiceContract_instance.addEventHolder(eventHolder.address);
    await addEventHolder_tx.wait();

    console.log("Contract preparation: Event Holder set up event info Service Contract.");
    const setupEventInfo_tx = await ServiceContract_instance.connect(eventHolder).setupEventInfo(eventNumber, ticketPrice);
    await setupEventInfo_tx.wait();

    console.log("Contract preparation: Event Holder set up event info Service Contract.");
    const addWhitelist_tx = await TicketContract_instance.addWhitelist(ServiceContract_address);
    await addWhitelist_tx.wait();

    console.log("Customer preparation: Customer1 approve Service Contract to transfer his/her token.")
    const mint_customer1_tx = await MockToken_instance.connect(customer1).mint();
    await mint_customer1_tx.wait();
    const apprive_customer1_tx = await MockToken_instance.connect(customer1).approve(ServiceContract_address, ticketPrice);
    await apprive_customer1_tx.wait();

    console.log("Customer preparation: Customer2 approve Service Contract to transfer his/her token.")
    const mint_customer2_tx = await MockToken_instance.connect(customer2).mint();
    await mint_customer2_tx.wait();
    const apprive_customer2_tx = await MockToken_instance.connect(customer2).approve(ServiceContract_address, ticketPrice);
    await apprive_customer2_tx.wait();
    console.log();

    console.log("Customer1 buy Ticket.")
    const buyTicket_customer1_tx = await ServiceContract_instance.connect(customer1).buyTicket(eventNumber);
    await buyTicket_customer1_tx.wait();
    console.log();

    console.log("Ticket Id 0 is for customer1?")
    console.log(await TicketContract_instance.ownerOf(0) == customer1.address);
    console.log("TicketRecords(0) is...");
    console.log(await ServiceContract_instance.TicketRecords(1));
    console.log();

    console.log("Customer2 buy Ticket.")
    const buyTicket_customer2_tx = await ServiceContract_instance.connect(customer2).buyTicket(eventNumber);
    await buyTicket_customer2_tx.wait();
    console.log();
    
    console.log("Ticket Id 1 is for customer2?")
    console.log(await TicketContract_instance.ownerOf(1) == customer2.address);
    console.log("TicketRecords(1) is...");
    console.log(await ServiceContract_instance.TicketRecords(1));

  };

  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
