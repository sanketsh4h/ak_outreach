import { useI18n } from '../i18n/context'
import { LANGS, NATIVE_NAMES } from '../i18n/languages'
import styles from './LanguageSwitch.module.css'

/** Language switch. Each option is shown in its own script and carries its own lang attribute. */
export function LanguageSwitch() {
  const { lang, setLang, t } = useI18n()
  return (
    <div className={styles.switch} role="group" aria-label={t('lang.label')}>
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          className={styles.option}
          aria-pressed={code === lang}
          onClick={() => setLang(code)}
        >
          {NATIVE_NAMES[code]}
        </button>
      ))}
    </div>
  )
}
