import { Chain } from "@chain-registry/v2-types";
import { BaseWallet, WalletAccount } from "@titan-kit/core";
import { IGenericOfflineSigner } from "@interchainjs/types";

export class ChainWallet<TWallet extends BaseWallet> extends BaseWallet {
  getProvider(chainId: Chain["chainId"]): Promise<unknown> {
    return this.originalWallet.getProvider(chainId);
  }
  originalWallet: TWallet;

  connectWithState: TWallet["connect"];
  disconnectWithState: TWallet["disconnect"];
  getAccountWithState: TWallet["getAccount"];

  constructor(
    originalWallet: TWallet,
    connectWithState: TWallet["connect"],
    disconnectWithState: TWallet["disconnect"],
    getAccountWithState: TWallet["getAccount"]
  ) {
    super(originalWallet?.info);
    this.originalWallet = originalWallet;

    this.connectWithState = connectWithState;
    this.disconnectWithState = disconnectWithState;
    this.getAccountWithState = getAccountWithState;
  }
  async init(meta?: unknown): Promise<void> {
    return this.originalWallet.init();
  }
  async connect(chainId: string): Promise<void> {
    return this.connectWithState(chainId);
  }
  async disconnect(chainId: string): Promise<void> {
    return this.disconnectWithState(chainId);
  }
  async getAccount(chainId: string): Promise<WalletAccount> {
    return this.getAccountWithState(chainId);
  }
  async getOfflineSigner(chainId: string): Promise<IGenericOfflineSigner> {
    return this.originalWallet.getOfflineSigner(chainId);
  }
  async addSuggestChain(chainId: Chain["chainId"]): Promise<void> {
    return this.originalWallet.addSuggestChain(chainId);
  }
}
