import { Wallet } from '@titan-kit/core';

import { ICON } from './constant';

export const untitledWalletInfo: Wallet = {
  // TODO: change to untitled-wallet
  // There is a bug with the UI kit, so we need to use WalletConnect as a placeholder
  name: 'WalletConnect',
  prettyName: 'Untitled Wallet',
  mode: 'wallet-connect',
  logo: ICON,
  walletconnect: {
    name: 'Untitled Wallet',
    projectId: '3ef9e46f71262db45cc537afa04f816f',
    encoding: 'base64',
    requiredNamespaces: {
      methods: ['cosmos_getAccounts', 'cosmos_signAmino', 'cosmos_signDirect'],
      events: ['chainChanged', 'accountsChanged'],
    },
  },
};
