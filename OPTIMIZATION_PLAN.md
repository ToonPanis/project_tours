# Optimisation plan

*Based on [`AUDIT_REPORT.md`](AUDIT_REPORT.md) (finding ids such as P1, B1, C1) and [`PERFORMANCE_BASELINE.md`](PERFORMANCE_BASELINE.md). Nothing in this plan has been implemented yet. It waits for your approval.*

## Ground rules for every batch

- **Branch.** All work happens on `optimization/audit`, which was made from `feature/mongodb`. There is no merge into `main` and no deploy without your explicit OK. The untracked `.cache/` and `.tts/` folders are left alone.
- **Small batches.** Each batch is one commit (or a few).
- **Checks after each batch:**
  - `npm run typecheck`, `npm run lint` and the relevant tests;
  - `npm run i18n:check` when texts changed;
  - before closing a batch: `npm run test:run`, `npm run build` and `npm run test:e2e`.
- **Measurement.** Rerun the same measurement scripts after the batches that aim at speed (1, 3, 5).
- **Tests first.** Wherever a batch changes behaviour that has no test yet (the poll hook, the commit path), the test comes first and must pass on the old code.
- **Untouched:** the game rules (`HIDDEN_PUBS_CONCEPT.txt`, D1–D35), the visual design, the map provider, the custom i18n, the alcohol rules and "no GPS storage". No new npm packages.
- **Databases.** The real MongoDB database is never touched. The only database tests are `npm run test:db` against `HiddenAntwerpGeneral_test`, and only with your OK.

## Prioritised list

| Priority | Item | Findings |
|---|---|---|
| **Critical** | none confirmed | — |
| **High** | Next.js security patch | S1 |
| **High** | Send only the current language's UI texts | P1 (→ P2) |
| **High** | Cheap unchanged polls (version check first) | B1 |
| **High** | Request timeout in the Hidden Pubs client | C1 |
| **High** | Don't lose uploads on "Continue"/"No bonus" | C2 |
| **High** | Media deletion off the create path + a daily sweep | B2 |
| **High** | Privacy notice up to date | S2 |
| **Medium** | Retry with the same id on 500/503; backoff; fewer round trips per action; pool queue timeout | B3, B4, B5 |
| **Medium** | Reveal retry, failed-ARRIVE feedback, stable popup + popup-only queue | C3, C4, C5 |
| **Medium** | Stable café destination; GPS-lost notice; map prefetch in idle time | G1, G2, G3 |
| **Medium** | `loading.tsx` for detail/play; preload the first walk card | P3, P4 |
| **Medium** | Upload token checks; photo decode memory; upload cancel | B7, C7, C6 |
| **Medium** | Tests: `usePubGame`, server coverage gate, upload e2e, `test:db` | T1–T4 |
| **Medium** | `.tts/`/`.cache/` in the ignore lists | X3 |
| **Low** | Dead fields/code, small duplications, stale comments, docs archive | P5, D1–D7, X2, X4, B6, B8, C8, G4, P6, P7 |

## Proposed order (batches)

### Batch 0: safety net (no behaviour change)
- Add `.tts/` and `.cache/` to `.gitignore`, the ESLint ignores and the tsconfig `exclude` (X3).
- New tests that pin down today's behaviour:
  - `usePubGame`: an unchanged poll causes no re-render; a poll is skipped while one is in flight; polling pauses while hidden; a retry reuses the same actionId (T2).
  - Store test for the poll path (prepares B1).
- *Needs your OK:* run `npm run test:db` once against the **test** database, as a baseline for the MongoDB store (T1).

### Batch 1: Next.js patch (S1)
- `next` + `eslint-config-next` 16.3.6 → **16.3.8**, then `npm audit fix` (no `--force`). *Package change: needs your OK.*
- Full check suite + e2e.

### Batch 2: Hidden Pubs robustness on bad networks (C1, C2, B3, C3, C4, C5, G1, C8 small items)
- `AbortSignal.timeout` in `api.ts`.
- Same-id retry on 500/503.
- Skip/continue disabled while an upload is running.
- Retry for failed reveal fetches.
- Visible error after a failed ARRIVE.
- Popup queue holds popup events only, with stable keys.
- Café destination memoised.
- Stop polling a game that is gone.
- Impact: this is the batch that matters most for players in cafés.
- None of these change rules or visual design. They only add disabled states and existing error components.

### Batch 3: polling and MongoDB efficiency (B1, B4, B5, B6)
- `getVersion` first, then the player lookup in parallel, refusing a missing token before any database call.
- `commitWithRetry` returns the new state.
- A conditional `updateOne`.
- A small backoff between commit attempts.
- `waitQueueTimeoutMS`.
- An upper bound on `eventsSince`.
- Verified with the store tests (memory) **and** `npm run test:db` (test database, with your OK).
- Measured with a round-trip counter in the test (operations per poll / per action, before vs after).

### Batch 4: interface texts per language (P1)
- `LocaleProvider` receives the current language's messages, merged with English, from the root layout.
- `useT()` uses them, while `createTranslator(locale)` keeps working for the server and tests.
- `global-error.tsx` keeps the full import.
- Measure the JS and blocking time on all pages before and after.
- *Revisits a documented design decision: needs your OK.*

### Batch 5: perceived speed of pages and map (P3, P4, G3, P6, P7)
- `loading.tsx` for `walks/[slug]` and `walks/[slug]/play`. Check the 404/redirect e2e tests.
- `preload` on the first walk card.
- Prefetch the map chunk and worker in idle time on play/game screens.
- `images.minimumCacheTTL`.
- Small memoisations (`Intl.NumberFormat`, `getLocale` cache).
- Profile `/games/new` (TBT 1.8 s) before touching it.

### Batch 6: media and security (B2, B7, B8, C6, C7, S5)
- A daily cron route for media deletion. *Deployment change (`vercel.json` + `CRON_SECRET`): needs your OK.*
- Upload token checks.
- Photo decode with resize options.
- Upload cancel (1 new text in 8 languages).
- Small route fixes.
- The `.env.example` placeholder.

### Batch 7: cleanup and docs (P5, D1–D7, X2, X4, T3, T4, S2)
- Remove dead fields and code, the `shareOrCopy` and `currentCafe` helpers, stale comments.
- Coverage gate for `pub-game/server`.
- Upload e2e test.
- Archive old docs, update the README and CLAUDE.md test count.
- Draft the privacy-notice update for you to review.

### Final: review + `OPTIMIZATION_RESULTS.md`
- Rerun all measurements.
- Fill in the before/after table, using measured values only.
- Final diff review.

## Items that need a decision from you

1. **Package change:** Next 16.3.8 (Batch 1).
2. **Database test:** may I run `npm run test:db` against `HiddenAntwerpGeneral_test` (Batches 0 and 3)?
3. **i18n change:** OK to stop bundling all 8 languages in the browser (Batch 4)?
4. **Deployment change:** a Vercel Cron job + `CRON_SECRET` for the media sweep (Batch 6). Rate limiting via the Vercel WAF is a dashboard setting you'd make yourself (S3).
5. **New UI texts:** "position may be outdated" (G2) and "Cancel upload" (C6), translated into 8 languages, with no design change.
6. **Lighthouse:** OK to run `npx lighthouse` (downloads a package temporarily), for a real Lighthouse score in the results?
7. **Game owner:** resending a rejected photo from an earlier café (C9). Not planned until the owner decides.

## Biggest risks to existing functionality

| Change | What could break | Protection |
|---|---|---|
| Batch 3 (commit path) | Concurrency: lost or doubled actions | Store tests on both stores, idempotency tests, `test:db` on real MongoDB, the multi-phone e2e |
| Batch 4 (i18n) | Language switch, fallback to English, texts in Client Components | The language-switch e2e, the i18n screen tests, `no-hardcoded-text` |
| Batch 5 (`loading.tsx`) | 404 status / the Hidden Pubs play redirect while streaming | The existing pages e2e + an explicit redirect test |
| Batch 1 (Next patch) | Framework regressions | The full CI suite + e2e |
| Batch 2 (timeouts) | A timeout that is too short on slow uploads | Uploads don't use `request()`; 8 s applies only to JSON calls |

## Progress

| Batch | Status | Notes |
|---|---|---|
| 0 | ✅ done (`c6ec105`) | `.tts/`/`.cache/` ignored by git, tsc and ESLint (lint now ≈ 27 s); `pub-game-poll-hook.test.tsx` pins down polling, versions and retries; `npm run test:db` on `HiddenAntwerpGeneral_test`: 19 passed (the MongoDB store works against real Atlas; the service round trip create → join → start → answer took 2.0 s from this laptop vs 24 ms in memory). The store test for the poll path moves to batch 3, which needs it. |
| 1 | ✅ done (`de8e50b`) | next + eslint-config-next 16.3.8, sharp 0.35.5, source-map-js 1.2.2. `npm audit --omit=dev`: 0 vulnerabilities. 5 dev-only highs remain (braces via eslint-config-next; npm's only fix is a downgrade to v14, not taken). All checks + 28 e2e green. |
| 7 | ✅ done (see the batch 7 commit) | P5: the unused English `instruction` on every route step and `maneuver-labels.ts` removed; walks no longer fill the unused `unlockCondition`/`nearbyPlaces` (types kept: "for future rules"). D1: one `shareOrCopy()` instead of three copies. D2: `currentCafeId(view)` in 7 screens. D4: unused `tremble` animation, unused `BeeryPopup.buttonLabel`, stale comments. D5: 7 exports that only their own file uses. T3: `pub-game/server` in the coverage gate (minus the parts that need MongoDB/Blob, the environment wiring and the page helpers); totals stay above the thresholds. T4: a browser test sends a bonus photo, the host approves it, and the points count only then. X2: the pre-2.0 audit docs moved to `docs/archive/` (with a README); README and CLAUDE.md brought up to date. S2: `PRIVACY_NOTICE_DRAFT.md` now describes Hidden Pubs (server data, 7 days, processors, cookie, photos) with placeholders where only you can answer. **Not done:** `SHOW_STORY`/"story" (a reserved, documented part of the save model; old saves contain it), D7 (would change the start screen's text; no current walk is affected), X4 `npm prune` (its dry run would also add 124 packages: not the clean-up intended; `npm ci` gives a clean tree). |
| 6 | ✅ done (`e98abd0`) | B2: photo/video cleanup (D29) moved out of `createGame`: a daily Vercel Cron job (`vercel.json` → `GET /api/cron/media-cleanup`, refused without `CRON_SECRET`, timing-safe check) plus a safety net run with `after()` once the create-game answer has gone out, at most once an hour per instance. **You still need to set `CRON_SECRET` in Vercel (Production).** B7: upload tokens and direct uploads only for a task the team can submit right now (a trial SUBMIT_EVIDENCE through the game rules; D26 resubmission still works); Blob paths checked with the strict `isMediaIdOfGame` pattern; `findTask` reused instead of `taskKind` (D3). B8: the dev upload route refuses before reading the body; a database outage on the Blob token route is a 500 (was a misleading 400). C6: a running upload has a Cancel button (existing `common.cancel` text, no new translation) and is aborted when the screen closes. C7, partly: the canvas memory is released after shrinking a photo; decoding with `createImageBitmap` resize options was **not** done (support on iOS is unclear and the gain can't be measured here). S5: `.env.example` shows a placeholder instead of the cluster host. B9 (video Range requests) left for a real iPhone check. |
| 5 | ✅ done (`4e8dc74`) | **P3 changed approach:** no `loading.tsx`. The Next 16 docs (`loading.md`, Status Codes) confirm that once its fallback streams, `notFound()`/`redirect()` can no longer set the status: `walks/[slug]` would lose its real 404 (an e2e test), `walks/hidden-pubs/play` its 307. Instead `useLinkStatus` (Next 16): `ButtonLink` and the walk cards show a faint pending layer while the next page loads (`LinkPendingHint`, always rendered, no layout shift, no new text). P4: the first card on `/walks` preloads its cover. G3: the map code (1 MB raw / 278 KB gz) and its worker files download in idle time on the play pages and in a running Hidden Pubs game (not with Data Saver; production only); checked in the production build: fetched on the start screen. P6: `images.minimumCacheTTL` 7 days (not 31: the cache can't be emptied, a replaced image needs a new file name). P7: `getLocale`/`getTranslator` in React `cache()`; one `Intl.NumberFormat` per translator (batch 4). `/games/new` profiled (TBT 1.8 s): the extra time is module evaluation in the Turbopack runtime and native work, no app function stands out, so it was left alone. |
| 4 | ✅ done (`f3c8856`) | P1: the browser no longer gets all 8 languages. `client.tsx` bundles English only (the fallback); the root layout passes the visitor's language to `<LocaleProvider messages>`; `translator.ts` holds the translator without texts, `translate.ts` (server, data, tests) is unchanged for callers. `global-error.tsx` (part of every page's JS) shows English and loads the visitor's `errors.json` only when it appears. **JS per page: 215 → 161 KB gzip (−25 %)**, measured with the same throttled script; a non-English visitor gets their texts in the HTML instead (+9.5 KB gz for German, +12 KB for Ukrainian per full page load; client navigation doesn't resend them). **Timings (TBT/LCP) inconclusive**: this machine was busy with other processes (a `next dev` and two `next start` servers I didn't start, Chrome) and the spread between two runs of the same build (±400 ms TBT, ±1.7 s LCP) is larger than any difference; old and new were measured interleaved for that reason. To be re-measured on an idle machine or a phone. 7 new tests (browser translator, crash page). |
| 3 | ✅ done (`048ef8b`) | B1: polls ask the version first (with the player lookup in parallel) and read the whole game only when it changed. B4: one `findOneAndUpdate` instead of `findOne` + `updateOne` in the commit transaction; the game and the "already saved?" check are read in parallel; no reload after a commit; a short random pause between commit retries; `savePlayerToken` gets `expiresAt` instead of reading the game. B5: pool 10 + `waitQueueTimeoutMS` 5 s. B6: events never newer than the state they come with; more than 100 missed events → none (the state is current). **Measured on the MongoDB test database** (laptop → Atlas, median, 2 runs each): unchanged poll 51–56 → 29 ms (−45 %), tap 303–329 → 234–236 ms (−25 %), changed poll 77–80 → 81–88 ms (unchanged: still 3 sequential steps). Store tests: memory + real MongoDB (`test:db` 19 passed); 4 new service tests fail on the old code. |
| 2 | ✅ done (`0852fc6`) | C1 request timeout (8 s), B3 same-id retry on 5xx, C2 "No bonus" waits for uploads, C3 reveal retry, C4 failed ARRIVE shown, C5 popup-only queue with stable ids, G1 memoised café destination, C8: polling stops for a gone game, `busy` counter, two live regions always mounted, preview URL created on file choice. Not done from C8: `ClaimPlayerLink` network retry (needs a new text), the FunFact loading status, the settings context memo (no measurable effect). |

## Baseline: checks on the unchanged code

typecheck ✅ · lint ✅ · i18n:check ✅ · 985 unit tests + coverage thresholds ✅ · build ✅ · 28 browser tests ✅ · `npm audit --omit=dev` ❌ 3 high (S1) · `test:db` not run (needs your OK).
