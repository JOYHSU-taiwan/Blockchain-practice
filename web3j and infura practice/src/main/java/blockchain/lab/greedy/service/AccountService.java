package blockchain.lab.greedy.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthGetBalance;
import org.web3j.utils.Convert;

import java.math.BigDecimal;
import java.util.concurrent.ExecutionException;

@Service
public class AccountService {

    @Autowired
    private Web3j web3j;

    public String getAccountBalance(String accountAddress) throws ExecutionException, InterruptedException {

        EthGetBalance balance = web3j
                .ethGetBalance(accountAddress, DefaultBlockParameterName.LATEST)
                .sendAsync()
                .get();

        BigDecimal balanceInEther = Convert.fromWei(balance.getBalance().toString(), Convert.Unit.ETHER);

        return balanceInEther.toString();
    }

}
