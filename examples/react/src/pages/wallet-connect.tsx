import { useChain, useChainWallet } from "@titan-kit/react";

const WalletConnect = () => {
  const { openView, address, disconnect, chain, rpcEndpoint, wallet } =
    useChain("osmosis");

  return (
    <div>
      <p>current chain: {chain.chainName}</p>
      <p>
        current address: {address} <button>get address</button>
      </p>
      <button onClick={openView}>open modal to connect</button>
    </div>
  );
};

export default WalletConnect;
