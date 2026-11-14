import type { Lang } from './languages'

/** A visitor-facing text field in content files: English required, Gujarati and Hindi expected. */
export interface LocalizedText {
  en: string
  gu?: string
  hi?: string
}

/** Pick the text for a language, falling back to English when it is missing or empty. */
export function localize(field: LocalizedText, lang: Lang): string {
  return field[lang]?.trim() ? (field[lang] as string) : field.en
}

/** The language the localized text will actually be shown in (for the lang attribute). */
export function localizedLang(field: LocalizedText, lang: Lang): Lang {
  return field[lang]?.trim() ? lang : 'en'
}
