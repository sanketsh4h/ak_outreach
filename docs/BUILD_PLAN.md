# Digital Outreach Webapp: Initial Build Plan

Source: "Digital Outreach Webapp: Initial Build Handoff" (Nov 14, 2026). This plan turns that handoff into build decisions. Where the handoff left a question open, the plan picks a default so the build is not blocked, and the default is listed in section 2 so it can be reversed cheaply.

Starting point: the repo holds one commit and a README with only the title. Everything is built from scratch.

## 1. What gets built

A static, mobile-first website with an intro page and two audience sections, Bhulkao (younger children) and Yuvako (youth). Each section has an activity (games), an interactive scenario story and a prasang.

In scope:

- Intro page, header with language switch, navigation to both sections
- Three games: doodle catcher (Bhulkao), pill game and adhyatmik word game (Yuvako)
- One story engine shared by both sections, one sample story each
- One prasang reader shared by both sections, one sample prasang each
- English, Gujarati and Hindi throughout
- All stories, prasangs, words, game items and cards in content files

Out of scope: accounts, logins, leaderboards, a CMS, any analytics, final content, native-script play in the word game, offline/PWA support, and a production deployment (hosting is undecided).

## 2. Open questions and the defaults this build uses

None of these block the build. Each default is isolated to one config value or content file. The README must carry this list forward, marked answered or open.

| # | Open question | Default for this build |
| --- | --- | --- |
| 1 | Commit to default branch, or branch with PR? | Work on the assigned feature branch. Do not open a pull request until the owner asks. |
| 2 | What does the green pill open? The owner has confirmed it has nothing to do with Harvard; the real destination is not yet supplied. | `greenPillUrl` in `content/pills.json`, left `null`. While it is `null` the green pill opens an on-site placeholder screen. No Harvard link or wording anywhere. Do not guess a destination. |
| 3 | Word list spellings and length rule | Owner-confirmed words: `seva`, `swadharma`, `prarthna` (प्रार्थना, પ્રાર્થના; spelled in Latin as the owner wrote it). About nine more placeholder words fill out the list. Rule: lowercase a–z, 3 to 10 letters. |
| 4 | Who translates and reviews Gujarati and Hindi? | The builder writes draft Gujarati and Hindi so every page is usable. Both are flagged unreviewed in config, shown as a small note in the footer, and listed in the README as a launch blocker. |
| 5 | Native-script word game? | No. Puzzle is played in Latin transliteration in all three languages; meaning and reflection appear in the chosen language. |
| 6 | Who supplies and approves real content? | Unknown. All shipped content is placeholder content with `"placeholder": true`, marked unmistakably as described in section 7. The owner has asked for the placeholders to stay until real content arrives. |
| 7 | Bhulkao age range | Assume primary-school age. Reading level is short sentences; game speed is a config value. |
| 8 | Branding | Working title "Digital Outreach" (a locale string), no logo, a placeholder palette held in CSS custom properties in one file. |
| 9 | Hosting | Host-agnostic static build. A manually triggered GitHub Pages workflow is included but nothing is deployed until the owner chooses. |

## 3. Stack

- Vite, React, TypeScript in strict mode. No backend.
- React Router with `BrowserRouter`, `basename` taken from `import.meta.env.BASE_URL`. Vite `base` comes from a `BASE_PATH` env var, default `/`, so the same build works at a domain root or under `/ak_outreach/`.
- A post-build step copies `dist/index.html` to `dist/404.html` so deep links work on GitHub Pages. The README notes the equivalent rewrite rule for other hosts.
- Styling: plain CSS Modules plus CSS custom properties for tokens. No UI framework.
- i18n: a small in-house module (context, `t(key, vars)`, `{name}` interpolation, English fallback). Keys are typed from `locales/en.json`, so a missing key is a compile error. No i18n library.
- Content schemas: Zod, shared by the app and the validation script.
- Prasang markdown: imported as raw text, front matter parsed with a browser-safe parser, body rendered with `react-markdown` with raw HTML disabled.
- Fonts: self-hosted through `@fontsource` packages (Noto Sans, Noto Sans Gujarati, Noto Sans Devanagari). No Google Fonts CDN, so the site makes no third-party requests. Load the Gujarati or Devanagari font only when that language is active.
- Tests: Vitest for logic, Playwright with axe for end-to-end and accessibility. Use the Chromium already installed in the build environment.
- Tooling: ESLint, Prettier, `.nvmrc` on the current Node LTS. Use current stable versions of every dependency; do not pin versions from memory.

npm scripts: `dev`, `build` (runs `validate` first), `preview`, `validate`, `lint`, `typecheck`, `test`, `test:e2e`.

## 4. Repository layout

```
content/
  stories/*.json            scenario stories, both sections
  prasangs/<id>.<lang>.md   one file per language, sharing an id
  images/                   illustrations referenced by content
  doodle-items.json
  pills.json
  words.json
locales/  en.json  gu.json  hi.json
scripts/  validate-content.ts
src/
  config/      sections.ts (slugs, parts, game registry), site.ts
  i18n/        provider, t(), localized-field helper, language storage
  content/     Zod schemas and loaders (import.meta.glob)
  components/  Layout, Header, LanguageSwitch, Footer, Card, SampleTag,
               LessonBox, ExternalLink
  pages/       Intro, SectionHome, GamesList, ItemList, StoryPage,
               PrasangPage, NotFound
  features/    story/ (validate, state hook, player), prasang/
  games/       pills/, words/, doodle/
  styles/      tokens.css, global.css
tests/e2e/
docs/BUILD_PLAN.md
```

`content/` and `locales/` sit at the repo root, as the handoff specifies, so non-developers never open `src/`.

## 5. Routes

All section slugs and the story segment name (`story` for Bhulkao, `scenario` for Yuvako) are defined once in `src/config/sections.ts`. Renaming `yuvako` is a one-line change there.

The eleven routes from the handoff:

| Route | Page |
| --- | --- |
| `/` | Intro |
| `/bhulkao`, `/yuvako` | Section home, three cards |
| `/bhulkao/activity` | Games list |
| `/bhulkao/activity/doodle` | Doodle catcher |
| `/yuvako/activity/pills` | Pill game |
| `/yuvako/activity/words` | Word game |
| `/bhulkao/story/:id`, `/yuvako/scenario/:id` | Story player |
| `/bhulkao/prasang/:id`, `/yuvako/prasang/:id` | Prasang reader |

Additions this plan makes, and why:

- `/yuvako/activity`: the handoff lists a games list only for Bhulkao, but the Yuvako Activity card needs somewhere to offer two games. Same template.
- `/bhulkao/story`, `/yuvako/scenario`, `/bhulkao/prasang`, `/yuvako/prasang`: list pages. Without them a second story or prasang added through content files would be unreachable. When a section has exactly one item, the list route redirects straight to it.
- `*`: a not-found page. An unknown story or prasang id shows the same page with a link back to the section.

Every game, story and prasang stays within three taps of the intro page: section card, part card, item.

## 6. Shared foundations

### Layout and theme

- Header on every page: site title linking to `/`, a back link to the parent page, the language switch.
- Footer: organisation name and contact slots, empty until branding is confirmed, plus the translation-review note.
- Two themes set by a `data-section` attribute. Bhulkao: picture-led, larger type, rounded shapes, tap targets of at least 56 px. Yuvako: calmer, text-led, tap targets of at least 44 px.
- Designed at 360 px first. No horizontal scroll at 360 px on any page.

### Languages

- Switch shows each language in its own script: English, ગુજરાતી, हिन्दी. Each option carries its own `lang` attribute.
- First visit: pick Gujarati or Hindi if `navigator.languages` asks for it, otherwise English. After that the choice is read from `localStorage`.
- Set `<html lang>` on every change. Use `:lang(gu)` and `:lang(hi)` to raise line height (about 1.7 against 1.5 for Latin).
- Never apply `text-transform`, letter-spacing or character-count truncation to Gujarati or Hindi text; all three break conjuncts.
- No visible string is written in a component. Interface text comes from `locales/*.json`; content text comes from localised fields.
- A missing Gujarati or Hindi string falls back to English at runtime.

### Content loading and validation

- Content is loaded with `import.meta.glob`, so a new file is picked up on the next build with no code change.
- Images named in content are resolved through a glob of `content/images/`, which keeps URLs correct under any base path.
- `scripts/validate-content.ts` runs before every build and as `npm run validate`. It reuses the app's schemas.
  - Fails the build on: schema errors, a story choice pointing to a missing node, missing English text, an image without alt text or without a recorded source, prasang language files that disagree on `audience`, `placeholder` or image list.
  - Prints, without failing: every missing Gujarati or Hindi key and field, pill cards with no source, unreachable story nodes, stories outside the three-to-five-step guideline.
  - `--strict` turns missing translations into failures. CI runs strict, because the definition of done allows no untranslated interface text.

### Privacy and child safety

- No analytics, no cookies, no third-party requests of any kind.
- `localStorage` holds only the language choice, the day's word-game guesses and the doodle best score.
- No free-text input in the Bhulkao section. The word game's letter input is Yuvako only.
- `ExternalLink` component: every external link opens a "You are leaving this site" step first. The one exception is the green pill, whose whole purpose is to open its destination.
- Production builds add a Content-Security-Policy meta tag limiting everything to the site's own origin.
- An end-to-end test fails if any page requests a host other than the site's own.

### Accessibility

- Landmarks, one `h1` per page, a skip link, visible focus rings, WCAG AA contrast in both themes.
- Everything works by keyboard. Focus moves to the new heading when a story node, pill card or game-over screen appears.
- State is never shown by colour alone: icons, shapes, patterns or text accompany it.
- `prefers-reduced-motion` removes transitions and the blue-pill dissolve (replaced by a Continue button).

## 7. Content model

Every visitor-facing text field is an object with `en`, `gu` and `hi` keys. Every content item may carry `"placeholder": true`, which turns on the placeholder marking described below.

**Stories** (`content/stories/*.json`): `id`, `audience` (`bhulkao` or `yuvako`), `title`, `startNode`, `nodes[]`, `placeholder`. A node has `id`, `text`, an optional `image` (`src`, `alt`, `source`) or `video` (`src`, `poster`, `alt`, optional captions file), and exactly one of:

- `choices[]`: each with `label` and `next`
- `ending`: `outcome` and `lesson`

**Prasangs** (`content/prasangs/<id>.<lang>.md`): front matter `id`, `audience`, `title`, `moral`, `images[]` (`src`, `source`), `placeholder`; then the body in markdown. Pictures are placed in the body with ordinary markdown image syntax, whose alt text is required. Each body image must have a matching `images[]` entry recording its source. The first entry is the cover. To translate a prasang, copy the file, change the language suffix and translate the text.

**Doodle items** (`content/doodle-items.json`): `config` (`startSpeed`, `speedRamp`, `maxSpeed`, `spawnInterval`, `negativeShare`) and `items[]` with `label`, `kind` (`positive` or `negative`), `icon`, `explanation` (required for negatives).

**Pills** (`content/pills.json`): `greenPillUrl` (a URL, or `null` until the owner supplies it), and `cards[]` with `path` (`red` or `blue`), `text`, `source`, `placeholder`.

**Words** (`content/words.json`): `words[]` with `word` (Latin transliteration, used for play), `native` (the word in Gujarati and Devanagari script, for example `{"gu": "પ્રાર્થના", "hi": "प्रार्थना"}`), `meaning`, `reflection`, `placeholder`. `native` is shown beside the word on the finish screen; it is optional, and the validator lists words that lack it.

### Placeholder marking

The owner wants the placeholder content kept, and wants it to be obvious that it is a placeholder that will be replaced later. A small tag is not enough.

- A shared `PlaceholderNotice` banner sits at the top of every placeholder story, prasang, pill sequence, word-game result and doodle game, and above the intro page's placeholder copy. It reads, in the chosen language, "Placeholder content. This will be replaced with the final content."
- The banner is hard to miss: full width, dashed border, striped background, a warning icon and the word "Placeholder" in bold. It does not rely on colour.
- Cards on list and home pages that lead to a placeholder item carry a "Placeholder" badge.
- While any content file is flagged placeholder, a thin strip under the header on every page says the site is a preview and that placeholder content will be replaced. It disappears by itself once no placeholder content remains.
- Placeholder text says so in its own words where that reads naturally. Titles start with "Placeholder:", and red-pill cards read like "Placeholder card 1: a sourced point about sleep goes here."
- Placeholder illustrations carry a visible "Placeholder" label inside the picture.
- The tag text is "Placeholder", not "Sample", everywhere.

### Rules for sample content

- Illustrations are original SVGs drawn for this project, with `source` recorded as such. Nothing is downloaded.
- Sample prasangs are plainly fictional moral stories. They must not be attributed to any real person, saint, scripture or organisation; real prasangs come from the content owners.
- Sample red-pill cards describe what will go there and carry `source: null`. No statistics, findings or citations are invented.
- Word meanings are short, general glosses, flagged for review. The three owner-confirmed words are real entries; only their meanings and reflections are placeholder.
- Bhulkao sample story: "A friend offers you their phone during homework time." Yuvako sample scenario: "It is 1 a.m. and you are still scrolling before an exam."

## 8. Feature specs

### Story engine

- `validateStory()` is a pure function used by the validation script and again by the player at load. It checks: unique node ids, `startNode` exists, every `next` exists, each node has exactly one of `choices` or `ending`, and every node can reach an ending.
- A story that fails validation is rejected: the player shows an error page and never renders a partial story.
- Player state is the list of node ids visited. Controls: the choices, Back (undo one choice), and at an ending "Try a different choice", which restarts.
- An ending shows the outcome, then the lesson in the shared highlighted `LessonBox`. No score anywhere.
- Bhulkao presentation puts the picture first with large choice buttons. Yuvako presentation leads with text. Same component, themed by audience.
- Video nodes use `<video controls playsInline preload="metadata">` with no autoplay. No sample video is shipped.

### Prasang reader

- Shows title, cover, body with pictures, then the `moral` in `LessonBox`.
- The box heading comes from the audience: "What we learn" for Bhulkao, "Reflect" for Yuvako, where `moral` is phrased as a question.
- If the chosen language has no file for that id, show the English version with a one-line notice.

### Pill game

A small state machine: `start`, `red` (card index), `blue`, `green`.

1. Start: a red pill and a blue pill with a one-line prompt. Each pill carries a text label, so the choice does not rest on colour.
2. Red: cards from `pills.json`, one at a time, with Next, Back and a progress indicator. Each card shows its source, or a "Source needed" tag when it has none.
3. Blue: a short "blissful ignorance" screen that dissolves after about three seconds, or on tap, into the message that ignoring it is not an option.
4. Both paths end on a green pill button. When `greenPillUrl` is set, tapping it opens that URL in a new tab with `rel="noopener noreferrer"`. While it is `null`, tapping it opens an on-site placeholder screen saying the green pill's destination will be added later, with the `PlaceholderNotice` banner. The green pill has nothing to do with Harvard: no Harvard link, name or wording appears in the game.
5. "Start over" returns to step 1. After finishing, the other pill can be chosen.

The red and blue pill idea is used generically. No film imagery, quotes, character names or code-rain styling.

Done when: both paths reach the green pill, the green pill opens the configured URL in a new tab (tested with a URL set) and the placeholder screen when none is set, Start over works, and the whole flow works by keyboard and at 360 px.

### Adhyatmik word game

Working title "Shabd Khoj", held in the locale files. Its look uses the site's own palette and tile shape, not the Wordle name, colours or layout.

- Six guesses. The grid has as many columns as the answer has letters (4 for seva, 9 for swadharma) and must fit 360 px at 9 or 10 columns.
- Scoring is the standard two-pass method so repeated letters are marked correctly; "swadharma" has three a's and is the key test case.
- Each tile shows its status with a mark as well as colour: a tick for correct, a dot for present, a dash for absent. The on-screen keys show the same marks.
- Only a–z is accepted. A guess must be exactly the answer's length; a shorter one shows a text notice. There is no dictionary check.
- On-screen keyboard (letters, Enter, Backspace) and the physical keyboard both work. Each submitted row is announced through a live region.
- On finish, win or lose: the word, its meaning and its reflection in the chosen language.
- Daily mode: the word is chosen from the local date, as day number modulo list length, in a pure function that takes a date. The day's guesses are saved to `localStorage`, so a reload restores the board.
- Practice mode: a random word that is never today's daily word. Nothing is saved.

Done when: daily and practice both play to a win and to a loss, a reload restores the daily board, 4- and 9-letter answers both fit at 360 px, and both keyboards work.

### Doodle catcher

Canvas 2D game. The simulation is a pure `step(state, input, dt, rng)` function, separate from drawing, so it can be unit tested with a seeded random source.

- The doodle moves along the bottom; items fall from the top. Lists and tuning come from `doodle-items.json`.
- Controls: drag (the doodle follows the finger), tap or hold the left or right half of the play area, arrow keys or A and D on desktop.
- Catching a positive item adds one point and briefly shows its word. Touching a negative item ends the run. A missed item costs nothing.
- Speed rises slowly from `startSpeed` by `speedRamp`, capped at `maxSpeed`.
- Positive and negative items have different outline shapes (round against jagged) and different icons, as well as different colours.
- `icon` names one of a small built-in icon set; an unknown name falls back to a generic icon and the validator warns.
- Labels are drawn in the chosen language. Wait for `document.fonts.load()` for the active script before the first frame, or Gujarati and Hindi labels render in a fallback font.
- The canvas uses a fixed logical size scaled to its container and to `devicePixelRatio`. Motion uses delta time, with large gaps clamped.
- The game pauses on tab hide and has a Pause button. The start screen states the controls.
- Score, pause and the game-over screen are DOM elements, not canvas drawing. Game over shows the score, the negative item that was hit with its one-line explanation, and "Play again", which receives focus.
- The doodle is an original character drawn for this project. It must not resemble a character from any existing game or brand.

Done when: a full run plays by touch and by keyboard, game over shows score, item and explanation, Play again restarts cleanly, labels render correctly in all three languages, and it is playable at 360 px.

## 9. Build order

One or more commits per milestone, pushed when the milestone's checks pass. Every milestone ends with `lint`, `typecheck`, `test` and `build` green.

| # | Milestone | Checks before moving on |
| --- | --- | --- |
| 0 | Project setup: Vite, React, TypeScript, lint, format, test runners, CI workflow, README with stack, scripts and conventions | `dev` and `build` run; CI config present |
| 1 | i18n module, language switch, fonts, layout, routes, intro page, both section homes, list pages, not-found | Every route renders in three languages; language survives reload |
| 2 | Content schemas, loaders, validation script; story engine and prasang reader; one sample story and prasang per section | A broken story fails validation; a new content file appears with no code change |
| 3 | Pill game | Pill game criteria |
| 4 | Word game | Word game criteria; scoring and daily-word unit tests |
| 5 | Doodle catcher | Doodle criteria; `step()` unit tests |
| 6 | Accessibility and phone pass; end-to-end suite; README completed; Pages workflow (manual trigger) | Section 10 |

If the repository refuses a push that contains workflow files, leave them out of the push, say so in the README and in the final report, and carry on.

### End-to-end coverage

- Each route loads in each language at 360 px with no horizontal overflow and no axe violations.
- Each game's main flow, by touch-sized pointer and by keyboard.
- A story played to two different endings; a prasang read to its lesson box.
- No request leaves the site's origin.
- Language choice persists across reload and navigation.

## 10. Definition of done

- Every route in section 5 loads and is reachable from the intro page in at most three taps.
- All three games meet their "Done when" criteria on a phone-sized viewport and on desktop.
- Adding a story, a prasang, a word, a doodle item or a pill card by editing content files works with no code change, and the README explains how, step by step, for a non-developer.
- Works at 360 px width; fully keyboard navigable; colour is never the only signal.
- Every page and game is usable in English, Gujarati and Hindi; strict validation reports no missing interface strings.
- No personal data collected; no third-party requests.
- All placeholder content carries the placeholder marking from section 7, and nobody could mistake it for final content.
- The README lists every open question from section 2 as answered or still open, and separately lists the launch blockers: translation review, real content, sources for every red-pill claim, the green pill's destination, branding, hosting.

## 11. Final report from the builder

When the build is finished, report: what was built against section 10, what was verified and how, anything that does not meet a criterion, any place the build departed from this plan and why, and the open questions that still need the owner.
