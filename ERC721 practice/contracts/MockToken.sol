// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {

    constructor() ERC20("MockToken", "MT") {
        _mint(msg.sender, 100000 * 10 ** decimals());
    }

    // top up token for testing
    function mint() public {
        _mint(msg.sender, 10 * 10 ** decimals());
    }

}