import { BaseWallet, WalletAccount } from '@titan-kit/core';
import { IGenericOfflineSigner } from '@titanlabjs/types';

import { ChainWallet } from '../../src/store/chain-wallet';

describe('ChainWallet', () => {
  let mockOriginalWallet: jest.Mocked<BaseWallet>;
  let chainWallet: ChainWallet<BaseWallet>;

  beforeEach(() => {
    mockOriginalWallet = {
      info: { name: 'Mock Wallet' },
      getProvider: jest.fn(),
      init: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
      getAccount: jest.fn(),
      getOfflineSigner: jest.fn(),
      addSuggestChain: jest.fn(),
    } as unknown as jest.Mocked<BaseWallet>;

    chainWallet = new ChainWallet(
      mockOriginalWallet,
      mockOriginalWallet.connect,
      mockOriginalWallet.disconnect,
      mockOriginalWallet.getAccount
    );
  });

  it('should initialize the wallet', async () => {
    await chainWallet.init();
    expect(mockOriginalWallet.init).toHaveBeenCalled();
  });

  it('should connect to a chain', async () => {
    const chainId = 'test-chain';
    await chainWallet.connect(chainId);
    expect(mockOriginalWallet.connect).toHaveBeenCalledWith(chainId);
  });

  it('should disconnect from a chain', async () => {
    const chainId = 'test-chain';
    await chainWallet.disconnect(chainId);
    expect(mockOriginalWallet.disconnect).toHaveBeenCalledWith(chainId);
  });

  it('should get an account for a chain', async () => {
    const chainId = 'test-chain';
    const mockAccount: WalletAccount = {
      address: 'test-address',
      algo: 'secp256k1',
      pubkey: new Uint8Array(),
    };
    mockOriginalWallet.getAccount.mockResolvedValue(mockAccount);

    const account = await chainWallet.getAccount(chainId);
    expect(mockOriginalWallet.getAccount).toHaveBeenCalledWith(chainId);
    expect(account).toEqual(mockAccount);
  });

  it('should get an offline signer for a chain', async () => {
    const chainId = 'test-chain';
    const mockSigner: IGenericOfflineSigner = {} as IGenericOfflineSigner;
    mockOriginalWallet.getOfflineSigner.mockResolvedValue(mockSigner);

    const signer = await chainWallet.getOfflineSigner(chainId);
    expect(mockOriginalWallet.getOfflineSigner).toHaveBeenCalledWith(chainId);
    expect(signer).toEqual(mockSigner);
  });

  it('should add a suggested chain', async () => {
    const chainId = 'test-chain';
    await chainWallet.addSuggestChain(chainId);
    expect(mockOriginalWallet.addSuggestChain).toHaveBeenCalledWith(chainId);
  });

  it('should get a provider for a chain', async () => {
    const chainId = 'test-chain';
    const mockProvider = {};
    mockOriginalWallet.getProvider.mockResolvedValue(mockProvider);

    const provider = await chainWallet.getProvider(chainId);
    expect(mockOriginalWallet.getProvider).toHaveBeenCalledWith(chainId);
    expect(provider).toEqual(mockProvider);
  });
});
