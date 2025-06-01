// Core types and interfaces
export * from './core/types';
export * from './core/xrpl-client';

// Wallet providers
export { Web3AuthProvider } from './providers/web3auth';
export { XamanProvider } from './providers/xaman';
export { FaucetProvider } from './providers/faucet';

// Main SDK class
export { XRPGenie } from './xrp-genie';

// Typed interfaces for better developer experience
export { 
  TypedXRPGenie,
  XRPGenieWeb3Auth,
  XRPGenieXaman, 
  XRPGenieFaucet 
} from './typed-providers';

// Legacy exports
export { XRPLClient } from './core/xrpl-client';
export type {
  XRPLWallet,
  TransactionResult,
  WalletBalance,
  WalletProvider,
  XRPGenieConfig,
  IWalletProvider
} from './core/types';