const { expect } = require("chai");

describe("ContractA test", function () {

    let JoyToken;
    let ContractA;
    let ContractB;
    let DeployedJoyToken;
    let DeployedContractA;
    let DeployedContractB;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {

        JoyToken = await ethers.getContractFactory("JoyToken");
        ContractA = await ethers.getContractFactory("ContractA");
        ContractB = await ethers.getContractFactory("ContractB");

        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        DeployedJoyToken = await JoyToken.deploy();
        DeployedContractA = await ContractA.deploy();
        DeployedContractB = await ContractB.deploy();
    });

    describe("Section 1: Value Setup by Owner", function () {

        it("Test Case 1: Owner should set up JoyToken address",
            async function () {
                await DeployedContractA.setupJoyToken(DeployedJoyToken.address);
                expect(await DeployedContractA.JoyToken()).to.equal(DeployedJoyToken.address);
            });

        it("Test Case 2: Owner should set up ContractB address",
            async function () {
                await DeployedContractA.setupContractB(DeployedContractB.address);
                expect(await DeployedContractA.ContractB_Address()).to.equal(DeployedContractB.address);
            });

        it("Test Case 3: The one who is not owner should not able to set up JoyToken address",
            async function () {
                await expect(DeployedContractA.connect(addr1).setupJoyToken(DeployedJoyToken.address)).to.be.revertedWith("");
            });

        it("Test Case 4: The one who is not owner should not able to set up ContractB address",
            async function () {
                await expect(DeployedContractA.connect(addr1).setupContractB(DeployedContractB.address)).to.be.revertedWith("");
            });
    });

    describe("Section 2: Approve and TransferFrom", function () {

        it("Test Case 1: Customer should approve an amount of token to Contract A, and Contract A should be able to transfer the amount of token to Contract B",
            async function () {

                await DeployedContractA.setupJoyToken(DeployedJoyToken.address);
                await DeployedContractA.setupContractB(DeployedContractB.address);

                const amount = 100;
                await DeployedJoyToken.approve(DeployedContractA.address, amount);
                const allowance = await DeployedJoyToken.allowance(owner.address, DeployedContractA.address);
                expect(amount).to.equal(allowance);

                await DeployedContractA.transferByApprove(amount);
                expect(await DeployedJoyToken.balanceOf(DeployedContractA.address)).to.equal(amount*2/10);
                expect(await DeployedJoyToken.balanceOf(DeployedContractB.address)).to.equal(amount*8/10);
            });
    });

    describe("Section 3: Direct Transfer", function () {

        it("Test Case 1: Customer transfer toke to Contract A directly, and Contract A should be able to transfer to Contract B",
            async function () {

                await DeployedContractA.setupJoyToken(DeployedJoyToken.address);
                await DeployedContractA.setupContractB(DeployedContractB.address);

                const amount = 100;
                await DeployedJoyToken.transfer(DeployedContractA.address, amount);
                expect(await DeployedJoyToken.balanceOf(DeployedContractA.address)).to.equal(amount);

                await DeployedContractA.transferDirectly(amount);
                expect(await DeployedJoyToken.balanceOf(DeployedContractA.address)).to.equal(amount*2/10);
                expect(await DeployedJoyToken.balanceOf(DeployedContractB.address)).to.equal(amount*8/10);
            });
    });

});