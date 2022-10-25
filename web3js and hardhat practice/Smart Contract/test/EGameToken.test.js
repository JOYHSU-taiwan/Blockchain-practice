const { expect } = require("chai");

describe("EGameToken test", function () {
    
    let owner;
    let player;

    let EGameToken;
    let DeployedEGameToken;
    let EGameService;
    let DeployedEGameService;
    let EGameService2;
    let DeployedEGameService2;

    before(async function () {
        [owner, player] = await ethers.getSigners();

        EGameToken = await ethers.getContractFactory("EGameToken");
        DeployedEGameToken = await EGameToken.deploy();
        await DeployedEGameToken.deployed();
        // console.log("EGameToken deployed to:", DeployedEGameToken.address);

        EGameService = await ethers.getContractFactory("EGameService");
        DeployedEGameService = await EGameService.deploy(DeployedEGameToken.address);
        await DeployedEGameService.deployed();
        // console.log("EGameService deployed to:", DeployedEGameService.address);

        EGameService2 = await ethers.getContractFactory("EGameService");
        DeployedEGameService2 = await EGameService2.deploy(DeployedEGameToken.address);
        await DeployedEGameService2.deployed();
        // console.log("EGameService2 deployed to:", DeployedEGameService2.address);
    })

    describe("[1.] Only owner can set and update EGame Service Address.", function () {

        it("Test Case 1: The caller who is not owner can not set EGame Service Address.", 
        async function () {
            await expect(DeployedEGameToken.connect(player).setEGameServiceAddress(DeployedEGameService.address))
            .to.be.revertedWith("Ownable: caller is not the owner");
        })

        it("Test Case 2: The caller who is owner can set EGame Service Address.", 
        async function () {
            expect(await DeployedEGameToken.hasRole(DeployedEGameToken.EGAME_SERVICE(), DeployedEGameService.address)).equals(false);
            await DeployedEGameToken.setEGameServiceAddress(DeployedEGameService.address);
            expect(await DeployedEGameToken.hasRole(DeployedEGameToken.EGAME_SERVICE(), DeployedEGameService.address)).equals(true);

            expect(await DeployedEGameToken.hasRole(DeployedEGameToken.EGAME_SERVICE(), DeployedEGameService2.address)).equals(false);
            await DeployedEGameToken.setEGameServiceAddress(DeployedEGameService2.address);
            expect(await DeployedEGameToken.hasRole(DeployedEGameToken.EGAME_SERVICE(), DeployedEGameService2.address)).equals(true);
        })

        it("Test Case 3: The caller who is not owner can not remove EGame Service Address.", 
        async function () {
            await expect(DeployedEGameToken.connect(player).removeEGameServiceAddress(DeployedEGameService2.address))
            .to.be.revertedWith("Ownable: caller is not the owner");
        })

        it("Test Case 4: The caller who is owner can remove EGame Service Address.", 
        async function () {
            await DeployedEGameToken.removeEGameServiceAddress(DeployedEGameService2.address);
            expect(await DeployedEGameToken.hasRole(DeployedEGameToken.EGAME_SERVICE(), DeployedEGameService2.address)).equals(false);
        })

    })

    describe("[2.] Only registered EGame Service Address can trigger firstTimeTopUp function.", function () {

        it("Test Case 1: The caller who is not registered EGame Service Address can not trigger firstTimeTopUp function.", 
        async function () {
            await expect(DeployedEGameToken.firstTimeTopUp(player.address))
            .to.be.revertedWith("AccessControl: account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 is missing role 0x03851fd6f3f71e8dea4adac24787368b4e1afab0697e50366a3a4ca7ab0f55cd");
        })

    })

    describe("[3.] Anyone can top up with enough ETH payment.", function () {

        it("Test Case 1: The caller who doesn't send enough ETH can not top up token.", 
        async function () {
            await expect(DeployedEGameToken.topUpTokenByETH(10))
            .to.be.revertedWith("Not enough ETH payment.");
        })

        it("Test Case 2: The caller who sends enough ETH can top up token, and owner'll get ETH payment.", 
        async function () {
            let ownerETHBalanceBeforeTx = await owner.getBalance();
            let tx = await DeployedEGameToken.connect(player).topUpTokenByETH(10, { value: 10 });
            let rc = await tx.wait();
            let ownerETHBalanceAfterTx = await owner.getBalance();
            expect(await DeployedEGameToken.balanceOf(player.address)).equals(10);
            expect(ownerETHBalanceAfterTx.sub(ownerETHBalanceBeforeTx)).equals(10);

            // check TopUpToken event
            let event = rc.events.find((event) => event.event === 'TopUpToken'); 
            let results = event.args;
            expect(results.player).equals(player.address);
            expect(results.amount).equals(10);
        })

    })
})