import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Owner correction: the green pill has nothing to do with Harvard. No Harvard
 * link, name or wording may appear in the site's code, content or text.
 */
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? files(path) : [path]
  })
}

describe('green pill destination', () => {
  it('mentions Harvard nowhere in src, content or locales', () => {
    const offenders = ['src', 'content', 'locales']
      .flatMap(files)
      .filter((f) => !f.endsWith('no-harvard.test.ts'))
      .filter((f) => /harvard/i.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })
})
