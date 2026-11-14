import type { Lang } from '../i18n/languages'

/**
 * Site-wide settings. The working title and all interface text live in
 * locales/*.json; this file holds only values that are not translated.
 */

/**
 * Organisation name and contact for the footer. Left empty until branding is
 * confirmed by the owner (open question 8). Each is a localized text object,
 * for example { "en": "...", "gu": "...", "hi": "..." }.
 */
export const ORGANISATION: {
  name: { en: string; gu?: string; hi?: string } | null
  contact: { en: string; gu?: string; hi?: string } | null
} = {
  name: null,
  contact: null,
}

/**
 * Whether a language's text has been reviewed by a fluent reviewer. While a
 * language is false, the footer shows a short "draft translation" note in it.
 * (Open question 4: Gujarati and Hindi are drafts written by the builder.)
 */
export const TRANSLATION_REVIEWED: Record<Lang, boolean> = {
  en: true,
  gu: false,
  hi: false,
}

/** The only keys this site ever writes to localStorage. */
export const STORAGE_KEYS = {
  lang: 'outreach.lang',
  wordsDaily: 'outreach.words.daily',
  doodleBest: 'outreach.doodle.best',
} as const
