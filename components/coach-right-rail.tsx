"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ChevronRight,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  X,
  Eye,
  Clock,
  Target,
  Sparkles,
  TrendingUp,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CoachSkeleton } from "./skeletons/coach-skeleton"

type AssistanceLevel = "Review" | "Guidance" | "Total Help"

interface CoachRightRailProps {
  isFocusMode: boolean
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  assistanceLevel: AssistanceLevel
}

export function CoachRightRail({ isFocusMode, isCollapsed, onToggleCollapse, assistanceLevel }: CoachRightRailProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentHint, setCurrentHint] = useState(0)
  const [checkpointInput, setCheckpointInput] = useState("")
  const [isChecklistDismissed, setIsChecklistDismissed] = useState(false)
  const [panicReflection, setPanicReflection] = useState("")
  const [isPanicDialogOpen, setIsPanicDialogOpen] = useState(false)
  const [panicUsedToday, setPanicUsedToday] = useState(false)

  // Daily Panic Token limit
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const key = `panic-used-${today}`
    setPanicUsedToday(localStorage.getItem(key) === "true")
  }, [])

  const markPanicUsed = () => {
    const today = new Date().toISOString().slice(0, 10)
    const key = `panic-used-${today}`
    localStorage.setItem(key, "true")
    setPanicUsedToday(true)
  }

  const hints = [
    {
      title: "Think About the Problem",
      content: "What patterns do you recognize? Consider the structure of palindromes.",
      unlocked: true,
    },
    {
      title: "Consider Your Approach",
      content: "Think about expanding around centers vs dynamic programming approaches.",
      unlocked: currentHint >= 0,
    },
    {
      title: "Implementation Details",
      content: "Remember to handle edge cases like empty strings and single characters.",
      unlocked: currentHint >= 1 && checkpointInput.trim().length > 0,
    },
  ]

  const checklistItems = ["Empty input handled?", "No duplicate logic?", "Bounds checking?"]

  if (isFocusMode) return null

  if (isLoading) {
    return (
      <div className="w-80 bg-background border-l border-border p-6 overflow-y-auto">
        <CoachSkeleton />
      </div>
    )
  }

  const showHintLadder = assistanceLevel === "Guidance"
  const showPanicToken = assistanceLevel !== "Review"

  return (
    <div className="w-80 bg-background border-l border-border p-6 overflow-y-auto">
      {/* Coach Header */}
      <div className="flex items-center gap-3 mb-6">
        <Avatar className="h-10 w-10 bg-gradient-to-br from-violet-500 to-lime-400">
          <AvatarFallback className="bg-transparent text-white font-semibold">AI</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-foreground">Your Coach</h2>
          <p className="text-sm text-muted-foreground">Personalized guidance</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Progress Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-lime-400" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Problems Solved</span>
                <span className="font-medium">12/15</span>
              </div>
              <Progress value={80} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>4 days left</span>
                <span>80% complete</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-orange-500" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-lime-400 mt-2 flex-shrink-0" />
                <p className="text-muted-foreground leading-relaxed">
                  You're excelling at <span className="text-foreground font-medium">Dynamic Programming</span> problems
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                <p className="text-muted-foreground leading-relaxed">
                  Consider reviewing <span className="text-foreground font-medium">Graph algorithms</span> - 3 recent
                  mistakes
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                <p className="text-muted-foreground leading-relaxed">
                  Your problem-solving speed improved by <span className="text-foreground font-medium">23%</span> this
                  week
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-violet-500" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-violet-500/10 to-lime-400/10 rounded-lg border border-violet-500/20">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm text-foreground">Practice Binary Search</h4>
                  <Sparkles className="h-4 w-4 text-violet-500 flex-shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground mb-3">You haven't practiced this pattern in 5 days</p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    Medium
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    15 min
                  </Badge>
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm text-foreground">Review Two Pointers</h4>
                  <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground mb-3">3 problems due for spaced repetition</p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    Easy
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    10 min
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button className="w-full justify-between bg-gradient-to-r from-violet-500 to-lime-400 hover:from-violet-600 hover:to-lime-500">
            <span>Start Daily Challenge</span>
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button variant="outline" className="w-full justify-between bg-transparent">
            <span>View Full Analytics</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Achievement Badge */}
        <Card className="bg-gradient-to-br from-lime-400/10 to-violet-500/10 border-lime-400/20">
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto text-lime-400 mb-2" />
            <h3 className="font-semibold text-sm text-foreground mb-1">Problem Solver</h3>
            <p className="text-xs text-muted-foreground">Solved 50+ problems this month</p>
          </CardContent>
        </Card>

        {/* 5-Second Checklist Card */}
        {!isChecklistDismissed && (
          <Card className="border-lime-400/20 bg-lime-400/5">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-lime-400" />
                  5-Second Check
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setIsChecklistDismissed(true)}
                  aria-label="Dismiss checklist"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {checklistItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <CheckCircle className="h-3 w-3 text-lime-400" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 3-Step Hint Ladder */}
        {showHintLadder && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-violet-500" />
                Hint Ladder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {hints.map((hint, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={hint.unlocked ? "secondary" : "outline"}
                        className={cn("text-xs", hint.unlocked && "bg-violet-500/10 border-violet-500/20")}
                      >
                        Step {index + 1}
                      </Badge>
                      <span className={cn("text-sm font-medium", !hint.unlocked && "text-muted-foreground")}> {hint.title} </span>
                    </div>
                    {hint.unlocked && currentHint === index && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setCurrentHint(index + 1)}
                      >
                        Next
                      </Button>
                    )}
                  </div>

                  {hint.unlocked && currentHint >= index && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground leading-relaxed">{hint.content}</p>
                    </div>
                  )}

                  {/* Checkpoint Input after Hint 2 */}
                  {index === 1 && hint.unlocked && currentHint >= index && (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Checkpoint: What's your approach?
                      </label>
                      <Input
                        placeholder="Describe your solution approach..."
                        value={checkpointInput}
                        onChange={(e) => setCheckpointInput(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Panic Token */}
        {showPanicToken && (
          <Dialog open={isPanicDialogOpen} onOpenChange={setIsPanicDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                disabled={panicUsedToday}
                className={cn(
                  "w-full justify-center border-orange-500/20",
                  panicUsedToday ? "opacity-60 cursor-not-allowed" : "bg-orange-500/5 hover:bg-orange-500/10 text-orange-600"
                )}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                {panicUsedToday ? "Panic Token (1/day)" : "Panic Token"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Take a Breath
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  It's okay to feel stuck. Take a moment to reflect on what you've learned so far.
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-medium">What's challenging you right now?</label>
                  <Textarea
                    placeholder="Write a quick reflection..."
                    value={panicReflection}
                    onChange={(e) => setPanicReflection(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsPanicDialogOpen(false)}>
                    Just Breathe
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-violet-500 to-lime-400 hover:from-violet-600 hover:to-lime-500"
                    onClick={() => {
                      markPanicUsed()
                      setIsPanicDialogOpen(false)
                    }}
                    disabled={panicReflection.trim().length === 0}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Reveal Solution
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
