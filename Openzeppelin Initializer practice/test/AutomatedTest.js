const { expect } = require("chai");

describe("Admin Role Practice contract", function () {

    let AdminBox;
    let HardHatAdminRolePractice;
    let HardHatAdminRolePracticeInstance;
    let owner;
    let addr1;

    beforeEach(async function () {

        AdminBox = await ethers.getContractFactory("AdminBox");
        [owner, addr1] = await ethers.getSigners();
        HardHatAdminRolePractice = await upgrades.deployProxy(AdminBox, [owner.address], { initializer: 'initialize' });
        HardHatAdminRolePracticeInstance = await HardHatAdminRolePractice.deployed();
    });


    describe("Section 1: Deployment", function () {

        it("Test Case 1: admin is the assigned owner", async function () {
            console.log("       owner      address: " + owner.address);
            console.log("       admin      address: " + await HardHatAdminRolePractice.showAdmin());
            expect(await HardHatAdminRolePractice.showAdmin()).to.equal(owner.address);

        });

    });

    describe("Section 2: Transactions", function () {

        it("Test Case 1: Admin should be able to store value", async function () {
            console.log("       owner      address: " + owner.address);
            console.log("       admin      address: " + await HardHatAdminRolePractice.showAdmin());
            await HardHatAdminRolePractice.connect(owner).store(42);
            expect(await HardHatAdminRolePractice.retrieve()).to.equal(42);
        });

        it("Test Case 2: Not Admin should not be able to store value", async function () {
            console.log("       addr1      address: " + addr1.address);
            console.log("       admin      address: " + await HardHatAdminRolePractice.showAdmin());
            await expect(HardHatAdminRolePractice.connect(addr1).store(42)).to.be.revertedWith("Sender is not admin");
        });

    });
});