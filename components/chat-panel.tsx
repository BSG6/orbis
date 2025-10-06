"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { addChatMessage, getChatMessagesByProblemId, type ChatMessageRecord } from "@/lib/db"
import { getLatestErrorEntryByProblemId } from "@/lib/db"
import { cn } from "@/lib/utils"
import { chat as chatApi } from "@/lib/aiClient"

interface ChatPanelProps {
  problemId: string
  assistanceLevel: "Review" | "Guidance" | "Total Help"
  problemContext: string
  code?: string
}

const PRESETS = ["Explain constraints", "What are key edge cases?", "Why did my test fail?"]

export function ChatPanel({ problemId, assistanceLevel, problemContext, code }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessageRecord[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const load = async () => {
      const all = await getChatMessagesByProblemId(problemId)
      setMessages(all)
      // autoscroll
      setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight }), 0)
    }
    load()
  }, [problemId])

  const appendMessage = async (role: "user" | "assistant", content: string) => {
    const rec: ChatMessageRecord = {
      id: `${problemId}-${Date.now()}-${role}`,
      problemId,
      date: Date.now(),
      role,
      content,
    }
    await addChatMessage(rec)
    setMessages((prev) => [...prev, rec])
  }

  const onSend = async () => {
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    setError(null)
    try {
      await appendMessage("user", text)
      setInput("")
      const controller = new AbortController()
      abortRef.current = controller
      const assistantText = await chatApi(
        messages
          .concat({ id: "tmp", problemId, date: Date.now(), role: "user", content: text })
          .map((m) => ({ role: m.role, content: m.content })),
        problemContext,
        assistanceLevel,
        code,
        controller.signal,
      )
      await appendMessage("assistant", assistantText)
    } catch (e: any) {
      setError(e?.message || "Chat failed")
      const guardrail =
        assistanceLevel === "Review"
          ? "(Review) I’ll avoid code. Here’s a concise perspective based on your question."
          : assistanceLevel === "Guidance"
          ? "(Guidance) Here’s a hint-style nudge based on your question."
          : "(Total Help) Brief ELI5 → Practical → Technical answer goes here."
      await appendMessage("assistant", `${guardrail}\n\n(Fallback response due to temporary issue.)`)
    } finally {
      setSending(false)
      abortRef.current = null
      setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }), 0)
    }
  }

  const onCancel = () => {
    abortRef.current?.abort()
    abortRef.current = null
    setSending(false)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>AI Chat (beta)</span>
          <Badge variant="outline" className="text-xs">{assistanceLevel}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          {PRESETS.map((p) => (
            <Button
              key={p}
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={async () => {
                if (p === "Why did my test fail?") {
                  const latest = await getLatestErrorEntryByProblemId(problemId)
                  const prompt = latest?.failingEvidence
                    ? `${p}\n\nEvidence: ${latest.failingEvidence}`
                    : p
                  setInput(prompt)
                } else {
                  setInput(p)
                }
              }}
            >
              {p}
            </Button>
          ))}
        </div>
        <div ref={listRef} className="h-56 overflow-y-auto rounded border border-border bg-muted/30 p-3 space-y-2">
          {messages.length === 0 && (
            <div className="text-xs text-muted-foreground">Ask about the problem. Your chat will appear here.</div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "max-w-[80%] rounded px-2 py-1 text-sm whitespace-pre-wrap break-words",
                m.role === "user" ? "ml-auto bg-gradient-to-r from-violet-500/10 to-lime-400/10 border border-violet-500/20" : "mr-auto bg-card border border-border",
              )}
            >
              {m.content}
            </div>
          ))}
        </div>
        {error && <div className="mt-2 text-xs text-red-500">{error}</div>}
        <div className="mt-3 flex items-center gap-2">
          <Input
            ref={inputRef}
            placeholder="Type your question…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                onSend()
              }
            }}
          />
          <Button onClick={onSend} disabled={sending}>
            {sending ? "Sending…" : "Send"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => { setInput(""); setError(null); inputRef.current?.focus() }}
            disabled={input.trim().length === 0}
          >
            Clear
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={!sending}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
