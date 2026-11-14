import { createContext, useContext } from 'react'
import type { Lang } from './languages'
import type { MessageKey, Vars } from './messages'
import type { LocalizedText } from './localized'

export interface I18nValue {
  lang: Lang
  setLang: (lang: Lang) => void
  /** Interface text from locales/*.json. */
  t: (key: MessageKey, vars?: Vars) => string
  /** Content text from a localized field in a content file. */
  l: (field: LocalizedText) => string
}

export const I18nContext = createContext<I18nValue | null>(null)

export function useI18n(): I18nValue {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside <I18nProvider>')
  return value
}
