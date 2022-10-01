# Running Project Instruction

## Prepare local environment
Run below command
```bash=
npm install
npx hardhat compile
```

## Run automated test script
Run below command
```bash=
npx hardhat test
```

## Run local node for testing
Run below command in a separate command line interface
```bash= 
# This is for running node locally
npx hardhat node
```

Run below command in another command line interface
```bash=
# This is for deploying contract to local node
npx hardhat run --network localhost scripts/deploy.js

# This is for interacting with contract to local node (task script refer to task folder)
npx hardhat run task/buyTicketTask.js --network localhost 
npx hardhat run task/refundTicketTask.js --network localhost
npx hardhat run task/redeemTicketTask.js --network localhost
npx hardhat run task/withdrawRevenueTask.js --network localhost
```