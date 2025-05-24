import { UseChainWalletReturnType } from '../types/chain';
import { useSigningClient } from './useSigningClient';
import { useWalletManager } from './useWalletManager';

export const useChainWallet = (chainName: string, walletName: string): UseChainWalletReturnType => {
  const { assetLists, disconnect, setCurrentChainName, setCurrentWalletName, getChainByName, getWalletByName, getChainWalletState, getChainLogoUrl, connect, getSigningClient, getRpcEndpoint, getAccount, getStatefulWalletByName } = useWalletManager();

  const chain = getChainByName(chainName);

  const wallet = getStatefulWalletByName(walletName);

  const assetList = assetLists.find(a => a.chainName === chainName);

  const chainWalletStateToShow = getChainWalletState(walletName, chainName);

  const { signingClient, isLoading: isSigningClientLoading, error: signingClientError } = useSigningClient(chainName, walletName);

  return {
    //for migration cosmos kit
    connect: async () => {
      setCurrentWalletName(walletName);
      setCurrentChainName(chainName);
      await connect(walletName, chainName);
    },
    disconnect: () => disconnect(walletName, chainName),
    getRpcEndpoint: () => getRpcEndpoint(walletName, chainName),
    status: chainWalletStateToShow?.walletState,
    username: chainWalletStateToShow?.account?.username,
    message: chainWalletStateToShow?.errorMessage,

    // new api
    logoUrl: getChainLogoUrl(chainName),
    chain,
    assetList,
    address: chainWalletStateToShow?.account?.address,
    wallet,

    getSigningClient: () => getSigningClient(walletName, chainName),

    signingClient,
    isSigningClientLoading,
    signingClientError,

    rpcEndpoint: chainWalletStateToShow?.rpcEndpoint,
  };
};