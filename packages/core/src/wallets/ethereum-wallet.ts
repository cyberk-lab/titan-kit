import { Chain } from '@chain-registry/v2-types';
import { IGenericOfflineSigner } from '@titanlabjs/types';

import { WalletAccount } from '../types';
import { EthereumNetwork } from '../types/ethereum';
import { delay, getClientFromExtension } from '../utils';
import { BaseWallet } from './base-wallet';

export class EthereumWallet extends BaseWallet {
  ethereum: any;

  isSwitchingNetwork: boolean = false;

  async init(): Promise<void> {
    try {
      this.ethereum = await getClientFromExtension(this.info.ethereumKey);
    } catch (error) {
      this.errorMessage = (error as any).message;
      throw error;
    }
  }
  async connect(chainId: Chain['chainId']): Promise<void> {
    let chainIdToHex = chainId.startsWith('0x')
      ? chainId
      : '0x' + parseInt(chainId, 10).toString(16);
    try {
      // const accounts = await this.ethereum.request({
      //   method: "eth_requestAccounts",
      //   params: [{ chainId }],
      // })
      // const chainIdd = await this.ethereum.request({
      //   method: "eth_chainId",
      //   params: [],
      // })
      await this.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdToHex }],
      });
    } catch (error) {
      if (!(error as any).message.includes('reject')) {
        await this.addSuggestChain(chainId as string);
      }
    }
  }
  async disconnect(chainId: Chain['chainId']): Promise<void> {
    // throw new Error("Method not implemented.");
    console.log('eth disconnect');
  }
  async switchChain(chainId: string): Promise<void> {
    if (!chainId.startsWith('0x')) {
      chainId = '0x' + parseInt(chainId, 10).toString(16);
    }
    if (this.isSwitchingNetwork) {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        await delay(10);
        if (!this.isSwitchingNetwork) {
          break;
        }
      }
    } else {
      try {
        this.isSwitchingNetwork = true;
        await this.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        });
      } catch (error) {
        //
      } finally {
        this.isSwitchingNetwork = false;
      }
    }
  }
  async getAccount(chainId: Chain['chainId']): Promise<WalletAccount> {
    await this.switchChain(chainId);
    const accounts = await this.ethereum.request({
      method: 'eth_requestAccounts',
      params: [{ chainId }],
    });

    return {
      address: accounts[0],
      pubkey: new Uint8Array(),
      algo: 'eth_secp256k1',
      isNanoLedger: false,
      isSmartContract: false,
      username: 'ethereum',
    };
  }
  async getOfflineSigner(
    chainId: Chain['chainId']
  ): Promise<IGenericOfflineSigner> {
    await this.switchChain(chainId);
    return {} as IGenericOfflineSigner;
  }
  async addSuggestChain(chainId: string): Promise<void> {
    const chainIdToHex = chainId.startsWith('0x')
      ? chainId
      : '0x' + parseInt(chainId, 10).toString(16);
    const chain = this.getChainById(chainId);
    const assetList = this.getAssetListByChainId(chainId);
    const network: EthereumNetwork = {
      chainId: chainIdToHex,
      chainName: chain.chainName,
      rpcUrls: chain.apis?.rpc.map((api) => api.address),
      nativeCurrency: {
        name: chain.chainName,
        symbol: assetList.assets[0].symbol,
        decimals: assetList.assets[0].denomUnits.find(
          (unit) => unit.denom === 'eth'
        ).exponent,
      },
      blockExplorerUrls: chain.explorers.map((explorer) => explorer.url),
    };
    try {
      await this.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [network],
      });
      console.log(`Network ${network.chainName} added successfully.`);
    } catch (error) {
      if ((error as any).message.includes('is not a function')) {
        return;
      }
      console.error(`Failed to add network: ${(error as any).message}`);
      throw error;
    }
  }
  async getProvider(chainId: string) {
    await this.switchChain(chainId);
    return this.ethereum;
  }

  async sendTransaction(transactionParameters: any) {
    // 发送交易请求
    const txHash = await this.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });

    console.log('transactionHash:', txHash);
    return txHash;
  }
}
