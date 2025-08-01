// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title Group Payment Contract
 * @dev Manages group payments with multiple recipients and payment tracking
 */
contract Group is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;

    // Structs
    struct Recipient {
        address walletAddress;
        uint256 amount;
        string description;
        bool hasPaid;
        uint256 paidAmount;
        uint256 paidAt;
    }

    struct GroupDetails {
        uint256 groupId;
        string name;
        string description;
        uint256 totalAmount;
        uint256 totalRecipients;
        uint256 paidRecipients;
        uint256 totalPaidAmount;
        uint256 createdAt;
        address creator;
        bool isActive;
        mapping(address => Recipient) recipients;
        address[] recipientAddresses;
    }

    // State variables
    Counters.Counter private _groupIdCounter;
    mapping(uint256 => GroupDetails) public groups;
    mapping(address => uint256[]) public userGroups; // Groups created by user
    mapping(address => uint256[]) public userParticipations; // Groups user is recipient in

    // Events
    event GroupCreated(
        uint256 indexed groupId,
        string name,
        string description,
        uint256 totalAmount,
        address indexed creator,
        uint256 createdAt
    );

    event RecipientAdded(
        uint256 indexed groupId,
        address indexed recipient,
        uint256 amount,
        string description
    );

    event PaymentReceived(
        uint256 indexed groupId,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );

    event GroupCompleted(
        uint256 indexed groupId,
        uint256 totalPaidAmount,
        uint256 timestamp
    );

    // Modifiers
    modifier groupExists(uint256 groupId) {
        require(groups[groupId].creator != address(0), "Group does not exist");
        _;
    }

    modifier onlyGroupCreator(uint256 groupId) {
        require(groups[groupId].creator == msg.sender, "Only group creator can perform this action");
        _;
    }

    modifier groupIsActive(uint256 groupId) {
        require(groups[groupId].isActive, "Group is not active");
        _;
    }

    /**
     * @dev Create a new group with recipients
     * @param name Group name
     * @param description Group description
     * @param recipientAddresses Array of recipient addresses
     * @param amounts Array of amounts for each recipient
     * @param descriptions Array of descriptions for each recipient
     */
    function createGroup(
        string memory name,
        string memory description,
        address[] memory recipientAddresses,
        uint256[] memory amounts,
        string[] memory descriptions
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Group name cannot be empty");
        require(bytes(description).length > 0, "Group description cannot be empty");
        require(recipientAddresses.length > 0, "Must have at least one recipient");
        require(recipientAddresses.length == amounts.length, "Recipient addresses and amounts arrays must match");
        require(recipientAddresses.length == descriptions.length, "Recipient addresses and descriptions arrays must match");

        uint256 groupId = _groupIdCounter.current();
        _groupIdCounter.increment();

        GroupDetails storage newGroup = groups[groupId];
        newGroup.groupId = groupId;
        newGroup.name = name;
        newGroup.description = description;
        newGroup.creator = msg.sender;
        newGroup.createdAt = block.timestamp;
        newGroup.isActive = true;

        uint256 totalAmount = 0;

        for (uint256 i = 0; i < recipientAddresses.length; i++) {
            require(recipientAddresses[i] != address(0), "Invalid recipient address");
            require(amounts[i] > 0, "Amount must be greater than 0");

            Recipient storage recipient = newGroup.recipients[recipientAddresses[i]];
            recipient.walletAddress = recipientAddresses[i];
            recipient.amount = amounts[i];
            recipient.description = descriptions[i];
            recipient.hasPaid = false;
            recipient.paidAmount = 0;
            recipient.paidAt = 0;

            newGroup.recipientAddresses.push(recipientAddresses[i]);
            totalAmount += amounts[i];

            // Track user participations
            userParticipations[recipientAddresses[i]].push(groupId);

            emit RecipientAdded(groupId, recipientAddresses[i], amounts[i], descriptions[i]);
        }

        newGroup.totalAmount = totalAmount;
        newGroup.totalRecipients = recipientAddresses.length;
        newGroup.paidRecipients = 0;
        newGroup.totalPaidAmount = 0;

        // Track user groups
        userGroups[msg.sender].push(groupId);

        emit GroupCreated(groupId, name, description, totalAmount, msg.sender, block.timestamp);

        return groupId;
    }

    /**
     * @dev Pay amount for a specific recipient in a group
     * @param groupId ID of the group
     * @param recipientAddress Address of the recipient to pay for
     */
    function payForRecipient(uint256 groupId, address recipientAddress) 
        external 
        payable 
        nonReentrant 
        groupExists(groupId) 
        groupIsActive(groupId) 
    {
        GroupDetails storage group = groups[groupId];
        Recipient storage recipient = group.recipients[recipientAddress];

        require(recipient.walletAddress != address(0), "Recipient not found in group");
        require(!recipient.hasPaid, "Recipient has already paid");
        require(msg.value == recipient.amount, "Incorrect payment amount");

        recipient.hasPaid = true;
        recipient.paidAmount = msg.value;
        recipient.paidAt = block.timestamp;

        group.paidRecipients++;
        group.totalPaidAmount += msg.value;

        // Transfer funds to group creator
        payable(group.creator).transfer(msg.value);

        emit PaymentReceived(groupId, recipientAddress, msg.value, block.timestamp);

        // Check if group is completed
        if (group.paidRecipients == group.totalRecipients) {
            group.isActive = false;
            emit GroupCompleted(groupId, group.totalPaidAmount, block.timestamp);
        }
    }

    /**
     * @dev Get complete group details
     * @param groupId ID of the group
     * @return name Group name
     * @return description Group description
     * @return totalAmount Total amount for the group
     * @return totalRecipients Number of recipients
     * @return paidRecipients Number of recipients who have paid
     * @return totalPaidAmount Total amount paid
     * @return createdAt Creation timestamp
     * @return creator Group creator address
     * @return isActive Whether group is active
     * @return recipientAddresses Array of recipient addresses
     */
    function getGroupDetails(uint256 groupId) 
        external 
        view 
        groupExists(groupId) 
        returns (
            string memory name,
            string memory description,
            uint256 totalAmount,
            uint256 totalRecipients,
            uint256 paidRecipients,
            uint256 totalPaidAmount,
            uint256 createdAt,
            address creator,
            bool isActive,
            address[] memory recipientAddresses
        ) 
    {
        GroupDetails storage group = groups[groupId];
        return (
            group.name,
            group.description,
            group.totalAmount,
            group.totalRecipients,
            group.paidRecipients,
            group.totalPaidAmount,
            group.createdAt,
            group.creator,
            group.isActive,
            group.recipientAddresses
        );
    }

    /**
     * @dev Get recipient details for a specific group
     * @param groupId ID of the group
     * @param recipientAddress Address of the recipient
     * @return amount Amount to be paid
     * @return description Description for the payment
     * @return hasPaid Whether recipient has paid
     * @return paidAmount Amount paid
     * @return paidAt Timestamp when paid
     */
    function getRecipientDetails(uint256 groupId, address recipientAddress) 
        external 
        view 
        groupExists(groupId) 
        returns (
            uint256 amount,
            string memory description,
            bool hasPaid,
            uint256 paidAmount,
            uint256 paidAt
        ) 
    {
        Recipient storage recipient = groups[groupId].recipients[recipientAddress];
        require(recipient.walletAddress != address(0), "Recipient not found in group");
        
        return (
            recipient.amount,
            recipient.description,
            recipient.hasPaid,
            recipient.paidAmount,
            recipient.paidAt
        );
    }

    /**
     * @dev Get all groups created by a user
     * @param user Address of the user
     * @return Array of group IDs
     */
    function getUserGroups(address user) external view returns (uint256[] memory) {
        return userGroups[user];
    }

    /**
     * @dev Get all groups where user is a recipient
     * @param user Address of the user
     * @return Array of group IDs
     */
    function getUserParticipations(address user) external view returns (uint256[] memory) {
        return userParticipations[user];
    }

    /**
     * @dev Get all groups with complete details (paginated)
     * @param offset Starting index
     * @param limit Number of groups to return
     * @return names Array of group names
     * @return descriptions Array of group descriptions
     * @return totalAmounts Array of total amounts
     * @return totalRecipients Array of total recipients count
     * @return paidRecipients Array of paid recipients count
     * @return totalPaidAmounts Array of total paid amounts
     * @return createdAts Array of creation timestamps
     * @return creators Array of creator addresses
     * @return isActives Array of active status
     * @return totalCount Total number of groups
     */
    function getAllGroups(uint256 offset, uint256 limit) 
        external 
        view 
        returns (
            string[] memory names,
            string[] memory descriptions,
            uint256[] memory totalAmounts,
            uint256[] memory totalRecipients,
            uint256[] memory paidRecipients,
            uint256[] memory totalPaidAmounts,
            uint256[] memory createdAts,
            address[] memory creators,
            bool[] memory isActives,
            uint256 totalCount
        ) 
    {
        uint256 totalGroups = _groupIdCounter.current();
        require(offset < totalGroups, "Offset out of bounds");

        uint256 endIndex = offset + limit;
        if (endIndex > totalGroups) {
            endIndex = totalGroups;
        }

        uint256 resultCount = endIndex - offset;
        
        names = new string[](resultCount);
        descriptions = new string[](resultCount);
        totalAmounts = new uint256[](resultCount);
        totalRecipients = new uint256[](resultCount);
        paidRecipients = new uint256[](resultCount);
        totalPaidAmounts = new uint256[](resultCount);
        createdAts = new uint256[](resultCount);
        creators = new address[](resultCount);
        isActives = new bool[](resultCount);

        for (uint256 i = 0; i < resultCount; i++) {
            uint256 groupId = offset + i;
            GroupDetails storage group = groups[groupId];
            
            names[i] = group.name;
            descriptions[i] = group.description;
            totalAmounts[i] = group.totalAmount;
            totalRecipients[i] = group.totalRecipients;
            paidRecipients[i] = group.paidRecipients;
            totalPaidAmounts[i] = group.totalPaidAmount;
            createdAts[i] = group.createdAt;
            creators[i] = group.creator;
            isActives[i] = group.isActive;
        }

        return (names, descriptions, totalAmounts, totalRecipients, paidRecipients, totalPaidAmounts, createdAts, creators, isActives, totalGroups);
    }

    /**
     * @dev Deactivate a group (only creator can do this)
     * @param groupId ID of the group
     */
    function deactivateGroup(uint256 groupId) 
        external 
        onlyGroupCreator(groupId) 
        groupIsActive(groupId) 
    {
        groups[groupId].isActive = false;
    }

    /**
     * @dev Get group statistics
     * @return totalGroups Total number of groups created
     * @return activeGroups Number of active groups
     * @return completedGroups Number of completed groups
     */
    function getGroupStatistics() external view returns (uint256 totalGroups, uint256 activeGroups, uint256 completedGroups) {
        totalGroups = _groupIdCounter.current();
        
        for (uint256 i = 0; i < totalGroups; i++) {
            if (groups[i].isActive) {
                activeGroups++;
            } else {
                completedGroups++;
            }
        }
    }

    // Emergency functions for contract owner
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function pauseGroup(uint256 groupId) external onlyOwner groupExists(groupId) {
        groups[groupId].isActive = false;
    }
}




