const { expect } = require("chai");
// We're using Chai which is an assertions library. 
// These asserting functions are called "matchers", and the ones we're using here actually come from Waffle.
// Find more matchers information in https://ethereum-waffle.readthedocs.io/en/latest/matchers.html

describe("Token contract", function () {
  it("Test case 1: Deployment should assign the total supply of tokens to the owner", async function () {

    const [owner] = await ethers.getSigners();
    // A Signer in ethers.js is an object that represents an Ethereum account. 
    // It's used to send transactions to contracts and other accounts. 
    // Here we're getting a list of the accounts in the node we're connected to, which in this case is Hardhat Network, and only keeping the first one.
    // Find more signer information in https://docs.ethers.io/v5/api/signer/

    const Token = await ethers.getContractFactory("ContractDemo");
    // A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts. 
    // Token here is a factory for instances of our ContractDemo contract.

    const hardhatToken = await Token.deploy();
    // Calling deploy() on a ContractFactory will start the deployment, and return a Promise that resolves to a Contract. 
    // This is the object that has a method for each of your smart contract functions.

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    // Once the contract is deployed, we can call our contract methods on hardhatToken and use them to get the balance of the owner account by calling balanceOf().
    // Remember that the owner of the token who gets the entire supply is the account that makes the deployment, and when using the hardhat-ethers plugin ContractFactory and Contract instances are connected to the first signer by default. 
    // This means that the account in the owner variable executed the deployment, and balanceOf() should return the entire supply amount.

    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    // Here we're again using our Contract instance to call a smart contract function in our Solidity code. 
    // totalSupply() returns the token's supply amount and we're checking that it's equal to ownerBalance, as it should.
  });
});

describe("Transactions", function () {
  it("Test case 2: Should transfer tokens between accounts", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ContractDemo");

    const hardhatToken = await Token.deploy();

    await hardhatToken.transfer(addr1.address, 100); // Transfer 100 tokens from owner to addr1
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(100);

    await hardhatToken.connect(addr1).transfer(addr2.address, 50); // Transfer 50 tokens from addr1 to addr2
    expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
  });
});