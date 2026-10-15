@AGENTS.md

# Hidden Antwerp (repo: project_tours)

A mobile-first web app for **self-guided city walks in Antwerp**, played in the phone browser (no app). Two kinds of experience: narrated **guide walks** (history, images, then/now) and **Hidden Pubs**, a multiplayer pub game (teams, each player on their own phone, a live leaderboard). Built in-browser GPS navigation between stops. 8 languages. Status: **prototype / playtest phase**. Only Hidden Pubs and the admin area have a backend (MongoDB Atlas for games and commerce data, Vercel Blob for evidence photos); no customer accounts. The **commercial platform** is being built in phases (`docs/commercial/`): P1 (admin sign-in, product catalogue, audit log, email) is merged; P2 (Stripe payments, tickets, configurable VAT, receipts/invoicing, refunds) P3 (Hidden Pubs tickets → games with a seat limit) and P4 (corporate page + quote requests) are merged and P5 (admin dashboard) is built; payments in **test mode** with ticket sales **closed** (`COMMERCE_SALES_ENABLED` off: the site works as before). The site is `noindex` (`robots` in `src/app/layout.tsx`) while it contains placeholder content.

## About the developer

I'm a programming student. I'm comfortable with TypeScript, JavaScript, React, Node.js/Express, HTML/CSS, Bootstrap, C#/.NET, SQL, MongoDB and Git/GitHub.
**I'm currently learning Next.js**, so keep code understandable and educational. I want to understand my own project.

## Stack

- Next.js **16.3** (App Router, `src/app/`, Turbopack), React 19.2, TypeScript strict. Path alias `@/*` → `./src/*`.
- Tailwind CSS v4 (`@tailwindcss/postcss`); design tokens + walk themes in `src/app/globals.css`. Fonts via `next/font/google`: Cormorant Garamond (display) + Source Sans 3 (body), only `latin` is preloaded (`subsets`); Cyrillic and Latin-extended still load on demand via `unicode-range`.
- **Runtime dependencies besides Next/React:** `maplibre-gl` 6 (maps), and for Hidden Pubs `mongodb` 6 (the official MongoDB driver; 7.x needs Node ≥ 20.19), `@vercel/blob` 2 (evidence photos/videos) and `qrcode-generator` (join QR code); for payments `stripe` 23.0.0 (the official SDK, pinned exactly; only `server/payment-gateway.ts` imports it). No i18n library, no state library, no UI kit.
- ESLint 9 (`eslint-config-next`). Vitest 4 + React Testing Library (jsdom), tests in `src/__tests__/`. Shared setup in `src/__tests__/setup.ts` (cleanup, empty storage, `<dialog>` stand-in); mocks and global stubs are restored between tests. Tests take content from the data and texts from the translations (never type café names, answers or UI text literally); `fixtures/fake-maplibre.ts` stands in for MapLibre.
- Node 20 locally (end-of-life; upgrade planned). CI uses the version in `.nvmrc` (22); `engines` allows Next's minimum (≥ 20.9). Windows machine (use Git Bash / PowerShell syntax accordingly).
- Playwright (dev) for browser tests in `e2e/` (a 390 px Chromium phone against the production build); `@vitest/coverage-v8` for coverage of the logic folders (thresholds in `vitest.config.mts`).
- CI: `.github/workflows/ci.yml` runs typecheck → lint → i18n:check → unit tests with coverage → build → browser tests on every push to `main` and every PR.

## Commands

```bash
npm run dev            # dev server :3000 (predev copies the MapLibre worker)
npm run build          # production build (prebuild copies the worker too)
npm start              # serve the build (use e.g. `npx next start -p 3200` if 3000 is taken)
npm run typecheck      # = next typegen (PageProps/LayoutProps types) + tsc --noEmit
npm run lint
npm run test:run       # = npx vitest run, all unit/component tests once (~1,030, 90–120 s); `npm test` = watch mode
npm run test:coverage  # the same, plus coverage of the logic folders (fails under the thresholds)
npm run test:e2e       # browser tests (Playwright); run `npm run build` first. First time: `npx playwright install chromium`
npm run i18n:check     # every language has every UI text (en = master)
npm run db:setup       # Hidden Pubs: create the MongoDB collections, validation and indexes (db/mongo-schema.mjs) in MONGODB_URI; only adds, safe to rerun
npm run db:check       # Hidden Pubs: database health check (ping, collections/indexes, active games); read only, prints no secrets
npm run media:download -- <CODE>   # Hidden Pubs: download a game's evidence photos/videos from the private Blob store to media-downloads/ (git-ignored); needs MEDIA_DOWNLOAD_TOKEN
npm run test:db        # Hidden Pubs + commerce: the MongoDB store tests against TEST_MONGODB_URI (a SEPARATE database whose name contains "test"; skipped without it)
node scripts/generate-walking-routes.mjs <walk-folder>   # after changing coordinates.json
node scripts/download-commons-images.mjs <walk-folder>   # after changing image-sources.json
```

## Folder map

```
src/app/                      pages (Server Components): / , /walks, /walks/[slug], /walks/[slug]/play, not-found
src/app/games/                Hidden Pubs: /games/new (create), /games/[code] (player), /games/[code]/host, /games/[code]/claim
src/app/api/games/            Hidden Pubs Route Handlers: create, join, state (polling), actions, claim, reveal, media upload/file
src/app/admin/                COMMERCIAL ADMIN (English only): /admin/login (+ /verify), and in the route group (console)/:
                              /admin (dashboard), /admin/orders(/[id]), /admin/quotes(/[id]), /admin/groups, /admin/documents,
                              /admin/products, /admin/discounts, /admin/tax, /admin/audit. src/app/api/admin/: auth, products, tax,
                              discounts, quotes/[id], corporate-pricing, reports/orders (CSV),
                              orders/[id]/(refund|revoke-ticket|reset-devices|resend)
src/app/checkout/, tickets/   buyers: /checkout/success, /checkout/canceled, /tickets/open#<ticket>; API: /api/checkout,
                              /api/webhooks/stripe, /api/tickets/activate, /api/cron/email-outbox
src/app/corporate/            /corporate: team building page, price guide, quote form (API: /api/quotes); footer link
src/features/commerce/        COMMERCIAL PLATFORM (see "Commercial platform" below): logic/ (money, tax, pricing, discounts,
                              catalogue input, email, rate limit, starter catalogue), server/ (auth, catalogue, tax, checkout,
                              fulfilment = the webhook, tickets, documents, order emails, order admin, email services, stores,
                              payment-gateway = Stripe, invoicing = Billit stub, admin-access/admin-route = access checks),
                              components/ (buyer UI: BuyBox, OpenTicket, TicketRequired), admin/ (admin client components)
src/components/layout|ui/     SiteHeader/Footer, LanguageSelector (🌐), Button, Badge, Dialog, ConfirmDialog, ProgressBar…
src/features/walks/           walk cards, detail-page sections, format-walk.ts (Intl formatting), walk-content.ts
src/features/walk-session/    the walk player core: WalkPlayer (→ GuideWalkPlayer), usePlayerShell + getCurrentStop,
                              StopNavigation, PlayScreen/PlayHeader/RoutePanel, session-reducer.ts, session-stats.ts,
                              storage/session-storage.ts, playtest/ (fast-forward + tools)
src/features/guide/           GuideWalkPlayer + stop page, chapter cards, card decks, search tasks, collection, glossary
src/features/pub-game/        HIDDEN PUBS (see "Hidden Pubs" below): logic/ (pure rules: apply-action, cards, route, scoring,
                              sips, player-view…), server/ (game-service, stores, identity; server only), client/ (usePubGame
                              polling, api, upload), components/ (lobby, café steps, Drunken Bastard, leaderboard, host dashboard…)
src/features/navigation/      NavigationScreen, WalkingMap (MapLibre), DirectionPanel, useGeolocation, useWakeLock,
                              logic/ (arrival, tracking, route-progress, route-legs), simulation/ (fake GPS), config.ts
src/hooks/                    shared client hooks (useScreenFocus: new screen → scroll to top + focus its h1)
src/i18n/                     translation layer (see "Languages")
src/lib/                      repositories/ (walkRepository, cached getWalk), routing/ (OSRM normalising, maneuver labels),
                              geo.ts, walk-locations.ts (route order), validate-walk.ts, security-headers.ts
src/types/                    shared models (walk, location, guide, navigation, session, pub-game, …)
src/data/walks/               ALL walk data (see "Walks")
scripts/                      route generator, Commons image downloader, MapLibre worker copy, translation check
db/mongo-schema.mjs           Hidden Pubs MongoDB collections, $jsonSchema validation, indexes (TTL) (used by db:setup, db:check, tests)
e2e/                          Playwright browser tests: pages, GPS walk + privacy, Hidden Pubs multiplayer (pub-game.spec.ts), languages, layout at 390 px, data use
public/images/classics|poortjes/   walk images (committed). public/maplibre/<version>/ is generated + git-ignored.
I18N.md                       full i18n guide (how to add texts / translate a stop / add a 9th language)
HIDDEN_PUBS_CONCEPT.txt       the owner's Hidden Pubs concept: the single source of truth for the game's rules (don't redesign it)
HIDDEN_PUBS_DATA_AUDIT.md     decisions D1–D34 taken on that concept, and what is still open
AUDIT_REPORT.md               technical audit of 2026-10-15 (performance, reliability, security); PERFORMANCE_BASELINE.md
                              (how it was measured) and OPTIMIZATION_PLAN.md (batches 0–7, what was done and measured)
docs/archive/                 the audit and plans from before Hidden Pubs 2.0 (history only)
```

## Architecture

- Pages are Server Components that read walks through **`walkRepository`** (`src/lib/repositories/`, currently `MockWalkRepository` over `src/data/walks`, methods take a `locale`). Swap this for a real DB later; keep pages unaware of the source.
- `walk.experience` is `"guide"` or `"pub-game"`. `/walks/[slug]/play` renders the client `<WalkPlayer>` → **`GuideWalkPlayer`**; a `"pub-game"` walk (Hidden Pubs) is redirected to `/games/new?walk=<slug>` instead (see "Hidden Pubs"). The old one-phone game engine (challenges, drink votes, clues, finale) was removed in stage 12b; it is in git history (before the commit "remove the one-phone game engine") if a challenge walk is ever wanted again.
- Session state: `useWalkSession` (`useState` + the pure `applySessionAction` in `session-reducer.ts`, `SessionAction`s), saved to **localStorage** key `hidden-antwerp:playtest:<slug>` (`STORAGE_VERSION = 4`). Only progress is saved: per stop a status `locked → travelling → arrived → (story) → solved`; actions `ARRIVE`, `SHOW_STORY`, `COMPLETE_VISIT`, `CONTINUE_TO_NEXT_LOCATION`. When bumping the version, add a step to `migrateToCurrent` in `storage/session-storage.ts` so mid-walk saves survive (versions without a step are discarded). Saves are validated field by field (`isWellFormedSession`), then adapted to the walk's current stops by `logic/reconcile-session.ts`: new stops are added as locked, removed stops dropped; only a removed *current* stop resets the walk. Version 2/3 saves (from the game era) are migrated: the game fields are dropped, game-only statuses become `arrived`. The same reconcile runs on in-memory state when the page re-renders (language switch), so progress is never reloaded from storage for the same walk.
- Errors: `app/walks/[slug]/play/error.tsx` (retry = full reload, or restart only this walk) and `app/global-error.tsx`. Production error logs contain only the error name (`lib/log-error.ts`), never messages (could contain positions).
- Guide flow: start screen → chapter card (when a chapter starts) → navigate ("I'm here" always available; asks to confirm when GPS says > 150 m away) → stop page (intro, sections by kind, cards, search task, then/now, "did you know", glossary, info boxes with "checked on" date, sources) → optional detour choice → … → closing/completion.
- **Everything is data-driven.** Never write walk-specific conditions (`if (walk.slug === "…")`). Add optional fields/types instead so any walk can use the same components.
- Visual themes: `walk.theme` = `classic` | `tavern` | `archive`, applied via `data-walk-theme` CSS token overrides in `globals.css`.
- Playtest tools (yellow panels: jump to stop, skip to next stage, simulated/auto-walk GPS): on in dev; in production only if `NEXT_PUBLIC_PLAYTEST_TOOLS=true`. English only on purpose.

## Walks (`src/data/walks/`)

Registered in `src/data/walks/index.ts` → `getWalks(locale)`: **Poortjes, Hidden Pubs, Classics**. Each walk module exports `get<Walk>Walk(locale)` (built once per language via `cachePerLocale`) plus an English constant for tests.

| Walk (slug) | Kind | What | Data files |
|---|---|---|---|
| **Poortjes van Antwerpen** (`poortjes-van-antwerpen`), EN title "The Gates of Antwerp" | guide | Full-day walk (~9.8 km) along the gates drawn by **Paul Smekens**, *Oude poortjes in Antwerpen. 52 tekeningen* (De Sikkel, 1951). 35 stops (33 main + 2 optional: Rodestraat detour, Red Star Line), 5 chapters, 52 drawings in a collection with status (`exists`/`vanished`/`in-renovation`/`optional`/`unknown`), 3 search tasks (Gildekamersstraat, Academie garden, Adriaan Brouwerstraat), cards (e.g. Rockox, Van Gogh), glossary. Vanished gates are never waypoints: they're shown at the nearest stop. | `stops.ts` (types, status, sources, which Classics photos), `collection.ts` (plate, number, address, status, **Dutch book caption**), `content/<lang>/{index,deel-1..4,collection}.ts`, `coordinates.json`, `routes.json` |
| **Hidden Pubs** (`hidden-pubs`), brand name, not translated | pub-game | Hidden Pubs 2.0, the multiplayer game (see "Hidden Pubs" below): 12 cafés, a random route per team, Drunken Bastard cards, pubtasks, bonus photo/video tasks, fun facts, live leaderboard. | `index.ts` (the Walk for list/detail page), `walk-texts.ts` (detail-page texts per language), `game/` (`definition.ts`, `cafes.ts`, `drinks.ts`, `route-groups.json`, `answers.server.ts`, `reveals/`, `content/<lang>.ts`, `navigation.ts`, `coordinates.json`, `routes.json`) |
| **Classics of Antwerp** (`classics-of-antwerp`) | guide | 18 stops from Antwerpen-Centraal back in time to the Scheldt, historical photos + then/now. | `stops.ts`, `content/<lang>.ts`, `image-sources.json` → `images.json`, `coordinates.json`, `routes.json` |
| Upcoming: Dark Antwerp, The Rubens Code | – | "coming soon" cards only | `upcoming-walks.ts` |

Pattern: **technical data exists once** (ids, coordinates, addresses, images, answers, statuses); **texts exist per language** in `content/`. `content/types.ts` of each walk defines the text shape.

## Commercial platform (`src/features/commerce/`, `src/app/admin/`, `src/app/api/admin/`)

- Plan, decisions and per-phase reports: `docs/commercial/` (audit, plan with decisions B1–B12, database design, security/GDPR, test strategy, `PHASE_X_REPORT.md`). Phases P1–P10; one phase at a time, each on its own branch and PR, waiting for the owner's OK.
- **Admin sign-in (B5):** one-time email link, no passwords. `ADMIN_EMAILS` says who may be admin (removing an address revokes it at once). Link → `/admin/login/verify#<secret>` (secret after `#`: never sent to a server; only used when the button is pressed, so mail scanners can't use it up) → httpOnly `SameSite=Strict` cookie `ha_admin`. Only SHA-256 hashes of link and session secrets are stored; links last 15 min and work once, sessions 12 h. Rate limits per hashed email and hashed IP (`RATE_LIMITS` in `config.ts`). The same answer for admin and non-admin addresses. Links use `APP_BASE_URL` in production, never the request's Host.
- **Access check:** every admin page calls `requireAdmin()` and every admin route `adminFromRequest()` (`server/admin-access.ts`, the "data access layer"); never only in a layout (layouts don't re-run on navigation).
- **Catalogue:** `com_products` + versioned `com_prices` (a price change adds a price). Every product is sold **per person** (B3); "17 Gates" is the product name of the Poortjes walk (B2). Starter products (`logic/starter-catalog.ts`) are created inactive and without tax category; a product can only go on sale with a tax category and a price. Money is whole cents; prices include VAT; `splitGrossAmount` gives net + VAT that always add up.
- **Tax (B8): no VAT rate in code, ever.** `/admin/tax` (versioned `com_tax_settings`): regime (`not-configured` | `exempt` with the accountant's mention | `vat-registered`), categories with rates, optional OSS rates per EU country, and "confirmed by the accountant" (withdrawn by every change unless ticked again). Sales need regime + confirmation (`taxAllowsSales`). Each order copies what applied (`taxBasis`); the split (`applyTax`) is worked out when paid, with the buyer's country.
- **Payments (P2, Stripe SDK 23, test mode):** `/api/checkout` prices on the server (catalogue + discount, never the browser's numbers), saves a `pending` order, opens a Stripe Checkout page with OUR total as one line (billing address + optional business name/VAT number), and sets the buyer cookie `ha_order`. **Only the webhook makes an order paid** (`fulfilment-service.ts`): signature checked on the raw body (`StripeGateway.parseWebhook`), the payment checked against the order (session, amount, EUR), every step idempotent (atomic `pending → paid`, one ticket per order, fixed document and email ids), so duplicate or concurrent events change nothing. Expiry/failure cancel the order and give the discount use back once. Refunds: admin → Stripe Refund API (idempotency key) → `charge.refunded` webhook → credit note, full refund revokes the ticket. `PaymentGateway` interface: Stripe or a fake in tests (no test calls Stripe). A live key is refused while sales are closed.
- **Tickets:** one per paid order with `seats` = persons. The link `/tickets/open#<id>.<HMAC>` is signed with `TICKET_SIGNING_SECRET`, not stored (can always be made again). Each phone that opens it takes one seat (atomic) and gets its own httpOnly cookie `ha_ticket_<walk>` (hash stored). `/walks/[slug]/play` asks `playAccess`: "open" when sales are closed or the walk isn't on sale (no database call), else a valid ticket or the `TicketRequired` screen.
- **Hidden Pubs groups (P3):** with sales open and Hidden Pubs on sale, `/games/new` and `POST /api/games` need an unused ticket opened on the organiser's phone (`newGameAccess`). The route reserves it atomically (`swapGrantGame`: null → `pending:<time>:<id>` → game code; a stale reservation > 2 min is taken over; a refused form gives it back), so **one ticket = one game**, and creates the game with `seatLimit` = persons on the ticket (organiser included). An already-used ticket shows a link back to its game. The game service knows nothing about tickets; the route connects both.
- **Receipts and invoices (B7):** consumers get our own numbered receipt (`R<year>-000001`, credit notes `C…`; NOT a Peppol e-invoice); businesses (VAT number or business name) get an invoice request for the `InvoiceProvider` (Billit, a disabled stub until the account exists: documents wait as `awaiting-provider` in `/admin/orders`).
- **Discount codes** (`/admin/discounts`): percent or fixed, products, dates, maximum uses; checked on the server; a use is reserved atomically when the payment page opens and released when it expires or fails.
- **Dashboard (P5):** `/admin` computes everything from the orders each time (`logic/reports.ts`, no stored counters): an order counts on the day it was PAID, refunds count with their order, VAT after refunds is proportional, net excl. VAT = net − that VAT, tickets = persons on orders not fully refunded, new vs returning by email. Dates are Brussels days (`logic/report-dates.ts`: Intl only, DST-safe; presets, custom range ≤ 3 years, day/week/month buckets, Monday weeks, empty buckets kept). Charts are server-rendered SVG/HTML (`admin/charts.tsx`): one series each, colour `#b8862b` validated on the dark admin surface, ≤ 24 px bars with a 4 px rounded end and 2 px gaps, tooltips via `<title>`, a table view. The date filter is a GET form. `/api/admin/reports/orders` exports the range as CSV (admins only, audited, formulas neutralised, UTF-8 BOM). `/admin/documents` lists receipts/invoices (filter: waiting for Billit), `/admin/groups` the Hidden Pubs games from tickets. Not measured yet (shown as such): completed walks (B9), ratings (P8), conversion (no analytics), partners (P7). Reads at most `MAX_REPORT_ORDERS` (50,000) orders; beyond that the page says so and it should become a MongoDB aggregation.
- **Corporate quotes (P4):** `/corporate` (texts in `corporate.json` × 8, formal address) lists the offers, an indicative price table per group size (`com_settings` "corporate-pricing", editable in `/admin/quotes`; defaults = the brief's table, `logic/quotes.ts`) and the quote form (`QuoteForm`). `POST /api/quotes` → `submitQuote`: rate limit per hashed IP, field checks (`parseQuoteInput`), bots (hidden `website` field filled in, or sent in < 3 s) get the same `{ received: true }` but nothing is saved, the same company+email+date+activity within 24 h is kept once (`dedupeKey`). Saved in `com_quote_requests` (TTL 2 years) as `NEW`; the company gets a confirmation in the form's language, every `ADMIN_EMAILS` address a notice with the admin link. `/admin/quotes/[id]`: forward-only status steps (`NEXT` in `logic/quotes.ts`: NEW → CONTACTED → QUOTED → ACCEPTED → COMPLETED, or DECLINED/CANCELLED), internal notes, history, audit; a status change is atomic (another admin's change at the same moment is refused).
- **Audit log** (`com_audit_log`): sign-ins, sign-outs and every catalogue change with old → new; never secrets or customer data.
- **Email (B6):** `Mailer` = Brevo (HTTPS API with `fetch`, no SDK) or memory (dev prints emails in the terminal; tests read `sent`). Outbox `com_email_outbox`: idempotent id (same id = one email), atomic claim before sending, retries with growing pauses, the text is removed once sent or given up.
- Stores like Hidden Pubs: `CommerceStore` = memory (dev/tests, `COMMERCE_MEMORY_STORES=true` for the Playwright build only) | MongoDB (`com_*` collections in `db/mongo-schema.mjs`, string `_id`s, keys checked against NoSQL injection, fixed error message). `context.ts` picks them; contract tests in `commerce-store.test.ts` run against both (`npm run test:db`).
- The admin area is **English only** (owner tool, like the playtest tools): folders named `admin/` are skipped by `no-hardcoded-text.test.ts`; the admin layout sets `lang="en"` and `noindex`. Buyer screens and emails are in all 8 languages (`commerce.json`).

## Hidden Pubs (`src/features/pub-game/`, `src/app/games/`, `src/app/api/games/`)

- Flow: the detail page's start button → `/walks/hidden-pubs/play` → redirect to `/games/new` (organiser creates a game, becomes host) → `/games/<CODE>` lobby (share link/QR, teams) → per café: Beery's announcement + navigation (shared `NavigationScreen`) → drink choice (stays on the phone) → Drunken Bastard card round → pubtask (multiple choice, 100/80/60/0) → bonus task (photo/video, host approves in `/games/<CODE>/host`) → fun fact → next café; leaderboard any time; results when the host ends the game.
- **Pure rules** in `logic/`: `applyPubGameAction(definition, answerKey, state, actorId, action)` → `{ ok, state, events }` or `{ ok: false, error }`. Tested without a server or browser.
- **Server** (`server/game-service.ts`): loads the game, applies the action, saves with an optimistic version check (retries on a conflict). Actions carry an `actionId`, so a retried request is applied once. Stores behind interfaces: `GameStore` (memory | MongoDB: `mongo-store.ts`, one transaction per action, unique (game, actionId), TTL index deletes games after 7 days; one `MongoClient` per server instance from `mongo.ts`, kept on `globalThis`) and `MediaStore` (memory | private Vercel Blob, client uploads with tokens from `handleUpload`). `context.ts` picks memory in development, the real stores in production.
- **Phones poll** `/api/games/<CODE>/state?since=<version>` every 2 s while visible (`client/usePubGame.ts`); versioned events give each phone its popups once.
- Joining: a cookie per game; after the first card nobody can join freely, the host's personal link (`/games/<CODE>/claim#token`) lets a late player in or moves a player to a new phone. Games expire after `GAME_LIFETIME_DAYS`.
- **Seat limit (P3):** a game made with a ticket has `StoredGame.seatLimit` (stored next to the state, NOT in it: the rules in `apply-action.ts` are unchanged). `JOIN` and the host's `ADD_PLAYER` are refused with `game-full` when every place is taken, checked inside `commitWithRetry` against the state being saved (`makeAction` may return `{ refused }`), so two phones can't take the last place. A phone already in the game always gets back in. The lobby shows "x of y places", the join page "game full"; the lobby also has a WhatsApp share link (`wa.me`) next to the share sheet, copy and QR. Games without a ticket (sales closed) have no limit.

## GPS, map & navigation (`src/features/navigation/`)

- Walking routes are **pre-generated** per leg (and a bypass leg around each optional stop) by `scripts/generate-walking-routes.mjs` using the free OSRM foot router at routing.openstreetmap.de, stored in `routes.json`. No routing API at runtime. Rerun after changing `coordinates.json`. Coordinates have `status` (`verified` / `to-verify`); unknown = `null`. **All 61 are currently `to-verify`** (geocoded, not checked on site; see `FIELD_TEST_CHECKLIST.md`).
- Map: **MapLibre GL 6 + OpenFreeMap tiles** (no key; `NEXT_PUBLIC_MAP_STYLE_URL` overrides). MapLibre's worker must be served from `/maplibre/<version>/` (copied by `scripts/copy-maplibre-worker.mjs`, URL from `mapWorkerUrl(getVersion())`, set via `setWorkerUrl`); without it the map stays blank. Don't remove this. The versioned path gets a one-year immutable cache in `next.config.ts`. After 3 failed tiles in a row the map shows a notice (`logic/map-health.ts`).
- Live position via `navigator.geolocation.watchPosition` (`useGeolocation`), screen wake lock while navigating (at most one lock). Thresholds in `config.ts` (arrival 40 m + accuracy ≤ 40 m + 2 confirmations; off-route 30 m ×3; far-from-route 150 m ×2 → "head to" guidance with a compass direction and an arrow). Map fits user + destination; north-up above 1 km.
- Noisy GPS is filtered in the pure `logic/tracking.ts` (tested): exact repeated readings are ignored; readings worse than 150 m are not used for position (only "GPS weak"); an implausible jump (> 10 m/s) is held back until a second reading confirms it, unless a precise reading replaces an imprecise position. A browser TIMEOUT is status `"searching"` (the watch keeps trying). The camera only moves for ≥ 4 m / ≥ 10° / a mode change (`logic/camera.ts`), stops following on any user pan/zoom/rotate, and doesn't animate with reduced motion. An accuracy circle shows how sure the dot is.
- Permission explainer is skipped if already granted; if denied, the map and "I'm here"/"continue without GPS" still work.
- **Location privacy:** GPS positions live in memory only while a navigation screen is open. Never store them (not in localStorage, not on a server) and never build a location history.

## Images

- `next/image` serves AVIF (WebP fallback) at quality 75 with a reduced set of widths (`images` in `next.config.ts`). The original files are never re-encoded.
- **Classics:** only reusable licenses from Wikimedia Commons (public domain/CC0 for historical images; CC BY/BY-SA with attribution for modern photos). List them in `image-sources.json`, run `download-commons-images.mjs <walk>`, which refuses other licenses and writes files (`public/images/<folder>/`) plus `images.json` (size, author, source, license). Check each downloaded image visually (e.g. postcard backs). Captions/alt text are per language in `content`. The UI always shows caption + credit + license (`GuideImageFigure`).
- **Poortjes** reuses Classics photos by id and shows Smekens' drawings `public/images/poortjes/gate-01…52.jpg` (file number = plate number). **Rights of the 1951 drawings are not yet cleared** (`license: "Rights still to be verified"` + TODO in `poortjes-van-antwerpen/index.ts`). Clear them before a public launch.

## Languages (i18n): details in `I18N.md`

- 8 locales: **en** (default + fallback, master), nl, fr, es, it, de, ru, uk (`src/i18n/config.ts`). Custom lightweight layer on `Intl`, **no package**.
- Language choice: cookie `ha-locale` (1 year) → else browser `Accept-Language` (`nl-BE`→nl, unsupported→en). Also saved in localStorage `hidden-antwerp:locale`; `<LocaleSync>` restores it if the cookie is gone. **URLs never contain the locale.** Reading cookies makes all routes dynamic (intended). Switching = save + `router.refresh()`, which keeps client state (game, GPS).
- Server: `const t = await getTranslator()` (`src/i18n/server.ts`, cached per request). Client: `const t = useT()` (`src/i18n/client.tsx`). The browser only gets English (bundled, the fallback) and the visitor's own language (passed by the root layout to `<LocaleProvider messages>`): Client Components never import `createTranslator`/`messages.ts` (that is all 8 languages; `i18n-client.test.tsx` checks it). `t("key", { value })`, `t.plural("key", n)` (Intl.PluralRules; ru/uk have one/few/many). Keys are typed from the English JSON. Missing → English + dev console warning, never `undefined`.
- UI texts: `src/i18n/locales/<lang>/{common,navigation,meta,home,errors,walks,game,guide,gps,pubgame}.json`, semantic keys only (`pubgame.json` = everything in Hidden Pubs). Formatting helpers in `format-walk.ts` (`formatDate`, `formatPrice` with `${locale}-BE`, `formatDistance`, `formatDuration`, `formatLanguages`).
- Walk content: `LocalizedContent<T> = { en: T; nl?: …}`; `pickContent` deep-merges a translation over English (arrays replaced whole). `walk.languages` = languages that have content. **All 3 walks + upcoming walks are fully translated in all 8 languages.**
- Checks: `npm run i18n:check` (UI), `src/__tests__/i18n-walk-content.test.ts` (each translation must have exactly the English structure; technical values unchanged), `walk-data.test.ts` runs every walk in every language.
- Translation rules: **street names/addresses never translated** (Latin script also in ru/uk); Antwerp names stay (Grote Markt, Brabo, Onze-Lieve-Vrouwekathedraal, Rubenshuis, Vlaeykensgang, Het Steen, house names), optionally explained in parentheses; exonyms OK for city/river (Anvers, Шельда). Never change facts while translating; research markers are translated, not removed.
- Hidden Pubs: question texts, options, task instructions and fun facts per language in `game/content/<lang>.ts`; explanations in `game/reveals/<lang>.ts` (server only). Questions are multiple choice, so answers are option ids in `answers.server.ts` and need no translation. Café names and "Beery" stay untranslated.
- Smekens' drawing captions stay in the original Dutch (quoted source); titles of Dutch sources in source lists stay Dutch.

## Key types (`src/types/`)

`Walk` (+ `WalkSummary`, `UpcomingWalk`, `WalkCopy`, `WalkNarrative`, `experience` guide|pub-game, `theme`, `routeReveal`, `contentStatus`), `WalkLocation` (coordinates|null, `guide?: GuideStopContent`, `isBonus`), `Source` (`content.ts`), `VerificationStatus` (`reveal.ts`), guide types (`GuideSection` kind history/interpretation/context/legend, `GuideImage`, `CollectionItem`, `HeritageStatus`, `SearchTask`, `InfoBox` with `checkedOn`, `WalkChapter`), navigation (`RouteLeg`, `WalkingRoute`, `Maneuver`, `GpsFix`), session (`WalkSession`, `LocationProgress`, `SessionAction`), pub game (`pub-game.ts`: `PubGameState`, `PubGameAction`, player views…), commerce (`commerce.ts`: `CommerceUser`, `Product`, `ProductPrice`, `CatalogEntry`, `AuditEntry`, `OutboxEmail`, `TaxSettings`, `OrderTaxBasis`, `AppliedTax`, `Order`, `TicketGrant`, `Discount`, `BillingDocument`).

## Environment & external services

Hidden Pubs and the admin area need secrets (server only, never `NEXT_PUBLIC_`). Commerce: `ADMIN_EMAILS`, `APP_BASE_URL` (required in production), `BREVO_API_KEY` + `EMAIL_FROM` (required in production; dev prints emails in the terminal), `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` (test keys; live refused while sales are closed), `TICKET_SIGNING_SECRET` (≥ 32 characters, required in production), `COMMERCE_SALES_ENABLED=true` (opens ticket sales: only after the VAT treatment is confirmed), `COMMERCE_MEMORY_STORES=true` (**tests only**, like `PUB_GAME_MEMORY_STORES`). The daily cron `/api/cron/email-outbox` (vercel.json, `CRON_SECRET`) retries waiting emails. Hidden Pubs: `.env.example` (committed, no values) documents every variable: `MONGODB_URI` (MongoDB Atlas, must name the database, which is `HiddenAntwerpGeneral` (case-sensitive); required in production, development keeps games in memory; Atlas Network Access must allow the server), `BLOB_READ_WRITE_TOKEN` (Vercel Blob, private files; required in production, development keeps uploads in memory), `TEST_MONGODB_URI` (optional, a separate database `HiddenAntwerpGeneral_test` for `npm run test:db`), `CRON_SECRET` (Vercel Production: authorises the daily Vercel Cron call to `/api/cron/media-cleanup` from `vercel.json`, which deletes evidence photos/videos older than 7 days (D29); without it the route refuses and only the hourly safety net after creating a game cleans up), `PUB_GAME_MEMORY_STORES=true` (**tests only**: lets the production build used by Playwright keep games in memory; set in `playwright.config.ts`, never on Vercel), `NEXT_PUBLIC_MAP_STYLE_URL` (optional tile style), `NEXT_PUBLIC_PLAYTEST_TOOLS=true` (playtest tools in production; the build prints a warning) and `DEV_ALLOWED_ORIGINS` (dev only: your computer's exact LAN IP, e.g. `192.168.1.23`, **needed to open the dev server from a phone**; no wildcards).
Security headers for every response come from `src/lib/security-headers.ts` via `next.config.ts` (nosniff, Referrer-Policy, Permissions-Policy `geolocation=(self)`, `X-Frame-Options: DENY`, no `X-Powered-By`). The Content Security Policy is **Report-Only**: check the browser console on real phones with a production build, then switch the key to `Content-Security-Policy`. A custom map style on other hosts needs those hosts added to the CSP. `.env*` except `.env.example` is git-ignored. External services: OpenFreeMap tiles (runtime, keyless), MongoDB Atlas + Vercel Blob (runtime, Hidden Pubs only), OSRM at routing.openstreetmap.de and the Wikimedia Commons API (only from the scripts), Google Fonts (build time). Git remote: `github.com/ToonPanis/project_tours`, branch `main`.

## Status

**Works:** home, walk list, detail pages (stats, practical info, collection, story teaser, how-it-works), both guide walks and the Hidden Pubs multiplayer game playable end to end (the MongoDB store passes its tests against the Atlas test database, `npm run test:db`, 2026-10-15; not yet played on Vercel with the real Blob store), save/continue/restart, GPS navigation with map, arrival detection, off-route handling, simulated GPS, full 8-language UI + content, language selector with persistence, translated metadata/OG, tests + build green.

**In progress / open:**
- Content is `contentStatus: "placeholder"`: many stops are `partially-verified`/`research-required`; not reviewed by a historian; Poortjes gates need on-site checks (`[To be verified on site]` markers).
- Hidden Pubs: open points are listed in `HIDDEN_PUBS_DATA_AUDIT.md`: a real game on Vercel with MongoDB and the Blob store (incl. `CRON_SECRET` for the daily photo cleanup), field test of all 12 cafés (coordinates `to-verify`), the owner's approval of the proposed Rococo and De Kat answer options, the savings-box photo, price/duration/team size (D32), fun facts marked research-required, drink spellings `to-verify`.
- Smekens drawing rights, see Images.
- Translations were made by AI and are not reviewed by native speakers (ru/uk name transliterations and some glossary terms were flagged as worth checking). Italian UI uses "tu" in a few labels, content addresses the group with "voi".
- Not built yet: customer accounts (none planned: tickets are links), analytics. (Hidden Pubs checks answers on the server; answers never ship to the browser.)
- Commercial platform: P1–P4 merged (PRs #7–#10; `/corporate` is live); P5 (admin dashboard, reports, CSV export, invoices and groups lists) on branch `commercial/p5-dashboard` (`docs/commercial/PHASE_5_REPORT.md`). Test mode only, sales closed until the VAT treatment is confirmed (B8). Still to set up by the owner: Brevo, Stripe test account + webhook, `ADMIN_EMAILS`, `APP_BASE_URL`, `TICKET_SIGNING_SECRET` on Vercel; the Billit integration (B7) once the account exists.

**Known quirks:** flag emoji show as letters ("GB", "NL") on Windows (fine on phones). In `npm run dev`, the nested `/api/games/[code]/…` routes sometimes return 404 right after a cold Turbopack compile; restarting the dev server fixes it (the production build is fine). Local branches `backup/pre-i18n` (snapshot before i18n) and `feature/i18n-8-languages` (already merged into `main`) still exist.

## Decisions to keep (don't undo)

- Custom i18n without a package; locale in cookie, not in the URL; English is master/fallback; semantic keys; walk text separated from technical data.
- Pre-generated routes (no runtime routing API), MapLibre + OpenFreeMap, self-served MapLibre worker.
- No GPS storage, ever.
- History vs fiction vs legend always labelled; in Hidden Pubs explanations and fun facts come *after* the question is answered; research markers stay visible.
- Alcohol rules below. They are enforced by the `pub-game-*` tests (no shots on a menu, "any drink counts" wording, in every language).
- "Hidden Pubs" title, café/brand names and "Beery" untranslated.
- Hidden Pubs follows `HIDDEN_PUBS_CONCEPT.txt` (the owner's game: don't redesign it) + the decisions in `HIDDEN_PUBS_DATA_AUDIT.md`. The server decides everything random that counts (routes, card offers), all times and ids (only the Billie's beer wheel spins on the phone: a personal drink choice, never recorded); answers and explanations live only in `answers.server.ts` / `reveals/*` and only `src/features/pub-game/server/` may import them (a test checks this). Players get a per-player view (`toPlayerView`): never other teams' routes, never answers before they're earned. A player is identified by an httpOnly cookie `hp_<CODE>`; only its SHA-256 hash is stored.
- Vanished gates are never waypoints; optional stops get bypass legs.
- Every walk must pass `validateWalk` (`src/lib/validate-walk.ts`, run in `walk-data.test.ts` for every walk × language): add new structural rules there, not per walk.

## Code guidelines

1. TypeScript everywhere; no `any` unless truly necessary (use proper types, `unknown` + narrowing, generics).
2. Simple, readable solutions over clever abstractions.
3. App Router and modern Next.js practice. **Read `node_modules/next/dist/docs/` before using a Next.js API**: this version differs from older knowledge (e.g. middleware is now "proxy"; `cookies()`/`headers()` are async; use `unstable_rethrow` when catching around them).
4. Server Components by default; `"use client"` only for state, effects, handlers or browser APIs.
5. Small reusable components. UI in `src/components/` or `src/features/*/components/`, data in `src/data/` / `src/lib/`, shared types in `src/types/`, business logic in plain TS functions (not in components).
6. Clear names, minimal dependencies, never hardcode secrets (`.env.local`; only `NEXT_PUBLIC_*` reaches the browser).
7. Mobile-first (base styles, then `sm:`/`md:`/`lg:`); check 390 px width, long German words and Cyrillic.
8. Accessibility: semantic HTML, alt text, labels, keyboard access, contrast, `lang` attributes for foreign-language text. A screen that replaces another in place focuses its `h1` via `useScreenFocus(stableId)`. Live feedback goes in a status element that is always mounted (e.g. each pubtask question's status in `PubtaskStep`), never in one that appears with its text. Dialogs that delete progress use `ConfirmDialog isDestructive`. Untranslated Dutch source titles get `language: "nl"` on the `Source`.
9. New user-facing text → a key in **all 8** `locales/<lang>/*.json` (never hardcoded strings), then `npm run i18n:check`. `t` is always a required parameter (no English default); `no-hardcoded-text.test.ts` fails on text typed into JSX (except in `playtest/` and `admin/` folders: English-only owner tools). Walk-specific names for shared UI go in the walk's `copy` (e.g. `routeButtonLabel`). Shared metadata (Open Graph base, robots) comes from `src/lib/shared-metadata.ts`, because Next.js merges metadata shallowly.

## Content rules

- **Never invent historical facts.** Real history has a verification status: `"verified"` (needs sources), `"partially-verified"` or `"research-required"`. Unresearched text carries a visible `[Historical research required]` marker.
- **Always separate history from fiction.** Guide sections have a `kind` (history / interpretation / context / legend / fiction); Hidden Pubs fun facts a `kind` (history / legend / cafe-story) and a `status`. The UI labels each by kind and status.
- **In Hidden Pubs, history comes after the question:** explanations and fun facts are server-only (`reveals/`) and only sent once the question or pubtask is finished.
- **Never invent** drink menus, prices, opening hours, coordinates, sources or physical objects for riddles. Use visible placeholders (`[RESEARCH REQUIRED]`, `coordinates: null`, coordinates with `status: "to-verify"`), and mark a Hidden Pubs question `pending` until the owner gives its answer (it is left out of the playable game). Practical info (opening hours, prices) always gets a `checkedOn` date and source.
- **Alcohol and cafés:** progress never depends on ordering or drinking; every drink choice has an alcohol-free option and can be skipped, and everyone chooses their own drink; **no shots on any menu**; never count, store, show or celebrate the number of drinks (no drink stats, not in scores or results); alcohol-free players get exactly the same experience and can earn every point.
  - Hidden Pubs (the owner's party game, decision D2): the Drunken Bastard cards say "drink" = **one sip of your own drink, alcohol-free counts** (at most 2 sips from one instruction); the app only shows who sips and records nothing. Bonus tasks that involve drinking (Barok, Boer van Tienen, Den Engel's clog) say **any drink counts** (D3), so water earns the same points. The winner's tradition is "not an obligation" (D28). The game is for 18+ (detail page).
- **Questions and tasks** depend on the physical location (observation, inscriptions, symbols, counting), not on googleable trivia.

## How to work with me

- **Before installing any npm package**, explain why and whether a built-in alternative exists. Wait for my OK.
- **Before any major architectural change**, explain the plan and why. Wait for my OK.
- Don't rewrite large parts of working code without a good reason; preserve existing functionality.
- On errors, find the root cause; no random fixes.
- **After implementing**, run `npm run typecheck`, `npm run lint`, the relevant tests (and `npm run i18n:check` when texts changed), then report the results.
- Always list the files you created or modified.
- When implementing an important feature, briefly explain **what** changed, **where**, **how** the important parts work (especially Next.js concepts) and **how to test** it (manually and automated). Don't over-explain basic syntax.
