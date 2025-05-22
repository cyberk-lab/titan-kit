import { useChainWallet, useWalletManager } from "@titan-kit/react";

const Tr = ({
  chainName,
  walletName,
}: {
  chainName: string;
  walletName: string;
}) => {
  const { address, connect, disconnect, status } = useChainWallet(
    chainName,
    walletName
  );
  console.log({ chainName, walletName });
  return (
    <tr>
      <td>{walletName}</td>
      <td>{chainName}</td>
      <td>{status}</td>
      <td>{address}</td>
      <td>
        <button className="bg-green-300 px-1" onClick={connect}>
          connect
        </button>
      </td>
      <td>
        <button className="bg-red-300 px-1" onClick={disconnect}>
          disconnect
        </button>
      </td>
    </tr>
  );
};

const UseChainWallet = () => {
  const walletManager = useWalletManager();

  return (
    <div>
      <table>
        <tbody>
          {walletManager.wallets.map((wallet) => {
            return walletManager.chains.map((chain) => {
              return (
                <Tr
                  key={chain.chainName + wallet.info?.name}
                  chainName={chain.chainName}
                  walletName={wallet.info?.name as string}
                />
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
};
export default UseChainWallet;
