// Copy dist/index.html to dist/404.html so that deep links work on static
// hosts (such as GitHub Pages) that serve 404.html for unknown paths.
import { copyFileSync, existsSync } from 'node:fs'

const src = 'dist/index.html'
if (!existsSync(src)) {
  console.error('postbuild: dist/index.html not found; run vite build first.')
  process.exit(1)
}
copyFileSync(src, 'dist/404.html')
console.log('postbuild: copied dist/index.html to dist/404.html')
