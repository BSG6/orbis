"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, RotateCcw, Play, CheckCircle, AlertCircle, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { ReviewSkeleton } from "./skeletons/review-skeleton"

interface ReviewScreenProps {
  isFocusMode: boolean
}

interface ReviewProblem {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  pattern: string
  lastAttempt: string
  dueDate: string
  confidence: number
  attempts: number
}

export function ReviewScreen({ isFocusMode }: ReviewScreenProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [problems] = useState<ReviewProblem[]>([
    {
      id: "1",
      title: "Two Sum",
      difficulty: "Easy",
      pattern: "Hash Table",
      lastAttempt: "2 days ago",
      dueDate: "Today",
      confidence: 3,
      attempts: 2,
    },
    {
      id: "2",
      title: "Longest Palindromic Substring",
      difficulty: "Medium",
      pattern: "Dynamic Programming",
      lastAttempt: "3 days ago",
      dueDate: "Today",
      confidence: 2,
      attempts: 1,
    },
    {
      id: "3",
      title: "Merge k Sorted Lists",
      difficulty: "Hard",
      pattern: "Heap",
      lastAttempt: "1 week ago",
      dueDate: "Yesterday",
      confidence: 1,
      attempts: 3,
    },
  ])

  const [snoozedProblems, setSnoozedProblems] = useState<Set<string>>(new Set())

  const handleSnooze = (problemId: string) => {
    setSnoozedProblems((prev) => new Set([...prev, problemId]))
  }

  const handleReview = (problemId: string) => {
    // Handle starting review for this problem
    console.log("Starting review for problem:", problemId)
  }

  if (isLoading) {
    return (
      <div className={cn("h-full flex flex-col bg-background", isFocusMode ? "p-4" : "p-6")}>
        <ReviewSkeleton />
      </div>
    )
  }

  const activeProblem = problems.filter((p) => !snoozedProblems.has(p.id))
  const hasProblems = activeProblem.length > 0

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-lime-400 bg-lime-400/10"
      case "Medium":
        return "text-orange-500 bg-orange-500/10"
      case "Hard":
        return "text-red-500 bg-red-500/10"
      default:
        return "text-muted-foreground bg-muted/10"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 4) return "text-lime-400"
    if (confidence >= 3) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className={cn("h-full flex flex-col bg-background", isFocusMode ? "p-4" : "p-6")}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className={cn("font-bold text-foreground", isFocusMode ? "text-xl" : "text-2xl")}>Review Queue</h1>
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-violet-500/10 to-lime-400/10 border-violet-500/20"
          >
            {activeProblem.length} due today
          </Badge>
        </div>
        <p className="text-muted-foreground">Reinforce your learning with spaced repetition</p>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {hasProblems ? (
          <div className="space-y-4 h-full overflow-y-auto">
            {activeProblem.map((problem) => (
              <Card key={problem.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{problem.title}</CardTitle>
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge className={cn("text-xs", getDifficultyColor(problem.difficulty))}>
                          {problem.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {problem.pattern}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{problem.lastAttempt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {problem.dueDate === "Yesterday" && <AlertCircle className="h-4 w-4 text-red-500" />}
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Confidence:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div
                              key={star}
                              className={cn(
                                "w-2 h-2 rounded-full",
                                star <= problem.confidence ? getConfidenceColor(problem.confidence) : "bg-muted",
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Attempts:</span>
                        <span className="font-medium">{problem.attempts}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleSnooze(problem.id)} className="gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Snooze
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReview(problem.id)}
                        className="gap-2 bg-gradient-to-r from-violet-500 to-lime-400 hover:from-violet-600 hover:to-lime-500"
                      >
                        <Play className="h-4 w-4" />
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 mx-auto text-lime-400 mb-4" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">All Caught Up!</h2>
                <p className="text-muted-foreground leading-relaxed">
                  No problems are due for review right now. Keep solving new problems to build your review queue.
                </p>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-violet-500 to-lime-400 hover:from-violet-600 hover:to-lime-500">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Practice New Problems
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  View All Problems
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Snoozed Problems Summary */}
      {snoozedProblems.size > 0 && (
        <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {snoozedProblems.size} problem{snoozedProblems.size !== 1 ? "s" : ""} snoozed for later
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSnoozedProblems(new Set())} className="text-xs">
              Restore All
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
                                                                                                                                                                                                                                                                                                                                             