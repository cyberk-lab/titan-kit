import { Chain } from '@chain-registry/v2-types';
import { SigningOptions as InterchainSigningOptions } from '@titanlabjs/cosmos/types/signing-client';
import { HttpEndpoint } from '@titanlabjs/types';

import { ChainName } from './chain';
import { SignType } from './common';

export interface SignerOptions {
  signing?: (chain: Chain | ChainName) => InterchainSigningOptions | undefined;
  preferredSignType?: (chain: Chain | ChainName) => SignType | undefined; // using `amino` if undefined
}

export interface Endpoints {
  rpc?: (string | HttpEndpoint)[];
  rest?: (string | HttpEndpoint)[];
}

export interface EndpointOptions {
  endpoints?: Record<ChainName, Endpoints>;
}

export enum WalletManagerState {
  Initializing = 'Initializing',
  Initialized = 'Initialized',
}
