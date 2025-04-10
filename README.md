# P2PSwap - Decentralized Peer-to-Peer Token Swap Platform

P2PSwap is a decentralized application (dApp) that enables secure peer-to-peer token swaps using atomic swap. The platform allows users to trade ERC20 tokens directly with each other without requiring a centralized intermediary.

## Project Structure

The project consists of two main components:

- **Blockchain**: Smart contracts powering the atomic swap functionality
- **Frontend**: Next.js web application providing the user interface

## Features

- Peer-to-peer atomic swaps of ERC20 tokens
- Secure, trustless trading without intermediaries
- Time-locked transactions with refunds
- User-friendly web interface

## Smart Contracts

The core functionality is implemented in Solidity smart contracts:

- `AtomicSwapERC20`: Handles the atomic swap logic with locking, unlocking, and retrieving tokens
- `ERC20`: Standard ERC20 token interface

The atomic swap process consists of:
1. Buyer locks tokens to purchase from a sell order
2. Seller responds by locking their tokens
3. Tokens are swapped when unlocked with the correct secret
4. refund if the transaction times out

## Getting Started

### Prerequisites

- Node.js (v18+)
- MetaMask or similar Ethereum wallet

### Frontend Development

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at http://localhost:3000.

### Smart Contract Interaction

The frontend automatically connects to the deployed smart contracts. To interact directly with the contracts:

1. Connect your MetaMask wallet
2. Switch to the appropriate network
3. Use the web interface to create and respond to swap offers

## Technology Stack

- **Blockchain**: Solidity, EVM
- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Ethereum Interaction**: ethers.js

## Security

The atomic swap mechanism ensures that either the entire transaction completes successfully, or all funds are returned to their original owners.


