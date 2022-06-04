// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.14;

// When running your contracts and tests on Hardhat Network you can print logging messages and contract variables calling console.log() from your Solidity code.
// To use it you have to import hardhat/console.sol
import "hardhat/console.sol";

contract DebugDemo {
    string public name = "My Hardhat Token";
    string public symbol = "MHT";

    uint256 public totalSupply = 1000000;

    address public owner;

    mapping(address => uint256) balances;

    constructor() {
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    function transfer(address to, uint256 amount) external {
        // The logging output will show when you run your tests
        console.log("Sender balance is %s tokens", balances[msg.sender]);
        console.log("Trying to send %s tokens to %s", amount, to);

        require(balances[msg.sender] >= amount, "Not enough tokens");

        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
