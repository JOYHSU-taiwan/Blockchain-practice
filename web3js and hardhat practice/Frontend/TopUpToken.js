topUpToken.addEventListener("click", () => {
  topUpAmount = topUpTokenAmount.value;
  topUpTokenAmount.value = "";

  egame_token.methods
    .topUpTokenByETH(parseInt(topUpAmount))
    .send({ from: account, value: parseInt(topUpAmount) })
    .then(function (receipt) {
      console.log("top up token receipt", receipt);
      getAccountBalance(account);
    });

});
