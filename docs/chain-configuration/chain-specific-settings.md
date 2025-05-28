# Chain Specific Settings

> The Titan Kit already manages the necessary configuration for the Titan chain. You can skip this section if you only want to support the Titan chain.

## 1. Configuring Chain and Asset Lists

### Basic Configuration

```typescript
import { assetLists, chains } from '@chain-registry/v2';

// Define supported chain names
const chainNames: string[] = ['titantestnet', 'titan'];

// Filter chains and asset lists based on chain names
const _chains = chains.filter(c => chainNames.includes(c.chainName));
const _assetLists = assetLists.filter(a => chainNames.includes(a.chainName));
```

### Custom Chain Configuration

You can also add custom chains by extending the filtered chains:

```typescript
const _chains = [
  ...chains.filter(c => chainNames.includes(c.chainName)),
  // Add custom chains here
];

const _assetLists = [
  ...assetLists.filter(a => chainNames.includes(a.chainName)),
  // Add custom asset lists here
];
```

## 2. Configuring Signer Options

### Basic Signer Configuration

```typescript
<TitanKitProvider
  chains={_chains}
  wallets={_wallets}
  assetLists={_assetLists}
  signerOptions={{
    // Chain-specific signing configuration
    signing: (chain) => {
      if (chain === 'titantestnet') {
        return {
          signerOptions: {
            // Custom signer options
          }
        };
      }
    },
    // Chain-specific preferred sign type
    preferredSignType: (chain) => {
      if (chain === 'titantestnet') {
        return 'direct';
      }
      return 'amino';
    }
  }}
>
  <YourApp />
</TitanKitProvider>
```

### Advanced Signer Configuration Example

Here's an example of advanced signer configuration for Ethereum-compatible chains:

```typescript
signerOptions={{
  signing: (chain) => {
    if (chain === 'chainName') {
      return {
        signerOptions: {
          // Custom account parsing for Ethereum-compatible accounts
          parseAccount: (encodedAccount: EncodedMessage) => {
            if (encodedAccount.typeUrl === '/ethermint.types.v1.EthAccount') {
              const decoder = toDecoder(EthAccount);
              const account = decoder.fromPartial(
                decoder.decode(encodedAccount.value)
              );
              const baseAccount =
                account.baseVestingAccount?.baseAccount ||
                account.baseAccount ||
                account;
              return baseAccount;
            }
          },
          // Custom public key encoding for Ethereum-compatible accounts
          encodePublicKey: (key: IKey): EncodedMessage => {
            return {
              typeUrl: '/ethermint.crypto.v1.ethsecp256k1.PubKey',
              value: Secp256k1PubKey.encode(
                Secp256k1PubKey.fromPartial({ key: key.value })
              ).finish(),
            };
          },
        },
      };
    }
  },
  preferredSignType: (chain) => {
    if (chain === 'chainName') {
      return 'direct';
    }
    return 'amino';
  }
}}
```

## 3. Best Practices

1. **Chain Selection**
   * Only include chains that your application needs
   * Consider using environment variables for chain configuration
   * Keep chain names consistent across your application
2. **Signer Configuration**
   * Configure chain-specific signing options when needed
   * Use appropriate sign types for each chain
   * Handle edge cases in account parsing
3. **Asset Lists**
   * Keep asset lists in sync with chain configuration
   * Consider caching asset lists for better performance
   * Update asset lists when adding new chains

## 4. Troubleshooting

1. **Chain Connection Issues**
   * Verify chain IDs and names
   * Check RPC endpoints
   * Ensure proper chain configuration
2. **Signing Issues**
   * Verify signer options
   * Check preferred sign types
   * Ensure proper account parsing
3. **Asset List Issues**
   * Verify asset list format
   * Check chain compatibility
   * Ensure proper asset configuration
