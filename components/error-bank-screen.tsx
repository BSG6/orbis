"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { getAllErrorEntries, type ErrorBankRecord, updateErrorEntry } from "@/lib/db"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight } from "lucide-react"

export function ErrorBankScreen() {
  const [entries, setEntries] = useState<ErrorBankRecord[]>([])
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string>("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [rootDraft, setRootDraft] = useState("")
  const [fixDraft, setFixDraft] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const all = await getAllErrorEntries()
      // newest first
      setEntries(all.sort((a, b) => b.date - a.date))
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (category && !e.categories.includes(category)) return false
      if (query && !(`${e.failingEvidence || ''} ${e.rootCause || ''} ${e.fixInsight || ''}`.toLowerCase().includes(query.toLowerCase()))) return false
      return true
    })
  }, [entries, category, query])

  return (
    <div className={cn("h-full flex flex-col bg-background p-6")}>      
      <div className="mb-4 flex items-center gap-3">
        <Input placeholder="Search evidence or notes…" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-background border border-border rounded px-2 py-1 text-sm">
          <option value="">All Categories</option>
          <option>Off-by-one</option>
          <option>Boundary/empty input</option>
          <option>Wrong DS choice</option>
          <option>Complexity blow-up</option>
          <option>Duplicate handling</option>
          <option>Index mix-up</option>
          <option>Recursion base/loop condition</option>
          <option>Graph visitation/state</option>
        </select>
      </div>
      <Separator />
      <div className="mt-4 space-y-3 overflow-y-auto">
        {filtered.map((e) => (
          <Card key={e.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Problem: {e.problemId}</span>
                <span className="text-xs text-muted-foreground">{new Date(e.date).toLocaleString()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex flex-wrap gap-2">
                {e.categories.map((c, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{c}</Badge>
                ))}
              </div>
              {e.failingEvidence && (
                <div>
                  <div className="font-medium">Evidence</div>
                  <div className="text-muted-foreground text-xs whitespace-pre-wrap break-words">{e.failingEvidence}</div>
                </div>
              )}
              {e.rootCause && (
                <div>
                  <div className="font-medium">Root Cause</div>
                  <div className="text-muted-foreground text-xs whitespace-pre-wrap break-words">{e.rootCause}</div>
                </div>
              )}
              {e.fixInsight && (
                <div>
                  <div className="font-medium">Fix Insight</div>
                  <div className="text-muted-foreground text-xs whitespace-pre-wrap break-words">{e.fixInsight}</div>
                </div>
              )}
              <div className="pt-2">
                {editingId === e.id ? (
                  <div className="space-y-2">
                    <div>
                      <div className="font-medium">Root Cause</div>
                      <Textarea
                        className="mt-1 text-xs"
                        rows={3}
                        placeholder="What caused the failure?"
                        value={rootDraft}
                        onChange={(ev) => setRootDraft(ev.target.value)}
                      />
                    </div>
                    <div>
                      <div className="font-medium">Fix Insight</div>
                      <Textarea
                        className="mt-1 text-xs"
                        rows={3}
                        placeholder="What change fixes it and why?"
                        value={fixDraft}
                        onChange={(ev) => setFixDraft(ev.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                      <Button
                        size="sm"
                        disabled={saving}
                        onClick={async () => {
                          setSaving(true)
                          try {
                            const updated: ErrorBankRecord = { ...e, rootCause: rootDraft, fixInsight: fixDraft }
                            await updateErrorEntry(updated)
                            setEntries((prev) => prev.map((p) => (p.id === e.id ? updated : p)))
                            setEditingId(null)
                          } finally {
                            setSaving(false)
                          }
                        }}
                      >
                        {saving ? "Saving…" : "Save"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        try { localStorage.setItem("today-current-problem-id", e.problemId) } catch {}
                        window.dispatchEvent(new CustomEvent("open-today", { detail: { problemId: e.problemId } }))
                      }}
                    >
                      Open in Today <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(e.id)
                        setRootDraft(e.rootCause || "")
                        setFixDraft(e.fixInsight || "")
                      }}
                    >
                      Add note
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-sm text-muted-foreground">No entries yet.</div>
        )}
      </div>
    </div>
  )
}

