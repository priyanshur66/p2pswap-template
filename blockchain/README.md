## Smart Contracts

The core functionality is implemented in Solidity smart contracts:

- `AtomicSwapERC20`: Handles the atomic swap logic with locking, unlocking, and retrieving tokens
- `ERC20`: Standard ERC20 token interface

The atomic swap process consists of:
1. Buyer locks tokens to purchase from a sell order
2. Seller responds by locking their tokens
3. Tokens are swapped when unlocked with the correct secret
4. refund if the transaction times out