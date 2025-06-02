---
layout: home
title: 🧞‍♂️ XRP Genie Documentation
---

Welcome! Build XRPL wallet applications with our CLI tool and SDK.

## 🚀 Quick Start

### CLI Tool (Create New App)
```bash
git clone https://github.com/zhaben/xrp-genie.git
cd xrp-genie && npm install
npx xrp-genie init my-app
```

[🛠️ **View CLI Documentation →**](cli/)

### SDK (Add to Existing App)
```bash
npm install xrp-genie-sdk xrpl
```

```javascript
import { XRPGenie } from 'xrp-genie-sdk';
const genie = XRPGenie.faucet();
const wallet = await genie.connect();
```

[📦 **View Full SDK Documentation →**](sdk/)

## 📖 Documentation

### 🛠️ Setup Guides
- [Web3Auth Dashboard Setup](setup/web3auth-dashboard.md) - Complete Web3Auth configuration
- [Xaman Dashboard Setup](setup/xaman-dashboard.md) - XUMM/Xaman API configuration
- [Google Social Login Setup](setup/google-auth.md) - Google OAuth integration example
- [Developer Environment](setup/developer-environment.md) - Contributing setup

### 🌐 Network Configuration
- [Network Selection Guide](guides/network-selection.md) - Choosing testnet vs mainnet

### ❓ Help & Support
- [Troubleshooting](help/troubleshooting.md) - Common issues and solutions

## 🔗 Links

- [GitHub Repository](https://github.com/zhaben/xrp-genie)
- [Issues & Support](https://github.com/zhaben/xrp-genie/issues)

