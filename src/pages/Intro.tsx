import { useI18n } from '../i18n/context'
import { usePage } from '../components/page-context'
import { Card, CardItem, CardList } from '../components/Card'
import { KiteArt, LampArt } from '../components/Art'
import { SECTIONS, paths } from '../config/sections'
import { INTRO_COPY_IS_PLACEHOLDER } from '../config/site'
import { PlaceholderNotice } from '../components/Placeholder'
import styles from './pages.module.css'

export default function Intro() {
  const { t } = useI18n()
  usePage(t('site.title'))
  return (
    <>
      <h1>{t('site.title')}</h1>
      {INTRO_COPY_IS_PLACEHOLDER && <PlaceholderNotice />}
      <p className={styles.lead}>{t('site.tagline')}</p>
      <p>{t('intro.lead')}</p>
      <CardList>
        <CardItem>
          <Card
            to={paths.section('bhulkao')}
            title={t(SECTIONS.bhulkao.nameKey)}
            description={t(SECTIONS.bhulkao.introDescKey)}
            art={<KiteArt />}
            stack
          />
        </CardItem>
        <CardItem>
          <Card
            to={paths.section('yuvako')}
            title={t(SECTIONS.yuvako.nameKey)}
            description={t(SECTIONS.yuvako.introDescKey)}
            art={<LampArt />}
            stack
          />
        </CardItem>
      </CardList>
    </>
  )
}
