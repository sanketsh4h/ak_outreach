import { Suspense } from 'react'
import { useI18n } from '../i18n/context'
import { usePage } from '../components/page-context'
import { GAMES, paths, type GameId, type SectionId } from '../config/sections'
import { GAME_COMPONENTS } from '../games/registry'

export default function GamePage({ section, game }: { section: SectionId; game: GameId }) {
  const { t } = useI18n()
  usePage(t(GAMES[game].titleKey), { to: paths.activity(section), label: t('games.title') })
  const Game = GAME_COMPONENTS[game]
  return (
    <>
      <h1>{t(GAMES[game].titleKey)}</h1>
      <Suspense fallback={<p role="status">{t('common.loading')}</p>}>
        <Game />
      </Suspense>
    </>
  )
}
