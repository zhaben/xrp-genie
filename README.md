# 🧞‍♂️ XRP Genie - Xaman Template

A Next.js template for XRPL applications with Xaman (XUMM) wallet integration and QR code transaction signing.

## Features

- 📱 **Mobile-First** - Designed for Xaman mobile wallet integration
- 🔒 **QR Code Signing** - Secure transaction signing via QR codes
- 🔐 **No Private Keys** - Private keys stay safe in users' mobile wallets
- 📡 **Real-time Updates** - Instant transaction status updates
- ⚡ **Built on Next.js 14** - Modern React framework with TypeScript

## Quick Start

```bash
# Clone this template
git clone -b template/xaman https://github.com/zhaben/xrp-genie.git my-xaman-app
cd my-xaman-app

# Install dependencies
npm install

# Configure Xaman API keys
cp .env.local.example .env.local
# Edit .env.local with your XUMM API credentials

# Run development server
npm run dev
# Open http://localhost:3000
```

## Setup Guide

### 1. Get Xaman API Keys

1. Visit [Xaman Developer Console](https://apps.xumm.dev)
2. Create a new application
3. Copy your API Key and API Secret
4. Configure webhook endpoints (optional)

### 2. Configure Environment

```bash
# Edit .env.local
XUMM_API_KEY=your_xumm_api_key
XUMM_API_SECRET=your_xumm_api_secret
```

## Usage

1. Visit `http://localhost:3000`
2. Click "Connect Xaman Wallet" to initiate login
3. Scan the QR code with your Xaman mobile app
4. Approve the login request in Xaman
5. Send transactions by scanning QR codes from your phone

## Key Features

### 📱 Mobile Wallet Integration
- Seamless connection to Xaman mobile wallet
- No browser extension needed
- Users keep full control of their private keys

### 🔒 Secure Transaction Flow
- All transactions signed on mobile device
- QR code based communication
- Real-time status updates via webhooks

### 📡 XRPL Integration
- Full XRPL testnet and mainnet support
- Account information and balance display
- Transaction history and status tracking

## Configuration

The template is pre-configured for XRPL testnet. To customize:

- Edit API routes in `app/api/xumm/` for backend logic
- Modify `hooks/useXamanWallet.ts` for wallet integration
- Update `app/page.tsx` for UI changes
- Configure network settings in the hooks

## Other XRP Genie Templates

This is part of the XRP Genie toolkit. Other available templates:

- `template/faucet` - Simple XRPL testnet faucet
- `template/web3auth` - Web3Auth social login template
- `template/usdc-trustline` - USDC trustline management template

## 🛠️ Built With

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- [XRPL.js](https://xrpl.org/) - Official XRP Ledger library
- [XUMM SDK](https://xumm.readme.io/) - Xaman Wallet integration

## Documentation

For complete XRP Genie documentation, visit:
- 📖 [Main Documentation](https://zhaben.github.io/xrp-genie/)
- 🧞‍♂️ [XRP Genie CLI](https://www.npmjs.com/package/xrp-genie-sdk)
- 📱 [Xaman Setup Guide](https://zhaben.github.io/xrp-genie/setup/xaman-dashboard)

## License

MIT © 2025 XRP Genie Contributors