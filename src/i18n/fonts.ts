import type { Lang } from './languages'

/**
 * The Latin font is bundled with the main stylesheet. The Gujarati and
 * Devanagari fonts are separate chunks, fetched only when that language is
 * active, so English visitors never download them.
 */
const loaders: Partial<Record<Lang, () => Promise<unknown>>> = {
  gu: () =>
    Promise.all([
      import('@fontsource/noto-sans-gujarati/gujarati-400.css'),
      import('@fontsource/noto-sans-gujarati/gujarati-700.css'),
    ]),
  hi: () =>
    Promise.all([
      import('@fontsource/noto-sans-devanagari/devanagari-400.css'),
      import('@fontsource/noto-sans-devanagari/devanagari-700.css'),
    ]),
}

/** CSS font-family for each language, as used by canvas drawing. */
export const FONT_STACK: Record<Lang, string> = {
  en: "'Noto Sans', system-ui, sans-serif",
  gu: "'Noto Sans Gujarati', 'Noto Sans', system-ui, sans-serif",
  hi: "'Noto Sans Devanagari', 'Noto Sans', system-ui, sans-serif",
}

/** A short sample in each script, used to ask the browser to load the right font file. */
const SAMPLE: Record<Lang, string> = { en: 'Aa', gu: 'ગુજ', hi: 'हिन' }

const pending = new Map<Lang, Promise<void>>()

/** Load the stylesheet for a language's font (once). */
export function loadFontCss(lang: Lang): Promise<void> {
  const existing = pending.get(lang)
  if (existing) return existing
  const loader = loaders[lang]
  const promise = loader ? loader().then(() => undefined) : Promise.resolve()
  pending.set(lang, promise)
  return promise
}

/**
 * Resolve when the font for a language is ready to draw with, for example on a
 * canvas, which does not wait for web fonts by itself.
 */
export async function fontReady(lang: Lang, px = 16): Promise<void> {
  await loadFontCss(lang)
  if (typeof document === 'undefined' || !('fonts' in document)) return
  const family = FONT_STACK[lang].split(',')[0]
  try {
    await Promise.all([
      document.fonts.load(`400 ${px}px ${family}`, SAMPLE[lang]),
      document.fonts.load(`700 ${px}px ${family}`, SAMPLE[lang]),
    ])
  } catch {
    // Fall back to whatever font is available.
  }
}
