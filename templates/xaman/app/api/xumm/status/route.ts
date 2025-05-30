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

    const { payloadUuid } = await request.json()
    
    if (!payloadUuid) {
      return NextResponse.json(
        { success: false, error: 'Payload UUID required' },
        { status: 400 }
      )
    }

    const xumm = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET)
    const payloadDetails = await xumm.payload.get(payloadUuid)
    
    return NextResponse.json({
      success: true,
      payload: payloadDetails
    })
  } catch (error) {
    console.error('XUMM Status error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check payload status' },
      { status: 500 }
    )
  }
}