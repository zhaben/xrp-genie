"use client"

import { useState, useEffect, useCallback } from "react"
import { Web3Auth } from "@web3auth/modal"
import { IProvider, UX_MODE, WEB3AUTH_NETWORK, getXrplChainConfig } from "@web3auth/base"
import { AuthAdapter } from "@web3auth/auth-adapter"
import { XrplPrivateKeyProvider } from "@web3auth/xrpl-provider"
import { xrpToDrops, Payment } from "xrpl"

interface WalletState {
  address: string | null
  balance: string
  isConnected: boolean
  isLoading: boolean
  error: string | null
  userInfo: any
}


export const useWeb3AuthWallet = () => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null)
  const [provider, setProvider] = useState<IProvider | null>(null)
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: "0",
    isConnected: false,
    isLoading: false,
    error: null,
    userInfo: null
  })

  // Get network from environment or default to testnet
  const getNetworkConfig = () => {
    const envNetwork = process.env.NEXT_PUBLIC_XRPL_NETWORK || 'testnet'
    switch (envNetwork) {
      case 'mainnet': return { chainId: 0x1, name: 'Mainnet' }
      case 'testnet': return { chainId: 0x2, name: 'Testnet' }
      default: return { chainId: 0x2, name: 'Testnet' }
    }
  }

  // Get Web3Auth environment from environment or default to devnet
  const getWeb3AuthEnv = () => {
    const envWeb3Auth = process.env.NEXT_PUBLIC_WEB3AUTH_ENV || 'devnet'
    return envWeb3Auth === 'mainnet' ? 'Sapphire Mainnet' : 'Sapphire Devnet'
  }

  const networkConfig = getNetworkConfig()
  const web3authEnv = getWeb3AuthEnv()

  // Initialize Web3Auth
  useEffect(() => {
    const init = async () => {
      try {
        // Use network configured by CLI
        const chainConfig = getXrplChainConfig(networkConfig.chainId)!
        
        const xrplProvider = new XrplPrivateKeyProvider({
          config: {
            chainConfig: chainConfig,
          },
        })

        const web3auth = new Web3Auth({
          clientId: "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ", // Replace with your Web3Auth client ID
          uiConfig: {
            appName: "XRP Genie",
            theme: {
              primary: "#3B82F6",
            },
            mode: "light",
            defaultLanguage: "en",
            loginGridCol: 3,
            primaryButton: "socialLogin",
            uxMode: UX_MODE.REDIRECT,
          },
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
          privateKeyProvider: xrplProvider,
        })

        const authAdapter = new AuthAdapter({
          loginSettings: {
            mfaLevel: "optional",
          },
        })
        web3auth.configureAdapter(authAdapter)

        setWeb3auth(web3auth)
        await web3auth.initModal()

        if (web3auth.connected) {
          setProvider(web3auth.provider!)
          setWalletState(prev => ({ ...prev, isConnected: true }))
          await getAccountInfo()
          await getUserInfo()
        }
      } catch (error) {
        console.error("Web3Auth initialization error:", error)
        setWalletState(prev => ({
          ...prev,
          error: "Failed to initialize Web3Auth"
        }))
      }
    }

    init()
  }, [])

  const connect = useCallback(async () => {
    if (!web3auth) {
      setWalletState(prev => ({
        ...prev,
        error: "Web3Auth not initialized yet"
      }))
      return
    }

    try {
      setWalletState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const web3authProvider = await web3auth.connect()
      setProvider(web3authProvider!)
      setWalletState(prev => ({ ...prev, isConnected: true, isLoading: false }))
      
      // Wait a moment for provider to be set, then get account info
      setTimeout(async () => {
        await getAccountInfo()
        await getUserInfo()
      }, 100)
    } catch (error) {
      setWalletState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to connect wallet",
        isLoading: false
      }))
    }
  }, [web3auth])

  const disconnect = useCallback(async () => {
    if (!web3auth) return

    try {
      await web3auth.logout()
      setProvider(null)
      setWalletState({
        address: null,
        balance: "0",
        isConnected: false,
        isLoading: false,
        error: null,
        userInfo: null
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }, [web3auth])

  const getAccountInfo = useCallback(async () => {
    if (!provider) return

    try {
      const accounts = await provider.request<never, string[]>({
        method: "xrpl_getAccounts",
      })

      if (accounts && accounts.length > 0) {
        // Use Web3Auth's built-in XRPL provider for account info
        const accInfo = await provider.request({
          method: "account_info",
          params: [
            {
              account: accounts[0],
              strict: true,
              ledger_index: "current",
              queue: true,
            },
          ],
        }) as any

        setWalletState(prev => ({
          ...prev,
          address: accounts[0],
          balance: accInfo.account_data?.Balance || "0",
          error: null
        }))
      }
    } catch (error) {
      console.error("Error getting account info:", error)
      setWalletState(prev => ({
        ...prev,
        error: "Failed to get account information"
      }))
    }
  }, [provider])

  const getUserInfo = useCallback(async () => {
    if (!web3auth) return

    try {
      const user = await web3auth.getUserInfo()
      setWalletState(prev => ({
        ...prev,
        userInfo: user
      }))
    } catch (error) {
      console.error("Error getting user info:", error)
    }
  }, [web3auth])

  const sendXrp = useCallback(async (toAddress: string, amount: string) => {
    if (!provider) {
      console.log("provider not initialized yet")
      return
    }
    
    try {
      const accounts = await provider.request<never, string[]>({
        method: "xrpl_getAccounts",
      })

      if (accounts && accounts.length > 0) {
        // Check current balance first
        const accInfo = await provider.request({
          method: "account_info",
          params: [
            {
              account: accounts[0],
              strict: true,
              ledger_index: "current",
              queue: true,
            },
          ],
        }) as any

        const balanceInDrops = accInfo.account_data?.Balance || "0"
        const balanceInXrp = Number(balanceInDrops) / 1000000
        const requestedAmount = Number(amount)
        
        console.log("Current balance:", balanceInXrp, "XRP")
        console.log("Requested amount:", requestedAmount, "XRP")
        console.log("Account address:", accounts[0])
        console.log("Destination:", toAddress)

        if (balanceInXrp < requestedAmount) {
          const errorMsg = `Insufficient balance. Available: ${balanceInXrp} XRP, Requested: ${requestedAmount} XRP`
          console.error(errorMsg)
          return { error: errorMsg }
        }

        if (balanceInXrp < 10) {
          const warningMsg = `Warning: Account balance (${balanceInXrp} XRP) is below 10 XRP minimum for XRPL accounts`
          console.warn(warningMsg)
        }

        const tx: Payment = {
          TransactionType: "Payment",
          Account: accounts[0] as string,
          Amount: xrpToDrops(amount),
          Destination: toAddress,
        }
        
        console.log("Transaction object:", JSON.stringify(tx, null, 2))
        
        const txSign = await provider.request({
          method: "xrpl_submitTransaction",
          params: {
            transaction: tx,
          },
        })
        console.log("Transaction result:", txSign)
        return txSign
      } else {
        console.log("failed to fetch accounts")
        return "failed to fetch accounts"
      }
    } catch (error) {
      console.error("Detailed error in sendXrp:", {
        error,
        errorType: typeof error,
        errorConstructor: error?.constructor?.name,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : 'No stack trace',
        stringifiedError: JSON.stringify(error, Object.getOwnPropertyNames(error))
      })
      return error
    }
  }, [provider])

  const refreshBalance = useCallback(async () => {
    await getAccountInfo()
  }, [getAccountInfo])

  const clearError = useCallback(() => {
    setWalletState(prev => ({ ...prev, error: null }))
  }, [])

  const getAccounts = useCallback(async () => {
    if (!provider) return
    try {
      const accounts = await provider.request<never, string[]>({
        method: "xrpl_getAccounts",
      })

      if (accounts && accounts.length > 0) {
        // Also get account info like the working demo
        const accInfo = await provider.request({
          method: "account_info",
          params: [
            {
              account: accounts[0],
              strict: true,
              ledger_index: "current",
              queue: true,
            },
          ],
        }) as any

        // Update wallet state with the address
        setWalletState(prev => ({
          ...prev,
          address: accounts[0],
          balance: accInfo.account_data?.Balance || "0",
          error: null
        }))

        console.log("Account info: ", accInfo)
        return accInfo
      }
    } catch (error) {
      console.error("Error getting accounts:", error)
      setWalletState(prev => ({
        ...prev,
        error: "Failed to get account information"
      }))
    }
  }, [provider])

  const getBalance = useCallback(async () => {
    if (!provider) return
    try {
      const accounts = await provider.request<never, string[]>({
        method: "xrpl_getAccounts",
      })
      if (accounts && accounts.length > 0) {
        const accInfo = await provider.request({
          method: "account_info",
          params: [
            {
              account: accounts[0],
              strict: true,
              ledger_index: "current",
              queue: true,
            },
          ],
        }) as any
        
        const balance = accInfo.account_data?.Balance || "0"
        
        // Update wallet state 
        setWalletState(prev => ({
          ...prev,
          balance: balance,
          error: null
        }))
        
        console.log("Balance", balance)
        return balance
      }
    } catch (error) {
      console.error("Error getting balance:", error)
      setWalletState(prev => ({
        ...prev,
        error: "Failed to get balance"
      }))
    }
  }, [provider])

  const signMessage = useCallback(async () => {
    if (!provider) return
    try {
      const msg = "Hello world"
      const hexMsg = Buffer.from(msg, 'utf8').toString('hex')
      const txSign = await provider.request({
        method: "xrpl_signMessage",
        params: {
          message: hexMsg,
        },
      })
      console.log("Signed message", txSign)
      return txSign
    } catch (error) {
      console.log("error", error)
      return error
    }
  }, [provider])

  const authenticateUser = useCallback(async () => {
    if (!web3auth) return
    try {
      const idToken = await web3auth.authenticateUser()
      console.log("ID Token", idToken)
      return idToken
    } catch (error) {
      console.error("Error authenticating user:", error)
      return error
    }
  }, [web3auth])

  const fundAccount = useCallback(async () => {
    if (!walletState.address) {
      console.error("No wallet address available")
      return
    }

    try {
      setWalletState(prev => ({ ...prev, isLoading: true, error: null }))
      
      console.log("Requesting testnet XRP for address:", walletState.address)
      
      // Use XRPL testnet faucet
      const response = await fetch("https://faucet.altnet.rippletest.net/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: walletState.address,
          xrpAmount: "1000" // Request 1000 XRP from testnet faucet
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Faucet response:", result)
        
        // Wait a moment then refresh balance
        setTimeout(async () => {
          await getAccountInfo()
          setWalletState(prev => ({ ...prev, isLoading: false }))
        }, 3000)
      } else {
        const errorText = await response.text()
        console.error("Faucet error:", errorText)
        setWalletState(prev => ({
          ...prev,
          error: "Failed to fund account from faucet",
          isLoading: false
        }))
      }
    } catch (error) {
      console.error("Error funding account:", error)
      setWalletState(prev => ({
        ...prev,
        error: "Failed to fund account from faucet",
        isLoading: false
      }))
    }
  }, [walletState.address, getAccountInfo])

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
    userInfo: walletState.userInfo,
    network: networkConfig.name,
    web3authEnv: web3authEnv,
    connect,
    disconnect,
    sendXrp,
    refreshBalance,
    clearError,
    getAccounts,
    getBalance,
    signMessage,
    authenticateUser,
    fundAccount
  }
}