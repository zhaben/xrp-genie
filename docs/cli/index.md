---
layout: page
title: 🛠️ XRP Genie CLI
---

Command-line tool for scaffolding complete Next.js XRPL wallet applications.

## 🚀 Quick Start

```bash
npx xrp-genie init my-app
cd my-app
npm run dev
```

## 📋 What It Creates

The CLI generates a complete Next.js application with:

- **XRPL wallet integration** (Web3Auth, Xaman, or Faucet)
- **Tailwind CSS** styling
- **TypeScript** support
- **Working examples** of wallet connection and transactions
- **Environment configuration** files

## 🎯 Choose Your Integration

During initialization, you'll select:

### 🔐 Web3Auth (Social Login)
- Google, Twitter, Discord login
- No wallet installation required
- Perfect for mainstream users
- Requires [Web3Auth setup](../setup/web3auth-dashboard.md)

### 📱 Xaman (Mobile Wallet) 
- QR code signing flow
- Mobile wallet integration
- Secure transaction signing
- Requires [Xaman setup](../setup/xaman-dashboard.md)

### 🧪 Faucet (Development)
- Direct wallet creation
- Automatic testnet funding
- Perfect for development/testing
- No external setup required

## 🌐 Network Selection

Choose between:
- **Testnet** - For development and testing
- **Mainnet** - For production applications

## 📁 Project Structure

Generated project includes:

```
my-app/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── hooks/
│   └── useXrplWallet.ts     # Wallet integration
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── .env.local.example       # Environment variables
```

## ⚡ Commands

### Initialize Project
```bash
npx xrp-genie init <project-name>
```

### Development
```bash
cd <project-name>
npm run dev
```

### Build
```bash
npm run build
```

### Start Production
```bash
npm start
```

## 🔧 Configuration

After initialization:

1. **Copy environment file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Add your API keys** (for Web3Auth/Xaman):
   - Follow [Web3Auth setup guide](../setup/web3auth-dashboard.md)
   - Follow [Xaman setup guide](../setup/xaman-dashboard.md)

3. **Start development:**
   ```bash
   npm run dev
   ```

## 📚 Next Steps

After creating your app:

- [🔐 Web3Auth Dashboard Setup](../setup/web3auth-dashboard.md)
- [📱 Xaman Dashboard Setup](../setup/xaman-dashboard.md)
- [🌐 Network Configuration](../guides/network-selection.md)
- [❓ Troubleshooting](../help/troubleshooting.md)

## 🔗 Alternative: Use the SDK

For existing projects, use the [XRP Genie SDK](../sdk/) instead:

```bash
npm install xrp-genie-sdk xrpl
```