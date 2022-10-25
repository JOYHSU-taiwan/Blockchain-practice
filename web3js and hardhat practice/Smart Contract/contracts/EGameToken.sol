// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./library/TransferHelper.sol";
import "./interface/IEGameToken.sol";

contract EGameToken is ERC20, Ownable, IEGameToken, AccessControl {

    // EGAME_SERVICE Role
    bytes32 public constant EGAME_SERVICE = keccak256("EGameServiceAddress");

    event TopUpToken(address player, uint256 amount);

    constructor() ERC20("EGameToken", "EGame") { }

    function setEGameServiceAddress(address _EGameServiceAddress) 
    external onlyOwner {
        _setupRole(EGAME_SERVICE, _EGameServiceAddress);
    }

    function removeEGameServiceAddress(address _EGameServiceAddress) 
    external onlyOwner {
        _revokeRole(EGAME_SERVICE, _EGameServiceAddress);
    }

    function firstTimeTopUp(address playerAddress) 
    external onlyRole(EGAME_SERVICE) {
        _mint(playerAddress, 10);

        emit TopUpToken(playerAddress, 10);
    }

    function topUpTokenByETH(uint256 amount) 
    external payable{
        require(amount == msg.value, "Not enough ETH payment.");
        _mint(msg.sender, amount);
        TransferHelper.safeTransferETH(owner(), amount);

        emit TopUpToken(msg.sender, amount);
    }

}
