const { expect } = require("chai");

// `describe` is a Mocha function that allows you to organize your tests. 
// It's not actually needed, but having your tests organized makes debugging them easier. 
// All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. 
// This callback can't be an async function.
describe("Token contract", function () {

  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;


  // Mocha has four functions that let you hook into the test runner's lifecyle. 
  // These are: `before`, `beforeEach`, `after`, `afterEach`.
  // They're very useful to setup the environment for tests, and to clean it up after they run.

  // `beforeEach` will run before each test, re-deploying the contract every time. 
  // It receives a callback, which can be async.
  beforeEach(async function () {

    Token = await ethers.getContractFactory("ContractDemo");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    hardhatToken = await Token.deploy();
  });

  // You can nest describe calls to create subsections.
  describe("Section 1: Deployment", function () {

    // `it` is another Mocha function. 
    // This is the one you use to define your tests. 
    // It receives the test name, and a callback function.
    // If the callback function is async, Mocha will `await` it.
    it("Test Case 1: Should set the right owner", async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Test Case 2: Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Section 2: Transactions", function () {
    it("Test Case 1: Should transfer tokens between accounts", async function () {
      await hardhatToken.transfer(addr1.address, 50);
      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      await hardhatToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Test Case 2: Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner
      // `require` will evaluate false and revert the transaction
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      // Owner balance shouldn't have changed
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Test Case 3: Should update balances after transfers", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1
      await hardhatToken.transfer(addr1.address, 100);

      // Transfer 50 tokens from owner to addr2
      await hardhatToken.transfer(addr2.address, 50);

      // Check owner balances should be subtracted 150 tokens
      const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      // Check addre1 should receive 100 tokens
      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      // Check addre2 should receive 50 tokens
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});