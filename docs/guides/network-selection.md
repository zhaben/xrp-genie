---
layout: page
title: 🌐 Network Selection Guide
---

Understanding which networks to choose for your XRP Genie project.

## 🎯 Overview

XRP Genie involves **two separate network configurations**:

1. **Web3Auth Infrastructure**: Where your authentication happens
2. **XRPL Network**: Which blockchain your transactions use

## 🏗️ Web3Auth Infrastructure

### Sapphire Devnet
- **Purpose**: Development and testing
- **Client IDs**: Work only with devnet
- **Features**: Full feature set, development-friendly
- **Use When**: Building, testing, prototyping

### Sapphire Mainnet  
- **Purpose**: Production applications
- **Client IDs**: Work only with mainnet
- **Features**: Production-grade reliability
- **Use When**: Live applications with real users

## ⛓️ XRPL Networks

### Testnet
- **Purpose**: Development and testing
- **XRP**: Free from faucets (not real value)
- **Features**: Same as mainnet, but test environment
- **Faucet**: Available for funding accounts
- **Use When**: Development, testing, staging

### Mainnet
- **Purpose**: Production applications
- **XRP**: Real XRP with actual value
- **Features**: Live XRPL with real transactions
- **Faucet**: Not available (requires real XRP)
- **Use When**: Production applications only

## 🎯 Recommended Combinations

### 👨‍💻 Development Setup
```
Web3Auth: Sapphire Devnet
XRPL: Testnet
```
**Benefits:**
- Free to test
- Quick setup
- No real money at risk
- Full feature testing

### 🚀 Production Setup
```
Web3Auth: Sapphire Mainnet  
XRPL: Mainnet
```
**Benefits:**
- Production-grade reliability
- Real XRP transactions
- Live user authentication
- Maximum security

### 🧪 Staging Setup
```
Web3Auth: Sapphire Mainnet
XRPL: Testnet
```
**Benefits:**
- Production auth system
- Test XRP for safety
- Real user flows without financial risk

## 🔄 CLI Selection Process

When you run `npx xrp-genie init`, you'll be asked:

### 1. Web3Auth Infrastructure
```bash
? Choose Web3Auth infrastructure environment:
  🧪 Sapphire Devnet - Development (most new projects)
  🌐 Sapphire Mainnet - Production (established projects)
```

### 2. XRPL Network  
```bash
? Choose XRPL network for Web3Auth integration:
  🧪 Testnet - For development and testing (with faucet)
  🌐 Mainnet - Production use (real XRP required)
```

## 🎨 UI Display

Your app will show the configuration in the header:

```
🧞‍♂️ XRP Genie
Web3Auth (Sapphire Devnet) • XRPL Testnet
```

This helps you always know which environment you're using.

## ⚠️ Common Mistakes

### Wrong Web3Auth Environment
```bash
# ❌ Using devnet client ID with mainnet config
Error: "Failed to fetch project configurations"
```
**Fix**: Match your client ID environment with the code configuration

### Missing Testnet Funding
```bash
# ❌ Trying to send XRP with 0 balance
Error: "Insufficient balance. Available: 0 XRP"
```
**Fix**: Use the "Fund Account (Testnet)" button

### Production Without Real XRP
```bash
# ❌ Using mainnet without funding account
Error: Account not activated (needs 10+ XRP)
```
**Fix**: Send real XRP to activate the account

## 🔄 Switching Networks

To change networks in an existing project:

1. **Update Environment Variables**:
   ```bash
   # .env.local
   NEXT_PUBLIC_XRPL_NETWORK=mainnet
   NEXT_PUBLIC_WEB3AUTH_ENV=mainnet
   ```

2. **Update Client ID** (if switching Web3Auth environments):
   ```typescript
   // hooks/useWeb3AuthWallet.ts
   clientId: "YOUR_NEW_CLIENT_ID"
   ```

3. **Restart Development Server**:
   ```bash
   npm run dev
   ```

## 🎯 Decision Tree

```
Are you developing/testing?
├─ Yes → Sapphire Devnet + XRPL Testnet
└─ No → Are you ready for production?
   ├─ Yes → Sapphire Mainnet + XRPL Mainnet  
   └─ No → Sapphire Mainnet + XRPL Testnet (staging)
```

## 🔗 Next Steps

- [Web3Auth Dashboard Setup](../setup/web3auth-dashboard.md) - Configure your project
- [Environment Configuration](../setup/environment-config.md) - Set up .env files
- [Troubleshooting](../help/troubleshooting.md) - Fix network issues