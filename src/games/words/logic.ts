/** Pure logic for the word game. No React, no storage: easy to test. */

export const MAX_GUESSES = 6

export type Mark = 'correct' | 'present' | 'absent'

/**
 * Standard two-pass scoring. First mark letters in the right place; then, for
 * the rest, mark a letter "present" only while unmatched copies of it remain
 * in the answer. This marks repeated letters correctly (e.g. the three a's in
 * "swadharma").
 */
export function scoreGuess(guess: string, answer: string): Mark[] {
  const marks: Mark[] = Array.from({ length: guess.length }, () => 'absent')
  const remaining = new Map<string, number>()
  for (let i = 0; i < answer.length; i++) {
    const a = answer[i] as string
    if (guess[i] === a) marks[i] = 'correct'
    else remaining.set(a, (remaining.get(a) ?? 0) + 1)
  }
  for (let i = 0; i < guess.length; i++) {
    if (marks[i] === 'correct') continue
    const g = guess[i] as string
    const left = remaining.get(g) ?? 0
    if (left > 0) {
      marks[i] = 'present'
      remaining.set(g, left - 1)
    }
  }
  return marks
}

const RANK: Record<Mark, number> = { absent: 0, present: 1, correct: 2 }

/** The best mark each letter has earned so far, for the on-screen keyboard. */
export function keyboardMarks(guesses: readonly string[], answer: string): Map<string, Mark> {
  const best = new Map<string, Mark>()
  for (const guess of guesses) {
    scoreGuess(guess, answer).forEach((mark, i) => {
      const letter = guess[i] as string
      const current = best.get(letter)
      if (!current || RANK[mark] > RANK[current]) best.set(letter, mark)
    })
  }
  return best
}

/** Only lowercase a–z letters. */
export function isLetter(key: string): boolean {
  return /^[a-z]$/.test(key)
}

/** Days since 1 January 1970 for the visitor's local calendar date. */
export function localDayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000)
}

/** Today's word: local day number modulo the length of the list. */
export function dailyIndex(date: Date, count: number): number {
  if (count <= 0) throw new Error('the word list is empty')
  return localDayNumber(date) % count
}

/** A random practice word that is never today's daily word (when there is more than one word). */
export function practiceIndex(date: Date, count: number, random: () => number): number {
  const daily = dailyIndex(date, count)
  if (count === 1) return daily
  const pick = Math.floor(random() * (count - 1))
  return pick >= daily ? pick + 1 : pick
}

export type GameStatus = 'playing' | 'won' | 'lost'

export function statusOf(guesses: readonly string[], answer: string): GameStatus {
  if (guesses.includes(answer)) return 'won'
  return guesses.length >= MAX_GUESSES ? 'lost' : 'playing'
}

export interface Board {
  answer: string
  guesses: string[]
  typed: string
  /** Set when Enter is pressed with too few letters. */
  tooShort: boolean
}

export type BoardAction =
  | { type: 'letter'; letter: string }
  | { type: 'backspace' }
  | { type: 'submit' }
  | { type: 'load'; answer: string; guesses: string[] }

export function newBoard(answer: string, guesses: string[] = []): Board {
  return { answer, guesses, typed: '', tooShort: false }
}

export function boardReducer(board: Board, action: BoardAction): Board {
  if (action.type === 'load') return newBoard(action.answer, action.guesses)
  if (statusOf(board.guesses, board.answer) !== 'playing') return board
  switch (action.type) {
    case 'letter':
      if (!isLetter(action.letter) || board.typed.length >= board.answer.length) return board
      return { ...board, typed: board.typed + action.letter, tooShort: false }
    case 'backspace':
      return { ...board, typed: board.typed.slice(0, -1), tooShort: false }
    case 'submit':
      if (board.typed.length !== board.answer.length) return { ...board, tooShort: true }
      return { ...board, guesses: [...board.guesses, board.typed], typed: '', tooShort: false }
  }
}
