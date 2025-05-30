# 🧞‍♂️ XRP Genie — XRPL Wallet Boilerplate (Next.js)

**XRP Genie** is a full-featured, modular boilerplate for building wallet-enabled dApps on the **XRP Ledger (XRPL)** using **Next.js**.

It supports wallet integrations across three levels of complexity — from beginner testnet wallets to advanced account abstraction for production use cases.

---

## 🧠 Modes

| Mode | Description |
|------|-------------|
| 🟢 **Mode 1: XRPL Testnet** | Create and manage wallets using `xrpl.js` on the XRPL testnet. |
| 🔵 **Mode 2: Xaman Wallet** | Authenticate users with Xaman (XUMM) Wallet using QR login and transaction signing. |
| 🟣 **Mode 3: Account Abstraction** | Simulate smart wallet behavior via server-side signing or delegated accounts. |

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
NEXT_PUBLIC_XUMM_API_KEY=your_xumm_api_key
NEXT_PUBLIC_XUMM_API_SECRET=your_xumm_api_secret
```

## 🧪 Run Locally

```bash
npm run dev
```
Visit: http://localhost:3000

---

## 🔧 Features by Mode
🟢 Mode 1: XRPL Testnet
- Connect to the XRP Testnet
- Generate wallets
- Fund via faucet
- View balance
- Send XRP

🔵 Mode 2: Xaman Wallet
- Login via QR code (XUMM)
- Get account info
- Push-sign transactions

🟣 Mode 3: Account Abstraction
- Server-side transaction signing
- Delegated keys or multisig simulation
- Future-proof for XRPL Hooks or ZK use cases

---

## 🔒 Security Best Practices
Never store private keys in the browser.

Use secure, encrypted key storage for **Mode 3**.

Protect .env.local — never commit it to Git.

## 📚 References
XRPL.org - https://xrpl.org/
xrpl.js Docs - https://js.xrpl.org/
XUMM SDK - https://xumm.readme.io/
Next.js App Router - https://nextjs.org/docs/app

## 🧞 Contribution & Roadmap
xrp-genie is designed to grow. 

Planned features:
NFT minting
Payment Abstraction

PRs and feature requests are welcome!
