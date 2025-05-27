import { useState } from "react";
import { useChain, useWalletManager } from "@titan-kit/react";
import { Chain } from "@chain-registry/v2-types";

const UseChain = () => {
  const [chainName, setChainName] = useState("osmosis");
  const walletManager = useWalletManager();
  const {
    logoUrl,
    address,
    status,
    username,
    wallet,
    openView,
    rpcEndpoint,
    disconnect,
    connect,
  } = useChain(chainName);

  console.log(wallet);

  return (
    <div className="space-y-4 mx-auto max-w-3xl mt-20">
      <h1 className="text-2xl font-semibold">useChain usage:</h1>
      <select
        value={chainName}
        onChange={(e) => setChainName(e.target.value)}
        className="h-9 px-3 mr-4 border rounded-md shadow-sm"
      >
        {walletManager.chains.map((chain: Chain) => (
          <option key={chain.chainId} value={chain.chainName}>
            {chain.chainName}
          </option>
        ))}
        {/* <option value="juno">Juno</option>
        <option value="osmosis">Osmosis</option>
        <option value="stargaze">Stargaze</option>
        <option value="cosmoshub">Cosmos Hub</option> */}
      </select>
      <div className="flex items-center">
        <span className="font-bold">logo:</span>{" "}
        <img className="w-[40px] h-[40px]" src={logoUrl} alt="logoUrl" />
      </div>
      <div>
        <span className="font-bold">rpcEndpoint: {rpcEndpoint as string}</span>
      </div>
      <div>
        <span className="font-bold">current wallet: </span>
        {wallet?.info?.prettyName}
      </div>
      <div>
        <span className="font-bold">wallet status: </span>
        {status === "Connected" ? (
          <span className="text-green-900">Connected</span>
        ) : (
          status
        )}

        <button
          className="text-red-600 underline cursor-pointer ml-5"
          onClick={disconnect}
        >
          disconnect
        </button>

        <span className="text-red-600">Disconnected</span>
        <button
          className="text-blue-600 underline cursor-pointer ml-5"
          onClick={connect}
        >
          connect
        </button>
      </div>
      <div>
        <span className="font-bold">username: </span>
        {username}
      </div>
      <div className="flex items-center">
        <span className="font-bold">account address: </span>
        {address}
      </div>
    </div>
  );
};
export default UseChain;
