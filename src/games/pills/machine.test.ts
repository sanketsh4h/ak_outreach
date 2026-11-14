import { describe, expect, it } from 'vitest'
import { START, pillReducer, type PillAction, type PillState } from './machine'

const run = (count: number, actions: PillAction[], from: PillState = START) =>
  actions.reduce(pillReducer(count), from)

describe('pill game machine', () => {
  it('walks the red path card by card to the green pill', () => {
    expect(run(3, [{ type: 'choose', path: 'red' }])).toEqual({ screen: 'red', index: 0 })
    expect(run(3, [{ type: 'choose', path: 'red' }, { type: 'next' }, { type: 'next' }])).toEqual({
      screen: 'red',
      index: 2,
    })
    expect(
      run(3, [
        { type: 'choose', path: 'red' },
        { type: 'next' },
        { type: 'next' },
        { type: 'next' },
      ]),
    ).toEqual({ screen: 'green', from: 'red' })
  })

  it('goes back one card, and from the first card back to the start', () => {
    expect(run(3, [{ type: 'choose', path: 'red' }, { type: 'next' }, { type: 'back' }])).toEqual({
      screen: 'red',
      index: 0,
    })
    expect(run(3, [{ type: 'choose', path: 'red' }, { type: 'back' }])).toEqual(START)
  })

  it('dissolves the blue screen into the green pill', () => {
    expect(run(3, [{ type: 'choose', path: 'blue' }])).toEqual({ screen: 'blue' })
    expect(run(3, [{ type: 'choose', path: 'blue' }, { type: 'dissolve' }])).toEqual({
      screen: 'green',
      from: 'blue',
    })
  })

  it('opens and closes the placeholder destination, and starts over from anywhere', () => {
    const green: PillState = { screen: 'green', from: 'blue' }
    expect(run(3, [{ type: 'openDestination' }], green)).toEqual({
      screen: 'destination',
      from: 'blue',
    })
    expect(run(3, [{ type: 'openDestination' }, { type: 'closeDestination' }], green)).toEqual(
      green,
    )
    expect(run(3, [{ type: 'startOver' }], green)).toEqual(START)
  })

  it('lets the other pill be chosen after finishing', () => {
    const green: PillState = { screen: 'green', from: 'red' }
    expect(run(3, [{ type: 'choose', path: 'blue' }], green)).toEqual({ screen: 'blue' })
  })

  it('ignores actions that do not apply to the current screen', () => {
    expect(run(3, [{ type: 'next' }])).toEqual(START)
    expect(run(3, [{ type: 'dissolve' }])).toEqual(START)
  })

  it('skips straight to the green pill when there are no red cards', () => {
    expect(run(0, [{ type: 'choose', path: 'red' }])).toEqual({ screen: 'green', from: 'red' })
  })
})
