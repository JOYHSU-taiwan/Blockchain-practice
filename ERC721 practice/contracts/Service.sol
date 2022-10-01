// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./DataType.sol";
import "./ITicket.sol";
import "./TransferHelper.sol";

contract Service is Ownable, AccessControl {

    constructor(address mockToken, address ticketContract) {
        MockToken = mockToken;
        TicketContract = ticketContract;
    }

    address public immutable MockToken;
    address public immutable TicketContract;
    mapping(uint256 => TicketInfo) public TicketRecords; // ticket number map ticket info
    mapping(uint256 => EventInfo) public EventRecords; // event number map event info

    // EVENT_HOLDER Role
    bytes32 public constant EVENT_HOLDER = keccak256("EVENT_HOLDER");

    // [Owner Only] set event holder
    function addEventHolder(address eventHolder) 
    external onlyOwner {
        _setupRole(EVENT_HOLDER, eventHolder);
    }

    // [Event Holder only] setup event information
    function setupEventInfo(uint256 eventNumber, uint256 ticketPrice) 
    external onlyRole(EVENT_HOLDER)  { 
        EventRecords[eventNumber] = EventInfo(ticketPrice, msg.sender);
    }

    // Start from Customer calling this function
    // Customer need to approve this contract to transfer token away from him/her wallet address before calling
    function buyTicket(uint256 eventNumber) 
    external {

        address customerAddress = msg.sender;
        uint256 ticketPrice = EventRecords[eventNumber].ticketPrice;
        require(ticketPrice > 0, "Ticket Price should more than 0 for each event.");

        // before mint ticket
        preMint(customerAddress, ticketPrice);

        // mint ticket
        uint256 mintedTicketId = ITicket(TicketContract).mintTicket(customerAddress, ticketPrice);

        // after mint ticket
        postMint(mintedTicketId, eventNumber);
    }

    function preMint(address customerAddress, uint256 ticketPrice) 
    internal {

        // check customer allowance equal or more than ticket price
        require(
            IERC20(MockToken).allowance(customerAddress, address(this)) >= ticketPrice,
            "Customer token allowance is insufficient."
        );

        // check customer ERC20 balance is equal or more than ticket price
        require(
            IERC20(MockToken).balanceOf(customerAddress) >= ticketPrice,
            "Customer token balance is insufficient."
        );

        // Service Contract transfer token from customer to Ticket Contract
        TransferHelper.safeTransferFrom(MockToken, customerAddress, TicketContract, ticketPrice);
    }

    function postMint(uint256 mintedTicketId, uint256 eventNumber) 
    internal {

        // record ticket info
        TicketRecords[mintedTicketId] = TicketInfo(eventNumber, Status.UNUSED);
    }

    // [Ticket Owner Only] ticket owner ask for event fee refund
    function refundEventFee(uint256 ticketId) 
    external {

        verifyCallerIsTicketOwner(ticketId);
        verifyTicketStatusIsUnused(ticketId);

        // refund event fee to ticket owner
        (address eventHolder, uint256 ticketPrice) = getEventInfoByTicketId(ticketId); 
        ITicket(TicketContract).refundEventFeeToTicketOwner(ticketId, ticketPrice);

        TicketRecords[ticketId].ticketStatus = Status.REFUNDED;
    }

    // [Ticket Owner Only] ticket owner attend event 
    function redeemEventFee(uint256 ticketId) 
    external {
        verifyCallerIsTicketOwner(ticketId);
        verifyTicketStatusIsUnused(ticketId);

        // distribute event fee to event holder's revenue pool
        (address eventHolder, uint256 ticketPrice) = getEventInfoByTicketId(ticketId); 
        ITicket(TicketContract).distributeEventFeeToPool(eventHolder, ticketPrice);

        TicketRecords[ticketId].ticketStatus = Status.USED;
    }

    function verifyCallerIsTicketOwner(uint256 ticketId)
    internal view {
        address ticketIdOwner = IERC721(TicketContract).ownerOf(ticketId);
        require(msg.sender == ticketIdOwner, "Only Ticket owner can refund or redeem.");
    }

    function verifyTicketStatusIsUnused(uint256 ticketId)
    internal view {
        require(TicketRecords[ticketId].ticketStatus == Status.UNUSED, "Only UNUSED ticket can be refund or redeem.");
    }

    function getEventInfoByTicketId(uint256 ticketId) 
    internal view returns (address eventHolder, uint256 ticketPrice) {
        uint256 eventNumber = TicketRecords[ticketId].eventNumber;
        eventHolder = EventRecords[eventNumber].eventHolder;
        ticketPrice = EventRecords[eventNumber].ticketPrice;
    }
}


