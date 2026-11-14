import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useI18n } from '../../i18n/context'
import { localizedLang } from '../../i18n/localized'
import { Icon } from '../../components/Icon'
import { ExternalLink } from '../../components/ExternalLink'
import { ContentError } from '../../components/ContentError'
import { PlaceholderNotice, PlaceholderTag } from '../../components/Placeholder'
import { focusElement } from '../../components/focus'
import { usePrefersReducedMotion } from '../../components/motion'
import { PILLS, pillsArePlaceholder } from '../../content/games'
import type { PillCard, Pills } from '../../content/schemas'
import { START, pillReducer, type PillPath } from './machine'
import styles from './PillGame.module.css'

type PillColour = 'red' | 'blue' | 'green'

function Capsule() {
  return (
    <svg className={styles.capsule} viewBox="0 0 48 24" aria-hidden="true" focusable="false">
      <rect
        x="1.5"
        y="1.5"
        width="45"
        height="21"
        rx="10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path d="M12 1.5h12v21H12a10.5 10.5 0 010-21z" fill="currentColor" />
    </svg>
  )
}

function PillLabel({ colour }: { colour: PillColour }) {
  const { t } = useI18n()
  return (
    <>
      <Capsule />
      <span className={styles.pillText}>
        <span className={styles.pillName}>{t(`pills.${colour}.name`)}</span>
        <span className={styles.pillHint}>{t(`pills.${colour}.hint`)}</span>
      </span>
    </>
  )
}

/** The green pill opens its URL in a new tab, or the on-site placeholder screen while none is set. */
export function GreenPill({
  url,
  onPlaceholder,
}: {
  url: string | null
  onPlaceholder: () => void
}) {
  const { t } = useI18n()
  if (url) {
    return (
      <a
        className={`${styles.pill} ${styles.green}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <PillLabel colour="green" />
        <Icon name="external" size={20} />
        <span className="visually-hidden">{t('pills.green.newTab')}</span>
      </a>
    )
  }
  return (
    <button type="button" className={`${styles.pill} ${styles.green}`} onClick={onPlaceholder}>
      <PillLabel colour="green" />
    </button>
  )
}

/** The "look away" screen. Dissolves after about three seconds or on tap; reduced motion gets a Continue button instead. */
function BlueScreen({ card, onDone }: { card: PillCard | undefined; onDone: () => void }) {
  const { t, l, lang } = useI18n()
  const reduced = usePrefersReducedMotion()
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (reduced || fading) return
    const id = window.setTimeout(() => setFading(true), 3000)
    return () => window.clearTimeout(id)
  }, [reduced, fading])

  useEffect(() => {
    if (!fading) return
    const id = window.setTimeout(onDone, 900)
    return () => window.clearTimeout(id)
  }, [fading, onDone])

  const text = card ? <span lang={localizedLang(card.text, lang)}>{l(card.text)}</span> : null

  if (reduced) {
    return (
      <div className={styles.bliss}>
        <p className={styles.blissText}>{text}</p>
        <button type="button" className={styles.primary} onClick={onDone}>
          {t('pills.continue')}
          <Icon name="arrow-right" size={20} />
        </button>
      </div>
    )
  }
  return (
    <button
      type="button"
      className={`${styles.bliss} ${styles.blissButton} ${fading ? styles.fading : ''}`}
      onClick={() => setFading(true)}
      data-testid="blue-screen"
    >
      <span className={styles.blissText}>{text}</span>
      <span className={styles.blissHint}>{t('pills.blue.tap')}</span>
    </button>
  )
}

function CardSource({ card }: { card: PillCard }) {
  const { t, l } = useI18n()
  if (!card.source) {
    return (
      <p className={styles.sourceNeeded}>
        <Icon name="dash" size={16} />
        {t('pills.sourceNeeded')}
      </p>
    )
  }
  return (
    <p className={styles.source}>
      {t('pills.sourceLabel')}{' '}
      {card.source.url ? (
        <ExternalLink href={card.source.url}>{l(card.source.text)}</ExternalLink>
      ) : (
        l(card.source.text)
      )}
    </p>
  )
}

export function PillGameView({ data }: { data: Pills }) {
  const { t, l, lang } = useI18n()
  const reds = useMemo(() => data.cards.filter((c) => c.path === 'red'), [data])
  const blues = useMemo(() => data.cards.filter((c) => c.path === 'blue'), [data])
  const reducer = useMemo(() => pillReducer(reds.length), [reds.length])
  const [state, dispatch] = useReducer(reducer, START)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const isFirst = useRef(true)

  // Move focus to each new screen's heading (a new card, the blue screen, the green pill...).
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    focusElement(headingRef.current)
  }, [state])

  const redCard = state.screen === 'red' ? reds[state.index] : undefined
  const dissolve = useCallback(() => dispatch({ type: 'dissolve' }), [])
  const choose = (path: PillPath) => dispatch({ type: 'choose', path })
  const other: PillPath | null =
    state.screen === 'green' || state.screen === 'destination'
      ? state.from === 'red'
        ? 'blue'
        : 'red'
      : null

  const endActions = other && (
    <div className={styles.actions}>
      <button
        type="button"
        className={styles.secondary}
        onClick={() => dispatch({ type: 'startOver' })}
      >
        <Icon name="restart" size={20} />
        {t('pills.startOver')}
      </button>
      <button type="button" className={styles.secondary} onClick={() => choose(other)}>
        {t(other === 'red' ? 'pills.tryRed' : 'pills.tryBlue')}
      </button>
    </div>
  )

  return (
    <div className={styles.game} data-testid="pill-game" data-screen={state.screen}>
      {pillsArePlaceholder(data) && <PlaceholderNotice />}

      {state.screen === 'start' && (
        <section className={styles.screen}>
          <h2 ref={headingRef}>{t('pills.prompt')}</h2>
          <div className={styles.choices}>
            <button
              type="button"
              className={`${styles.pill} ${styles.red}`}
              onClick={() => choose('red')}
            >
              <PillLabel colour="red" />
            </button>
            <button
              type="button"
              className={`${styles.pill} ${styles.blue}`}
              onClick={() => choose('blue')}
            >
              <PillLabel colour="blue" />
            </button>
          </div>
        </section>
      )}

      {state.screen === 'red' && redCard && (
        <section className={styles.screen}>
          <p className={styles.eyebrow}>{t('pills.red.title')}</p>
          <h2 ref={headingRef}>
            {t('pills.progress', { n: state.index + 1, total: reds.length })}
          </h2>
          <ol className={styles.dots} aria-hidden="true">
            {reds.map((_, i) => (
              <li key={i} className={i <= state.index ? styles.dotDone : undefined} />
            ))}
          </ol>
          <article className={styles.card}>
            <p className={styles.cardText} lang={localizedLang(redCard.text, lang)}>
              {l(redCard.text)}
            </p>
            <CardSource card={redCard} />
          </article>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => dispatch({ type: 'back' })}
            >
              <Icon name="arrow-left" size={20} />
              {t('pills.back')}
            </button>
            <button
              type="button"
              className={styles.primary}
              onClick={() => dispatch({ type: 'next' })}
            >
              {state.index + 1 < reds.length ? t('pills.next') : t('pills.continue')}
              <Icon name="arrow-right" size={20} />
            </button>
          </div>
        </section>
      )}

      {state.screen === 'blue' && (
        <section className={styles.screen}>
          <h2 ref={headingRef}>{t('pills.blue.title')}</h2>
          <BlueScreen card={blues[0]} onDone={dissolve} />
        </section>
      )}

      {state.screen === 'green' && (
        <section className={styles.screen}>
          <h2 ref={headingRef}>{t('pills.green.title')}</h2>
          {state.from === 'blue' ? (
            blues.slice(1).map((card, i) => (
              <p key={i} className={styles.message} lang={localizedLang(card.text, lang)}>
                {l(card.text)}
              </p>
            ))
          ) : (
            <p>{t('pills.green.fromRed')}</p>
          )}
          <p>{t('pills.green.prompt')}</p>
          <div className={styles.greenRow}>
            <GreenPill
              url={data.greenPillUrl}
              onPlaceholder={() => dispatch({ type: 'openDestination' })}
            />
            {data.greenPillUrl === null && <PlaceholderTag />}
          </div>
          {endActions}
        </section>
      )}

      {state.screen === 'destination' && (
        <section className={styles.screen}>
          <h2 ref={headingRef}>{t('pills.destination.title')}</h2>
          <p>{t('pills.destination.body')}</p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => dispatch({ type: 'closeDestination' })}
            >
              <Icon name="arrow-left" size={20} />
              {t('pills.backToGreen')}
            </button>
          </div>
          {endActions}
        </section>
      )}
    </div>
  )
}

export default function PillGame() {
  if (!PILLS.data)
    return <ContentError titleKey="game.error.title" problems={PILLS.errors} level={2} />
  return <PillGameView data={PILLS.data} />
}
