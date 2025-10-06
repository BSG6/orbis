import { GoogleGenAI } from "@google/genai"

export function getApiKey(): string | null {
  return  process.env.GEMINI_API_KEY|| process.env.GOOGLE_API_KEY || null
}

export function resolveModel(envModel?: string): string {
  const base = envModel || process.env.GEMINI_MODEL || process.env.GOOGLE_GEMINI_MODEL || "gemini-2.5-flash"
  return base.startsWith("models/") ? base : `models/${base}`
}

export function getClient(): GoogleGenAI | null {
  const apiKey = getApiKey()
  if (!apiKey) return null
  return new GoogleGenAI({ apiKey, apiVersion: "v1beta" })
}

export function getClientAndModel(): { client: GoogleGenAI | null; modelName: string | null } {
  const client = getClient()
  const modelName = resolveModel()
  if (!client) return { client: null, modelName: null }
  return { client, modelName }
}
