import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { days, region, dailyGB, pastTrip, topPick, alternative } = await req.json()

    const prompt = `You are a friendly travel data expert for Saily, an eSIM company.

A customer is planning a trip with these details:
- Destination: ${region}
- Trip length: ${days} days
- Their estimated daily data usage: ${dailyGB.toFixed(2)} GB/day
- Last trip to ${pastTrip.destination}: used ${pastTrip.gbUsed}GB over ${pastTrip.days} days

We are recommending:
- Top pick: ${topPick.name} — ${topPick.data}, ${topPick.validity}, ${topPick.price}

Write a short friendly 2-sentence explanation for why this plan is best for this customer. Reference their past usage. Be conversational, not technical.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Groq error:', error)
      return NextResponse.json({ explanation: 'This plan perfectly matches your usage pattern.' })
    }

    const data = await response.json()
    const explanation = data.choices?.[0]?.message?.content || 'This plan perfectly matches your usage pattern.'

    return NextResponse.json({ explanation })

  } catch (error) {
    console.error('Route error:', error)
    return NextResponse.json({ explanation: 'This plan perfectly matches your usage pattern.' })
  }
}