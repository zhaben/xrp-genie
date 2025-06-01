export interface XRPLWallet {
  address: string;
  classicAddress?: string;
  seed?: string;
  privateKey?: string;
  publicKey?: string;
}

export interface TransactionResult {
  hash: string;
  success: boolean;
  error?: string;
}

export interface WalletBalance {
  xrp: string;
  tokens?: TokenBalance[];
}

export interface TokenBalance {
  currency: string;
  value: string;
  issuer: string;
}

export type WalletProvider = 'web3auth' | 'xaman' | 'faucet';

export interface XRPGenieConfig {
  provider: WalletProvider;
  network: 'testnet' | 'mainnet';
  rpcUrl?: string;
  web3auth?: {
    clientId: string;
    environment: 'sapphire_devnet' | 'sapphire_mainnet';
  };
  xaman?: {
    apiKey: string;
    apiSecret: string;
  };
}

export interface IWalletProvider {
  connect(): Promise<XRPLWallet>;
  disconnect(): Promise<void>;
  getBalance(address: string): Promise<WalletBalance>;
  sendXRP(to: string, amount: string): Promise<TransactionResult>;
  signMessage(message: string): Promise<string>;
  isConnected(): boolean;
  fundAccount?(): Promise<void>;
}