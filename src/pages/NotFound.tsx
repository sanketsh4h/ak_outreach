import { Link } from 'react-router'
import { useI18n } from '../i18n/context'
import { usePage } from '../components/page-context'
import { SECTIONS, paths, type SectionId } from '../config/sections'
import styles from './pages.module.css'

interface NotFoundProps {
  /** When set, offer a link back to this section. */
  section?: SectionId
  /** True when a story or prasang id was not found (rather than a whole page). */
  item?: boolean
}

export default function NotFound({ section, item }: NotFoundProps) {
  const { t } = useI18n()
  const back = section
    ? { to: paths.section(section), label: t(SECTIONS[section].nameKey) }
    : { to: paths.home(), label: t('nav.home') }
  usePage(t('notFound.title'), back)
  return (
    <>
      <h1>{t('notFound.title')}</h1>
      <p>{item ? t('notFound.itemBody') : t('notFound.body')}</p>
      <ul className={styles.links}>
        {section && (
          <li>
            <Link to={paths.section(section)}>
              {t('notFound.section', { section: t(SECTIONS[section].nameKey) })}
            </Link>
          </li>
        )}
        <li>
          <Link to={paths.home()}>{t('notFound.home')}</Link>
        </li>
      </ul>
    </>
  )
}
