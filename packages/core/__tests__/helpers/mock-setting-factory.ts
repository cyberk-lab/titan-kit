import { SigningOptions as InterchainSignerOptions } from '@titanlabjs/cosmos/types/signing-client';

export const createSignerOption = (
  chainName: string
): InterchainSignerOptions => {
  return {
    broadcast: {
      checkTx: true,
      deliverTx: true,
      timeoutMs: 20000,
    },
    gasPrice: '0.025uatom',
    signerOptions: {
      prefix: chainName,
    },
  };
};
