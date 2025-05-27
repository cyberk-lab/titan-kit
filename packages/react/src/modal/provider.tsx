import { createContext, useContext, useEffect, useRef, useState } from "react";

import { WalletState } from "@titan-kit/core";
import { useChainWallet, useWalletManager } from "../hooks";
import { Wallet as InterchainUIWalletType } from "@interchain-ui/react";
import { transferToWalletUISchema } from "../utils";
import { InterchainWalletModal } from "./modal";

type WalletModalContextType = {
  modalIsOpen: boolean;
  open: () => void;
  close: () => void;
};

const WalletModalContext = createContext<WalletModalContextType | null>(null);

export const WalletModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const open = () => setModalIsOpen(true);
  const close = () => setModalIsOpen(false);

  const {
    chains,
    wallets,
    setCurrentWalletName,
    currentChainName,
    currentWalletName,
    walletConnectQRCodeUri,
    getDownloadLink,
    getEnv,
    connect,
    getAccount,
  } = useWalletManager();

  const { wallet, status, disconnect, username, address, message } =
    useChainWallet(currentChainName || chains[0].chainName, currentWalletName);

  const [shouldShowList, setShouldShowList] = useState(
    !(currentChainName && currentWalletName)
  );

  const walletsForUI: InterchainUIWalletType[] = wallets.map(
    transferToWalletUISchema
  );

  const handleCloseModal = () => {
    close();
    setShouldShowList(false);
  };

  const currentChainNameRef = useRef("");

  useEffect(() => {
    currentChainNameRef.current = currentChainName;
  }, [currentChainName]);

  const handleConnectWallet = async (walletName: string) => {
    const chainToConnect = currentChainNameRef.current || chains[0].chainName;
    setShouldShowList(false);
    setCurrentWalletName(walletName);
    await connect(walletName, chainToConnect);
  };

  return (
    <WalletModalContext.Provider value={{ modalIsOpen, open, close }}>
      {children}
      <InterchainWalletModal
        shouldShowList={shouldShowList}
        username={username}
        address={address}
        disconnect={disconnect}
        isOpen={modalIsOpen}
        open={open}
        close={handleCloseModal}
        wallets={walletsForUI}
        walletConnectQRCodeUri={walletConnectQRCodeUri}
        currentWallet={wallet}
        isConnecting={status === WalletState.Connecting}
        isConnected={status === WalletState.Connected}
        isRejected={status === WalletState.Rejected}
        isDisconnected={status === WalletState.Disconnected}
        isNotExist={status === WalletState.NotExist}
        errorMessage={message}
        onSelectWallet={(w) => handleConnectWallet(w.info.name)}
        onBack={() => setShouldShowList(true)} // Add other required props with appropriate default or mock values
        onReconnect={() => handleConnectWallet(currentWalletName)}
        getDownloadLink={() => getDownloadLink(wallet?.info.name)}
        getEnv={getEnv}
      />
    </WalletModalContext.Provider>
  );
};

export const useWalletModal = () => {
  const context = useContext(WalletModalContext);
  if (!context) {
    throw new Error("useWalletModal must be used within a WalletModalProvider");
  }
  return context;
};
