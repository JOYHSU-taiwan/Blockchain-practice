const { expect } = require("chai");

describe("ServiceContract Test", function () {

  // Role
  let owner; // also reseller
  let eventHolder;
  let customer1;
  let customer2;

  // Contract
  let MockToken;
  let DeployedMockToken;
  let ServiceContract;
  let DeployedServiceContract;
  let TicketContract;
  let DeployedTicketContract;

  // Test related Constant 
  const decimals = 18;
  const eventNumber = 123456789;
  const ticketPrice = ethers.utils.parseUnits("10", decimals);

  before(async function () {
    [owner, eventHolder, customer1, customer2] =await ethers.getSigners();

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
    console.log();
  });


  describe("Section 1: buy ticket", function () {
    it("Test Case 1: Only contract owner can set up EVENT_HOLDER role in Service Contract.", async function () {
      await expect(DeployedServiceContract.connect(customer1).addEventHolder(eventHolder.address)).to.be.reverted;
      await DeployedServiceContract.addEventHolder(eventHolder.address);
      expect(await DeployedServiceContract.hasRole(DeployedServiceContract.EVENT_HOLDER(), eventHolder.address)).equals(true);
    });

    it("Test Case 2: Ticket should not be issued if event info not been set up.", async function () {
      await expect(DeployedServiceContract.connect(customer1).buyTicket(eventNumber)).to.be.revertedWith("Ticket Price should more than 0 for each event.");
      await DeployedServiceContract.connect(eventHolder).setupEventInfo(eventNumber, ticketPrice);
      await expect(DeployedServiceContract.connect(customer1).buyTicket(eventNumber)).to.be.revertedWith("Customer token allowance is insufficient.");
    });

    it("Test Case 3: Customer should approve Service Contract to transfer his/her token.", async function () {
      await expect(DeployedServiceContract.connect(customer1).buyTicket(eventNumber)).to.be.revertedWith("Customer token allowance is insufficient.");
      await DeployedMockToken.connect(customer1).approve(DeployedServiceContract.address, ticketPrice);
      await expect(DeployedServiceContract.connect(customer1).buyTicket(eventNumber)).to.be.revertedWith("Customer token balance is insufficient.");
    });

    it("Test Case 4: Customer should have sufficient ERC20 token.", async function () {
      await expect(DeployedServiceContract.connect(customer1).buyTicket(eventNumber)).to.be.revertedWith("Customer token balance is insufficient.");
      await DeployedMockToken.connect(customer1).mint();
      await expect(DeployedServiceContract.connect(customer1).buyTicket(eventNumber)).to.be.revertedWith("Ticket Contract caller is not a valid Service Contract.");
    });

    it("Test Case 5: Only contract owner can set up Whitelist in Ticket Contract.", async function () {
      await expect(DeployedServiceContract.connect(customer1).buyTicket(eventNumber)).to.be.revertedWith("Ticket Contract caller is not a valid Service Contract.");
      await expect(DeployedTicketContract.connect(customer1).addWhitelist(DeployedServiceContract.address)).to.be.revertedWith("Ownable: caller is not the owner");
      await DeployedTicketContract.addWhitelist(DeployedServiceContract.address);
      expect(await DeployedTicketContract.inWhitelist(DeployedServiceContract.address)).equals(true);
    });

    it("Test Case 6: Buy Ticket happy path.", async function () {
      await DeployedServiceContract.connect(customer1).buyTicket(eventNumber);
      expect(await DeployedTicketContract.ownerOf(0)).to.equal(customer1.address);
      expect(await DeployedServiceContract.TicketRecords(0)).to.not.be.empty;
      expect(await DeployedMockToken.allowance(DeployedTicketContract.address, owner.address)).equals(ethers.utils.parseUnits("1", decimals));
      expect(await DeployedMockToken.allowance(DeployedTicketContract.address, eventHolder.address)).equals(0);

      // console.log("DeployedServiceContract.TicketRecords(0) is...");
      // console.log(await DeployedServiceContract.TicketRecords(0));
    });
  });

  describe("Section 2: refund ticket", function () {
    it("Test Case 1: Only ticket owner can refund ticket.", async function () {
      await expect(DeployedServiceContract.connect(customer2).refundEventFee(0)).to.be.revertedWith("Only Ticket owner can refund or redeem.");
      await DeployedServiceContract.connect(customer1).refundEventFee(0);
      expect(await DeployedMockToken.allowance(DeployedTicketContract.address, owner.address)).equals(ethers.utils.parseUnits("1", decimals));
      expect(await DeployedMockToken.allowance(DeployedTicketContract.address, eventHolder.address)).equals(0);
      expect(await DeployedMockToken.balanceOf(customer1.address)).equals(ethers.utils.parseUnits("9", decimals));

      // console.log("DeployedServiceContract.TicketRecords(0) is...");
      // console.log(await DeployedServiceContract.TicketRecords(0));
    });

    it("Test Case 2: Only UNUSED ticket can refund.", async function () {
      await expect(DeployedServiceContract.connect(customer1).refundEventFee(0)).to.be.revertedWith("Only UNUSED ticket can be refund or redeem.");
    });
  });

  describe("Section 2: redeem ticket", function () {
    const decimals = 18;

    it("Test Case 1: Only ticket owner can redeem ticket.", async function () {
      await DeployedMockToken.connect(customer2).mint();
      await DeployedMockToken.connect(customer2).approve(DeployedServiceContract.address, ticketPrice);
      await DeployedServiceContract.connect(customer2).buyTicket(eventNumber);
      expect(await DeployedMockToken.allowance(DeployedTicketContract.address, owner.address)).equals(ethers.utils.parseUnits("2", decimals));
      expect(await DeployedMockToken.allowance(DeployedTicketContract.address, eventHolder.address)).equals(0);
      expect(await DeployedMockToken.balanceOf(customer2.address)).equals(ethers.utils.parseUnits("0", decimals));

      await expect(DeployedServiceContract.connect(customer1).redeemEventFee(1)).to.be.revertedWith("Only Ticket owner can refund or redeem.");
      await DeployedServiceContract.connect(customer2).redeemEventFee(1);
      expect(await DeployedMockToken.allowance(DeployedTicketContract.address, owner.address)).equals(ethers.utils.parseUnits("2", decimals));
      expect(await DeployedMockToken.allowance(DeployedTicketContract.address, eventHolder.address)).equals(ethers.utils.parseUnits("9", decimals));
      expect(await DeployedMockToken.balanceOf(customer2.address)).equals(0);

      // console.log("DeployedServiceContract.TicketRecords(1) is...");
      // console.log(await DeployedServiceContract.TicketRecords(1));
    });

    it("Test Case 2: Only UNUSED ticket can redeem.", async function () {
      await expect(DeployedServiceContract.connect(customer2).refundEventFee(1)).to.be.revertedWith("Only UNUSED ticket can be refund or redeem.");
    });
  });

  describe("Section 3: withdraw revenue", function () {
    const decimals = 18;

    it("Test Case 1: Reseller withdraw revenue to his/her wallet.", async function () {
      expect(await DeployedMockToken.allowance(DeployedTicketContract.address, owner.address)).equals(ethers.utils.parseUnits("2", decimals));
      // console.log("Owner token balance before withdraw is...");
      // console.log(await DeployedMockToken.balanceOf(owner.address));
      await DeployedMockToken.transferFrom(DeployedTicketContract.address, owner.address, ethers.utils.parseUnits("2", decimals));
      expect(await DeployedMockToken.allowance(DeployedTicketContract.address, owner.address)).equals(0);
      // console.log("Owner token balance after withdraw is...");
      // console.log(await DeployedMockToken.balanceOf(owner.address));
    });

    it("Test Case 2: Event Holder withdraw revenue to his/her wallet.", async function () {
      expect(await DeployedMockToken.allowance(DeployedTicketContract.address, eventHolder.address)).equals(ethers.utils.parseUnits("9", decimals));
      // console.log("Event Holder token balance before withdraw is...");
      // console.log(await DeployedMockToken.balanceOf(eventHolder.address));
      await DeployedMockToken.connect(eventHolder).transferFrom(DeployedTicketContract.address, eventHolder.address, ethers.utils.parseUnits("9", decimals));
      expect(await DeployedMockToken.allowance(DeployedTicketContract.address, eventHolder.address)).equals(0);
      // console.log("Event Holder token balance after withdraw is...");
      // console.log(await DeployedMockToken.balanceOf(eventHolder.address));
    });
  });
});
