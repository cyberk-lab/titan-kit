# Ethereum-compatible accounts

## 1. Configuration

```typescript
import { TitanKitProvider } from '@titan-kit/react';
import { assetLists, chains } from '@chain-registry/v2';
import { IKey } from '@titanlabjs/types';
import { EncodedMessage } from '@titanlabjs/cosmos/types/index';
import { toDecoder } from '@titanlabjs/cosmos/utils';
import { PubKey as Secp256k1PubKey } from '@titanlabjs/cosmos-types/cosmos/crypto/secp256k1/keys';
import { EthAccount } from '@titanlabjs/cosmos-types/ethermint/types/v1/account';

// Get chains from registry
const chainNames = ['chainName'];
const _chains = chains.filter(c => chainNames.includes(c.chainName));
const _assetLists = assetLists.filter(a => chainNames.includes(a.chainName));

// Configure signer options
const signerOptions = {
  signing: (chain) => {
    // Apply same configuration for all Ethereum-compatible chains
    if (chainNames.includes(chain)) {
      return {
        signerOptions: {
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
    // Use direct signing
    if (chainNames.includes(chain)) {
      return 'direct';
    }
    return 'amino';
  }
};

// Use in TitanKitProvider
function App() {
  return (
    <TitanKitProvider
      chains={_chains}
      wallets={[keplrWallet, untitledWallet]}
      assetLists={_assetLists}
      signerOptions={signerOptions}
    >
      <YourApp />
    </TitanKitProvider>
  );
}
```

## 2. Signer Options Explanation

### Account Parsing

```typescript
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
}
```

* Handles Ethereum-compatible accounts
* Decodes account data using Ethermint types
* Returns base account information for signing

### Public Key Encoding

```typescript
encodePublicKey: (key: IKey): EncodedMessage => {
  return {
    typeUrl: '/ethermint.crypto.v1.ethsecp256k1.PubKey',
    value: Secp256k1PubKey.encode(
      Secp256k1PubKey.fromPartial({ key: key.value })
    ).finish(),
  };
}
```

* Encodes public keys in Ethermint format
* Uses secp256k1 key type
* Required for Ethereum-compatible signing

### Preferred Sign Type

```typescript
preferredSignType: (chain) => {
  if (chainNames.includes(chain)) {
    return 'direct';
  }
  return 'amino';
}
```

* Uses 'direct' signing for protobuf sign doc
* Falls back to 'amino' for other chains
* Optimized for Ethereum-compatible transactions

## 3. Best Practices

1. **Account Parsing**
   * Always check for Ethermint account type
   * Handle all possible account structures
   * Return base account for consistent signing
2. **Public Key Encoding**
   * Use correct type URL for Ethermint
   * Ensure proper key encoding
   * Handle key value correctly
3. **Sign Type Selection**
   * Use 'direct' or 'amino' sign types based on desired sign doc
   * Consider chain compatibility
   * Handle fallback cases

## 4. Common Issues

1. **Account Parsing Issues**
   * Wrong account type URL
   * Missing account fields
   * Incorrect decoding
2. **Public Key Issues**
   * Wrong type URL
   * Invalid key format
   * Encoding errors
3. **Sign Type Issues**
   * Wrong sign type for chain
   * Missing fallback
   * Chain compatibility
