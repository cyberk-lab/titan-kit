# Keplr Extension

Keplr extension adapter for Titan Kit, providing seamless integration with Keplr wallet for Titan Chain applications. Keplr is one of the most popular wallets in the Cosmos ecosystem, offering a secure and user-friendly experience.

## Installation

```bash
npm install @titan-kit/keplr-extension
# or
yarn add @titan-kit/keplr-extension
```

## Basic Usage

```typescript
import { keplrWallet } from '@titan-kit/keplr-extension';
import { TitanKitProvider } from '@titan-kit/react';
import { assetLists, chains } from '@chain-registry/v2';

// Configure supported chains
const chainNames = ['titantestnet'];
const _chains = chains.filter(c => chainNames.includes(c.chainName));
const _assetLists = assetLists.filter(a => chainNames.includes(a.chainName));

// Use in TitanKitProvider
function App() {
  return (
    <TitanKitProvider
      chains={_chains}
      wallets={[keplrWallet]}
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
* Native Keplr extension support
* Compatible with other wallet adapters

## Methods

The Keplr extension adapter implements the BaseWallet interface, providing the following methods:

* `connect(chainId: string | string[])`: Connect to specified chain(s)
* `disconnect(chainId: string | string[])`: Disconnect from specified chain(s)
* `getAccount(chainId: string)`: Get account information
* `getAccounts(chainIds: string[])`: Get accounts for multiple chains
* `getOfflineSignerAmino(chainId: string)`: Get Amino signer
* `getOfflineSignerDirect(chainId: string)`: Get Direct signer
* `signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions)`: Sign Amino messages
* `signDirect(chainId: string, signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions)`: Sign Direct messages

## Best Practices

1. Ensure Keplr extension is installed in the user's browser
2. Handle connection errors appropriately
3. Implement proper error handling for wallet operations
4. Use with other wallet adapters for maximum compatibility

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See LICENSE file for details.
