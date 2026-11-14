import { useI18n } from '../i18n/context'
import type { MessageKey } from '../i18n/messages'
import styles from './ContentError.module.css'

/** Shown instead of a story or prasang whose content file has problems. Never shows partial content. */
export function ContentError({
  titleKey,
  problems,
  level = 1,
}: {
  titleKey: MessageKey
  problems: string[]
  /** Heading level: 1 on its own page, 2 inside a game page that already has an h1. */
  level?: 1 | 2
}) {
  const { t } = useI18n()
  const Heading = level === 1 ? 'h1' : 'h2'
  return (
    <div className={styles.error} role="alert">
      <Heading>{t(titleKey)}</Heading>
      <p>{t('content.error.body')}</p>
      <details>
        <summary>{t('content.error.details')}</summary>
        <ul lang="en">
          {problems.map((p) => (
            <li key={p}>
              <code>{p}</code>
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}
