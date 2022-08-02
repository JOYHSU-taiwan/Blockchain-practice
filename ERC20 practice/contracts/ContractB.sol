// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./library/TransferHelper.sol";

contract ContractB is Ownable {
    constructor() {}

    address public JoyToken;

    mapping(address => uint256) public pool;
    address public pool1_Owner;
    address public pool2_Owner;

    function setupJoyToken(address _JoyToken) public onlyOwner {
        JoyToken = _JoyToken;
    }

    function setupPool1Owner(address _pool1Owner) public onlyOwner {
        pool1_Owner = _pool1Owner;
    }

    function setupPool2Owner(address _pool2Owner) public onlyOwner {
        pool2_Owner = _pool2Owner;
    }

    // Contract B distribute Token to pool
    function tokenDistribution(uint256 amount) public {
        require(pool[pool1_Owner] + pool[pool2_Owner] + amount <= IERC20(JoyToken).balanceOf(address(this)), "Token in Contract insufficient.");
        uint256 pool1Amount = (amount * 6) / 10;
        pool[pool1_Owner] += pool1Amount;
        pool[pool2_Owner] += (amount - pool1Amount);
    }

    // Pool Owner withdraw Token to their wallet
    function tokenWithdraw() public {
        uint256 poolBalanceBeforeWithdraw = pool[msg.sender];
        TransferHelper.safeTransfer(JoyToken, msg.sender, poolBalanceBeforeWithdraw);
        pool[msg.sender] -= poolBalanceBeforeWithdraw;
    }

}
