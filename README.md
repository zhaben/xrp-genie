# 🧞‍♂️ XRP Genie - Faucet Template

A Next.js template for creating XRPL testnet faucets with a clean, minimalist interface.

## Features

- 🚰 XRPL Testnet faucet functionality
- 💰 Fund wallets with test XRP
- 🔐 Secure wallet generation
- 📱 Responsive design with Tailwind CSS
- ⚡ Built on Next.js 14 with TypeScript

## Quick Start

```bash
# Clone this template
git clone -b template/faucet https://github.com/zhaben/xrp-genie.git my-faucet
cd my-faucet

# Install dependencies
npm install

# Run development server
npm run dev
# Open http://localhost:3000
```

## Usage

1. Visit `http://localhost:3000`
2. Click "Generate Wallet" to create a new testnet wallet
3. The wallet will be automatically funded with test XRP
4. Copy the wallet details for your testing needs

## Configuration

The faucet is pre-configured for XRPL testnet. To customize:

- Edit `hooks/useXrplWallet.ts` for wallet logic
- Modify `app/page.tsx` for UI changes
- Update styling in `app/globals.css`

## Other XRP Genie Templates

This is part of the XRP Genie toolkit. Other available templates:

- `template/web3auth` - Web3Auth integration template
- `template/xaman` - Xaman wallet integration template
- `template/usdc-trustline` - USDC trustline management template

## 🛠️ Built With

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- [XRPL.js](https://xrpl.org/) - Official XRP Ledger library

## Documentation

For complete XRP Genie documentation, visit:
- 📖 [Main Documentation](https://zhaben.github.io/xrp-genie/)
- 🧞‍♂️ [XRP Genie CLI](https://www.npmjs.com/package/xrp-genie-sdk)

## License

MIT © 2025 XRP Genie Contributors