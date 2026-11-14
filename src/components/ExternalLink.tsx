import { useId, useRef, type ReactNode } from 'react'
import { useI18n } from '../i18n/context'
import { Icon } from './Icon'
import styles from './ExternalLink.module.css'

function hostOf(href: string): string {
  try {
    return new URL(href).host
  } catch {
    return href
  }
}

/**
 * Every link that leaves the site goes through a "You are leaving this site"
 * step first. (The green pill is the one deliberate exception.)
 */
export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  const { t } = useI18n()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  const close = () => dialogRef.current?.close()

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => dialogRef.current?.showModal()}
      >
        {children}
        <Icon name="external" size={16} />
        <span className="visually-hidden">{t('external.opensNewTab')}</span>
      </button>
      <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={titleId}>
        <h2 id={titleId}>{t('external.title')}</h2>
        <p>{t('external.body', { host: hostOf(href) })}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.stay} onClick={close} autoFocus>
            {t('external.stay')}
          </button>
          <a
            className={styles.go}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
          >
            {t('external.continue')}
            <Icon name="external" size={16} />
          </a>
        </div>
      </dialog>
    </>
  )
}
