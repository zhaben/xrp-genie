import { Client, Wallet, TrustSet, TrustSetFlags, Payment, TransactionMetadata } from 'xrpl';

// USDC configuration for XRPL testnet (matches your CLI script)
const USDC_CONFIG = {
  currency: '5553444300000000000000000000000000000000', // "USDC" in hex
  issuer: 'rHuGNhqTG32mfmAvWA8hUyWRLV3tCSwKQt', // Circle's testnet USDC issuer
  value: '1000000000', // 1B USDC trust limit
};

export async function connectToXRPL() {
  const client = new Client('wss://s.altnet.rippletest.net:51233'); // Testnet
  await client.connect();
  return client;
}

export async function createTrustline(
  client: Client,
  wallet: Wallet,
  currency: string = USDC_CONFIG.currency,
  limit: string = USDC_CONFIG.value
) {
  const trustSetTx: TrustSet = {
    TransactionType: 'TrustSet',
    Account: wallet.address,
    LimitAmount: {
      currency: currency,
      issuer: USDC_CONFIG.issuer,
      value: limit,
    },
    Flags: TrustSetFlags.tfSetNoRipple, // Use tfSetNoRipple instead of tfSetfAuth
  };

  try {
    const prepared = await client.autofill(trustSetTx);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    
    if ((result.result.meta as TransactionMetadata)?.TransactionResult !== 'tesSUCCESS') {
      throw new Error(`Trustline creation failed: ${(result.result.meta as TransactionMetadata)?.TransactionResult}`);
    }
    
    return result;
  } catch (error) {
    console.error('Error creating trustline:', error);
    throw error;
  }
}

export async function getTrustlines(client: Client, address: string) {
  try {
    const response = await client.request({
      command: 'account_lines',
      account: address,
      ledger_index: 'validated',
    });
    return response.result.lines;
  } catch (error) {
    console.error('Error getting trustlines:', error);
    throw error;
  }
}

export function generateWallet() {
  return Wallet.generate();
}

export async function sendUSDC(
  client: Client,
  wallet: Wallet,
  destination: string,
  amount: string
) {
  const payment: Payment = {
    TransactionType: 'Payment',
    Account: wallet.address,
    Amount: {
      currency: USDC_CONFIG.currency,
      value: amount,
      issuer: USDC_CONFIG.issuer,
    },
    Destination: destination,
  };

  const response = await client.submitAndWait(payment, {
    autofill: true,
    wallet: wallet,
  });

  if ((response.result.meta as TransactionMetadata)?.TransactionResult !== 'tesSUCCESS') {
    throw new Error(`Payment failed: ${(response.result.meta as TransactionMetadata)?.TransactionResult}`);
  }

  return response.result.hash;
}