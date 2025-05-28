# Basic Usage

The signing client is used to sign and broadcast transactions. Before using it, you need to add the appropriate encoders for the message types you want to use.

```typescript
import { useChainWallet } from '@titan-kit/react';
import { MsgSend } from '@titanlabjs/titan-types/cosmos/bank/v1beta1/tx';
import { untitledWallet } from '@titan-kit/untitled-wallet';

function YourComponent() {
  const { signingClient } = useChainWallet(
    'titantestnet',  // chain name
    untitledWallet.info.name // wallet name from untitled wallet
  );

  // Add encoder
  signingClient.addEncoders([MsgSend]);

  // Now you can use the signing client to sign and broadcast transactions
  const handleTransaction = async () => {
    try {
      const res = await signingClient.signAndBroadcastSync(
        address,
        messages,
        fee,
        memo
      );
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };
}
```
