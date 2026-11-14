import { describe, expect, it } from 'vitest'
import { storyReducer } from './state'

describe('storyReducer', () => {
  it('records each choice, undoes one with back, and restarts', () => {
    let h = storyReducer(['start'], { type: 'choose', next: 'b' })
    h = storyReducer(h, { type: 'choose', next: 'c' })
    expect(h).toEqual(['start', 'b', 'c'])
    h = storyReducer(h, { type: 'back' })
    expect(h).toEqual(['start', 'b'])
    expect(storyReducer(['start'], { type: 'back' })).toEqual(['start'])
    expect(storyReducer(h, { type: 'restart', start: 'start' })).toEqual(['start'])
  })
})
