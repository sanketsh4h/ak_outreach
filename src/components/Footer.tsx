import { useI18n } from '../i18n/context'
import { ORGANISATION, TRANSLATION_REVIEWED } from '../config/site'
import styles from './Footer.module.css'

export function Footer() {
  const { t, l, lang } = useI18n()
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {ORGANISATION.name && <p className={styles.org}>{l(ORGANISATION.name)}</p>}
        {ORGANISATION.contact && <p>{l(ORGANISATION.contact)}</p>}
        {!TRANSLATION_REVIEWED[lang] && (
          <p className={styles.note} data-testid="translation-note">
            {t('footer.translationNote')}
          </p>
        )}
        <p>{t('footer.privacy')}</p>
      </div>
    </footer>
  )
}
