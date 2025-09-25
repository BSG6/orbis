/**
 * Spaced Repetition Scheduling Engine
 * Implements the DCM spaced repetition algorithm based on star ratings
 */

export interface ScheduleEntry {
  problemId: string
  nextDueAt: number // timestamp
  lastRating: number // 1-5 stars
  ratingHistory: number[] // last 10 ratings
  leechCount: number // consecutive 1-star ratings
  snoozedUntil?: number // timestamp if snoozed
  createdAt: number
  updatedAt: number
}

export interface SchedulingResult {
  nextDueAt: number
  isLeech: boolean
  shouldShowMiniLesson: boolean
  daysUntilDue: number
}

/**
 * Calculate next due date based on star rating
 * 1★ → 1d, 3d, 7d trail (leech detection)
 * 2★ → ≤36h (1.5 days)
 * 3★ → 4d
 * 4★ → 14d  
 * 5★ → 30d
 */
export function calculateNextDue(rating: number, ratingHistory: number[] = []): SchedulingResult {
  const now = Date.now()
  const DAY_MS = 24 * 60 * 60 * 1000
  
  let daysUntilDue: number
  let isLeech = false
  let shouldShowMiniLesson = false

  switch (rating) {
    case 1:
      // 1★ Bombed → repeat Day 1, 3, 7 trail
      const recent1Stars = ratingHistory.slice(-2).filter(r => r === 1).length
      if (recent1Stars >= 1) { // Two 1★ in a row (including current)
        isLeech = true
        shouldShowMiniLesson = true
      }
      
      // Determine position in 1★ trail based on recent history
      const consecutive1Stars = getConsecutive1Stars(ratingHistory)
      if (consecutive1Stars === 0) {
        daysUntilDue = 1 // First 1★
      } else if (consecutive1Stars === 1) {
        daysUntilDue = 3 // Second 1★
      } else {
        daysUntilDue = 7 // Third+ 1★
      }
      break
      
    case 2:
      // 2★ Meh → tomorrow (≤36h)
      daysUntilDue = 1.5
      break
      
    case 3:
      // 3★ Got it but slow → 4 days
      daysUntilDue = 4
      break
      
    case 4:
      // 4★ Comfortable → 14 days
      daysUntilDue = 14
      break
      
    case 5:
      // 5★ Confident/teach it → 30 days
      daysUntilDue = 30
      break
      
    default:
      throw new Error(`Invalid rating: ${rating}. Must be 1-5.`)
  }

  const nextDueAt = now + (daysUntilDue * DAY_MS)

  return {
    nextDueAt,
    isLeech,
    shouldShowMiniLesson,
    daysUntilDue
  }
}

/**
 * Count consecutive 1-star ratings at the end of history
 */
function getConsecutive1Stars(ratingHistory: number[]): number {
  let count = 0
  for (let i = ratingHistory.length - 1; i >= 0; i--) {
    if (ratingHistory[i] === 1) {
      count++
    } else {
      break
    }
  }
  return count
}

/**
 * Update schedule entry with new rating
 */
export function updateScheduleEntry(
  entry: ScheduleEntry | null, 
  problemId: string, 
  rating: number
): ScheduleEntry {
  const now = Date.now()
  const ratingHistory = entry ? [...entry.ratingHistory, rating].slice(-10) : [rating] // Keep last 10
  
  const schedulingResult = calculateNextDue(rating, ratingHistory.slice(0, -1)) // Don't include current rating in history for calculation
  
  return {
    problemId,
    nextDueAt: schedulingResult.nextDueAt,
    lastRating: rating,
    ratingHistory,
    leechCount: schedulingResult.isLeech ? (entry?.leechCount || 0) + 1 : 0,
    snoozedUntil: undefined, // Clear snooze when rating
    createdAt: entry?.createdAt || now,
    updatedAt: now
  }
}

/**
 * Snooze a problem for 7 days
 */
export function snoozeProblem(entry: ScheduleEntry): ScheduleEntry {
  const now = Date.now()
  const SNOOZE_DAYS = 7
  const SNOOZE_MS = SNOOZE_DAYS * 24 * 60 * 60 * 1000
  
  return {
    ...entry,
    snoozedUntil: now + SNOOZE_MS,
    updatedAt: now
  }
}

/**
 * Check if a problem is due for review
 */
export function isProblemDue(entry: ScheduleEntry): boolean {
  const now = Date.now()
  
  // Check if snoozed
  if (entry.snoozedUntil && now < entry.snoozedUntil) {
    return false
  }
  
  // Check if due
  return now >= entry.nextDueAt
}

/**
 * Get problems due for review, respecting daily cap
 */
export function getDueProblems(
  scheduleEntries: ScheduleEntry[], 
  dailyCap: { min: number; max: number } = { min: 3, max: 5 }
): ScheduleEntry[] {
  const dueProblems = scheduleEntries
    .filter(isProblemDue)
    .sort((a, b) => a.nextDueAt - b.nextDueAt) // Oldest due first
  
  // Apply daily cap
  const cappedProblems = dueProblems.slice(0, dailyCap.max)
  
  return cappedProblems
}

/**
 * Format time until due for display
 */
export function formatTimeUntilDue(nextDueAt: number): string {
  const now = Date.now()
  const diff = nextDueAt - now
  const days = Math.ceil(diff / (24 * 60 * 60 * 1000))
  
  if (days <= 0) {
    return "Due now"
  } else if (days === 1) {
    return "Due tomorrow"
  } else if (days < 30) {
    return `Due in ${days}d`
  } else {
    const weeks = Math.round(days / 7)
    return `Due in ${weeks}w`
  }
}
