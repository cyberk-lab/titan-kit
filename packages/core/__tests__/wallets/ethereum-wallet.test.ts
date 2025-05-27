import { EthereumWallet } from '../../src/wallets/ethereum-wallet';
import { Chain } from "@chain-registry/v2-types";
const mockGetClientFromExtension = require('../../src/utils').getClientFromExtension;
import { chain as etherChain, assetList as etherAssetList } from '@chain-registry/v2/mainnet/ethereum';

jest.mock('../../src/utils', () => ({
    getClientFromExtension: jest.fn(),
    delay: jest.fn(),
}));


describe('EthereumWallet', () => {
    let wallet: EthereumWallet;

    beforeEach(() => {
        wallet = new EthereumWallet({
            ethereumKey: 'mockEthereumKey',
        } as any);
        mockGetClientFromExtension.mockResolvedValue({
            request: jest.fn(),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('init', () => {
        it('should initialize the wallet by getting the Ethereum client', async () => {
            await wallet.init();
            expect(mockGetClientFromExtension).toHaveBeenCalledWith('mockEthereumKey');
            expect(wallet.ethereum).toBeDefined();
        });

        it('should throw an error if initialization fails', async () => {
            mockGetClientFromExtension.mockRejectedValue(new Error('Initialization failed'));
            await expect(wallet.init()).rejects.toThrow('Initialization failed');
        });
    });

    describe('connect', () => {
        it('should switch to the specified chain', async () => {
            const mockRequest = jest.fn();
            wallet.ethereum = { request: mockRequest };
            await wallet.connect('0x1');
            expect(mockRequest).toHaveBeenCalledWith({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x1' }],
            });
        });

        it('should call addSuggestChain if chain ID is unrecognized', async () => {
            const mockRequest = jest.fn().mockRejectedValue(new Error('Unrecognized chain ID'));
            const mockAddSuggestChain = jest.spyOn(wallet, 'addSuggestChain').mockResolvedValue();
            wallet.ethereum = { request: mockRequest };
            await wallet.connect('0x1');
            expect(mockAddSuggestChain).toHaveBeenCalledWith('0x1');
        });
    });

    describe('disconnect', () => {
        it('should log a disconnect message', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            await wallet.disconnect('0x1');
            expect(consoleSpy).toHaveBeenCalledWith('eth disconnect');
            consoleSpy.mockRestore();
        });
    });

    describe('switchChain', () => {
        it('should switch to the specified chain', async () => {
            const mockRequest = jest.fn();
            wallet.ethereum = { request: mockRequest };
            await wallet.switchChain('0x1');
            expect(mockRequest).toHaveBeenCalledWith({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x1' }],
            });
        });

        it('should wait if a network switch is already in progress', async () => {
            jest.useFakeTimers();
            wallet.isSwitchingNetwork = true;
            const switchChainPromise = wallet.switchChain('0x1');
            jest.advanceTimersByTime(10);
            wallet.isSwitchingNetwork = false;
            await switchChainPromise;
            jest.useRealTimers();
        });
    });

    describe('getAccount', () => {
        it('should return the account details', async () => {
            const mockRequest = jest.fn().mockResolvedValue(['0x123']);
            wallet.ethereum = { request: mockRequest };
            const account = await wallet.getAccount('0x1');
            expect(account).toEqual({
                address: '0x123',
                pubkey: new Uint8Array(),
                algo: 'eth_secp256k1',
                isNanoLedger: false,
                isSmartContract: false,
                username: 'ethereum',
            });
        });
    });

    describe('addSuggestChain', () => {
        it('should add a suggested chain to the wallet', async () => {
            const mockRequest = jest.fn();
            wallet.ethereum = { request: mockRequest };
            wallet.setChainMap([etherChain])
            wallet.assetLists = [etherAssetList];
            await wallet.addSuggestChain('1');
            // expect(mockRequest).toHaveBeenCalledWith({
            //     method: 'wallet_addEthereumChain',
            //     params: [
            //         {
            //             chainId: '0x1',
            //             chainName: 'Ethereum',
            //             rpcUrls: ['https://rpc.ethereum.org'],
            //             nativeCurrency: {
            //                 name: 'Ethereum',
            //                 symbol: 'ETH',
            //                 decimals: 18,
            //             },
            //             blockExplorerUrls: ['https://etherscan.io'],
            //         },
            //     ],
            // });
        });
    });

    describe('getProvider', () => {
        it('should return the Ethereum provider', async () => {
            wallet.ethereum = { mockProvider: true };
            expect(await wallet.getProvider('0x1')).toEqual({ mockProvider: true });
        });
    });
});