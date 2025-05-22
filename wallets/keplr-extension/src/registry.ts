
import { Wallet } from '@titan-kit/core';
import { ICON } from './constant';

export const keplrExtensionInfo: Wallet = {
  windowKey: 'keplr',
  ethereumKey: 'keplr.ethereum',
  walletIdentifyKey: 'keplr.ethereum.isKeplr',
  name: 'keplr-extension',
  prettyName: 'Keplr',
  mode: 'extension',
  logo: ICON,
  keystoreChange: 'keplr_keystorechange',
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link: 'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en',
    },
    {
      device: 'desktop',
      browser: 'firefox',
      link: 'https://addons.mozilla.org/en-US/firefox/addon/keplr/',
    },
    {
      link: 'https://www.keplr.app/download',
    },
  ],
  walletconnect: {
    name: 'Keplr',
    projectId: '6adb6082c909901b9e7189af3a4a0223102cd6f8d5c39e39f3d49acb92b578bb'
  },
  walletConnectLink: {
    android: `intent://wcV2?{wc-uri}#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;`,
    // android: `keplrwallet://wcV2?{wc-uri}`,
    ios: `keplrwallet://wcV2?{wc-uri}`
  }
};
