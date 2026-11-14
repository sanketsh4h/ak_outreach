import { useId, type ReactNode } from 'react'
import { Icon } from './Icon'
import styles from './LessonBox.module.css'

/** Shared highlighted box for the lesson at a story ending and the moral of a prasang. */
export function LessonBox({ heading, children }: { heading: string; children: ReactNode }) {
  const id = useId()
  return (
    <aside className={styles.box} aria-labelledby={id}>
      <h2 id={id} className={styles.heading}>
        <Icon name="lightbulb" size={24} />
        {heading}
      </h2>
      <div className={styles.body}>{children}</div>
    </aside>
  )
}
