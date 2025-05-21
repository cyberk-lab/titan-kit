import { BaseWallet, isInstanceOf, WCWallet } from "@titan-kit/core";

export const getWalletInfo = (wallet: BaseWallet) => {
  return {
    name: wallet?.info?.name,
    prettyName: wallet?.info?.prettyName,
    logo: wallet?.info?.logo as string,
    mobileDisabled: true,
  };
};

export const transferToWalletUISchema = (w: BaseWallet) => {
  if (w.info.mode === "wallet-connect") {
    const wc = w as unknown as WCWallet;
    if (wc.session) {
      return {
        name: wc.session?.peer.metadata?.name,
        prettyName: `${wc.session?.peer.metadata?.name} - Mobile`,
        logo: wc.session?.peer.metadata?.icons?.[0],
        mobileDisabled: true,
        shape: "list" as "list",
        originalWallet: { ...w, session: wc.session },
        subLogo: w.info.logo as string,
      };
    }
  }
  return {
    name: w.info.name,
    prettyName: w.info.prettyName,
    logo: w.info.logo as string,
    mobileDisabled: true,
    shape: "list" as "list",
    originalWallet: w,
  };
};
