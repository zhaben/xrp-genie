import { IWalletProvider, XRPLWallet, WalletBalance, TransactionResult } from "../core/types";
import { Client, dropsToXrp } from "xrpl";

export interface XamanPayload {
  uuid: string;
  next: {
    always: string;
  };
  refs: {
    qr_png: string;
    qr_matrix: string;
    qr_uri_quality_opts: string[];
    websocket_status: string;
  };
  pushed: boolean;
}

export interface XamanPayloadStatus {
  meta: {
    exists: boolean;
    uuid: string;
    multisign: boolean;
    submit: boolean;
    destination: string;
    resolved_destination: string;
    resolved: boolean;
    signed: boolean;
    cancelled: boolean;
    expired: boolean;
    pushed: boolean;
    app_opened: boolean;
    return_url_app: string | null;
    return_url_web: string | null;
  };
  application: {
    name: string;
    description: string;
    disabled: number;
    uuidv4: string;
    icon_url: string;
    issued_user_token: string | null;
  };
  payload: {
    tx_type: string;
    tx_destination: string;
    tx_destination_tag: number | null;
    request_json: any;
    created_at: string;
    expires_at: string;
    expires_in_seconds: number;
  };
  response?: {
    hex: string;
    txid: string;
    resolved_at: string;
    dispatched_to: string;
    dispatched_result: string;
    multisign_account: string;
    account: string;
  };
}

export class XamanProvider implements IWalletProvider {
  private currentWallet: XRPLWallet | null = null;
  private xummSdk: any = null;
  private client: Client;

  constructor(
    private apiKey: string,
    private apiSecret: string,
    private network: 'testnet' | 'mainnet' = 'testnet'
  ) {
    // Direct XRPL client for balance checks
    const rpcUrl = network === 'mainnet' 
      ? 'wss://xrplcluster.com'
      : 'wss://s.altnet.rippletest.net:51233';
    
    this.client = new Client(rpcUrl);
    this.initializeXummSdk();
  }

  private initializeXummSdk() {
    try {
      // Try to import XUMM SDK - will be optional dependency
      const { Xumm } = require('xumm-sdk');
      this.xummSdk = new Xumm(this.apiKey, this.apiSecret);
    } catch (error) {
      // XUMM SDK not installed - will throw error on usage
      this.xummSdk = null;
    }
  }

  private throwXummSdkError() {
    throw new Error(`XUMM SDK is required for Xaman provider features.

Install it with:
  npm install xumm-sdk

Or if using yarn:
  yarn add xumm-sdk

Then restart your application.`);
  }

  async connect(): Promise<XRPLWallet> {
    const payload = await this.createSignInPayload();
    
    // In a real implementation, this would wait for user to scan QR
    // For SDK purposes, we'll return the payload info
    return new Promise((resolve, reject) => {
      // Check payload status periodically
      const checkStatus = async () => {
        try {
          const status = await this.checkPayloadStatus(payload.uuid);
          
          if (status.meta.signed && status.response) {
            this.currentWallet = {
              address: status.response.account,
              classicAddress: status.response.account
            };
            resolve(this.currentWallet);
          } else if (status.meta.cancelled || status.meta.expired) {
            reject(new Error('Sign-in cancelled or expired'));
          } else {
            // Continue checking
            setTimeout(checkStatus, 2000);
          }
        } catch (error) {
          reject(error);
        }
      };

      checkStatus();
    });
  }

  async disconnect(): Promise<void> {
    this.currentWallet = null;
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
    if (!this.currentWallet) {
      throw new Error('Wallet not connected');
    }

    const payload = await this.createPaymentPayload(to, amount);
    
    return new Promise((resolve) => {
      const checkStatus = async () => {
        try {
          const status = await this.checkPayloadStatus(payload.uuid);
          
          if (status.meta.signed && status.response) {
            resolve({
              hash: status.response.txid,
              success: true
            });
          } else if (status.meta.cancelled || status.meta.expired) {
            resolve({
              hash: '',
              success: false,
              error: 'Transaction cancelled or expired'
            });
          } else {
            setTimeout(checkStatus, 2000);
          }
        } catch (error) {
          resolve({
            hash: '',
            success: false,
            error: error instanceof Error ? error.message : 'Transaction failed'
          });
        }
      };

      checkStatus();
    });
  }

  async signMessage(message: string): Promise<string> {
    // Xaman doesn't typically support arbitrary message signing
    // This would need to be implemented as a custom payload type
    throw new Error('Message signing not supported by Xaman provider');
  }

  isConnected(): boolean {
    return this.currentWallet !== null;
  }

  // Xaman-specific methods
  async createSignInPayload(): Promise<XamanPayload> {
    if (!this.xummSdk) {
      this.throwXummSdkError();
    }

    try {
      const request = {
        TransactionType: 'SignIn'
      };

      const subscription = await this.xummSdk.payload.createAndSubscribe(request);
      
      return {
        uuid: subscription.created.uuid,
        next: subscription.created.next,
        refs: subscription.created.refs,
        pushed: subscription.created.pushed
      };
    } catch (error) {
      throw new Error(`Failed to create sign-in payload: ${error}`);
    }
  }

  async createPaymentPayload(destination: string, amount: string): Promise<XamanPayload> {
    if (!this.xummSdk) {
      this.throwXummSdkError();
    }

    try {
      const request = {
        TransactionType: 'Payment',
        Destination: destination,
        Amount: amount
      };

      const subscription = await this.xummSdk.payload.createAndSubscribe(request);
      
      return {
        uuid: subscription.created.uuid,
        next: subscription.created.next,
        refs: subscription.created.refs,
        pushed: subscription.created.pushed
      };
    } catch (error) {
      throw new Error(`Failed to create payment payload: ${error}`);
    }
  }

  async checkPayloadStatus(uuid: string): Promise<XamanPayloadStatus> {
    if (!this.xummSdk) {
      this.throwXummSdkError();
    }

    try {
      const payloadData = await this.xummSdk.payload.get(uuid);
      return payloadData as XamanPayloadStatus;
    } catch (error) {
      throw new Error(`Failed to check payload status: ${error}`);
    }
  }

  // Get QR code URL for display
  getQRCode(payload: XamanPayload): string {
    return payload.refs.qr_png;
  }

  // Get deep link URL for mobile
  getDeepLink(payload: XamanPayload): string {
    return payload.next.always;
  }
}