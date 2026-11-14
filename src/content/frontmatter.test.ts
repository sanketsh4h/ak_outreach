import { describe, expect, it } from 'vitest'
import { findMarkdownImages, parseFrontMatter, prasangFileName } from './frontmatter'

describe('parseFrontMatter', () => {
  it('splits YAML front matter from the body', () => {
    const doc = parseFrontMatter('---\nid: x\ntitle: "A: B"\n---\n\nHello\n')
    expect(doc.data).toEqual({ id: 'x', title: 'A: B' })
    expect(doc.body.trim()).toBe('Hello')
  })
  it('handles Windows line endings and a byte-order mark', () => {
    const doc = parseFrontMatter('﻿---\r\nid: y\r\n---\r\nText')
    expect(doc.data).toEqual({ id: 'y' })
    expect(doc.body).toBe('Text')
  })
  it('returns null data when there is no front matter', () => {
    expect(parseFrontMatter('Just text').data).toBeNull()
  })
})

describe('findMarkdownImages', () => {
  it('finds images with and without alt text', () => {
    expect(findMarkdownImages('a ![A cat](cat.svg) b ![](dog.svg "Dog")')).toEqual([
      { alt: 'A cat', src: 'cat.svg' },
      { alt: '', src: 'dog.svg' },
    ])
  })
})

describe('prasangFileName', () => {
  it('reads id and language from the file name', () => {
    expect(prasangFileName('content/prasangs/lamp-by-the-window.gu.md')).toEqual({
      id: 'lamp-by-the-window',
      lang: 'gu',
    })
    expect(prasangFileName('notes.md')).toBeNull()
  })
})
