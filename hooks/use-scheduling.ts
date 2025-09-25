"use client"

import { useState, useCallback, useEffect } from 'react'
import { 
  ScheduleEntry, 
  updateScheduleEntry, 
  snoozeProblem as snoozeEntry, 
  getDueProblems,
  formatTimeUntilDue,
} from '@/lib/scheduling'
import { getAllSchedules, getScheduleByProblemId, upsertSchedule } from '@/lib/db'

interface UseSchedulingReturn {
  scheduleEntries: ScheduleEntry[]
  rateProblem: (problemId: string, rating: number) => Promise<void>
  snoozeProblemById: (problemId: string) => Promise<void>
  getDueProblemsForToday: () => ScheduleEntry[]
  getScheduleEntry: (problemId: string) => ScheduleEntry | undefined
  getTimeUntilDue: (problemId: string) => string
  isLoading: boolean
}

export function useScheduling(): UseSchedulingReturn {
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load schedule entries from IndexedDB on mount
  useEffect(() => {
    const load = async () => {
      try {
        const all = await getAllSchedules()
        setScheduleEntries(all as unknown as ScheduleEntry[])
      } catch (e) {
        console.error('Failed to load schedules', e)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const persist = useCallback(async (entry: ScheduleEntry) => {
    await upsertSchedule(entry as any)
  }, [])

  // Rate a problem and update its schedule
  const rateProblem = useCallback(async (problemId: string, rating: number) => {
    setScheduleEntries(prev => {
      const existingEntry = prev.find(entry => entry.problemId === problemId) || null
      const updatedEntry = updateScheduleEntry(existingEntry, problemId, rating)
      // Fire-and-forget persist
      persist(updatedEntry)
      const newEntries = existingEntry 
        ? prev.map(entry => entry.problemId === problemId ? updatedEntry : entry)
        : [...prev, updatedEntry]
      return newEntries
    })
  }, [persist])

  // Snooze a problem for 7 days
  const snoozeProblemById = useCallback(async (problemId: string) => {
    setScheduleEntries(prev => {
      const entry = prev.find(e => e.problemId === problemId)
      if (!entry) return prev
      const updated = snoozeEntry(entry)
      persist(updated)
      return prev.map(e => e.problemId === problemId ? updated : e)
    })
  }, [persist])

  // Get problems due for review today
  const getDueProblemsForToday = useCallback(() => {
    return getDueProblems(scheduleEntries, { min: 3, max: 5 })
  }, [scheduleEntries])

  // Get schedule entry for a specific problem
  const getScheduleEntry = useCallback((problemId: string) => {
    return scheduleEntries.find(entry => entry.problemId === problemId)
  }, [scheduleEntries])

  // Get formatted time until due for a problem
  const getTimeUntilDue = useCallback((problemId: string) => {
    const entry = getScheduleEntry(problemId)
    if (!entry) return "Not scheduled"
    return formatTimeUntilDue(entry.nextDueAt)
  }, [getScheduleEntry])

  return {
    scheduleEntries,
    rateProblem,
    snoozeProblemById,
    getDueProblemsForToday,
    getScheduleEntry,
    getTimeUntilDue,
    isLoading
  }
}
