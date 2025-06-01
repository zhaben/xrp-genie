# 🧞‍♂️ XRP Genie - XRPL Wallet CLI & SDK

> **📖 [View Full Documentation →](https://zhaben.github.io/xrp-genie/)**

**🧞‍♂️ XRP Genie** is a CLI tool and SDK for rapidly scaffolding XRPL wallet applications. Choose from three integration modes and get a production-ready Next.js app in seconds.

Generate complete XRPL wallet apps with `npx xrp-genie init`

It supports three levels of complexity — from beginner-friendly devnet wallets for testing to advanced account abstraction for the most sophisticated production use cases with mainstream users.

```bash
git clone https://github.com/zhaben/xrp-genie.git xrp-genie
cd xrp-genie
npm install
./cli/bin/xrp-genie init my-wallet-app
cp .env.local.example .env.local
```

---

## 🧠 Modes

| Mode | Description | Best For |
|------|-------------|----------|
| 🟢 **Mode 1: Faucet** | Create and manage wallets using `xrpl.js` on the XRPL devnet | Learning & prototyping |
| 🔵 **Mode 2: Xaman** | Authenticate users with Xaman (XUMM) Wallet using QR login and transaction signing | Mobile-first apps |
| 🟣 **Mode 3: Web3Auth** | Authenticate via social login and securely manage private keys with MPC. No private key is ever stored or exposed directly — keys are reconstructed securely on the client using threshold cryptography | Mainstream users |

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/zhaben/xrp-genie.git xrp-genie
cd xrp-genie
npm install
```

### 2. Generate Your App
```bash
./cli/bin/xrp-genie init my-wallet-app
cd my-wallet-app
```

### 3. Configure API Keys (if needed)
```bash
# Edit .env.local with your API keys:

# For Xaman mode:
XUMM_API_KEY=your_xumm_api_key
XUMM_API_SECRET=your_xumm_api_secret

# For Web3Auth mode:
# Replace clientId in hooks/useWeb3AuthWallet.ts
WEB3AUTH_CLIENT_ID=your-web3auth-client-id
```

**📖 Need API keys?** See setup guides:
- [Xaman Dashboard Setup](https://zhaben.github.io/xrp-genie/setup/xaman-dashboard)
- [Web3Auth Dashboard Setup](https://zhaben.github.io/xrp-genie/setup/web3auth-dashboard)

### 4. Run Your App
```bash
npm run dev
# Open http://localhost:3000
```

## 🔒 Security Best Practices

✅ **What XRP Genie Provides:**
- 🛡️ **Server-side API keys** - No NEXT_PUBLIC_ exposure
- 🔐 **Secure API routes** - /api/xumm/* and /api/xrpl/*
- 🎯 **Environment-based config** - Dynamic network selection
- 🔑 **MPC key management** - Web3Auth threshold cryptography
- 📱 **QR-based signing** - No private keys in browser (Xaman mode)

✅ **Developer Guidelines:**
- Never commit .env.local files
- Use provided environment templates
- API keys stay server-side only

## 📚 Documentation

### Quick Links:
- 🔐 [Web3Auth Dashboard Setup](https://zhaben.github.io/xrp-genie/setup/web3auth-dashboard)
- 📱 [Xaman Dashboard Setup](https://zhaben.github.io/xrp-genie/setup/xaman-dashboard)
- 🌐 [Network Selection Guide](https://zhaben.github.io/xrp-genie/guides/network-selection)
- 🛠️ [Developer Environment](https://zhaben.github.io/xrp-genie/setup/developer-environment)

## ✨ Features

- 🚀 **Instant scaffolding** with CLI tool
- 🔷 **Full TypeScript support** with XRPL type definitions
- 🎨 **Pre-configured Tailwind CSS** styling
- 🔒 **Production-ready security** with server-side API patterns
- 🌐 **Multi-network support** (testnet/mainnet)
- 📱 **Mobile-responsive** components

## 🛠️ Built With

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [XRPL.js](https://xrpl.org/) - Official XRP Ledger library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- [XUMM SDK](https://xumm.readme.io/) - Xaman Wallet integration
- [Web3Auth](https://web3auth.io/) - Social login & account abstraction

## 🧞 Contribution & Roadmap

**xrp-genie** is designed to grow. 

Planned features: NFT minting, Payment Abstraction

PRs and feature requests are welcome!

🪙 License MIT © 2025 xrp-genie Contributors

---

**Need help?** Check the [documentation](https://zhaben.github.io/xrp-genie/) or [open an issue](https://github.com/zhaben/xrp-genie/issues).