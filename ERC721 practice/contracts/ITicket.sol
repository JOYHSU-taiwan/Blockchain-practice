// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITicket {
  
    function mintTicket(address customerAddress, uint256 ticketPrice) external returns (uint256 mintedTokenId);
    function refundEventFeeToTicketOwner(uint256 tokenId, uint256 ticketPrice) external;
    function distributeEventFeeToPool(address eventHolder, uint256 ticketPrice) external;

}
