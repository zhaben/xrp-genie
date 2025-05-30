import { Client } from 'xrpl'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { address } = await request.json()
    
    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Address is required' },
        { status: 400 }
      )
    }

    // Connect to XRPL testnet (will be updated by CLI based on user selection)
    const client = new Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()

    try {
      // Get account info
      const accountInfo = await client.request({
        command: 'account_info',
        account: address,
        ledger_index: 'validated'
      })

      await client.disconnect()

      return NextResponse.json({
        success: true,
        balance: accountInfo.result.account_data.Balance,
        sequence: accountInfo.result.account_data.Sequence,
        account: accountInfo.result.account_data.Account
      })
    } catch (xrplError: any) {
      await client.disconnect()
      
      // Handle case where account doesn't exist
      if (xrplError.data?.error === 'actNotFound') {
        return NextResponse.json({
          success: false,
          error: 'Account not found. This account may not be activated yet on testnet.',
          code: 'ACCOUNT_NOT_FOUND'
        }, { status: 404 })
      }
      
      throw xrplError
    }
  } catch (error) {
    console.error('XRPL Account Info error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get account information' },
      { status: 500 }
    )
  }
}