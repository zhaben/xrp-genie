---
layout: page
title: 🛠️ Developer Environment Setup
---

**For contributing to XRP Genie or modifying the source code.** 

> **Just using XRP Genie?** You don't need this! Simply run `npx xrp-genie init my-app`

If you're new to development and want to contribute, here's a quick setup:

## Git SSH Setup
- Go to an empty terminal
- Type: `ssh-keygen`
- Set your password
- Type: `cat /Users/yourusername/.ssh/id_ed25519.pub`
- Copy your ssh key
- Go to your Github user account settings → Click "SSH and GPG Keys" → Click "New SSH Key" → Paste your SSH Key

## Install Oh My ZSH
```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

## Install pnpm
```bash
npm i pnpm
```

## Clone the Repo
```bash
git clone git@github.com:zhaben/xrp-genie.git xrp-genie
cd xrp-genie
```

## Install Dependencies
```bash
pnpm install
# or
npm install
```

---

**Note**: If you just want to use XRP Genie (not develop it), you don't need any of this! Just run `npx xrp-genie init`.