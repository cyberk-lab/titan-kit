import { AssetList, Chain } from '@chain-registry/v2-types';
import type { WalletState } from '@titan-kit/core';
import { HttpEndpoint } from '@titanlabjs/types';

import { StatefulWallet } from '../store/stateful-wallet';
import { SigningClient } from './sign-client';

export type CosmosKitUseChainReturnType = {
  connect: () => void;
  disconnect: () => void;
  openView: () => void;
  closeView: () => void;
  getRpcEndpoint: () => Promise<string | HttpEndpoint>;
  status: WalletState;
  username: string;
  message: string;
};

export type UseChainReturnType = {
  logoUrl: string | undefined;
  chain: Chain;
  assetList: AssetList;
  address: string;
  wallet: StatefulWallet;
  rpcEndpoint: string | HttpEndpoint | unknown;
  getSigningClient: () => Promise<SigningClient>;

  signingClient: SigningClient | null;
  isSigningClientLoading: boolean;
  signingClientError: Error | unknown | null;
} & CosmosKitUseChainReturnType;

export type UseChainWalletReturnType = Omit<
  UseChainReturnType,
  'openView' | 'closeView'
>;

export type UseInterchainClientReturnType = {
  signingClient: SigningClient | null;
  error: string | unknown | null;
  isLoading: boolean;
};
