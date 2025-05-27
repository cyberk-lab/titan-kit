import { AssetList, Chain } from '@chain-registry/v2-types';
import { ThemeProvider } from '@interchain-ui/react';
import {
  BaseWallet,
  EndpointOptions,
  SignerOptions,
  WalletManager,
} from '@titan-kit/core';
// import type { UniversalProviderOpts } from '@walletconnect/universal-provider';
import React, { ReactElement, useEffect, useRef } from 'react';
import { createContext, useContext } from 'react';
import { StoreApi } from 'zustand';

import { ModalRenderer, TitanKitModal, WalletModalProps } from './modal';
import { createTitanKitStore, TitanStore } from './store';

type TitanKitWalletContextType = StoreApi<TitanStore>;

type TitanKitWalletProviderProps = {
  chains: Chain[];
  assetLists: AssetList[];
  wallets: BaseWallet[];
  signerOptions?: SignerOptions;
  endpointOptions?: EndpointOptions;
  children: React.ReactNode;
  walletModal?: (props: WalletModalProps) => ReactElement;
  // wcMetadata?: UniversalProviderOpts['metadata'];
};

const TitanKitContext = createContext<TitanKitWalletContextType | null>(null);

export const TitanKitProvider = ({
  chains,
  assetLists,
  wallets,
  signerOptions,
  endpointOptions,
  children,
  walletModal: ProviderWalletModal = TitanKitModal,
}: TitanKitWalletProviderProps) => {
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
    <ThemeProvider>
      <TitanKitContext.Provider value={store.current}>
        {children}
        <ModalRenderer walletModal={ProviderWalletModal} />
      </TitanKitContext.Provider>
    </ThemeProvider>
  );
};

export const useTitanKitContext = () => {
  const context = useContext(TitanKitContext);
  if (!context) {
    throw new Error(
      'useTitanKitContext must be used within a TitanKitProvider'
    );
  }
  return context;
};
