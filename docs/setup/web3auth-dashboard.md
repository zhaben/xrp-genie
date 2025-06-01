---
layout: page
title: 🔐 Web3Auth Dashboard Setup
---

This guide walks you through setting up Web3Auth for XRP Genie projects.

## 🎯 Overview

Web3Auth provides social login and account abstraction for XRPL wallets. You'll need to configure:
1. **Web3Auth Infrastructure**: Sapphire Devnet vs Mainnet
2. **XRPL Network**: Testnet vs Mainnet blockchain
3. **Domain Settings**: Allowed origins for your app

## 📋 Prerequisites

- A Web3Auth account
- Understanding of development vs production environments

## 🚀 Step 1: Create Web3Auth Account

1. Go to [Web3Auth Dashboard](https://dashboard.web3auth.io/)
2. Click **"Sign Up"** or **"Login"**
3. Choose your preferred authentication method
4. Verify your email if required

## 🏗️ Step 2: Create New Project

1. Click **"Create Project"** or **"+ New Project"**
2. Enter project details:
   - **Project Name**: `My XRP Genie App`
   - **Environment**: Choose based on your needs:
     - **Sapphire Devnet**: For development and testing
     - **Sapphire Mainnet**: For production applications

## ⚙️ Step 3: Configure XRPL Integration

1. In your project dashboard, go to **"Blockchain"** or **"Networks"**
2. Enable **XRPL (XRP Ledger)**
3. Configure network settings:
   - **Testnet**: For development with free XRP
   - **Mainnet**: For production with real XRP

## 🌐 Step 4: Set Allowed Origins

**Critical for avoiding "Failed to fetch project configurations" error:**

1. Go to **"Settings"** → **"Allowed Origins"**
2. Add your domains:
   
   **For Development:**
   ```
   http://localhost:3000
   http://127.0.0.1:3000
   ```
   
   **For Production:**
   ```
   https://yourdomain.com
   https://www.yourdomain.com
   ```

## 🔑 Step 5: Get Client ID

1. In your project dashboard, find **"Client ID"**
2. Copy the client ID (looks like: `BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ`)
3. **Important**: Keep this safe but note it's safe to expose publicly

## 🛠️ Step 6: Configure XRP Genie

When running the CLI, select:

**For Sapphire Devnet projects:**
- Web3Auth Infrastructure: **Sapphire Devnet**
- XRPL Network: **Testnet** (recommended for development)

**For Sapphire Mainnet projects:**
- Web3Auth Infrastructure: **Sapphire Mainnet** 
- XRPL Network: **Mainnet** (production only)

## 📝 Step 7: Update Client ID

In your generated project, update the client ID:

```typescript
// hooks/useWeb3AuthWallet.ts
const web3auth = new Web3Auth({
  clientId: "YOUR_CLIENT_ID_HERE", // Replace with your actual client ID
  // ... rest of config
})
```

## ⚠️ Common Issues

### "Failed to fetch project configurations"

**Cause**: Client ID doesn't match Web3Auth environment

**Solutions**:
1. Verify client ID is correct
2. Check if using Sapphire Devnet client ID with Sapphire Mainnet code (or vice versa)
3. Ensure `localhost:3000` is in allowed origins
4. Check project is active in Web3Auth dashboard

### "Wallet is not ready yet"

**Cause**: Network configuration mismatch

**Solutions**:
1. Verify XRPL is enabled in your Web3Auth project
2. Check network configuration matches your CLI selection
3. Ensure project has proper blockchain permissions

## 🎯 Environment Combinations

| Use Case | Web3Auth Env | XRPL Network | Notes |
|----------|--------------|--------------|-------|
| Development | Sapphire Devnet | Testnet | Free XRP, testing |
| Staging | Sapphire Mainnet | Testnet | Production auth, test XRP |
| Production | Sapphire Mainnet | Mainnet | Real XRP, live users |

## 🔗 Next Steps

- [Environment Configuration](environment-config.md) - Set up .env files
- [Network Selection Guide](../guides/network-selection.md) - Choose the right networks
- [Troubleshooting](../help/troubleshooting.md) - Fix common issues

## 💡 Tips

- Start with **Sapphire Devnet + XRPL Testnet** for development
- Test thoroughly before moving to production
- Client IDs are environment-specific (devnet vs mainnet)
- Always add your production domain to allowed origins before deployment