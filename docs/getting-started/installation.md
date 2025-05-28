# Installation

This guide will walk you through the process of installing and setting up Titan Kit for your project.

## Prerequisites

Before you begin, ensure you have the following:

* Node.js (v16 or higher)
* npm (v7 or higher) or Yarn
* A modern web development environment

### React

For React applications, you'll need to install the React-specific package:

```bash
# Using npm
npm install @titan-kit/react @titan-kit/core

# Using Yarn
yarn add @titan-kit/react @titan-kit/core
```

## Installing Wallet Adapters

Interchain Kit supports various wallets. Install the adapters for the wallets you want to support:

```bash
# Install common wallet adapters
npm install @titan-kit/untitled-wallet
```

## Additional Dependencies

You'll also need to install Chain Registry for chain information:

```bash
npm install @chain-registry/v2
```

## Basic Configuration

### React Configuration

```tsx
import React from 'react';
import { TitanKitProvider } from '@titan-kit/react';
import { assetLists, chains } from '@chain-registry/v2';
import { BaseWallet } from '@titan-kit/core';
import { keplrWallet } from '@titan-kit/keplr-extension';
import { untitledWallet } from '@titan-kit/untitled-wallet';

// Configure supported chains
const chainNames = ['titantestnet'];
const _chains = chains.filter(c => chainNames.includes(c.chainName));
const _assetLists = assetLists.filter(a => chainNames.includes(a.chainName))

const _wallets: BaseWallet[] = [
  untitledWallet,
  keplrWallet,
];

function App() {
  return (
    <TitanKitProvider
      chains={_chains}
      wallets={_wallets}
      assetLists={_assetLists}
    >
      <YourApp />
    </TitanKitProvider>
  );
}
```

## Next Steps

After installation, you can:

1. Set up wallet adapters to enable connections with the preferred wallets
2. Configure chain-specific settings
3. Set up wallet connection UI components
4. Implement transaction signing functionality

For more detailed guidance, check out:

* [Example Applications](https://github.com/cyberk-lab/titan-kit/tree/main/examples/react)
