---
layout: home
title: 🧞‍♂️ XRP Genie Documentation
---

Welcome to the XRP Genie documentation! This toolkit provides both a CLI for scaffolding new apps and an SDK for integration of XRPL wallet applications into any javascript project.

## 🚀 Quick Start

### CLI Tool (Create New App)
```bash
# Scaffold complete Next.js apps from scratch
npx xrp-genie init my-app
```

[🛠️ **View CLI Documentation →**](../README.md)

### SDK (Add to Existing App)
```bash
# Framework-agnostic npm package for any JavaScript project
npm install xrp-genie-sdk xrpl
```

```javascript
import { XRPGenie } from 'xrp-genie-sdk';
const genie = XRPGenie.faucet();
const wallet = await genie.connect();
```

[📦 **View Full SDK Documentation →**](sdk/)

## 📖 Documentation Sections

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

