import { Client, Wallet, dropsToXrp, xrpToDrops } from 'xrpl';
import { WalletBalance, TransactionResult } from './types';

export class XRPLClient {
  private client: Client;
  private isConnected = false;

  constructor(serverUrl: string = 'wss://s.altnet.rippletest.net:51233') {
    this.client = new Client(serverUrl);
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }

  async getBalance(address: string): Promise<WalletBalance> {
    await this.connect();
    
    try {
      const response = await this.client.request({
        command: 'account_info',
        account: address
      });

      const xrpBalance = dropsToXrp(response.result.account_data.Balance);
      
      return {
        xrp: xrpBalance
      };
    } catch (error) {
      throw new Error(`Failed to get balance: ${error}`);
    }
  }

  async sendXRP(
    fromWallet: Wallet, 
    toAddress: string, 
    amount: string
  ): Promise<TransactionResult> {
    await this.connect();

    try {
      const payment = {
        TransactionType: 'Payment',
        Account: fromWallet.address,
        Destination: toAddress,
        Amount: xrpToDrops(amount)
      };

      const prepared = await this.client.autofill(payment);
      const signed = fromWallet.sign(prepared);
      const result = await this.client.submitAndWait(signed.tx_blob);

      return {
        hash: result.result.hash,
        success: result.result.meta?.TransactionResult === 'tesSUCCESS'
      };
    } catch (error) {
      return {
        hash: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async fundWallet(): Promise<Wallet> {
    await this.connect();
    const { wallet } = await this.client.fundWallet();
    return wallet;
  }

  getClient(): Client {
    return this.client;
  }
}