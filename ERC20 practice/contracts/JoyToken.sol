// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract JoyToken is ERC20 {

    constructor() ERC20("JoyToken", "JT") {
        _mint(msg.sender, 100000 * 10 ** decimals());
    }

    // top up token
    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }

}