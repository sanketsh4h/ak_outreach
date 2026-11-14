# ak_outreach — Digital Outreach

A static, mobile-first website with an intro page and two audience sections,
**Bhulkao** (younger children) and **Yuvako** (youth). Each section has games,
an interactive story (called a scenario in Yuvako) and a prasang, in English,
Gujarati and Hindi.

- Live preview: <https://sanketsh4h.github.io/ak_outreach/>
- Build plan: [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md) (the owner-amended version)

> **Everything on the site is placeholder content.** It is marked as such on
> every page and will be replaced with final content from the content owners.
> Gujarati and Hindi text are unreviewed drafts.

## Contents

1. [What is built](#what-is-built)
2. [Run it on your computer](#run-it-on-your-computer)
3. [How to edit content (no coding needed)](#how-to-edit-content-no-coding-needed)
4. [Open questions](#open-questions)
5. [Launch blockers](#launch-blockers)
6. [Where this build departs from the plan](#where-this-build-departs-from-the-plan)
7. [Known gaps and follow-ups](#known-gaps-and-follow-ups)
8. [For developers](#for-developers)
9. [Hosting](#hosting)

## What is built

| Page                                                                      | Address                                         |
| ------------------------------------------------------------------------- | ----------------------------------------------- |
| Intro                                                                     | `/`                                             |
| Section home (three cards)                                                | `/bhulkao`, `/yuvako`                           |
| Games list                                                                | `/bhulkao/activity`, `/yuvako/activity`         |
| Doodle catcher (Bhulkao)                                                  | `/bhulkao/activity/doodle`                      |
| Pill game (Yuvako)                                                        | `/yuvako/activity/pills`                        |
| Word game "Shabd Khoj" (Yuvako)                                           | `/yuvako/activity/words`                        |
| Story / scenario list (goes straight to the item while there is only one) | `/bhulkao/story`, `/yuvako/scenario`            |
| Story / scenario player                                                   | `/bhulkao/story/<id>`, `/yuvako/scenario/<id>`  |
| Prasang list (same rule)                                                  | `/bhulkao/prasang`, `/yuvako/prasang`           |
| Prasang reader                                                            | `/bhulkao/prasang/<id>`, `/yuvako/prasang/<id>` |
| Not found                                                                 | any other address                               |

Every game, story and prasang is at most three taps from the intro page.

- **Languages**: a switch in the header (English, ગુજરાતી, हिन्दी). The first
  visit follows the browser's language; after that the choice is remembered.
- **Placeholder marking**: a striped "Placeholder content" banner on every
  placeholder story, prasang, game and word-game result; "Placeholder" badges
  on cards and inside pictures; titles that start with "Placeholder:"; and a
  thin "This site is a preview" strip under the header while any placeholder
  content remains. The strip disappears by itself once nothing is marked
  placeholder.
- **Privacy and safety**: no analytics, no cookies, no requests to any other
  website (fonts are bundled), no free-text input in Bhulkao. The browser's
  local storage keeps only the language choice, today's word-game guesses and
  the doodle best score. Every link that leaves the site first shows "You are
  leaving this site".
- **Accessibility**: works by keyboard, skip link, visible focus, one main
  heading per page, colour is never the only signal (ticks, dots, dashes,
  shapes and text), reduced-motion support, and tap targets of 56px in
  Bhulkao and 44px in Yuvako. Checked automatically with axe.

## Run it on your computer

You need [Node.js](https://nodejs.org/) (the version in `.nvmrc`, currently 26).

```sh
npm install
npm run dev        # open the address it prints, e.g. http://localhost:5173
```

## How to edit content (no coding needed)

All text, stories, prasangs, words, game items and pictures live in two folders
at the top of the repository: **`content/`** and **`locales/`**. You never need
to open `src/`.

### The easiest way: edit on GitHub

1. Open the repository on github.com and go to the file you want to change
   (for example `content/words.json`).
2. Click the pencil icon ("Edit this file"). To add a new file, open the folder
   and choose **Add file → Create new file** (or **Upload files** for pictures).
3. Make your change, then click **Commit changes…**. Choose **Create a new
   branch** and open a pull request, so someone can review it.
4. GitHub checks the content automatically. A green tick means it is valid. A
   red cross means something needs fixing: click **Details**, open the
   "validate" step, and it lists the file and the problem in plain words.
5. Once the change is merged into `main`, the live site updates by itself
   within a few minutes.

On your own computer you can run the same check with `npm run validate`.

### Rules that apply everywhere

- **Every visitor-facing text has three languages**, written like this:
  `{ "en": "Hello", "gu": "નમસ્તે", "hi": "नमस्ते" }`. English is required. If
  Gujarati or Hindi is missing, English is shown instead and the check lists
  what is missing.
- **`"placeholder": true`** marks an item as placeholder. Change it to
  `false` when the final, approved content is in place; its placeholder
  banner and badges then disappear.
- **Ids** (used in web addresses) use lowercase letters, digits and hyphens
  only, for example `homework-time`.
- **JSON files** need exact punctuation: double quotes, commas between items,
  no comma after the last item. If the check says "not valid JSON", look for a
  missing or extra comma near the line it names.

### Add or change a story (or scenario)

Stories are in `content/stories/`, one file per story.

1. Copy an existing story file (for example `homework-time.json`) and rename
   the copy, for example `kind-words.json`.
2. Change `"id"` to match (`"kind-words"`) and set `"audience"` to
   `"bhulkao"` or `"yuvako"`.
3. Change `"title"`. Set `"startNode"` to the id of the first step.
4. Each step in `"nodes"` has an `"id"`, its `"text"`, an optional `"image"`,
   and **either** `"choices"` **or** an `"ending"`:
   - `"choices"`: a list of `{ "label": {…}, "next": "<id of the step it leads to>" }`
   - `"ending"`: `{ "outcome": {…}, "lesson": {…} }`. The lesson is shown in
     the highlighted box.
5. Aim for three to five steps from the start to each ending. The check warns
   (but does not fail) if a path is shorter or longer, and fails if a choice
   points to a step that does not exist or a step can never reach an ending.
6. A picture is `"image": { "src": "file-name.svg", "alt": {…}, "source": "where it comes from" }`.
   Put the file in `content/images/`. `alt` describes the picture for people
   who cannot see it; `source` records who made it or where it is licensed
   from. Both are required.

The story appears at `/bhulkao/story/<id>` or `/yuvako/scenario/<id>`. When a
section has more than one story, a list page appears automatically.

### Add or change a prasang

Prasangs are in `content/prasangs/`, **one file per language**, named
`<id>.<language>.md`, for example `honest-shopkeeper.en.md`,
`honest-shopkeeper.gu.md`, `honest-shopkeeper.hi.md`.

1. Copy an existing English file and rename it. Each file starts with a block
   between two `---` lines:

   ```yaml
   ---
   id: honest-shopkeeper
   audience: yuvako
   placeholder: false
   title: 'The Honest Shopkeeper'
   moral: 'What would you do if nobody would ever find out?'
   images:
     - src: shopkeeper.svg
       source: Drawn by … for this project
       alt: 'A shopkeeper handing back extra change.'
     - src: market.svg
       source: Licensed from …
   ---
   ```

   - `moral` is shown in the box at the end, under "What we learn" (Bhulkao)
     or "Reflect" (Yuvako, where it reads best as a question).
   - The first picture in `images` is the cover, shown under the title, and
     needs an `alt` line.
   - Put quotes around any text that contains a colon (`:`).

2. Below the second `---`, write the story. Leave an empty line between
   paragraphs. To place a picture in the text, write
   `![what the picture shows](market.svg)`. Every picture used in the text
   must also be listed under `images` with its source.
3. **To translate**, copy the English file, change only the language part of
   the name (`.gu.md` or `.hi.md`) and translate the title, moral, alt text
   and story. Keep `id`, `audience`, `placeholder` and the picture files and
   sources the same in every language (the check fails if they differ). If a
   language file is missing, the English one is shown with a short note.

### Add or change a word for the word game

Words are in `content/words.json`:

```json
{
  "word": "seva",
  "native": { "gu": "સેવા", "hi": "सेवा" },
  "meaning": { "en": "…", "gu": "…", "hi": "…" },
  "reflection": { "en": "…", "gu": "…", "hi": "…" },
  "placeholder": false
}
```

- `word` is played in English letters: lowercase a–z only, 3 to 10 letters.
- `native` is the word in Gujarati and Devanagari script, shown on the result
  screen.
- The word of the day is chosen from the list by date (day number modulo the
  number of words), so adding or removing words changes which word falls on
  which day. Add new words at the end of the list.

### Add or change a doodle-catcher item

Items are in `content/doodle-items.json`, under `"items"`:

```json
{ "label": {…}, "kind": "positive", "icon": "book", "placeholder": false }
{ "label": {…}, "kind": "negative", "icon": "phone", "explanation": {…}, "placeholder": false }
```

- `kind` is `positive` (good habit, round and green: catch it) or
  `negative` (distraction, spiky and orange: dodge it).
- A negative item needs an `explanation`: one short sentence shown when it
  ends the game.
- `icon` is one of: book, moon, family, ball, hands, heart, pencil, tree, sun,
  phone, bell, loop, clock, screen, controller. Any other name shows a star
  and the check warns.
- Keep labels short (one or two words): they are drawn under the falling item.

The `"config"` block tunes the game: `startSpeed` and `maxSpeed` (how fast items
fall, in play-area pixels per second; the play area is 360 wide), `speedRamp`
(how much faster each second), `spawnInterval` (seconds between items) and
`negativeShare` (share of distractions, from 0 to 1).

### Change the pill game

Cards and the green pill's destination are in `content/pills.json`.

- `"greenPillUrl"`: where the green pill leads. While it is `null`, the green
  pill opens an on-site placeholder screen. Set it to a full address, for
  example `"https://example.org/next-steps"`, and the green pill opens that
  page in a new tab.
- Red cards (`"path": "red"`) are shown one at a time. Give each a `source`:
  `{ "text": {…}, "url": "https://…" }` (the url is optional). A card with
  `"source": null` shows "Source needed".
- Blue cards (`"path": "blue"`): the **first** is the calm "look away" screen
  that dissolves; the ones after it are shown once it has gone.

### Change interface text (buttons, headings, labels)

Interface text is in `locales/en.json`, `locales/gu.json` and
`locales/hi.json`. Each line is `"key": "text"`. Change the text, never the
key. Words in curly brackets such as `{n}` or `{page}` are filled in by the
site and must stay exactly as they are in every language. A key must exist in
`en.json` before it can be translated.

### Pictures

Put picture files (SVG, PNG, JPG or WebP) in `content/images/` and refer to them
by file name. Use only pictures you made or are licensed to use, record their
source, and keep files small (under about 200 KB) for phones. The check warns
about pictures that nothing uses.

### Settings that need a developer (one line each)

These live in `src/config/site.ts`:

- `ORGANISATION`: the organisation's name and contact for the footer (empty
  until branding is confirmed).
- `TRANSLATION_REVIEWED`: set `gu` or `hi` to `true` once a fluent reviewer
  has checked that language; the "draft translation" note in the footer then
  disappears.
- `INTRO_COPY_IS_PLACEHOLDER`: set to `false` once the intro text in
  `locales/*.json` (`site.tagline`, `intro.*`) is final.

The palette and type sizes are in `src/styles/tokens.css`. The section URLs
(`bhulkao`, `yuvako`, `story`, `scenario`) are set in one place,
`src/config/sections.ts`.

## Open questions

From section 2 of the build plan, with their status after this build.

| #   | Question                                             | Status                                                                                                                                                                                                                                                                                                                                                         |
| --- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Commit to the default branch, or a branch with a PR? | **Answered.** Work happens on `claude/webapp-build-plan-initial-0ecfpc`. When the owner asked for the site to go live, they approved fast-forwarding `main` to it, so `main` matches the build branch. No pull request has been opened.                                                                                                                        |
| 2   | What does the green pill open?                       | Not Harvard; destination still to be supplied. `greenPillUrl` in `content/pills.json` is `null`, so the green pill opens an on-site placeholder screen until a destination is set.                                                                                                                                                                             |
| 3   | Word list spellings and length rule                  | **Partly answered.** Owner-confirmed words: `seva`, `swadharma`, `prarthna` (native forms included); their meanings and reflections are placeholders. The other nine words (daya, satya, shanti, dhyan, bhakti, kshama, santosh, vinay, sanyam) are placeholders. The length rule (a–z, 3 to 10 letters) is the plan's default and **still needs confirming**. |
| 4   | Who translates and reviews Gujarati and Hindi?       | **Open.** All Gujarati and Hindi text is a draft written by the builder, flagged unreviewed, with a note in the footer.                                                                                                                                                                                                                                        |
| 5   | Native-script play in the word game?                 | **Open (default applied).** Played in Latin transliteration in all languages; meaning, reflection and native-script forms are shown in the chosen language.                                                                                                                                                                                                    |
| 6   | Who supplies and approves real content?              | **Open.** The owner asked for the placeholders to stay until real content arrives. All content is marked placeholder.                                                                                                                                                                                                                                          |
| 7   | Bhulkao age range                                    | **Open (default applied).** Primary-school age assumed: short sentences, slow starting speed in the doodle game.                                                                                                                                                                                                                                               |
| 8   | Branding                                             | **Open (default applied).** Working title "Digital Outreach" (a locale string), no logo, placeholder palette in `src/styles/tokens.css`, empty organisation slots in the footer.                                                                                                                                                                               |
| 9   | Hosting                                              | **Answered.** The owner chose to go live: GitHub Pages at <https://sanketsh4h.github.io/ak_outreach/>, deployed from `main` after CI passes. A custom domain is still possible.                                                                                                                                                                                |

## Launch blockers

Before this site is presented as final:

1. **Translation review**: a fluent reviewer for Gujarati and for Hindi checks
   every interface string and content file, then `TRANSLATION_REVIEWED` is set.
   Two wording choices to confirm: "Placeholder" is translated as "કામચલાઉ"
   and "अस्थायी" (both mean "temporary"), and the section names are written
   ભૂલકાઓ / भूलकाओ and યુવકો / युवको.
2. **Real content**: stories, scenarios, prasangs, word meanings and
   reflections, doodle items and their explanations, pill cards, and the intro
   text, all approved by the content owners, with `placeholder` set to `false`.
3. **Sources for every red-pill claim**: each red card needs a real, checked
   source. The placeholder cards say what will go there and carry no source;
   no statistics or findings were invented.
4. **The green pill's destination**: set `greenPillUrl` in
   `content/pills.json`.
5. **Branding**: name, logo, palette and the organisation's name and contact.
6. **Hosting**: decided (GitHub Pages). Remaining: a custom domain if wanted.

## Where this build departs from the plan

1. **Followed the owner-amended plan.** The build was started from the first
   version of the plan. The branch then turned out to hold an amended version
   with owner corrections (the green pill's destination is not yet supplied; the third word
   is `prarthna` with native forms; much stronger placeholder marking). The
   build follows the amended version, which is now `docs/BUILD_PLAN.md`.
2. **Went live.** The plan said nothing would be deployed until the owner
   chose a host. The owner asked for the work so far to go live. The Pages
   workflow therefore runs automatically after CI passes on `main` (and can
   still be run by hand); the plan described a manual-only workflow.
3. **TypeScript 6.0, not 7.0.** TypeScript 7 is the current release, but
   typescript-eslint (needed for linting) supports only versions below 6.1.
   All other dependencies are on their current releases.
4. **No jsx-a11y lint plugin**, because it does not support ESLint 10.
   Accessibility is checked with axe in the end-to-end tests instead. A small
   local lint rule fails the build if visible text is written directly in a
   component.
5. **Language-switch labels use two tiny fonts** (about 2 KB each, cut from
   the Noto fonts by `scripts/subset-switch-fonts.sh`), so "ગુજરાતી" and
   "हिन्दी" display correctly on devices without those scripts, while the full
   Gujarati and Devanagari fonts still load only when that language is chosen.
6. **Prasang cover alt text.** The plan's `images` entries have only `src` and
   `source`; the cover is not placed in the text, so it had no alt text. The
   first `images` entry therefore takes an `alt` line.
7. **Story videos record a `source`** as pictures do (none are shipped).
8. **Pill content details** the plan left open: a source is `{ text, url? }`
   or `null`; the first blue card is the look-away screen and later blue cards
   are the message after it.
9. **Word-game keys are narrower than 44px.** At 360px wide, a ten-key keyboard
   row leaves about 30px per key. Keys are 52px tall and meet the WCAG 2.2 AA
   minimum target size (24px), but not the plan's 44px Yuvako guideline in
   width. Every other control meets the 44px (Yuvako) and 56px (Bhulkao)
   guideline, checked by a test.
10. **Story and prasang pages load on demand**, to keep the first download
    smaller on phones (not required by the plan).

## Known gaps and follow-ups

- **Download size.** The main script is about 166 KB compressed, mostly
  because content is checked (Zod) and front matter parsed (YAML) in the
  browser, as the plan specifies. Doing that at build time instead would cut
  it substantially.
- **Browsers tested.** Automated and manual checks ran in Chromium (desktop,
  and a 360px phone viewport with touch). Safari, Firefox and real phones
  have not been tested yet.
- **Deep links on GitHub Pages** are served by `404.html`, so they display
  correctly but return HTTP status 404 to crawlers.
- **`npm audit`** reports 7 moderate issues, all in development-only lint
  tooling (minimatch via typescript-eslint); nothing that ships to visitors.
- **GitHub Actions** warns that `actions/deploy-pages@v4` targets an older
  Node.js; it still runs. Bump the action versions when newer majors are out.

## For developers

### Stack

- Vite, React, TypeScript (strict). No backend.
- React Router (`BrowserRouter`), base path from the `BASE_PATH` env var.
- CSS Modules plus CSS custom properties for design tokens.
- A small in-house i18n module; interface keys are typed from
  `locales/en.json`, so a missing key fails type-checking.
- Zod schemas for content (`src/content/schemas.ts`), shared by the app and
  `scripts/validate-content.ts`.
- Self-hosted fonts via `@fontsource`.
- Vitest for logic, Playwright with axe for end-to-end and accessibility tests.
- ESLint and Prettier. Node version in `.nvmrc`.

### Scripts

| Command             | What it does                                                                                               |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| `npm run dev`       | Start the dev server                                                                                       |
| `npm run build`     | Validate content, type-check, build to `dist/`, copy `index.html` to `404.html`                            |
| `npm run preview`   | Serve the production build locally                                                                         |
| `npm run validate`  | Check every content and locale file (`validate:strict` also fails on missing translations; CI uses strict) |
| `npm run lint`      | ESLint                                                                                                     |
| `npm run format`    | Prettier (`format:check` to check only)                                                                    |
| `npm run typecheck` | TypeScript                                                                                                 |
| `npm test`          | Unit tests (Vitest)                                                                                        |
| `npm run test:e2e`  | End-to-end tests (Playwright; builds and serves the site itself)                                           |

Set `PLAYWRIGHT_CHROMIUM_PATH` to use a Chromium other than Playwright's own.

### Layout

```
content/        stories, prasangs, images, doodle-items.json, pills.json, words.json
locales/        en.json, gu.json, hi.json
scripts/        validate-content.ts (+ tests), postbuild.mjs, subset-switch-fonts.sh
src/config/     sections.ts (slugs, games), site.ts (organisation, review flags, storage keys)
src/i18n/       provider, t(), localized fields, fonts, storage
src/content/    schemas, loaders (import.meta.glob), front matter parser
src/components/ layout, header, footer, cards, placeholder marking, lesson box, external link
src/pages/      intro, section home, games list, item list, story, prasang, not found
src/features/   story engine (validate, state, player), prasang reader
src/games/      pills/, words/, doodle/ (each with pure logic and unit tests)
tests/e2e/      Playwright tests
```

### Conventions

- No visible text in components: interface text from `locales/*.json`,
  content text from `content/`. ESLint enforces this.
- Game logic is pure and unit-tested (`games/*/machine.ts`, `logic.ts`,
  `sim.ts`); components only render and wire up input.
- localStorage holds only the three keys in `STORAGE_KEYS`.

### Tests

- `npm test`: story validation and state, front matter, i18n, the pill
  machine, word scoring (two-pass, including the three a's in "swadharma") and
  the daily word, doodle `step()` with a seeded random source, the content
  validator against deliberately broken copies of the content, and a guard
  that the green pill's old stand-in link and wording appear nowhere.
- `npm run test:e2e`, at 360px with touch and at desktop size: every route in
  every language (no horizontal scroll, no axe violations, no request to any
  other site); language persistence; two story endings; a prasang to its
  lesson box; each game's main flow by touch and by keyboard; placeholder
  marking; tap-target sizes; three-tap reachability; the skip link; the CSP
  tag; the "leaving this site" step.

## Hosting

The site is a static build and can be hosted anywhere. The owner chose
**GitHub Pages**: <https://sanketsh4h.github.io/ak_outreach/>.

- `.github/workflows/pages.yml` builds with `BASE_PATH=/ak_outreach/` and
  deploys after the CI workflow passes on `main`. It can also be run by hand
  from the Actions tab ("Deploy to GitHub Pages" → "Run workflow").
- One-time setup in the repository (done): **Settings → Pages → Build and
  deployment → Source: GitHub Actions**.
- Deep links work on Pages because the build copies `index.html` to `404.html`.
  On another host, add a rewrite that serves `index.html` for every path that
  is not a file (for example Netlify `/* /index.html 200`, or nginx
  `try_files $uri /index.html`).
- Production builds include a Content-Security-Policy meta tag that limits
  every request to the site's own origin.
