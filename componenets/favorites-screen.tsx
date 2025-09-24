"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, Archive, Play, MoreHorizontal, Star, Target, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { FavoritesSkeleton } from "./skeletons/favorites-skeleton"

interface FavoritesScreenProps {
  isFocusMode: boolean
}

interface FavoriteProblem {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  pattern: string
  reason: string[]
  dateAdded: string
  lastSolved: string
  rating: number
  isArchived: boolean
}

export function FavoritesScreen({ isFocusMode }: FavoritesScreenProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [problems] = useState<FavoriteProblem[]>([
    {
      id: "1",
      title: "Two Sum",
      difficulty: "Easy",
      pattern: "Hash Table",
      reason: ["Foundation", "Interview"],
      dateAdded: "2 weeks ago",
      lastSolved: "3 days ago",
      rating: 5,
      isArchived: false,
    },
    {
      id: "2",
      title: "Valid Parentheses",
      difficulty: "Easy",
      pattern: "Stack",
      reason: ["Clean Solution", "Tricky"],
      dateAdded: "1 week ago",
      lastSolved: "1 day ago",
      rating: 4,
      isArchived: false,
    },
    {
      id: "3",
      title: "Longest Palindromic Substring",
      difficulty: "Medium",
      pattern: "Dynamic Programming",
      reason: ["Elegant", "Multiple Approaches"],
      dateAdded: "5 days ago",
      lastSolved: "2 days ago",
      rating: 4,
      isArchived: false,
    },
    {
      id: "4",
      title: "Merge k Sorted Lists",
      difficulty: "Hard",
      pattern: "Heap",
      reason: ["Complex", "Good Practice"],
      dateAdded: "3 weeks ago",
      lastSolved: "1 week ago",
      rating: 3,
      isArchived: false,
    },
    {
      id: "5",
      title: "Binary Tree Inorder Traversal",
      difficulty: "Easy",
      pattern: "Tree",
      reason: ["Foundation"],
      dateAdded: "1 month ago",
      lastSolved: "2 weeks ago",
      rating: 4,
      isArchived: true,
    },
    {
      id: "6",
      title: "3Sum",
      difficulty: "Medium",
      pattern: "Two Pointers",
      reason: ["Tricky", "Interview"],
      dateAdded: "3 weeks ago",
      lastSolved: "10 days ago",
      rating: 3,
      isArchived: true,
    },
  ])

  const [collapsedPatterns, setCollapsedPatterns] = useState<Set<string>>(new Set())

  if (isLoading) {
    return (
      <div className={cn("h-full flex flex-col bg-background", isFocusMode ? "p-4" : "p-6")}>
        <FavoritesSkeleton />
      </div>
    )
  }

  const activeProblems = problems.filter((p) => !p.isArchived)
  const archivedProblems = problems.filter((p) => p.isArchived)

  // Group active problems by pattern
  const groupedProblems = activeProblems.reduce(
    (acc, problem) => {
      if (!acc[problem.pattern]) {
        acc[problem.pattern] = []
      }
      acc[problem.pattern].push(problem)
      return acc
    },
    {} as Record<string, FavoriteProblem[]>,
  )

  const togglePatternCollapse = (pattern: string) => {
    setCollapsedPatterns((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(pattern)) {
        newSet.delete(pattern)
      } else {
        newSet.add(pattern)
      }
      return newSet
    })
  }

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

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case "Foundation":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "Interview":
        return "bg-violet-500/10 text-violet-400 border-violet-500/20"
      case "Tricky":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      case "Elegant":
        return "bg-lime-400/10 text-lime-400 border-lime-400/20"
      case "Complex":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  return (
    <div className={cn("h-full flex flex-col bg-background", isFocusMode ? "p-4" : "p-6")}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className={cn("font-bold text-foreground", isFocusMode ? "text-xl" : "text-2xl")}>Favorites</h1>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-violet-500/10 to-lime-400/10 border-violet-500/20"
            >
              {activeProblems.length}/20 Active
            </Badge>
            {activeProblems.length >= 20 && (
              <Badge variant="outline" className="text-orange-500 border-orange-500/20">
                Cap Reached
              </Badge>
            )}
          </div>
        </div>
        <p className="text-muted-foreground">Your curated collection of important problems</p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-6">
        {/* Active Favorites - Grouped by Pattern */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Heart className="h-5 w-5 text-violet-500" />
            Active Favorites
          </h2>

          {Object.keys(groupedProblems).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(groupedProblems).map(([pattern, patternProblems]) => {
                const isCollapsed = collapsedPatterns.has(pattern)

                return (
                  <Card key={pattern}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          className="flex items-center gap-2 p-0 h-auto font-semibold text-foreground hover:bg-transparent"
                          onClick={() => togglePatternCollapse(pattern)}
                        >
                          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          <Target className="h-4 w-4 text-violet-500" />
                          {pattern}
                        </Button>
                        <Badge variant="outline" className="text-xs">
                          {patternProblems.length} problem{patternProblems.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </CardHeader>

                    {!isCollapsed && (
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {patternProblems.map((problem) => (
                            <div key={problem.id} className="p-4 bg-muted/30 rounded-lg border border-border">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="font-medium text-foreground mb-2">{problem.title}</h4>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge className={cn("text-xs", getDifficultyColor(problem.difficulty))}>
                                      {problem.difficulty}
                                    </Badge>
                                    {problem.reason.map((reason) => (
                                      <Badge
                                        key={reason}
                                        variant="outline"
                                        className={cn("text-xs", getReasonColor(reason))}
                                      >
                                        {reason}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={cn(
                                          "h-3 w-3",
                                          star <= problem.rating
                                            ? "fill-lime-400 text-lime-400"
                                            : "text-muted-foreground",
                                        )}
                                      />
                                    ))}
                                  </div>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-4">
                                  <span>Added {problem.dateAdded}</span>
                                  <span>Last solved {problem.lastSolved}</span>
                                </div>
                                <Button
                                  size="sm"
                                  className="gap-2 bg-gradient-to-r from-violet-500 to-lime-400 hover:from-violet-600 hover:to-lime-500"
                                >
                                  <Play className="h-3 w-3" />
                                  Solve
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Favorites Yet</h3>
                <p className="text-muted-foreground mb-4">Start favoriting problems you want to revisit</p>
                <Button className="bg-gradient-to-r from-violet-500 to-lime-400 hover:from-violet-600 hover:to-lime-500">
                  Browse Problems
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Archive Section */}
        {archivedProblems.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Archive className="h-5 w-5 text-muted-foreground" />
                Archive
              </h2>

              <div className="grid gap-3">
                {archivedProblems.map((problem) => (
                  <Card key={problem.id} className="opacity-75">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-1">{problem.title}</h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={cn("text-xs", getDifficultyColor(problem.difficulty))}>
                              {problem.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {problem.pattern}
                            </Badge>
                            {problem.reason.map((reason) => (
                              <Badge
                                key={reason}
                                variant="outline"
                                className={cn("text-xs opacity-60", getReasonColor(reason))}
                              >
                                {reason}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "h-3 w-3 opacity-60",
                                  star <= problem.rating ? "fill-lime-400 text-lime-400" : "text-muted-foreground",
                                )}
                              />
                            ))}
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-60">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
