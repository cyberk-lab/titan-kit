import { BaseWallet, WCWallet } from "@titan-kit/core";

export class MockWallet extends BaseWallet {
  init = jest.fn();
  connect = jest.fn();
  disconnect = jest.fn();
  getAccount = jest.fn();
  getOfflineSigner = jest.fn();
  addSuggestChain = jest.fn();
  getProvider = jest.fn();
}

export class MockWalletConnect extends WCWallet {}

export class MockStatefulWallet extends BaseWallet {
  init = jest.fn();
  connect = jest.fn();
  disconnect = jest.fn();
  getAccount = jest.fn();
  getOfflineSigner = jest.fn();
  addSuggestChain = jest.fn();
  getProvider = jest.fn();
  setState = jest.fn();
}
