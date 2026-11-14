export const LANGS = ['en', 'gu', 'hi'] as const
export type Lang = (typeof LANGS)[number]
export const DEFAULT_LANG: Lang = 'en'

/** Each language's name in its own script, shown in the language switch. */
export const NATIVE_NAMES: Record<Lang, string> = {
  en: 'English',
  gu: 'ગુજરાતી',
  hi: 'हिन्दी',
}

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value)
}

/**
 * First visit: use the first supported language in the browser's preference
 * list (so Gujarati or Hindi if the browser asks for it), otherwise English.
 */
export function detectLang(preferences: readonly string[]): Lang {
  for (const pref of preferences) {
    const primary = pref.toLowerCase().split('-')[0]
    if (isLang(primary)) return primary
  }
  return DEFAULT_LANG
}
