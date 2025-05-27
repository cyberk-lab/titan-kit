export type OS = 'android' | 'ios' | 'windows' | 'macos';
export type BrowserName = 'chrome' | 'firefox' | 'safari' | string;
export type DeviceType = 'desktop' | 'mobile';

export interface DappEnv {
  device?: DeviceType;
  os?: OS;
  browser?: BrowserName;
}

export type CosmosClientType = 'stargate' | 'cosmwasm';
export type SignType = 'amino' | 'direct';

export type ModalTheme = 'light' | 'dark';
