const { expect } = require("chai");

describe("ContractB test", function () {

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
                await DeployedContractB.setupJoyToken(DeployedJoyToken.address);
                expect(await DeployedContractB.JoyToken()).to.equal(DeployedJoyToken.address);
            });

        it("Test Case 2: Owner should set up Pool 1 Owner address",
            async function () {
                await DeployedContractB.setupPool1Owner(addr1.address);
                expect(await DeployedContractB.pool1_Owner()).to.equal(addr1.address);
            });

        it("Test Case 3: Owner should set up Pool 2 Owner address",
            async function () {
                await DeployedContractB.setupPool2Owner(addr2.address);
                expect(await DeployedContractB.pool2_Owner()).to.equal(addr2.address);
            });

        it("Test Case 4: The one who is not owner should not able to set up JoyToken address",
            async function () {
                await expect(DeployedContractB.connect(addr1).setupJoyToken(DeployedJoyToken.address)).to.be.revertedWith("");
            });

        it("Test Case 5: The one who is not owner should not able to set up Pool 1 Owner address",
            async function () {
                await expect(DeployedContractB.connect(addr1).setupPool1Owner(addr1.address)).to.be.revertedWith("");
            });

        it("Test Case 6: The one who is not owner should not able to set up Pool 2 Owner address",
            async function () {
                await expect(DeployedContractB.connect(addr1).setupPool2Owner(addr2.address)).to.be.revertedWith("");
            });
    });

    describe("Section 2: Distribute to Pool", function () {

        it("Test Case 1: Contract B should be able to distribute token to pool",
            async function () {

                await DeployedContractB.setupJoyToken(DeployedJoyToken.address);
                await DeployedContractB.setupPool1Owner(addr1.address);
                await DeployedContractB.setupPool2Owner(addr2.address);

                const amount = 100;
                await DeployedJoyToken.transfer(DeployedContractB.address, amount);
                await DeployedContractB.tokenDistribution(amount);

                expect(await DeployedContractB.pool(addr1.address)).to.equal((amount * 6) / 10);
                expect(await DeployedContractB.pool(addr2.address)).to.equal((amount * 4) / 10);
            });

        it("Test Case 2: Contract B should not be able to distribute token to pool when token in Contract B is less than (pool 1 amount + pool 2 amount + function input amount)",
            async function () {

                await DeployedContractB.setupJoyToken(DeployedJoyToken.address);
                await DeployedContractB.setupPool1Owner(addr1.address);
                await DeployedContractB.setupPool2Owner(addr2.address);

                const amount = 100;
                await expect(DeployedContractB.tokenDistribution(amount)).to.revertedWith("Token in Contract insufficient.");
            });
    });

    describe("Section 3: Withdraw Token from Pool", function () {

        it("Test Case 1: Pool Owner should be able to withdraw token in pool",
            async function () {

                const amount = 100;
                await DeployedContractB.setupJoyToken(DeployedJoyToken.address);
                await DeployedContractB.setupPool1Owner(addr1.address);
                await DeployedContractB.setupPool2Owner(addr2.address);
                await DeployedJoyToken.transfer(DeployedContractB.address, amount);

                await DeployedContractB.tokenDistribution(amount);

                expect(await DeployedContractB.pool(addr1.address)).to.equal((amount * 6) / 10);
                expect(await DeployedContractB.pool(addr2.address)).to.equal((amount * 4) / 10);

                await DeployedContractB.connect(addr1).tokenWithdraw();
                expect(await DeployedContractB.pool(addr1.address)).to.equal(0);
                expect(await DeployedJoyToken.balanceOf(addr1.address)).to.equal((amount * 6) / 10);
            });
    });

});