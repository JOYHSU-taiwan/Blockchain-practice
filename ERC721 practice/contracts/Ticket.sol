// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./ITicket.sol";
import "./TransferHelper.sol";


contract Ticket is Ownable, ERC721URIStorage, ITicket {
    
    constructor(address mockToken) ERC721("Ticket", "NFTicket") {
        MockToken = mockToken;
        ServiceCharge = 1* 10 ** 18;
    }

    using Counters for Counters.Counter;
    Counters.Counter private tokenIdCounter;
    using EnumerableSet for EnumerableSet.AddressSet;

    address public immutable MockToken;
    uint256 public immutable ServiceCharge;
    EnumerableSet.AddressSet private Whitelist; // valid Service Contract 


    // [Owner only] add valid Servicce Contract
    function addWhitelist(address validServiceContract) 
    external onlyOwner { 
        Whitelist.add(validServiceContract);
    }

    function inWhitelist(address contractAddress) 
    public view returns (bool result) { 
        result = Whitelist.contains(contractAddress);
    }

    // [Valid Service Contract Only] mint Ticket
    function mintTicket(address customerAddress, uint256 ticketPrice) 
    external override returns (uint256 mintedTokenId){

        verifyCallerIsValidServiceContract();

        mintedTokenId = Counters.current(tokenIdCounter); // get current tokenId
        _safeMint(customerAddress, mintedTokenId);
        Counters.increment(tokenIdCounter); // increase tokenId after mint

        // distribute service charge to reseller pool and keep event fee in contract
        distributeServiceChargeToPool(ticketPrice); 
    }

    function distributeServiceChargeToPool(uint256 ticketPrice) 
    internal {   

        require(ticketPrice > ServiceCharge, "Ticket price is not enough to pay Service Charge.");
        
        // approve reseller pool owner to withdraw token in allowed amount (allowance)        
        uint256 originalResellerPool = checkAllowance(owner());
        TransferHelper.safeApprove(MockToken, owner(), originalResellerPool + ServiceCharge);
    }

    // [Valid Service Contract Only] refund event fee to ticket owner 
    function refundEventFeeToTicketOwner(uint256 tokenId, uint256 ticketPrice)
    external override {    

        verifyCallerIsValidServiceContract();

        address tokenIdOwner = ownerOf(tokenId);
        uint256 eventFee = ticketPrice - ServiceCharge;
        TransferHelper.safeTransfer(MockToken, tokenIdOwner, eventFee);
    }

    // [Valid Service Contract Only] distribute event fee to Event Holder pool
    function distributeEventFeeToPool(address eventHolder, uint256 ticketPrice) 
    external override {
        
        verifyCallerIsValidServiceContract();

        uint256 originalEventHolderPool = checkAllowance(eventHolder);     
        uint256 eventFee = ticketPrice - ServiceCharge;
        TransferHelper.safeApprove(MockToken, eventHolder, originalEventHolderPool + eventFee);
    }

    function checkAllowance(address spender) 
    public view returns (uint256 allowance) {
        allowance = IERC20(MockToken).allowance(address(this), spender);
    }

    function verifyCallerIsValidServiceContract ()
    internal view {
        require(inWhitelist(msg.sender), "Ticket Contract caller is not a valid Service Contract.");
    }

}
