import { describe, expect, it } from 'vitest'
import en from '../locales/en.json'

describe('toolchain', () => {
  it('loads the English locale', () => {
    expect(en['site.title']).toBeTruthy()
  })
})
