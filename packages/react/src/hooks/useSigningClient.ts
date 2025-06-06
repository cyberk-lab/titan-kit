import { WalletState } from '@titan-kit/core';

import { useAsync } from './useAsync';
import { useWalletManager } from './useWalletManager';

export const useSigningClient = (chainName: string, walletName: string) => {
  const { getSigningClient, getChainWalletState, getRpcEndpoint } =
    useWalletManager();

  const chainWalletState = getChainWalletState(walletName, chainName);

  const { data, isLoading, error } = useAsync({
    queryKey: `signing-client-${chainName}-${walletName}`,
    queryFn: async () => {
      await getRpcEndpoint(walletName, chainName);
      const currentWalletState = getChainWalletState(
        walletName,
        chainName
      )?.walletState;
      if (currentWalletState === WalletState.Connected) {
        return getSigningClient(walletName, chainName);
      }
    },
    enabled: chainWalletState?.walletState === WalletState.Connected,
    disableCache: true,
  });

  return {
    signingClient: data,
    error,
    isLoading,
  };
};
