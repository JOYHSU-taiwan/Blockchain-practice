playGame.addEventListener("click", () => {
  playEmageAmount = tokenAmount.value;
  tokenAmount.value = "";
    console.log(
      "play egame token amount: ",
      typeof playEmageAmount,
      playEmageAmount
    );

  getCurrentEgameBalance()
    .then((response) => {
      //   console.log("current Egame Balance: ", typeof response, response);
      console.log(
        "playEmageAmount > response: ",
        parseInt(playEmageAmount) > parseInt(response)
      );
      if (parseInt(playEmageAmount) > parseInt(response)) {
        alert("You don't have sufficient EGame token!");
      } else {
        // approve Egame service contract
        egame_token.methods
          .approve(egame_service_address, parseInt(playEmageAmount))
          .send({ from: account })
          .then(function (receipt) {
            console.log("approve receipt", receipt);

            // play game
            egame_service.methods
              .playGame(parseInt(playEmageAmount))
              .send({ from: account })
              .then(function (receipt) {
                console.log("play game receipt", receipt);
                getAccountBalance(account);
              });

          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

async function getCurrentEgameBalance() {
  return await egame_token.methods.balanceOf(account).call();
}
