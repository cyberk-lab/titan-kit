import { AssetList, Chain } from '@chain-registry/v2-types';
import {
  BaseWallet,
  EndpointOptions,
  SignerOptions,
  WalletManager,
} from '@titan-kit/core';
import React, { ReactElement, useEffect, useRef } from 'react';
import { createContext, useContext } from 'react';
import { StoreApi } from 'zustand';

import { ModalRenderer, WalletModalProps } from '../modal';
import { createTitanKitStore, TitanStore } from '../store';

type InterchainWalletContextType = StoreApi<TitanStore>;

type InterchainWalletProviderProps = {
  chains: Chain[];
  assetLists: AssetList[];
  wallets: BaseWallet[];
  signerOptions?: SignerOptions;
  endpointOptions?: EndpointOptions;
  children: React.ReactNode;
  walletModal: (props: WalletModalProps) => ReactElement;
};

const InterchainWalletContext =
  createContext<InterchainWalletContextType | null>(null);

export const ChainProvider = ({
  chains,
  assetLists,
  wallets,
  signerOptions,
  endpointOptions,
  children,
  walletModal: ProviderWalletModal,
}: InterchainWalletProviderProps) => {
  // const [_, forceRender] = useState({});

  const walletManager = new WalletManager(
    chains,
    assetLists,
    wallets,
    signerOptions,
    endpointOptions
  );

  const store = useRef(createTitanKitStore(walletManager));

  useEffect(() => {
    // walletManager.init();
    store.current.getState().init();
  }, []);

  return (
    <InterchainWalletContext.Provider value={store.current}>
      {children}
      <ModalRenderer walletModal={ProviderWalletModal} />
    </InterchainWalletContext.Provider>
  );
};

export const useInterchainWalletContext = () => {
  const context = useContext(InterchainWalletContext);
  if (!context) {
    throw new Error(
      'useInterChainWalletContext must be used within a InterChainProvider'
    );
  }
  return context;
};
