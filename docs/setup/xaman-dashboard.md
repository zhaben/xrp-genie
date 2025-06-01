---
layout: page
title: 📱 Xaman Dashboard Setup
---

Complete guide to setting up Xaman (XUMM) Wallet integration for XRP Genie projects.

## 🎯 Overview

Xaman provides QR code authentication and transaction signing for XRPL applications. You'll need:
1. **XUMM Developer Account**
2. **API Key & Secret**
3. **App Configuration**

## 🚀 Step 1: Create XUMM Developer Account

1. Go to [XUMM Developer Portal](https://apps.xumm.dev/)
2. Click **"Sign up"** or **"Login"**
3. Verify your email address

## 🏗️ Step 2: Create New Application

1. Click **"Create new app"**
2. Fill in app details:
   - **App Name**: `My XRP Genie App`
   - **App Description**: Brief description of your app
   - **App Icon**: Upload your app icon (optional)
   - **Webhook URL**: Leave blank for now

## 🔑 Step 3: Get API Credentials

1. After creating your app, you'll see:
   - **API Key**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - **API Secret**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
2. **Copy both values** - you'll need them in your .env.local

## ⚙️ Step 4: Configure XRP Genie

When running the CLI, select:
- **Mode**: Xaman Wallet
- **Network**: Testnet (for development) or Mainnet (for production)

## 📝 Step 5: Add API Keys

In your generated project, update `.env.local`:

```bash
# Xaman/XUMM Configuration
XUMM_API_KEY=your-api-key-here
XUMM_API_SECRET=your-api-secret-here
```

## 🧪 Step 6: Test Your Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:3000`
3. Click **"Connect Wallet"**
4. You should see a QR code
5. Scan with Xaman app to test authentication

## ⚠️ Common Issues

### QR Code Not Appearing
**Cause**: Missing or invalid API credentials

**Solution**:
1. Verify API key and secret are correct
2. Check .env.local file exists
3. Restart development server

### "Invalid Payload" Error
**Cause**: Network mismatch or payload configuration

**Solution**:
1. Ensure you selected the correct network in CLI
2. Check if using testnet with testnet Xaman app
3. Verify API keys are from correct XUMM app

## 🌐 Network Configuration

### Testnet (Development)
- Use testnet API keys
- Test with testnet XRP
- Xaman app can switch to testnet mode

### Mainnet (Production)
- Use mainnet API keys
- Real XRP transactions
- Add production domain to XUMM app settings

## 🔒 Security Best Practices

✅ **Do:**
- Keep API secrets in .env.local only
- Use server-side API routes (XRP Genie handles this)
- Test thoroughly on testnet before mainnet

❌ **Don't:**
- Commit .env.local to Git
- Expose API secrets in client-side code
- Use mainnet for development

## 💡 Tips

- Start with testnet for development
- API credentials are environment-specific
- QR codes expire after a few minutes
- Users need Xaman app installed on their phone

## 🔗 Useful Links

- [XUMM Developer Portal](https://apps.xumm.dev/)
- [Xaman App Download](https://xumm.app/)
- [XUMM Documentation](https://xumm.readme.io/)
- [Network Selection Guide](../guides/network-selection.md)