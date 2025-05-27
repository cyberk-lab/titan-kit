import { WCWallet } from '@titan-kit/core';
// import { Wallet } from '@titan-kit/core';
import { SignClientTypes } from '@walletconnect/types';

import { untitledWalletInfo } from './registry';

export class UntitledWallet extends WCWallet {
  constructor(walletConnectOption?: SignClientTypes.Options) {
    super(untitledWalletInfo, walletConnectOption);
    this.setOnPairingUriCreatedCallback((uri: string) => {
      console.log('WalletConnect uri=', uri);
    });
  }
}

const untitledWallet = new UntitledWallet();
export { untitledWallet };
