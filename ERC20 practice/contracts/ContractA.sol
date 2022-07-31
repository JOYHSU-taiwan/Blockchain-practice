// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

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
        safeTransferFrom(JoyToken, msg.sender, address(this), amount*2/10);
        safeTransferFrom(JoyToken, msg.sender, ContractB_Address, amount*8/10);
    }

    // method 2, Customer transfer token to ContractA directly
    function transferDirectly(uint256 amount) public {
        // Contract A can keep part of the token before transfer to Contract B
        safeTransfer(JoyToken, ContractB_Address, amount*8/10);
    }

    function safeTransfer(address token, address to, uint256 value) internal {
        // bytes4(keccak256(bytes('transfer(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: TRANSFER_FAILED');
    }

    function safeTransferFrom( address token, address from, address to, uint256 value) internal {
        // bytes4(keccak256(bytes('transferFrom(address,address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x23b872dd, from, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: TRANSFER_FROM_FAILED');
    }

}