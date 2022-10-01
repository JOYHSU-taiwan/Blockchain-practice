// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// For Service Contract
struct EventInfo {
    uint256 ticketPrice;
    address eventHolder;
}

struct TicketInfo {
    uint256 eventNumber;
    Status ticketStatus;
}

enum Status {
    UNUSED, 
    USED, 
    REFUNDED
}