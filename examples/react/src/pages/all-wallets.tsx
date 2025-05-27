import { BaseWallet, WCWallet } from '@titan-kit/core';
import { useChainWallet, useWalletModal } from '@titan-kit/react';
import { useWalletManager } from '@titan-kit/react';

import { useEffect, useRef, useState } from 'react';
import { Chain } from '@chain-registry/v2-types';
import { getBalance } from '@titanlabjs/cosmos-types/cosmos/bank/v1beta1/query.rpc.func';
import { MsgSend } from '@titanlabjs/cosmos-types/cosmos/bank/v1beta1/tx';
import QRCode from 'react-qr-code';
import { MessageComposer } from '@titanlabjs/titan-types/cosmos/bank/v1beta1/tx.registry';

type BalanceProps = {
  address: string;
  wallet: BaseWallet;
  chainName: string;
  chainId: string;
  chain: Chain;
};

const BalanceTd = ({ address, wallet, chain }: BalanceProps) => {
  const { rpcEndpoint, signingClient } = useChainWallet(
    chain.chainName,
    wallet.info?.name as string
  );

  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<any>();

  const handleBalanceQuery = async () => {
    setIsLoading(true);
    const balance = await getBalance(rpcEndpoint as string, {
      address,
      denom: chain.staking?.stakingTokens[0].denom as string,
    });
    console.log(balance);
    setBalance(balance);
    setIsLoading(false);
  };

  return (
    <td>
      <div>
        <button className="bg-blue-100 p-1 m-1" onClick={handleBalanceQuery}>
          refresh balance
        </button>
      </div>
      <div>
        <span>balance: </span>
        <span>{balance?.balance?.amount}</span>
      </div>
    </td>
  );
};

type SendTokenProps = {
  wallet: BaseWallet;
  address: string;
  chain: Chain;
};

const SendTokenTd = ({ wallet, address, chain }: SendTokenProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.value = 'titan1436453umjhme9mjt92krtwf0r07s7ql766hp6k';
    }
    if (amountRef.current) {
      amountRef.current.value = (1e16).toString();
    }
  }, []);

  const { signingClient } = useChainWallet(
    chain.chainName,
    wallet.info?.name as string
  );

  const handleSendToken = async () => {
    if (ref.current) {
      const recipientAddress = ref.current.value;
      const denom = chain.staking?.stakingTokens[0].denom as string;

      const fee = {
        amount: [
          {
            amount: (BigInt(13) * BigInt(10) ** BigInt(15)).toString(),
            denom,
          },
        ],
        gas: '127496',
      };

      try {
        signingClient!.addEncoders([MsgSend]);
        const res = await signingClient!.signAndBroadcastSync(
          address,
          [
            MessageComposer.fromPartial.send({
              fromAddress: address!,
              toAddress: recipientAddress,
              amount: [
                {
                  denom,
                  amount: amountRef.current?.value as string,
                },
              ],
            }),
          ],
          fee,
          'test'
        );
        console.log(res);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <td>
      <div>
        <button className="bg-blue-100 p-1 m-1" onClick={handleSendToken}>
          Send Token to:
        </button>
        <input className="border-red-300 border-2 rounded-sm" ref={ref} />
      </div>
      <div>
        amount:{' '}
        <input className="border-red-300 border-2 rounded-sm" ref={amountRef} />
      </div>
    </td>
  );
};

const RpcTd = ({ wallet, chain }: SendTokenProps) => {
  const { rpcEndpoint, getRpcEndpoint } = useChainWallet(
    chain.chainName,
    wallet.info?.name as string
  );

  return (
    <td>
      <p>{rpcEndpoint as string}</p>
      <button onClick={getRpcEndpoint}>get rpc</button>
    </td>
  );
};

const AddressTd = ({ wallet, chain }: SendTokenProps) => {
  const { address, wallet: walletHandler } = useChainWallet(
    chain.chainName,
    wallet.info?.name as string
  );

  const getAccount = () => {
    walletHandler.getAccount(chain.chainId as string).then((account) => {
      console.log(account);
    });
  };

  return (
    <td>
      <p>{address}</p>
      <button onClick={getAccount}>get account</button>
    </td>
  );
};

const ChainRow = ({ chain, wallet }: { chain: Chain; wallet: BaseWallet }) => {
  const { address, connect, disconnect, status } = useChainWallet(
    chain.chainName,
    wallet.info?.name as string
  );

  return (
    <tr>
      <td>
        <button onClick={connect}>connect by chain</button>
        <button onClick={disconnect}>disconnect by chain</button>
      </td>
      <td>{chain.chainName}</td>
      <td>{chain.chainId}</td>
      <td>{status}</td>
      <RpcTd address={address} wallet={wallet} chain={chain}></RpcTd>
      <AddressTd address={address} wallet={wallet} chain={chain}></AddressTd>
      <BalanceTd
        address={address}
        chainId={chain.chainId as string}
        chainName={chain.chainName}
        wallet={wallet}
        chain={chain}
      />
      <SendTokenTd address={address} wallet={wallet} chain={chain} />
    </tr>
  );
};

const WalletConnectTd = ({ wallet }: { wallet: BaseWallet }) => {
  const walletManager = useWalletManager();

  // const chainIds = walletManager.chains.map((c) => c.chainId);

  const currentWallet = walletManager.wallets.find(
    (w: BaseWallet) => w.info?.name === wallet.info?.name
  );

  const connect = () => {
    walletManager.connect(wallet.info?.name as string, 'titantestnet');
  };

  const disconnect = () => {
    walletManager.disconnect(wallet.info?.name as string, 'titantestnet');
  };

  const uri = walletManager.walletConnectQRCodeUri;

  return (
    <td>
      <button className="bg-blue-100 p-1 m-1" onClick={connect}>
        connect
      </button>
      <button className="bg-blue-100 p-1 m-1" onClick={disconnect}>
        disconnect
      </button>
      {currentWallet instanceof WCWallet && uri && <QRCode value={uri} />}
      {wallet.errorMessage}
    </td>
  );
};

const E2ETest = () => {
  const walletManager = useWalletManager();
  const { open } = useWalletModal();

  return (
    <div>
      <table style={{ width: '1000px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Pretty Name</th>
            <th>Connect</th>
            <th>State</th>
            <th>Chain</th>
          </tr>
        </thead>
        <tbody>
          {walletManager.wallets.map((wallet) => {
            return (
              <tr key={wallet.info?.name}>
                <td>{wallet.info?.name}</td>
                <td>{wallet.info?.prettyName}</td>
                <WalletConnectTd wallet={wallet} />
                <td>{wallet.walletState}</td>
                <td>
                  <table>
                    <thead>
                      <tr>
                        <th>connect</th>
                        <th>name</th>
                        <th>chainId</th>
                        <th>state</th>
                        <th>rpc</th>
                        <th>address</th>
                        <th>faucet</th>
                        <th>send token</th>
                      </tr>
                    </thead>
                    <tbody>
                      {walletManager.chains.map((chain) => {
                        return (
                          <ChainRow
                            chain={chain}
                            wallet={wallet}
                            key={chain.chainId}
                          />
                        );
                      })}
                    </tbody>
                  </table>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button className="bg-blue-100 p-1 m-1" onClick={open}>
        open modal
      </button>
    </div>
  );
};

export default E2ETest;
