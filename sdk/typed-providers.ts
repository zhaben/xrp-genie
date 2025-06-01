import { XRPGenie } from './xrp-genie';
import { XamanPayload } from './providers/xaman';

// Typed interfaces for better developer experience

export interface XRPGenieWeb3Auth extends XRPGenie {
  // Web3Auth specific methods would go here if any
}

export interface XRPGenieXaman extends XRPGenie {
  createSignInPayload(): Promise<XamanPayload>;
  createPaymentPayload(destination: string, amount: string): Promise<XamanPayload>;
  checkPayloadStatus(uuid: string): Promise<any>;
  getQRCode(payload: XamanPayload): string;
  getDeepLink(payload: XamanPayload): string;
}

export interface XRPGenieFaucet extends XRPGenie {
  createWallet(): Promise<any>;
  connectExisting(seed: string): Promise<any>;
  getWalletSeed(): string | null;
  getWalletPrivateKey(): string | null;
  getTransactionHistory(address: string, limit?: number): Promise<any[]>;
  getClient(): any;
}

// Typed factory methods
export class TypedXRPGenie {
  static web3auth(config: {
    clientId: string;
    environment?: 'sapphire_devnet' | 'sapphire_mainnet';
    network?: 'testnet' | 'mainnet';
  }): XRPGenieWeb3Auth {
    return XRPGenie.web3auth(config) as XRPGenieWeb3Auth;
  }

  static xaman(config: {
    apiKey: string;
    apiSecret: string;
    network?: 'testnet' | 'mainnet';
  }): XRPGenieXaman {
    return XRPGenie.xaman(config) as XRPGenieXaman;
  }

  static faucet(config: {
    network?: 'testnet' | 'mainnet';
  } = {}): XRPGenieFaucet {
    return XRPGenie.faucet(config) as XRPGenieFaucet;
  }
}