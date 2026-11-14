import pillsRaw from '../../content/pills.json'
import type { GameId } from '../config/sections'
import { pills as pillsSchema, type Pills } from './schemas'

/** A game content file after schema checking: the data, or the problems that stop it loading. */
export type Loaded<T> = { data: T; errors: [] } | { data: null; errors: string[] }

function problems(error: { issues: { path: PropertyKey[]; message: string }[] }): string[] {
  return error.issues.map((i) => `${i.path.map(String).join('.') || '(file)'}: ${i.message}`)
}

function load<T>(
  schema: {
    safeParse: (
      v: unknown,
    ) =>
      | { success: true; data: T }
      | { success: false; error: { issues: { path: PropertyKey[]; message: string }[] } }
  },
  raw: unknown,
): Loaded<T> {
  const parsed = schema.safeParse(raw)
  return parsed.success
    ? { data: parsed.data, errors: [] }
    : { data: null, errors: problems(parsed.error) }
}

export const PILLS: Loaded<Pills> = load(pillsSchema, pillsRaw)

/** The pill game shows placeholder content while any card is a placeholder or the green pill has no destination. */
export function pillsArePlaceholder(data: Pills | null = PILLS.data): boolean {
  return !data || data.greenPillUrl === null || data.cards.some((c) => c.placeholder)
}

/** Whether a game currently shows placeholder content (for badges and the preview strip). */
export function gameIsPlaceholder(id: GameId): boolean {
  switch (id) {
    case 'pills':
      return pillsArePlaceholder()
    case 'words':
    case 'doodle':
      return true
  }
}
