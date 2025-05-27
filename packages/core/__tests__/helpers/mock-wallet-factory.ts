import { Chain } from '@chain-registry/v2-types';
import { IGenericOfflineSigner } from '@titanlabjs/types';

import { SignType, Wallet, WalletAccount } from '../../src/types';
import { BaseWallet } from '../../src/wallets/base-wallet';

type MockAccount = {
  chainId: string;
  walletName: string;
  account: WalletAccount;
};

export const createMockAccount = (addressPrefix: string) => {
  const account: WalletAccount = {
    address: `${addressPrefix}xxxxxxx`,
    algo: 'secp256k1',
    pubkey: new Uint8Array(0),
  };
  return account;
};

export class MockBaseWallet extends BaseWallet {
  mockAccounts: MockAccount[] = [];

  init(): Promise<void> {
    return Promise.resolve();
  }
  connect(chainId: string): Promise<void> {
    return Promise.resolve();
  }
  disconnect(chainId: string): Promise<void> {
    return Promise.resolve();
  }
  getAccount(chainId: string): Promise<WalletAccount> {
    const account = this.mockAccounts.find(
      (a) => a.chainId === chainId
    )?.account;
    return account
      ? Promise.resolve(account)
      : Promise.reject(new Error('Account not found'));
  }
  getOfflineSigner(
    chainId: string,
    preferredSignType?: SignType
  ): Promise<IGenericOfflineSigner> {
    return Promise.reject(new Error('Method not implemented.'));
  }
  addSuggestChain(chainId: string): Promise<void> {
    return Promise.reject(new Error('Method not implemented.'));
  }
  async getProvider(chainId: Chain['chainId']) {
    return {};
  }
  addMockAccount(
    chainId: string,
    walletName: string,
    account: WalletAccount
  ): void {
    this.mockAccounts.push({ chainId, walletName, account });
  }
}

export const createMockWallet = (info: Wallet) => {
  const mockWallet = new MockBaseWallet(info);

  return mockWallet;
};
