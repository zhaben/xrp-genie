# 🧞‍♂️ XRP Genie - USDC Trustline Template

A Next.js template for managing USDC trustlines on XRPL with Circle integration and wallet creation.

## Features

- 💰 **USDC Trustline Management** - Create and check USDC trustlines on XRPL
- 🏦 **Circle Integration** - Connect to Circle's USDC faucet for testnet funding
- 🔐 **Wallet Creation** - Generate and fund new XRPL testnet wallets
- 📊 **Transaction Tracking** - View transactions on XRPL testnet explorer
- ⚡ **Built on Next.js 14** - Modern React framework with TypeScript

## Quick Start

```bash
# Clone this template
git clone -b template/usdc-trustline https://github.com/zhaben/xrp-genie.git my-usdc-app
cd my-usdc-app

# Install dependencies
npm install

# Run development server
npm run dev
# Open http://localhost:3000
```

## Usage

### Option 1: Create New Wallet
1. Click "Create & Fund Wallet" to generate a new testnet wallet
2. The wallet is automatically funded with test XRP
3. Proceed to create USDC trustline

### Option 2: Use Existing Wallet
1. Enter your XRPL testnet seed (starts with 's')
2. Check existing trustlines or create new ones

### USDC Funding
1. After creating a USDC trustline, visit the Circle faucet
2. Select "XRPL Testnet" as the network
3. Paste your wallet address to receive test USDC tokens

## Key Features

### 🔐 Wallet Management
- Generate new XRPL testnet wallets with automatic funding
- Secure seed-based wallet import
- Real-time balance updates

### 💰 USDC Trustlines
- One-click trustline creation for Circle's testnet USDC
- Trustline verification and status checking
- Transaction success confirmation with explorer links

### 🏦 Circle Integration
- Direct links to Circle's USDC testnet faucet
- Seamless token funding workflow
- Copy-to-clipboard wallet addresses

## Configuration

The template is pre-configured for XRPL testnet and Circle's USDC issuer. To customize:

- Edit `src/utils/xrpl.ts` for XRPL connection settings
- Modify `components/TrustlineManager.tsx` for UI changes
- Update USDC issuer configuration in the utilities

## Other XRP Genie Templates

This is part of the XRP Genie toolkit. Other available templates:

- `template/faucet` - Simple XRPL testnet faucet
- `template/web3auth` - Web3Auth social login template
- `template/xaman` - Xaman wallet integration template

## 🛠️ Built With

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- [XRPL.js](https://xrpl.org/) - Official XRP Ledger library

## Documentation

For complete XRP Genie documentation, visit:
- 📖 [Main Documentation](https://zhaben.github.io/xrp-genie/)
- 🧞‍♂️ [XRP Genie CLI](https://www.npmjs.com/package/xrp-genie-sdk)
- 🏦 [Circle USDC Documentation](https://developers.circle.com/)

## License

MIT © 2025 XRP Genie Contributors