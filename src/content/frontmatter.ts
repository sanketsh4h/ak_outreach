import { parse as parseYaml } from 'yaml'

export interface FrontMatterDoc {
  data: unknown
  body: string
}

/**
 * Split a markdown file into YAML front matter and body. Browser-safe (no
 * Node APIs), so the same code runs in the app and in the validation script.
 */
export function parseFrontMatter(raw: string): FrontMatterDoc {
  const text = raw.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')
  const match = /^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)/.exec(text)
  if (!match) return { data: null, body: text }
  return { data: parseYaml(match[1] ?? '') as unknown, body: text.slice(match[0].length) }
}

export interface MarkdownImage {
  alt: string
  src: string
}

/** Find every markdown image (![alt](src)) in a body. */
export function findMarkdownImages(body: string): MarkdownImage[] {
  const found: MarkdownImage[] = []
  const pattern = /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g
  for (const m of body.matchAll(pattern)) {
    found.push({ alt: (m[1] ?? '').trim(), src: m[2] ?? '' })
  }
  return found
}

/** Prasang files are named <id>.<lang>.md */
export function prasangFileName(path: string): { id: string; lang: string } | null {
  const name = path.split('/').pop() ?? ''
  const m = /^([a-z0-9-]+)\.([a-z]{2})\.md$/.exec(name)
  return m ? { id: m[1] as string, lang: m[2] as string } : null
}
