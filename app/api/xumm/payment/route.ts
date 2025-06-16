import { XummSdk } from 'xumm-sdk'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    if (!process.env.XUMM_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'XUMM API key not configured' },
        { status: 500 }
      )
    }

    const { fromAddress, toAddress, amount } = await request.json()
    
    if (!fromAddress || !toAddress || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment parameters' },
        { status: 400 }
      )
    }

    const xumm = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET)

    // Convert XRP to drops
    const amountInDrops = (parseFloat(amount) * 1000000).toString()

    const payloadRequest = {
      txjson: {
        TransactionType: 'Payment',
        Account: fromAddress,
        Destination: toAddress,
        Amount: amountInDrops
      },
      options: {
        submit: true
      }
    }

    const payload = await xumm.payload.create(payloadRequest)
    
    return NextResponse.json({
      success: true,
      payload: {
        uuid: payload.uuid,
        next: payload.next,
        refs: payload.refs
      }
    })
  } catch (error) {
    console.error('XUMM Payment error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create payment request' },
      { status: 500 }
    )
  }
}