import { NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Allowed tasks
type Task = "hints" | "totalHelp" | "extract" | "classify"

interface AIRequestBody {
  task: Task
  prompt: string
  extra?: any
}

// Hard caps
const MAX_TOKENS = 512

function getClientAndModel() {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) return { client: null as any, modelName: null as any }
  const client = new GoogleGenAI({ apiKey, apiVersion: "v1" })
  const envModel = process.env.GEMINI_MODEL || process.env.GOOGLE_GEMINI_MODEL || "gemini-1.5-pro"
  const modelName = envModel.startsWith("models/") ? envModel : `models/${envModel}`
  return { client, modelName }
}

function clamp(text: string, max = 2000) {
  if (!text) return ""
  return text.length > max ? text.slice(0, max) + "…" : text
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AIRequestBody
    const { task, prompt, extra } = body || {}

    if (!task || !prompt) {
      return NextResponse.json({ error: "Missing task or prompt" }, { status: 400 })
    }

    const { client, modelName } = getClientAndModel()
    if (!client || !modelName) {
      return NextResponse.json({ error: "AI disabled: missing GOOGLE_API_KEY/GEMINI_API_KEY" }, { status: 503 })
    }

    // Build minimal, deterministic-ish prompts with clear instructions
    let system = "" as string
    let user = clamp(prompt, 4000)

    switch (task) {
      case "hints":
        system = `Generate a 3-step hint ladder as JSON with keys {nudge, strategy, specific}. Keep it concise and do not reveal full code.`
        break
      case "totalHelp":
        system = `Generate concise total help as JSON with keys {eli5, practical, technical, edgeCases[], minimalTests[{input,expected}]}. Keep responses short.`
        break
      case "extract":
        system = `Extract problem fields as JSON {title, prompt, constraints?, examples?, tags[]}. No extra commentary.`
        break
      case "classify":
        system = `Classify the error into one of categories: [Off-by-one, Boundary/empty input, Wrong DS choice, Complexity blow-up, Duplicate handling, Index mix-up, Recursion base/loop condition, Graph visitation/state]. Return JSON {category}.`
        break
      default:
        return NextResponse.json({ error: "Unsupported task" }, { status: 400 })
    }

    let genText = ""
    try {
      const result = await client.models.generateContent({
        model: modelName,
        contents: [
          { role: "user", parts: [{ text: system + "\n\nUSER:\n" + user }] },
        ] as any,
        config: { maxOutputTokens: MAX_TOKENS, temperature: 0.3 } as any,
      } as any)
      genText = (result as any).text
    } catch (err: any) {
      console.error("/api/gemini model call failed:", err)
      const isProd = process.env.NODE_ENV === 'production'
      const details = isProd ? undefined : { name: err?.name, message: err?.message, stack: err?.stack?.slice(0, 2000) }
      return NextResponse.json({ ok: false, error: err?.message || 'Model call failed', details }, { status: 503 })
    }

    const text = genText

    // Try to parse JSON; if fails, wrap text
    try {
      const jsonStart = text.indexOf("{")
      const arrStart = text.indexOf("[")
      const start = jsonStart === -1 ? arrStart : (arrStart === -1 ? jsonStart : Math.min(jsonStart, arrStart))
      const payload = start >= 0 ? JSON.parse(text.slice(start)) : { text }
      return NextResponse.json({ ok: true, task, data: payload })
    } catch {
      return NextResponse.json({ ok: true, task, data: { text: clamp(text) } })
    }
  } catch (e: any) {
    console.error("/api/gemini error:", e)
    const isProd = process.env.NODE_ENV === 'production'
    const details = isProd ? undefined : { name: e?.name, message: e?.message, stack: e?.stack?.slice(0, 2000) }
    return NextResponse.json({ error: e?.message || "AI error", details }, { status: 500 })
  }
}
