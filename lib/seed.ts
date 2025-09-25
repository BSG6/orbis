"use client"

import { getAllProblems, putProblems, type ProblemRecord } from "@/lib/db"

export async function seedProblemsIfEmpty() {
  const existing = await getAllProblems()
  if (existing && existing.length > 0) return

  const now = Date.now()
  const problems: ProblemRecord[] = [
    {
      id: "longest-palindrome-sample",
      title: "Longest Palindromic Substring",
      prompt:
        "Given a string s, return the longest palindromic substring in s.",
      constraints: "1 <= s.length <= 1000",
      examples: "Input: 'babad' → 'bab' or 'aba'",
      tags: ["strings", "two-pointers", "dp"],
      source: "seed",
      createdAt: now,
    },
    {
      id: "two-sum-sample",
      title: "Two Sum",
      prompt:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      constraints: "2 <= nums.length <= 10^4",
      examples: "Input: nums=[2,7,11,15], target=9 → [0,1]",
      tags: ["hashmap"],
      source: "seed",
      createdAt: now,
    },
    {
      id: "valid-parentheses-sample",
      title: "Valid Parentheses",
      prompt:
        "Given a string s containing just the characters '()[]{}', determine if the input string is valid.",
      constraints: "1 <= s.length <= 10^4",
      examples: "Input: s='()[]{}' → true",
      tags: ["stack"],
      source: "seed",
      createdAt: now,
    },
  ]

  await putProblems(problems)
}
