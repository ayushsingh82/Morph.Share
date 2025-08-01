// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title Event Payment Contract
 * @dev Manages event payments with time-based activation and fund management
 */
contract Event is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;

    // Structs
    struct Payment {
        address payer;
        uint256 amount;
        uint256 timestamp;
        string description;
    }

    struct EventDetails {
        uint256 eventId;
        string name;
        string description;
        address payable walletAddress;
        uint256 activeUntil;
        uint256 createdAt;
        address creator;
        uint256 balance;
        bool isActive;
        Payment[] payments;
        mapping(address => uint256) totalPaidByUser;
        address[] contributors;
    }

    // State variables
    Counters.Counter private _eventIdCounter;
    mapping(uint256 => EventDetails) public events;
    mapping(address => uint256[]) public userEvents; // Events created by user
    mapping(address => uint256[]) public userContributions; // Events user contributed to

    // Events
    event EventCreated(
        uint256 indexed eventId,
        string name,
        string description,
        address indexed walletAddress,
        uint256 activeUntil,
        address indexed creator,
        uint256 createdAt
    );

    event DepositReceived(
        uint256 indexed eventId,
        address indexed payer,
        uint256 amount,
        string description,
        uint256 timestamp
    );

    event WithdrawalMade(
        uint256 indexed eventId,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );

    event EventExpired(
        uint256 indexed eventId,
        uint256 finalBalance,
        uint256 timestamp
    );

    // Modifiers
    modifier eventExists(uint256 eventId) {
        require(events[eventId].creator != address(0), "Event does not exist");
        _;
    }

    modifier onlyEventCreator(uint256 eventId) {
        require(events[eventId].creator == msg.sender, "Only event creator can perform this action");
        _;
    }

    modifier eventIsActive(uint256 eventId) {
        require(events[eventId].isActive, "Event is not active");
        require(block.timestamp <= events[eventId].activeUntil, "Event has expired");
        _;
    }

    modifier eventHasExpired(uint256 eventId) {
        require(block.timestamp > events[eventId].activeUntil, "Event is still active");
        _;
    }

    /**
     * @dev Create a new event
     * @param name Event name
     * @param description Event description
     * @param walletAddress Address where funds will be sent
     * @param activeUntil Timestamp until which event is active
     */
    function createEvent(
        string memory name,
        string memory description,
        address payable walletAddress,
        uint256 activeUntil
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Event name cannot be empty");
        require(bytes(description).length > 0, "Event description cannot be empty");
        require(walletAddress != address(0), "Invalid wallet address");
        require(activeUntil > block.timestamp, "Active until time must be in the future");

        uint256 eventId = _eventIdCounter.current();
        _eventIdCounter.increment();

        EventDetails storage newEvent = events[eventId];
        newEvent.eventId = eventId;
        newEvent.name = name;
        newEvent.description = description;
        newEvent.walletAddress = walletAddress;
        newEvent.activeUntil = activeUntil;
        newEvent.creator = msg.sender;
        newEvent.createdAt = block.timestamp;
        newEvent.balance = 0;
        newEvent.isActive = true;

        // Track user events
        userEvents[msg.sender].push(eventId);

        emit EventCreated(eventId, name, description, walletAddress, activeUntil, msg.sender, block.timestamp);

        return eventId;
    }

    /**
     * @dev Deposit amount to an event
     * @param eventId ID of the event
     * @param amount Amount to deposit
     */
    function depositToEvent(uint256 eventId, uint256 amount) 
        external 
        payable 
        nonReentrant 
        eventExists(eventId) 
        eventIsActive(eventId) 
    {
        require(amount > 0, "Deposit amount must be greater than 0");
        require(msg.value == amount, "Sent value must match specified amount");

        EventDetails storage eventData = events[eventId];

        // Create payment record
        Payment memory newPayment = Payment({
            payer: msg.sender,
            amount: amount,
            timestamp: block.timestamp,
            description: "Event deposit"
        });

        eventData.payments.push(newPayment);
        eventData.balance += amount;

        // Track user contributions
        if (eventData.totalPaidByUser[msg.sender] == 0) {
            eventData.contributors.push(msg.sender);
            userContributions[msg.sender].push(eventId);
        }
        eventData.totalPaidByUser[msg.sender] += amount;

        // Transfer funds to event wallet
        eventData.walletAddress.transfer(amount);

        emit DepositReceived(eventId, msg.sender, amount, "Event deposit", block.timestamp);
    }

    /**
     * @dev Withdraw amount from event (only creator can withdraw)
     * @param eventId ID of the event
     * @param amount Amount to withdraw
     */
    function withdrawFromEvent(uint256 eventId, uint256 amount) 
        external 
        nonReentrant 
        onlyEventCreator(eventId) 
        eventExists(eventId) 
    {
        EventDetails storage eventData = events[eventId];
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(amount <= eventData.balance, "Insufficient balance for withdrawal");

        eventData.balance -= amount;
        payable(msg.sender).transfer(amount);

        emit WithdrawalMade(eventId, msg.sender, amount, block.timestamp);
    }

    /**
     * @dev Get complete event details
     * @param eventId ID of the event
     * @return name Event name
     * @return description Event description
     * @return walletAddress Address where funds are sent
     * @return activeUntil Timestamp until event is active
     * @return createdAt Creation timestamp
     * @return creator Event creator address
     * @return balance Current balance
     * @return isActive Whether event is active
     * @return totalContributors Number of contributors
     */
    function getEventDetails(uint256 eventId) 
        external 
        view 
        eventExists(eventId) 
        returns (
            string memory name,
            string memory description,
            address walletAddress,
            uint256 activeUntil,
            uint256 createdAt,
            address creator,
            uint256 balance,
            bool isActive,
            uint256 totalContributors
        ) 
    {
        EventDetails storage eventData = events[eventId];
        bool isStillActive = eventData.isActive && block.timestamp <= eventData.activeUntil;
        
        return (
            eventData.name,
            eventData.description,
            eventData.walletAddress,
            eventData.activeUntil,
            eventData.createdAt,
            eventData.creator,
            eventData.balance,
            isStillActive,
            eventData.contributors.length
        );
    }

    /**
     * @dev Get payment details for an event
     * @param eventId ID of the event
     * @param paymentIndex Index of the payment
     * @return payer Address of the payer
     * @return amount Amount paid
     * @return timestamp When payment was made
     * @return description Payment description
     */
    function getPaymentDetails(uint256 eventId, uint256 paymentIndex) 
        external 
        view 
        eventExists(eventId) 
        returns (
            address payer,
            uint256 amount,
            uint256 timestamp,
            string memory description
        ) 
    {
        EventDetails storage eventData = events[eventId];
        require(paymentIndex < eventData.payments.length, "Payment index out of bounds");
        
        Payment storage payment = eventData.payments[paymentIndex];
        return (
            payment.payer,
            payment.amount,
            payment.timestamp,
            payment.description
        );
    }

    /**
     * @dev Get all payments for an event
     * @param eventId ID of the event
     * @return payers Array of payer addresses
     * @return amounts Array of amounts
     * @return timestamps Array of timestamps
     * @return descriptions Array of descriptions
     */
    function getEventPayments(uint256 eventId) 
        external 
        view 
        eventExists(eventId) 
        returns (
            address[] memory payers,
            uint256[] memory amounts,
            uint256[] memory timestamps,
            string[] memory descriptions
        ) 
    {
        EventDetails storage eventData = events[eventId];
        uint256 paymentCount = eventData.payments.length;
        
        payers = new address[](paymentCount);
        amounts = new uint256[](paymentCount);
        timestamps = new uint256[](paymentCount);
        descriptions = new string[](paymentCount);

        for (uint256 i = 0; i < paymentCount; i++) {
            Payment storage payment = eventData.payments[i];
            payers[i] = payment.payer;
            amounts[i] = payment.amount;
            timestamps[i] = payment.timestamp;
            descriptions[i] = payment.description;
        }
    }

    /**
     * @dev Get user contribution to an event
     * @param eventId ID of the event
     * @param user Address of the user
     * @return totalPaid Total amount paid by user
     * @return paymentCount Number of payments made by user
     */
    function getUserContribution(uint256 eventId, address user) 
        external 
        view 
        eventExists(eventId) 
        returns (uint256 totalPaid, uint256 paymentCount) 
    {
        EventDetails storage eventData = events[eventId];
        totalPaid = eventData.totalPaidByUser[user];
        
        // Count payments by this user
        for (uint256 i = 0; i < eventData.payments.length; i++) {
            if (eventData.payments[i].payer == user) {
                paymentCount++;
            }
        }
    }

    /**
     * @dev Get all events created by a user
     * @param user Address of the user
     * @return Array of event IDs
     */
    function getUserEvents(address user) external view returns (uint256[] memory) {
        return userEvents[user];
    }

    /**
     * @dev Get all events where user contributed
     * @param user Address of the user
     * @return Array of event IDs
     */
    function getUserContributions(address user) external view returns (uint256[] memory) {
        return userContributions[user];
    }

    /**
     * @dev Get all events with complete details (paginated)
     * @param offset Starting index
     * @param limit Number of events to return
     * @return names Array of event names
     * @return descriptions Array of event descriptions
     * @return walletAddresses Array of wallet addresses
     * @return activeUntils Array of active until timestamps
     * @return createdAts Array of creation timestamps
     * @return creators Array of creator addresses
     * @return balances Array of current balances
     * @return isActives Array of active status
     * @return totalContributors Array of contributor counts
     * @return totalCount Total number of events
     */
    function getAllEvents(uint256 offset, uint256 limit) 
        external 
        view 
        returns (
            string[] memory names,
            string[] memory descriptions,
            address[] memory walletAddresses,
            uint256[] memory activeUntils,
            uint256[] memory createdAts,
            address[] memory creators,
            uint256[] memory balances,
            bool[] memory isActives,
            uint256[] memory totalContributors,
            uint256 totalCount
        ) 
    {
        uint256 totalEvents = _eventIdCounter.current();
        require(offset < totalEvents, "Offset out of bounds");

        uint256 endIndex = offset + limit;
        if (endIndex > totalEvents) {
            endIndex = totalEvents;
        }

        uint256 resultCount = endIndex - offset;
        
        names = new string[](resultCount);
        descriptions = new string[](resultCount);
        walletAddresses = new address[](resultCount);
        activeUntils = new uint256[](resultCount);
        createdAts = new uint256[](resultCount);
        creators = new address[](resultCount);
        balances = new uint256[](resultCount);
        isActives = new bool[](resultCount);
        totalContributors = new uint256[](resultCount);

        for (uint256 i = 0; i < resultCount; i++) {
            uint256 eventId = offset + i;
            EventDetails storage eventData = events[eventId];
            bool isStillActive = eventData.isActive && block.timestamp <= eventData.activeUntil;
            
            names[i] = eventData.name;
            descriptions[i] = eventData.description;
            walletAddresses[i] = eventData.walletAddress;
            activeUntils[i] = eventData.activeUntil;
            createdAts[i] = eventData.createdAt;
            creators[i] = eventData.creator;
            balances[i] = eventData.balance;
            isActives[i] = isStillActive;
            totalContributors[i] = eventData.contributors.length;
        }

        return (names, descriptions, walletAddresses, activeUntils, createdAts, creators, balances, isActives, totalContributors, totalEvents);
    }

    /**
     * @dev Check if event has expired and mark it inactive
     * @param eventId ID of the event
     */
    function checkEventExpiry(uint256 eventId) 
        external 
        eventExists(eventId) 
        eventHasExpired(eventId) 
    {
        EventDetails storage eventData = events[eventId];
        if (eventData.isActive) {
            eventData.isActive = false;
            emit EventExpired(eventId, eventData.balance, block.timestamp);
        }
    }

    /**
     * @dev Get event statistics
     * @return totalEvents Total number of events created
     * @return activeEvents Number of active events
     * @return expiredEvents Number of expired events
     */
    function getEventStatistics() external view returns (uint256 totalEvents, uint256 activeEvents, uint256 expiredEvents) {
        totalEvents = _eventIdCounter.current();
        
        for (uint256 i = 0; i < totalEvents; i++) {
            EventDetails storage eventData = events[i];
            if (eventData.isActive && block.timestamp <= eventData.activeUntil) {
                activeEvents++;
            } else {
                expiredEvents++;
            }
        }
    }

    /**
     * @dev Get events that are about to expire (within specified time)
     * @param timeWindow Time window in seconds
     * @return eventIds Array of event IDs expiring soon
     */
    function getExpiringEvents(uint256 timeWindow) external view returns (uint256[] memory eventIds) {
        uint256 totalEvents = _eventIdCounter.current();
        uint256[] memory tempIds = new uint256[](totalEvents);
        uint256 count = 0;

        for (uint256 i = 0; i < totalEvents; i++) {
            EventDetails storage eventData = events[i];
            if (eventData.isActive && 
                eventData.activeUntil > block.timestamp && 
                eventData.activeUntil <= block.timestamp + timeWindow) {
                tempIds[count] = i;
                count++;
            }
        }

        eventIds = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            eventIds[i] = tempIds[i];
        }
    }

    // Emergency functions for contract owner
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function pauseEvent(uint256 eventId) external onlyOwner eventExists(eventId) {
        events[eventId].isActive = false;
    }

    // Fallback function to receive ETH
    receive() external payable {
        // Allow contract to receive ETH
    }
}
