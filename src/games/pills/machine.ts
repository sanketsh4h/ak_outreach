/**
 * The pill game as a small state machine:
 * start → red (one card at a time) → green
 * start → blue ("look away" screen, dissolves) → green
 * green → destination (on-site placeholder, only while no URL is set)
 */
export type PillPath = 'red' | 'blue'

export type PillState =
  | { screen: 'start' }
  | { screen: 'red'; index: number }
  | { screen: 'blue' }
  | { screen: 'green'; from: PillPath }
  | { screen: 'destination'; from: PillPath }

export type PillAction =
  | { type: 'choose'; path: PillPath }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'dissolve' }
  | { type: 'openDestination' }
  | { type: 'closeDestination' }
  | { type: 'startOver' }

export const START: PillState = { screen: 'start' }

export function pillReducer(redCount: number) {
  return (state: PillState, action: PillAction): PillState => {
    switch (action.type) {
      case 'choose':
        if (action.path === 'blue') return { screen: 'blue' }
        return redCount > 0 ? { screen: 'red', index: 0 } : { screen: 'green', from: 'red' }
      case 'next':
        if (state.screen !== 'red') return state
        return state.index + 1 < redCount
          ? { screen: 'red', index: state.index + 1 }
          : { screen: 'green', from: 'red' }
      case 'back':
        if (state.screen !== 'red') return state
        return state.index > 0 ? { screen: 'red', index: state.index - 1 } : START
      case 'dissolve':
        return state.screen === 'blue' ? { screen: 'green', from: 'blue' } : state
      case 'openDestination':
        return state.screen === 'green' ? { screen: 'destination', from: state.from } : state
      case 'closeDestination':
        return state.screen === 'destination' ? { screen: 'green', from: state.from } : state
      case 'startOver':
        return START
    }
  }
}
