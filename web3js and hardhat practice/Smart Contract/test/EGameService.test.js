const { expect } = require("chai");

describe("EGameService test", function () {

    let owner;
    let player;
    let unRegisteredPlayer;

    let EGameToken;
    let DeployedEGameToken;
    let EGameService;
    let DeployedEGameService;

    before(async function () {
        [owner, player, unRegisteredPlayer] = await ethers.getSigners();

        EGameToken = await ethers.getContractFactory("EGameToken");
        DeployedEGameToken = await EGameToken.deploy();
        await DeployedEGameToken.deployed();
        // console.log("EGameToken deployed to:", DeployedEGameToken.address);

        EGameService = await ethers.getContractFactory("EGameService");
        DeployedEGameService = await EGameService.deploy(DeployedEGameToken.address);
        await DeployedEGameService.deployed();
        // console.log("EGameService deployed to:", DeployedEGameService.address);
    })

    describe("[1.] Owner set EGame Service Address in EGameToken contract.", function () {

        it("Test Case 1: The caller who is owner can set EGame Service Address.", 
        async function () {
            await DeployedEGameToken.setEGameServiceAddress(DeployedEGameService.address);
            expect(await DeployedEGameToken.hasRole(DeployedEGameToken.EGAME_SERVICE(), DeployedEGameService.address)).equals(true);
        })

    })

    describe("[2.] New player can register and get free token.", function () {

        it("Test Case 1: The caller who is new player can register and get free token.", 
        async function () {
            expect(await DeployedEGameService.isRegistered(player.address)).equals(false);
            let tx = await DeployedEGameService.connect(player).playerRegistration();
            let rc = await tx.wait();
            expect(await DeployedEGameService.isRegistered(player.address)).equals(true);
            expect(await DeployedEGameToken.balanceOf(player.address)).equals(10);
            expect(await DeployedEGameService.getScore(player.address)).equals(0);

            // check NewPlayerRegistered event
            let event = rc.events.find((event) => event.event === 'NewPlayerRegistered'); 
            let results = event.args;
            expect(results.player).equals(player.address);
        })

        it("Test Case 2: The caller who is NOT new player can NOT register and get free token.", 
        async function () {
            expect(await DeployedEGameService.isRegistered(player.address)).equals(true);
            await expect(DeployedEGameService.connect(player).playerRegistration())
            .to.be.revertedWith("Only new player can register.");
        })

    })

    describe("[3.] Registered player can play game with enough token payment.", function () {

        it("Test Case 1: The caller who is NOT a registered player can NOT play game.", 
        async function () {
            expect(await DeployedEGameService.isRegistered(unRegisteredPlayer.address)).equals(false);
            await expect(DeployedEGameService.connect(unRegisteredPlayer).playGame(10))
            .to.be.revertedWith("Need to register before play game.");
        })

        it("Test Case 2: The caller who is a registered player can NOT play game without sufficient allowance.", 
        async function () {
            expect(await DeployedEGameService.isRegistered(player.address)).equals(true);
            await expect(DeployedEGameService.connect(player).playGame(10))
            .to.be.revertedWith("Player allowance not enough.");
        })

        it("Test Case 3: The caller who is a registered player can play game with sufficient allowance.", 
        async function () {
            await DeployedEGameToken.connect(player).approve(DeployedEGameService.address, 10);
            expect(await DeployedEGameToken.allowance(player.address, DeployedEGameService.address)).equals(10);

            let tokenBalanceOfTokenContractBeforeTx = await DeployedEGameToken.balanceOf(DeployedEGameToken.address);
            let tokenBalanceOfPlayerBeforeTx = await DeployedEGameToken.balanceOf(player.address);
            let scoreOfPlayerBeforeTx = await DeployedEGameService.getScore(player.address);

            let tx = await DeployedEGameService.connect(player).playGame(10);
            let rc = await tx.wait();

            let tokenBalanceOfTokenContractAfterTx = await DeployedEGameToken.balanceOf(DeployedEGameToken.address);
            let tokenBalanceOfPlayerAfterTx = await DeployedEGameToken.balanceOf(player.address);
            let scoreOfPlayerAfterTx = await DeployedEGameService.getScore(player.address);

            // check NewPlayerRegistered event
            let event = rc.events.find((event) => event.event === 'GameResult'); 
            let results = event.args;
            expect(results.player).equals(player.address);
            expect(results.inputTokenAmount).equals(10);
            let gainedScore = results.gainedScore;
            expect(scoreOfPlayerAfterTx.sub(scoreOfPlayerBeforeTx)).equals(gainedScore);
            expect(results.scoreAfterGame).equals(scoreOfPlayerAfterTx);

            expect(tokenBalanceOfTokenContractAfterTx.sub(tokenBalanceOfTokenContractBeforeTx)).equals(10);
            expect(tokenBalanceOfPlayerBeforeTx.sub(tokenBalanceOfPlayerAfterTx)).equals(10);
        })

    })

})