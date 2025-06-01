---
layout: page
title: 🔐 Google Social Login Setup
---

Configure Google OAuth for seamless social login with Web3Auth in your XRP Genie project.

## 🎯 Overview

Google OAuth allows users to login with their Google accounts through Web3Auth. This provides:
- **Familiar login experience** - Users trust Google authentication
- **No password management** - Secure OAuth flow
- **Instant onboarding** - One-click wallet creation

## 🚀 Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Create Project"** or select existing project
3. Enter project name: `My XRP Genie App`
4. Click **"Create"**

## ⚙️ Step 2: Enable Google+ API

1. In Google Cloud Console, go to **"APIs & Services" → "Library"**
2. Search for **"Google+ API"**
3. Click on it and press **"Enable"**

## 🔑 Step 3: Create OAuth Credentials

1. Go to **"APIs & Services" → "Credentials"**
2. Click **"+ Create Credentials" → "OAuth client ID"**
3. If prompted, configure OAuth consent screen:
   - **Application type**: External
   - **App name**: Your app name
   - **User support email**: Your email
   - **Developer contact**: Your email

4. For OAuth client ID:
   - **Application type**: Web application
   - **Name**: `XRP Genie Web Client`
   - **Authorized origins**: 
     ```
     http://localhost:3000
     https://yourdomain.com
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000/auth/callback
     https://yourdomain.com/auth/callback
     ```

## 📋 Step 4: Copy Client Information

After creation, you'll get:
- **Client ID**: `xxxxxxxxx-xxxxxxxxxxxxxxxx.apps.googleusercontent.com`
- **Client Secret**: `xxxxxxxxxxxxxxxxxxxxxxxx`

**Important**: You'll use the Client ID with Web3Auth (not XRP Genie directly).

## 🔧 Step 5: Configure Web3Auth

1. Go to [Web3Auth Dashboard](https://dashboard.web3auth.io/)
2. Select your project
3. Go to **"Social Login" → "Google"**
4. Enter your **Google Client ID**
5. Save configuration

## ✅ Step 6: Test Integration

1. Run your XRP Genie Web3Auth project:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:3000`
3. Click **"Login"**
4. You should see Google as a login option
5. Click Google and test the OAuth flow

## 🛠️ Configuration Options

### OAuth Consent Screen
- **App Logo**: Upload your app logo for branding
- **Privacy Policy**: Add your privacy policy URL
- **Terms of Service**: Add your terms URL

### Scopes
Default scopes for Web3Auth:
- `openid` - OpenID Connect
- `profile` - Basic profile info
- `email` - Email address

## ⚠️ Common Issues

### "OAuth Error: redirect_uri_mismatch"
**Cause**: Redirect URI doesn't match Google Console settings

**Solution**:
1. Check authorized redirect URIs in Google Console
2. Ensure exact match with your domain
3. Include both `http://localhost:3000` and production domain

### "This app isn't verified"
**Cause**: App is in testing mode

**Solution**:
1. For development: Click "Advanced" → "Go to [App Name] (unsafe)"
2. For production: Submit app for verification in Google Console

### Google Login Not Appearing
**Cause**: Web3Auth configuration issue

**Solution**:
1. Verify Google Client ID in Web3Auth dashboard
2. Check Web3Auth project is using correct environment
3. Ensure Google+ API is enabled

## 🌐 Production Deployment

### 1. Update Authorized Origins
```
https://yourapp.com
https://www.yourapp.com
```

### 2. Update Redirect URIs
```
https://yourapp.com/auth/callback
https://www.yourapp.com/auth/callback
```

### 3. Publish OAuth Consent Screen
- Submit for Google verification if needed
- Add privacy policy and terms
- Upload verified domain

## 🔒 Security Best Practices

✅ **Do:**
- Use HTTPS in production
- Keep Client Secret secure (not used in Web3Auth flow)
- Regularly review authorized domains
- Monitor OAuth usage in Google Console

❌ **Don't:**
- Add unnecessary redirect URIs
- Use HTTP in production
- Share Client Secret publicly

## 💡 Pro Tips

- **Branding**: Upload app logo for professional appearance
- **Domains**: Add all environments (dev, staging, prod)
- **Testing**: Use different Google accounts to test flow
- **Analytics**: Monitor login success rates in Google Console

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [Web3Auth Dashboard](https://dashboard.web3auth.io/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Web3Auth Google Setup](https://web3auth.io/docs/guides/social-login/google)