import { BaseWallet, ExtensionWallet, WCMobileWebWallet } from '../wallets';

export const isMobile = () => {
  const userAgent = navigator.userAgent || navigator.vendor;
  return /android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent);
};

export const isAndroid = () => {
  const userAgent = navigator.userAgent || navigator.vendor;
  return /android/i.test(userAgent);
};

export const isIOS = () => {
  const userAgent = navigator.userAgent || navigator.vendor;
  return /iPad|iPhone|iPod/.test(userAgent);
};

export type PlatformTypes = 'mobile-web' | 'web';

export type PlatformWalletMap = {
  'mobile-web': WCMobileWebWallet;
  web: ExtensionWallet;
};

export const selectWalletByPlatform = (
  walletPlatformMap: PlatformWalletMap
): BaseWallet => {
  if (isMobile()) {
    return walletPlatformMap['mobile-web'];
  }
  return walletPlatformMap['web'];
};
