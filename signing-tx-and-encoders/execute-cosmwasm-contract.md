# Execute CosmWasm Contract

This guide shows how to execute a CosmWasm contract using the signing client.

```typescript
import { useChainWallet } from '@titan-kit/react';
import { MsgExecuteContract } from '@titanlabjs/titan-types/cosmwasm/wasm/v1/tx';
import { MessageComposer } from '@titanlabjs/titan-types/cosmwasm/wasm/v1/tx.registry';
import { untitledWallet } from '@titan-kit/untitled-wallet';

function ExecuteContract() {
  const { signingClient } = useChainWallet(
    'titantestnet',
    untitledWallet.info.name
  );

  // Add encoder
  signingClient.addEncoders([MsgExecuteContract]);

  const handleExecute = async () => {
    // Create message
    const message = MessageComposer.fromPartial.executeContract({
      sender: senderAddress,
      contract: contractAddress,
      msg: Buffer.from(JSON.stringify({
        transfer: {
          recipient: recipientAddress,
          amount: '1000000'
        }
      })),
      funds: [{
        denom: 'atkx',
        amount: '1000000'
      }]
    });

    // Sign and broadcast
    const res = await signingClient.signAndBroadcastSync(
      senderAddress,
      [message],
      fee,
      'Execute contract'
    );
  };
} 
```
