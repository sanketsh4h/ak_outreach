import { Navigate } from 'react-router'
import { useI18n } from '../i18n/context'
import { localizedLang } from '../i18n/localized'
import { usePage } from '../components/page-context'
import { Card, CardItem, CardList } from '../components/Card'
import { PrasangArt, StoryArt } from '../components/Art'
import { SECTIONS, paths, type SectionId } from '../config/sections'
import { prasangsFor, storiesFor } from '../content'
import styles from './pages.module.css'

/**
 * List of stories or prasangs in a section. With exactly one item the list
 * goes straight to it, so the item stays within three taps of the intro page.
 */
export default function ItemList({
  section,
  kind,
}: {
  section: SectionId
  kind: 'story' | 'prasang'
}) {
  const { t, l, lang } = useI18n()
  const config = SECTIONS[section]
  const items = kind === 'story' ? storiesFor(section) : prasangsFor(section)
  const title = kind === 'story' ? t(config.storyListTitleKey) : t('list.prasang.title')
  const itemPath = (id: string) =>
    kind === 'story' ? paths.story(section, id) : paths.prasang(section, id)
  usePage(title, { to: paths.section(section), label: t(config.nameKey) })

  const only = items.length === 1 ? items[0] : undefined
  if (only) return <Navigate to={itemPath(only.id)} replace />

  return (
    <>
      <h1>{title}</h1>
      {items.length === 0 ? (
        <p className={styles.empty}>{t('list.empty')}</p>
      ) : (
        <CardList>
          {items.map((item) => (
            <CardItem key={item.id}>
              <Card
                to={itemPath(item.id)}
                title={l(item.title)}
                lang={localizedLang(item.title, lang)}
                art={kind === 'story' ? <StoryArt /> : <PrasangArt />}
                placeholder={item.placeholder}
              />
            </CardItem>
          ))}
        </CardList>
      )}
    </>
  )
}
