import type { IconName } from '../../components/Icon'
import type { Mark } from './logic'

/** Each status has its own mark, so it never rests on colour alone: tick, dot, dash. */
export const MARK_ICON: Record<Mark, IconName> = {
  correct: 'check',
  present: 'dot',
  absent: 'dash',
}
