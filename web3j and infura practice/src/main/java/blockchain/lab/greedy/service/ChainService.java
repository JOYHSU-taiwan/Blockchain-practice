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
public class ChainService {

    @Autowired
    private Web3j web3j;

    private final String CONTRACT_ADDRESS = "0x854396091A282e82B9fef212a30f3959d710E9a7";

    public String getChainBalance() throws ExecutionException, InterruptedException {

        EthGetBalance balance = web3j
                .ethGetBalance(CONTRACT_ADDRESS, DefaultBlockParameterName.LATEST)
                .sendAsync()
                .get();

        BigDecimal balanceInEther = Convert.fromWei(balance.getBalance().toString(), Convert.Unit.ETHER);

        return balanceInEther.toString();
    }

}
