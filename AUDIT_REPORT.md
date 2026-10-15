# Hidden Antwerp: technical audit (performance, reliability, security, maintainability)

*Audit date: 2026-10-15. Commit `532e068`, branch `optimization/audit` (made from `feature/mongodb`, which is not merged into `main` yet). No application code was changed for this audit. The older `AUDIT.md` (2026-09-29) dates from before Hidden Pubs 2.0 and MongoDB; this report replaces it for the current code.*

Related documents: [`PERFORMANCE_BASELINE.md`](PERFORMANCE_BASELINE.md) (measurements) and [`OPTIMIZATION_PLAN.md`](OPTIMIZATION_PLAN.md) (what to do, in which order).

## How the audit was done

- I read the whole repository area by area: Hidden Pubs server and MongoDB, the Hidden Pubs client, GPS/map/navigation, pages/guide/i18n/data, and dependencies/security/tests/CI. File and line references are given for each finding.
- I measured a production build locally, with games in memory and no real database. See `PERFORMANCE_BASELINE.md`.
- Baseline checks on the unchanged code:

| Check | Result |
|---|---|
| `npm run typecheck` | ✅ passed |
| `npm run lint` | ✅ passed (took several minutes, see X3) |
| `npm run i18n:check` | ✅ all 8 languages complete (525 texts) |
| `npm run test:coverage` | ✅ 54 files, **985 tests** passed, thresholds met. CLAUDE.md says "~1,450", which is out of date. |
| `npm run build` | ✅ |
| `npm run test:e2e` | ✅ 28 browser tests passed (5.7 min) |
| `npm run test:db` (real MongoDB, test database) | ⏸ not run: it needs your OK because it connects to Atlas |
| `npm audit --omit=dev` | ❌ **3 high** (next, sharp, source-map-js), see S1 |

**Scope notes.** There are no payments, bookings, partner integrations or accounts in the code, so those parts of the brief don't apply. "Drink voting" and "registering the winning drink" are not part of the current Hidden Pubs. In the current game each player picks their own drink on their own phone, and nothing about it is recorded (D2, alcohol rules). I left this as it is.

## Overall verdict

The architecture is clean and mostly well built.
- The game rules are pure, tested functions.
- Saves are optimistic, with per-tap idempotency.
- Answers never leave the server.
- MapLibre is loaded lazily.
- GPS updates go straight to the map without re-mounting it.
- I found no memory leaks.

**I found nothing that would justify a large refactor.** The gains come from a few targeted fixes:

1. **First-load JavaScript.** Every page ships the interface texts of all 8 languages: 67 KB gzip of the 215 KB.
2. **Polling cost.** Each 2-second poll reads the whole game document from MongoDB, even when nothing changed.
3. **Poor-network robustness in Hidden Pubs.** Requests have no timeout, uploads can be silently lost, and some failures are never retried.
4. **Security and privacy housekeeping before launch.** The Next.js patch, the media retention sweep and the privacy notice.

Severity scale: **Critical** (data loss, security hole, unusable), **High** (big efficiency or reliability gain), **Medium** (noticeable, maintainability), **Low** (cleanup).
Regression risk: how likely the fix breaks something that works now.

---

## 1. Performance: front end

### P1. Every page downloads the UI texts of all 8 languages. **High**
- **Where:** `src/i18n/messages.ts:2-21` imports every locale. `translate.ts` uses it, `client.tsx:5` uses `translate.ts`, and `LanguageSelector` (in the root layout) and `LocaleSync` use `client.tsx`. The result is the chunk `3cw3b3vc8y5y6.js`: **227 KB raw / 67 KB gzip** on `/`, `/walks`, the detail pages, play and games.
- **Why it matters:** 31 % of the JavaScript on every first load. One language plus the English fallback is about 7–10 KB gzip. On a 4× slower CPU, parsing it adds to the ~850 ms of blocking time measured on every page.
- **Fix (keeps the custom i18n, no package):**
  - The root layout gives `<LocaleProvider>` only the current language's messages, already merged with English (the server has them anyway).
  - `useT()` builds the translator from that prop.
  - Switching language already does `router.refresh()`, so the server sends the new language's messages with it.
  - The server side (`getTranslator`) stays the same.
  - `global-error.tsx`, which has no provider, keeps the full import. That is acceptable, because it only loads on a crash.
- **Impact:** about −55 to −60 KB gzip of JS on every page. Expect less blocking time and faster LCP/INP on mid-range phones.
- **Risk:** medium. Many tests call `createTranslator(locale)`, so the one-argument form has to keep working. The language-switch e2e test covers the refresh. This revisits the decision in the `client.tsx` comment ("all texts are bundled, so switching needs no extra download"), which is why it needs your OK.

### P2. ~850 ms Total Blocking Time on every page (lab, 4× CPU). **High**
- **Where:** measured, see `PERFORMANCE_BASELINE.md` §2. The JS is React DOM (73 KB gz) + Next runtime (44 KB) + P1 (67 KB) + layout. `/games/new` reaches **1.78 s**, for a reason not yet identified.
- **Fix:** P1 removes the biggest app-owned part. For `/games/new`, profile the create form in a production build before changing anything. I did not guess a cause.
- **Impact:** most of the gap to "Lighthouse ≥ 90" sits here. React and Next themselves can't be removed.
- **Risk:** depends on what the profile shows.

### P3. No `loading.tsx` anywhere: taps on links show nothing until the server answers. **Medium**
- **Where:** `src/app/**` has no `loading.tsx`. All routes are dynamic (they read the cookie; that is intended). The Next 16 docs (`link.md`) say a dynamic route is prefetched only down to the nearest `loading` boundary, so `<Link>` prefetch gives nothing.
- **Fix:** add a small skeleton `loading.tsx` for `walks/[slug]/play` (64 KB gzip payload for Poortjes) and `walks/[slug]`. No new UI design, only a background and the existing spinner/text.
- **Impact:** an instant visual response to "Start". The page shell can be prefetched.
- **Risk:** low to medium. Once streaming has started, `notFound()` and `redirect()` answer with HTTP 200 and a client-side redirect. Check the `hidden-pubs/play` → `/games/new` redirect and the 404 e2e tests.

### P4. First walk card cover on `/walks` is lazy-loaded. It is the likely LCP element. **Medium**
- **Where:** `src/app/walks/page.tsx` / `features/walks/components/WalkCard.tsx`. `/walks` has an LCP of 2.89 s.
- **Fix:** `preload` on the first card. `WalkCover` already supports it.
- **Impact:** LCP on `/walks` probably drops below 2.5 s. **Risk:** none.

### P5. Play pages serialise data that is never used. **Low**
- **Where:**
  - `NavigationStep.instruction` (English labels, 204 steps; `src/lib/routing/osrm.ts:58`, `maneuver-labels.ts`). The UI translates `maneuver` instead (`DirectionPanel.tsx:67`).
  - `unlockCondition` and `nearbyPlaces: []` on every stop (`types/location.ts:78-81` says "not used").
- **Fix:** remove these fields and `maneuver-labels.ts`, then update the osrm tests.
- **Impact:** ~7 KB raw less on each play page. **Risk:** low.

### P6. Optimised images are cached for only 4 hours. **Low**
- **Where:** `next.config.ts` has no `images.minimumCacheTTL`, so Next's default `max-age=14400` applies.
- **Fix:** 30 days. Images never change under the same name: the downloader writes new files.
- **Impact:** fewer re-optimisations on Vercel (quota), and faster repeat visits.
- **Risk:** a replaced file with the same name stays stale for a while.

### P7. Small per-render costs. **Low**
- `translate.ts:71` creates a new `Intl.NumberFormat` on every `t()` call that has values. This happens on every GPS fix render. Fix: create it once per translator.
- `getLocale()` is not wrapped in React `cache()`. It runs about 5× per request.
- `getNavigationView` is not memoised. Route projection runs twice per fix, and `getRouteLength` is recomputed every time. All of this is O(route points) and cheap. Only worth doing next to other work.
- **Risk:** none.

## 2. Performance and reliability: Hidden Pubs server and MongoDB

### B1. Every poll reads the whole game document, even when nothing changed. **High**
- **Where:**
  - `src/features/pub-game/server/game-service.ts:244-249`: `loadGame` (a full `findOne`, no projection), then `findPlayer` (a second round trip), and only *then* the check `since === game.version`.
  - When something changed, a third query follows (`eventsSince`), then `toPlayerView` and `computeScores`.
- **Why:** every phone polls every 2 s. 16 phones make 8 polls/s, which is 16–24 Atlas operations/s and about 120 KB/s from Atlas. The version is shared by the whole game, so any team's action turns everyone's next poll into a full one. A request without a cookie also costs a full document read.
- **Fix (no change to the game):**
  1. Add `getVersion(code)` to `GameStore`: a `findOne` with the projection `{version:1}` (memory store: trivial). Load the full state only when the version differs.
  2. Look up the player in parallel with the version (`Promise.all`).
  3. Refuse a missing token before any database call.
- **Impact:** unchanged polls go from "full document + player" to "a few bytes + player" in parallel, so roughly half the latency and ≈ 95 % fewer bytes. The data stays the same.
- **Risk:** low. `pub-game-store.test.ts` runs the same tests against both stores; add a test for `getVersion`.

### B2. Photos and videos are only deleted when someone creates a new game. **High (privacy, D29)**
- **Where:** `game-service.ts:113` → `media-store.ts:312-323` (`deleteOlderThan`). This is the only caller.
- **Why:** MongoDB deletes games after 7 days (TTL), but Blob has no TTL. If nobody creates a game, evidence photos (which can show faces) stay forever. And each creation waits for a full Blob `list()` before inserting the game, which adds latency and billed operations.
- **Fix:** a daily Vercel Cron route protected by `CRON_SECRET` that runs the existing `deleteOlderThan`. Remove the call from `createGame`, or at least stop waiting for it.
- **Impact:** keeps the 7-day promise and makes "create game" faster.
- **Risk:** low. It adds a `vercel.json` cron entry and a secret, so this is a deployment change that needs your OK.

### B3. An action whose answer was lost is not retried with the same id. **Medium**
- **Where:** `client/usePubGame.ts:101-107` only retries on status 0 (network error).
- **Why:** if the commit succeeded but the answer failed (a 500 from the reload after the commit, or a 503 "busy"), the player taps again. That creates a *new* `actionId`, which can apply the action twice. For REPORT_DRINK that means a duplicate sip popup; most other actions fail harmlessly with `wrong-step`.
- **Fix:** also retry once, with the same id, on 500/503. This is safe because of the existing idempotency.
- **Risk:** very low.

### B4. Commit retries without backoff, and up to ~11 round trips per action. **Medium**
- **Where:**
  - `game-service.ts:59` (5 attempts back to back) and `495-520`.
  - `performAction` reloads the game after the commit (`:301`).
  - The transaction does `findOne` + `updateOne` where a single conditional `updateOne` would do.
  - `savePlayerToken` reads the game again just for `expiresAt` (`mongo-store.ts:263`).
- **Fix:**
  - A small random delay between attempts.
  - `commitWithRetry` returns the new state, so the reload goes away.
  - A conditional `updateOne({_id, version})` and a check of `matchedCount`.
  - Pass `expiresAt` in.
- **Impact:** about 2–3 fewer round trips per tap (each ~10–50 ms Vercel↔Atlas), so actions feel faster, and fewer "busy" answers during bursts.
- **Risk:** low to medium. This touches the commit path, so it needs the store tests **and** `npm run test:db` against the test database.

### B5. The MongoDB pool has no queue timeout. **Medium**
- **Where:** `server/mongo.ts:13-15`, `maxPoolSize: 5` and no `waitQueueTimeoutMS`.
- **Why:** the comment assumes one request per function instance. Vercel Fluid compute (the default for new projects) serves many requests per instance, so a burst of polls can queue without limit.
- **Fix:** `waitQueueTimeoutMS: 5000` (the error then becomes the existing "store unavailable" 503). Consider `maxPoolSize: 10`. No new package. `@vercel/functions`' `attachDatabasePool` would be one, so I'm not proposing it.
- **Risk:** low.

### B6. Events can come out of order or be stale after a long absence. **Low**
- **Where:** `game-service.ts:252` and `mongo-store.ts:251`.
  - `eventsSince` has no upper bound (it can include events newer than the view it is sent with).
  - It takes the *oldest* 100 events of the whole game and only then filters them per player.
- **Fix:** `$lte: game.version`. When the gap is bigger than the limit, send no old popups, as the comment at `:56` intends.
- **Risk:** low.

### B7. Upload tokens are only loosely limited. **Medium (cost and abuse)**
- **Where:** `game-service.ts:369-383` and `414-439`.
  - Any player can request unlimited 10-minute tokens for 75 MB uploads, for any task in the definition, at any step.
  - The pathname is checked with `startsWith` only.
- **Fix:** check the same conditions as SUBMIT_EVIDENCE (a dry run of `applyPubGameAction`), and check the pathname with the `isMediaIdOfGame` pattern.
- **Risk:** low to medium. Resending a rejected task (D26) must keep working; the dry run handles that.

### B8. Smaller backend points. **Low**
- `media/route.ts:22` (dev direct upload) reads the whole body before production refuses it: return early.
- `media/upload/route.ts:35-38` turns store outages into `400 invalid-request`: answer 500/503.
- `savePlayerToken` silently does nothing for an expired game, yet a link is returned.
- `loadGamePage` reads the game twice (`page-data.ts:13-22`).
- `taskKind` duplicates `findTask`.
- **Risk:** none to low.

### B9. Video evidence may not play on iPhones. **Medium (to check on a phone)**
- **Where:** `api/games/[code]/media/file/route.ts:17-26` always answers 200 with the full file and ignores `Range`. Safari's `<video>` normally needs 206 range answers.
- **Fix:** support `Range`, but only after confirming the problem on a real iPhone.
- **Risk:** medium.

## 3. Reliability: Hidden Pubs client (mobile, weak networks)

### C1. No request timeout: a hung connection freezes polling and every button. **High**
- **Where:** `client/api.ts:13-29` (no `AbortSignal`) and `usePubGame.ts:65` (only one poll at a time, so a hanging poll blocks all updates).
- **Why:** in a cellar bar, or when the phone switches between Wi-Fi and 4G, a fetch can hang for 30–90 s. The banner says "online" the whole time, and `busy` keeps all buttons disabled, for twice that time because of the retry.
- **Fix:** `signal: AbortSignal.timeout(8000)` in `request()`. The existing `catch` already turns that into "offline" plus the retry with the same `actionId`.
- **Impact:** recovery within seconds instead of minutes. **Risk:** low.

### C2. Uploads race with "Continue" / "No bonus": the photo is silently lost. **High**
- **Where:** `TaskCard.tsx:95-109` (the upload state is local), and `BonusStep.tsx:39` (the skip button is only `disabled={busy}`).
- **Why:** tapping "No bonus" or "Continue" while a video is uploading moves the team on. `SUBMIT_EVIDENCE` is then refused (`wrong-step`) into an unmounted component, and the file is orphaned in Blob.
- **Fix:** `TaskCard` reports "sending" to its parent, and the step's continue/skip buttons stay disabled until the upload ends. This changes no rules or design, just a disabled state.
- **Risk:** low.

### C3. A failed explanation or fun-fact fetch is never retried. **Medium**
- **Where:** `useCafeReveal.ts:16-25`. `FunFactStep.tsx:59-62` then shows "loading…" forever.
- **Fix:** retry after a few seconds, or when the connection comes back. **Risk:** low.

### C4. A failed ARRIVE after GPS arrival isn't shown or retried. **Medium**
- **Where:** `NextCafeScreen.tsx:68` (`void act(...)`) and `NavigationScreen.tsx:99-107` (tracking stays latched at "arrived").
- **Fix:** keep the result and show the existing `FormError` (always mounted) above the map, so "I'm here" can retry.
- **Risk:** low.

### C5. The event popup remounts on every new event. **Medium**
- **Where:** `EventPopup.tsx:36` `key={`${index}-${events.length}`}`. Events that don't show a popup (card draws, answers) keep extending the queue, so an open popup flickers, loses focus and is announced again by screen readers, up to every 2 s.
- **Fix:** queue only events that show a popup (`isPopupEvent`), and give each a stable key (its version).
- **Impact:** this also fixes the slowly growing queue over a multi-hour game (C8). **Risk:** low.

### C6. Video upload can't be cancelled; a stalled upload blocks the task. **Medium**
- **Where:** `upload.ts:67-76` (no `abortSignal`) and `TaskCard.tsx:173` (Skip is hidden while sending).
- **Fix:** an `AbortController` aborted on unmount, plus a "Cancel" button. That needs 1 new text in all 8 languages, so it needs your OK because it is a visible UI addition.
- **Risk:** low to medium.

### C7. Photo shrinking decodes the full-resolution image. **Medium (suspected)**
- **Where:** `upload.ts:21` `createImageBitmap(file)`. A 48 MP iPhone photo is about 200 MB of pixels, which can crash the tab on older phones.
- **Fix:** use the `resizeWidth`/`resizeHeight` options where supported, and release the canvas afterwards.
- **Risk:** low. Test on a real phone.

### C8. Smaller client points. **Low**
- Polling keeps running after the game is gone (`usePubGame.ts:71`).
- `busy` is one shared boolean.
- `ClaimPlayerLink` drops the secret from the URL before the claim succeeded (a network failure shows "invalid link").
- Three live regions only appear together with their text (`ResultsScreen.tsx:78`, `CardStep.tsx:59,130`, `FunFactStep.tsx:61`), which goes against the project's own accessibility rule.
- `URL.createObjectURL` inside `useMemo` (`TaskCard.tsx:86`).
- The settings context value isn't memoised.
- **Risk:** none to low.

### C9. A rejected photo from an earlier café can't be resent from the UI. **Medium (game flow, needs the owner)**
The server allows it (D26), but `TaskCard` only shows for the current café. This is a gameplay question, so I won't change it without the owner's decision.

## 4. GPS, map and navigation

There are no high-severity issues here. The design is efficient:
- GPS positions go imperatively to MapLibre (`setLngLat`, `setData`).
- There is one React render per fix.
- The map is created once per leg and removed on unmount.
- MapLibre is code-split on both paths.
- The watch, the wake lock and all listeners are cleaned up.
- At most two fixes are kept in memory (privacy rule respected).

### G1. Hidden Pubs rebuilds the destination object on every poll. **Medium**
- **Where:** `CafeNavigation.tsx:27` calls `cafeDestination(...)` during render. That creates new `coordinates` each time, so `WalkingMap.tsx:262-271` removes and re-adds the destination marker on every changed poll. Without a GPS fix (manual mode, or still waiting) the camera also snaps back to the overview.
- **Fix:** `useMemo` on `[cafeId, cafeIndex]`. **Risk:** very low.

### G2. Losing GPS during a walk shows nothing. **Medium**
- **Where:** `NavigationScreen.tsx:169,291`. After a timeout the status becomes `"searching"`, but once a first fix exists nothing is shown. The dot freezes at its last position and the directions look normal.
- **Fix:** treat "searching while a fix exists" (or a fix older than ~20 s) as a GPS problem and show a short "position may be outdated" line. That is 1 new text in 8 languages.
- **Risk:** low.

### G3. Map loads only when the navigation screen opens. **Medium (perceived speed)**
- **Where:** `NavigationScreen.tsx:23` (`next/dynamic`). Opening the first map costs ≈ 278 KB gzip of JS plus a 147 KB gzip worker. On slow 4G that is about 2 s of download before the style and tiles. It happens at the moment the walker wants directions.
- **Fix:** while the stop page, the start screen or the Hidden Pubs fun fact is on screen, warm the cache in idle time: `import("…/WalkingMap")` and a `<link rel="prefetch">` of the worker. It downloads only on the play pages, never on the home page.
- **Impact:** the map's JS is already cached when "Navigate" is tapped.
- **Risk:** low. Costs some data for walkers who never open the map; most do.

### G4. Smaller map points. **Low**
- The user marker is not removed when the position becomes null (only possible after the playtest simulation).
- The accuracy circle is re-sent to the worker on every fix, even when nothing moved.
- The GPS watch keeps running while the page is hidden. Browsers normally pause it, so the battery impact is likely small.
- Optional: `pixelRatio: Math.min(devicePixelRatio, 2)` to reduce GPU and battery use on full-day walks. This is a visual trade-off, so check it on a phone first.

## 5. Security and privacy

### S1. Next.js 16.3.6 is in a vulnerable range. **High**
- **Where:** `package.json` pins `next 16.3.6`. `npm audit --omit=dev` reports 3 high: **next 16.0.0–16.3.7** (among them an SSRF in Image Optimization, and the app uses `next/image`), **sharp < 0.35.5** and **source-map-js** (build time).
- **Fix:** `next` and `eslint-config-next` to **16.3.8** (a patch release, verified on npm), then `npm audit fix` **without** `--force`. `--force` would downgrade eslint-config-next to 14.
- **Risk:** low (a patch release, covered by CI and e2e). It changes packages, so it needs your OK.

### S2. The privacy notice is wrong for the current app. **High (before any public launch)**
- **Where:** `PRIVACY_NOTICE_DRAFT.md` (2026-09-29) says there is "no server-side database". It doesn't mention MongoDB, Blob, player names, photos or the `hp_` cookie.
- **Fix:** rewrite the Hidden Pubs part. Cover:
  - which data is stored, and why;
  - the 7-day retention;
  - the processors (MongoDB Atlas, Vercel);
  - the `hp_` cookie as strictly necessary;
  - the organiser's `media:download`.
- **Risk:** none (documentation only).

### S3. No rate limiting. **Medium**
- **Where:** `src/app/api/**`. Creating games is unlimited, and each creation also triggers the Blob sweep (B2). Game codes (31⁶) and tokens (256-bit) make guessing impractical.
- **Fix:** a Vercel WAF rate-limit rule on `POST /api/games` (no code change), plus B2.
- **Risk:** low.

### S4. CSP is still Report-Only. **Medium (known, documented)**
Enforce it after the real-phone check described in CLAUDE.md, and update `security.test.ts` at the same time. I'm not changing it in this round.

### S5. Small security points. **Low**
- `.env.example` contains the real Atlas cluster hostname; use a placeholder.
- `npm audit` isn't run in CI.
- A personal link can be claimed by several phones (by design, D34).
- A submitted `mediaId` only has to be under the game prefix, not the team's.

**Done well (keep):**
- httpOnly/Secure/Lax player cookie, with only the SHA-256 hash stored.
- Same-origin and JSON-only POSTs, with a 10 kB body cap.
- Strict id regexes before every Mongo filter (NoSQL injection tested).
- Answers and reveals stay on the server only (enforced by a test).
- Per-player views.
- Private Blob files with access checks.
- Error logs without messages.
- No secrets in git history (checked with `git log -G`).

## 6. Tests and CI

| ID | Finding | Severity | Fix |
|---|---|---|---|
| T1 | The MongoDB store is never tested against a real MongoDB (CI has no `TEST_MONGODB_URI`; CLAUDE.md lists `test:db` as still to do) | **High** before launch | Run `npm run test:db` against `HiddenAntwerpGeneral_test` (with your OK) before and after the backend batch |
| T2 | `usePubGame` itself has no tests (timers, visibility, overlapping polls, retries) | Medium | Add tests with fake timers + stubbed `fetch`; they protect C1, C5, B3 |
| T3 | `pub-game/server/**` is outside the coverage gate | Medium | Add it to `coverage.include` (without `mongo*.ts`), and measure first |
| T4 | Evidence upload + host approve/reject is not tested in a browser | Medium | e2e with `setInputFiles` on the dev direct-upload path |

## 7. Maintainability, duplication, dead code

The codebase is already small for what it does. There is **little real duplication**: guide and pub-game navigation share one `NavigationScreen`. The honest list:

| ID | What | Where | Fix |
|---|---|---|---|
| D1 | "Share or copy link" copied 3× | `LobbyScreen.tsx:35-51`, `HostDashboard.tsx:68-83`, `ResultsScreen.tsx:37-56` | One `shareOrCopy()` helper |
| D2 | Current-café lookup repeated (~8× `view.team.route[view.team.cafeIndex]`, 4× `cafes.find`) | `PubGame.tsx`, `PubtaskStep.tsx`, `BonusStep.tsx`, `EvidenceReview.tsx`, … | `currentCafe(view)` in `view-helpers` |
| D3 | `taskKind` duplicates `findTask` | `game-service.ts:360`, `apply-action.ts:471` | Reuse `findTask` |
| D4 | Leftovers from the removed one-phone game | `SHOW_STORY` action and the `"story"` status (never dispatched), `@keyframes tremble` (`globals.css:126`), stale "both players" comments (`current-stop.ts`, `usePlayerShell.ts`, `PlayScreen.tsx:12`, `HostDashboard.tsx:30`), unused `BeeryPopup.buttonLabel` | Remove, but keep `"story"` parseable in old saves |
| D5 | `export`s used only in their own file (6) | `getDefaultHowItWorksSteps`, `toWalkSummary`, … | Drop `export` |
| D6 | Unused routing labels | see P5 | Remove |
| D7 | `getApproximateHours` rounds to whole hours ("0 hours" for a short walk) | `GuideStartScreen.tsx:29-31` | Use `formatDurationRange` |

**Not recommended:** a generic `useGameAction` hook, a state library, merging `WalkPlayer` into `GuideWalkPlayer`, or `memo` everywhere. None has a measurable benefit, and each makes the code harder to follow.

## 8. Repository and tooling

| ID | Finding | Severity | Fix |
|---|---|---|---|
| X1 | Next.js patch, see S1 | High | — |
| X2 | Stale docs: `AUDIT.md`, `GO_NO_GO.md`, `IMPROVEMENT_PLAN.md`, `REMEDIATION_LOG.md`, `README.md` predate 2.0; `HIDDEN_PUBS_REBUILD_PLAN.md`/`FINAL_REPORT.md` still mention Postgres; CLAUDE.md test count | Low | Move to `docs/archive/` with a note; update README env/db section |
| X3 | Untracked `.tts/` and `.cache/` (Python venv, voice models) are not in `.gitignore`, the ESLint ignores or the tsconfig `exclude`. One `git add .` would commit hundreds of MB, and local lint gets slow | Medium | Add them to all three ignore lists |
| X4 | Extraneous packages in `node_modules` (`@emnapi/*`, `@img/sharp-wasm32`, …) | Low | `npm prune` (CI uses `npm ci` and isn't affected) |
| X5 | Turbopack copies 6 unused MapLibre `.mjs` files (incl. `-dev` builds, ~3.6 MB) into `.next/static/media` | Low | Deploy size only, never downloaded. Leave it unless it gets in the way. |

## 9. Long sessions and memory

No leaks found. All of the following are cleaned up:
- GPS watch + timeout
- wake lock + `visibilitychange` listener
- MapLibre map + markers (`map.remove()`)
- simulation listeners
- the auto-walk interval
- the poll interval + visibility listener

Tracking keeps 2 fixes. The only data that grows is the Hidden Pubs event queue (C5/C8): hundreds of tiny objects over 4 hours. That is small, but fixed together with C5. A real multi-hour run on a phone is still worth doing during the field test.
