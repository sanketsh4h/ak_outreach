# ak_outreach — Digital Outreach

A static, mobile-first website with an intro page and two audience sections,
**Bhulkao** (younger children) and **Yuvako** (youth). Each section has games,
an interactive story and a prasang, in English, Gujarati and Hindi.

The build follows [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md).

> This README is filled in milestone by milestone. The full version (content
> editing guide, open questions, launch blockers) lands with milestone 6.

## Stack

- Vite, React, TypeScript (strict). No backend.
- React Router (`BrowserRouter`), base path from the `BASE_PATH` env var.
- CSS Modules plus CSS custom properties for design tokens.
- A small in-house i18n module; interface text lives in `locales/*.json`.
- Zod schemas for content, shared by the app and the validation script.
- Self-hosted fonts via `@fontsource` (no third-party requests).
- Vitest for logic, Playwright with axe for end-to-end and accessibility tests.
- ESLint and Prettier. Node version in `.nvmrc`.

## Scripts

| Command             | What it does                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------ |
| `npm run dev`       | Start the dev server                                                                       |
| `npm run build`     | Validate content, type-check, build to `dist/`, copy `index.html` to `404.html`            |
| `npm run preview`   | Serve the production build locally                                                         |
| `npm run validate`  | Check every content and locale file (`validate:strict` also fails on missing translations) |
| `npm run lint`      | ESLint                                                                                     |
| `npm run format`    | Prettier (`format:check` to check only)                                                    |
| `npm run typecheck` | TypeScript                                                                                 |
| `npm test`          | Unit tests (Vitest)                                                                        |
| `npm run test:e2e`  | End-to-end tests (Playwright; builds and serves the site itself)                           |

## Conventions

- No visible text is written in a component. Interface text comes from
  `locales/*.json`; content text from the files in `content/`. ESLint enforces
  this with a local rule.
- Content files sit at the repository root (`content/`, `locales/`) so that
  people editing text never need to open `src/`.

## Hosting

The site is a static build and can be hosted anywhere. The owner chose
**GitHub Pages**: <https://sanketsh4h.github.io/ak_outreach/>.

- `.github/workflows/pages.yml` builds with `BASE_PATH=/ak_outreach/` and
  deploys after the CI workflow passes on `main`. It can also be run by hand
  from the Actions tab ("Deploy to GitHub Pages" → "Run workflow").
- One-time setup in the repository: **Settings → Pages → Build and deployment →
  Source: GitHub Actions**.
- Deep links work on Pages because the build copies `index.html` to `404.html`.
  On another host, add a rewrite that serves `index.html` for every path that
  is not a file (for example Netlify `/* /index.html 200`, or nginx
  `try_files $uri /index.html`).
