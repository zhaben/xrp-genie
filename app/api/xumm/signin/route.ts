import { XummSdk } from 'xumm-sdk'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    if (!process.env.XUMM_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'XUMM API key not configured' },
        { status: 500 }
      )
    }

    const xumm = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET)

    const request = {
      txjson: {
        TransactionType: 'SignIn'
      }
    }

    const payload = await xumm.payload.create(request)
    
    return NextResponse.json({
      success: true,
      payload: {
        uuid: payload.uuid,
        next: payload.next,
        refs: payload.refs
      }
    })
  } catch (error) {
    console.error('XUMM SignIn error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create sign-in request' },
      { status: 500 }
    )
  }
}