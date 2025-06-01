import { Client, Wallet, dropsToXrp, xrpToDrops } from "xrpl";
import { IWalletProvider, XRPLWallet, WalletBalance, TransactionResult } from "../core/types";

export class FaucetProvider implements IWalletProvider {
  private client: Client;
  private wallet: Wallet | null = null;
  private isClientConnected = false;

  constructor(private network: 'testnet' | 'mainnet' = 'testnet') {
    const rpcUrl = network === 'mainnet' 
      ? 'wss://xrplcluster.com'
      : 'wss://s.altnet.rippletest.net:51233';
    
    this.client = new Client(rpcUrl);
  }

  private async ensureConnected() {
    if (!this.isClientConnected) {
      await this.client.connect();
      this.isClientConnected = true;
    }
  }

  async connect(): Promise<XRPLWallet> {
    await this.ensureConnected();
    
    if (this.network !== 'testnet') {
      throw new Error('Faucet provider only supports testnet');
    }

    // Fund a new wallet from the testnet faucet
    const { wallet } = await this.client.fundWallet();
    this.wallet = wallet;

    return {
      address: wallet.address,
      classicAddress: wallet.classicAddress,
      seed: wallet.seed,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey
    };
  }

  async connectExisting(seed: string): Promise<XRPLWallet> {
    await this.ensureConnected();
    
    this.wallet = Wallet.fromSeed(seed);

    return {
      address: this.wallet.address,
      classicAddress: this.wallet.classicAddress,
      seed: this.wallet.seed,
      privateKey: this.wallet.privateKey,
      publicKey: this.wallet.publicKey
    };
  }

  async disconnect(): Promise<void> {
    this.wallet = null;
    
    if (this.isClientConnected) {
      await this.client.disconnect();
      this.isClientConnected = false;
    }
  }

  async getBalance(address: string): Promise<WalletBalance> {
    await this.ensureConnected();

    try {
      const response = await this.client.request({
        command: "account_info",
        account: address
      });

      return {
        xrp: dropsToXrp(response.result.account_data.Balance).toString()
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('actNotFound')) {
        return { xrp: '0' };
      }
      throw new Error(`Failed to get balance: ${error}`);
    }
  }

  async sendXRP(to: string, amount: string): Promise<TransactionResult> {
    if (!this.wallet) {
      throw new Error('Wallet not connected');
    }

    await this.ensureConnected();

    try {
      const payment = {
        TransactionType: 'Payment' as const,
        Account: this.wallet.address,
        Destination: to,
        Amount: xrpToDrops(amount)
      };

      const prepared = await this.client.autofill(payment);
      const signed = this.wallet.sign(prepared);
      const result = await this.client.submitAndWait(signed.tx_blob);

      return {
        hash: result.result.hash,
        success: typeof result.result.meta === 'object' && result.result.meta !== null && 'TransactionResult' in result.result.meta 
          ? result.result.meta.TransactionResult === 'tesSUCCESS'
          : false
      };
    } catch (error) {
      return {
        hash: '',
        success: false,
        error: error instanceof Error ? error.message : 'Transaction failed'
      };
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet not connected');
    }

    // Create a simple signature using the wallet's private key
    // Note: This is a basic implementation - in production you'd want proper message signing
    const messageHex = Buffer.from(message, 'utf8').toString('hex');
    const signature = this.wallet.sign({
      TransactionType: 'AccountSet',
      Account: this.wallet.address,
      Memos: [{
        Memo: {
          MemoData: messageHex
        }
      }]
    } as any);

    return signature.tx_blob;
  }

  isConnected(): boolean {
    return this.wallet !== null;
  }

  async fundAccount(): Promise<void> {
    if (!this.wallet) {
      throw new Error('Wallet not connected');
    }

    if (this.network !== 'testnet') {
      throw new Error('Funding only available on testnet');
    }

    await this.ensureConnected();

    // Use the XRPL client's built-in funding mechanism
    try {
      await this.client.fundWallet(this.wallet);
    } catch (error) {
      throw new Error(`Failed to fund account: ${error}`);
    }
  }

  async getTransactionHistory(address: string, limit: number = 10): Promise<any[]> {
    await this.ensureConnected();

    try {
      const response = await this.client.request({
        command: "account_tx",
        account: address,
        limit
      });

      return response.result.transactions || [];
    } catch (error) {
      throw new Error(`Failed to get transaction history: ${error}`);
    }
  }

  // Faucet-specific methods
  async createWallet(): Promise<XRPLWallet> {
    return this.connect(); // Same as connect for faucet provider
  }

  getWalletSeed(): string | null {
    return this.wallet?.seed || null;
  }

  getWalletPrivateKey(): string | null {
    return this.wallet?.privateKey || null;
  }

  getClient(): Client {
    return this.client;
  }
}