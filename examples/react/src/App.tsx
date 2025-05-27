import { Outlet, Route, Routes } from "react-router-dom";
import E2ETest from "./pages/all-wallets";
import ActiveWallet from "./pages/active-wallet";
import WalletConnect from "./pages/wallet-connect";
import UseChain from "./pages/use-chain";
import UseChainWallet from "./pages/use-chain-wallet";
import LedgerExample from "./pages/leger";
import Mobile from "./pages/mobile";
import CosmosWalletPage from "./pages/cosmos-wallet";
import TestDisconnect from "./pages/test-disconnect";

function Layout() {
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<E2ETest />} />
        <Route path="active-wallet" element={<ActiveWallet />} />
        <Route path="wallet-connect" element={<WalletConnect />} />
        <Route path="use-chain" element={<UseChain />} />
        <Route path="use-chain-wallet" element={<UseChainWallet />} />
        <Route path="ledger" element={<LedgerExample />} />
        <Route path="mobile" element={<Mobile />} />
        <Route path="cosmos-wallet" element={<CosmosWalletPage />} />
        <Route path="test-disconnect" element={<TestDisconnect />} />
      </Route>
    </Routes>
  );
}
