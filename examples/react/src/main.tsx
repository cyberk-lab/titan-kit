import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '@interchain-ui/react/styles';
import { BrowserRouter } from 'react-router-dom';

import { TitanKitProvider, InterchainWalletModal } from '@titan-kit/react';

import { assetLists, chains } from '@chain-registry/v2';
import { BaseWallet, ExtensionWallet, isInstanceOf } from '@titan-kit/core';
import { keplrWallet } from '@titan-kit/keplr-extension';
import { UntitledWallet } from '@titan-kit/untitled-wallet';

// import { MockWallet } from "@titan-kit/mock-wallet";
const untitledWallet = new UntitledWallet({
  metadata: {
    name: 'Hyperion',
    description: 'The main swap on titan',
    icons: [],
    url: 'https://hyperion.com',
  },
});

const chainNames: string[] = [
  // "injectivetestnet",
  // "osmosistestnet",
  // "osmosis",
  // "juno",
  // "cosmoshub",
  // "stargaze",
  // "noble",
  // "seitestnet2",
  // "ethereum",
  // "cosmoshubtestnet",
  'titantestnet',
];
// const chainNames = ["osmosistestnet"];
// const chainNames = ["cosmoshub"];

// const _chains = chains.filter(c => chainNames.includes(c.chainName)).map(c => ({
//   ...c, apis: {
//     ...c.apis,
//     rpc: [{ address: 'http://localhost:26653' }],
//     rest: [{ address: 'http://localhost:1313' }]
//   }
// }))

// const bscethertestnet = {
//   chainId: "97",
//   // chainId: "0x61",
//   chainName: "Binance Smart Chain Testnet",
//   nativeCurrency: {
//     name: "BSC Testnet",
//     symbol: "tBNB", // Native currency symbol
//     decimals: 18, // Native currency decimals
//   },
//   rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
//   blockExplorerUrls: ["https://testnet.bscscan.com"],
// };

// const goerliethereumtestnet = {
//   chainId: "0x5", // Goerli Testnet
//   chainName: "Goerli Testnet",
//   rpcUrls: ["https://rpc.goerli.mudit.blog/"],
//   nativeCurrency: {
//     name: "Goerli ETH",
//     symbol: "ETH",
//     decimals: 18,
//   },
//   blockExplorerUrls: ["https://goerli.etherscan.io"],
// };

// const sepoliaEthereumTestNet = {
//   chainId: "0xaa36a7", // Sepolia Testnet
//   chainName: "Sepolia Testnet",
//   rpcUrls: ["https://gateway.tenderly.co/public/sepolia"],
//   nativeCurrency: {
//     name: "Sepolia ETH",
//     symbol: "USDC",
//     decimals: 18,
//   },
//   blockExplorerUrls: ["https://goerli.etherscan.io"],
// };

// const HOLESKY_TESTNET = {
//   chainId: "17000", // 17000 | 0x4268
//   chainName: "HoleskyTestNet",
//   rpcUrls: ["https://ethereum-holesky.publicnode.com"],
//   nativeCurrency: {
//     name: "HoleskyETH",
//     symbol: "ETH",
//     decimals: 18,
//   },
//   blockExplorerUrls: ["https://holesky.etherscan.io"],
// };

const _chains = [
  ...chains.filter((c) => chainNames.includes(c.chainName)),
  // createChainFromEthereumChainInfo(bscethertestnet),
  // createChainFromEthereumChainInfo(goerliethereumtestnet),
  // createChainFromEthereumChainInfo(sepoliaEthereumTestNet),
  // createChainFromEthereumChainInfo(HOLESKY_TESTNET),
  // createStarshipChain(
  //   "test-osmosis-1",
  //   "osmosis",
  //   "http://localhost:26657",
  //   "http://localhost:1317"
  // ),
];
// const _chains = [starshipChain1]
const _assetLists = [
  ...assetLists.filter((a) => chainNames.includes(a.chainName)),
  // createAssetListFromEthereumChainInfo(bscethertestnet),
  // createAssetListFromEthereumChainInfo(goerliethereumtestnet),
  // createAssetListFromEthereumChainInfo(sepoliaEthereumTestNet),
  // createAssetListFromEthereumChainInfo(HOLESKY_TESTNET),
  // createStarshipAssetList("osmosis"),
];

// const mock1Wallet = new MockWallet(wallet1Mnemonic, _chains, {
//   mode: "extension",
//   prettyName: "Mock1",
//   name: "mock1",
// });
// const mock2Wallet = new MockWallet(wallet2Mnemonic, _chains, {
//   mode: "extension",
//   prettyName: "Mock2",
//   name: "mock2",
// });

if (isInstanceOf(keplrWallet, ExtensionWallet)) {
  keplrWallet.setSignOptions({
    preferNoSetFee: false,
  });
}

const _wallets: BaseWallet[] = [
  // mock1Wallet,
  // mock2Wallet,
  keplrWallet,
  // leapWallet,
  // cosmostationWallet,
  // stationWallet,
  // galaxyStationWallet,
  // walletConnect,
  // ledgerWallet,
  // cosmosExtensionMetaMask,
  // walletConnect,
  // ledgerWallet,
  // leapCosmosExtensionMetaMask,
  // compassWallet,
  // trustWallet,
  // metaMaskWallet,
  // okxWallet,
  // xdefiWallet,
  // exodusWallet,
  // coin98Wallet,
  // finWallet,
  // shellWallet,
  // ninjiWallet,
  untitledWallet,
];

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TitanKitProvider
      chains={_chains}
      wallets={_wallets}
      assetLists={_assetLists}
      walletModal={InterchainWalletModal}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TitanKitProvider>
  </React.StrictMode>
);
