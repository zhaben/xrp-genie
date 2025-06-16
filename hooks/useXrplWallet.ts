"use client"

import { useState, useCallback } from "react"
import { Client, Wallet } from "xrpl"

interface WalletState {
  address: string | null
  balance: string
  isConnected: boolean
  isLoading: boolean
  error: string | null
  transactions: any[]
}

export const useXrplWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: "0",
    isConnected: false,
    isLoading: false,
    error: null,
    transactions: []
  })

  const [wallet, setWallet] = useState<Wallet | null>(null)

  const connect = useCallback(async () => {
    try {
      setWalletState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const client = new Client("wss://s.altnet.rippletest.net:51233")
      await client.connect()

      // Create and fund a new wallet
      const fundResult = await client.fundWallet()
      const newWallet = fundResult.wallet

      // Get the latest account info
      const accountInfo = await client.request({
        command: "account_info",
        account: newWallet.address,
        ledger_index: "validated"
      })

      // Ensure we have the balance in drops
      const balance = accountInfo.result.account_data.Balance || "0"

      setWallet(newWallet)
      setWalletState(prev => ({
        ...prev,
        address: newWallet.address,
        balance: balance,
        isConnected: true,
        isLoading: false,
        error: null
      }))

      // Fetch initial transactions
      await getAccountTransactions(newWallet.address)

      await client.disconnect()
    } catch (error) {
      setWalletState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to connect wallet",
        isLoading: false
      }))
    }
  }, [])

  const disconnect = useCallback(() => {
    setWallet(null)
    setWalletState({
      address: null,
      balance: "0",
      isConnected: false,
      isLoading: false,
      error: null,
      transactions: []
    })
  }, [])

  const getAccountTransactions = useCallback(async (account: string) => {
    try {
      const client = new Client("wss://s.altnet.rippletest.net:51233")
      await client.connect()

      const response = await client.request({
        command: "account_tx",
        account: account,
        ledger_index_min: -1,
        ledger_index_max: -1,
        limit: 10
      })

      const transactions = response.result.transactions.map((tx: any) => {
        const transaction = tx.tx || tx
        const meta = tx.meta || {}
        
        // Get the amount from the meta data if available
        let amount = "0"
        if (meta.delivered_amount) {
          amount = meta.delivered_amount
        } else if (transaction.Amount) {
          amount = transaction.Amount
        }

        return {
          hash: transaction.hash || transaction.Hash,
          type: transaction.TransactionType,
          amount: amount,
          date: transaction.date || Math.floor(Date.now() / 1000),
          from: transaction.Account,
          to: transaction.Destination
        }
      })

      setWalletState(prev => ({
        ...prev,
        transactions
      }))

      await client.disconnect()
    } catch (error) {
      console.error("Error fetching transactions:", error)
      setWalletState(prev => ({
        ...prev,
        transactions: []
      }))
    }
  }, [])

  const refreshBalance = useCallback(async () => {
    if (!walletState.address) return

    try {
      const client = new Client("wss://s.altnet.rippletest.net:51233")
      await client.connect()

      const accountInfo = await client.request({
        command: "account_info",
        account: walletState.address,
        ledger_index: "validated"
      })

      setWalletState(prev => ({
        ...prev,
        balance: accountInfo.result.account_data.Balance
      }))

      await client.disconnect()
    } catch (error) {
      console.error("Error refreshing balance:", error)
    }
  }, [walletState.address])

  const sendXrp = async (toAddress: string, amount: string) => {
    if (!walletState.isConnected || !wallet) {
      throw new Error('Wallet not connected')
    }

    try {
      setWalletState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const client = new Client("wss://s.altnet.rippletest.net:51233")
      await client.connect()

      // Convert XRP to drops (1 XRP = 1,000,000 drops)
      const amountInDrops = Math.floor(Number(amount) * 1000000)

      // Prepare the transaction
      const prepared = await client.autofill({
        TransactionType: "Payment",
        Account: walletState.address,
        Amount: amountInDrops.toString(),
        Destination: toAddress
      })

      // Sign the transaction
      const signed = wallet.sign(prepared)

      // Submit the transaction and wait for the result
      const result = await client.submitAndWait(signed.tx_blob)

      if (result.result.meta.TransactionResult === "tesSUCCESS") {
        // Update balance and transactions
        await refreshBalance()
        await getAccountTransactions(walletState.address!)
      } else {
        throw new Error(`Transaction failed: ${result.result.meta.TransactionResult}`)
      }

      await client.disconnect()
      return result.result.hash
    } catch (error) {
      setWalletState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to send XRP' 
      }))
      throw error
    } finally {
      setWalletState(prev => ({ ...prev, isLoading: false }))
    }
  }

  // Helper function to convert drops to XRP for display
  const dropsToXrp = (drops: string) => {
    return (Number(drops) / 1000000).toFixed(6)
  }

  return {
    address: walletState.address,
    balance: walletState.balance,
    balanceXrp: dropsToXrp(walletState.balance),
    isConnected: walletState.isConnected,
    isLoading: walletState.isLoading,
    error: walletState.error,
    transactions: walletState.transactions,
    connect,
    disconnect,
    sendXrp,
    refreshBalance
  }
}