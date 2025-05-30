# 🧞‍♂️ XRP Genie — XRPL Wallet Boilerplate (Next.js)

**XRP Genie** is a full-featured, modular boilerplate for building wallet-enabled web app on the **XRP Ledger (XRPL)** using **Next.js** and **Typescript**.

It supports wallet integrations across three levels of complexity — from beginner testnet wallets to advanced account abstraction for production use cases.

---

## 🧠 Modes

| Mode | Description |
|------|-------------|
| 🟢 **Mode 1: XRPL Testnet** | Create and manage wallets using `xrpl.js` on the XRPL testnet. |
| 🔵 **Mode 2: Xaman Wallet** | Authenticate users with Xaman (XUMM) Wallet using QR login and transaction signing. |
| 🟣 **Mode 3: Account Abstraction** | Uses Web3Auth to securely manage private keys via social login and MPC. No private key is ever stored or exposed directly — keys are reconstructed securely on the client using threshold cryptography. |

---

## 🚀 Quick Start

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/xrp-genie.git
cd xrp-genie
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment
Create .env.local in the root directory:

```bash
cp .env.local.example .env.local
```

Creat and save your API keys
```bash
# .env.local

# mode2
NEXT_PUBLIC_XUMM_API_KEY=your_xumm_api_key
NEXT_PUBLIC_XUMM_API_SECRET=your_xumm_api_secret

# mode3
WEB3AUTH_CLIENT_ID=your-web3auth-client-id
```

## 🧪 Run Locally

```bash
npm run dev
```
Visit: http://localhost:3000

---

## 🔧 Features by Mode
🟢 Mode 1: XRPL Testnet (Beginner)
- Connect to the XRPL Testnet using xrpl.js
- Generate non-custodial wallets locally
- Fund wallets using XRPL faucet
- View balance, transaction history
- Send XRP to other accounts

🔵 Mode 2: Xaman Wallet (Intermediate)
- Login with XUMM (Xaman Wallet) via QR code
- Fetch XRPL account info securely
- Prepare and push-sign transactions through user approval
- Works with both mainnet and testnet

🟣 Mode 3: Account Abstraction (Advanced)
- 🔐 Authenticate users via social login (Google, Apple, etc.) using Web3Auth
- 🧠 Reconstruct private keys securely in-browser via MPC (multi-party computation)
- 🪪 Generate and persist XRPL wallets with no user seed phrases
- 🧾 Sign and submit transactions programmatically (smart wallet behavior)
- 🧱 Ideal for delegated signing, gas sponsorship, or future multisig/ZK workflows

---

## 🔒 Security Best Practices
❌ Never do this:
Don’t hardcode private keys or API secrets in your codebase
(e.g. const PRIVATE_KEY = "rXXXXXXXXXXXXXXXXXX")

✅ Always do this:
Store secrets in .env.local only, never in source code.

❌ Never commit .env.local to Git.

📦 What to include in .gitignore
To prevent accidentally exposing secrets, make sure your .gitignore includes:

```bash
# Environment variables
.env
.env.local
.env.*.local
```
This keeps all environment-specific and secret config out of your Git history — especially important for API keys, client IDs, and anything else that shouldn't be public.

## 📚 References
XRPL.org - https://xrpl.org/

xrpl.js Docs - https://js.xrpl.org/

XUMM SDK - https://xumm.readme.io/

Next.js App Router - https://nextjs.org/docs/app

Web3Auth - https://web3auth.io/docs/

## 🧞 Contribution & Roadmap
**xrp-genie** is designed to grow. 

Planned features: NFT minting, Payment Abstraction

PRs and feature requests are welcome!

🪙 License
MIT © 2025 xrp-genie Contributors
