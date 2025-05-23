export const clientNotExistError = new Error('Client not exist');

export class ChainNotExist extends Error {
  constructor(chainId: string) {
    super(`Chain ${chainId} not exist, please add it first`);
  }
}

export class ChainNameNotExist extends Error {
  constructor(chainName: string) {
    super(`Chain Name ${chainName} not exist, please add it first`);
  }
}

export class WalletNotExist extends Error {
  constructor(walletName: string) {
    super(`Wallet ${walletName} not Exist, please add it first`);
  }
}
export class NoWalletConnectedYet extends Error {
  constructor() {
    super('No wallet connected yet');
  }
}
export class NoGasPriceFound extends Error {
  constructor() {
    super('Gas price must be set in the client options when auto gas is used.');
  }
}

export class NoActiveWallet extends Error {
  constructor() {
    super('No active wallet');
  }
}

export class NoValidRpcEndpointFound extends Error {
  constructor() {
    super('No valid rpc endpoint found');
  }
}
