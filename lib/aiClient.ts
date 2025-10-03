import { generateHintLadder, generateTotalHelp, extractProblemFields } from "@/lib/ai"

export async function getHints(problemPrompt: string) {
  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: "hints", prompt: problemPrompt }),
    })
    const data = await res.json()
    if (res.ok && data?.data) {
      return {
        nudge: data.data.nudge,
        strategy: data.data.strategy,
        specific: data.data.specific,
      }
    }
  } catch {}
  return generateHintLadder(problemPrompt)
}

export async function getTotalHelp(problemPrompt: string) {
  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: "totalHelp", prompt: problemPrompt }),
    })
    const data = await res.json()
    if (res.ok && data?.data) return data.data
  } catch {}
  return generateTotalHelp(problemPrompt)
}

export async function extractProblem(input: string) {
  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: "extract", prompt: input }),
    })
    const data = await res.json()
    if (res.ok && data?.data) return data.data
  } catch {}
  return extractProblemFields(input)
}

export async function chat(
  messages: { role: 'user' | 'assistant'; content: string }[],
  problemContext: string,
  assistanceLevel: 'Review' | 'Guidance' | 'Total Help',
  code?: string,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch("/api/gemini/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, problemContext, assistanceLevel, code }),
    signal,
  })
  const data = await res.json()
  if (res.ok && data?.data?.text) return String(data.data.text)
  throw new Error(data?.error || "Chat failed")
}
