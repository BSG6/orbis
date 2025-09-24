"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, Play, Terminal, FileText, Lightbulb, HelpCircle, Zap, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { CoachRightRail } from "./coach-right-rail"

interface TodayScreenProps {
  isFocusMode: boolean
}

type AssistanceLevel = "Review" | "Guidance" | "Total Help"

export function TodayScreen({ isFocusMode }: TodayScreenProps) {
  const [activeInstructionTab, setActiveInstructionTab] = useState("Prompt")
  const [assistanceLevel, setAssistanceLevel] = useState<AssistanceLevel>("Guidance")
  const [stars, setStars] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isInstructionsCollapsed, setIsInstructionsCollapsed] = useState(false)
  const [isCoachCollapsed, setIsCoachCollapsed] = useState(false)

  const assistanceLevels: { value: AssistanceLevel; label: string; description: string; icon: any }[] = [
    {
      value: "Review",
      label: "Review",
      description: "Check your solution after completion",
      icon: FileText,
    },
    {
      value: "Guidance",
      label: "Guidance",
      description: "Get hints and direction when stuck",
      icon: Lightbulb,
    },
    {
      value: "Total Help",
      label: "Total Help",
      description: "Step-by-step assistance throughout",
      icon: HelpCircle,
    },
  ]

  return (
    <div className="h-full flex">
      <div className={cn("flex-1 flex flex-col bg-background transition-layout", isFocusMode ? "p-4" : "p-6")}>
        <div className={cn("transition-all duration-300", isFocusMode && isInstructionsCollapsed ? "mb-2" : "mb-6")}>
          <div className="flex items-center justify-between mb-2">
            <h1 className={cn("font-bold text-foreground transition-all", isFocusMode ? "text-xl" : "text-2xl")}>
              Today's Challenge
            </h1>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-violet-500/10 to-lime-400/10 border-violet-500/20"
              >
                Day 42
              </Badge>
              {isFocusMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsInstructionsCollapsed(!isInstructionsCollapsed)}
                  className="h-8 w-8 p-0"
                  aria-label={isInstructionsCollapsed ? "Show instructions" : "Hide instructions"}
                >
                  {isInstructionsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
          {(!isFocusMode || !isInstructionsCollapsed) && (
            <p className="text-muted-foreground">Build your coding skills with today's focused practice session</p>
          )}
        </div>

        {(!isFocusMode || !isInstructionsCollapsed) && (
          <div className={cn("transition-all duration-300", isFocusMode ? "mb-4" : "mb-6")}>
            <Tabs value={activeInstructionTab} onValueChange={setActiveInstructionTab} className="w-full">
              <TabsList className={cn("grid w-full grid-cols-3 bg-muted/50", isFocusMode && "h-9")}>
                <TabsTrigger
                  value="Prompt"
                  className={cn(
                    "data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/20 data-[state=active]:to-lime-400/20 data-[state=active]:border-violet-500/30",
                    isFocusMode && "text-xs",
                  )}
                >
                  Prompt
                </TabsTrigger>
                <TabsTrigger
                  value="Constraints"
                  className={cn(
                    "data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/20 data-[state=active]:to-lime-400/20 data-[state=active]:border-violet-500/30",
                    isFocusMode && "text-xs",
                  )}
                >
                  Constraints
                </TabsTrigger>
                <TabsTrigger
                  value="Examples"
                  className={cn(
                    "data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/20 data-[state=active]:to-lime-400/20 data-[state=active]:border-violet-500/30",
                    isFocusMode && "text-xs",
                  )}
                >
                  Examples
                </TabsTrigger>
              </TabsList>

              <TabsContent value="Prompt" className="mt-4">
                <Card>
                  <CardContent className={cn("p-6", isFocusMode && "p-4")}>
                    <h3 className={cn("font-semibold mb-3 text-foreground", isFocusMode && "text-sm")}>
                      Today's Problem
                    </h3>
                    <p className={cn("text-muted-foreground leading-relaxed", isFocusMode && "text-sm")}>
                      Implement a function that finds the longest palindromic substring in a given string. Your solution
                      should be efficient and handle edge cases properly.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="Constraints" className="mt-4">
                <Card>
                  <CardContent className={cn("p-6", isFocusMode && "p-4")}>
                    <h3 className={cn("font-semibold mb-3 text-foreground", isFocusMode && "text-sm")}>Requirements</h3>
                    <ul className={cn("space-y-2 text-muted-foreground", isFocusMode && "text-sm space-y-1")}>
                      <li>• Time complexity should be O(n²) or better</li>
                      <li>• Handle empty strings and single characters</li>
                      <li>• Case-sensitive palindrome detection</li>
                      <li>• Return the first occurrence if multiple exist</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="Examples" className="mt-4">
                <Card>
                  <CardContent className={cn("p-6", isFocusMode && "p-4")}>
                    <h3 className={cn("font-semibold mb-3 text-foreground", isFocusMode && "text-sm")}>Test Cases</h3>
                    <div className={cn("space-y-3 font-mono text-sm", isFocusMode && "space-y-2 text-xs")}>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="text-muted-foreground">Input: "babad"</div>
                        <div className="text-lime-400">Output: "bab" or "aba"</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="text-muted-foreground">Input: "cbbd"</div>
                        <div className="text-lime-400">Output: "bb"</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {(!isFocusMode || !isInstructionsCollapsed) && (
          <div className={cn("transition-all duration-300", isFocusMode ? "mb-4" : "mb-6")}>
            <h3 className={cn("font-medium text-foreground mb-3", isFocusMode ? "text-xs" : "text-sm")}>
              Assistance Level
            </h3>
            <div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
              {assistanceLevels.map((level) => {
                const Icon = level.icon
                const isActive = assistanceLevel === level.value

                return (
                  <Button
                    key={level.value}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-1 h-auto transition-all",
                      "focus-visible:ring-2 focus-visible:ring-violet-500",
                      isFocusMode ? "py-2 px-2" : "py-3 px-4",
                      isActive && [
                        "bg-gradient-to-r from-violet-500/10 to-lime-400/10",
                        "border border-violet-500/20",
                        "shadow-sm",
                      ],
                    )}
                    onClick={() => setAssistanceLevel(level.value)}
                  >
                    <Icon
                      className={cn(
                        "transition-colors",
                        isFocusMode ? "h-3 w-3" : "h-4 w-4",
                        isActive ? "text-violet-500" : "text-muted-foreground",
                      )}
                    />
                    <span className={cn("font-medium", isFocusMode ? "text-xs" : "text-xs")}>{level.label}</span>
                  </Button>
                )
              })}
            </div>
            {!isFocusMode && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {assistanceLevels.find((l) => l.value === assistanceLevel)?.description}
              </p>
            )}
          </div>
        )}

        <div
          className={cn(
            "flex-1 min-h-0 transition-all duration-300",
            isFocusMode ? "grid grid-cols-1" : "grid grid-cols-1 lg:grid-cols-2 gap-6",
          )}
        >
          <Card className={cn("flex flex-col", isFocusMode && "col-span-full")}>
            <CardHeader className={cn("pb-3", isFocusMode && "pb-2")}>
              <CardTitle className={cn("flex items-center gap-2", isFocusMode ? "text-base" : "text-lg")}>
                <Terminal className={cn("text-violet-500", isFocusMode ? "h-4 w-4" : "h-5 w-5")} />
                Code Editor
                {isFocusMode && (
                  <Badge variant="outline" className="ml-auto text-xs">
                    Focus Mode
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <div
                className={cn(
                  "h-full bg-muted/30 border-t border-border flex items-center justify-center",
                  isFocusMode ? "min-h-[500px]" : "min-h-[300px]",
                )}
              >
                <div className="text-center text-muted-foreground">
                  <Terminal className={cn("mx-auto mb-3 opacity-50", isFocusMode ? "h-16 w-16" : "h-12 w-12")} />
                  <p className={cn(isFocusMode ? "text-base" : "text-sm")}>Start coding here...</p>
                  <p className={cn("mt-1", isFocusMode ? "text-sm" : "text-xs")}>
                    {isFocusMode
                      ? "Full-screen editor for distraction-free coding"
                      : "Your solution will appear in this editor"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {!isFocusMode && (
            <div className="flex flex-col gap-4">
              <Card className="flex-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Play className="h-5 w-5 text-lime-400" />
                    Output
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <div className="h-full min-h-[140px] bg-muted/30 border-t border-border flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Play className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Run your code to see output</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-lime-400" />
                    Console
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <div className="h-full min-h-[140px] bg-muted/30 border-t border-border flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Debug info and logs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex items-center justify-between bg-card/50 rounded-lg border border-border transition-all duration-300",
            isFocusMode ? "mt-4 p-3" : "mt-6 p-4",
          )}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={cn("text-muted-foreground", isFocusMode ? "text-xs" : "text-sm")}>Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="sm"
                    className={cn("p-0 hover:bg-transparent", isFocusMode ? "h-6 w-6" : "h-8 w-8")}
                    onClick={() => setStars(star)}
                  >
                    <Star
                      className={cn(
                        "transition-colors",
                        isFocusMode ? "h-3 w-3" : "h-4 w-4",
                        star <= stars ? "fill-lime-400 text-lime-400" : "text-muted-foreground",
                      )}
                    />
                  </Button>
                ))}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className={cn("flex items-center gap-2", isFocusMode ? "h-6 px-2" : "h-8 px-3")}
              onClick={() => setIsFavorited(!isFavorited)}
            >
              <Heart
                className={cn(
                  "transition-colors",
                  isFocusMode ? "h-3 w-3" : "h-4 w-4",
                  isFavorited ? "fill-violet-500 text-violet-500" : "text-muted-foreground",
                )}
              />
              <span className={cn(isFocusMode ? "text-xs" : "text-sm")}>{isFavorited ? "Favorited" : "Favorite"}</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size={isFocusMode ? "sm" : "sm"} className={isFocusMode ? "text-xs h-8" : ""}>
              Reset
            </Button>
            <Button
              className={cn(
                "bg-gradient-to-r from-violet-500 to-lime-400 hover:from-violet-600 hover:to-lime-500 text-white",
                isFocusMode ? "text-xs h-8" : "",
              )}
              size={isFocusMode ? "sm" : "sm"}
            >
              Submit Solution
            </Button>
          </div>
        </div>
      </div>

      <CoachRightRail
        isCollapsed={isCoachCollapsed}
        onToggleCollapse={() => setIsCoachCollapsed(!isCoachCollapsed)}
        isFocusMode={isFocusMode}
      />
    </div>
  )
}
