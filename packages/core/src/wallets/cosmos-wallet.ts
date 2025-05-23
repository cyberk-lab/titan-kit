import { chainRegistryChainToKeplr } from '@chain-registry/v2-keplr';
import { AminoGenericOfflineSigner, AminoSignResponse, DirectGenericOfflineSigner, DirectSignResponse, StdSignature } from '@titanlabjs/cosmos/types/wallet';
import { IGenericOfflineSigner, StdSignDoc } from '@titanlabjs/types';

import { BroadcastMode, DirectSignDoc, SignOptions, SignType, WalletAccount } from '../types';
import { getClientFromExtension } from '../utils';
import { BaseWallet } from './base-wallet';

export class CosmosWallet extends BaseWallet {

  defaultSignOptions = {
    preferNoSetFee: true,
    preferNoSetMemo: true,
    disableBalanceCheck: false,
  };

  setSignOptions(options: SignOptions) {
    this.defaultSignOptions = {
      ...this.defaultSignOptions,
      ...options,
    };
  }

  async init(): Promise<void> {
    try {
      this.client = await getClientFromExtension(this.info.windowKey);
    } catch (error) {
      this.errorMessage = (error as any).message;
      throw error;
    }
  }
  async connect(chainId: string): Promise<void> {
    try {
      await this.client.enable(chainId);
    } catch (error) {
      if ((error as any).message !== `Request rejected`) {
        await this.addSuggestChain(chainId);
      } else {
        throw error;
      }
    }
  }
  async disconnect(chainId: string): Promise<void> {
    this.client.disable?.(chainId);
    this.client.disconnect?.(chainId);
  }
  async getAccount(chainId: string): Promise<WalletAccount> {
    const key = await this.client.getKey(chainId);
    return {
      username: key.name,
      address: key.bech32Address,
      algo: key.algo,
      pubkey: key.pubKey,
      isNanoLedger: key.isNanoLedger,
    };
  }
  async getOfflineSigner(chainId: string, preferredSignType?: SignType) {
    const account = await this.getAccount(chainId);

    if (account.isNanoLedger) {
      return new AminoGenericOfflineSigner({
        getAccounts: async () => [account],
        signAmino: async (signer, signDoc) => {
          return this.signAmino(chainId, signer, signDoc, this.defaultSignOptions);
        }
      }) as IGenericOfflineSigner;
    }


    if (preferredSignType === 'amino') {
      return new AminoGenericOfflineSigner({
        getAccounts: async () => [await this.getAccount(chainId)],
        signAmino: async (signer, signDoc) => {
          return this.signAmino(chainId, signer, signDoc, this.defaultSignOptions);
        }
      }) as IGenericOfflineSigner;
    } else {
      return new DirectGenericOfflineSigner({
        getAccounts: async () => [await this.getAccount(chainId)],
        signDirect: async (signer, signDoc) => {
          return this.signDirect(chainId, signer, signDoc, this.defaultSignOptions);
        }
      }) as IGenericOfflineSigner;
    }
  }
  async signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions): Promise<AminoSignResponse> {
    return this.client.signAmino(chainId, signer, signDoc, signOptions);
  }
  async signArbitrary(chainId: string, signer: string, data: string | Uint8Array): Promise<StdSignature> {
    return this.client.signArbitrary(chainId, signer, data);
  }
  verifyArbitrary(chainId: string, signer: string, data: string | Uint8Array): Promise<boolean> {
    return this.client.verifyArbitrary(chainId, signer, data);
  }
  async signDirect(chainId: string, signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions): Promise<DirectSignResponse> {
    return this.client.signDirect(chainId, signer, signDoc, signOptions);
  }
  async sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode): Promise<Uint8Array> {
    return this.client.sendTx(chainId, tx, mode);
  }
  async addSuggestChain(chainId: string): Promise<void> {
    const chain = this.getChainById(chainId);
    const chainInfo = chainRegistryChainToKeplr(chain, this.assetLists);
    try {
      await this.client.experimentalSuggestChain(chainInfo);
    } catch (error) {
      console.log('add suggest chain error', error);
      throw error;
    }
  }
  async getProvider() {
    return this.client;
  }
}