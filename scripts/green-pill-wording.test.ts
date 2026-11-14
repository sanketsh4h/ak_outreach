import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Owner correction: the green pill has nothing to do with the university the
 * first plan named as a stand-in. Its name, link and wording must not appear
 * in the code, content, interface text or README. (The search term is built
 * from parts so that this file does not contain it either.)
 */
const FORBIDDEN = new RegExp(['har', 'vard'].join(''), 'i')
/** The one line the owner asked for in the README's open questions. */
const ALLOWED_README_LINE = `Not ${['Har', 'vard'].join('')}; destination still to be supplied.`

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? files(path) : [path]
  })
}

describe('green pill wording', () => {
  it('names the old stand-in nowhere in src, content, locales, scripts or tests', () => {
    const offenders = ['src', 'content', 'locales', 'scripts', 'tests']
      .flatMap(files)
      .filter((f) => FORBIDDEN.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('appears in the README only in the requested open-question line', () => {
    const readme = readFileSync('README.md', 'utf8').replaceAll(ALLOWED_README_LINE, '')
    expect(FORBIDDEN.test(readme)).toBe(false)
  })
})
