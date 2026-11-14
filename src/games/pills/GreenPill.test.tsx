import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { I18nProvider } from '../../i18n/I18nProvider'
import { GreenPill } from './PillGame'

const render = (url: string | null) =>
  renderToStaticMarkup(
    <I18nProvider>
      <GreenPill url={url} onPlaceholder={() => {}} />
    </I18nProvider>,
  )

describe('GreenPill', () => {
  it('opens a configured URL in a new tab without passing the opener or referrer', () => {
    const html = render('https://example.org/next-step')
    expect(html).toMatch(/^<a /)
    expect(html).toContain('href="https://example.org/next-step"')
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it('is an on-site button while no URL is set', () => {
    const html = render(null)
    expect(html).toMatch(/^<button type="button"/)
    expect(html).not.toContain('href=')
  })
})
