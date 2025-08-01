# Friend.Share Smart Contracts

This directory contains the smart contracts for the Friend.Share platform, which enables group payments, event management, and fund coordination.

## Contracts Overview

### 1. Group.sol
Manages group payments with multiple recipients and payment tracking.

### 2. Event.sol  
Manages event payments with time-based activation and fund management.

## Contract Details

### Group Contract

The Group contract allows users to create payment groups with multiple recipients, track individual payments, and manage group completion.

#### Key Features:
- Create groups with multiple recipients
- Individual payment tracking per recipient
- Automatic group completion when all payments are received
- Comprehensive group and recipient details retrieval
- User participation tracking

#### Main Functions:

**createGroup**
```solidity
function createGroup(
    string memory name,
    string memory description,
    address[] memory recipientAddresses,
    uint256[] memory amounts,
    string[] memory descriptions
) external returns (uint256)
```
Creates a new group with specified recipients and amounts.

**payForRecipient**
```solidity
function payForRecipient(uint256 groupId, address recipientAddress) 
    external 
    payable
```
Allows a recipient to pay their share for a specific group.

**getGroupDetails**
```solidity
function getGroupDetails(uint256 groupId) 
    external 
    view 
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
```
Returns complete group information.

**getRecipientDetails**
```solidity
function getRecipientDetails(uint256 groupId, address recipientAddress) 
    external 
    view 
    returns (
        uint256 amount,
        string memory description,
        bool hasPaid,
        uint256 paidAmount,
        uint256 paidAt
    )
```
Returns payment status for a specific recipient.

**getAllGroups**
```solidity
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
```
Returns all groups with complete details including names, descriptions, recipients, amounts, and status.

#### Data Structures:

**Recipient**
```solidity
struct Recipient {
    address walletAddress;
    uint256 amount;
    string description;
    bool hasPaid;
    uint256 paidAmount;
    uint256 paidAt;
}
```

**GroupDetails**
```solidity
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
```

### Event Contract

The Event contract manages time-based events where users can deposit funds to a specified wallet address until the event expires.

#### Key Features:
- Create events with expiration dates
- Accept deposits from multiple contributors
- Automatic fund transfer to event wallet
- Comprehensive payment tracking
- Event expiry management

#### Main Functions:

**createEvent**
```solidity
function createEvent(
    string memory name,
    string memory description,
    address payable walletAddress,
    uint256 activeUntil
) external returns (uint256)
```
Creates a new event with specified wallet address and expiration time.

**depositToEvent**
```solidity
function depositToEvent(uint256 eventId, uint256 amount) 
    external 
    payable
```
Allows users to deposit a specific amount to an active event. The sent value must match the specified amount.

**withdrawFromEvent**
```solidity
function withdrawFromEvent(uint256 eventId, uint256 amount) 
    external
```
Allows event creator to withdraw funds (only creator can withdraw).

**getEventDetails**
```solidity
function getEventDetails(uint256 eventId) 
    external 
    view 
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
```
Returns complete event information.

**getEventPayments**
```solidity
function getEventPayments(uint256 eventId) 
    external 
    view 
    returns (
        address[] memory payers,
        uint256[] memory amounts,
        uint256[] memory timestamps,
        string[] memory descriptions
    )
```
Returns all payment details for an event.

**getAllEvents**
```solidity
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
```
Returns all events with complete details including names, descriptions, wallet addresses, expiry dates, and status.

#### Data Structures:

**Payment**
```solidity
struct Payment {
    address payer;
    uint256 amount;
    uint256 timestamp;
    string description;
}
```

**EventDetails**
```solidity
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
```

## UI Integration

### Group Page Integration

The Group contract integrates with the UI through these key interactions:

1. **Create Group Form** → `createGroup()` function
   - Group name, description, amount
   - Dynamic recipient addresses
   - Individual amounts per recipient

2. **Group Card Display** → `getGroupDetails()` function
   - Group name, description, total recipients
   - Created date, status

3. **Payment Processing** → `payForRecipient()` function
   - Individual recipient payments
   - Payment status tracking

### Event Page Integration

The Event contract integrates with the UI through these key interactions:

1. **Create Event Form** → `createEvent()` function
   - Event name, description
   - Wallet address for fund collection
   - Active until datetime

2. **Event Card Display** → `getEventDetails()` function
   - Event name, description, end date
   - Created date, balance

3. **Deposit/Withdraw** → `depositToEvent()` / `withdrawFromEvent()` functions
   - Fund deposits from contributors
   - Creator withdrawals

## Security Features

### Both Contracts Include:
- **ReentrancyGuard**: Prevents reentrancy attacks
- **Ownable**: Contract owner controls for emergency functions
- **Input Validation**: Comprehensive parameter validation
- **Access Control**: Creator-only functions where appropriate
- **Emergency Functions**: Owner can pause contracts if needed

### Group Contract Specific:
- Payment amount validation
- Recipient existence checks
- Group completion tracking
- Creator-only group deactivation

### Event Contract Specific:
- Time-based activation checks
- Expiration management
- Creator-only withdrawals
- Automatic fund transfers

## Events

### Group Events:
- `GroupCreated`: Emitted when a new group is created
- `RecipientAdded`: Emitted when a recipient is added to a group
- `PaymentReceived`: Emitted when a payment is received
- `GroupCompleted`: Emitted when all payments are complete

### Event Events:
- `EventCreated`: Emitted when a new event is created
- `DepositReceived`: Emitted when a deposit is made
- `WithdrawalMade`: Emitted when funds are withdrawn
- `EventExpired`: Emitted when an event expires

## Usage Examples

### Creating a Group
```javascript
// Frontend call
const groupId = await groupContract.createGroup(
    "Team Lunch",
    "Monthly team lunch payments",
    ["0x123...", "0x456...", "0x789..."],
    [ethers.utils.parseEther("0.1"), ethers.utils.parseEther("0.1"), ethers.utils.parseEther("0.1")],
    ["Payment 1", "Payment 2", "Payment 3"]
);
```

### Paying for a Group
```javascript
// Frontend call
await groupContract.payForRecipient(groupId, recipientAddress, {
    value: ethers.utils.parseEther("0.1")
});
```

### Creating an Event
```javascript
// Frontend call
const eventId = await eventContract.createEvent(
    "Summer Beach Party",
    "Join us for an amazing beach party",
    "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days from now
);
```

### Depositing to an Event
```javascript
// Frontend call
await eventContract.depositToEvent(eventId, ethers.utils.parseEther("0.05"), {
    value: ethers.utils.parseEther("0.05")
});
```

## Deployment

### Prerequisites:
- Node.js 18+
- Hardhat
- OpenZeppelin Contracts

### Installation:
```bash
npm install @openzeppelin/contracts
```

### Compilation:
```bash
npx hardhat compile
```

### Deployment:
```bash
npx hardhat run scripts/deploy.js --network <network>
```

## Testing

Both contracts include comprehensive test coverage for:
- Contract creation and initialization
- Payment processing and validation
- Access control and permissions
- Edge cases and error conditions
- Event emissions
- Gas optimization

## Gas Optimization

The contracts are optimized for gas efficiency through:
- Efficient data structures
- Minimal storage operations
- Optimized loops and iterations
- Strategic use of mappings vs arrays
- Batch operations where possible

## Future Enhancements

Potential improvements for future versions:
- ERC-20 token support
- Multi-signature wallet integration
- Automated payment scheduling
- Advanced access control (roles)
- Integration with DeFi protocols
- Cross-chain functionality
