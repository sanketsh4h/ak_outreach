import { useI18n } from '../i18n/context'
import styles from './Placeholder.module.css'

function WarningIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 3 2 20h20zM12 10v4M12 17h.01" />
    </svg>
  )
}

/** Badge on cards and next to items that lead to placeholder content. */
export function PlaceholderTag() {
  const { t } = useI18n()
  return (
    <span className={styles.tag}>
      <WarningIcon size={16} />
      {t('placeholder.tag')}
    </span>
  )
}

/**
 * Full-width banner at the top of every placeholder story, prasang, game and
 * result. Dashed border, striped background, an icon and a bold word: it never
 * relies on colour alone.
 */
export function PlaceholderNotice() {
  const { t } = useI18n()
  return (
    <div className={styles.notice} role="note" data-testid="placeholder-notice">
      <WarningIcon size={28} />
      <p>
        <strong>{t('placeholder.noticeLead')}</strong> {t('placeholder.noticeBody')}
      </p>
    </div>
  )
}

/** Thin strip under the header while any placeholder content remains on the site. */
export function PreviewStrip() {
  const { t } = useI18n()
  return (
    <div className={styles.strip} role="note" data-testid="preview-strip">
      <WarningIcon size={18} />
      <p>{t('placeholder.strip')}</p>
    </div>
  )
}

/** Visible label placed inside a placeholder picture. */
export function PlaceholderPictureLabel() {
  const { t } = useI18n()
  return (
    <span className={styles.pictureLabel}>
      <WarningIcon size={14} />
      {t('placeholder.tag')}
    </span>
  )
}
