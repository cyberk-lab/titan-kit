# Creating a New Wallet Adapter for Titan Kit

This guide explains how to create and integrate a new wallet adapter into Titan Kit. We'll focus on the core implementation details.

## Understanding the Wallet Architecture

Titan Kit's wallet system is built on a flexible architecture with the following key components:

1. **BaseWallet**: The abstract base class that all wallet types extend from
2. **ExtensionWallet**: For browser extension wallets
3. **CosmosWallet**: Specifically for Cosmos-based wallets
4. **EthereumWallet**: For Ethereum-compatible wallets
5. **WCWallet**: For WalletConnect integration

## Creating a New Extension Wallet

Let's walk through the process of creating a new wallet adapter for a browser extension.

### 1. Define Wallet Constants

Create a `constant.ts` file to store wallet-specific information:

```typescript
// constant.ts
export const ICON =
  "data:image/svg+xml;base64,YOUR_BASE64_ENCODED_SVG_LOGO";

// Add any other constants specific to your wallet here
```

### 2. Create Wallet Registry

Create a `registry.ts` file to define the wallet information:

```typescript
// registry.ts
import { Wallet } from '@titan-kit/core';
import { ICON } from './constant';

export const myNewWalletInfo: Wallet = {
  windowKey: 'myNewWallet', // The global window object key for the wallet
  ethereumKey: 'myNewWallet.ethereum', // For Ethereum integration (if supported)
  walletIdentifyKey: 'myNewWallet.ethereum.isMyNewWallet', // For identifying the wallet
  name: 'my-new-wallet',
  prettyName: 'My New Wallet',
  mode: 'extension',
  logo: ICON,
  keystoreChange: 'myNewWallet_keystorechange', // Event name for keystore changes
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link: 'https://chrome.google.com/webstore/detail/my-new-wallet/extension-id',
    },
    {
      link: 'https://my-new-wallet.com/download',
    },
  ],
  // For WalletConnect support (if applicable)
  walletconnect: {
    name: 'My New Wallet',
    projectId: 'your-wallet-connect-project-id'
  },
  walletConnectLink: {
    android: `mywalletapp://wcV2?{wc-uri}`,
    ios: `mywalletapp://wcV2?{wc-uri}`
  }
};
```

### 3. Create Custom Wallet Implementation (Optional)

If your wallet requires custom methods beyond the base functionality, create a custom wallet class:

```typescript
// custom-wallet.ts
import { CosmosWallet } from '@titan-kit/core';
import { Wallet } from '@titan-kit/core';

export class MyCustomWallet extends CosmosWallet {
  constructor(info: Wallet) {
    super(info);
  }

  // Override methods as needed
  async connect(chainId: string): Promise<void> {
    try {
      await this.client.enable(chainId);
    } catch (error) {
      // Custom error handling
      if ((error as any).message !== 'Request rejected') {
        await this.addSuggestChain(chainId);
      } else {
        throw error;
      }
    }
  }

  // Add custom methods
  async myCustomMethod(): Promise<void> {
    // Implementation
  }
}
```

### 4. Create Main Entry Point

Create an `index.ts` file to export your wallet instance:

```typescript
// index.ts
import { CosmosWallet, EthereumWallet, ExtensionWallet, selectWalletByPlatform, WCMobileWebWallet } from "@titan-kit/core";
import { myNewWalletInfo } from "./registry";
import { MyCustomWallet } from "./custom-wallet"; // If using custom implementation

export * from './registry';

const web = new ExtensionWallet(myNewWalletInfo);
web.setNetworkWallet('cosmos', new MyCustomWallet(myNewWalletInfo)); // Or new CosmosWallet(myNewWalletInfo)
// If your wallet supports Ethereum networks
web.setNetworkWallet('eip155', new EthereumWallet(myNewWalletInfo));

const myNewWallet = selectWalletByPlatform({
  'mobile-web': new WCMobileWebWallet(myNewWalletInfo),
  'web': web
});

export { myNewWallet };
```

## Mobile Wallet Support

For mobile wallets using WalletConnect, update your wallet registry:

```typescript
// registry.ts
export const myNewMobileWalletInfo: Wallet = {
  name: 'my-new-mobile',
  prettyName: 'My New Mobile Wallet',
  mode: 'mobile',
  logo: ICON,
  downloads: [
    {
      device: 'mobile',
      os: 'android',
      link: 'https://play.google.com/store/apps/details?id=com.mynewwallet',
    },
    {
      device: 'mobile',
      os: 'ios',
      link: 'https://apps.apple.com/app/my-new-wallet/id123456789',
    }
  ],
  walletconnect: {
    name: 'My New Mobile Wallet',
    projectId: 'your-wallet-connect-project-id'
  },
  walletConnectLink: {
    android: `mynewwallet://wcV2?{wc-uri}`,
    ios: `mynewwallet://wcV2?{wc-uri}`
  }
};
```

## Hardware Wallet Support

For hardware wallets, create a custom implementation:

```typescript
// hardware-wallet.ts
import { BaseWallet, LedgerWalletOptions } from '@titan-kit/core';

export class MyHardwareWallet extends BaseWallet {
  options: LedgerWalletOptions;
  
  constructor(info: Wallet, options: LedgerWalletOptions) {
    super(info);
    this.options = options;
  }
  
  async connectDevice(): Promise<void> {
    // Logic to connect to the hardware device
  }
  
  async getAccount(chainId: string): Promise<WalletAccount> {
    // Hardware wallet-specific account retrieval
  }
  
  async getOfflineSigner(chainId: string, preferredSignType?: SignType): Promise<IGenericOfflineSigner> {
    // Hardware wallet-specific signer implementation
  }
}
```

## Using Your New Wallet

After creating your wallet adapter, you can use it in your application:

```typescript
import { TitanKitProvider } from '@titan-kit/react';
import { myNewWallet } from './my-new-wallet';

function App() {
  return (
    <TitanKitProvider
      chains={chains}
      assetLists={assetLists}
      wallets={[myNewWallet]} // Add your new wallet to the supported wallets
    >
      {/* Your app components */}
    </TitanKitProvider>
  );
}
```

## Best Practices

1. **Error Handling**
   * Implement proper error handling for connection failures
   * Provide clear error messages for users
   * Handle network-specific errors appropriately
2. **Security**
   * Follow security best practices
   * Implement proper encryption for sensitive data
   * Validate all user inputs
3. **Compatibility**
   * Test with multiple chains
   * Ensure compatibility with different network types
   * Support both mainnet and testnet environments
4. **User Experience**
   * Provide clear feedback during operations
   * Handle edge cases gracefully
   * Implement proper loading states
5. **Testing**
   * Test all wallet operations thoroughly
   * Test with different network conditions
   * Test error scenarios and recovery
