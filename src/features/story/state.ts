/**
 * Story player state: the list of node ids visited, newest last. Back undoes
 * one choice; restart goes back to the start node.
 */
export type StoryHistory = readonly string[]

export type StoryAction =
  { type: 'choose'; next: string } | { type: 'back' } | { type: 'restart'; start: string }

export function storyReducer(history: StoryHistory, action: StoryAction): StoryHistory {
  switch (action.type) {
    case 'choose':
      return [...history, action.next]
    case 'back':
      return history.length > 1 ? history.slice(0, -1) : history
    case 'restart':
      return [action.start]
  }
}
