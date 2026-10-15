# Optimisation results

*2026-10-15. Branch `optimization/audit`: 8 commits (`c6ec105` … `855478c`) on top of `532e068` (`feature/mongodb`). **Not merged and not deployed:** `main` deploys to Vercel Production, so that is your decision. Background: [`AUDIT_REPORT.md`](AUDIT_REPORT.md) (findings), [`PERFORMANCE_BASELINE.md`](PERFORMANCE_BASELINE.md) (method), [`OPTIMIZATION_PLAN.md`](OPTIMIZATION_PLAN.md) (what each batch did).*

## 1. How "before" and "after" were measured

- **Two builds, measured alternately:** the original commit `532e068` (before) and the final branch (after). The order was after → before → after → before, with the same scripts, on the same laptop, within 20 minutes. That way, the other processes running on this machine (a `next dev` and two `next start` servers that weren't mine, Chrome) affect both sides equally.
  - This morning's baseline numbers (`PERFORMANCE_BASELINE.md`) are not used for comparisons. The machine was much quieter then.
- **Same framework version:** both builds use the installed Next.js 16.3.8. The "before" build therefore measures the old *app code*, not the old Next version.
- **Page loads:** a 390 px phone emulated in Chromium, with 150 ms latency, 1.6 Mbps down and a 4× slower CPU (close to Lighthouse's mobile profile). Each figure is the median of 3 runs, reported per round as `round 1 / round 2`.
- **API latency:** a local server with games in memory. **Database latency:** measured in batch 3 against the MongoDB **test** database, old and new code alternately.
- **Spread:** on this machine the same build varies by up to ±400 ms in blocking time and ±1 s in LCP between rounds. Only differences that show up in **both** rounds are reported as real.

## 2. Comparison

| Area | Before | After | Improvement |
|---|---|---|---|
| **JavaScript per page** (gzip, measured from the HTML's chunk list) | 211 KB (`/`, list, details); 236 KB (play) | 155 KB; 180 KB (play, before the map preload) | **−56 KB per page (−26 %)** |
| JavaScript downloaded during the 3 s after load, play page | 242 KB | 472 KB | **+230 KB, on purpose:** the map now downloads in idle time (see §4) |
| HTML per page, English (gzip) | 5.7–32.9 KB | 5.8–32.8 KB | unchanged |
| HTML per page, Ukrainian (gzip) | 6.3–39.7 KB | 17.6–50.2 KB | +11 KB: the visitor's own texts now come with the page instead of in the JavaScript (net still −45 KB) |
| **Map start-up** (tap "Start the walk" after 6 s on the start screen → map on screen; slow 4G, 4× CPU) | 3,727 / 3,432 ms | 1,736 / 1,569 ms | **−1.9 s (−53 %)** |
| **LCP `/walks`** (first card's cover now preloaded) | 3,684 / 3,564 ms | 2,768 / 2,484 ms | **−1.0 s (−27 %)**, now around the 2.5 s target |
| LCP other pages | `/` 2,844 / 2,888; Classics detail 3,108 / 3,752; Poortjes detail 4,340 / 3,868; Hidden Pubs detail 3,120 / 3,040; play 2,992 / 3,036; `/games/new` 2,608 / 2,488 | `/` 2,776 / 3,104; Classics 3,412 / 2,728; Poortjes 4,680 / 4,240; Hidden Pubs 2,480 / 2,764; play 2,844 / 2,616; `/games/new` 2,412 / 2,492 | within the spread: **no clear change** |
| Total Blocking Time (lab stand-in for INP) | `/` 753 / 963; Hidden Pubs detail 1,359 / 1,034; Classics detail 1,277 / 1,192; `/games/new` 2,430 / 2,382 | `/` 875 / 1,076; Hidden Pubs 684 / 1,017; Classics 877 / 846; `/games/new` 2,208 / 1,970 | Classics detail −30 % in both rounds; the rest within the spread |
| TBT, play page | 1,189 / 1,155 ms | 1,799 / 1,851 ms | **+650 ms, worse:** running the map code in idle time is one long task (§4) |
| CLS | 0 | 0 | unchanged (target ≤ 0.1 met) |
| **Poll "nothing changed"** (MongoDB test database, median) | 51–56 ms, reads the whole game | 29 ms, reads only the version | **−45 %**, and only a few bytes from Atlas |
| **A tap** (MongoDB test database, median) | 303–329 ms | 234–236 ms | **−25 %** (about 3 fewer round trips) |
| Poll "something changed" (MongoDB) | 77–80 ms | 81–88 ms | unchanged (still 3 steps in a row) |
| API latency with the memory store (local) | poll 4.5–5.4 ms, create 12.6 ms | poll 4.7–8.3 ms, create 10–17 ms | unchanged: without a database the server is already fast, so here only the database round trips matter |
| React renders | unchanged poll: 0 re-renders (already); every new event re-mounted an open popup; every changed poll re-added the map's café marker | unchanged poll: 0 (now pinned by a test); a popup stays put; the marker stays | proven by tests, not timed |
| Lighthouse mobile score | not run | not run | needs the `lighthouse` package, which you haven't approved |
| Core Web Vitals at the 75th percentile (field data) | none | none | there are no real visitors or analytics yet |

## 3. Important problems found (and what happened to them)

| Problem | Status |
|---|---|
| Next.js 16.3.6 in a vulnerable range (an SSRF in image optimisation, among others) | **Fixed:** 16.3.8, `npm audit --omit=dev` 0 vulnerabilities |
| All 8 languages' texts in every page's JavaScript | **Fixed:** English + the visitor's language |
| Every poll read the whole game from MongoDB | **Fixed:** version first |
| A stuck request froze the game for a minute or more | **Fixed:** 8 s timeout, then offline + retry |
| A photo could be lost by tapping "No bonus" during its upload | **Fixed** |
| Photos were only deleted when someone created a new game (D29) | **Fixed:** daily job (needs `CRON_SECRET`) + safety net |
| A tap could count twice after a server error | **Fixed:** retried with the same id |
| Upload tokens for any task, at any time | **Fixed:** only for a task the team can send now |
| Privacy notice said "no database" | **Rewritten as a draft:** you still need to fill in the placeholders |
| Fun facts stuck on "loading" after a dead spot; failed GPS arrival silent; popups flickering | **Fixed** |

## 4. A trade-off you should know about: the map preload

The map now opens about 1.9 s faster, because its code (1 MB, 278 KB gzip) and its worker download while the walker is still on the start screen or a stop page.

**The cost:** the browser also *runs* that code during idle time. On the emulated phone this is one long task of about 600 ms (about 150 ms on a fast phone). A tap that lands exactly then waits for it. That is the +650 ms TBT on the play page.

Options if it shows up on real phones:

1. **Download only, don't run:** a `<link rel="prefetch">` for the map chunk instead of `import()`. This needs the chunk's hashed file name from the build.
2. **Start the preload later,** for example on the first stop page instead of the start screen.
3. **Turn it off:** remove `usePreloadMap()` from `GuideWalkPlayer` and `PubGame`.

My advice: keep it, and measure INP on a real mid-range Android during the field test.

## 5. Code

**100 files changed:**
- 58 source files (+801 / −378 lines)
- 20 test files (+921 / −28 lines)
- the rest: documents and config

Every changed file:

- **Config and tooling:** `package.json`, `package-lock.json` (Next.js patch), `next.config.ts` (`minimumCacheTTL`), `vercel.json` (new: cron), `.env.example`, `.gitignore`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.mts`.
- **Translations:** `src/i18n/translator.ts` (new), `translate.ts`, `client.tsx`, `server.ts`; `src/app/layout.tsx`, `src/app/global-error.tsx`.
- **Hidden Pubs server and routes:** `game-service.ts`, `game-store.ts`, `memory-store.ts`, `mongo-store.ts`, `mongo.ts`; `src/app/api/games/route.ts`, `…/media/route.ts`, `…/media/upload/route.ts`, `src/app/api/cron/media-cleanup/route.ts` (new); `logic/apply-action.ts`, `logic/popups.ts` (new), `logic/view-helpers.ts`.
- **Hidden Pubs client and screens:**
  - client: `client/api.ts`, `usePubGame.ts`, `useCafeReveal.ts`, `upload.ts`, `share.ts` (new);
  - screens: `BonusStep`, `CafeNavigation`, `CardStep`, `DrinkStep`, `EventPopup`, `FunFactStep`, `HostDashboard`, `LobbyScreen`, `NextCafeScreen`, `PubGame`, `PubtaskStep`, `ResultsScreen`, `TaskCard`, `BeeryPopup`.
- **Pages, map and guide:**
  - `src/components/ui/ButtonLink.tsx`, `LinkPendingHint.tsx` (new), `WalkCard.tsx`, `src/app/walks/page.tsx`;
  - `src/features/navigation/preload-map.ts` (new), `GuideWalkPlayer.tsx`, `globals.css`;
  - walk data `classics-of-antwerp/index.ts`, `poortjes-van-antwerpen/index.ts`;
  - `src/lib/routing/osrm.ts`, `src/types/navigation.ts`, `src/lib/routing/maneuver-labels.ts` (deleted);
  - small export and comment cleanups in `walk-content.ts`, `fast-forward.ts`, `PlaytestControls.tsx`, `reading-time.ts`, `mock-walk-repository.ts`, `shared-metadata.ts`, `current-stop.ts`, `usePlayerShell.ts`, `PlayScreen.tsx`.
- **Tests:**
  - new: `pub-game-poll-hook`, `i18n-client`, `global-error`, `preload-map`;
  - extended: `pub-game-server`, `pub-game-store`, `pub-game-evidence`, `pub-game-evidence-screens`, `pub-game-screens`, `pub-game-api`, `navigation-logic`;
  - provider texts added: `flows-and-locales`, `i18n-screens`, `play-error`, `poortjes-player`, `pub-game-locales`, `runtime-paths`;
  - import path: `pub-game-cafe-screens`; comment: `navigation-data`;
  - browser test: `e2e/pub-game.spec.ts`.
- **Documents:**
  - new: `AUDIT_REPORT.md`, `PERFORMANCE_BASELINE.md`, `OPTIMIZATION_PLAN.md`, this file, `docs/archive/README.md`;
  - updated: `CLAUDE.md`, `README.md`, `I18N.md`, `PRIVACY_NOTICE_DRAFT.md`, `FIELD_TEST_CHECKLIST.md`;
  - moved to `docs/archive/`: `AUDIT.md`, `GO_NO_GO.md`, `IMPROVEMENT_PLAN.md`, `REMEDIATION_LOG.md`.

**Duplicate code removed:**
- three share/copy implementations → `shareOrCopy()`;
- seven current-café lookups → `currentCafeId()`;
- `taskKind` → the existing `findTask`.

**Simplified or removed:**
- the English route labels nobody read, and the unused `unlockCondition`/`nearbyPlaces` values;
- the `tremble` animation, an unused prop, stale comments and 7 needless exports;
- the popup queue now holds popup events only (simpler than "index + length" keys).

**Dependencies:** `next` and `eslint-config-next` 16.3.6 → 16.3.8; `sharp` 0.35.4 → 0.35.5 and `source-map-js` 1.2.1 → 1.2.2 (lockfile only). **No packages added or removed.**

## 6. Security improvements

- Next.js patched; 0 runtime vulnerabilities.
- Upload tokens only for submittable tasks, with strict path checks.
- The cron route uses a secret with a constant-time comparison.
- No 400 that hides a database outage.
- The dev upload route refuses before reading the body.
- Photos are deleted after 7 days even when nobody creates a game.
- The cluster host is no longer in `.env.example`.

## 7. Tests (last run, final code)

| Check | Result |
|---|---|
| `npm run typecheck` | ✅ |
| `npm run lint` | ✅ (about 27 s; minutes before, because of `.tts/`) |
| `npm run i18n:check` | ✅ 8 languages complete |
| `npm run test:coverage` | ✅ 58 files, **1,024 tests** (985 before; +39 new or extended). Coverage now **includes the Hidden Pubs server**: lines 98.1 %, statements 94.3 %, branches 88.7 %, functions 99.2 % (thresholds 95/90/85/95) |
| `npm run test:db` (MongoDB **test** database) | ✅ 19 passed, run after batches 0, 3 and 6 |
| `npm run build` | ✅ |
| `npm run test:e2e` | ✅ **29 passed** (28 before + the new photo/approval test) |
| `npm audit --omit=dev` | ✅ 0 vulnerabilities. 5 dev-only highs remain (lint tooling; npm's only fix is downgrading `eslint-config-next` to v14) |
| Lighthouse, real iPhone/Android, Vercel deployment | ❌ not run |

No test was removed or weakened. Tests that changed did so for intended changes:
- Uploads now first put the team at the right step.
- The queue test uses a real popup event.
- Providers now receive the texts.

New tests were checked against the old code: the 4 database-read tests and the upload-race test fail on the old code and pass on the new.

## 8. Still open

1. **Set `CRON_SECRET` in Vercel (Production).** Without it the daily photo cleanup refuses to run, and only the hourly safety net after creating a game remains.
2. **A question about the alcohol rule.** CLAUDE.md says the app may "never count, store, show or celebrate the number of drinks". The game never counts or shows them. But the 7-day log of taps (`actions` and `events` in MongoDB) does contain each "a sip for X" tap. That log is needed so a tap is applied once and teammates get their popup. Is that acceptable to you, or should those taps be stored without the player (or deleted sooner)? The privacy draft describes it as it is now.
3. **The privacy notice placeholders:** Atlas and Vercel regions, contact, who downloads photos and how long that copy is kept.
4. **The map preload trade-off** (§4): check INP on a real phone.
5. **Not done, on purpose:**
   - `loading.tsx` (it would cost the real 404 and the redirect status);
   - B9, video playback on iPhone (check on a real iPhone first);
   - C7, decoding photos at a smaller size (the gain can't be measured here);
   - C9, resending a rejected photo from an earlier café (the game owner decides);
   - the CSP switch from Report-Only to enforced (after the phone check);
   - rate limiting (a Vercel WAF rule, a dashboard setting);
   - `SHOW_STORY`, D7 and `npm prune` (see the plan).
6. **Lower priority:**
   - per-page translation namespaces (would save non-English visitors about 5 KB more);
   - a 3-step "changed" poll (version check + game + events);
   - `/games/new` has twice the blocking time of other pages; the profile shows framework module loading, not app code.

## 9. Recommended next steps

1. Review the branch, then open a PR from `optimization/audit`. It contains `feature/mongodb`'s commits, so merge that PR first, or this one together with it.
2. On a Vercel Preview: play a real game with MongoDB + Blob. That includes a photo from an iPhone (upload, review, the video question B9) and a check that the cron job is listed.
3. Field test on a mid-range Android: map start-up and INP (the preload), the GPS-lost notice idea (G2, needs one translated text), and the CSP report-only console.
4. With your OK: Lighthouse (`npx lighthouse`) for a mobile score, and later, once there are visitors, real Core Web Vitals.
