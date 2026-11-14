import { useI18n } from '../i18n/context'
import { usePage } from '../components/page-context'
import { Card, CardItem, CardList } from '../components/Card'
import { GameArt } from '../components/Art'
import { GAMES, SECTIONS, paths, type SectionId } from '../config/sections'

export default function GamesList({ section }: { section: SectionId }) {
  const { t } = useI18n()
  const config = SECTIONS[section]
  usePage(t('games.title'), { to: paths.section(section), label: t(config.nameKey) })
  return (
    <>
      <h1>{t('games.title')}</h1>
      <p>{t('games.lead')}</p>
      <CardList>
        {config.games.map((id) => (
          <CardItem key={id}>
            <Card
              to={paths.game(section, id)}
              title={t(GAMES[id].titleKey)}
              description={t(GAMES[id].descKey)}
              art={<GameArt />}
            />
          </CardItem>
        ))}
      </CardList>
    </>
  )
}
