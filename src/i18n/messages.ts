import en from '../../locales/en.json'
import gu from '../../locales/gu.json'
import hi from '../../locales/hi.json'
import type { Lang } from './languages'

/** Every interface string key. Typed from en.json, so a missing key fails type-checking. */
export type MessageKey = keyof typeof en
export type Messages = Partial<Record<MessageKey, string>>
export type Vars = Record<string, string | number>

const MESSAGES: Record<Lang, Messages> = {
  en,
  gu: gu as Messages,
  hi: hi as Messages,
}

/** Replace {name} placeholders with values from vars. Unknown names are left as they are. */
export function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  )
}

/** Look a key up in the given language, falling back to English when it is missing. */
export function translate(lang: Lang, key: MessageKey, vars?: Vars): string {
  const template = MESSAGES[lang][key] || en[key]
  return interpolate(template, vars)
}

/** True when the given language has its own text for the key (no English fallback). */
export function hasOwnMessage(lang: Lang, key: MessageKey): boolean {
  return Boolean(MESSAGES[lang][key])
}
