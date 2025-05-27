import {
  ConnectModal,
  Wallet as InterchainUIWalletType,
} from '@interchain-ui/react';
import { DownloadInfo, WalletState } from '@titan-kit/core';
import { ReactElement, useMemo, useState } from 'react';

import { useWalletManager } from '../hooks';
import { ChainWalletState } from '../store';
import { StatefulWallet } from '../store/stateful-wallet';
import { transferToWalletUISchema } from '../utils';
import {
  ConnectedContent,
  ConnectedHeader,
  ConnectingContent,
  ConnectingHeader,
  ErrorContent,
  ErrorHeader,
  NotExistContent,
  NotExistHeader,
  QRCodeContent,
  QRCodeHeader,
  RejectContent,
  RejectHeader,
  WalletListContent,
  WalletListHeader,
} from './views';

export type TitanKitModalProps = {
  shouldShowList: boolean;
  isOpen: boolean;
  walletConnectQRCodeUri: string | null;
  wallets: InterchainUIWalletType[];
  username: string;
  address: string;
  currentWallet?: StatefulWallet;
  isConnecting: boolean;
  isConnected: boolean;
  isRejected: boolean;
  isDisconnected: boolean;
  isNotExist: boolean;
  errorMessage: string;
  open: () => void;
  close: () => void;
  disconnect: () => void;
  onSelectWallet: (wallet: StatefulWallet) => void;
  onBack: () => void;
  onReconnect: () => void;
  getDownloadLink: (walletName: string) => DownloadInfo;
  getEnv: () => { browser?: string; device?: string; os?: string };
};

export type WalletModalProps = {
  isOpen: boolean;
  wallets: StatefulWallet[];
  currentWallet?: StatefulWallet;
  open: () => void;
  close: () => void;
};

type ModalType =
  | 'wallet-list'
  | 'connecting'
  | 'connected'
  | 'reject'
  | 'not-exist'
  | 'qr-code';

export const TitanKitModal = () => {
  const [shouldShowList, setShouldShowList] = useState(false);

  const {
    modalIsOpen: isOpen,
    walletConnectQRCodeUri,
    wallets: statefulWallets,
    getChainWalletState,
    currentWalletName,
    currentChainName,
    openModal: open,
    closeModal: close,
    chains,
    setCurrentWalletName,
    getDownloadLink,
    getEnv,
  } = useWalletManager();

  const walletsForUI = statefulWallets.map((w) => transferToWalletUISchema(w));

  const chainNameToConnect = currentChainName || chains[0].chainName;

  const chainToConnect = chains.find(
    (chain) => chain.chainName === chainNameToConnect
  );

  const currentWallet = statefulWallets.find(
    (w) => w.info.name === currentWalletName
  );

  const { account, errorMessage } =
    getChainWalletState(currentWalletName, currentChainName) ||
    ({} as ChainWalletState);

  const disconnect = () => {
    currentWallet.disconnect(chainToConnect.chainId);
  };

  const onSelectWallet = (wallet: StatefulWallet) => {
    setShouldShowList(false);
    return wallet.connect(chainToConnect.chainId);
  };

  const onBack = () => setShouldShowList(true);

  const handleCloseModal = () => {
    close();
    setShouldShowList(false);
  };

  const onReconnect = () => {
    currentWallet.connect(chainToConnect.chainId);
  };
  return (
    <WalletModal
      shouldShowList={shouldShowList}
      username={account?.username}
      address={account?.address}
      disconnect={disconnect}
      isOpen={isOpen}
      open={open}
      close={handleCloseModal}
      wallets={walletsForUI}
      walletConnectQRCodeUri={walletConnectQRCodeUri}
      currentWallet={currentWallet}
      isConnecting={currentWallet?.walletState === WalletState.Connecting}
      isConnected={currentWallet?.walletState === WalletState.Connected}
      isRejected={currentWallet?.walletState === WalletState.Rejected}
      isDisconnected={currentWallet?.walletState === WalletState.Disconnected}
      isNotExist={currentWallet?.walletState === WalletState.NotExist}
      errorMessage={errorMessage}
      onSelectWallet={(w) => onSelectWallet(w)}
      onBack={() => setShouldShowList(true)} // Add other required props with appropriate default or mock values
      onReconnect={() => onSelectWallet(currentWallet)}
      getDownloadLink={() => getDownloadLink(currentWallet?.info.name)}
      getEnv={getEnv}
    />
  );
};

export const WalletModal = ({
  shouldShowList,
  isOpen,
  walletConnectQRCodeUri,
  wallets,
  username,
  address,
  currentWallet,
  isConnecting,
  isConnected,
  isRejected,
  isDisconnected,
  isNotExist,
  errorMessage,
  open,
  close,
  disconnect,
  onSelectWallet,
  onBack,
  onReconnect,
  getDownloadLink,
  getEnv,
}: TitanKitModalProps) => {
  const { header, content } = useMemo(() => {
    if (
      shouldShowList ||
      (isDisconnected && currentWallet.errorMessage === '')
    ) {
      return {
        header: <WalletListHeader close={close} />,
        content: (
          <WalletListContent
            onSelectWallet={onSelectWallet}
            wallets={wallets}
          />
        ),
      };
    }
    if (currentWallet && currentWallet.errorMessage) {
      return {
        header: (
          <ErrorHeader wallet={currentWallet} close={close} onBack={onBack} />
        ),
        content: <ErrorContent wallet={currentWallet} onBack={onBack} />,
      };
    }
    if (
      currentWallet &&
      walletConnectQRCodeUri &&
      currentWallet.info.name === 'WalletConnect'
    ) {
      return {
        header: (
          <QRCodeHeader wallet={currentWallet} close={close} onBack={onBack} />
        ),
        content: (
          <QRCodeContent
            walletConnectQRCodeUri={walletConnectQRCodeUri}
            errorMessage={errorMessage}
            onReconnect={onReconnect}
          />
        ),
      };
    }
    if (currentWallet && isNotExist) {
      return {
        header: (
          <NotExistHeader
            wallet={currentWallet}
            close={close}
            onBack={onBack}
          />
        ),
        content: (
          <NotExistContent
            wallet={currentWallet}
            getDownloadLink={getDownloadLink}
            getEnv={getEnv}
          />
        ),
      };
    }
    if (currentWallet && isRejected) {
      return {
        header: (
          <RejectHeader wallet={currentWallet} close={close} onBack={onBack} />
        ),
        content: (
          <RejectContent wallet={currentWallet} onReconnect={onReconnect} />
        ),
      };
    }
    if (currentWallet && isConnected) {
      return {
        header: (
          <ConnectedHeader
            wallet={currentWallet}
            onBack={onBack}
            close={close}
          />
        ),
        content: (
          <ConnectedContent
            wallet={currentWallet}
            username={username}
            address={address}
            disconnect={disconnect}
          />
        ),
      };
    }
    if (currentWallet && isConnecting) {
      return {
        header: (
          <ConnectingHeader
            wallet={currentWallet}
            close={close}
            onBack={onBack}
          />
        ),
        content: <ConnectingContent wallet={currentWallet} />,
      };
    }
    return {
      header: <WalletListHeader close={close} />,
      content: (
        <WalletListContent onSelectWallet={onSelectWallet} wallets={wallets} />
      ),
    };
  }, [
    currentWallet,
    isConnected,
    isConnecting,
    address,
    shouldShowList,
    walletConnectQRCodeUri,
    wallets,
  ]);

  return (
    <ConnectModal isOpen={isOpen} header={header} onOpen={open} onClose={close}>
      {content}
    </ConnectModal>
  );
};

export const ModalRenderer = ({
  walletModal: ProvidedWalletModal,
}: {
  walletModal: (props: WalletModalProps) => ReactElement;
}) => {
  if (!ProvidedWalletModal) {
    throw new Error(
      `TitanKitWalletProvider: walletModal is required. Please provide a wallet modal component. or use TitanKitWalletModal/n
      Example: <TitanKitProvider chains={chains} assetLists={assetLists} wallets={wallets} walletModal={TitanKitWalletModal} />`
    );
  }

  const { modalIsOpen, openModal, closeModal, wallets, currentWalletName } =
    useWalletManager();

  return (
    <ProvidedWalletModal
      wallets={wallets}
      isOpen={modalIsOpen}
      open={openModal}
      close={closeModal}
      currentWallet={wallets.find((w) => w.info.name === currentWalletName)}
    />
  );
};
