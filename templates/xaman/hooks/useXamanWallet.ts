"use client"

import { useState, useCallback } from "react"

interface WalletState {
  address: string | null
  balance: string
  isConnected: boolean
  isLoading: boolean
  error: string | null
  userToken: string | null
}

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

export const useXamanWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: "0",
    isConnected: false,
    isLoading: false,
    error: null,
    userToken: null
  })

  const connect = useCallback(async (): Promise<XamanPayload | null> => {
    try {
      setWalletState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await fetch('/api/xumm/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create sign-in request')
      }

      return data.payload
    } catch (error) {
      setWalletState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to create sign-in request",
        isLoading: false
      }))
      return null
    }
  }, [])

  const checkPayloadStatus = useCallback(async (payloadUuid: string) => {
    try {
      const response = await fetch('/api/xumm/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payloadUuid })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to check payload status')
      }

      const payloadDetails = data.payload

      if (payloadDetails.meta.signed === true && payloadDetails.response.account) {
        // User signed in successfully
        setWalletState(prev => ({
          ...prev,
          address: payloadDetails.response.account,
          isConnected: true,
          isLoading: false,
          error: null,
          userToken: payloadDetails.response.user_token || null
        }))

        // Get account balance using XRPL directly
        await getAccountInfo(payloadDetails.response.account)
      } else if (payloadDetails.meta.signed === false && payloadDetails.meta.resolved === true) {
        // Only show rejection if the payload has been resolved (actually rejected by user)
        setWalletState(prev => ({
          ...prev,
          error: "Sign-in was rejected",
          isLoading: false
        }))
      }
    } catch (error) {
      setWalletState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to check payload status",
        isLoading: false
      }))
    }
  }, [])

  const getAccountInfo = useCallback(async (address: string) => {
    try {
      // Use server-side API to get account info
      const response = await fetch('/api/xrpl/account-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address })
      })

      const data = await response.json()

      if (data.success && data.balance) {
        setWalletState(prev => ({
          ...prev,
          balance: data.balance,
          error: null
        }))
      } else if (data.code === 'ACCOUNT_NOT_FOUND') {
        setWalletState(prev => ({
          ...prev,
          balance: "0",
          error: "Account not activated. You need to receive at least 10 XRP to activate your account on testnet."
        }))
      }
    } catch (error) {
      console.error("Error getting account info:", error)
      setWalletState(prev => ({
        ...prev,
        error: "Failed to get account balance"
      }))
    }
  }, [])

  const sendPayment = useCallback(async (toAddress: string, amount: string) => {
    if (!walletState.address) {
      throw new Error("Wallet not connected")
    }

    try {
      setWalletState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await fetch('/api/xumm/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAddress: walletState.address,
          toAddress,
          amount
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment request')
      }

      return data.payload
    } catch (error) {
      setWalletState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to create payment request",
        isLoading: false
      }))
      throw error
    }
  }, [walletState.address])

  const checkPaymentStatus = useCallback(async (payloadUuid: string) => {
    try {
      const response = await fetch('/api/xumm/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payloadUuid })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to check payment status')
      }

      const payloadDetails = data.payload

      if (payloadDetails.meta.signed === true) {
        // Payment was signed and submitted
        setWalletState(prev => ({ ...prev, isLoading: false, error: null }))
        
        // Refresh balance
        if (walletState.address) {
          await getAccountInfo(walletState.address)
        }
        
        return payloadDetails.response.txid
      } else if (payloadDetails.meta.signed === false && payloadDetails.meta.resolved === true) {
        // Only show rejection if the payload has been resolved (actually rejected by user)
        setWalletState(prev => ({
          ...prev,
          error: "Payment was rejected",
          isLoading: false
        }))
        return null
      }
      
      return undefined // Still pending
    } catch (error) {
      setWalletState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to check payment status",
        isLoading: false
      }))
      return null
    }
  }, [walletState.address, getAccountInfo])

  const disconnect = useCallback(() => {
    setWalletState({
      address: null,
      balance: "0",
      isConnected: false,
      isLoading: false,
      error: null,
      userToken: null
    })
  }, [])

  const refreshBalance = useCallback(async () => {
    if (walletState.address) {
      await getAccountInfo(walletState.address)
    }
  }, [walletState.address, getAccountInfo])

  const clearError = useCallback(() => {
    setWalletState(prev => ({ ...prev, error: null }))
  }, [])

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
    userToken: walletState.userToken,
    connect,
    checkPayloadStatus,
    sendPayment,
    checkPaymentStatus,
    disconnect,
    refreshBalance,
    clearError
  }
}