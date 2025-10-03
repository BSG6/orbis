import { NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequestBody {
  messages: ChatMessage[]
  problemContext?: string
  assistanceLevel?: 'Review' | 'Guidance' | 'Total Help'
  code?: string
}

function getClientAndModel() {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) return { client: null as any, modelName: null as any }
  const client = new GoogleGenAI({ apiKey, apiVersion: "v1" })
  const envModel = process.env.GEMINI_MODEL || process.env.GOOGLE_GEMINI_MODEL || "gemini-1.5-pro"
  const modelName = envModel.startsWith("models/") ? envModel : `models/${envModel}`
  return { client, modelName }
}

function guardrails(level: string | undefined) {
  switch (level) {
    case 'Review':
      return "Rules: No code. Provide concise analysis, complexity notes, edge cases, or extra tests only."
    case 'Guidance':
      return "Rules: Provide up to 3 hints (Nudge → Strategy → Specific). No full solutions. Be concise."
    default:
      return "Rules: Short ELI5 → Practical → Technical. Include 3 edge cases. Keep output concise."
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody
    const { messages = [], problemContext = '', assistanceLevel = 'Guidance', code } = body || {}

    const { client, modelName } = getClientAndModel()
    if (!client || !modelName) {
      return NextResponse.json({ ok: false, error: 'AI disabled: missing GOOGLE_API_KEY/GEMINI_API_KEY' }, { status: 503 })
    }

    const system = [
      'You are a helpful coding mentor.',
      guardrails(assistanceLevel),
      'If information is missing, be explicit about assumptions.',
      'Keep responses succinct.',
      problemContext ? `Context:\n${problemContext}` : '',
      assistanceLevel !== 'Review' && code ? `User code (optional):\n${code}` : ''
    ].filter(Boolean).join('\n\n')

    const userTurns = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n')

    const prompt = `${system}\n\nCHAT:\n${userTurns}`

    let genText = ''
    try {
      const result = await client.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }] as any,
        config: { maxOutputTokens: 512, temperature: 0.3 } as any,
      } as any)
      genText = (result as any).text
    } catch (err: any) {
      console.error('/api/gemini/chat model call failed:', err)
      const isProd = process.env.NODE_ENV === 'production'
      const details = isProd ? undefined : { name: err?.name, message: err?.message, stack: err?.stack?.slice(0, 2000) }
      return NextResponse.json({ ok: false, error: err?.message || 'Model call failed', details }, { status: 503 })
    }

    const text = genText
    return NextResponse.json({ ok: true, data: { text } })
  } catch (e: any) {
    console.error('/api/gemini/chat error:', e)
    const isProd = process.env.NODE_ENV === 'production'
    const details = isProd ? undefined : { name: e?.name, message: e?.message, stack: e?.stack?.slice(0, 2000) }
    return NextResponse.json({ ok: false, error: e?.message || 'Chat error', details }, { status: 500 })
  }
}
