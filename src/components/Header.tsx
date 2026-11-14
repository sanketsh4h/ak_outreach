import { Link } from 'react-router'
import { useI18n } from '../i18n/context'
import { Icon } from './Icon'
import { LanguageSwitch } from './LanguageSwitch'
import type { BackLink } from './page-context'
import styles from './Header.module.css'

export function Header({ back }: { back?: BackLink }) {
  const { t } = useI18n()
  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link to="/" className={styles.title}>
          {t('site.title')}
        </Link>
        <LanguageSwitch />
      </div>
      {back && (
        <nav className={styles.backNav} aria-label={t('nav.backLabel')}>
          <Link to={back.to} className={styles.back}>
            <Icon name="back" size={18} />
            {t('nav.back', { page: back.label })}
          </Link>
        </nav>
      )}
    </header>
  )
}
