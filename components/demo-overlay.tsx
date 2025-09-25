"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface DemoOverlayProps {
  enabled: boolean
  onClose: () => void
}

const steps = [
  { id: 1, title: "Set Guidance", tip: "Switch Assistance to Guidance" },
  { id: 2, title: "Hint 1 & 2", tip: "Open coach and click Next twice, add checkpoint" },
  { id: 3, title: "Panic Token", tip: "Open Panic Token, add a reflection, reveal" },
  { id: 4, title: "Run tests", tip: "Click Run Tests to see pass/fail" },
  { id: 5, title: "Rate ★★★", tip: "Click 3 stars to schedule next due" },
  { id: 6, title: "Favorite with tag", tip: "Click Favorite to add to pinboard" },
  { id: 7, title: "Open Review", tip: "Switch to Review to see due items" },
]

export function DemoOverlay({ enabled, onClose }: DemoOverlayProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!enabled) setCurrent(0)
  }, [enabled])

  if (!enabled) return null

  const step = steps[current]

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div className="absolute top-4 right-4 pointer-events-auto">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose} aria-label="Close demo">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-card/90 border border-border rounded-lg shadow-lg p-4 w-[90vw] max-w-xl pointer-events-auto">
        <div className="text-xs text-muted-foreground mb-1">Demo step {current + 1} of {steps.length}</div>
        <div className="text-foreground font-semibold mb-1">{step.title}</div>
        <div className="text-sm text-muted-foreground">{step.tip}</div>
        <div className="mt-3 flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>Back</Button>
          <Button size="sm" onClick={() => current === steps.length - 1 ? onClose() : setCurrent((c) => Math.min(steps.length - 1, c + 1))}>
            {current === steps.length - 1 ? "Done" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  )
}


