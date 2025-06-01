import { IWalletProvider, XRPGenieConfig } from './core/types';
import { Web3AuthProvider } from './providers/web3auth';
import { XamanProvider, XamanPayload } from './providers/xaman';
import { FaucetProvider } from './providers/faucet';

export class XRPGenie {
  private provider: IWalletProvider;
  private providerType: string;

  constructor(config: XRPGenieConfig) {
    this.provider = this.createProvider(config);
    this.providerType = config.provider;
  }

  private createProvider(config: XRPGenieConfig): IWalletProvider {
    switch (config.provider) {
      case 'web3auth':
        if (!config.web3auth?.clientId) {
          throw new Error('Web3Auth client ID is required');
        }
        return new Web3AuthProvider(
          config.web3auth.clientId,
          config.web3auth.environment,
          config.network
        );

      case 'xaman':
        if (!config.xaman?.apiKey || !config.xaman?.apiSecret) {
          throw new Error('Xaman API key and secret are required');
        }
        return new XamanProvider(
          config.xaman.apiKey,
          config.xaman.apiSecret,
          config.network
        );

      case 'faucet':
        return new FaucetProvider(config.network);

      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
  }

  // Delegate all methods to the underlying provider
  async connect() {
    return this.provider.connect();
  }

  async disconnect() {
    return this.provider.disconnect();
  }

  async getBalance(address: string) {
    return this.provider.getBalance(address);
  }

  async sendXRP(to: string, amount: string) {
    return this.provider.sendXRP(to, amount);
  }

  async signMessage(message: string) {
    return this.provider.signMessage(message);
  }

  isConnected() {
    return this.provider.isConnected();
  }

  async fundAccount() {
    if (this.provider.fundAccount) {
      return this.provider.fundAccount();
    }
    throw new Error('Fund account not supported by this provider');
  }

  // Get the underlying provider for advanced usage
  getProvider(): IWalletProvider {
    return this.provider;
  }

  // Xaman-specific methods
  async createSignInPayload(): Promise<XamanPayload> {
    if (this.providerType !== 'xaman') {
      throw new Error('createSignInPayload is only available for Xaman provider');
    }
    return (this.provider as XamanProvider).createSignInPayload();
  }

  async createPaymentPayload(destination: string, amount: string): Promise<XamanPayload> {
    if (this.providerType !== 'xaman') {
      throw new Error('createPaymentPayload is only available for Xaman provider');
    }
    return (this.provider as XamanProvider).createPaymentPayload(destination, amount);
  }

  async checkPayloadStatus(uuid: string) {
    if (this.providerType !== 'xaman') {
      throw new Error('checkPayloadStatus is only available for Xaman provider');
    }
    return (this.provider as XamanProvider).checkPayloadStatus(uuid);
  }

  getQRCode(payload: XamanPayload): string {
    if (this.providerType !== 'xaman') {
      throw new Error('getQRCode is only available for Xaman provider');
    }
    return (this.provider as XamanProvider).getQRCode(payload);
  }

  getDeepLink(payload: XamanPayload): string {
    if (this.providerType !== 'xaman') {
      throw new Error('getDeepLink is only available for Xaman provider');
    }
    return (this.provider as XamanProvider).getDeepLink(payload);
  }

  // Faucet-specific methods
  async createWallet() {
    if (this.providerType !== 'faucet') {
      throw new Error('createWallet is only available for Faucet provider');
    }
    return (this.provider as FaucetProvider).createWallet();
  }

  async connectExisting(seed: string) {
    if (this.providerType !== 'faucet') {
      throw new Error('connectExisting is only available for Faucet provider');
    }
    return (this.provider as FaucetProvider).connectExisting(seed);
  }

  getWalletSeed(): string | null {
    if (this.providerType !== 'faucet') {
      throw new Error('getWalletSeed is only available for Faucet provider');
    }
    return (this.provider as FaucetProvider).getWalletSeed();
  }

  getWalletPrivateKey(): string | null {
    if (this.providerType !== 'faucet') {
      throw new Error('getWalletPrivateKey is only available for Faucet provider');
    }
    return (this.provider as FaucetProvider).getWalletPrivateKey();
  }

  async getTransactionHistory(address: string, limit: number = 10) {
    if (this.providerType !== 'faucet') {
      throw new Error('getTransactionHistory is only available for Faucet provider');
    }
    return (this.provider as FaucetProvider).getTransactionHistory(address, limit);
  }

  getClient() {
    if (this.providerType !== 'faucet') {
      throw new Error('getClient is only available for Faucet provider');
    }
    return (this.provider as FaucetProvider).getClient();
  }

  // Static factory methods for convenience
  static web3auth(config: {
    clientId: string;
    environment?: 'sapphire_devnet' | 'sapphire_mainnet';
    network?: 'testnet' | 'mainnet';
  }) {
    return new XRPGenie({
      provider: 'web3auth',
      network: config.network || 'testnet',
      web3auth: {
        clientId: config.clientId,
        environment: config.environment || 'sapphire_devnet'
      }
    });
  }

  static xaman(config: {
    apiKey: string;
    apiSecret: string;
    network?: 'testnet' | 'mainnet';
  }) {
    return new XRPGenie({
      provider: 'xaman',
      network: config.network || 'testnet',
      xaman: {
        apiKey: config.apiKey,
        apiSecret: config.apiSecret
      }
    });
  }

  static faucet(config: {
    network?: 'testnet' | 'mainnet';
  } = {}) {
    return new XRPGenie({
      provider: 'faucet',
      network: config.network || 'testnet'
    });
  }
}