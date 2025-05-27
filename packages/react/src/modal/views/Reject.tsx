import { ConnectModalHead, ConnectModalStatus } from "@interchain-ui/react";
import { useWalletModal } from "../provider";
import { useWalletManager } from "../../hooks";
import { getWalletInfo } from "../../utils";
import { BaseWallet } from "@titan-kit/core";

export const RejectHeader = ({
  wallet,
  close,
  onBack,
}: {
  wallet: BaseWallet;
  close: () => void;
  onBack: () => void;
}) => {
  return (
    <ConnectModalHead
      title={wallet?.info?.prettyName}
      hasBackButton={true}
      onClose={close}
      onBack={onBack}
      closeButtonProps={{ onClick: close }}
    />
  );
};

export const RejectContent = ({
  wallet,
  onReconnect,
}: {
  wallet: BaseWallet;
  onReconnect: () => void;
}) => {
  return (
    <ConnectModalStatus
      status="Rejected"
      wallet={getWalletInfo(wallet)}
      contentHeader={"Request Rejected"}
      contentDesc={wallet.errorMessage || "Connection permission is denied."}
      onConnect={onReconnect}
    />
  );
};
