const { expect } = require("chai");

describe("MockToken test", function () {

    let MockToken;
    let DeployedMockToken;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {

        MockToken = await ethers.getContractFactory("MockToken");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        DeployedMockToken = await MockToken.deploy();
    });

    describe("Section 1: Deployment", function () {

        it("Test Case 1: Constructor should assign the total supply of tokens to the owner",
            async function () {
                const ownerBalance = await DeployedMockToken.balanceOf(owner.address);
                expect(await DeployedMockToken.totalSupply()).to.equal(ownerBalance);
            });
    });

    describe("Section 2: Approve and Allowance", function () {

        it("Test Case 1: A should approve an amount of token to B, and B should get the approved amount as allowance",
            async function () {
                const amount = 100;
                await DeployedMockToken.approve(addr1.address, amount);
                const allowance = await DeployedMockToken.allowance(owner.address, addr1.address);
                expect(amount).to.equal(allowance);
            });

        it("Test Case 2: A should approve an amount of token to B, and B should able to transfer the amount of allowance from A to C",
            async function () {
                const amount = 100;
                await DeployedMockToken.approve(addr1.address, amount);
                const allowance = await DeployedMockToken.allowance(owner.address, addr1.address);
                expect(amount).to.equal(allowance);

                const ownerBalanceBeforeTransaction = await DeployedMockToken.balanceOf(owner.address);
                console.log('        Section 2 Case 2: ownerBalanceBeforeTransaction is ' + ownerBalanceBeforeTransaction);

                await DeployedMockToken.connect(addr1).transferFrom(owner.address, addr2.address, amount);

                const ownerBalanceAfterTransaction = await DeployedMockToken.balanceOf(owner.address);
                console.log('        Section 2 Case 2: ownerBalanceAfterTransaction is ' + ownerBalanceAfterTransaction);

                const addr1BalanceAfterTransaction = await DeployedMockToken.balanceOf(addr1.address);
                console.log('        Section 2 Case 2: addr1BalanceAfterTransaction is ' + addr1BalanceAfterTransaction);

                const addr2BalanceAfterTransaction = await DeployedMockToken.balanceOf(addr2.address);
                console.log('        Section 2 Case 2: addr2BalanceAfterTransaction is ' + addr2BalanceAfterTransaction);

                expect(ownerBalanceBeforeTransaction).to.equal(BigInt(ownerBalanceAfterTransaction) + BigInt(amount));
                expect(addr1BalanceAfterTransaction).to.equal(0);
                expect(addr2BalanceAfterTransaction).to.equal(amount);
            });
    });

    describe("Section 3: Transfer", function () {

        it("Test Case 1: A should be able to transfer token to B",
            async function () {
                const amount = 100;
                const ownerBalanceBeforeTransaction = await DeployedMockToken.balanceOf(owner.address);
                console.log('        Section 3 Case 1: ownerBalanceBeforeTransaction is ' + ownerBalanceBeforeTransaction);

                await DeployedMockToken.transfer(addr1.address, amount);

                const ownerBalanceAfterTransaction = await DeployedMockToken.balanceOf(owner.address);
                console.log('        Section 3 Case 1: ownerBalanceAfterTransaction is ' + ownerBalanceAfterTransaction);

                const addr1BalanceAfterTransaction = await DeployedMockToken.balanceOf(addr1.address);
                console.log('        Section 3 Case 1: addr1BalanceAfterTransaction is ' + addr1BalanceAfterTransaction);

                expect(ownerBalanceBeforeTransaction).to.equal(BigInt(ownerBalanceAfterTransaction) + BigInt(amount));
                expect(addr1BalanceAfterTransaction).to.equal(amount);
            });
    });

    describe("Section 3: Top Up Token", function () {

        it("Test Case 1: Everyone should be able to Top Up MockToken",
            async function () {
                await DeployedMockToken.connect(addr1).mint()
                expect(await DeployedMockToken.balanceOf(addr1.address)).to.equal(ethers.utils.parseUnits('10', 18));
            });
    });

});