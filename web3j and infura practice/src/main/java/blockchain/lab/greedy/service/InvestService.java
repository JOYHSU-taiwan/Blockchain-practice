package blockchain.lab.greedy.service;

import org.apache.commons.math3.random.RandomDataGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.protocol.Web3j;

@Service
public class InvestService {

    @Autowired
    private Web3j web3j;

    private final String CONTRACT_ADDRESS = "0x854396091A282e82B9fef212a30f3959d710E9a7";

    public int getramdomNumber() {
        RandomDataGenerator randomDataGenerator = new RandomDataGenerator();
        int randomWithRandomDataGenerator = randomDataGenerator.nextInt(1, 11);
        return randomWithRandomDataGenerator;
    }


}
