'use client'

import { useState } from 'react'
import { useXrplWallet } from '../hooks/useXrplWallet'

export default function FaucetWallet() {
  const {
    address,
    balanceXrp,
    isConnected,
    isLoading,
    error,
    transactions,
    connect,
    disconnect,
    sendXrp,
    refreshBalance
  } = useXrplWallet()

  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [txHash, setTxHash] = useState('')

  const handleSendXRP = async () => {
    if (!recipient || !amount) return
    
    try {
      const hash = await sendXrp(recipient, amount)
      setTxHash(hash)
      setRecipient('')
      setAmount('')
    } catch (error) {
      console.error('Error sending XRP:', error)
    }
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">XRPL Testnet Wallet</h2>
          
          {error && (
            <div className="bg-red-50 p-4 rounded-lg mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {!isConnected ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Create a new wallet on XRPL testnet with free XRP from the faucet</p>
              <button
                onClick={connect}
                disabled={isLoading}
                className="bg-xrp-600 hover:bg-xrp-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {isLoading ? 'Creating Wallet...' : 'Create Wallet & Get Free XRP'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Wallet Info</h3>
                <p className="text-sm text-gray-600 mb-1">Address:</p>
                <p className="font-mono text-sm bg-white p-2 rounded border break-all">{address}</p>
                <p className="text-sm text-gray-600 mt-2 mb-1">Balance:</p>
                <p className="text-lg font-semibold text-xrp-600">{balanceXrp} XRP</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={refreshBalance}
                    className="text-xrp-600 hover:text-xrp-700 text-sm"
                  >
                    Refresh Balance
                  </button>
                  <button
                    onClick={disconnect}
                    className="text-gray-600 hover:text-gray-700 text-sm"
                  >
                    Disconnect
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Send XRP</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient Address
                    </label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (XRP)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="10"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <button
                    onClick={handleSendXRP}
                    disabled={isLoading || !recipient || !amount}
                    className="w-full bg-xrp-600 hover:bg-xrp-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                  >
                    {isLoading ? 'Sending...' : 'Send XRP'}
                  </button>
                </div>
              </div>

              {txHash && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Transaction Sent!</h3>
                  <p className="text-sm text-green-700 mb-1">Transaction Hash:</p>
                  <p className="font-mono text-sm bg-white p-2 rounded border break-all">{txHash}</p>
                </div>
              )}

              {transactions.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                  <div className="space-y-2">
                    {transactions.slice(0, 5).map((tx, index) => (
                      <div key={index} className="bg-white p-3 rounded border text-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{tx.type}</span>
                          <span className="text-gray-500">{((Number(tx.amount) || 0) / 1000000).toFixed(6)} XRP</span>
                        </div>
                        <div className="text-gray-600 text-xs mt-1">
                          Hash: {tx.hash?.substring(0, 16)}...
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Connected to XRPL Testnet • Powered by XRP Genie</p>
        </div>
      </div>
    </div>
  )
}