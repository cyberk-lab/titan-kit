import { WCWallet } from '../src/wallets/wc-wallet';
import { UniversalProvider } from '@walletconnect/universal-provider';
import { WalletAccount, SignType } from '../src/types';
import { Chain } from '@chain-registry/v2-types';

jest.mock('@walletconnect/universal-provider');

describe('WCWallet', () => {
    let wallet: WCWallet;

    beforeEach(() => {
        wallet = new WCWallet();

        wallet.setChainMap([
            {
                chainName: 'test-chain-id',
                chainType: 'cosmos',
                chainId: 'test-chain-id',
                rpc: ['https://test-rpc.com'],
                rest: ['https://test-rest.com'],
                bech32Config: {
                    bech32PrefixAccAddr: 'test',
                    bech32PrefixAccPub: 'testpub',
                    bech32PrefixValAddr: 'testval',
                    bech32PrefixValPub: 'testvalpub',
                    bech32PrefixConsAddr: 'testcons',
                    bech32PrefixConsPub: 'testconspub',
                },
                currencies: [
                    {
                        coinDenom: 'atom',
                        coinMinimalDenom: 'uatom',
                        coinDecimals: 6,
                        coinGeckoId: 'cosmos',
                    },
                ],
            } as Chain,
        ])
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize the wallet', async () => {
        const mockInit = jest.fn();
        (UniversalProvider.init as jest.Mock).mockResolvedValue({
            on: jest.fn(),
            disconnect: jest.fn(),
        });

        await wallet.init();

        expect(UniversalProvider.init).toHaveBeenCalled();
        expect(mockInit).not.toThrow();
    });

    it('should set pairing URI callback', () => {
        const mockCallback = jest.fn();
        wallet.setOnPairingUriCreatedCallback(mockCallback);

        expect(wallet.onPairingUriCreated).toBe(mockCallback);
    });

    it('should connect to the provider', async () => {
        const mockConnect = jest.fn();
        (UniversalProvider.init as jest.Mock).mockResolvedValue({
            connect: mockConnect,
            on: jest.fn(),
            projectId: '15a12f05b38b78014b2bb06d77eecdc3',
            relayUrl: 'wss://relay.walletconnect.org',
            metadata: {
                name: 'Example Dapp',
                description: 'Example Dapp',
                url: 'https://example.com',
                icons: ['https://example.com/icon.png'],
            },
        });

        await wallet.init();
        await wallet.connect('test-chain-id');

        expect(mockConnect).toHaveBeenCalled();
    });

    it('should disconnect from the provider', async () => {
        const mockDisconnect = jest.fn();
        (UniversalProvider.init as jest.Mock).mockResolvedValue({
            disconnect: mockDisconnect,
            on: jest.fn(),
        });

        await wallet.init();
        await wallet.disconnect();

        expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should get accounts from the session', async () => {
        wallet.session = {
            namespaces: {
                cosmos: {
                    accounts: ['cosmos:test-chain-id:test-address'],
                },
            },
        } as any;

        const accounts = await wallet.getAccounts();

        expect(accounts).toEqual([
            {
                address: 'test-address',
                algo: 'secp256k1',
                pubkey: null,
                username: '',
                isNanoLedger: null,
                isSmartContract: null,
            },
        ]);
    });

    it('should get a specific account by chain ID', async () => {
        wallet.getChainById = jest.fn().mockReturnValue({ chainType: 'cosmos' });
        wallet.provider = {
            session: {
                namespaces: {
                    cosmos: {
                        accounts: ['cosmos:test-chain-id:test-address'],
                    },
                },
            },
        } as any;

        wallet.getCosmosAccount = jest.fn().mockResolvedValue({
            address: 'test-address',
            algo: 'secp256k1',
            pubkey: "ZmF3ZWZhdw==",
        })

        const account = await wallet.getAccount('test-chain-id');

        expect(account).toEqual({
            address: 'test-address',
            algo: 'secp256k1',
            pubkey: new Uint8Array([
                102,
                97,
                119,
                101,
                102,
                97,
                119,
            ]),
            username: '',
            isNanoLedger: null,
            isSmartContract: null,
        });
    });

    it('should get a cosmos account', async () => {
        const mockRequest = jest.fn().mockResolvedValue([
            { address: 'test-address', algo: 'secp256k1', pubkey: 'test-pubkey' },
        ]);
        wallet.provider = {
            request: mockRequest,
        } as any;

        const account = await wallet.getCosmosAccount('test-chain-id');

        expect(mockRequest).toHaveBeenCalledWith(
            { method: 'cosmos_getAccounts', params: [] },
            'cosmos:test-chain-id'
        );
        expect(account).toEqual({
            address: 'test-address',
            algo: 'secp256k1',
            pubkey: 'test-pubkey',
        });
    });

    it('should return an offline signer for amino', async () => {
        const mockGetAccount = jest.fn().mockResolvedValue({
            address: 'test-address',
            algo: 'secp256k1',
            pubkey: null,
        });
        wallet.getAccount = mockGetAccount;

        const offlineSigner = await wallet.getOfflineSigner('test-chain-id', 'amino');

        expect(offlineSigner).toBeDefined();
        const aminoSinger = await offlineSigner?.getAccounts()
        expect(aminoSinger).toEqual([
            {
                address: 'test-address',
                algo: 'secp256k1',
                pubkey: null,
            },
        ]);
        expect(mockGetAccount).toHaveBeenCalledWith('test-chain-id');
    });

    it('should return an offline signer for direct', async () => {
        const mockGetAccount = jest.fn().mockResolvedValue({
            address: 'test-address',
            algo: 'secp256k1',
            pubkey: null,
        });
        wallet.getAccount = mockGetAccount;

        const offlineSigner = await wallet.getOfflineSigner('test-chain-id', 'direct');

        expect(offlineSigner).toBeDefined();
        const directSigner = await offlineSigner?.getAccounts()
        expect(directSigner).toEqual([
            {
                address: 'test-address',
                algo: 'secp256k1',
                pubkey: null,
            }])
        expect(mockGetAccount).toHaveBeenCalledWith('test-chain-id');
    });

    it('should handle signAmino requests', async () => {
        const mockRequest = jest.fn().mockResolvedValue({ signed: 'signed-doc' });
        wallet.provider = {
            request: mockRequest,
        } as any;

        const result = await wallet.signAmino('test-chain-id', 'test-signer', {} as any);

        expect(mockRequest).toHaveBeenCalledWith(
            {
                method: 'cosmos_signAmino',
                params: { signerAddress: 'test-signer', signDoc: {} },
            },
            'cosmos:test-chain-id'
        );
        expect(result).toEqual({ signed: 'signed-doc' });
    });

    it('should handle signDirect requests', async () => {
        const mockRequest = jest.fn().mockResolvedValue({ signed: 'signed-doc' });
        wallet.provider = {
            request: mockRequest,
        } as any;

        const result = await wallet.signDirect('test-chain-id', 'test-signer', {
            chainId: 'test-chain-id',
            bodyBytes: new Uint8Array(),
            authInfoBytes: new Uint8Array(),
            accountNumber: 1n,
        });

        expect(mockRequest).toHaveBeenCalled();
        expect(result).toEqual({ signed: 'signed-doc' });
    });

    it('should ping the provider', async () => {
        const mockPing = jest.fn().mockResolvedValue('success');
        wallet.provider = {
            client: {
                ping: mockPing,
            },
        } as any;
        wallet.session = { topic: 'test-topic' } as any;

        const result = await wallet.ping();

        expect(mockPing).toHaveBeenCalledWith({ topic: 'test-topic' });
        expect(result).toBe('success');
    });
});