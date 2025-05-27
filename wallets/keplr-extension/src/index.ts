import { CosmosWallet, EthereumWallet, ExtensionWallet, PlatformWallet, selectWalletByPlatform, SignOptions, WCMobileWebWallet } from "@titan-kit/core";
import { keplrExtensionInfo } from "./registry";

export * from './registry'

const web = new ExtensionWallet(keplrExtensionInfo)
web.setNetworkWallet('cosmos', new CosmosWallet(keplrExtensionInfo))
web.setNetworkWallet('eip155', new EthereumWallet(keplrExtensionInfo))

const keplrWallet = selectWalletByPlatform({
  'mobile-web': new WCMobileWebWallet(keplrExtensionInfo),
  'web': web
})

export { keplrWallet }