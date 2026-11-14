import { useI18n } from '../i18n/context'

/** Temporary stand-in for a game that has not been built yet. */
export default function UnderConstruction() {
  const { t } = useI18n()
  return <p>{t('game.placeholder')}</p>
}
