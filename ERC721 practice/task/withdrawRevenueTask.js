// run command : npx hardhat run task/withdrawRevenueTask.js --network localhost
async function main() {
    const [owner, eventHolder, customer1, customer2] = await ethers.getSigners();

    const MockToken = await ethers.getContractFactory("MockToken");

    const MockToken_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const TicketContract_address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    const MockToken_instance = await MockToken.attach(MockToken_address);

    console.log("Reseller allowance before withdraw is...");
    let resellerAllowance = await MockToken_instance.allowance(TicketContract_address, owner.address);
    console.log(resellerAllowance);

    console.log("Reseller token balance before withdraw is...");
    console.log(await MockToken_instance.balanceOf(owner.address));
    console.log();

    console.log("Reseller withdraw revenue to his/her wallet.");
    const withdraw_reseller_tx = await MockToken_instance.transferFrom(TicketContract_address, owner.address, resellerAllowance);
    await withdraw_reseller_tx.wait();
    console.log();

    console.log("Reseller allowance after withdraw is...");
    console.log(await MockToken_instance.allowance(TicketContract_address, owner.address));

    console.log("Reseller token balance after withdraw is...");
    console.log(await MockToken_instance.balanceOf(owner.address));
    console.log();

    console.log("Event Holder allowance before withdraw is...");
    let eventHolderAllowance = await MockToken_instance.allowance(TicketContract_address, eventHolder.address);
    console.log(eventHolderAllowance);

    console.log("Event Holder token balance before withdraw is...");
    console.log(await MockToken_instance.balanceOf(eventHolder.address));
    console.log();

    console.log("Event Holder withdraw revenue to his/her wallet.");
    const withdraw_eventHolder_tx = await MockToken_instance.connect(eventHolder).transferFrom(TicketContract_address, eventHolder.address, eventHolderAllowance);
    await withdraw_eventHolder_tx.wait();
    console.log();

    console.log("Event Holder allowance after withdraw is...");
    console.log(await MockToken_instance.allowance(TicketContract_address, eventHolder.address));

    console.log("Event Holder token balance after withdraw is...");
    console.log(await MockToken_instance.balanceOf(eventHolder.address));

  };

  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });