import { Icon } from '../../components/Icon'
import type { Mark } from './logic'
import { MARK_ICON } from './marks'
import styles from './WordGame.module.css'

/** A letter tile. Its status is shown by a mark (tick, dot or dash) as well as by colour. */
export function Tile({ letter, mark }: { letter?: string; mark?: Mark }) {
  return (
    <span className={`${styles.tile} ${mark ? styles[mark] : letter ? styles.filled : ''}`}>
      <span className={styles.letter}>{letter?.toUpperCase()}</span>
      {mark && (
        <span className={styles.mark}>
          <Icon name={MARK_ICON[mark]} size={14} />
        </span>
      )}
    </span>
  )
}
