import { BrowserRouter, Route, Routes } from 'react-router'
import { I18nProvider } from './i18n/I18nProvider'
import { Layout } from './components/Layout'
import { GAMES, SECTION_LIST } from './config/sections'
import Intro from './pages/Intro'
import SectionHome from './pages/SectionHome'
import GamesList from './pages/GamesList'
import GamePage from './pages/GamePage'
import ItemList from './pages/ItemList'
import NotFound from './pages/NotFound'

/** React Router wants the base path without a trailing slash. */
const basename = import.meta.env.BASE_URL.replace(/\/+$/, '') || '/'

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Intro />} />
            {SECTION_LIST.map((s) => (
              <Route key={s.id} path={s.slug}>
                <Route index element={<SectionHome section={s.id} />} />
                <Route path="activity" element={<GamesList section={s.id} />} />
                {s.games.map((g) => (
                  <Route
                    key={g}
                    path={`activity/${GAMES[g].slug}`}
                    element={<GamePage section={s.id} game={g} />}
                  />
                ))}
                <Route path={s.storySegment} element={<ItemList section={s.id} kind="story" />} />
                <Route path={`${s.storySegment}/:id`} element={<NotFound section={s.id} item />} />
                <Route path="prasang" element={<ItemList section={s.id} kind="prasang" />} />
                <Route path="prasang/:id" element={<NotFound section={s.id} item />} />
                <Route path="*" element={<NotFound section={s.id} />} />
              </Route>
            ))}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  )
}
