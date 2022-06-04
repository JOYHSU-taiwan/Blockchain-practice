const { expect } = require("chai");

describe("Transactions For Debug Demo", function () {
  it("Test case: Should transfer tokens between accounts", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("DebugDemo");

    const hardhatToken = await Token.deploy();

    await hardhatToken.transfer(addr1.address, 100);
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(100);

    await hardhatToken.connect(addr1).transfer(addr2.address, 50);
    expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
  });
});