# 🧞‍♂️ XRP Genie - XRPL Wallet CLI & SDK

> **📖 [View Full Documentation →](https://zhaben.github.io/xrp-genie/)**

**🧞‍♂️ XRP Genie** is a CLI tool and SDK for rapidly scaffolding XRPL wallet applications. Choose from three modes and get a production-ready app in seconds.

Generate working Next.js/XRPL wallet apps with `npx xrp-genie init`
 
Add to any javascript app with `npm i xrp-genie-sdk`


We supports three levels of complexity — from test-friendly devnet wallets to advanced account abstraction for the most sophisticated production use cases with mainstream users.

---

## 🧠 Modes

| Mode | Description | Best For |
|------|-------------|----------|
| 🟢 **Faucet** | Create and manage wallets on the XRPL devnet | Learning & prototyping |
| 🔵 **Xaman** | Authenticate users with Xaman (XUMM) Wallet using QR login and transaction signing | Mobile-first apps |
| 🟣 **Web3Auth** | Authenticate via social login and securely manage private keys with MPC. No private key is ever stored, they are reconstructed securely on the client using threshold cryptography | Mainstream users |
| 💰 **USDC Trustline** | USDC trustline management with Circle integration and faucet | USDC/stablecoin apps |

## 🚀 Quick Start

### Option 1: Use CLI (Recommended)
```bash
# Install globally
npm install -g xrp-genie-sdk

# Generate your app (templates downloaded on-demand)
npx xrp-genie init my-wallet-app
cd my-wallet-app
```

### Option 2: Clone Specific Template
```bash
# Clone only the template you need
git clone -b template/faucet https://github.com/zhaben/xrp-genie.git my-faucet-app
git clone -b template/web3auth https://github.com/zhaben/xrp-genie.git my-web3auth-app
git clone -b template/xaman https://github.com/zhaben/xrp-genie.git my-xaman-app
git clone -b template/usdc-trustline https://github.com/zhaben/xrp-genie.git my-usdc-app

cd my-app
npm install
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

## 📚 Documentation

### Quick Links:
- 🛠️ [Developer Environment](https://zhaben.github.io/xrp-genie/setup/developer-environment)

## 🛠️ Built With

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- [XRPL.js](https://xrpl.org/) - Official XRP Ledger library
- [XUMM SDK](https://xumm.readme.io/) - Xaman Wallet integration
- [Web3Auth](https://web3auth.io/) - Social login & account abstraction

## 🧞 Contribution & Roadmap

**xrp-genie** is designed to grow. 

Planned features: NFT minting, Payment Abstraction, Decentralized AI Agents

PRs and feature requests are welcome!

🪙 License MIT © 2025 xrp-genie Contributors

---

**Need help?** Check the [documentation](https://zhaben.github.io/xrp-genie/) or [open an issue](https://github.com/zhaben/xrp-genie/issues).