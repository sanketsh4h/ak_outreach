import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { I18nContext, type I18nValue } from './context'
import { detectLang, isLang, type Lang } from './languages'
import { translate, type MessageKey, type Vars } from './messages'
import { localize, type LocalizedText } from './localized'
import { loadFontCss } from './fonts'
import { readStored, writeStored } from './storage'
import { STORAGE_KEYS } from '../config/site'

function initialLang(): Lang {
  const stored = readStored(STORAGE_KEYS.lang)
  if (isLang(stored)) return stored
  const prefs =
    typeof navigator !== 'undefined' ? (navigator.languages ?? [navigator.language]) : []
  return detectLang(prefs)
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    void loadFontCss(lang)
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    writeStored(STORAGE_KEYS.lang, next)
  }, [])

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang,
      t: (key: MessageKey, vars?: Vars) => translate(lang, key, vars),
      l: (field: LocalizedText) => localize(field, lang),
    }),
    [lang, setLang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
