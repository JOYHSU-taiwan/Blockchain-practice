# Running Project Instruction

## Build project
```bash=
npm install
```

## Compile project
```bash=
npx hardhat compile
```

## Run automated test script
```bash=
npx hardhat test
```

## Deploy to Goerli testnet
copy .env.example file and rename it as .env & update .env deployment section
```bash= 
npx hardhat run script/deploy.js --network goerli
```

## Verify contract in Goerli testnet
verify EGame Service contract
```bash=
npx hardhat verify --network goerli {EGAME_SERVICE_ADDRESS} {EGAME_TOKEN_ADDRESS}
```
verify EGame Token contract
```bash=
npx hardhat verify --network goerli {EGAME_TOKEN_ADDRESS}
```

## Run task script to test contract in Goerli testnet
update .env task section before running task
```bash=
npx hardhat run task/1.SetEGameServiceAddressTask.js --network goerli

npx hardhat run task/2.PlayerRegistrationTask.js --network goerli

npx hardhat run task/3.PlayGameTask.js --network goerli

# make sure you have enough test ether in Goerli before top up
npx hardhat run task/4.TopUpTokenTask.js --network goerli
```