// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./library/TransferHelper.sol";
import "./interface/IEGameToken.sol";

contract EGameService {

    constructor(address _EGameTokenAddress) { EGameTokenAddress = _EGameTokenAddress; }

    address public EGameTokenAddress;
    using EnumerableSet for EnumerableSet.AddressSet;
    EnumerableSet.AddressSet private registeredPlayer;
    mapping(address => uint256) public scoreRecords; 
    
    event NewPlayerRegistered(address player);
    event GameResult(address player, uint256 inputTokenAmount, uint256 gainedScore, uint256 scoreAfterGame);

    function playerRegistration() 
    external {
        require(isRegistered(msg.sender) == false, "Only new player can register.");

        registeredPlayer.add(msg.sender);
        IEGameToken(EGameTokenAddress).firstTimeTopUp(msg.sender);
        scoreRecords[msg.sender] = 0;  

        emit NewPlayerRegistered(msg.sender);     
    }

    // player need to approve EGameService input token amount before play game
    function playGame(uint256 inputTokenAmount) 
    external {
        require(isRegistered(msg.sender) == true, "Need to register before play game.");

        uint256 allowance = IERC20(EGameTokenAddress).allowance(msg.sender, address(this));
        require(allowance >= inputTokenAmount, "Player allowance not enough.");

        TransferHelper.safeTransferFrom(EGameTokenAddress, msg.sender, EGameTokenAddress, inputTokenAmount);

        uint8 randomNumber = getRandomNumber();
        scoreRecords[msg.sender] += (inputTokenAmount*randomNumber);

        emit GameResult(msg.sender, inputTokenAmount, inputTokenAmount*randomNumber, getScore(msg.sender));
    }

    function getRandomNumber() 
    private view returns (uint8) {
        // random number between 1-5
        uint8 originalRandomNumber = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty)))%5); 
        return (originalRandomNumber + 1);
    }

    function isRegistered(address player) 
    public view returns (bool result) {
        result = registeredPlayer.contains(player);
    }

    function getScore(address player)
    public view returns (uint256 score) {
        score = scoreRecords[player];
    }

}
