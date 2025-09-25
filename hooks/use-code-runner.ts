"use client"

import { useState, useRef, useCallback } from 'react'

export interface TestCase {
  input: any[]
  expected: any
  description?: string
}

export interface TestResult {
  testIndex: number
  passed: boolean
  input: any[]
  expected: any
  actual: any
  executionTime: number
  error: string | null
}

export interface ConsoleOutput {
  type: 'log' | 'error' | 'warn' | 'info'
  args: string[]
}

export interface RunResult {
  success: boolean
  error: string | null
  consoleOutput: ConsoleOutput[]
  testResults: TestResult[]
}

export function useCodeRunner() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<RunResult | null>(null)
  const workerRef = useRef<Worker | null>(null)

  const initializeWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate()
    }

    workerRef.current = new Worker('/sandbox-worker.js')
    
    workerRef.current.onmessage = (e) => {
      const { type, ...data } = e.data

      switch (type) {
        case 'result':
          setResult(data as RunResult)
          setIsRunning(false)
          break
        case 'error':
        case 'timeout':
          setResult({
            success: false,
            error: data.message,
            consoleOutput: [],
            testResults: []
          })
          setIsRunning(false)
          break
        case 'stopped':
          setIsRunning(false)
          break
      }
    }

    workerRef.current.onerror = (error) => {
      setResult({
        success: false,
        error: 'Worker error: ' + error.message,
        consoleOutput: [],
        testResults: []
      })
      setIsRunning(false)
    }
  }, [])

  const runCode = useCallback((code: string, tests: TestCase[], timeout = 5000) => {
    if (isRunning) {
      return
    }

    if (!workerRef.current) {
      initializeWorker()
    }

    setIsRunning(true)
    setResult(null)

    workerRef.current?.postMessage({
      type: 'run',
      code,
      tests,
      timeout
    })
  }, [isRunning, initializeWorker])

  const stopExecution = useCallback(() => {
    if (workerRef.current && isRunning) {
      workerRef.current.postMessage({ type: 'stop' })
    }
  }, [isRunning])

  const cleanup = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate()
      workerRef.current = null
    }
  }, [])

  return {
    isRunning,
    result,
    runCode,
    stopExecution,
    cleanup,
    initializeWorker
  }
}
