import { useI18n } from '../i18n/context'
import { usePage } from '../components/page-context'
import { Card, CardItem, CardList } from '../components/Card'
import { GameArt, PrasangArt, StoryArt } from '../components/Art'
import { SECTIONS, paths, type SectionId } from '../config/sections'
import styles from './pages.module.css'

export default function SectionHome({ section }: { section: SectionId }) {
  const { t } = useI18n()
  const config = SECTIONS[section]
  usePage(t(config.nameKey), { to: paths.home(), label: t('nav.home') })
  return (
    <>
      <h1>{t(config.nameKey)}</h1>
      <p className={styles.lead}>{t(config.leadKey)}</p>
      <CardList>
        <CardItem>
          <Card
            to={paths.activity(section)}
            title={t('part.activity.title')}
            description={t(config.activityDescKey)}
            art={<GameArt />}
          />
        </CardItem>
        <CardItem>
          <Card
            to={paths.storyList(section)}
            title={t(config.storyTitleKey)}
            description={t(config.storyDescKey)}
            art={<StoryArt />}
          />
        </CardItem>
        <CardItem>
          <Card
            to={paths.prasangList(section)}
            title={t('part.prasang.title')}
            description={t('part.prasang.desc')}
            art={<PrasangArt />}
          />
        </CardItem>
      </CardList>
    </>
  )
}
