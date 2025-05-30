'use client'

import { useState, useEffect } from 'react'
import { useXamanWallet } from '../hooks/useXamanWallet'

interface XamanPayload {
  uuid: string
  next: {
    always: string
  }
  refs: {
    qr_png: string
    qr_matrix: string
    qr_uri_quality_opts: string[]
    websocket_status: string
  }
}

export default function XamanWallet() {
  const {
    address,
    balanceXrp,
    isConnected,
    isLoading,
    error,
    connect,
    checkPayloadStatus,
    sendPayment,
    checkPaymentStatus,
    disconnect,
    refreshBalance
  } = useXamanWallet()

  const [loginPayload, setLoginPayload] = useState<XamanPayload | null>(null)
  const [paymentPayload, setPaymentPayload] = useState<XamanPayload | null>(null)
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [txHash, setTxHash] = useState('')
  const [showPaymentQR, setShowPaymentQR] = useState(false)

  // Poll for login status
  useEffect(() => {
    if (loginPayload && !isConnected) {
      const interval = setInterval(async () => {
        await checkPayloadStatus(loginPayload.uuid)
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [loginPayload, isConnected, checkPayloadStatus])

  // Poll for payment status
  useEffect(() => {
    if (paymentPayload && showPaymentQR) {
      const interval = setInterval(async () => {
        const result = await checkPaymentStatus(paymentPayload.uuid)
        if (result && typeof result === 'string') {
          // Payment successful (result is txid)
          setTxHash(result)
          setShowPaymentQR(false)
          setPaymentPayload(null)
          setRecipient('')
          setAmount('')
        }
        // Keep QR code visible for null (rejected) and undefined (pending)
        // Only hide on explicit user action or success
      }, 3000) // Increased to 3 seconds to give more time

      return () => clearInterval(interval)
    }
  }, [paymentPayload, showPaymentQR, checkPaymentStatus])

  const handleConnect = async () => {
    const payload = await connect()
    if (payload) {
      setLoginPayload(payload)
    }
  }

  const handleSendPayment = async () => {
    if (!recipient || !amount) return
    
    try {
      const payload = await sendPayment(recipient, amount)
      if (payload) {
        setPaymentPayload(payload)
        setShowPaymentQR(true)
      }
    } catch (error) {
      console.error('Error creating payment:', error)
    }
  }

  const handleDisconnect = () => {
    setLoginPayload(null)
    setPaymentPayload(null)
    setShowPaymentQR(false)
    setTxHash('')
    disconnect()
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Xaman Wallet Integration</h2>
          
          {error && (
            <div className="bg-red-50 p-4 rounded-lg mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {!isConnected ? (
            <div className="text-center">
              {!loginPayload ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    Connect your Xaman wallet by scanning the QR code that will appear
                  </p>
                  <button
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                  >
                    {isLoading ? 'Creating Login Request...' : 'Connect with Xaman'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Scan QR Code with Xaman App
                  </h3>
                  <div className="flex justify-center">
                    <img 
                      src={loginPayload.refs.qr_png} 
                      alt="Xaman Login QR Code"
                      className="w-64 h-64 border rounded-lg"
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Open the Xaman app and scan this QR code to sign in
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setLoginPayload(null)}
                      className="text-gray-600 hover:text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                    <a
                      href={loginPayload.next.always}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Open in Xaman
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Wallet Info</h3>
                <p className="text-sm text-gray-600 mb-1">Address:</p>
                <p className="font-mono text-sm bg-white p-2 rounded border break-all">{address}</p>
                <p className="text-sm text-gray-600 mt-2 mb-1">Balance:</p>
                <p className="text-lg font-semibold text-blue-600">{balanceXrp} XRP</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={refreshBalance}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Refresh Balance
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="text-gray-600 hover:text-gray-700 text-sm"
                  >
                    Disconnect
                  </button>
                </div>
              </div>

              {!showPaymentQR ? (
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
                      onClick={handleSendPayment}
                      disabled={isLoading || !recipient || !amount}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    >
                      {isLoading ? 'Creating Payment...' : 'Send XRP with Xaman'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Approve Payment in Xaman
                  </h3>
                  <div className="flex justify-center mb-4">
                    <img 
                      src={paymentPayload?.refs.qr_png} 
                      alt="Xaman Payment QR Code"
                      className="w-64 h-64 border rounded-lg"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Scan with Xaman to approve the payment of {amount} XRP to {recipient.substring(0, 10)}...
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => {
                        setShowPaymentQR(false)
                        setPaymentPayload(null)
                      }}
                      className="text-gray-600 hover:text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                    {paymentPayload && (
                      <a
                        href={paymentPayload.next.always}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Open in Xaman
                      </a>
                    )}
                  </div>
                </div>
              )}

              {txHash && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Payment Sent!</h3>
                  <p className="text-sm text-green-700 mb-1">Transaction Hash:</p>
                  <p className="font-mono text-sm bg-white p-2 rounded border break-all">{txHash}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Powered by Xaman Wallet • XRP Genie</p>
        </div>
      </div>
    </div>
  )
}