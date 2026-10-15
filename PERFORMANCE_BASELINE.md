# Performance baseline

*Measured 2026-10-15 on commit `532e068` (branch `optimization/audit`, created from `feature/mongodb`). Production build (`npm run build`), served locally by `next start` with Hidden Pubs in **memory stores** (`PUB_GAME_MEMORY_STORES=true`, empty `MONGODB_URI`/`BLOB_READ_WRITE_TOKEN`), so no real database was touched.*

These are **lab** numbers from one Windows laptop. There is no field data yet (no real users, no analytics), so the "75th percentile" of real Core Web Vitals cannot be computed. The same scripts will be rerun after each batch, under the same conditions, for `OPTIMIZATION_RESULTS.md`.

## 1. How it was measured

| What | How |
|---|---|
| Page load (FCP, LCP, CLS, TBT, bytes) | A Playwright script (Chromium from the project's `@playwright/test`, no new package). Phone emulation 390 × 844, DPR 2.625, touch. Throttling close to Lighthouse's mobile profile: **150 ms RTT, 1.6 Mbps down, 750 kbps up, 4× CPU slowdown**. Cache disabled, a fresh context per run, **median of 3 runs**. LCP/CLS from `PerformanceObserver`; TBT = sum of (long task − 50 ms) until 3 s after `load`. Bytes = encoded (gzip) transfer per resource type. |
| Bundle sizes | `.next/static/chunks` after the build: raw size and `gzip -c` size of each chunk, and the chunks referenced by each page's HTML. |
| HTML / RSC payload | `curl` of each page, raw and with `Accept-Encoding: gzip`. |
| API latency | A Node script against the local server (memory store): 10 × create game, 50 × full state poll, 100 × unchanged poll, 20 × poll without cookie; p50/p95. |
| Not measured | **Lighthouse score** (the `lighthouse` package is not installed; installing it needs your OK; the throttled Playwright run above approximates its lab conditions). **INP** (needs real interactions; TBT is the lab proxy). **MongoDB query times** (I did not query the real database; `npm run test:db` against `HiddenAntwerpGeneral_test` can give Atlas round-trip times, see §5). **Map initialisation** on a real phone (needs a device; see §6). |

Scripts: kept outside the repo (session scratchpad). They can be committed under `scripts/perf/` if you want them in the project.

## 2. Page load (throttled phone, median of 3)

| Page | TTFB | FCP | LCP | CLS | TBT | JS (gz) | Fonts | Images | HTML (gz) | Requests |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | 76 ms | 2.31 s | 2.31 s | 0 | 859 ms | 215 KB | 67 KB | 56 KB | 8 KB | 17 |
| `/walks` | 55 ms | 2.11 s | 2.89 s | 0 | 778 ms | 215 KB | 67 KB | 143 KB | 9 KB | 20 |
| `/walks/poortjes-van-antwerpen` | 167 ms | 3.01 s | **3.24 s** | 0 | 961 ms | 215 KB | 67 KB | 56 KB | **33 KB** | 18 |
| `/walks/classics-of-antwerp` | 59 ms | 2.24 s | 2.57 s | 0 | 831 ms | 215 KB | 67 KB | 87 KB | 11 KB | 18 |
| `/walks/hidden-pubs` | 47 ms | 2.42 s | 2.42 s | 0 | 937 ms | 215 KB | 67 KB | 0 | 10 KB | 16 |
| `/walks/classics-of-antwerp/play` | 82 ms | 1.85 s | 2.88 s | 0 | 870 ms | 242 KB | 67 KB | 87 KB | 33 KB | 21 |
| `/games/new?walk=hidden-pubs` | 37 ms | 1.96 s | 1.96 s | 0 | **1,781 ms** | 213 KB | 67 KB | 0 | 7 KB | 16 |

Against the targets:

| Target | Status |
|---|---|
| LCP ≤ 2.5 s | Met on `/`, `/walks/hidden-pubs`, `/games/new`. **Missed** on `/walks` (2.89 s), Poortjes detail (3.24 s), Classics detail (2.57 s), Classics play (2.88 s). |
| CLS ≤ 0.1 | **Met everywhere (0).** |
| INP ≤ 200 ms | Not measurable in the lab. TBT of 780–960 ms (1.8 s on `/games/new`) under 4× CPU means hydration blocks the main thread for a long time; that is the main risk for INP on mid-range Android. |
| Lighthouse ≥ 90 | Not run (see §1). With TBT ≈ 850 ms Lighthouse would very likely score below 90 (TBT carries 30 % of the score). |

## 3. JavaScript bundle (production build)

All chunks: 2.4 MB raw in `.next/static/chunks`. **Every page loads the same ~215 KB gzip (≈ 720 KB raw) of JavaScript.** What it consists of:

| Chunk | Raw | Gzip | Content | Loaded on |
|---|---|---|---|---|
| `0qy3sss5e6eww.js` | 234 KB | 73 KB | React DOM | every page |
| `3cw3b3vc8y5y6.js` | 227 KB | **67 KB** | **All interface texts in all 8 languages** (`src/i18n/messages.ts` imports every locale; `useT()` needs them in the browser) + the i18n client | **every page** |
| `1vpb-yc8nz0j1.js` | 160 KB | 44 KB | Next.js router/runtime | every page |
| `1n3kxgfdaowy0.js`, `2buwclp9pjwui.js`, `2o3sxvo8inbee.js`, others | ≈ 60 KB | ≈ 25 KB | Layout, header, components | every page |
| `0cz1d0mv5g_q7.js` | 113 KB | 39 KB | Polyfills, `noModule` (modern browsers don't download it) | old browsers only |
| `16xuxlaccjd0k.js` | **1,031 KB** | **278 KB** | MapLibre GL (lazy, `next/dynamic`) | when a navigation screen opens |
| `/maplibre/6.11.1/maplibre-gl-shared.mjs` + worker | 516 KB + 19 KB | 147 KB + 6 KB | MapLibre worker (self-served, 1-year immutable cache) | when a map starts |
| `22hmjul78ixo8.js` | 73 KB | 7 KB | Hidden Pubs walking routes (`routes.json`, lazy) | while a team walks |
| `20ab809xe407o.js` | 134 KB | 37 KB | `@vercel/blob/client` (lazy import) | when evidence is uploaded |

The single biggest avoidable item on the first load is the 67 KB gzip of translations: a visitor needs 1 language (+ English as fallback), but downloads and parses 8.

Opening the map on a slow connection costs ≈ 430 KB gzip (chunk + worker) before the first tile, downloaded only at that moment.

## 4. HTML / RSC payload

| Page | Raw | Gzip |
|---|---|---|
| `/` | 27 KB | 7 KB |
| `/walks` | 34 KB | 8 KB |
| `/walks/poortjes-van-antwerpen` | **304 KB** | 33 KB |
| `/walks/classics-of-antwerp` | 56 KB | 10 KB |
| `/walks/hidden-pubs` | 52 KB | 9 KB |
| `/walks/poortjes-van-antwerpen/play` | **318 KB** | **64 KB** |
| `/walks/classics-of-antwerp/play` | 143 KB | 33 KB |

The play pages serialise the whole walk (all stops' texts for the current language) into the RSC payload for the client `WalkPlayer`; the browser has to parse it before hydration.

## 5. API (Hidden Pubs, memory store, local)

| Request | p50 | p95 | Response |
|---|---|---|---|
| `POST /api/games` (create) | 13.9 ms | 208 ms (first, cold module) | 67 B |
| `GET /state` (full view, 4 teams, lobby) | 9.3 ms | 12.8 ms | 1.3 KB |
| `GET /state?since=<current>` (unchanged) | 8.5 ms | 14.5 ms | 29 B |
| `GET /state` without cookie | 8.3 ms | 11.7 ms | 22 B (401) |

With memory stores the server itself costs < 10 ms per request; the real cost in production is the number of **MongoDB round trips** per request, counted from the code (see AUDIT_REPORT.md B1/B8):

| Request | Atlas round trips (from the code) |
|---|---|
| Poll, nothing changed | 2 (full game document + player lookup) |
| Poll, something changed | 3 (+ events) |
| One action | up to ~11 (player, game + action pre-check per attempt, transaction with 5 operations + commit, reload game, events) |

Every phone polls every 2 s, and any action of any team makes every phone's next poll a "changed" poll. 16 phones ≈ 8 polls/s ≈ 16–24 Atlas operations/s. Real Atlas latency per round trip (Vercel region ↔ Atlas region) is not measured yet.

## 6. Not yet measured (and how)

- **Map initialisation on a phone.** Needs a real phone (or the remote debugger) with a production build: time from opening the navigation screen to MapLibre's `load` event. Lab estimate from bytes alone: ≈ 430 KB gzip on 1.6 Mbps ≈ 2.2 s of download before the style and tiles.
- **React renders per GPS fix / per poll.** Counted from the code (AUDIT_REPORT.md): one `NavigationScreen` render per GPS fix; one full `PubGame` tree render per changed poll. A React Profiler session in dev can confirm it.
- **Long-session memory.** Needs a multi-hour run on a phone; the code review found no leaks.
- **Lint duration.** `npm run lint` took several minutes in this run; the untracked `.tts/` and `.cache/` folders (Python venv, models) are not in the ESLint ignores (AUDIT_REPORT.md X3).
