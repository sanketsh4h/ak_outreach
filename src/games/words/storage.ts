import { STORAGE_KEYS } from '../../config/site'
import { readStored, writeStored } from '../../i18n/storage'
import { MAX_GUESSES } from './logic'

interface SavedDay {
  day: number
  word: string
  guesses: string[]
}

/** The saved guesses for today's word, or null when there are none (or they belong to another day). */
export function loadDaily(day: number, word: string): string[] | null {
  const raw = readStored(STORAGE_KEYS.wordsDaily)
  if (!raw) return null
  try {
    const saved = JSON.parse(raw) as Partial<SavedDay>
    if (saved.day !== day || saved.word !== word || !Array.isArray(saved.guesses)) return null
    const guesses = saved.guesses.filter(
      (g): g is string => typeof g === 'string' && g.length === word.length && /^[a-z]+$/.test(g),
    )
    return guesses.slice(0, MAX_GUESSES)
  } catch {
    return null
  }
}

/** Save today's guesses. Only one day is ever kept: older days are overwritten. */
export function saveDaily(day: number, word: string, guesses: string[]): void {
  const saved: SavedDay = { day, word, guesses }
  writeStored(STORAGE_KEYS.wordsDaily, JSON.stringify(saved))
}
