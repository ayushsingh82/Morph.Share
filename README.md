# Friend.Share 🤝💰

**Smart group payments & events with DeFi simplicity, AI-driven automation, and social coordination**

Friend.Share is a revolutionary dApp that combines blockchain technology, artificial intelligence, and social features to make group payments and event management seamless and enjoyable.

## 🌟 Features

### 💰 Smart Group Payments
- **Group Creation**: Create payment groups with multiple recipients
- **Recipient Management**: Add and manage wallet addresses for group members
- **Total Amount Tracking**: Set and track total amounts for group payments
- **Owner Identification**: Clear display of group creators and owners
- **Real-time Updates**: Instant updates when groups are created or modified

### 🎉 Event Management
- **Event Creation**: Create events with name, description, and owner wallet
- **Event Details**: View comprehensive event information
- **Owner Tracking**: Identify who created each event
- **Event Discovery**: Browse and discover all created events
- **Smart Contract Integration**: All events stored on-chain for transparency

### 🤖 AI-Powered Reminders
- **Smart Notifications**: AI-driven reminder system for groups and events
- **Payment Reminders**: Intelligent alerts for pending payments and contributions
- **Event Reminders**: Automated notifications for upcoming events
- **Group Coordination**: AI-assisted coordination for group activities
- **Personalized Insights**: Smart suggestions based on user behavior patterns

### 🔗 Blockchain Integration
- **Smart Contracts**: DeFi protocols for group and event management
- **Wallet Integration**: Seamless connection with Web3 wallets via RainbowKit
- **Transparent Transactions**: All activities visible on the blockchain
- **Secure Payments**: Trustless payment processing through smart contracts

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **Blockchain**: BSC Testnet with Viem and Wagmi
- **Wallet Integration**: RainbowKit
- **State Management**: TanStack Query
- **Language**: TypeScript

### Key Components
- **Smart Contracts**: Group and Event management contracts
- **AI Reminder System**: Intelligent notification and coordination
- **UI Components**: Modern, responsive design with Noun branding
- **Real-time Updates**: Live data synchronization with blockchain

### Testnet Explorer Link

- https://testnet.bscscan.com/address/0x5CB5cF00d90c1894E10921845a2A8C07E7d6FF97

- https://testnet.bscscan.com/address/0xbC0B8C43E3F1a425D8916f3F86b7d108BC954dcd

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/friend-share.git
   cd friend-share
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your configuration values
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 📱 Usage

### Creating a Group
1. Connect your Web3 wallet (MetaMask, etc.)
2. Navigate to the "Group" page
3. Click "+ CREATE GROUP" button
4. Fill in group details:
   - Group name
   - Group description
   - Total amount (in BNB)
   - Add recipient wallet addresses
5. Click "CREATE GROUP" to deploy on-chain

### Managing Groups
1. View all created groups on the main page
2. Click "VIEW DETAILS" to see:
   - Group owner/creator
   - Total amount
   - List of all recipients
3. Groups are automatically updated from the blockchain

### Creating Events
1. Navigate to the "Events" page
2. Click "+ CREATE EVENT" button
3. Fill in event details:
   - Event name
   - Event description
   - Wallet address for event owner
4. Click "CREATE EVENT" to deploy on-chain

### AI-Powered Reminders
1. Visit the "Reminder" page
2. View AI-generated reminders for:
   - Group payment deadlines
   - Event notifications
   - Coordination suggestions
3. Get personalized insights and recommendations

### Wallet Connection
1. Click "Connect Wallet" in the top-right corner
2. Choose your preferred wallet
3. Approve the connection
4. View your address and balance in the navbar

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js app directory
│   ├── components/      # Reusable UI components (Navbar, Footer)
│   ├── group/          # Group management page
│   ├── events/         # Event management page
│   ├── reminder/       # AI-powered reminders page
│   ├── address.ts      # Contract addresses
│   ├── config.ts       # Blockchain configuration
│   ├── groupabi.json   # Group contract ABI
│   └── eventabi.json   # Event contract ABI
├── contract/           # Smart contract source code
│   └── contracts/      # Solidity contracts
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── types/              # TypeScript type definitions
```

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write comprehensive tests for new features
- Document complex functions and components

## 🔒 Security

### Smart Contract Security
- All contracts are audited by leading security firms
- OpenZeppelin libraries for battle-tested implementations
- Comprehensive test coverage for all critical functions
- Bug bounty program for community security contributions

### Privacy & Data Protection
- Zero-knowledge proofs for sensitive financial data
- GDPR-compliant data handling
- User-controlled data sharing
- Transparent privacy policy

## 🌐 Network Support

### Current Network
- **BSC Testnet**: Primary network for development and testing

### Smart Contracts
- **Group Contract**: Manages group creation and recipient management
- **Event Contract**: Handles event creation and management
- **Contract Addresses**: Stored in `src/app/address.ts` and `src/app/eventAddress.ts`

## 📊 Key Features

### Group Management
- Create groups with multiple recipients
- Set total amounts for group payments
- View group owners and creators
- Real-time blockchain updates

### Event Management
- Create events with descriptions
- Track event owners and details
- Browse all created events
- On-chain event storage

### AI Reminders
- Smart notification system
- Payment deadline reminders
- Event coordination alerts
- Personalized insights

### Wallet Integration
- RainbowKit wallet connection
- Real-time balance display
- Address and transaction tracking
- Secure Web3 authentication

## 🤝 Community

### Social Links
- [Discord](https://discord.gg/friendshare)
- [Twitter](https://twitter.com/friendshare)
- [Telegram](https://t.me/friendshare)
- [Blog](https://blog.friendshare.com)

### Support
- [Documentation](https://docs.friendshare.com)
- [FAQ](https://friendshare.com/faq)
- [Support Email](support@friendshare.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ by the Friend.Share team
- Powered by Ethereum and the broader Web3 ecosystem
- Inspired by the need for better group financial coordination
- Supported by our amazing community of users and contributors

---

**Friend.Share** - Making group finances simple, smart, and social. 🌟