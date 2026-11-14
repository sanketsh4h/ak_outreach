import { describe, expect, it } from 'vitest'
import {
  boardReducer,
  dailyIndex,
  keyboardMarks,
  localDayNumber,
  newBoard,
  practiceIndex,
  scoreGuess,
  statusOf,
  type Board,
  type BoardAction,
} from './logic'

describe('scoreGuess (two-pass)', () => {
  it('marks an exact match as all correct', () => {
    expect(scoreGuess('seva', 'seva')).toEqual(['correct', 'correct', 'correct', 'correct'])
  })

  it('marks letters in the wrong place as present', () => {
    expect(scoreGuess('aves', 'seva')).toEqual(['present', 'present', 'present', 'present'])
  })

  it('handles the three a\'s in "swadharma"', () => {
    // answer: s w a d h a r m a   (a at 2, 5, 8)
    // guess:  a a a a a a a a a
    expect(scoreGuess('aaaaaaaaa', 'swadharma')).toEqual([
      'absent',
      'absent',
      'correct',
      'absent',
      'absent',
      'correct',
      'absent',
      'absent',
      'correct',
    ])
  })

  it('marks only as many extra copies present as remain unmatched', () => {
    // answer s w a d h a r m a; guess has a at 0 and 1 (wrong places) and 2 (right place).
    // One a is matched in place, two remain, so both misplaced a's are present.
    expect(scoreGuess('aaxxxxxxx', 'swadharma').slice(0, 3)).toEqual([
      'present',
      'present',
      'absent',
    ])
    expect(scoreGuess('aaaxxxxxx', 'swadharma').slice(0, 3)).toEqual([
      'present',
      'present',
      'correct',
    ])
    // Four a's against three: one correct, two present, the fourth absent.
    expect(scoreGuess('aaaxaxxxx', 'swadharma').slice(0, 5)).toEqual([
      'present',
      'present',
      'correct',
      'absent',
      'absent',
    ])
  })

  it('does not mark a repeated guess letter present when the answer has it once', () => {
    expect(scoreGuess('ssss', 'seva')).toEqual(['correct', 'absent', 'absent', 'absent'])
    expect(scoreGuess('vvvv', 'seva')).toEqual(['absent', 'absent', 'correct', 'absent'])
  })
})

describe('keyboardMarks', () => {
  it('keeps the best mark each letter has earned', () => {
    const marks = keyboardMarks(['aves', 'sxva'], 'seva')
    expect(marks.get('s')).toBe('correct')
    expect(marks.get('a')).toBe('correct')
    expect(marks.get('e')).toBe('present')
    expect(marks.get('x')).toBe('absent')
  })
})

describe('daily word', () => {
  it('uses the local calendar date', () => {
    expect(localDayNumber(new Date(2026, 10, 14, 0, 0, 1))).toBe(
      localDayNumber(new Date(2026, 10, 14, 23, 59)),
    )
    expect(localDayNumber(new Date(2026, 10, 15))).toBe(localDayNumber(new Date(2026, 10, 14)) + 1)
    expect(localDayNumber(new Date(1970, 0, 1))).toBe(0)
  })

  it('is the day number modulo the list length', () => {
    const day = new Date(2026, 10, 14)
    expect(dailyIndex(day, 12)).toBe(localDayNumber(day) % 12)
    const next = new Date(2026, 10, 15)
    expect(dailyIndex(next, 12)).toBe((dailyIndex(day, 12) + 1) % 12)
    expect(dailyIndex(new Date(1970, 0, 13), 12)).toBe(0)
  })

  it("never picks today's word for practice", () => {
    const day = new Date(2026, 10, 14)
    const daily = dailyIndex(day, 12)
    for (let i = 0; i < 100; i++) {
      const pick = practiceIndex(day, 12, () => i / 100)
      expect(pick).not.toBe(daily)
      expect(pick).toBeGreaterThanOrEqual(0)
      expect(pick).toBeLessThan(12)
    }
    expect(practiceIndex(day, 1, Math.random)).toBe(0)
  })
})

describe('boardReducer', () => {
  const play = (board: Board, actions: BoardAction[]) => actions.reduce(boardReducer, board)
  const type = (word: string): BoardAction[] => [
    ...[...word].map((letter) => ({ type: 'letter', letter }) as BoardAction),
    { type: 'submit' },
  ]

  it('accepts only a–z and stops at the answer length', () => {
    const b = play(newBoard('seva'), [
      { type: 'letter', letter: 'S' },
      { type: 'letter', letter: '1' },
      { type: 'letter', letter: 'ગ' },
      ...[...'sevaa'].map((letter) => ({ type: 'letter', letter }) as BoardAction),
    ])
    expect(b.typed).toBe('seva')
  })

  it('flags a short guess instead of submitting it', () => {
    const b = play(newBoard('seva'), [{ type: 'letter', letter: 's' }, { type: 'submit' }])
    expect(b.tooShort).toBe(true)
    expect(b.guesses).toEqual([])
    expect(boardReducer(b, { type: 'backspace' }).tooShort).toBe(false)
  })

  it('plays to a win', () => {
    const b = play(newBoard('seva'), [...type('daya'), ...type('seva')])
    expect(b.guesses).toEqual(['daya', 'seva'])
    expect(statusOf(b.guesses, b.answer)).toBe('won')
    expect(play(b, type('daya')).guesses).toHaveLength(2) // no input after the end
  })

  it('plays to a loss after six guesses', () => {
    const b = play(newBoard('seva'), Array.from({ length: 6 }, () => type('daya')).flat())
    expect(statusOf(b.guesses, b.answer)).toBe('lost')
  })
})
