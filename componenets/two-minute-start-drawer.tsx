"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, Battery, Target, RotateCcw, Minimize2, X, Timer } from "lucide-react"
import { cn } from "@/lib/utils"

interface TwoMinuteStartDrawerProps {
  isOpen: boolean
  onClose: () => void
  onMinimize: () => void
  isMinimized: boolean
}

type TimeOption = "15" | "25" | "open"
type EnergyLevel = "low" | "ok" | "high"
type PatternFocus = "focus" | "rotation"

export function TwoMinuteStartDrawer({ isOpen, onClose, onMinimize, isMinimized }: TwoMinuteStartDrawerProps) {
  const [timeOption, setTimeOption] = useState<TimeOption>("25")
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>("ok")
  const [patternFocus, setPatternFocus] = useState<PatternFocus>("focus")
  const [recall, setRecall] = useState("")

  // Session memory - remember minimized state
  useEffect(() => {
    const savedMinimized = sessionStorage.getItem("start-drawer-minimized")
    if (savedMinimized === "true" && !isMinimized) {
      onMinimize()
    }
  }, [])

  const handleMinimize = () => {
    sessionStorage.setItem("start-drawer-minimized", "true")
    onMinimize()
  }

  const handleSkip = () => {
    sessionStorage.setItem("start-drawer-minimized", "true")
    onClose()
  }

  const timeOptions = [
    { value: "15" as TimeOption, label: "15 min", description: "Quick session" },
    { value: "25" as TimeOption, label: "25 min", description: "Pomodoro" },
    { value: "open" as TimeOption, label: "Open", description: "No timer" },
  ]

  const energyLevels = [
    { value: "low" as EnergyLevel, label: "Low", color: "text-orange-500", bg: "bg-orange-500/10" },
    { value: "ok" as EnergyLevel, label: "OK", color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { value: "high" as EnergyLevel, label: "High", color: "text-lime-400", bg: "bg-lime-400/10" },
  ]

  const patternOptions = [
    {
      value: "focus" as PatternFocus,
      label: "Focus",
      cue: "Deep dive into one pattern type today",
    },
    {
      value: "rotation" as PatternFocus,
      label: "Rotation",
      cue: "Mix different patterns to stay sharp",
    },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-background border-violet-500/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-violet-500" />
              Two-Minute Start
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMinimize}
                className="h-8 w-8 p-0"
                aria-label="Minimize for session"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0" aria-label="Close drawer">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Set your intention for this coding session</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Time Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-violet-500" />
              <span className="font-medium text-sm">Time</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {timeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={timeOption === option.value ? "secondary" : "outline"}
                  className={cn(
                    "flex flex-col h-auto py-3 px-2",
                    timeOption === option.value && [
                      "bg-gradient-to-r from-violet-500/10 to-lime-400/10",
                      "border-violet-500/20",
                    ],
                  )}
                  onClick={() => setTimeOption(option.value)}
                >
                  <span className="font-medium text-sm">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Energy Level */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Battery className="h-4 w-4 text-violet-500" />
              <span className="font-medium text-sm">Energy</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {energyLevels.map((level) => (
                <Button
                  key={level.value}
                  variant={energyLevel === level.value ? "secondary" : "outline"}
                  className={cn(
                    "flex flex-col h-auto py-3 px-2",
                    energyLevel === level.value && [level.bg, "border-current"],
                  )}
                  onClick={() => setEnergyLevel(level.value)}
                >
                  <span className={cn("font-medium text-sm", level.color)}>{level.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Pattern Focus */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-violet-500" />
              <span className="font-medium text-sm">Pattern</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {patternOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={patternFocus === option.value ? "secondary" : "outline"}
                  className={cn(
                    "flex flex-col h-auto py-3 px-2 text-left",
                    patternFocus === option.value && [
                      "bg-gradient-to-r from-violet-500/10 to-lime-400/10",
                      "border-violet-500/20",
                    ],
                  )}
                  onClick={() => setPatternFocus(option.value)}
                >
                  <span className="font-medium text-sm">{option.label}</span>
                </Button>
              ))}
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {patternOptions.find((p) => p.value === patternFocus)?.cue}
              </p>
            </div>
          </div>

          <Separator />

          {/* Recall */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-violet-500" />
              <span className="font-medium text-sm">Quick Recall</span>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">What did you learn in your last session?</p>
              <input
                type="text"
                placeholder="e.g., Two pointers work well for sorted arrays..."
                value={recall}
                onChange={(e) => setRecall(e.target.value)}
                className="w-full bg-transparent text-xs placeholder:text-muted-foreground/60 border-none outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={handleSkip}>
              Skip
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-violet-500 to-lime-400 hover:from-violet-600 hover:to-lime-500"
              onClick={onClose}
            >
              Start Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
