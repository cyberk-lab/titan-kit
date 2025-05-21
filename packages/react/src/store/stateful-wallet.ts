import {
  BaseWallet,
  WalletAccount,
  WalletState,
  WCWallet,
} from "@titan-kit/core";
import { InterchainStore } from "./store";
import { Chain } from "@chain-registry/v2-types";

export class StatefulWallet extends BaseWallet {
  originalWallet: BaseWallet;
  walletName: string;
  walletSet: (arg: (draft: StatefulWallet) => void) => void;
  walletGet: () => StatefulWallet;
  set: (arg: (draft: InterchainStore) => void) => void;
  get: () => InterchainStore;

  constructor(
    wallet: BaseWallet,
    walletSet: (arg: (draft: StatefulWallet) => void) => void,
    walletGet: () => StatefulWallet,
    set: (arg: (draft: InterchainStore) => void) => void,
    get: () => InterchainStore
  ) {
    super(wallet.info);
    this.originalWallet = wallet;
    this.walletName = wallet.info.name;
    this.walletState = WalletState.Disconnected;
    this.errorMessage = "";

    this.walletSet = walletSet;
    this.walletGet = walletGet;
    this.set = set;
    this.get = get;
  }

  getChainToConnect(chainId?: Chain["chainId"]): Chain {
    const { currentChainName, chains } = this.get();
    const lastChainName = currentChainName;
    const lastChain = chains.find((chain) => chain.chainName === lastChainName);
    return chainId ? this.originalWallet.getChainById(chainId) : lastChain;
  }

  async init(): Promise<void> {
    return this.originalWallet.init();
  }

  async connect(chainId: Chain["chainId"]): Promise<void> {
    const { get, set, walletName, walletGet, walletSet, originalWallet } = this;

    const chainToConnect = this.getChainToConnect(chainId);

    const state = get().getChainWalletState(
      walletName,
      chainToConnect.chainName
    )?.walletState;
    if (state === WalletState.NotExist) {
      return;
    }

    if (walletName === "WalletConnect" && state === WalletState.Connected) {
      return;
    }

    set((draft) => {
      draft.currentChainName = chainToConnect.chainName;
      draft.currentWalletName = walletName;
      draft.walletConnectQRCodeUri = "";
    });

    walletSet((draft) => {
      draft.walletState = WalletState.Connecting;
    });
    get().updateChainWalletState(walletName, chainToConnect.chainName, {
      walletState: WalletState.Connecting,
      errorMessage: "",
    });
    try {
      if (originalWallet instanceof WCWallet) {
        originalWallet.setOnPairingUriCreatedCallback((uri) => {
          set((draft) => {
            draft.walletConnectQRCodeUri = uri;
          });
        });
      }

      await originalWallet.connect(chainToConnect.chainId);

      get().updateChainWalletState(walletName, chainToConnect.chainName, {
        walletState: WalletState.Connected,
      });
      walletSet((draft) => {
        draft.walletState = WalletState.Connected;
      });

      await walletGet().getAccount(chainToConnect.chainId);
    } catch (error) {
      if ((error as any).message === "Request rejected") {
        get().updateChainWalletState(walletName, chainToConnect.chainName, {
          walletState: WalletState.Rejected,
          errorMessage: (error as any).message,
        });
        walletSet((draft) => {
          draft.walletState = WalletState.Rejected;
          draft.errorMessage = (error as any).message;
        });
        return;
      }
      get().updateChainWalletState(walletName, chainToConnect.chainName, {
        walletState: WalletState.Disconnected,
        errorMessage: (error as any).message,
      });
      walletSet((draft) => {
        draft.walletState = WalletState.Disconnected;
        draft.errorMessage = (error as any).message;
      });
    }
  }
  async disconnect(chainId: Chain["chainId"]) {
    const { get, walletName, walletSet, originalWallet } = this;

    const chainToConnect = this.getChainToConnect(chainId);

    try {
      await originalWallet.disconnect(chainToConnect.chainId);
      get().updateChainWalletState(walletName, chainToConnect.chainName, {
        walletState: WalletState.Disconnected,
        account: null,
      });
      walletSet((draft) => {
        draft.walletState = WalletState.Disconnected;
        draft.errorMessage = "";
      });
    } catch (error) {}
  }
  async getAccount(chainId: Chain["chainId"]): Promise<WalletAccount> {
    const chainToConnect = this.getChainToConnect(chainId);
    const { get, walletName, originalWallet } = this;
    try {
      const account = await originalWallet.getAccount(chainToConnect.chainId);
      get().updateChainWalletState(walletName, chainToConnect.chainName, {
        account,
      });
      return account;
    } catch (error) {
      console.log(error);
    }
  }
  getOfflineSigner(
    chainId: Chain["chainId"]
  ): Promise<
    import("@interchainjs/types").IGenericOfflineSigner<
      unknown,
      unknown,
      unknown,
      import("@interchainjs/types").IGenericOfflineSignArgs<unknown, unknown>,
      import("@interchainjs/types").AccountData
    >
  > {
    return this.originalWallet.getOfflineSigner(chainId);
  }
  addSuggestChain(chainId: Chain["chainId"]): Promise<void> {
    return this.originalWallet.addSuggestChain(chainId);
  }
  getProvider(chainId?: Chain["chainId"]): Promise<any> {
    return this.originalWallet.getProvider(chainId);
  }
  getChainById(chainId: Chain["chainId"]): Chain {
    return this.originalWallet.getChainById(chainId);
  }
}
