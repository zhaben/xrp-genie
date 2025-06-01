# 🧞‍♂️ XRP Genie SDK

Framework-agnostic XRPL wallet SDK with support for Web3Auth, Xaman, and direct wallet connections.

## Features

- 🌐 **Framework Agnostic** - Works with React, Vue, Node.js, or vanilla JavaScript
- 🔐 **Multiple Wallet Types** - Web3Auth (social login), Xaman (mobile), Faucet (direct)
- ⚡ **Unified Interface** - Same API across all wallet providers
- 🛡️ **TypeScript Support** - Full type safety and IntelliSense
- 📱 **Easy Integration** - Simple setup with helpful error messages

## Installation

```bash
npm install xrp-genie-sdk xrpl
```

## Quick Start

### Faucet Provider (Testnet)
Perfect for development and testing:

```javascript
import { XRPGenie } from 'xrp-genie-sdk';

const genie = XRPGenie.faucet({ network: 'testnet' });

// Create and fund a testnet wallet
const wallet = await genie.connect();
console.log('Address:', wallet.address);

// Check balance
const balance = await genie.getBalance(wallet.address);
console.log('Balance:', balance.xrp, 'XRP');

// Send XRP
await genie.sendXRP('rDestination...', '10');
```

### Xaman Provider (Mobile Wallet)
For mobile wallet integration via QR codes:

```javascript
// First install XUMM SDK
// npm install xumm-sdk

import { XRPGenie } from 'xrp-genie-sdk';

const genie = XRPGenie.xaman({
  apiKey: 'your-xaman-api-key',
  apiSecret: 'your-xaman-api-secret',
  network: 'testnet'
});

// Create sign-in payload
const payload = await genie.createSignInPayload();
console.log('QR Code:', genie.getQRCode(payload));

// Check payload status
const status = await genie.checkPayloadStatus(payload.uuid);
```

### Web3Auth Provider (Social Login)
For browser-based social authentication:

```javascript
// First install Web3Auth dependencies
// npm install @web3auth/modal @web3auth/base @web3auth/auth-adapter @web3auth/xrpl-provider

import { XRPGenie } from 'xrp-genie-sdk';

const genie = XRPGenie.web3auth({
  clientId: 'your-web3auth-client-id',
  environment: 'sapphire_devnet',
  network: 'testnet'
});

// Connect with social login (opens modal)
const wallet = await genie.connect();
console.log('Address:', wallet.address);
```

## Provider-Specific Features

All providers support the core interface:
- `connect()` - Connect wallet
- `disconnect()` - Disconnect wallet  
- `getBalance(address)` - Get account balance
- `sendXRP(to, amount)` - Send XRP payment
- `signMessage(message)` - Sign arbitrary message
- `isConnected()` - Check connection status

### Xaman-Specific Methods
```javascript
const payload = await genie.createSignInPayload();
const paymentPayload = await genie.createPaymentPayload('rDest...', '10');
const qrCode = genie.getQRCode(payload);
const deepLink = genie.getDeepLink(payload);
const status = await genie.checkPayloadStatus(payload.uuid);
```

### Faucet-Specific Methods
```javascript
const newWallet = await genie.createWallet();
const existingWallet = await genie.connectExisting('seed...');
const seed = genie.getWalletSeed();
const privateKey = genie.getWalletPrivateKey();
const history = await genie.getTransactionHistory(address);
const client = genie.getClient(); // Direct XRPL client access
```

## Error Handling

The SDK provides helpful error messages with installation instructions:

```javascript
try {
  const payload = await genie.createSignInPayload();
} catch (error) {
  console.log(error.message);
  // "XUMM SDK is required for Xaman provider features.
  //  Install it with: npm install xumm-sdk"
}
```

## TypeScript

Full TypeScript support with provider-specific interfaces:

```typescript
import { XRPGenie, XRPGenieXaman } from 'xrp-genie-sdk';

const genie: XRPGenieXaman = XRPGenie.xaman({
  apiKey: 'key',
  apiSecret: 'secret'
});

// Full IntelliSense for Xaman-specific methods
const payload = await genie.createSignInPayload();
```

## Network Support

- **Testnet** (default) - For development and testing
- **Mainnet** - For production applications

```javascript
const mainnetGenie = XRPGenie.faucet({ network: 'mainnet' });
```

## Links

- [📖 Documentation](https://zhaben.github.io/xrp-genie)
- [🔧 CLI Tool](https://github.com/zhaben/xrp-genie)
- [🐛 Issues](https://github.com/zhaben/xrp-genie/issues)
- [🌐 Web3Auth Setup](https://zhaben.github.io/xrp-genie/setup/web3auth-dashboard)
- [📱 Xaman Setup](https://zhaben.github.io/xrp-genie/setup/xaman-dashboard)

## License

MIT © XRP Genie Contributors