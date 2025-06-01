# ❓ Troubleshooting

Common issues and solutions for XRP Genie projects.

## 🚀 CLI Issues

### Command Not Found: `xrp-genie`
```bash
# Solution: Make sure you're in the cloned repo
cd xrp-genie
./cli/bin/xrp-genie init my-app
```

### Permission Denied
```bash
# Solution: Make CLI executable
chmod +x ./cli/bin/xrp-genie
```

## 🔐 Web3Auth Issues

### "Failed to fetch project configurations"
**Cause**: Client ID or environment mismatch

**Solutions**:
1. Check client ID is correct
2. Verify Web3Auth environment (Sapphire Devnet vs Mainnet)
3. Add `localhost:3000` to allowed origins
4. Use demo client ID for testing:
   ```
   BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ
   ```

### "Insufficient balance" Error
**Cause**: Account has 0 XRP

**Solution**: Click "Fund Account (Testnet)" button in the app

## 📱 Xaman Issues

### QR Code Not Appearing
**Cause**: Missing API credentials

**Solution**:
1. Check `.env.local` has XUMM_API_KEY and XUMM_API_SECRET
2. Restart development server
3. Verify credentials at [apps.xumm.dev](https://apps.xumm.dev/)

### "Invalid Payload" Error
**Cause**: Network mismatch

**Solution**: Ensure CLI network selection matches your XUMM app setup

## 🌐 Network Issues

### Transactions Failing
**Causes**: Network configuration or insufficient balance

**Solutions**:
1. Check you're on the correct network (testnet vs mainnet)
2. Verify account has sufficient XRP (10+ XRP minimum)
3. Use faucet for testnet funding

## 🔧 Development Issues

### `.env.local` Not Working
**Solution**:
1. Restart development server after changes
2. Check file is in project root (not template root)
3. Verify no syntax errors in .env.local

### TypeScript Errors
**Solution**:
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## 📞 Getting Help

If you're still having issues:

1. **Check docs**: [Web3Auth Setup](../setup/web3auth-dashboard.md) or [Xaman Setup](../setup/xaman-dashboard.md)
2. **Search issues**: [GitHub Issues](https://github.com/zhaben/xrp-genie/issues)
3. **Open new issue**: Include error messages and steps to reproduce

## 🔍 Debug Tips

### Enable Verbose Logging
```bash
# Add to your .env.local
DEBUG=true
```

### Check Browser Console
- Open Developer Tools (F12)
- Look for errors in Console tab
- Check Network tab for failed API calls

### Verify Environment
```bash
# Check current directory
pwd

# Verify files exist
ls -la .env.local
ls -la package.json
```