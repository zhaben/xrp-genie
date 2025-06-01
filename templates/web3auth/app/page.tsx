'use client'

import { useState } from 'react'
import { useWeb3AuthWallet } from '../hooks/useWeb3AuthWallet'

export default function Web3AuthWallet() {
  const {
    address,
    balanceXrp,
    isConnected,
    isLoading,
    error,
    userInfo,
    connect,
    disconnect,
    sendXrp,
    refreshBalance,
    getAccounts,
    getBalance,
    signMessage,
    authenticateUser,
    fundAccount,
    network,
    web3authEnv
  } = useWeb3AuthWallet()

  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [txHash, setTxHash] = useState('')

  const handleSendXRP = async () => {
    if (!recipient || !amount) return
    
    const result = await sendXrp(recipient, amount)
    if (result && typeof result === 'object' && result.hash) {
      setTxHash(result.hash)
      setRecipient('')
      setAmount('')
    }
  }

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loggedInView = (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Wallet Information</h2>
        {isConnected ? (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Address:</strong> <span className="font-mono text-xs break-all">{address || 'Loading...'}</span>
            </p>
            <p className="text-sm text-gray-700">
              <strong>Balance:</strong> {balanceXrp} XRP
            </p>
            {!address && (
              <button
                onClick={async () => {
                  const result = await getAccounts()
                  uiConsole("Account info: ", result)
                }}
                className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Get Wallet Address
              </button>
            )}
            {address && Number(balanceXrp) < 10 && (
              <div className="mt-2">
                <p className="text-sm text-red-600 mb-2">
                  ⚠️ Warning: Balance below 10 XRP minimum for XRPL accounts
                </p>
                <button
                  onClick={fundAccount}
                  disabled={isLoading}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Funding...' : `Fund Account (${network})`}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">Connect your wallet to see address and balance</p>
          </div>
        )}
      </div>

      <div className="flex-container">
        <div>
          <button onClick={() => userInfo && uiConsole(userInfo)} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={async () => {
            const result = await authenticateUser()
            uiConsole("ID Token:", result)
          }} className="card">
            Get ID Token
          </button>
        </div>
        <div>
          <button onClick={async () => {
            const result = await getAccounts()
            uiConsole("Account info: ", result)
          }} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={async () => {
            const result = await getBalance()
            uiConsole("Balance", result)
          }} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={async () => {
            const result = await signMessage()
            uiConsole("Signed message:", result)
          }} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={handleSendXRP} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={disconnect} className="card">
            Log Out
          </button>
        </div>
      </div>

      {/* Send XRP Form */}
      <div className="bg-gray-50 p-4 rounded-lg mt-4">
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
        </div>
      </div>

      {txHash && (
        <div className="bg-green-50 p-4 rounded-lg mt-4">
          <h3 className="font-semibold text-green-900 mb-2">Transaction Sent!</h3>
          <p className="text-sm text-green-700 mb-1">Transaction Hash:</p>
          <p className="font-mono text-sm bg-white p-2 rounded border break-all">{txHash}</p>
        </div>
      )}

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={connect} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://github.com/zhaben/xrp-genie" rel="noreferrer">
          🧞‍♂️ XRP Genie{" "}
        </a>
        <br />
        <span className="text-lg font-normal text-gray-600">
          Web3Auth ({web3authEnv}) • XRPL {network}
        </span>
      </h1>

      <div className="grid">{isConnected ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-modal-sdk/blockchain-connection-examples/xrpl-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  )
}