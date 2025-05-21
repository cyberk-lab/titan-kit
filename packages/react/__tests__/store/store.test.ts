import { AssetList, Chain } from "@chain-registry/v2-types";
import { createInterchainStore, InterchainStore } from "../../src/store/store";
import {
  WalletManager,
  WalletState,
  SignerOptions,
  EndpointOptions,
  clientNotExistError,
  WalletAccount,
  BaseWallet,
  WCWallet,
} from "@titan-kit/core";
import { MockWallet, MockWalletConnect } from "../helpers/mock-wallet";
import { chain, assetList } from "@chain-registry/v2/mainnet/osmosis";

const localStorageMock: Storage = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string): string | null => store[key] || null,
    setItem: (key: string, value: string): void => {
      store[key] = value.toString();
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
    key: (index: number): string | null => Object.keys(store)[index] || null,
    length: 0,
  };
})();

Object.defineProperties(global, {
  localStorage: {
    value: localStorageMock,
    writable: true,
  },
});

describe("Test InterchainStore init", () => {
  let walletManager: WalletManager;

  const mockWallet1 = new MockWallet({
    name: "wallet1",
    mode: "extension",
    prettyName: "Wallet 1",
  });
  const mockWallet2 = new MockWallet({
    name: "wallet2",
    mode: "extension",
    prettyName: "Wallet 2",
  });

  mockWallet1.getChainById = jest
    .fn()
    .mockImplementation(() => ({ chainName: "chain1" }));
  mockWallet1.init.mockResolvedValue(undefined);
  mockWallet2.getChainById = jest
    .fn()
    .mockImplementation(() => ({ chainName: "chain1" }));
  mockWallet2.init.mockResolvedValue(undefined);

  it("should isReady be true after init", async () => {
    walletManager = {
      chains: [{ chainName: "chain1", chainId: "1" }] as Chain[],
      assetLists: [{ chainName: "chain1", assets: [] }] as AssetList[],
      wallets: [mockWallet1, mockWallet2],
      signerOptions: {} as SignerOptions,
      endpointOptions: {} as EndpointOptions,
      preferredSignTypeMap: {},
      signerOptionMap: {},
      endpointOptionsMap: {},
      init: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
      getAccount: jest.fn(),
      getRpcEndpoint: jest.fn(),
      getChainLogoUrl: jest.fn(),
      getChainByName: jest.fn(),
      getAssetListByName: jest.fn(),
      getDownloadLink: jest.fn(),
      getOfflineSigner: jest.fn(),
      getPreferSignType: jest.fn(),
      getSignerOptions: jest.fn(),
      getWalletByName: jest.fn(),
      getSigningClient: jest.fn(),
      getEnv: jest.fn(),
      addChains: jest.fn(),
    } as unknown as WalletManager;

    const useStore = createInterchainStore(walletManager);

    expect(useStore.getState().isReady).toBe(false);

    await useStore.getState().init();

    expect(useStore.getState().isReady).toBe(true);
  });
});

describe("InterchainStore", () => {
  let walletManager: WalletManager;
  let store: InterchainStore;
  let useStore: ReturnType<typeof createInterchainStore>;

  const mockChain = { chainName: "chain1", chainId: "1" } as Chain;
  const mockAssetList = { chainName: "chain1", assets: [] } as AssetList;

  const mockWallet1 = new MockWallet({
    name: "wallet1",
    mode: "extension",
    prettyName: "Wallet 1",
  });
  // const mockWCWallet = new MockWalletConnect({ name: 'WalletConnect', mode: 'wallet-connect', prettyName: 'Wallet Connect' });
  // const mockWCWallet = { info: { name: 'WalletConnect', mode: 'wallet-connect', prettyName: 'Wallet Connect' } } as WCWallet
  const mockWCWallet = new MockWalletConnect({
    name: "WalletConnect",
    mode: "wallet-connect",
    prettyName: "Wallet Connect",
  });

  mockWallet1.getChainById = jest.fn().mockImplementation(() => mockChain);
  mockWallet1.connect = jest.fn();
  mockWallet1.getAccount = jest
    .fn()
    .mockResolvedValue({ address: "address1" } as WalletAccount);

  mockWCWallet.getChainById = jest.fn().mockImplementation(() => mockChain);
  mockWCWallet.connect = jest.fn();
  mockWCWallet.getAccount = jest
    .fn()
    .mockResolvedValue({ address: "address1" } as WalletAccount);

  beforeEach(async () => {
    walletManager = {
      chains: [mockChain] as Chain[],
      assetLists: [mockAssetList] as AssetList[],
      wallets: [mockWallet1, mockWCWallet],
      signerOptions: {} as SignerOptions,
      endpointOptions: {} as EndpointOptions,
      preferredSignTypeMap: {},
      signerOptionMap: {},
      endpointOptionsMap: {},
      init: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
      getAccount: jest.fn(),
      getRpcEndpoint: jest.fn(),
      getChainLogoUrl: jest.fn(),
      getChainByName: jest.fn(),
      getAssetListByName: jest.fn(),
      getDownloadLink: jest.fn(),
      getOfflineSigner: jest.fn(),
      getPreferSignType: jest.fn(),
      getSignerOptions: jest.fn(),
      getWalletByName: jest.fn(),
      getSigningClient: jest.fn(),
      getEnv: jest.fn(),
      addChains: jest.fn(),
    } as unknown as WalletManager;

    useStore = createInterchainStore(walletManager);

    await useStore.getState().init();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should set current chain name", () => {
    useStore.getState().setCurrentChainName("chain1");
    expect(useStore.getState().currentChainName).toBe("chain1");
  });

  it("should set current wallet name", () => {
    useStore.getState().setCurrentWalletName("wallet1");
    expect(useStore.getState().currentWalletName).toBe("wallet1");
  });

  it("should update chain wallet state", () => {
    useStore
      .getState()
      .updateChainWalletState("wallet1", "chain1", {
        walletState: WalletState.Connected,
      });
    const state = useStore.getState().getChainWalletState("wallet1", "chain1");
    expect(state?.walletState).toBe(WalletState.Connected);
  });

  it("should connect to a wallet and update wallet state correctly", async () => {
    (walletManager.connect as jest.Mock).mockImplementationOnce(
      async (walletName, chainName, onUri) => {
        if (walletName === "WalletConnect") {
          onUri("wc:mock-uri");
        }
      }
    );

    await useStore.getState().connect("wallet1", mockChain.chainName);
    expect(mockWallet1.connect).toHaveBeenCalledWith(mockChain.chainId);
    expect(useStore.getState().currentChainName).toBe(mockChain.chainName);
    expect(useStore.getState().currentWalletName).toBe("wallet1");
    const state = useStore
      .getState()
      .getChainWalletState("wallet1", mockChain.chainName);
    expect(state?.walletState).toBe(WalletState.Connected);
    expect(state?.errorMessage).toBe("");
  });

  it("should handle WalletConnect URI during connection", async () => {
    mockWCWallet.setOnPairingUriCreatedCallback = jest
      .fn()
      .mockImplementationOnce((onUri) => {
        onUri("wc:mock-uri");
      });

    await useStore.getState().connect("WalletConnect", "chain1");
    expect(mockWCWallet.connect).toHaveBeenCalledWith(mockChain.chainId);
    expect(useStore.getState().walletConnectQRCodeUri).toBe("wc:mock-uri");
    const state = useStore
      .getState()
      .getChainWalletState("WalletConnect", "chain1");
    expect(state?.walletState).toBe(WalletState.Connected);
  });

  it("should handle rejected connection request", async () => {
    (mockWallet1.connect as jest.Mock).mockRejectedValueOnce(
      new Error("Request rejected")
    );

    await useStore.getState().connect("wallet1", "chain1");
    const state = useStore.getState().getChainWalletState("wallet1", "chain1");
    expect(state?.walletState).toBe(WalletState.Rejected);
    expect(state?.errorMessage).toBe("Request rejected");
  });

  it("should handle connection error with a specific message", async () => {
    (mockWallet1.connect as jest.Mock).mockRejectedValueOnce(
      new Error("Specific connection error")
    );

    await useStore.getState().connect("wallet1", "chain1");
    const state = useStore.getState().getChainWalletState("wallet1", "chain1");
    expect(state?.walletState).toBe(WalletState.Disconnected);
    expect(state?.errorMessage).toBe("Specific connection error");
  });

  it("should not connect if wallet state is NotExist", async () => {
    useStore
      .getState()
      .updateChainWalletState("wallet1", "chain1", {
        walletState: WalletState.NotExist,
      });

    await useStore.getState().connect("wallet1", "chain1");
    expect(walletManager.connect).not.toHaveBeenCalled();
    const state = useStore.getState().getChainWalletState("wallet1", "chain1");
    expect(state?.walletState).toBe(WalletState.NotExist);
  });

  it("should not reconnect WalletConnect if already connected", async () => {
    useStore
      .getState()
      .updateChainWalletState("WalletConnect", "chain1", {
        walletState: WalletState.Connected,
      });

    await useStore.getState().connect("WalletConnect", "chain1");
    expect(walletManager.connect).not.toHaveBeenCalled();
    const state = useStore
      .getState()
      .getChainWalletState("WalletConnect", "chain1");
    expect(state?.walletState).toBe(WalletState.Connected);
  });

  it("should handle connection error", async () => {
    (mockWallet1.connect as jest.Mock).mockRejectedValueOnce(
      new Error("Connection error")
    );
    await useStore.getState().connect("wallet1", "chain1");
    const state = useStore.getState().getChainWalletState("wallet1", "chain1");
    expect(state?.walletState).toBe(WalletState.Disconnected);
    expect(state?.errorMessage).toBe("Connection error");
  });

  it("should disconnect from a wallet", async () => {
    (walletManager.disconnect as jest.Mock).mockResolvedValueOnce(undefined);
    await useStore.getState().disconnect("wallet1", "chain1");
    const state = useStore.getState().getChainWalletState("wallet1", "chain1");
    expect(state?.walletState).toBe(WalletState.Disconnected);
    expect(state?.account).toBeNull();
  });

  it("should get account", async () => {
    const account = { address: "address1" };
    (mockWallet1.getAccount as jest.Mock).mockResolvedValueOnce(account);
    const result = await useStore.getState().getAccount("wallet1", "chain1");
    expect(result).toBe(account);
    const state = useStore.getState().getChainWalletState("wallet1", "chain1");
    expect(state?.account).toBe(account);
  });

  it("should get RPC endpoint", async () => {
    const rpcEndpoint = "http://localhost:26657";
    (walletManager.getRpcEndpoint as jest.Mock).mockResolvedValueOnce(
      rpcEndpoint
    );
    const result = await useStore
      .getState()
      .getRpcEndpoint("wallet1", "chain1");
    expect(result).toBe(rpcEndpoint);
  });

  it("should not reconnect WalletConnect if already connected", async () => {
    useStore
      .getState()
      .updateChainWalletState("WalletConnect", "chain1", {
        walletState: WalletState.Connected,
      });

    await useStore.getState().connect("WalletConnect", "chain1");
    expect(walletManager.connect).not.toHaveBeenCalled();
    const state = useStore
      .getState()
      .getChainWalletState("WalletConnect", "chain1");
    expect(state?.walletState).toBe(WalletState.Connected);
  });

  it("should initialize chainWalletState with disconnected wallets for all chains", async () => {
    const chainWalletState = useStore.getState().chainWalletState;

    expect(chainWalletState).toEqual([
      {
        chainName: "chain1",
        walletName: "wallet1",
        walletState: "Disconnected",
        account: undefined,
        errorMessage: "",
        rpcEndpoint: "",
      },
      {
        chainName: "chain1",
        walletName: "WalletConnect",
        walletState: "Disconnected",
        account: undefined,
        errorMessage: "",
        rpcEndpoint: "",
      },
    ]);
  });

  it("should set wallet state to NotExist for wallets that do not exist", async () => {
    (walletManager.wallets[0].init as jest.Mock).mockRejectedValueOnce(
      clientNotExistError
    );

    await useStore.getState().init();
    const chainWalletState = useStore.getState().chainWalletState;

    expect(chainWalletState).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          chainName: "chain1",
          walletName: "wallet1",
          walletState: WalletState.NotExist,
        }),
      ])
    );
  });

  it("should set wallet state to Disconnected for wallets that exist", async () => {
    (walletManager.wallets[0].init as jest.Mock).mockResolvedValueOnce(
      undefined
    );

    await useStore.getState().init();
    const chainWalletState = useStore.getState().chainWalletState;

    expect(chainWalletState).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          chainName: "chain1",
          walletName: "wallet1",
          walletState: WalletState.Disconnected,
        }),
      ])
    );
  });

  it("should handle a mix of existing and non-existing wallets", async () => {
    mockWallet1.init = jest.fn().mockRejectedValueOnce(clientNotExistError);
    mockWCWallet.init = jest.fn().mockResolvedValueOnce(undefined);

    await useStore.getState().init();
    const chainWalletState = useStore.getState().chainWalletState;

    expect(chainWalletState).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          chainName: "chain1",
          walletName: "wallet1",
          walletState: WalletState.NotExist,
        }),
        expect.objectContaining({
          chainName: "chain1",
          walletName: "WalletConnect",
          walletState: WalletState.Disconnected,
        }),
      ])
    );
  });

  it("should set wallet state to Disconnected for wallets that not exist before", async () => {
    useStore
      .getState()
      .updateChainWalletState("wallet1", "chain1", {
        walletState: WalletState.NotExist,
      });

    (walletManager.wallets[0].init as jest.Mock).mockResolvedValueOnce(
      undefined
    );

    await useStore.getState().init();
    const chainWalletState = useStore.getState().chainWalletState;

    expect(chainWalletState).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          chainName: "chain1",
          walletName: "wallet1",
          walletState: WalletState.Disconnected,
        }),
      ])
    );
  });

  it("should add a new chain without signerOptions and endpointOptions", () => {
    const newChains = [{ chainName: "chain2", chainId: "2" }] as Chain[];
    const newAssetLists = [{ chainName: "chain2", assets: [] }] as AssetList[];
    useStore.getState().addChains(newChains, newAssetLists);
    expect(walletManager.addChains).toHaveBeenCalledWith(
      newChains,
      newAssetLists,
      undefined,
      undefined
    );
  });

  it("should update endpoints if use addChains to add newChain", async () => {
    const newChains = [{ chainName: "chain2", chainId: "2" }] as Chain[];
    const newAssetLists = [{ chainName: "chain2", assets: [] }] as AssetList[];
    const newSignerOptions = {
      signing: jest.fn().mockReturnValue({ gasPrice: "1000" }),
    } as SignerOptions;
    const newEndpointOptions = {
      endpoints: { chain2: { rpc: ["http://localhost:26657"] } },
    } as EndpointOptions;
    await useStore
      .getState()
      .addChains(
        newChains,
        newAssetLists,
        newSignerOptions,
        newEndpointOptions
      );
    expect(useStore.getState().chains).toContainEqual(newChains[0]);
    expect(useStore.getState().assetLists).toContainEqual(newAssetLists[0]);
    expect(useStore.getState().signerOptionMap).toEqual(
      expect.objectContaining({ chain2: { gasPrice: "1000" } })
    );
    expect(useStore.getState().endpointOptionsMap).toEqual(
      expect.objectContaining({ chain2: newEndpointOptions.endpoints?.chain2 })
    );

    const newSignerOptionss = {
      signing: jest.fn().mockImplementation((chainName: string) => {
        return {
          chain1: { gasPrice: "3000" },
          chain2: { gasPrice: "4000" },
        }[chainName];
      }),
    } as SignerOptions;
    const newEndpointOptionss = {
      endpoints: {
        chain2: { rpc: ["http://localhost:26668"] },
        chain1: { rpc: ["http://localhost:27774"] },
      },
    } as EndpointOptions;

    await useStore
      .getState()
      .addChains(
        newChains,
        newAssetLists,
        newSignerOptionss,
        newEndpointOptionss
      );
    expect(useStore.getState().signerOptionMap).toEqual(
      expect.objectContaining({
        chain1: { gasPrice: "3000" },
        chain2: { gasPrice: "4000" },
      })
    );
    expect(useStore.getState().endpointOptionsMap).toEqual(
      expect.objectContaining({
        chain2: newEndpointOptionss.endpoints?.chain2,
        chain1: newEndpointOptionss.endpoints?.chain1,
      })
    );
  });

  it("should update wallet state to Connected and fetch account after connection", async () => {
    const account = { address: "address1" };
    (mockWallet1.getAccount as jest.Mock).mockResolvedValueOnce(account);

    await useStore.getState().connect("wallet1", "chain1");

    const state = useStore.getState().getChainWalletState("wallet1", "chain1");
    expect(state?.walletState).toBe(WalletState.Connected);
    expect(mockWallet1.getAccount).toHaveBeenCalledWith(mockChain.chainId);
    expect(state?.account).toBe(account);
  });

  it("should add new chain wallet states for new chains and wallets", async () => {
    expect(useStore.getState().isReady).toBeTruthy();
    const newChains = [{ chainName: "chain2", chainId: "2" }] as Chain[];
    const newAssetLists = [{ chainName: "chain2", assets: [] }] as AssetList[];

    await useStore.getState().addChains(newChains, newAssetLists);

    const chainWalletState = useStore.getState().chainWalletState;

    expect(chainWalletState).toEqual([
      {
        account: undefined,
        chainName: "chain1",
        errorMessage: "",
        rpcEndpoint: "",
        walletName: "wallet1",
        walletState: "Disconnected",
      },
      {
        account: undefined,
        chainName: "chain1",
        errorMessage: "",
        rpcEndpoint: "",
        walletName: "WalletConnect",
        walletState: "Disconnected",
      },
      {
        account: undefined,
        chainName: "chain2",
        errorMessage: "",
        rpcEndpoint: "",
        walletName: "wallet1",
        walletState: "Disconnected",
      },
      {
        account: undefined,
        chainName: "chain2",
        errorMessage: "",
        rpcEndpoint: "",
        walletName: "WalletConnect",
        walletState: "Disconnected",
      },
    ]);
  });

  it("should not duplicate chain wallet states for existing chains and wallets", async () => {
    const newChains = [{ chainName: "chain1", chainId: "1" }] as Chain[];
    const newAssetLists = [{ chainName: "chain1", assets: [] }] as AssetList[];

    await useStore.getState().addChains(newChains, newAssetLists);

    const chainWalletState = useStore.getState().chainWalletState;

    // Ensure no duplicate entries for chain1 and wallet1
    const filteredStates = chainWalletState.filter(
      (cws) => cws.chainName === "chain1" && cws.walletName === "wallet1"
    );
    expect(filteredStates.length).toBe(1);
  });

  it("should initialize chainWalletState with old states if they exist", async () => {
    const oldChainWalletState = useStore.getState().chainWalletState;
    expect(oldChainWalletState).toHaveLength(2);

    // mock init again with new chains and wallets
    useStore.getState().wallets = [
      { info: { name: "wallet1" }, init: jest.fn() },
    ] as any[];
    useStore.getState().chains = [
      { chainName: "chain1", chainId: "1" },
    ] as Chain[];
    useStore.getState().assetLists = [
      { chainName: "chain1", assets: [] },
    ] as AssetList[];
    await useStore.getState().init();

    const chainWalletState = useStore.getState().chainWalletState;
    expect(chainWalletState).toHaveLength(2);
  });
});
