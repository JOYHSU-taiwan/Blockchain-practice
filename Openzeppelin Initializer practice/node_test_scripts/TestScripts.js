async function main() {

    const accounts = await ethers.provider.listAccounts();
    console.log('account list as below:');
    console.log(accounts);

    // For local testing
    const contractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
    // For testnet testing
    // const contractAddress = '0xba00222f0f19E23212591BF8059cE00180c8A1CB';
    const Box = await ethers.getContractFactory('AdminBox');
    const box = await Box.attach(contractAddress);

    console.log('Admin address is ', await box.showAdmin());

    await box.store(25);

    const value = await box.retrieve();

    console.log('Box value is', value.toString());
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });