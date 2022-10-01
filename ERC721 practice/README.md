# Project Introduction

## Role

### Event Holder : 
* The one who holds an event/events
### Contract Owner/Reseller : 
* The one who sells ticket for events
* Owner of Ticket Contract & Service Contract
### Customer : 
* The one who attends the event
---
## Contract

### Service Contract:   
* Owner set valid Event Holder
* Event Holder define event information
* Customer buy ticket, refund ticket and redeem ticket
### Ticket Contract: 
* Owner set valid Service Contract
* Service Contract request to mint ticket, refund event fee and distribute revenue
### Token Contract: 
* ERC20 token for buying/selling ticket
---
## Business Logic

### Reseller(Contract Owner) handle access control
* Add valid Event Holder in Role of Service Contract
* Add valid Service Contract address in Whitelist of Ticket Contract

### Event Holder register event
* Event Holder register event number and ticket price in Service Contract

### Customer buy ticket
![](https://i.imgur.com/RrshVDq.png)

### Customer attend event
![](https://i.imgur.com/bjQFwcL.png)

### Customer refund ticket
![](https://i.imgur.com/HL4aRHR.png)

### Reseller & Event Holder withdraw revenue from revenue pool
* Reseller/Event Holder could check their revenur pool and withdraw to their wallet


