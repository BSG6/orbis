"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Square, CheckCircle, XCircle, Clock, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCodeRunner, TestCase, TestResult, ConsoleOutput } from "@/hooks/use-code-runner"

interface TestRunnerProps {
  code: string
  tests: TestCase[]
  className?: string
}

export function TestRunner({ code, tests, className }: TestRunnerProps) {
  const { isRunning, result, runCode, stopExecution, initializeWorker } = useCodeRunner()
  const [runCount, setRunCount] = useState(0)

  useEffect(() => {
    initializeWorker()
  }, [initializeWorker])

  const handleRun = () => {
    runCode(code, tests)
    setRunCount(prev => prev + 1)
  }

  const handleStop = () => {
    stopExecution()
  }

  const passedTests = result?.testResults?.filter(t => t.passed).length || 0
  const totalTests = result?.testResults?.length || 0

  return (
    <div className={cn("space-y-4", className)}>
      {/* Run Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={isRunning ? handleStop : handleRun}
            disabled={!code.trim() || tests.length === 0}
            className={cn(
              "gap-2",
              isRunning 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-gradient-to-r from-violet-500 to-lime-400 hover:from-violet-600 hover:to-lime-500"
            )}
          >
            {isRunning ? (
              <>
                <Square className="h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Tests
              </>
            )}
          </Button>
          
          {runCount > 0 && (
            <Badge variant="outline" className="text-xs">
              Run #{runCount}
            </Badge>
          )}
        </div>

        {result && !isRunning && (
          <div className="flex items-center gap-2">
            <Badge 
              variant={passedTests === totalTests ? "default" : "destructive"}
              className={cn(
                "text-xs",
                passedTests === totalTests 
                  ? "bg-lime-400/10 text-lime-400 border-lime-400/20" 
                  : "bg-red-500/10 text-red-500 border-red-500/20"
              )}
            >
              {passedTests}/{totalTests} Passed
            </Badge>
          </div>
        )}
      </div>

      {/* Test Results */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Tests Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-lime-400" />
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.error ? (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-red-500 mb-2">
                    <XCircle className="h-4 w-4" />
                    <span className="font-medium">Execution Error</span>
                  </div>
                  <p className="text-sm text-red-400 font-mono">{result.error}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {result.testResults.map((test, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-3 rounded-lg border",
                        test.passed 
                          ? "bg-lime-400/5 border-lime-400/20" 
                          : "bg-red-500/5 border-red-500/20"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {test.passed ? (
                            <CheckCircle className="h-4 w-4 text-lime-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="font-medium text-sm">
                            Test {index + 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {test.executionTime.toFixed(2)}ms
                        </div>
                      </div>
                      
                      <div className="text-xs space-y-1 font-mono">
                        <div>
                          <span className="text-muted-foreground">Input:</span>{" "}
                          <span className="text-foreground">{JSON.stringify(test.input)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expected:</span>{" "}
                          <span className="text-lime-400">{JSON.stringify(test.expected)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Actual:</span>{" "}
                          <span className={test.passed ? "text-lime-400" : "text-red-400"}>
                            {test.error || JSON.stringify(test.actual)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Console Output */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Terminal className="h-5 w-5 text-lime-400" />
                Console
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 overflow-y-auto bg-muted/30 rounded-lg p-3 font-mono text-sm">
                {result.consoleOutput.length === 0 ? (
                  <div className="text-muted-foreground text-center py-8">
                    No console output
                  </div>
                ) : (
                  <div className="space-y-1">
                    {result.consoleOutput.map((output, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex gap-2",
                          output.type === 'error' && "text-red-400",
                          output.type === 'warn' && "text-yellow-400",
                          output.type === 'info' && "text-blue-400",
                          output.type === 'log' && "text-foreground"
                        )}
                      >
                        <span className="text-muted-foreground text-xs">
                          [{output.type}]
                        </span>
                        <span>{output.args.join(' ')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {isRunning && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-violet-500 border-t-transparent"></div>
            <span>Running tests...</span>
          </div>
        </div>
      )}
    </div>
  )
}
