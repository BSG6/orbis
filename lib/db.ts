import { openDB, type IDBPDatabase } from 'idb'

export type ProblemRecord = {
  id: string
  title: string
  prompt: string
  constraints?: string
  examples?: string
  tags?: string[]
  source?: string
  createdAt: number
}

export type ScheduleRecord = {
  problemId: string
  nextDueAt: number
  lastRating: number
  ratingHistory: number[]
  leechCount: number
  snoozedUntil?: number
  createdAt: number
  updatedAt: number
}

export type FavoriteRecord = {
  problemId: string
  reasonTags: string[]
  isArchived?: boolean
  activeUntil?: number
  createdAt: number
  updatedAt: number
}

export type OrbisDB = IDBPDatabase<unknown>

let dbPromise: Promise<IDBPDatabase<unknown>> | null = null

export async function getDB(): Promise<IDBPDatabase<unknown>> {
  if (!dbPromise) {
    dbPromise = openDB('orbis-db', 2, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('problems')) {
          const problems = db.createObjectStore('problems', { keyPath: 'id' })
          problems.createIndex('by_createdAt', 'createdAt')
        }
        if (!db.objectStoreNames.contains('schedules')) {
          const schedules = db.createObjectStore('schedules', { keyPath: 'problemId' })
          schedules.createIndex('by_nextDueAt', 'nextDueAt')
        }
        if (!db.objectStoreNames.contains('favorites')) {
          const favorites = db.createObjectStore('favorites', { keyPath: 'problemId' })
          favorites.createIndex('by_createdAt', 'createdAt')
        }
      },
    })
  }
  return dbPromise
}

// Problems CRUD
export async function putProblems(records: ProblemRecord[]): Promise<void> {
  const db = await getDB()
  const tx = (db as any).transaction('problems', 'readwrite')
  const store = tx.objectStore('problems')
  for (const rec of records) {
    await store.put(rec)
  }
  await tx.done
}

export async function getAllProblems(): Promise<ProblemRecord[]> {
  const db = await getDB()
  return (db as any).getAll('problems')
}

export async function getProblemById(id: string): Promise<ProblemRecord | undefined> {
  const db = await getDB()
  return (db as any).get('problems', id)
}

// Schedules CRUD
export async function upsertSchedule(record: ScheduleRecord): Promise<void> {
  const db = await getDB()
  const tx = (db as any).transaction('schedules', 'readwrite')
  await tx.objectStore('schedules').put(record)
  await tx.done
}

export async function getAllSchedules(): Promise<ScheduleRecord[]> {
  const db = await getDB()
  return (db as any).getAll('schedules')
}

export async function getScheduleByProblemId(problemId: string): Promise<ScheduleRecord | undefined> {
  const db = await getDB()
  return (db as any).get('schedules', problemId)
}

// Favorites CRUD
export async function getFavoriteByProblemId(problemId: string): Promise<FavoriteRecord | undefined> {
  const db = await getDB()
  return (db as any).get('favorites', problemId)
}

export async function putFavorite(record: FavoriteRecord): Promise<void> {
  const db = await getDB()
  const tx = (db as any).transaction('favorites', 'readwrite')
  await tx.objectStore('favorites').put(record)
  await tx.done
}

export async function deleteFavorite(problemId: string): Promise<void> {
  const db = await getDB()
  const tx = (db as any).transaction('favorites', 'readwrite')
  await tx.objectStore('favorites').delete(problemId)
  await tx.done
}

export async function getAllFavorites(): Promise<FavoriteRecord[]> {
  const db = await getDB()
  return (db as any).getAll('favorites')
}
