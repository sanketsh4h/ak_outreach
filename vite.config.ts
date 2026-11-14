import { defineConfig } from 'vitest/config'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Base path for the build. Set BASE_PATH=/ak_outreach/ to serve the site from a
 * sub-path (for example GitHub Pages). Defaults to the domain root.
 */
function basePath(): string {
  const raw = process.env.BASE_PATH?.trim() || '/'
  const withLead = raw.startsWith('/') ? raw : `/${raw}`
  return withLead.endsWith('/') ? withLead : `${withLead}/`
}

/**
 * Production builds carry a Content-Security-Policy meta tag that limits every
 * kind of request to the site's own origin. The dev server is left alone
 * because hot reload needs inline scripts and a websocket.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self'",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

function cspMeta(): Plugin {
  return {
    name: 'csp-meta',
    apply: 'build',
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP },
          injectTo: 'head-prepend',
        },
      ]
    },
  }
}

export default defineConfig({
  base: basePath(),
  plugins: [react(), cspMeta()],
  build: {
    // Keep every asset as a real file so the CSP never needs to allow data: URIs.
    assetsInlineLimit: 0,
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
    environment: 'node',
  },
})
