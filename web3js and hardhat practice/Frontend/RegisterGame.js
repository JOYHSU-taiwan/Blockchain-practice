register.addEventListener("click", () => {
  getStatus()
    .then((response) => {
      console.log("current register status: ", response);
      if (response) {
        alert("You've already registerd!");
      } else {
        egame_service.methods
          .playerRegistration()
          .send({ from: account })
          .then(function (receipt) {
            console.log("register receipt", receipt);
            getAccountBalance(account);
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

async function getStatus() {
  return await egame_service.methods.isRegistered(account).call();
}
