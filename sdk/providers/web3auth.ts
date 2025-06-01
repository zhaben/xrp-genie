import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { Client, dropsToXrp, xrpToDrops } from "xrpl";
import { IWalletProvider, XRPLWallet, WalletBalance, TransactionResult } from "../core/types";

export class Web3AuthProvider implements IWalletProvider {
  private web3auth: Web3Auth | null = null;
  private provider: IProvider | null = null;
  private client: Client;
  private isInitialized = false;

  constructor(
    private clientId: string,
    private environment: 'sapphire_devnet' | 'sapphire_mainnet' = 'sapphire_devnet',
    private network: 'testnet' | 'mainnet' = 'testnet'
  ) {
    const rpcUrl = network === 'mainnet' 
      ? 'wss://xrplcluster.com'
      : 'wss://s.altnet.rippletest.net:51233';
    
    this.client = new Client(rpcUrl);
  }

  private async initialize() {
    if (this.isInitialized) return;

    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error(`Web3Auth requires a browser environment and is not supported in Node.js.

For server-side or Node.js applications, use:
  - Faucet provider: XRPGenie.faucet()
  - Xaman provider: XRPGenie.xaman()

Web3Auth only works in browser environments with DOM support.`);
    }

    throw new Error(`Web3Auth setup requires proper configuration and dependencies.

Install Web3Auth dependencies:
  npm install @web3auth/modal @web3auth/base @web3auth/auth-adapter @web3auth/xrpl-provider

For quick testing, use the Faucet provider instead:
  const genie = XRPGenie.faucet()`);
  }

  async connect(): Promise<XRPLWallet> {
    await this.initialize();
    
    if (!this.web3auth) {
      throw new Error("Web3Auth not initialized");
    }

    this.provider = await this.web3auth.connect();
    
    if (!this.provider) {
      throw new Error("Failed to connect wallet");
    }

    const accounts = await this.provider.request({
      method: "xrpl_getAccounts"
    }) as string[];

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found");
    }

    const privateKey = await this.provider.request({
      method: "private_key"
    }) as string;

    return {
      address: accounts[0],
      classicAddress: accounts[0],
      privateKey
    };
  }

  async disconnect(): Promise<void> {
    if (this.web3auth) {
      await this.web3auth.logout();
      this.provider = null;
    }
  }

  async getBalance(address: string): Promise<WalletBalance> {
    if (!this.client.isConnected()) {
      await this.client.connect();
    }

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
    if (!this.provider) {
      throw new Error("Wallet not connected");
    }

    if (!this.client.isConnected()) {
      await this.client.connect();
    }

    try {
      const accounts = await this.provider.request({
        method: "xrpl_getAccounts"
      }) as string[];

      const txResponse = await this.provider.request({
        method: "xrpl_submitTransaction",
        params: {
          transaction: {
            TransactionType: "Payment",
            Account: accounts[0],
            Destination: to,
            Amount: xrpToDrops(amount)
          }
        }
      }) as any;

      return {
        hash: txResponse.TxnSignature || txResponse.hash || '',
        success: txResponse.result?.resultCode === 'tesSUCCESS' || txResponse.resultCode === 'tesSUCCESS'
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
    if (!this.provider) {
      throw new Error("Wallet not connected");
    }

    const signature = await this.provider.request({
      method: "xrpl_signMessage",
      params: { message }
    }) as string;

    return signature;
  }

  isConnected(): boolean {
    return this.web3auth?.connected || false;
  }

  async fundAccount(): Promise<void> {
    if (!this.provider) {
      throw new Error("Wallet not connected");
    }

    if (this.network !== 'testnet') {
      throw new Error("Funding only available on testnet");
    }

    const accounts = await this.provider.request({
      method: "xrpl_getAccounts"
    }) as string[];

    const response = await fetch(`https://faucet.altnet.rippletest.net/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destination: accounts[0],
        xrpAmount: '1000'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fund account from faucet');
    }
  }
}