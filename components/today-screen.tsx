"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, Play, Terminal, FileText, Lightbulb, HelpCircle, Zap, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { CoachRightRail } from "./coach-right-rail"
import { CodeEditor } from "./code-editor"
import { TestRunner } from "./test-runner"
import { useScheduling } from "@/hooks/use-scheduling"
import { getProblemById } from "@/lib/db"
import { getFavoriteByProblemId, putFavorite, deleteFavorite } from "@/lib/db"

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
  
  // Scheduling system
  const { rateProblem, getTimeUntilDue } = useScheduling()
  
  // Current problem ID (in a real app, this would come from routing or problem selection)
  const currentProblemId = "longest-palindrome-sample"

  // Load current problem details from DB
  const [problemTitle, setProblemTitle] = useState<string>("Today's Challenge")
  const [promptText, setPromptText] = useState<string>(
    "Implement a function that finds the longest palindromic substring in a given string. Your solution should be efficient and handle edge cases properly."
  )
  const [constraintsText, setConstraintsText] = useState<string>(
    "Time complexity should be O(n²) or better; Handle empty strings and single characters; Case-sensitive palindrome detection; Return the first occurrence if multiple exist"
  )
  const [examplesText, setExamplesText] = useState<string>(
    "Input: \"babad\" → \"bab\" or \"aba\"\nInput: \"cbbd\" → \"bb\""
  )

  useEffect(() => {
    let mounted = true
    getProblemById(currentProblemId).then((p) => {
      if (!mounted || !p) return
      if (p.title) setProblemTitle(p.title)
      if (p.prompt) setPromptText(p.prompt)
      if (p.constraints) setConstraintsText(p.constraints)
      if (p.examples) setExamplesText(p.examples)
    }).catch(() => {})
    getFavoriteByProblemId(currentProblemId).then((fav) => {
      if (!mounted) return
      setIsFavorited(!!fav)
    }).catch(() => {})
    return () => { mounted = false }
  }, [])

  const [code, setCode] = useState(`function longestPalindrome(s) {
    // Your solution here
    
}`)

  // Sample test cases for the current problem
  const testCases = [
    {
      input: ["babad"],
      expected: "bab",
      description: "Basic palindrome case"
    },
    {
      input: ["cbbd"],
      expected: "bb",
      description: "Even length palindrome"
    },
    {
      input: ["a"],
      expected: "a",
      description: "Single character"
    },
    {
      input: ["ac"],
      expected: "a",
      description: "No palindrome longer than 1"
    }
  ]

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

  const constraintsList = constraintsText.split(/;|\n/).map((s) => s.trim()).filter(Boolean)
  const examplesList = examplesText.split(/\n/).map((s) => s.trim()).filter(Boolean)

  return (
    <div className="h-full flex">
      <div className={cn("flex-1 flex flex-col bg-background transition-layout", isFocusMode ? "p-4" : "p-6")}>
        <div className={cn("transition-all duration-300", isFocusMode && isInstructionsCollapsed ? "mb-2" : "mb-6")}>
          <div className="flex items-center justify-between mb-2">
            <h1 className={cn("font-bold text-foreground transition-all", isFocusMode ? "text-xl" : "text-2xl")}>
              {problemTitle}
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
                <TabsTrigger value="Prompt" className={cn("data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/20 data-[state=active]:to-lime-400/20 data-[state=active]:border-violet-500/30", isFocusMode && "text-xs")}>
                  Prompt
                </TabsTrigger>
                <TabsTrigger value="Constraints" className={cn("data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/20 data-[state=active]:to-lime-400/20 data-[state=active]:border-violet-500/30", isFocusMode && "text-xs")}>
                  Constraints
                </TabsTrigger>
                <TabsTrigger value="Examples" className={cn("data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/20 data-[state=active]:to-lime-400/20 data-[state=active]:border-violet-500/30", isFocusMode && "text-xs")}>
                  Examples
                </TabsTrigger>
              </TabsList>

              <TabsContent value="Prompt" className="mt-4">
                <Card>
                  <CardContent className={cn("p-6", isFocusMode && "p-4")}>                  
                    <p className={cn("text-muted-foreground leading-relaxed", isFocusMode && "text-sm")}>{promptText}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="Constraints" className="mt-4">
                <Card>
                  <CardContent className={cn("p-6", isFocusMode && "p-4")}>
                    <h3 className={cn("font-semibold mb-3 text-foreground", isFocusMode && "text-sm")}>Requirements</h3>
                    <ul className={cn("space-y-2 text-muted-foreground", isFocusMode && "text-sm space-y-1")}>                    
                      {constraintsList.length > 0 ? constraintsList.map((c, idx) => (
                        <li key={idx}>• {c}</li>
                      )) : (
                        <li>• No specific constraints provided</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="Examples" className="mt-4">
                <Card>
                  <CardContent className={cn("p-6", isFocusMode && "p-4")}>
                    <h3 className={cn("font-semibold mb-3 text-foreground", isFocusMode && "text-sm")}>Test Cases</h3>
                    <div className={cn("space-y-3 font-mono text-sm", isFocusMode && "space-y-2 text-xs")}>                    
                      {examplesList.map((ex, idx) => (
                        <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                          <div className="text-muted-foreground">{ex}</div>
                        </div>
                      ))}
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
                  "h-full border-t border-border",
                  isFocusMode ? "min-h-[500px]" : "min-h-[300px]",
                )}
              >
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  theme="dark"
                  placeholder="// Start coding here..."
                  className="h-full border-0 rounded-none"
                />
              </div>
            </CardContent>
          </Card>

          {!isFocusMode && (
            <div className="flex-1">
              <TestRunner
                code={code}
                tests={testCases}
                className="h-full"
              />
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
                    onClick={async () => {
                      setStars(star)
                      await rateProblem(currentProblemId, star)
                    }}
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
              {stars > 0 && (
                <div className={cn("text-muted-foreground", isFocusMode ? "text-xs" : "text-sm")}>
                  Next due: {getTimeUntilDue(currentProblemId)}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className={cn("flex items-center gap-2", isFocusMode ? "h-6 px-2" : "h-8 px-3")}
              onClick={async () => {
                const now = Date.now()
                if (isFavorited) {
                  await deleteFavorite(currentProblemId)
                  setIsFavorited(false)
                } else {
                  await putFavorite({
                    problemId: currentProblemId,
                    reasonTags: ["Tricky"],
                    isArchived: false,
                    activeUntil: undefined,
                    createdAt: now,
                    updatedAt: now,
                  })
                  setIsFavorited(true)
                }
              }}
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
              {isFocusMode ? "Run & Test" : "Submit Solution"}
            </Button>
          </div>
        </div>
      </div>

      <CoachRightRail
        isCollapsed={isCoachCollapsed}
        onToggleCollapse={() => setIsCoachCollapsed(!isCoachCollapsed)}
        isFocusMode={isFocusMode}
        assistanceLevel={assistanceLevel}
      />
    </div>
  )
}
