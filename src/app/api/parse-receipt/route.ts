import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { z } from 'zod'

const GROK_API_KEY = process.env.GROK_API_KEY || ''

const ReceiptDataSchema = z.object({
  amount: z.number().positive(),
  merchant: z.string().optional(),
  category: z.enum(['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Others']),
  note: z.string().optional(),
})

export async function POST(request: NextRequest) {
  // 1. Check auth
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Rate limiting (simple in-memory)
  const rateLimitKey = `rate-limit:${session.user.email}`
  const now = Date.now()
  // TODO: Implement proper rate limiting with Redis or similar

  try {
    const { image, text } = await request.json()

    if (!image && !text) {
      return NextResponse.json(
        { error: 'Either image or text must be provided' },
        { status: 400 }
      )
    }

    let prompt = ''

    if (image) {
      prompt = `Extract transaction from this receipt. Return JSON: { amount, merchant, category, note }. Categories: Food, Transport, Shopping, Bills, Entertainment, Healthcare, Others. Amount in RM.`
    } else if (text) {
      prompt = `Parse this expense: "${text}". Casual Malaysian English/Bahasa. Return JSON: { amount, merchant, category, note }.
        Examples:
        "lunch at mamak 12" → { amount: 12, merchant: "Mamak", category: "Food", note: "Lunch" }
        "kedai tomyam rm12.50" → { amount: 12.50, merchant: "Kedai Tomyam", category: "Food", note: "" }
        "grab 20 to office" → { amount: 20, merchant: "Grab", category: "Transport", note: "To office" }
        "petrol 50" → { amount: 50, merchant: "Shell", category: "Transport", note: "Petrol" }
        "grocery tesco 150.80" → { amount: 150.80, merchant: "Tesco", category: "Shopping", note: "Grocery" }
        "starbucks 18 minum kopi" → { amount: 18, merchant: "Starbucks", category: "Food", note: "Minum kopi" }
        "toll rm5" → { amount: 5, merchant: "Toll", category: "Transport", note: "" }
        "parking 3" → { amount: 3, merchant: "Parking", category: "Transport", note: "" }
      `
    }

    // 3. Call Grok API
    const response = await fetch('https://api.grok.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-2',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      throw new Error('Grok API error')
    }

    const data = await response.json()
    const parsed = JSON.parse(data.choices[0].message.content)

    // 4. Validate
    const validated = ReceiptDataSchema.parse(parsed)

    return NextResponse.json({ success: true, data: validated })

  } catch (error) {
    console.error('Parse error:', error)
    return NextResponse.json(
      {
        error: 'Failed to parse',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
