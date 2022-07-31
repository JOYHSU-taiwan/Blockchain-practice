// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

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
        pool[pool1_Owner] += (amount * 6) / 10;
        pool[pool2_Owner] += (amount * 4) / 10;
    }

    // Pool Owner withdraw Token to their wallet
    function tokenWithdraw() public {
        uint256 poolBalanceBeforeWithdraw = pool[msg.sender];
        safeTransfer(JoyToken, msg.sender, poolBalanceBeforeWithdraw);
        pool[msg.sender] -= poolBalanceBeforeWithdraw;
    }

    function safeTransfer(address token, address to, uint256 value) internal {
        // bytes4(keccak256(bytes('transfer(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))),"TransferHelper: TRANSFER_FAILED");
    }
}
