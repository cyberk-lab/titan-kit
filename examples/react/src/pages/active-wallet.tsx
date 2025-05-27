import {
  useChain,
  useWalletManager,
  useWalletModal,
} from "@titan-kit/react";
import { useState } from "react";

const hwChain = {
  $schema: "../chain.schema.json",
  chainName: "hyperweb",
  chainId: "hyperweb-1",
  chainType: "cosmos",
  prettyName: "Hyperweb Devnet",
  status: "live",
  networkType: "devnet",
  bech32Prefix: "hyper",
  daemonName: "jsdd",
  nodeHome: "/root/.jsd",
  keyAlgos: ["secp256k1"],
  slip44: 118,
  alternativeSlip44s: [],
  fees: {
    feeTokens: [
      {
        denom: "uhyper",
        fixedMinGasPrice: 0,
        lowGasPrice: 0,
        averageGasPrice: 0.025,
        highGasPrice: 0.04,
      },
    ],
  },
  staking: {
    stakingTokens: [
      {
        denom: "uhyper",
      },
    ],
    lockDuration: {
      time: "1209600s",
    },
  },
  codebase: {
    gitRepo: "https://github.com/hyperweb-io/jsd",
    compatibleVersions: [],
    binaries: {},
    consensus: {
      type: "tendermint",
    },
    icsEnabled: [],
    versions: [],
  },
  images: [],
  peers: {
    seeds: [
      {
        id: "9aa1d2a2c799e70575ff1934ad5bbddc9677a811",
        address: "http://hyperweb-1-genesis.default.svc.cluster.local:26657",
        provider: "hyperweb-1",
      },
    ],
    persistentPeers: [],
  },
  apis: {
    rpc: [
      {
        address: "http://localhost:26657",
        provider: "hyperweb-1",
      },
    ],
    rest: [
      {
        address: "http://localhost:1317",
        provider: "hyperweb-1",
      },
    ],
    grpc: [
      {
        address: "http://hyperweb-1-genesis.default.svc.cluster.local:9091",
        provider: "hyperweb-1",
      },
    ],
    wss: [],
    grpcWeb: [],
    evmHttpJsonrpc: [],
  },
  explorers: [],
  keywords: [],
  extraCodecs: [],
};

const hwAssetList = {
  $schema: "../assetlist.schema.json",
  chainName: "hyperweb",
  assets: [
    {
      description: "The meme coin for Hyperweb chain.",
      denomUnits: [
        {
          denom: "uhyper",
          exponent: 0,
          aliases: [],
        },
        {
          denom: "hyper",
          exponent: 6,
          aliases: [],
        },
      ],
      base: "uhyper",
      name: "Hyper",
      display: "hyper",
      symbol: "HYPR",
      coingeckoId: "hyper",
      keywords: ["hyper"],
      logoURIs: {
        png: "https://gist.githubusercontent.com/Anmol1696/bea1b3835dfb0fce3ab9ed993f5a0792/raw/7065493384a51c888752284be7c1afbf6135b50a/logo-png.png",
        svg: "https://gist.githubusercontent.com/Anmol1696/bea1b3835dfb0fce3ab9ed993f5a0792/raw/7065493384a51c888752284be7c1afbf6135b50a/logo-svg.svg",
      },
    },
  ],
};

export default function ActiveWallet() {
  const { addChains, chains } = useWalletManager();

  const [chainName, setChainName] = useState(chains[0].chainName);

  const {
    address,
    wallet,
    logoUrl,
    connect,
    disconnect,
    chain,
    status,
    openView,
  } = useChain(chainName);

  const { open } = useWalletModal();

  const handleAddChain = async () => {
    addChains([hwChain], [hwAssetList]);
  };

  return (
    <>
      <select onChange={(e) => setChainName(e.target.value)}>
        {chains.map((chain) => (
          <option key={chain.chainId} value={chain.chainName}>
            {chain.chainName}
          </option>
        ))}
      </select>
      <button onClick={openView}>open wallets modal</button>
      <button onClick={handleAddChain}>add new chain</button>
      <button
        onClick={async () => {
          try {
            console.log(wallet);
            const y = wallet.getOfflineSigner(chain.chainId as string);
            const x = wallet.getOfflineSignerAmino(chain.chainId as string);
            console.log(await y.getAccounts());
            console.log(await x.getAccounts());
          } catch (error) {
            console.log(error);
            throw error;
          }
        }}
      >
        test some function
      </button>
      <p>{status}</p>
      <p>{wallet?.info?.prettyName}</p>

      <p>{address}</p>
      <img src={wallet?.info?.logo?.toString()} style={{ width: "100px" }} />
      <img src={logoUrl} style={{ width: "100px" }}></img>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect {chain?.chainName}</button>
      {/* <button onClick={disconnectAll}>Disconnect All</button> */}
    </>
  );
}
