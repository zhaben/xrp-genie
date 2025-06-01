---
layout: page
title: 🧞‍♂️ XRP Genie SDK
---

Framework-agnostic XRPL wallet SDK for building XRPL applications in any JavaScript environment.

## 📦 Installation

```bash
npm install xrp-genie-sdk xrpl
```

## 🚀 Quick Start

### Faucet Provider (Perfect for Development)

```javascript
import { XRPGenie } from 'xrp-genie-sdk';

const genie = XRPGenie.faucet({ network: 'testnet' });

// Create and fund a testnet wallet instantly
const wallet = await genie.connect();
console.log('Address:', wallet.address);

// Check balance (starts with 100 XRP)
const balance = await genie.getBalance(wallet.address);
console.log('Balance:', balance.xrp, 'XRP');

// Send XRP
await genie.sendXRP('rDestination...', '10');
```

### Xaman Provider (Mobile Wallet Integration)

```javascript
// First: npm install xumm-sdk
import { XRPGenie } from 'xrp-genie-sdk';

const genie = XRPGenie.xaman({
  apiKey: 'your-xaman-api-key',
  apiSecret: 'your-xaman-api-secret',
  network: 'testnet'
});

// Create sign-in payload for QR code
const payload = await genie.createSignInPayload();
console.log('Show this QR code:', genie.getQRCode(payload));

// Check if user signed in
const status = await genie.checkPayloadStatus(payload.uuid);
if (status.meta.signed) {
  console.log('User signed in!', status.response.account);
}
```

### Web3Auth Provider (Social Login)

```javascript
// First: npm install @web3auth/modal @web3auth/base @web3auth/auth-adapter @web3auth/xrpl-provider
import { XRPGenie } from 'xrp-genie-sdk';

const genie = XRPGenie.web3auth({
  clientId: 'your-web3auth-client-id',
  environment: 'sapphire_devnet',
  network: 'testnet'
});

// Opens Web3Auth modal for social login
const wallet = await genie.connect();
console.log('Logged in as:', wallet.address);
```

## 🔧 Core Methods

All providers support these methods:

```javascript
// Connection
const wallet = await genie.connect();
await genie.disconnect();
const isConnected = genie.isConnected();

// Wallet operations
const balance = await genie.getBalance(address);
const result = await genie.sendXRP(toAddress, amount);
const signature = await genie.signMessage(message);

// Testnet funding (where supported)
await genie.fundAccount();
```

## 🎯 Provider-Specific Features

### Xaman-Only Methods
```javascript
const xaman = XRPGenie.xaman({ apiKey: 'key', apiSecret: 'secret' });

// Payload management
const signInPayload = await xaman.createSignInPayload();
const paymentPayload = await xaman.createPaymentPayload('rDest...', '10');
const status = await xaman.checkPayloadStatus(uuid);

// QR codes and deep links
const qrCode = xaman.getQRCode(payload);
const deepLink = xaman.getDeepLink(payload);
```

### Faucet-Only Methods
```javascript
const faucet = XRPGenie.faucet();

// Wallet management
const newWallet = await faucet.createWallet();
const existingWallet = await faucet.connectExisting('seed...');

// Wallet info
const seed = faucet.getWalletSeed();
const privateKey = faucet.getWalletPrivateKey();

// Advanced features
const history = await faucet.getTransactionHistory(address);
const client = faucet.getClient(); // Direct XRPL client access
```

## 🌐 Framework Support

Works with any JavaScript environment:

- **React/Next.js** ✅
- **Vue/Nuxt** ✅
- **Node.js** ✅
- **Vanilla JavaScript** ✅
- **TypeScript** ✅

## 🛡️ Error Handling

The SDK provides helpful error messages:

```javascript
try {
  const payload = await xaman.createSignInPayload();
} catch (error) {
  console.log(error.message);
  // "XUMM SDK is required for Xaman provider features.
  //  Install it with: npm install xumm-sdk"
}
```

## 📋 Examples

### React Hook Example
```javascript
import { useState, useEffect } from 'react';
import { XRPGenie } from 'xrp-genie-sdk';

function useXRPWallet() {
  const [genie] = useState(() => XRPGenie.faucet());
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState('0');

  const connect = async () => {
    const w = await genie.connect();
    setWallet(w);
    
    const bal = await genie.getBalance(w.address);
    setBalance(bal.xrp);
  };

  return { wallet, balance, connect };
}
```

### Node.js Script Example
```javascript
const { XRPGenie } = require('xrp-genie-sdk');

async function main() {
  const genie = XRPGenie.faucet();
  const wallet = await genie.connect();
  
  console.log('Created wallet:', wallet.address);
  
  const balance = await genie.getBalance(wallet.address);
  console.log('Balance:', balance.xrp, 'XRP');
}

main().catch(console.error);
```

## 🔗 Setup Guides

- [Web3Auth Dashboard Setup](../setup/web3auth-dashboard.md)
- [Xaman Dashboard Setup](../setup/xaman-dashboard.md)

## 📚 Resources

- [npm package](https://www.npmjs.com/package/xrp-genie-sdk)
- [GitHub Issues](https://github.com/zhaben/xrp-genie/issues)
- [CLI Tool Documentation](../)