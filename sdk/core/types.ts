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

export interface WalletMode {
  type: 'faucet' | 'xaman' | 'web3auth';
  config?: any;
}

export interface XRPGenieConfig {
  mode: WalletMode;
  network: 'testnet' | 'mainnet';
  rpcUrl?: string;
}

export interface WalletProvider {
  connect(): Promise<XRPLWallet>;
  disconnect(): Promise<void>;
  getBalance(address: string): Promise<WalletBalance>;
  sendTransaction(to: string, amount: string): Promise<TransactionResult>;
  isConnected(): boolean;
}