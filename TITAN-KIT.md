# Titan Kit

Titan Kit is an official Web3 wallet connection solution developed by Cyberk for Titan Chain. It provides a simple and user-friendly way to integrate Web3 wallet functionality into your applications.

## Overview

Titan Kit is designed to make Web3 wallet integration seamless and straightforward. It consists of two main packages:

### 1. @titan-kit/core

The core package provides essential functionality for wallet connections and interactions. It includes:

- Wallet adapters for Untitled Wallet and other popular wallets
- Core wallet connection logic
- Chain registry integration
- Support for various wallet protocols (WalletConnect, Ledger, etc.)
- Extensible architecture for custom wallet implementations

### 2. @titan-kit/react

The React package provides ready-to-use components and hooks for React applications. It includes:

- Pre-built React components for wallet connection UI
- Custom hooks for wallet state management
- Integration with @interchain-ui/react for consistent UI
- TypeScript support for better development experience

## Key Features

- **Easy Integration**: Simple setup process for both core and React applications
- **Multiple Wallet Support**: Built-in support for Untitled Wallet and other popular wallets
- **Extensible**: Easy to add support for new wallets through the adapter system
- **TypeScript Support**: Full TypeScript support for better development experience
- **React Components**: Ready-to-use React components and hooks
- **Chain Registry**: Integration with chain registry for better chain management
- **WalletConnect Support**: Built-in support for WalletConnect protocol
- **Ledger Support**: Hardware wallet support through Ledger integration

## Installation

```bash
# Install core package
npm install @titan-kit/core

# Install React package
npm install @titan-kit/react
```

## Usage

### Basic Usage with React

```tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TitanKitProvider, InterchainWalletModal } from '@titan-kit/react';
import { assetLists, chains } from '@chain-registry/v2';
import { BaseWallet } from '@titan-kit/core';
import { keplrWallet } from '@titan-kit/keplr-extension';
import { UntitledWallet } from '@titan-kit/untitled-wallet';

// Configure supported chains
const chainNames = ['titantestnet'];
const _chains = chains.filter(c => chainNames.includes(c.chainName));
const _assetLists = assetLists.filter(a => chainNames.includes(a.chainName));

// Configure wallets
const untitledWallet = new UntitledWallet({
  metadata: {
    name: 'Hyperion',
    description: 'The main swap on titan',
    icons: [],
    url: 'https://hyperion.com',
  },
});

const _wallets: BaseWallet[] = [
  keplrWallet,
  untitledWallet,
];

function App() {
  return (
    <TitanKitProvider
      chains={_chains}
      wallets={_wallets}
      assetLists={_assetLists}
      walletModal={InterchainWalletModal}
    >
      <BrowserRouter>
        <YourApp />
      </BrowserRouter>
    </TitanKitProvider>
  );
}
```

### Using Core Package

```typescript
import { WalletManager } from '@titan-kit/core';
import { keplrWallet } from '@titan-kit/keplr-extension';
import { UntitledWallet } from '@titan-kit/untitled-wallet';

// Initialize wallets
const untitledWallet = new UntitledWallet({
  metadata: {
    name: 'Your App',
    description: 'Your app description',
    icons: [],
    url: 'https://your-app.com',
  },
});

// Create wallet manager instance
const walletManager = new WalletManager({
  wallets: [keplrWallet, untitledWallet],
  chains: ['titantestnet']
});

// Use wallet functionality
await walletManager.connect('titantestnet');
```

## Contributing

Titan Kit is open for contributions. Please feel free to submit issues and pull requests.

## License

See LICENSE file for details.

## Support

For support, please open an issue in the respective package repository:
- [@titan-kit/core](https://github.com/titan-kit/core/issues)
- [@titan-kit/react](https://github.com/titan-kit/react/issues) 