@AGENTS.md

# Hidden Antwerp (repo: project_tours)

A mobile-first web app for **self-guided city walks in Antwerp**, played in the phone browser (no app). Two kinds of walk: narrated **guide walks** (history, images, then/now) and a team **game walk** (challenges, clues, drink votes, final puzzle). Built in-browser GPS navigation between stops. 8 languages. Status: **prototype / playtest phase**. No backend, no database, no payments, no accounts yet. The site is `noindex` (`robots` in `src/app/layout.tsx`) while it contains placeholder content.

## About the developer

I'm a programming student. I'm comfortable with TypeScript, JavaScript, React, Node.js/Express, HTML/CSS, Bootstrap, C#/.NET, SQL, MongoDB and Git/GitHub.
**I'm currently learning Next.js**, so keep code understandable and educational. I want to understand my own project.

## Stack

- Next.js **16.3** (App Router, `src/app/`, Turbopack), React 19.2, TypeScript strict. Path alias `@/*` → `./src/*`.
- Tailwind CSS v4 (`@tailwindcss/postcss`); design tokens + walk themes in `src/app/globals.css`. Fonts via `next/font/google`: Cormorant Garamond (display) + Source Sans 3 (body), both with `latin`, `latin-ext` and `cyrillic` subsets.
- **Only runtime dependency besides Next/React: `maplibre-gl` 6.** No i18n library, no state library, no UI kit.
- ESLint 9 (`eslint-config-next`). Vitest 4 + React Testing Library (jsdom), tests in `src/__tests__/`.
- Node 20 locally (end-of-life; upgrade planned). CI uses the version in `.nvmrc` (22); `engines` allows Next's minimum (≥ 20.9). Windows machine (use Git Bash / PowerShell syntax accordingly).
- CI: `.github/workflows/ci.yml` runs typecheck → lint → i18n:check → tests → build on every push to `main` and every PR.

## Commands

```bash
npm run dev            # dev server :3000 (predev copies the MapLibre worker)
npm run build          # production build (prebuild copies the worker too)
npm start              # serve the build (use e.g. `npx next start -p 3200` if 3000 is taken)
npm run typecheck      # = npx tsc --noEmit
npm run lint
npm run test:run       # = npx vitest run, all tests once (~670); `npm test` = watch mode
npm run i18n:check     # every language has every UI text (en = master)
node scripts/generate-walking-routes.mjs <walk-folder>   # after changing coordinates.json
node scripts/download-commons-images.mjs <walk-folder>   # after changing image-sources.json
```

## Folder map

```
src/app/                      pages (Server Components): / , /walks, /walks/[slug], /walks/[slug]/play, not-found
src/components/layout|ui/     SiteHeader/Footer, LanguageSelector (🌐), Button, Badge, Dialog, ConfirmDialog, ProgressBar…
src/features/walks/           walk cards, detail-page sections, format-walk.ts (Intl formatting), walk-content.ts
src/features/walk-session/    the player core: WalkPlayer (routes to game or guide), usePlayerShell + getCurrentStop +
                              StopNavigation (shared by both players), game screens, session-reducer.ts,
                              answers.ts, voting.ts, session-stats.ts, storage/session-storage.ts, playtest/
src/features/guide/           GuideWalkPlayer + stop page, chapter cards, card decks, search tasks, collection, glossary
src/features/navigation/      NavigationScreen, WalkingMap (MapLibre), DirectionPanel, useGeolocation, useWakeLock,
                              logic/ (arrival, tracking, route-progress, route-legs), simulation/ (fake GPS), config.ts
src/i18n/                     translation layer (see "Languages")
src/lib/                      repositories/ (walkRepository, cached getWalk), routing/ (OSRM normalising, maneuver labels),
                              geo.ts, walk-locations.ts (route order), validate-walk.ts, security-headers.ts
src/types/                    shared models (walk, location, challenge, content, guide, navigation, session, …)
src/data/walks/               ALL walk data (see "Walks")
scripts/                      route generator, Commons image downloader, MapLibre worker copy, translation check
public/images/classics|poortjes/   walk images (committed). public/maplibre/ is generated + git-ignored.
I18N.md                       full i18n guide (how to add texts / translate a stop / add a 9th language)
```

## Architecture

- Pages are Server Components that read walks through **`walkRepository`** (`src/lib/repositories/`, currently `MockWalkRepository` over `src/data/walks`, methods take a `locale`). Swap this for a real DB later; keep pages unaware of the source.
- `/walks/[slug]/play` renders the client `<WalkPlayer>`. It picks **`GuideWalkPlayer`** when `walk.experience === "guide"`, else the game flow.
- Session state: `useReducer` with the pure `session-reducer.ts` (`SessionAction`s), saved to **localStorage** key `hidden-antwerp:playtest:<slug>` (`STORAGE_VERSION = 3`). Only progress is saved. When bumping the version, add a step to `migrateToCurrent` in `storage/session-storage.ts` so mid-walk saves survive (versions without a step are discarded). Saves are validated field by field (`isWellFormedSession`), then adapted to the walk's current stops by `logic/reconcile-session.ts`: new stops are added as locked, removed stops and their clues dropped; only a removed *current* stop resets the game. The same reconcile runs on in-memory state when the page re-renders (language switch), so the game is never reloaded from storage for the same walk.
- Game flow per stop: navigate ("I'm here" always available; asks to confirm when GPS says > 150 m away) → arrive → drink vote (skippable) → story (ledger page) → challenge (hints unlock after wrong answers; after 3 wrong answers the team may **show the answer**, `logic/reveal-answer.ts`: the stop still counts as solved and gives its clue, and the translated explanation is shown) → solved → historical reveal → clue → next stop; finale after the last stop.
- Errors: `app/walks/[slug]/play/error.tsx` (retry = full reload, or restart only this walk) and `app/global-error.tsx`. Production error logs contain only the error name (`lib/log-error.ts`), never messages (could contain positions).
- Guide flow: start screen → chapter card (when a chapter starts) → navigate → stop page (intro, sections by kind, cards, search task, then/now, "did you know", glossary, info boxes with "checked on" date, sources) → optional detour choice → … → closing/completion.
- **Everything is data-driven.** Never write walk-specific conditions (`if (walk.slug === "…")`). Add optional fields/types instead so any walk can use the same components.
- Visual themes: `walk.theme` = `classic` | `tavern` | `archive`, applied via `data-walk-theme` CSS token overrides in `globals.css`.
- Playtest tools (yellow panels: jump to stop, show answer, simulated/auto-walk GPS): on in dev; in production only if `NEXT_PUBLIC_PLAYTEST_TOOLS=true`. English only on purpose.

## Walks (`src/data/walks/`)

Registered in `src/data/walks/index.ts` → `getWalks(locale)`: **Poortjes, Hidden Pubs, Classics**. Each walk module exports `get<Walk>Walk(locale)` (built once per language via `cachePerLocale`) plus an English constant for tests.

| Walk (slug) | Kind | What | Data files |
|---|---|---|---|
| **Poortjes van Antwerpen** (`poortjes-van-antwerpen`), EN title "The Gates of Antwerp" | guide | Full-day walk (~9.8 km) along the gates drawn by **Paul Smekens**, *Oude poortjes in Antwerpen. 52 tekeningen* (De Sikkel, 1951). 35 stops (33 main + 2 optional: Rodestraat detour, Red Star Line), 5 chapters, 52 drawings in a collection with status (`exists`/`vanished`/`in-renovation`/`optional`/`unknown`), 3 search tasks (Gildekamersstraat, Academie garden, Adriaan Brouwerstraat), cards (e.g. Rockox, Van Gogh), glossary. Vanished gates are never waypoints: they're shown at the nearest stop. | `stops.ts` (types, status, sources, which Classics photos), `collection.ts` (plate, number, address, status, **Dutch book caption**), `content/<lang>/{index,deel-1..4,collection}.ts`, `coordinates.json`, `routes.json` |
| **Hidden Pubs** (`hidden-pubs`), brand name, not translated | game | 8 cafés, fiction "The Lost Tavern Ledger", team drink votes, on-site challenges, clues, bonus question, 3-question finale. Route revealed progressively. | `01-rococo.ts`…`08-boer-van-tienen.ts` (café name, address, drink categories, Dutch ledger text, answers, clue icon), `finale.ts`, `helpers.ts` (builders), `content/<lang>.ts`, `coordinates.json`, `routes.json` |
| **Classics of Antwerp** (`classics-of-antwerp`) | guide | 18 stops from Antwerpen-Centraal back in time to the Scheldt, historical photos + then/now. | `stops.ts`, `content/<lang>.ts`, `image-sources.json` → `images.json`, `coordinates.json`, `routes.json` |
| Upcoming: Dark Antwerp, The Rubens Code | – | "coming soon" cards only | `upcoming-walks.ts` |

**"The 17 Gates" (`src/__tests__/fixtures/the-17-gates.ts`) is NOT a live walk.** It's an old English placeholder walk kept only as a test fixture (5 tests import it). The real gates walk is Poortjes van Antwerpen.

Pattern: **technical data exists once** (ids, coordinates, addresses, images, answers, statuses); **texts exist per language** in `content/`. `content/types.ts` of each walk defines the text shape.

## GPS, map & navigation (`src/features/navigation/`)

- Walking routes are **pre-generated** per leg (and a bypass leg around each optional stop) by `scripts/generate-walking-routes.mjs` using the free OSRM foot router at routing.openstreetmap.de, stored in `routes.json`. No routing API at runtime. Rerun after changing `coordinates.json`. Coordinates have `status` (`verified` / `to-verify`); unknown = `null`. **All 61 are currently `to-verify`** (geocoded, not checked on site; see `FIELD_TEST_CHECKLIST.md`).
- Map: **MapLibre GL 6 + OpenFreeMap tiles** (no key; `NEXT_PUBLIC_MAP_STYLE_URL` overrides). MapLibre's worker must be served from `/maplibre/` (copied by `scripts/copy-maplibre-worker.mjs`, set via `setWorkerUrl`); without it the map stays blank. Don't remove this.
- Live position via `navigator.geolocation.watchPosition` (`useGeolocation`), screen wake lock while navigating (at most one lock). Thresholds in `config.ts` (arrival 40 m + accuracy ≤ 40 m + 2 confirmations; off-route 30 m ×3; far-from-route 150 m ×2 → "head to" guidance with a compass direction and an arrow). Map fits user + destination; north-up above 1 km.
- Noisy GPS is filtered in the pure `logic/tracking.ts` (tested): exact repeated readings are ignored; readings worse than 150 m are not used for position (only "GPS weak"); an implausible jump (> 10 m/s) is held back until a second reading confirms it, unless a precise reading replaces an imprecise position. A browser TIMEOUT is status `"searching"` (the watch keeps trying). The camera only moves for ≥ 4 m / ≥ 10° / a mode change (`logic/camera.ts`), stops following on any user pan/zoom/rotate, and doesn't animate with reduced motion. An accuracy circle shows how sure the dot is.
- Permission explainer is skipped if already granted; if denied, the map and "I'm here"/"continue without GPS" still work.
- **Location privacy:** GPS positions live in memory only while a navigation screen is open. Never store them (not in localStorage, not on a server) and never build a location history.

## Images

- **Classics:** only reusable licenses from Wikimedia Commons (public domain/CC0 for historical images; CC BY/BY-SA with attribution for modern photos). List them in `image-sources.json`, run `download-commons-images.mjs <walk>`, which refuses other licenses and writes files (`public/images/<folder>/`) plus `images.json` (size, author, source, license). Check each downloaded image visually (e.g. postcard backs). Captions/alt text are per language in `content`. The UI always shows caption + credit + license (`GuideImageFigure`).
- **Poortjes** reuses Classics photos by id and shows Smekens' drawings `public/images/poortjes/gate-01…52.jpg` (file number = plate number). **Rights of the 1951 drawings are not yet cleared** (`license: "Rights still to be verified"` + TODO in `poortjes-van-antwerpen/index.ts`). Clear them before a public launch.

## Languages (i18n): details in `I18N.md`

- 8 locales: **en** (default + fallback, master), nl, fr, es, it, de, ru, uk (`src/i18n/config.ts`). Custom lightweight layer on `Intl`, **no package**.
- Language choice: cookie `ha-locale` (1 year) → else browser `Accept-Language` (`nl-BE`→nl, unsupported→en). Also saved in localStorage `hidden-antwerp:locale`; `<LocaleSync>` restores it if the cookie is gone. **URLs never contain the locale.** Reading cookies makes all routes dynamic (intended). Switching = save + `router.refresh()`, which keeps client state (game, GPS).
- Server: `const t = await getTranslator()` (`src/i18n/server.ts`). Client: `const t = useT()` (`src/i18n/client.tsx`). `t("key", { value })`, `t.plural("key", n)` (Intl.PluralRules; ru/uk have one/few/many). Keys are typed from the English JSON. Missing → English + dev console warning, never `undefined`.
- UI texts: `src/i18n/locales/<lang>/{common,navigation,meta,home,errors,walks,game,guide,gps}.json`, semantic keys only. Formatting helpers in `format-walk.ts` (`formatDate`, `formatPrice` with `${locale}-BE`, `formatDistance`, `formatDuration`, `formatLanguages`).
- Walk content: `LocalizedContent<T> = { en: T; nl?: …}`; `pickContent` deep-merges a translation over English (arrays replaced whole). `walk.languages` = languages that have content. **All 3 walks + upcoming walks are fully translated in all 8 languages.**
- Checks: `npm run i18n:check` (UI), `src/__tests__/i18n-walk-content.test.ts` (each translation must have exactly the English structure; technical values unchanged), `walk-data.test.ts` runs every walk in every language.
- Translation rules: **street names/addresses never translated** (Latin script also in ru/uk); Antwerp names stay (Grote Markt, Brabo, Onze-Lieve-Vrouwekathedraal, Rubenshuis, Vlaeykensgang, Het Steen, house names), optionally explained in parentheses; exonyms OK for city/river (Anvers, Шельда). Never change facts while translating; research markers are translated, not removed.
- Hidden Pubs ledger = in-world **Dutch** document: original text in the stop files, `translation` per language in content (not shown to Dutch visitors). Text answers accept all languages (`timeAnswers`, `horseAnswers`, `barrelGameAnswers` in the stop files + `finale.ts`); comparison ignores case, accents, punctuation **and spaces**. When changing a challenge, update the answers for every language.
- Smekens' drawing captions stay in the original Dutch (quoted source); titles of Dutch sources in source lists stay Dutch.

## Key types (`src/types/`)

`Walk` (+ `WalkSummary`, `UpcomingWalk`, `WalkCopy`, `WalkFinale`, `WalkNarrative`, `experience`, `theme`, `routeReveal`, `contentStatus`), `WalkLocation` (coordinates|null, `content: ContentBlock[]`, `challenge`, `bonusChallenge`, `drinkRound`, `historicalReveal`, `guide?: GuideStopContent`, `isBonus`), `Challenge` (union: multiple-choice / text-answer / number-answer / observation / sequence / code, `hints`, `researchStatus`), `ContentBlock` (`history` with `verification` | `legend` | `story` with `originalLanguage`/`translation`), `HistoricalReveal`, `Clue`, `DrinkOption` (`alcoholic`, `menuVerification`), guide types (`GuideSection` kind history/interpretation/context/legend, `GuideImage`, `CollectionItem`, `HeritageStatus`, `SearchTask`, `InfoBox` with `checkedOn`, `WalkChapter`), navigation (`RouteLeg`, `WalkingRoute`, `Maneuver`, `GpsFix`), session (`WalkSession`, `LocationProgress`, `SessionAction`).

## Environment & external services

No secrets are needed. `.env.example` (committed, no values) documents the only variables: `NEXT_PUBLIC_MAP_STYLE_URL` (optional tile style), `NEXT_PUBLIC_PLAYTEST_TOOLS=true` (playtest tools in production; the build prints a warning) and `DEV_ALLOWED_ORIGINS` (dev only: your computer's exact LAN IP, e.g. `192.168.1.23`, **needed to open the dev server from a phone**; no wildcards).
Security headers for every response come from `src/lib/security-headers.ts` via `next.config.ts` (nosniff, Referrer-Policy, Permissions-Policy `geolocation=(self)`, `X-Frame-Options: DENY`, no `X-Powered-By`). The Content Security Policy is **Report-Only**: check the browser console on real phones with a production build, then switch the key to `Content-Security-Policy`. A custom map style on other hosts needs those hosts added to the CSP. `.env*` except `.env.example` is git-ignored. External services: OpenFreeMap tiles (runtime, keyless), OSRM at routing.openstreetmap.de and the Wikimedia Commons API (only from the scripts), Google Fonts (build time). Git remote: `github.com/ToonPanis/project_tours`, branch `main`.

## Status

**Works:** home, walk list, detail pages (stats, practical info, collection, story teaser, how-it-works), all three walks playable end to end, save/continue/restart, GPS navigation with map, arrival detection, off-route handling, simulated GPS, full 8-language UI + content, language selector with persistence, translated metadata/OG, tests + build green.

**In progress / open:**
- Content is `contentStatus: "placeholder"`: many stops are `partially-verified`/`research-required`; not reviewed by a historian; Poortjes gates need on-site checks (`[To be verified on site]` markers).
- Hidden Pubs: several answers are **playtest placeholders** (Rococo gable shape, De Kat cat count = 9, De Varkenspoot pig form, bonus 't Gulick) with `researchStatus`; café-interior challenges (Den Engel, De Muze, De Kat, Quinten Matsijs) still need an **outdoor fallback** when a café is closed/full; Rococo & De Varkenspoot history still to research; some drinks `to-verify` (the UI adds a translated "(check the menu)").
- Smekens drawing rights, see Images.
- Translations were made by AI and are not reviewed by native speakers (ru/uk name transliterations and some glossary terms were flagged as worth checking). Italian UI uses "tu" in a few labels, content addresses the group with "voi".
- Not built yet: payments (prices are display only), accounts, backend/DB, server-side answer checking (answers ship to the client), analytics.

**Known quirks:** flag emoji show as letters ("GB", "NL") on Windows (fine on phones). `getImmediateLabel` in `maneuver-display.ts` is English and only used by tests. Local branches `backup/pre-i18n` (snapshot before i18n) and `feature/i18n-8-languages` (already merged into `main`) still exist.

## Decisions to keep (don't undo)

- Custom i18n without a package; locale in cookie, not in the URL; English is master/fallback; semantic keys; walk text separated from technical data.
- Pre-generated routes (no runtime routing API), MapLibre + OpenFreeMap, self-served MapLibre worker.
- No GPS storage, ever.
- History vs fiction vs legend always labelled; history comes *after* the challenge; research markers stay visible.
- Alcohol rules below. They are enforced by `walk-data.test.ts` in every language.
- "Hidden Pubs" title and café/brand names untranslated; the ledger stays Dutch with a translation.
- Vanished gates are never waypoints; optional stops get bypass legs.
- `the-17-gates.ts` is a test fixture (in `src/__tests__/fixtures/`), not a walk to revive.
- Every walk must pass `validateWalk` (`src/lib/validate-walk.ts`, run in `walk-data.test.ts` for every walk × language): add new structural rules there, not per walk.

## Code guidelines

1. TypeScript everywhere; no `any` unless truly necessary (use proper types, `unknown` + narrowing, generics).
2. Simple, readable solutions over clever abstractions.
3. App Router and modern Next.js practice. **Read `node_modules/next/dist/docs/` before using a Next.js API**: this version differs from older knowledge (e.g. middleware is now "proxy"; `cookies()`/`headers()` are async; use `unstable_rethrow` when catching around them).
4. Server Components by default; `"use client"` only for state, effects, handlers or browser APIs.
5. Small reusable components. UI in `src/components/` or `src/features/*/components/`, data in `src/data/` / `src/lib/`, shared types in `src/types/`, business logic in plain TS functions (not in components).
6. Clear names, minimal dependencies, never hardcode secrets (`.env.local`; only `NEXT_PUBLIC_*` reaches the browser).
7. Mobile-first (base styles, then `sm:`/`md:`/`lg:`); check 390 px width, long German words and Cyrillic.
8. Accessibility: semantic HTML, alt text, labels, keyboard access, contrast, `lang` attributes for foreign-language text.
9. New user-facing text → a key in **all 8** `locales/<lang>/*.json` (never hardcoded strings), then `npm run i18n:check`.

## Content rules

- **Never invent historical facts.** Real history has a verification status: `"verified"` (needs sources), `"partially-verified"` or `"research-required"`. Unresearched text carries a visible `[Historical research required]` marker.
- **Always separate history from fiction.** Blocks are `history`, `legend` or `story`; `historicalReveal` holds real history only. The UI labels each by kind and status.
- **History comes after the challenge:** real history goes in `historicalReveal`, not in the story shown before the challenge.
- **Never invent** drink menus, prices, opening hours, coordinates, sources or physical objects for riddles. Use visible placeholders (`[RESEARCH REQUIRED]`, `coordinates: null`), `menuVerification: "to-verify"` for unverified drinks, `researchStatus: "on-site-verification-required"` for on-site answers still to check. Practical info (opening hours, prices) always gets a `checkedOn` date and source.
- **Alcohol and cafés:** progress never depends on ordering or drinking; a drink vote is only a suggestion and every vote can be skipped; every round has an alcohol-free option and everyone chooses their own drink; **no shots**, no drinking challenges, speed, quantities, penalties or proof of drinking; never show or celebrate the number of drinks; alcohol-free players get exactly the same experience.
- **Challenges** depend on the physical location (observation, inscriptions, symbols, counting), not on googleable trivia.

## How to work with me

- **Before installing any npm package**, explain why and whether a built-in alternative exists. Wait for my OK.
- **Before any major architectural change**, explain the plan and why. Wait for my OK.
- Don't rewrite large parts of working code without a good reason; preserve existing functionality.
- On errors, find the root cause; no random fixes.
- **After implementing**, run `npx tsc --noEmit`, `npm run lint`, the relevant tests (and `npm run i18n:check` when texts changed), then report the results.
- Always list the files you created or modified.
- When implementing an important feature, briefly explain **what** changed, **where**, **how** the important parts work (especially Next.js concepts) and **how to test** it (manually and automated). Don't over-explain basic syntax.
