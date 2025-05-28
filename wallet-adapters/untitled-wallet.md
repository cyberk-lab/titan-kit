# Untitled Wallet

Untitled Wallet adapter for Titan Kit, providing seamless integration with Untitled Wallet for Titan Chain applications. Untitled Wallet is the official wallet for Titan Chain, offering native support and optimized features for the Titan ecosystem.

## Installation

```bash
npm install @titan-kit/untitled-wallet
# or
yarn add @titan-kit/untitled-wallet
```

## Basic Usage

### 1. Simple Integration

```typescript
import { untitledWallet } from '@titan-kit/untitled-wallet';
import { TitanKitProvider } from '@titan-kit/react';

// Use in TitanKitProvider
function App() {
  return (
    <TitanKitProvider
      chains={chains}
      wallets={[untitledWallet]}
      assetLists={assetLists}
    >
      <YourApp />
    </TitanKitProvider>
  );
}
```

### 2. Advanced Configuration

```typescript
import { UntitledWallet } from '@titan-kit/untitled-wallet';
import { keplrWallet } from '@titan-kit/keplr-extension';
import { assetLists, chains } from '@chain-registry/v2';

// Configure supported chains
const chainNames = ['titantestnet'];
const _chains = chains.filter(c => chainNames.includes(c.chainName));
const _assetLists = assetLists.filter(a => chainNames.includes(a.chainName));

// Create Untitled Wallet with custom configuration
const untitledWallet = new UntitledWallet({
  metadata: {
    name: 'Hyperion',
    description: 'The main swap on titan',
    icons: [],
    url: 'https://hyperiondex.com',
  },
  // Add any additional configuration options here
});

// Use with other wallets
const _wallets = [
  keplrWallet,
  untitledWallet,
  // Add other wallets as needed
];

// Use in TitanKitProvider
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

## Features

* Seamless integration with Titan Kit
* Support for Titan Chain
* Customizable metadata
* Compatible with other wallet adapters

## API Reference

### UntitledWallet Constructor

```typescript
new UntitledWallet({
  metadata: {
    name: string;        // Your dApp name
    description: string; // Your dApp description
    icons: string[];    // Array of your dApp icon URLs
    url: string;        // Your dApp URL
  }
})
```

### Methods

The UntitledWallet adapter implements the BaseWallet interface, providing the following methods:

* `connect(chainId: string | string[])`: Connect to specified chain(s)
* `disconnect(chainId: string | string[])`: Disconnect from specified chain(s)
* `getAccount(chainId: string)`: Get account information
* `getAccounts(chainIds: string[])`: Get accounts for multiple chains
* `getOfflineSignerAmino(chainId: string)`: Get Amino signer
* `getOfflineSignerDirect(chainId: string)`: Get Direct signer
* `signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions)`: Sign Amino messages
* `signDirect(chainId: string, signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions)`: Sign Direct messages

## Best Practices

1. Always provide meaningful metadata for better user experience
2. Use with other wallet adapters for maximum compatibility
3. Handle connection errors appropriately
4. Implement proper error handling for wallet operations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See LICENSE file for details.
