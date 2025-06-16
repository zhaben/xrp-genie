"use client";

import React, { useState } from "react";
import { connectToXRPL, createTrustline, getTrustlines } from "../src/utils/xrpl";
import { Wallet } from "xrpl";

export default function TrustlineManager() {
  const [seed, setSeed] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [trustlines, setTrustlines] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [walletCreated, setWalletCreated] = useState(false);
  const [balance, setBalance] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const handleCreateWallet = async () => {
    setLoading(true);
    setStatus("Creating and funding wallet...");
    try {
      const client = await connectToXRPL();
      const fundResult = await client.fundWallet();
      const newWallet = fundResult.wallet;
      
      // Get balance
      const accountInfo = await client.request({
        command: 'account_info',
        account: newWallet.address,
        ledger_index: 'validated',
      });
      
      setSeed(newWallet.seed!);
      setAddress(newWallet.address);
      setBalance((parseInt(accountInfo.result.account_data.Balance) / 1000000).toFixed(6));
      setWalletCreated(true);
      setStatus("Wallet created and funded successfully!");
      
      client.disconnect();
    } catch (e) {
      setStatus("Error: " + (e as Error).message);
    }
    setLoading(false);
  };

  const handleCheck = async () => {
    setLoading(true);
    setStatus("Connecting...");
    try {
      const wallet = Wallet.fromSeed(seed);
      setAddress(wallet.address);
      const client = await connectToXRPL();
      setStatus("Checking trustlines...");
      const lines = await getTrustlines(client, wallet.address);
      setTrustlines(lines);
      setStatus(lines.length > 0 ? "Done." : "No trustlines yet.");
      client.disconnect();
    } catch (e) {
      setStatus("Error: " + (e as Error).message);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    setLoading(true);
    setStatus("Connecting...");
    setTransactionHash(""); // Clear previous transaction
    try {
      const wallet = Wallet.fromSeed(seed);
      const client = await connectToXRPL();
      setStatus("Creating a trustline for USDC...");
      const result = await createTrustline(client, wallet);
      const txHash = result.result.hash;
      setTransactionHash(txHash);
      setStatus("Transaction succeeded!");
      client.disconnect();
    } catch (e) {
      setStatus("Error: " + (e as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center"> USDC Trustline Manager</h2>
      <div className="text-center mb-6 text-sm text-gray-500">
        Powered by <a 
          href="https://www.npmjs.com/package/xrp-genie-sdk" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
        >
          🧞‍♂️ XRP Genie
        </a>
      </div>
      
      {/* Wallet Creation Section */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Option 1: Create New Wallet</h3>
        <p className="text-sm text-gray-600 mb-3">
          Get a new testnet wallet with free XRP automatically
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleCreateWallet}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create & Fund Wallet'}
        </button>
      </div>

      {/* Manual Seed Entry Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Option 2: Use Existing Wallet</h3>
        <input
          className="w-full border border-gray-300 p-3 mb-3 rounded-md"
          type="password"
          placeholder="Enter XRPL seed (starts with 's')"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
        />
      </div>

      {/* Wallet Details */}
      {walletCreated && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-green-800">✅ Wallet Details</h3>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Address:</span>
              <div className="font-mono text-sm bg-white p-2 rounded border break-all">{address}</div>
            </div>
            <div>
              <span className="font-medium">Seed:</span>
              <div className="font-mono text-sm bg-white p-2 rounded border break-all">{seed}</div>
            </div>
            <div>
              <span className="font-medium">Balance:</span>
              <span className="ml-2 text-lg font-semibold text-green-600">{balance} XRP</span>
            </div>
          </div>
          <div className="mt-3 p-2 bg-yellow-100 rounded border border-yellow-300">
            <p className="text-xs text-yellow-800">
              ⚠️ <strong>Important:</strong> Save your seed securely! This is testnet only - never use real funds.
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      {seed && (
        <div className="mb-6">
          <div className="flex gap-3">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={handleCheck}
              disabled={loading || !seed}
            >
              Check Trustlines
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={handleCreate}
              disabled={loading || !seed}
            >
              Create USDC Trustline
            </button>
          </div>
        </div>
      )}

      {/* Status and Results */}
      <div className="mt-6">
        {status && (
          <div className="mb-4 p-3 bg-gray-100 rounded-lg">
            <strong>Status:</strong> {status}
          </div>
        )}

        {/* Transaction Success */}
        {transactionHash && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">✅ Transaction Succeeded!</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Transaction Hash:</span>
                <div className="font-mono text-sm bg-white p-2 rounded border break-all mt-1">{transactionHash}</div>
              </div>
              <div>
                <a
                  href={`https://testnet.xrpl.org/transactions/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors"
                >
                  🔗 View on XRPL Testnet Explorer
                </a>
              </div>
            </div>
            <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-blue-800">
                📝 <strong>Next:</strong> You can now receive USDC tokens! Your trustline is ready to hold USDC.
              </p>
            </div>
          </div>
        )}

        {/* USDC Faucet Section */}
        {transactionHash && (
          <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-3">💰 Get Test USDC Tokens</h3>
            <p className="text-sm text-gray-700 mb-3">
              Now that your trustline is set up, you can get test USDC tokens from Circle's official faucet:
            </p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border">
                <p className="text-sm mb-2"><strong>Your Wallet Address:</strong></p>
                <div className="font-mono text-xs bg-gray-100 p-2 rounded border break-all">{address}</div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href="https://faucet.circle.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-md transition-colors"
                >
                  🚰 Open Circle USDC Faucet
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(address)}
                  className="inline-flex items-center justify-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
                >
                  📋 Copy Address
                </button>
              </div>
            </div>
            <div className="mt-3 p-2 bg-yellow-100 rounded border border-yellow-300">
              <p className="text-xs text-yellow-800">
                💡 <strong>Instructions:</strong> 
                1. Click the faucet link above
                2. Select "XRPL Testnet" as the network
                3. Paste your wallet address
                4. Request test USDC tokens
              </p>
            </div>
          </div>
        )}
        
        {address && !walletCreated && (
          <div className="mb-4">
            <strong>Address:</strong> 
            <div className="font-mono text-sm bg-white p-2 rounded border break-all mt-1">{address}</div>
          </div>
        )}
        
        {trustlines.length > 0 && (
          <div>
            <h3 className="font-semibold mt-4 mb-2">Trustlines:</h3>
            <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-auto">
              {JSON.stringify(trustlines, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 