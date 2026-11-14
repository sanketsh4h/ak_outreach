import { useI18n } from '../i18n/context'
import type { MessageKey } from '../i18n/messages'
import styles from './ContentError.module.css'

/** Shown instead of a story or prasang whose content file has problems. Never shows partial content. */
export function ContentError({ titleKey, problems }: { titleKey: MessageKey; problems: string[] }) {
  const { t } = useI18n()
  return (
    <div className={styles.error} role="alert">
      <h1>{t(titleKey)}</h1>
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
