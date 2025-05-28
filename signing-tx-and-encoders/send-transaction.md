# Send Transaction

This guide shows how to send tokens using the signing client.

```typescript
import { useChainWallet } from '@titan-kit/react';
import { MsgSend } from '@titanlabjs/titan-types/cosmos/bank/v1beta1/tx';
import { MessageComposer } from '@titanlabjs/titan-types/cosmos/bank/v1beta1/tx.registry';
import { untitledWallet } from '@titan-kit/untitled-wallet';

function SendTokens() {
  const { signingClient } = useChainWallet(
    'titantestnet',
    untitledWallet.info.name
  );

  // Add encoder
  signingClient.addEncoders([MsgSend]);

  const handleSend = async () => {
    // Create message
    const message = MessageComposer.fromPartial.send({
      fromAddress: senderAddress,
      toAddress: recipientAddress,
      amount: [{
        denom: 'atkx',
        amount: '1000000'
      }]
    });

    // Sign and broadcast
    const res = await signingClient.signAndBroadcastSync(
      senderAddress,
      [message],
      fee,
      'Send tokens'
    );
  };
}
```
