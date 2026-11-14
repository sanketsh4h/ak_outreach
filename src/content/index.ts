import type { SectionId } from '../config/sections'
import { INTRO_COPY_IS_PLACEHOLDER } from '../config/site'
import { isLang, type Lang } from '../i18n/languages'
import type { LocalizedText } from '../i18n/localized'
import { parseFrontMatter, prasangFileName } from './frontmatter'
import {
  prasangFrontMatter,
  story as storySchema,
  type PrasangFrontMatter,
  type Story,
} from './schemas'
import { validateStory } from '../features/story/validate'

/*
 * Content is loaded with import.meta.glob, so a new file dropped into
 * content/ is picked up on the next build with no code change.
 */
const storyFiles = import.meta.glob<unknown>('/content/stories/*.json', {
  eager: true,
  import: 'default',
})
const prasangFiles = import.meta.glob<string>('/content/prasangs/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})
const imageFiles = import.meta.glob<string>('/content/images/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

/** Short description of a story or prasang, for list pages. */
export interface ItemSummary {
  id: string
  title: LocalizedText
  placeholder: boolean
}

function zodProblems(error: { issues: { path: PropertyKey[]; message: string }[] }): string[] {
  return error.issues.map((i) => `${i.path.map(String).join('.') || '(file)'}: ${i.message}`)
}

/** Resolve an image named in content (a file in content/images/) to its URL in the build. */
export function imageUrl(name: string): string | undefined {
  return imageFiles[`/content/images/${name}`]
}

// ---------- Stories ----------

export interface StoryEntry {
  file: string
  id: string
  audience: string | null
  title: LocalizedText | null
  placeholder: boolean
  /** The story, or null when it failed validation. */
  story: Story | null
  errors: string[]
}

function loadStory(file: string, raw: unknown): StoryEntry {
  const loose = (raw ?? {}) as Record<string, unknown>
  const base = {
    file,
    id:
      typeof loose.id === 'string'
        ? loose.id
        : (file.split('/').pop() ?? file).replace(/\.json$/, ''),
    audience: typeof loose.audience === 'string' ? loose.audience : null,
    title: null as LocalizedText | null,
    placeholder: loose.placeholder === true,
  }
  const parsed = storySchema.safeParse(raw)
  if (!parsed.success) return { ...base, story: null, errors: zodProblems(parsed.error) }
  const check = validateStory(parsed.data)
  const imageErrors = parsed.data.nodes.flatMap((n) =>
    [n.image?.src, n.video?.poster]
      .filter((src): src is string => !!src && !imageUrl(src))
      .map((src) => `node "${n.id}": image "${src}" is not in content/images/`),
  )
  const errors = [...check.errors, ...imageErrors]
  return {
    ...base,
    title: parsed.data.title,
    story: errors.length ? null : parsed.data,
    errors,
  }
}

const STORIES: StoryEntry[] = Object.entries(storyFiles)
  .map(([file, raw]) => loadStory(file, raw))
  .sort((a, b) => a.id.localeCompare(b.id))

export function storiesFor(section: SectionId): ItemSummary[] {
  return STORIES.filter((s) => s.audience === section).map((s) => ({
    id: s.id,
    title: s.title ?? { en: s.id },
    placeholder: s.placeholder,
  }))
}

export function getStory(section: SectionId, id: string): StoryEntry | undefined {
  return STORIES.find((s) => s.audience === section && s.id === id)
}

// ---------- Prasangs ----------

export interface PrasangDoc {
  lang: Lang
  front: PrasangFrontMatter
  body: string
}

export interface PrasangEntry {
  id: string
  audience: string | null
  placeholder: boolean
  docs: Partial<Record<Lang, PrasangDoc>>
  errors: string[]
}

function loadPrasangs(): PrasangEntry[] {
  const byId = new Map<string, PrasangEntry>()
  for (const [file, raw] of Object.entries(prasangFiles)) {
    const name = prasangFileName(file)
    if (!name || !isLang(name.lang)) continue
    const entry = byId.get(name.id) ?? {
      id: name.id,
      audience: null,
      placeholder: false,
      docs: {},
      errors: [],
    }
    byId.set(name.id, entry)
    try {
      const { data, body } = parseFrontMatter(raw)
      const parsed = prasangFrontMatter.safeParse(data)
      if (!parsed.success) {
        entry.errors.push(...zodProblems(parsed.error).map((p) => `${name.lang}: ${p}`))
        continue
      }
      entry.docs[name.lang] = { lang: name.lang, front: parsed.data, body }
      if (name.lang === 'en' || entry.audience === null) {
        entry.audience = parsed.data.audience
        entry.placeholder = parsed.data.placeholder
      }
    } catch (e) {
      entry.errors.push(`${name.lang}: ${String(e)}`)
    }
  }
  for (const entry of byId.values()) {
    if (!entry.docs.en) entry.errors.push('the English file is missing')
  }
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id))
}

const PRASANGS = loadPrasangs()

function prasangTitle(entry: PrasangEntry): LocalizedText {
  return {
    en: entry.docs.en?.front.title ?? entry.id,
    gu: entry.docs.gu?.front.title,
    hi: entry.docs.hi?.front.title,
  }
}

export function prasangsFor(section: SectionId): ItemSummary[] {
  return PRASANGS.filter((p) => p.audience === section).map((p) => ({
    id: p.id,
    title: prasangTitle(p),
    placeholder: p.placeholder,
  }))
}

export function getPrasang(section: SectionId, id: string): PrasangEntry | undefined {
  return PRASANGS.find((p) => p.audience === section && p.id === id)
}

// ---------- Placeholder status ----------

/** True while any part of the site still shows placeholder content. */
export function siteHasPlaceholders(): boolean {
  return (
    INTRO_COPY_IS_PLACEHOLDER ||
    STORIES.some((s) => s.placeholder) ||
    PRASANGS.some((p) => p.placeholder)
  )
}

/** True when the story or prasang part of a section leads to placeholder content. */
export function partHasPlaceholders(section: SectionId, part: 'story' | 'prasang'): boolean {
  const items = part === 'story' ? storiesFor(section) : prasangsFor(section)
  return items.some((i) => i.placeholder)
}
