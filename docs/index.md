---
layout: home
title: 🧞‍♂️ XRP Genie Documentation
---

Welcome to the XRP Genie documentation! This toolkit provides both a CLI for scaffolding and an SDK for programmatic integration of XRPL wallet applications.

## 🚀 Quick Start

### CLI Tool (Scaffold Apps)
```bash
npx xrp-genie init my-app
```

### SDK (Add to Existing Projects)
```bash
npm install xrp-genie-sdk xrpl
```

```javascript
import { XRPGenie } from 'xrp-genie-sdk';
const genie = XRPGenie.faucet();
const wallet = await genie.connect();
```

[📦 **View Full SDK Documentation →**](sdk/)

## 📖 Documentation Sections

### 📦 SDK
- [XRP Genie SDK](sdk/) - Framework-agnostic npm package for any JavaScript project

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

