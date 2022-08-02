// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./library/TransferHelper.sol";

contract ContractA is Ownable {
    
    constructor () {
    }

    address public JoyToken; 
    address public ContractB_Address;

    function setupJoyToken(address _JoyToken) public onlyOwner {
        JoyToken = _JoyToken;
    }

    function setupContractB(address _ContractB_Address) public onlyOwner {
        ContractB_Address = _ContractB_Address;
    }

    // method 1, customer approve Contract A to transfer his/her token 
    // Customer need to approve the amount before this  
    function transferByApprove(uint256 amount) public {
        // Contract A can take part of the token before transfer to Contract B
        uint256 contractAAmount = amount*2/10;
        TransferHelper.safeTransferFrom(JoyToken, msg.sender, address(this), contractAAmount);
        TransferHelper.safeTransferFrom(JoyToken, msg.sender, ContractB_Address, amount - contractAAmount);
    }

    // method 2, Customer transfer token to ContractA directly
    function transferDirectly(uint256 amount) public {
        // Contract A can keep part of the token before transfer to Contract B
        TransferHelper.safeTransfer(JoyToken, ContractB_Address, amount*8/10);
    }
    
}