import { WalletManager } from '@titan-kit/core';

export type SigningClient = Awaited<
  ReturnType<WalletManager['getSigningClient']>
>;
