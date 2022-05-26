package blockchain.lab.greedy.controller;

import blockchain.lab.greedy.service.AccountService;
import blockchain.lab.greedy.service.ChainService;
import blockchain.lab.greedy.service.InvestService;
import org.apache.commons.math3.random.RandomDataGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Uint;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.ECKeyPair;
import org.web3j.crypto.RawTransaction;
import org.web3j.crypto.TransactionEncoder;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.*;
import org.web3j.protocol.exceptions.TransactionException;
import org.web3j.tx.ChainId;
import org.web3j.utils.Convert;
import org.web3j.utils.Numeric;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
public class Controller {

    @Autowired
    ChainService chainService;
    @Autowired
    AccountService accountService;
    @Autowired
    InvestService investService;

    @Autowired
    private Web3j web3j;

    @GetMapping("/getChainBalance")
    public String getChainBalanceInEther() throws ExecutionException, InterruptedException {
        String chainBalance = chainService.getChainBalance();
        return chainBalance;
    }

    @GetMapping("/getAccountBalance/{account_Address}")
    public String getAccountBalanceInEther(
            @PathVariable String account_Address
    ) throws ExecutionException, InterruptedException {
        String accountBalance = accountService.getAccountBalance(account_Address);
        return accountBalance;
    }

    @PostMapping("/invest")
    public void invest(
            @RequestParam String playerAddress,
            @RequestParam BigDecimal fundInEther,
            @RequestParam String privateKey
    ) throws ExecutionException, InterruptedException, IOException, TransactionException {
        EthGetTransactionCount ethGetTransactionCount =
                web3j.ethGetTransactionCount(playerAddress, DefaultBlockParameterName.LATEST).send();
        BigInteger nonce = ethGetTransactionCount.getTransactionCount();
        System.out.println("nonce " + nonce);

        BigInteger fundInWei = Convert.toWei(fundInEther, Convert.Unit.ETHER).toBigInteger();
        System.out.println("fundInWei " + fundInWei);

        RandomDataGenerator randomDataGenerator = new RandomDataGenerator();
        int randomWithRandomDataGenerator = randomDataGenerator.nextInt(1, 11);
        System.out.println("random number " + randomWithRandomDataGenerator);

        List<Type> inputParameters = new ArrayList<>();
        Uint value = new Uint(new BigInteger(String.valueOf(randomWithRandomDataGenerator)));
        inputParameters.add(value);

        Function function = new Function(
                "invest",  // function we're calling
                inputParameters,  // Parameters to pass as Solidity Types
                Collections.emptyList());
        String encodedFunction = FunctionEncoder.encode(function);

        RawTransaction rawTransaction = RawTransaction.createTransaction(
                nonce, // BigInteger nonce,
                new BigInteger("80000"), // BigInteger gasPrice,
                new BigInteger("100000"), // BigInteger gasLimit,
                "0x854396091A282e82B9fef212a30f3959d710E9a7", // String to,
                fundInWei, // BigInteger value,
                encodedFunction// String data
        );

        ECKeyPair ecKeyPair = ECKeyPair.create(new BigInteger(privateKey, 16));
        Credentials credentials = Credentials.create(ecKeyPair);

        byte[] signedMessage;
        signedMessage = TransactionEncoder.signMessage(rawTransaction, ChainId.RINKEBY,credentials);
        String hexValue = Numeric.toHexString(signedMessage);

        EthSendTransaction ethSendTransaction = web3j.ethSendRawTransaction(hexValue).send();
        EthGetTransactionReceipt receipt = web3j
                .ethGetTransactionReceipt(ethSendTransaction.getTransactionHash())
                .sendAsync()
                .get();

        System.out.println("TransactionHash " + receipt.getJsonrpc());
        System.out.println();
    }

    @GetMapping("/invest/history")
    public List investHistory() {
        return null;
    }

}
