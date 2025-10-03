/**
 * Local-only AI interfaces and deterministic template generators
 * No network calls. Designed to be fast and predictable for demo/MVP.
 */

export type AIHintSet = {
  nudge: string
  strategy: string
  specific: string
}

export type AITotalHelp = {
  eli5: string
  practical: string
  technical: string
  edgeCases: string[]
  minimalTests: { input: any[]; expected: any; note?: string }[]
}

export function generateHintLadder(problemPrompt: string): AIHintSet {
  const normalized = problemPrompt.toLowerCase()
  const isPalindrome = /palindrom/.test(normalized)
  const isTwoSum = /two\s*sum/.test(normalized)

  if (isPalindrome) {
    return {
      nudge: "Look for symmetry around a center — palindromes read the same both ways.",
      strategy:
        "Try expanding around each index (and between indices) to compare matching characters outward.",
      specific:
        "For each i, expand on (i,i) and (i,i+1) while chars match; track the longest range you find.",
    }
  }

  if (isTwoSum) {
    return {
      nudge: "Can you remember a way to check if the complement you need has appeared before?",
      strategy: "Use a hashmap: as you scan, store value→index, and check target−value in the map.",
      specific: "Iterate nums; if map.has(target−nums[i]) return [map.get(...), i]; else map.set(nums[i], i).",
    }
  }

  // Generic fallback
  return {
    nudge: "Restate the problem in one sentence and identify inputs/outputs clearly.",
    strategy: "Sketch a brute force first, then look for a pattern to prune or precompute.",
    specific: "Define helper functions for repeated work; keep state minimal; add a tiny test after each step.",
  }
}

export function generateTotalHelp(problemPrompt: string): AITotalHelp {
  const normalized = problemPrompt.toLowerCase()
  const isPalindrome = /palindrom/.test(normalized)

  if (isPalindrome) {
    return {
      eli5: "Check around each letter to see how far the same letters mirror on both sides.",
      practical:
        "For each position, expand left/right while chars match. Track the best (start,length). Return substring.",
      technical:
        "Time ~ O(n^2) worst-case by expanding around O(n) centers. Space O(1). Consider both odd/even centers.",
      edgeCases: ["Empty string", "All identical chars", "No repeated chars"],
      minimalTests: [
        { input: ["babad"], expected: "bab" },
        { input: ["cbbd"], expected: "bb" },
        { input: ["a"], expected: "a" },
      ],
    }
  }

  return {
    eli5: "Break the task into tiny steps and verify each with a tiny example.",
    practical: "Start with a straightforward method, then optimize hotspots.",
    technical: "State the approach, analyze time/space, and note invariants.",
    edgeCases: ["Empty input", "Single element", "Large input"],
    minimalTests: [{ input: [1], expected: 1 }],
  }
}

// Simple local parsing for pasted problems (very rough)
export function extractProblemFields(input: string): {
  title: string
  prompt: string
  constraints?: string
  examples?: string
  tags?: string[]
} {
  const lines = input.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const title = lines[0] || "Untitled Problem"
  const rest = lines.slice(1).join("\n")
  const constraintsMatch = rest.match(/constraints?:\s*([\s\S]*)/i)
  const examplesMatch = rest.match(/examples?:\s*([\s\S]*)/i)

  return {
    title,
    prompt: rest.replace(/constraints?:[\s\S]*/i, "").trim(),
    constraints: constraintsMatch?.[1]?.trim(),
    examples: examplesMatch?.[1]?.trim(),
    tags: inferTagsFromText(input),
  }
}

function inferTagsFromText(text: string): string[] {
  const t = text.toLowerCase()
  const tags = new Set<string>()
  if (/hash\s*table|map/.test(t)) tags.add("Hash Map")
  if (/stack/.test(t)) tags.add("Stack")
  if (/queue/.test(t)) tags.add("Queue")
  if (/palindrom/.test(t)) tags.add("String")
  if (/two\s*pointers/.test(t)) tags.add("Two Pointers")
  if (/dp|dynamic\s*programming/.test(t)) tags.add("DP")
  return Array.from(tags)
}

// Error classification heuristics (8 categories per PRD)
export type ErrorCategory =
  | "Off-by-one"
  | "Boundary/empty input"
  | "Wrong DS choice"
  | "Complexity blow-up"
  | "Duplicate handling"
  | "Index mix-up"
  | "Recursion base/loop condition"
  | "Graph visitation/state"

export function classifyError(message: string): ErrorCategory {
  const m = message.toLowerCase()
  if (/out\s*of\s*bounds|index|length\s*-?\s*1/.test(m)) return "Off-by-one"
  if (/empty|undefined|null/.test(m)) return "Boundary/empty input"
  if (/timeout|too\s*slow|exceeded/.test(m)) return "Complexity blow-up"
  if (/duplicate|seen\s*before|set/.test(m)) return "Duplicate handling"
  if (/map|object vs array|structure/.test(m)) return "Wrong DS choice"
  if (/i\+\+.*j\+\+|swap\s*i\s*and\s*j/.test(m)) return "Index mix-up"
  if (/base\s*case|infinite\s*loop|while\s*\(true\)/.test(m)) return "Recursion base/loop condition"
  if (/visited|graph|bfs|dfs|cycle/.test(m)) return "Graph visitation/state"
  return "Boundary/empty input"
}


