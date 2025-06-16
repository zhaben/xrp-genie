# 🧞‍♂️ XRP Genie - Web3Auth Template

A Next.js template for XRPL applications with Web3Auth social login and MPC wallet security.

## Features

- 🔐 **Social Login** - Google, Facebook, Twitter, Discord and more
- 🛡️ **MPC Security** - Multi-party computation for private key management
- 🔑 **Account Abstraction** - Mainstream user-friendly experience
- 📱 **Responsive Design** - Mobile-first with Tailwind CSS
- ⚡ **Built on Next.js 14** - Modern React framework with TypeScript

## Quick Start

```bash
# Clone this template
git clone -b template/web3auth https://github.com/zhaben/xrp-genie.git my-web3auth-app
cd my-web3auth-app

# Install dependencies
npm install

# Configure Web3Auth
cp .env.local.example .env.local
# Edit .env.local with your Web3Auth Client ID

# Run development server
npm run dev
# Open http://localhost:3000
```

## Setup Guide

### 1. Get Web3Auth Client ID

1. Visit [Web3Auth Dashboard](https://dashboard.web3auth.io)
2. Create a new project
3. Copy your Client ID
4. Add your domain to allowed origins

### 2. Configure Environment

```bash
# Edit .env.local
WEB3AUTH_CLIENT_ID=your-web3auth-client-id
```

### 3. Update Client ID in Code

Edit `hooks/useWeb3AuthWallet.ts` and replace the clientId with your Web3Auth Client ID.

## Usage

1. Visit `http://localhost:3000`
2. Click "Login with Social" to authenticate via Web3Auth
3. Choose your preferred social provider (Google, Facebook, etc.)
4. Your XRPL wallet is automatically created using MPC
5. Send and receive transactions on XRPL testnet or mainnet

## Key Features

### 🔐 Social Authentication
- Login with Google, Facebook, Twitter, Discord, GitHub
- No need to manage private keys manually
- Familiar user experience for mainstream users

### 🛡️ MPC Wallet Security
- Private keys are never stored anywhere
- Keys are reconstructed using threshold cryptography
- Web3Auth's enterprise-grade security

### 📱 XRPL Integration
- Full XRPL testnet and mainnet support
- Send and receive XRP and tokens
- Account information and transaction history

## Configuration

The template is pre-configured for XRPL testnet. To customize:

- Edit `hooks/useWeb3AuthWallet.ts` for Web3Auth and XRPL logic
- Modify `app/page.tsx` for UI changes
- Update styling in `app/globals.css`
- Configure network in the wallet hook

## Other XRP Genie Templates

This is part of the XRP Genie toolkit. Other available templates:

- `template/faucet` - Simple XRPL testnet faucet
- `template/xaman` - Xaman wallet integration template
- `template/usdc-trustline` - USDC trustline management template

## 🛠️ Built With

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- [XRPL.js](https://xrpl.org/) - Official XRP Ledger library
- [Web3Auth](https://web3auth.io/) - Social login & account abstraction

## Documentation

For complete XRP Genie documentation, visit:
- 📖 [Main Documentation](https://zhaben.github.io/xrp-genie/)
- 🧞‍♂️ [XRP Genie CLI](https://www.npmjs.com/package/xrp-genie-sdk)
- 🔐 [Web3Auth Setup Guide](https://zhaben.github.io/xrp-genie/setup/web3auth-dashboard)

## License

MIT © 2025 XRP Genie Contributors