# Hidden Antwerp — Technical Audit

*Audit date: 2026-09-29 · Commit audited: `1ce3a6c` (branch `main`, clean tree) · Scope: whole repository · No application code was modified.*

---

## Executive Summary

Hidden Antwerp is in good technical shape for a prototype.

- **Build and tooling:** the build, the type-check, lint, the translation check and all 670 tests pass. `npm audit` reports 0 vulnerabilities. There are no secrets in the repo or in git history.
- **Architecture:** it is clean and data-driven. The code contains no walk-specific conditions.
- **Privacy:** the location-privacy rule (GPS positions are never stored) holds.

No **Critical** findings were confirmed.

Before the app is put in the hands of real tourists, one theme matters more than all the others: **a walking group can get stuck with no way forward.**

1. **H-01.** Once GPS works well, the manual "I'm here" button disappears. Arrival then depends only on being within 40 m of the stop's map pin.
2. **M-01.** At 3 stops (Sint-Jacob, and the Cathedral in two walks), the pre-generated walking route ends 42–49 m from that pin.
3. **H-02.** Hidden Pubs challenges have no skip or reveal path, and some answers are still playtest placeholders.

Together, H-01 and M-01 can stop a tourist at a known stop. H-02 can stop a team at De Kat if the placeholder cat count is wrong.

The other important issues are these:

- **No error page (M-02).** Any runtime error, including the map code failing to load on a weak connection, shows Next's English "Application error" with no way to recover.
- **Two cases where progress can be lost (M-03, M-04).**
- **Hard-coded English on every Hidden Pubs screen (M-05).**
- **Map camera fights the user (M-06).** The map undoes the user's zoom on every GPS reading.
- **No CI (M-17).**

The Smekens drawing rights (H-03) remain a known legal blocker for a public launch.

| Severity | Confirmed findings |
|---|---|
| Critical | **0** |
| High | **3** |
| Medium | **20** |
| Low | **44** |
| Optional | **12** |

---

## Project Snapshot

| Item | Verified value |
|---|---|
| Framework | Next.js **16.3.6** (App Router, Turbopack), React **19.2.8**, TypeScript 5.9.3 strict |
| Styling | Tailwind CSS 4.3.3, tokens and 3 themes in `src/app/globals.css` |
| Runtime dependencies | `next`, `react`, `react-dom`, `maplibre-gl` 6.11.1 (only 4) |
| Tests | Vitest 4.1.11 + RTL/jsdom: **23 files, 670 tests, all passing** (~13–20 s). No e2e, no CI. |
| Node | Local v20.18.0 (end-of-life since 2026-04-30). There is no `engines` field and no `.nvmrc`. |
| Routes | `/`, `/walks`, `/walks/[slug]`, `/walks/[slug]/play`, `not-found`. All are dynamic, because the locale cookie is read. |
| Backend / API / auth | None: no route handlers, server actions, proxy, database or accounts. |
| Walks | Poortjes (35 stops, 5 chapters, 52 drawings, **3** search tasks), Hidden Pubs (8 cafés, 7 legs, 2,045 m), Classics (18 stops, 17 legs, 5,244 m). There are 61 stop coordinates in total, all with status `to-verify`. |
| Images | 78 files, all referenced, none missing, none orphaned. Classics: 26 images, 11.7 MB of source files, all licensed. Poortjes: 52 drawings, 17.8 MB of source files. |
| i18n | 8 locales, 333 UI keys per locale, custom `Intl`-based layer. The locale is stored in a cookie and never appears in the URL. |
| Persistence | `localStorage` only: key `hidden-antwerp:playtest:<slug>` (`STORAGE_VERSION = 2`) and `hidden-antwerp:locale`. |
| Map / GPS | MapLibre + OpenFreeMap tiles, self-served worker in `/maplibre/`, `watchPosition` with `enableHighAccuracy`. Routes are pre-generated with OSRM. |
| Client JS (measured) | About 180 KB gzip shared on every route. The play route adds 25 KB, plus 277 KB gzip of MapLibre that is loaded only when the map is needed. |
| Server render (warm, local) | 11–57 ms per page |
| Deployment configuration | None: no `vercel.json`, Dockerfile, GitHub Actions or `output` setting. |

---

## Audit Method

1. **Discovery.** I read `CLAUDE.md`, `AGENTS.md` and `I18N.md`. I checked the folder structure against the docs and established a baseline: `tsc`, `lint`, `i18n:check`, `vitest run` and `next build`, all green.
2. **Ten specialist agents, running in parallel and read-only.** Each got only the context relevant to its area:
   - Architecture
   - TS/React code quality
   - Security & privacy
   - Maps/GPS/navigation
   - Performance
   - UX/mobile/accessibility
   - Internationalisation
   - Data & content integrity
   - Testing/QA
   - Dependencies/build

   `node_modules`, `.next` and `public/maplibre` were excluded, except that the build output in `.next` was inspected for bundle measurements.
3. **Measurement.** The performance agent served the existing build (`next start` on a spare port, since stopped) and measured payloads and headers with curl. The data agent loaded every walk in all 8 locales through the real builders and wrote the check scripts to the session scratchpad only.
4. **Cross-review.** Each report was checked against the code by a different agent:

   | Findings | Reviewed by |
   |---|---|
   | Architecture | Code Quality |
   | Security | Build |
   | GPS and Data | QA |
   | Performance | Architecture |
   | UX | GPS |
   | i18n | UX |
   | Code Quality and Build | Security |

   Each finding got a verdict: CONFIRMED, LIKELY, NEEDS VERIFICATION or FALSE POSITIVE.
5. **Lead review.** I verified the key disputed findings myself in the code: `NavigationScreen.tsx:150,157`, `PlayHeader.tsx:27,37`, `LedgerPanel.tsx:41,57`, `GuideCompletionScreen.tsx:23`, `WalkPlayer.tsx:109-110`, and the absence of `error.tsx`. I then removed duplicates, merged findings with a shared root cause and set the final severities.
6. **Evidence rule.** Every finding below cites file and line numbers. Confidence is given per finding. Findings that need a real phone are marked **NEEDS VERIFICATION**.

**Source-ID legend:** each finding lists the IDs from the agent reports it merges.

| Prefix | Agent |
|---|---|
| ARCH | Architecture |
| CQ | Code quality |
| SEC | Security |
| GPS | Maps/GPS |
| PERF | Performance |
| UX | UX/accessibility |
| I18N | Internationalisation |
| DATA | Data integrity |
| QA | Testing |
| BUILD | Build/dependencies |

---

## Critical Findings

**None confirmed.**

The closest candidate is the combination of H-01 and M-01. At `poortjes-sint-jacob`, the nearest walkable path OSRM found is 49 m from the pin, and good-accuracy GPS hides the manual button. So a tourist could stand at the church and be unable to continue. I rated this **High, not Critical**, because GPS noise may still produce two readings within 40 m. That has not been tested on site. **If the on-site test at Sint-Jacob or the Cathedral shows that arrival never fires, escalate H-01 to Critical.**

---

## High Priority Findings

### H-01: With good GPS there is no manual "I'm here" or skip, so a walker can get stuck at a stop
- **Severity:** High · **Confidence:** CONFIRMED (found independently by 2 agents, cross-checked by 2 more, verified by the lead)
- **Agents:** GPS-01, UX-01, confirmed by QA and the lead
- **Files:**
  - `src/features/navigation/components/NavigationScreen.tsx:150` (`gpsProblem`), `:157` (`showManualArrival`), `:243-247` (button), `:52-60` (the permission check skips the intro)
  - `src/features/navigation/config.ts` (arrival radius 40 m, low-accuracy threshold 35 m)
- **Evidence:** `showManualArrival = phase === "manual" || gpsProblem || !destinationCoordinates`. `gpsProblem` is true only when GPS is unavailable, denied, or accuracy is worse than 35 m. So in these situations there is no manual control at all:
  - GPS accuracy is good but the position is more than 40 m from the pin.
  - The app is waiting for the first fix (`fix = null`, so `isLowAccuracy(null) === false`).
  - The permission prompt is left unanswered.

  After permission has been granted once, a reload goes straight back to GPS mode (`:52-60`), so "Continue without GPS" is never offered again. Only the playtest tools can advance, and they are off in production.
- **Why it matters / real-world impact:** Automatic arrival is the only way forward. A walker gets stuck in these cases:
  - The pin can't be reached (M-01).
  - GPS reflections in narrow streets (Vlaeykensgang, the gate passages) give confident but wrong readings.
  - A stop is closed or has scaffolding.
  - The group wants to skip a stop.

  The only way out a tourist could find is revoking location permission in the browser settings.
- **Recommended solution:** Always render a secondary "I'm here" button in GPS mode. It could appear after N seconds, or within about 100–150 m of the stop. Automatic arrival stays the primary path. Also show it while waiting for the first fix. Keep the reducer as it is; `ARRIVE` is already idempotent.
- **Effort:** Small · **Depends on:** none. Needs a new i18n key only if the wording changes.
- **Risk of change:** Low. The arrival logic is unchanged; this only affects whether the button is visible.

### H-02: Hidden Pubs main challenges have no skip or reveal path, and some answers are placeholders
- **Severity:** High (for any public or real-group use) · **Confidence:** CONFIRMED (the QA cross-review checked the reducer and every hint)
- **Agents:** DATA-02, confirmed by QA
- **Files:**
  - `src/features/walk-session/logic/session-reducer.ts:83,145`: the only skips are `SKIP_DRINK_ROUND` and `SKIP_BONUS`. `REVEAL_HINT` is capped at `hints.length`.
  - `src/data/walks/hidden-pubs/05-de-kat.ts:35-37`: `correctNumber: 9`, marked TEMPORARY.
  - `01-rococo.ts` ("Stepped") and `07-de-varkenspoot.ts` ("Statue"): `researchStatus: "on-site-verification-required"`.
  - Challenges that depend on the café interior: `02-den-engel.ts`, `04-de-muze.ts`, `06-quinten-matsijs.ts`.
- **Evidence:** No hint reveals the answer. The De Kat hints are "Check the walls…" and "Paintings… all count". "Show answer" exists only in the playtest tools. Multiple choice can be brute-forced, but the De Kat **number** answer cannot.
- **Impact:** A team is permanently stuck in these cases:
  - The real count isn't 9.
  - The café is closed or full, so the interior challenge can't be done.
  - The team simply can't solve it.

  The finale has an indirect way out: its answers are the clues collected in the ledger.
- **Recommended solution (data-driven, no walk-specific code):**
  1. Verify the answers on site.
  2. Add optional outdoor fallback challenges.
  3. Add a generic "reveal answer after N wrong attempts / skip challenge" path. This needs a new `SessionAction`, the `solved` or `skipped` status, and translated UI. Skipping must not affect the ledger's clue logic unintentionally.
- **Effort:** Medium · **Depends on:** on-site research and a product decision (does a skip still give the clue?).
- **Risk of change:** Medium. It touches the reducer and session state, so `STORAGE_VERSION` may need a bump or a migration (see M-04).

### H-03: Smekens drawing rights are not cleared (launch blocker, not a code bug)
- **Severity:** High (only before a public launch) · **Confidence:** CONFIRMED (already known)
- **Agents:** DATA-09
- **Files:** `src/data/walks/poortjes-van-antwerpen/index.ts:54` (TODO). All 52 `public/images/poortjes/gate-*.jpg` files (18.7 MB) carry `license: rightsNote`. `gate-07.jpg` is also the cover image.
- **Impact:** A public launch without clearance is a legal risk. The drawings are central to the walk: the cover, the collection and the search tasks.
- **Recommended solution:** Clear the rights with the rights holders or publisher. Otherwise replace the drawings with placeholders or own photos behind a data flag. Add a test that fails if `contentStatus` becomes `"published"` while the rights note is still present.
- **Effort:** Large (legal) · **Risk:** none on the code side.

---

## Medium Priority Findings

### M-01: Route lines end outside the 40 m arrival radius at 3 stops; the tests don't catch it
- **Confidence:** CONFIRMED (data) · **Agents:** GPS-02, DATA-01, settled by QA
- **Files:**
  - `src/data/walks/poortjes-van-antwerpen/{coordinates,routes}.json`, `classics-of-antwerp/{coordinates,routes}.json`
  - `src/features/navigation/logic/tracking.ts` (arrival is measured against the pin)
  - Tests: `navigation-data.test.ts:39-40` (Hidden Pubs < 60 m), `poortjes-data.test.ts:129-130` (< 80 m), `classics-data.test.ts:44-50` (no endpoint check at all)
- **Evidence:** Distance from route end to pin:

  | Stop | Distance |
  |---|---|
  | `poortjes-sint-jacob` | **49 m** |
  | `poortjes-kathedraal` | **42 m** |
  | `classics-cathedral` | **42 m** |
  | `poortjes-rosier` (route start) | 42 m |
  | 7 more stops | 27–35 m |

  The pins are building centroids. OSRM snaps the route to the nearest walkable way.
- **Impact:** A walker who follows the line to its end is outside the radius, so arrival is flaky or never happens. This becomes a hard stop while H-01 is open (see Cross-Agent Disagreements #1).
- **Solution:** Move these coordinates to the entrance or viewing point on public ground (they are all `to-verify`), rerun `generate-walking-routes.mjs`, and tighten the endpoint test to about 30 m for **all** walks. Alternatively add an optional `arrivalPoint` field per location.
- **Effort:** Small · **Depends on:** on-site check. Fix H-01 first. · **Risk:** Low. Regenerated routes must be spot-checked.

### M-02: No `error.tsx` or `global-error.tsx`, so any runtime error shows Next's generic English crash screen
- **Confidence:** CONFIRMED (`src/app` only has `not-found.tsx` files) · **Agents:** UX-06, GPS-06, I18N-13, CQ-01, SEC-05
- **Files:**
  - `src/app/` (missing files)
  - `src/features/navigation/components/NavigationScreen.tsx:20-23` (`next/dynamic` map import)
  - `src/features/walk-session/storage/session-storage.ts:36-56`
- **Evidence and triggers:**
  - The lazily loaded map chunk fails to download. This is likely on a weak mobile connection, or in an old tab after a new deploy.
  - A WebGL edge case.
  - A corrupted or old saved session. `parseSavedSession` only checks that each stop's entry is an object, not its fields, so the error would come back on every reload.
- **Impact:** A tourist in mid-walk sees "Application error: a client-side exception has occurred" in English, with no retry and no reset. Progress is safe in storage, but the user doesn't know that.
- **Solution:**
  1. Add `src/app/walks/[slug]/play/error.tsx`: a client component with translated text, a `reset()` retry, and a "reset this walk" button that clears that walk's saved session.
  2. Add a minimal `global-error.tsx`.
  3. Optionally wrap `<WalkingMap>` in a small error boundary so the direction panel and "I'm here" survive a map failure.

  Read `node_modules/next/dist/docs` for the Next 16 error file conventions first.
- **Effort:** Small · **Risk:** Low · **Depends on:** new keys in all 8 `errors.json` files.

### M-03: Switching language mid-walk can wipe progress when localStorage is unavailable
- **Confidence:** CONFIRMED code path (traced by the Security reviewer). A runtime reproduction with site data blocked is still needed. · **Agents:** CQ-02, QA-03
- **Files:** `src/features/walk-session/state/useWalkSession.ts:35-39`, `src/i18n/client.tsx:56,80`, `src/features/walk-session/storage/session-storage.ts:63-71`
- **Evidence:** `useEffect(() => { setSession(store.load(walk)); … }, [walk, store])`. `router.refresh()` produces a new, deserialized `walk` prop, so the effect runs again. When storage is blocked or `save()` has been failing silently (quota), `load()` returns `null`, the in-memory session is replaced, and the team is sent back to the start. When storage works, this is harmless.
- **Impact:** Silent loss of a game in progress, for example in private browsing or with cookies blocked. It also contradicts the CLAUDE.md claim that switching language "keeps client state".
- **Solution:** Load once per `walk.slug`, using a `hasLoadedRef` or `[walk.slug, store]` as the dependency. Never replace a session that is already in memory with `null`. Add a regression test that renders in `en`, advances, then rerenders with `nl` using both a normal store and a store that throws.
- **Effort:** Small · **Risk:** Low

### M-04: A saved session is thrown away when walk data changes, but its contents are barely checked
- **Confidence:** CONFIRMED · **Agents:** ARCH-07, CQ-01, SEC-05, QA-06
- **Files:** `src/features/walk-session/storage/session-storage.ts:36-56` (line 48: `walkLocationIds.every(...)`)
- **Evidence:** The parser is **too strict on the list of stops:** adding or renaming one stop rejects the whole save. It is **too loose on the contents:** `status`, `votes`, `wrongAttempts` and `finale` are never checked.
- **Impact:** Deploying a content change mid-day resets everyone's progress, for example a group at stop 20 of 35 on the full-day Poortjes walk. Meanwhile a malformed entry can crash the page when it is displayed (M-02).
- **Solution:** Merge the save with the current walk instead of rejecting it:
  - keep progress for stop ids that still exist;
  - add `locked` progress for new stops;
  - drop ids that no longer exist;
  - reject the save only if `currentLocationId` has disappeared.

  Also check `status` against the `LocationStatus` union and the numeric fields. Add a per-version migration hook, and use it later for H-02 and the storage-key rename (L-18).
- **Effort:** Small–Medium · **Risk:** Low. It's a pure function that is already unit-tested. · **Product decision:** reset or reconcile when content changes?

### M-05: English leaks into translated screens (hard-coded text, plus a pattern that hides the next leak)
- **Confidence:** CONFIRMED (verified by the lead) · **Agents:** ARCH-03, UX-10, I18N-01, ARCH-04, I18N-02
- **Files and evidence:**
  - `src/features/walk-session/components/PlayHeader.tsx:27` hard-codes `Clues {x} / {y}`. **Every Hidden Pubs screen** shows this in all 8 languages.
  - `PlayHeader.tsx:37` hard-codes `"Ledger"`, and the panel name is decided by whether `walk.clues` exists.
  - `LedgerPanel.tsx:41` hard-codes `Discovered clues · …`, and `:57` hard-codes `Clue {n} · locked`.
  - `src/features/guide/components/GuideCompletionScreen.tsx:23` calls `getElapsedTime(session, new Date())` without `t`. The time falls back to English ("2h 47m") for all guide walkers.
  - **Root cause:** 24 components and helpers default `t = englishTranslator`, for example `session-stats.ts:54`, `GuideStartScreen.tsx:28` and `DirectionPanel.tsx:34`. A forgotten `t` compiles without error. `npm run i18n:check` only checks the JSON files, so it can't catch text hard-coded in components. The i18n agent's own sweep missed these strings because they are multi-line JSX text.
- **Impact:** Visible English on core screens. It breaks CLAUDE.md rule 9 and the "fully translated" claim.
- **Solution:**
  1. Add `game.header.clues`, `game.header.ledger`, `game.ledger.discovered` and `game.ledger.locked` in all 8 locales. Preferably add a walk-level copy field for the panel name.
  2. Pass `t` in `GuideCompletionScreen`.
  3. Make `t` a required parameter, or call `useT()` inside client leaf components, and keep the English default only in tests.
  4. Optionally add a lint or test guard that fails on JSX text nodes outside `playtest/`.
- **Effort:** Small (strings) / Small–Medium (required `t`) · **Risk:** Low. The compiler points to every call site.

### M-06: The map camera undoes the user's zoom, pinch and rotate, and re-animates on every GPS reading
- **Confidence:** CONFIRMED (code); battery cost NEEDS VERIFICATION · **Agents:** GPS-05, CQ-03, UX-02, PERF-07
- **Files:** `src/features/navigation/components/WalkingMap.tsx:135-137` (only `dragstart` turns off follow mode), `:209-233` (`fitBounds`/`easeTo`, 800 ms, on every `userPosition`)
- **Impact:** The +/− buttons, double-tap and pinch-zoom are reverted about a second later, so the map feels broken. On the full-day walk, near-continuous WebGL animation plus high-accuracy GPS plus the wake lock drains the battery faster.
- **Solution:**
  - Also leave follow mode on `zoomstart`, `rotatestart` and `pitchstart` when `originalEvent` is set.
  - Skip camera moves when the position changed by less than about 3–5 m and the bearing by less than about 10°.
  - Use a shorter duration.
  - Respect `prefers-reduced-motion` (O-03).
- **Effort:** Small · **Risk:** Low

### M-07: One bad GPS reading moves everything (no outlier rejection, no accuracy circle)
- **Confidence:** CONFIRMED · **Agents:** GPS-03, cross-checked by QA
- **Files:**
  - `src/features/navigation/hooks/useGeolocation.ts:64-69` (every reading is forwarded)
  - `logic/navigation-view.ts:49-55` (far-from-route is decided on a single reading)
  - `logic/tracking.ts` (`timestamp` is unused)
- **Impact:** A single 300 m jump, or a cell-tower position indoors, does all of this at once:
  - moves the blue dot;
  - zooms the camera out over the city;
  - switches the instruction to "Head to X".

  There is no accuracy circle, so the walker can't see how uncertain the position is. Arrival and off-route detection are already protected by counting consecutive readings.
- **Solution:**
  - Ignore readings worse than about 100–150 m for the camera and the instructions.
  - Reject implied speeds above about 10 m/s unless 2 readings in a row agree.
  - Require 2 readings before switching to far-from-route.
  - Draw an accuracy circle.
  - Count only readings with a newer timestamp (merges L-10).
- **Effort:** Medium · **Risk:** Low–Medium. The thresholds need tuning in playtests.

### M-08: The map depends on a single free tile service, and nothing works offline
- **Confidence:** CONFIRMED (code); service terms NEEDS VERIFICATION · **Agents:** GPS-07, PERF-06
- **Files:**
  - `src/features/navigation/config.ts:30-31` (`tiles.openfreemap.org`)
  - `WalkingMap.tsx:141-144` (errors are ignored after the first load)
  - `WalkPlayer.tsx:179` and `GuideWalkPlayer.tsx:160` (`key={location.id…}`, which recreates the map for every leg)
  - `/maplibre/*` is served with `max-age=0`
- **Evidence:**
  - OpenFreeMap is volunteer-run, with no SLA.
  - Tile failures in the middle of a walk show grey areas and no message.
  - There is no service worker or manifest.
  - The map instance, style, worker and tiles are rebuilt for every leg: 35 times on Poortjes.
- **Impact:** In dead spots (narrow streets, inside cafés) a reload or the next stop can fail. It also causes repeated data use and battery drain. The direction panel keeps working, because the routes are bundled.
- **Solution:**
  1. **(S)** Add a long cache header for a versioned `/maplibre/` path, and show a notice after repeated tile errors.
  2. **(M)** Keep one map instance for the whole walk. Lift it above the per-leg screen and update only the route and the destination.
  3. **(L, needs approval)** Add a service worker that caches the app shell, the walk's images and the walk-area tiles. It must never cache positions.
  4. Decide on the production tile provider: self-host OpenFreeMap or use a paid provider.
- **Effort:** S / M / L · **Depends on:** a product and budget decision. Item 2 fits with L-06 (a shared player shell).

### M-09: The direction panel re-announces itself to screen readers on every GPS reading
- **Confidence:** CONFIRMED · **Agents:** UX-03, confirmed by GPS
- **Files:** `src/features/navigation/components/DirectionPanel.tsx:66` (`aria-live="polite"` on the whole panel)
- **Impact:** VoiceOver and TalkBack users hear the whole panel about once a second, which drowns out everything else.
- **Solution:** Remove `aria-live` from the panel. Add a separate visually hidden `role="status"` element that updates only when the maneuver changes or a distance threshold is crossed (100/50/20 m).
- **Effort:** Small–Medium · **Risk:** Low

### M-10: Focus isn't moved when a new screen opens, and is lost when a button disappears
- **Confidence:** CONFIRMED (partly corrected in cross-review) · **Agents:** UX-04
- **Files:**
  - `NavigationScreen.tsx:163`: the live map screen names the destination only in a `<p>`. There is an `<h1>` only in the explainer at `:109`.
  - `ChapterCard.tsx:22`, `GuideStartScreen.tsx:56` and `GuideCompletionScreen.tsx:30` have an `h1` but never move focus to it.
  - `SearchTaskView.tsx:108-122`: the button that had focus is unmounted.
  - The working pattern already exists in `PlayScreen.tsx:21-24` and `GuideStopPage.tsx:81-84`.
- **Impact:** Screen-reader and keyboard users aren't told that a new screen opened, and they land back at the top of the page.
- **Solution:** Reuse the `PlayScreen` focus-on-mount pattern. Add a visually hidden `h1` to the live navigation screen. Move focus to the revealed solution in `SearchTaskView`.
- **Effort:** Small · **Risk:** Low

### M-11: Wrong answers give no fresh feedback on repeat attempts and may not be announced
- **Confidence:** CONFIRMED (line numbers corrected in cross-review) · **Agents:** UX-05
- **Files:** `src/features/walk-session/components/ChallengeScreen.tsx:135-139`, `FinaleScreen.tsx:129`, `SolvedScreen.tsx:234`
- **Evidence:**
  - The `role="status"` element is added together with its text, so many screen readers don't announce it.
  - The second and third wrong answers show identical text.
  - No input has `aria-invalid`.
  - Multiple-choice options submit on a single tap and are never marked.
- **Impact:** A team tapping in sunlight can't tell whether the tap registered, and a screen-reader user may never hear "wrong".
- **Solution:** Keep the live region mounted at all times and update its text, including the attempt count. Set `aria-invalid` on the input. Briefly mark the wrong option.
- **Effort:** Small · **Risk:** Low

### M-12: The navigation screen's fixed height can push the arrival button off small screens
- **Confidence:** NEEDS VERIFICATION (iPhone SE / 667 px, with German or Russian text) · **Agents:** UX-07, CQ-11, I18N-10
- **Files:** `NavigationScreen.tsx:160` (`h-[calc(100dvh-9.5rem)]`), `PlayHeader.tsx` (its height varies)
- **Impact:** When the headers wrap, or the bottom bar grows (permission alert, weak-GPS note, the button that H-01 will add, long Spanish maneuver labels), two things can happen. The map shrinks to almost nothing, or the bottom bar with "I'm here" ends up below the fold. Touches on the map pan the map instead of scrolling the page.
- **Solution:** Make the play screen a `100dvh` flex column (headers, then `flex-1` content) instead of subtracting a magic number. Give the map a minimum height of about 12rem.
- **Effort:** Medium · **Risk:** Medium (layout) · **Depends on:** do together with H-01.

### M-13: The route/ledger sheet can only be closed at the bottom of a long list
- **Confidence:** CONFIRMED · **Agents:** UX-08
- **Files:** `src/features/walk-session/components/LedgerPanel.tsx:108-112`, `src/components/ui/Dialog.tsx`
- **Impact:** On Poortjes, the only Close button is below 35 stops plus the collection. Phones have no Escape key, and the Android back gesture is untested.
- **Solution:** Add a sticky header with a ✕ button and a translated `aria-label`.
- **Effort:** Small · **Risk:** Low

### M-14: The Classics photos still add up to about 6 MB on a phone
- **Confidence:** CONFIRMED (measured) · **Agents:** PERF-01, confirmed by ARCH
- **Files:** `public/images/classics/**`, `src/features/guide/components/GuideImageFigure.tsx:39`, `ThenNowComparison.tsx:45`, `GuideStartScreen.tsx:46` (`sizes="100vw"`), `next.config.ts` (no `images` settings)
- **Evidence:**
  - A 390 px screen at 3× pixel density gets the 1200w WebP variant.
  - At that size the 26 images total **6.3 MB**.
  - The largest is `central-station/historical-hall-1909.jpg` at 921 KB.
  - The film grain in the scans compresses badly.
  - Poortjes is fine: about 102 KB per drawing.
- **Impact:** Slow stop pages on mobile data and several MB of data use per walk.
- **Solution:** Pre-process the source files in `download-commons-images.mjs` (resize to about 1000 px, light denoise). Add `images.qualities`, `deviceSizes` and `formats` (`avif`) in `next.config.ts`. Keep the originals' license metadata untouched. On phones, capping `sizes` alone won't help much.
- **Effort:** Small–Medium · **Risk:** Low. Check the images visually afterwards.

### M-15: The play page shows only "Loading…" until the JavaScript runs
- **Confidence:** CONFIRMED (the 1–3 s delay is estimated and needs a device check) · **Agents:** PERF-04, confirmed by ARCH
- **Files:** `src/features/walk-session/state/useWalkSession.ts:36-40`, `WalkPlayer.tsx:72`, `GuideWalkPlayer.tsx:55`
- **Evidence:**
  - The server-rendered HTML for the Poortjes play page is 312 KB, of which 307 KB is the RSC payload. The only visible content is "Loading…".
  - The hero image's `preload` never reaches the HTML.
- **Impact:** A blank screen at the start of every walk and on every reload during a walk.
- **Solution:** Render the parts that don't depend on the saved session (cover, title, stats) straight away. Fill in the Continue/Restart buttons after reading storage, using two render passes or `useSyncExternalStore`. Sessions stay client-only.
- **Effort:** Medium · **Risk:** Medium (hydration) · **Depends on:** easier after L-06.

### M-16: The `Walk` model allows invalid combinations, and structural checks exist only for some walks
- **Confidence:** CONFIRMED · **Agents:** ARCH-01, ARCH-02, confirmed by CQ
- **Files:**
  - `src/types/walk.ts`, `src/types/location.ts`
  - `GuideWalkPlayer.tsx:168-182` (a stop without `guide` renders `null`)
  - `session-reducer.ts:110-115` (a guide stop with a challenge gets stuck)
  - `walk-data.test.ts` (no leg or `guide` checks)
- **Evidence:** A 4th walk, or data from a future CMS or database, can pass `tsc` and CI and still:
  - be missing route legs;
  - be missing stop pages (blank screen);
  - mix game and guide fields (dead end).

  None of the current data triggers this.
- **Solution:**
  1. Add a generic `validateWalk(walk)` in `src/lib` and run it for every walk × locale in `walk-data.test.ts`. It should check:
     - a leg for every pair of consecutive stops, plus a bypass leg for each bonus stop;
     - every guide stop has `guide`;
     - no guide stop has a challenge or drink round;
     - route endpoints are within about 30 m of their stops (M-01).
  2. Add a visible fallback or "continue" button for a guide stop without content.
  3. Later: a discriminated union `GuideWalk | GameWalk`.
- **Effort:** Small (validator) / Medium (union) · **Risk:** Low / Medium

### M-17: No CI, so the quality checks rely on the developer remembering to run them
- **Confidence:** CONFIRMED · **Agents:** QA-01 (rated HIGH), BUILD-02 (rated MEDIUM). Final: Medium, see Disagreements #3.
- **Files:** `.github/` is missing. `package.json` has no `test:run` or `typecheck` script. There is no deployment configuration.
- **Impact:** A red build, a missing translation or a failing test can reach `main` or be deployed. The per-environment `NEXT_PUBLIC_PLAYTEST_TOOLS` setting is also undefined.
- **Solution:** Add a GitHub Actions workflow on push and PR, using the Node version from `.nvmrc` (L-37). It should run `npm ci`, then `tsc --noEmit`, `lint`, `i18n:check`, `vitest run` and `build`. Make it a required check on `main`. Choose the host.
- **Effort:** Small–Medium · **Risk:** Low

### M-18: The riskiest runtime paths have no automated tests (real GPS, locale detection, the map)
- **Confidence:** CONFIRMED · **Agents:** QA-02, QA-04, QA-05, QA-11
- **Files:** `useGeolocation.ts` (only the simulation branch is tested), `useWakeLock.ts` (untested), `src/i18n/server.ts` (tests always fall back to English), `LanguageSelector`/`LocaleSync` (untested), `WalkingMap.tsx` (mocked everywhere), `PlaytestControls.tsx:23` (gating untested)
- **Impact:** A regression in any of these areas would pass all 670 tests:
  - permission-denied handling;
  - `clearWatch` cleanup;
  - cookie and `Accept-Language` precedence;
  - the MapLibre worker;
  - the playtest tools (including "show answer") being hidden in production.
- **Solution:** Add unit tests with a fake `navigator.geolocation`, a mocked `next/headers` and a mocked `next/navigation`. Extract `isPlaytestEnabled(env)`. Add a Playwright smoke test later (see the Testing Strategy; needs approval).
- **Effort:** Small–Medium · **Risk:** None to production code.

### M-19: Component tests check live placeholder content
- **Confidence:** CONFIRMED · **Agents:** QA-07
- **Files:** `walk-player.test.tsx`, `guide-player.test.tsx`, `poortjes-player.test.tsx`, `page.test.tsx`, `walk-detail-page.test.tsx`, `session-reducer.test.ts`
- **Evidence:** The tests assert literal text such as "Tongerlo Blond", "THE STAIR", "11:55", `/Stepped/` and "± 3 hours". Several of these are playtest placeholders marked `to-verify`.
- **Impact:** When content research corrects these values, tests fail for content reasons, which trains the team to "just update the test".
- **Solution:** Derive the expected values from the data (`getCorrectAnswer`, `walk.locations[i].name`, `createTranslator("en")`). Keep stable logic tests on the `the-17-gates` fixture.
- **Effort:** Medium · **Risk:** Low

### M-20: No direction arrow for the first stop, or after straying far from the route
- **Confidence:** CONFIRMED · **Agents:** GPS-04 (QA proposed LOW–MEDIUM)
- **Files:** `src/features/navigation/logic/navigation-view.ts:38-55`, `DirectionPanel.tsx:54-58` (the arrow is "★", `travelBearing: null`), `scripts/generate-walking-routes.mjs` (no leg leads to the first stop)
- **Impact:** In "head to destination" mode, used for the first stop of every walk and whenever the walker is more than 150 m off the route, the panel shows only the name and a distance. A tourist leaving the station or a hotel has to read the map to know which way to go. CLAUDE.md calls this "straight-line guidance".
- **Solution:** Show the compass direction (e.g. "NE") and/or turn the arrow using the GPS heading while the walker is moving. Optionally draw a dashed straight line to the destination.
- **Effort:** Small–Medium · **Risk:** Low

---

## Low Priority Findings

All of these are CONFIRMED unless marked otherwise. Effort: S = Small, M = Medium.

| ID | Title | Source | Files / evidence | Recommended solution | Effort |
|---|---|---|---|---|---|
| L-01 | No security headers; `X-Powered-By` sent | SEC-01, BUILD-06 | `next.config.ts` has no `headers()`; `poweredByHeader` default is true | Add nosniff, Referrer-Policy, `Permissions-Policy: geolocation=(self)`, `frame-ancestors 'none'` and `poweredByHeader:false`. Run a CSP in Report-Only mode first, because MapLibre needs `worker-src 'self' blob:` and the tile host. | S–M |
| L-02 | `allowedDevOrigins` wildcards match attacker domains (dev only) | SEC-02, reproduced by BUILD | `next.config.ts:11`: `10.a.evil.com` and `172.evil.attacker.com` match. It affects the CSRF check and the cross-site dev guard. | List exact LAN IPs, or read them from `.env.local` | S |
| L-03 | Whole `Walk` (answers, all route geometry) sent to the client | SEC-03, CQ-05, ARCH-08, PERF-05 | `play/page.tsx:40`. Poortjes payload: 286 KB raw / 63.5 KB gzip. Answers can be read in DevTools. This is by design for now. | Later: a play-time projection with no answers, and server-side answer checking (product decision). Becomes Medium or higher once walks are paid. | M–L |
| L-04 | Playtest flag in production; "Clear localStorage" wipes every key | SEC-04, QA-11 | `PlaytestControls.tsx:23,63-66` | Add a launch checklist item or a build guard. Remove only the `hidden-antwerp:playtest:*` keys. | S |
| L-05 | Tile requests reveal the viewport to OpenFreeMap (privacy disclosure) | SEC-06 | The map follows the user at high zoom. It never sends coordinates or stores anything, so it's consistent with CLAUDE.md. | Mention it in the future privacy notice | S (docs) |
| L-06 | The two players duplicate their orchestration, and their route lookups differ | ARCH-06, GPS-08 | `WalkPlayer.tsx:50-140` vs `GuideWalkPlayer.tsx:35-135`. The game player uses `getRouteLegTo` (the first matching leg, which could be a bypass leg). A latent bug, since Hidden Pubs has no optional stops. | Use `getRouteLegToCurrent` everywhere. Extract a `usePlayerShell` hook and a shared `<StopNavigation>`. | S / M |
| L-07 | Feature folders import each other both ways; "game" names used for shared parts | ARCH-05 | walk-session ↔ guide ↔ navigation. The guide player uses `GameCopy`, `LedgerPanel` and `game.*` keys. | Move `getOrderedLocations` to `src/lib`. Rename `LedgerPanel` to `RoutePanel` and `GameCopy` to `WalkCopy`, as pure moves. | M |
| L-08 | Stops very close together arrive instantly (possible geocoding collapse) | GPS-09, DATA-03 | de-kat → quinten-matsijs is 10.7 m. Also gildekamersstraat → leonie-glassplein 32 m, brabo → stadhuis 38 m. Real positions NEED VERIFICATION. | Check on site. Optionally hold arrival for the first few seconds of a leg. | S |
| L-09 | No route-progress continuity; the map turns to the route, not the phone's heading | GPS-10 (LIKELY) | `route-progress.ts:38-75` projects each reading on its own; `headingDegrees` is unused | Clamp the projection near the previous progress; add a u-turn hint | M |
| L-10 | Arrival can count one cached reading twice | GPS-12 (LIKELY) | `tracking.ts:26-44` ignores `timestamp`, and `maximumAge` is 2 s | Count a reading only if its timestamp is newer. Merged into the M-07 fix. | S |
| L-11 | Permission help and timeout message | GPS-11 (partly confirmed) | `permissionHelp` doesn't mention the phone's location services; a timeout (code 3) is shown as "unavailable" | Reword in all 8 languages; give timeouts their own status | S |
| L-12 | Retry timer not cleared; old GPS status survives a retry | CQ-08 | `NavigationScreen.tsx:152-156`, `useGeolocation.ts:37,55-85` | Keep the timer id in a ref; reset `status` when the watch starts | S |
| L-13 | Wake lock may hold more than one lock | CQ-09 (LIKELY) | `useWakeLock.ts:17-42` | Request only if there is no lock or it was released | S |
| L-14 | All 8 UI languages ship in every client bundle | PERF-02, CQ-04 | `src/i18n/messages.ts:2-9`: 36 KB gzip. Intentional, per a code comment. | Pass only the active locale's messages from the server. The language switch then waits for one server round trip. | M |
| L-15 | Font preloads include cyrillic and latin-ext for every visitor | PERF-03 | `layout.tsx:11-21`: 6 woff2 files, about 200 KB | `subsets: ["latin"]` only affects preloading; the other subsets still load on demand. Check the generated CSS. | S |
| L-16 | Poortjes detail page is heavy | PERF-08 | 323 KB HTML / 33 KB gzip; 849 srcset URLs | Use a smaller `deviceSizes`/`imageSizes` set (shared with M-14), or collapse the collection | S |
| L-17 | Double repository read per page; misleading "pre-render" comment | ARCH-09, CQ-06 | `[slug]/page.tsx:21-25,32,46` and `play/page.tsx:17,34`. The routes are dynamic, so `generateStaticParams` is a no-op. | Wrap reads in React `cache()`; fix the comment or remove the no-op | S |
| L-18 | Unused model fields, a test fixture in production data, and "playtest" wording shown to users | ARCH-12 | `types/location.ts:91-92` (`unlockCondition` and `nearbyPlaces` are required but never read); `the-17-gates.ts`; `game.start.restartPlaytest`; the storage key | Make the fields optional; move the fixture to `src/__tests__/fixtures/`; reword the label; rename the key with the M-04 migration | S |
| L-19 | Walk assembly boilerplate repeated 3×, including an unchecked JSON cast | ARCH-10 | `normalizeOsrmRoute(leg.osrm as SavedOsrmRoute)` in the 3 walk `index.ts` files | Add `loadRouteLegs()` and `findCoordinates()` helpers | S |
| L-20 | Two distance formatters give different results | ARCH-11 (LIKELY) | `format-walk.ts:44` vs `maneuver-display.ts:34`, both used for walk totals | Use `formatDistance` for walk totals | S |
| L-21 | A language switch scrolls to the top and moves focus | CQ-07 | `PlayScreen.tsx:22-25`: the effect depends on the translated `title` | Key the effect on a stable screen id | S |
| L-22 | List keys made from content text | CQ-10 | `key={paragraph}` in `GuideStopPage.tsx:129,179`, `InfoBoxView.tsx:22`, `SearchTaskView.tsx:102`, `StorySection.tsx:25` | Use the index for static text, or add ids | S |
| L-23 | Low contrast for locked ledger entries | UX-09 | `text-parchment/40` on umber gives 2.83:1 (tavern theme) | Use at least `/60`, or an icon plus italics | S |
| L-24 | Dutch text not marked `lang="nl"` | UX-11, I18N-03 | `CollectionItemCard.tsx:115` (Smekens captions), `GuideStopPage.tsx:253-262` (source titles) | Add `lang="nl"`; add an optional `language` field to sources | S |
| L-25 | Restart dialog focuses the destructive button first | UX-12 | `ConfirmDialog.tsx:31` | Put `autoFocus` on Cancel; give the confirm button a destructive style | S |
| L-26 | Small touch targets | UX-13 | MapLibre zoom buttons are 29 px (`WalkingMap.tsx:126`); back link and 11 px credit links | Enlarge with CSS, or drop the zoom control; add `min-h-11` | S |
| L-27 | Map region label and loading placeholder | UX-14 | `WalkingMap.tsx:238` is labelled with only the destination name; the loader shows "…" (`NavigationScreen.tsx:22`) | Translated "Map: route to {name}"; translated loader text | S |
| L-28 | Language menu uses the wrong ARIA pattern | UX-15 | `LanguageSelector.tsx:51` has `aria-haspopup="true"` on a disclosure; the menu stays open when focus leaves | Remove `aria-haspopup`; close on focus-out | S |
| L-29 | A finished guide stop can't be reopened | UX-16 (LIKELY) | `GuideWalkPlayer.tsx:97-100` only moves forward | A read-only "view stop" from the route panel | M |
| L-30 | Long words can overflow; no hyphenation anywhere | UX-17, I18N-10 (NEEDS VERIFICATION at 390 px) | Only the home `h1` has `overflow-wrap:anywhere`. Examples: "Spätrenaissanceportal", "Eisenbahnkathedrale". The es maneuver label wraps to 3 lines in `DirectionPanel`. | Add `break-words hyphens-auto` to headings and buttons; shorten the es maneuver labels | S |
| L-31 | MapLibre's built-in control text stays English | I18N-04 | `WalkingMap.tsx:112-126`: no `locale` option | Pass translated `locale` strings | S |
| L-32 | `i18n:check` misses plural categories and extra placeholders | I18N-05 | `scripts/check-translations.mjs:14-15,62-67`. The current data is correct. | Check each locale against `Intl.PluralRules` categories; report extra `{placeholders}` | S |
| L-33 | Social-preview (OG) and robots metadata details | I18N-06 (partly confirmed) | `openGraph.locale` is "nl", not `nl_BE`; the walk page's `openGraph` replaces the root's; the play page's `robots` drops `nofollow` | Map to the `ll_TT` format; share base OG fields. SEO with a cookie-only locale is a product decision before indexing. | S |
| L-34 | Brief flash of the wrong language when the cookie is gone | I18N-07 (NEEDS VERIFICATION) | `client.tsx:44-60`: `LocaleSync` refreshes after hydration | Accept it and document it in I18N.md | S |
| L-35 | Answer checking: ß and thousands separators | I18N-08 | `answers.ts:9-17`: "Faß" ≠ "Fass"; "1.582" fails `parseNumber`. The Cyrillic й/ё folding is harmless. | Map `ß→ss`; strip `.` and space thousands separators in number answers | S |
| L-36 | Node version not pinned; local Node 20 is end-of-life | BUILD-01 (reduced from MEDIUM) | No `engines`, no `.nvmrc` | Add `engines` and a `.nvmrc` (22 or 24); upgrade locally; bump `@types/node` | S |
| L-37 | Worker copy script has no error message | BUILD-03 | `scripts/copy-maplibre-worker.mjs:18-27`; `map-worker.test.ts` needs the copied file (`npm ci --ignore-scripts` breaks it) | Add try/catch with a clear message; run it before tests in CI | S |
| L-38 | Test tooling is a major version behind | BUILD-04 | vite 6 / vitest 4 / plugin-react 4 (latest: vitest 5, plugin-react 6 with vite 8) | Upgrade together on a separate branch (needs approval) | M |
| L-39 | Data scripts are fragile | BUILD-05, SEC-07 | No retry or timeout for routes; no `response.ok` check; User-Agent has no contact info; a refused license silently drops its metadata; `walk` and `localPath` are not validated | Harden both scripts | S |
| L-40 | Nothing detects `routes.json` falling out of date with `coordinates.json` | DATA-04 | The generator doesn't store its input coordinates | Store `from`/`to` per leg; add a test that compares them | S |
| L-41 | Hidden Pubs shows no distance | DATA-05 | `hidden-pubs/index.ts:49` has `distanceInMeters: null`; the legs sum to 2,045 m | Derive it from the legs, as the other walks do | S |
| L-42 | Wrong image dimensions in `images.json` | DATA-06 | `handelsbeurs-lalanne` declared 1280×1040, file 940×764; `cathedral-hollar-1649` declared 1280×1812, file 750×1062 | Record the real size in the download script; add a test | S |
| L-43 | Finale and one bonus question have no hints | DATA-07 | `hidden-pubs/content/en.ts:249,329-331` | Add at least one hint, or an explicit opt-out | S |
| L-44 | A 3rd Poortjes search task is untested and undocumented | DATA-08 | `content/en/deel-3.ts:436` (Academie garden); `poortjes-data.test.ts:177-189` covers only 2 | Generalise the test to every stop with a search task; update CLAUDE.md | S |

The remaining test-suite gaps (QA-06, 08, 09, 10, 12, 13) are covered in the **Proposed Testing Strategy**, not listed as defects.

---

## Optional Improvements

| ID | Improvement | Source |
|---|---|---|
| O-01 | Replace hard-coded map colours (`#17120e`, `#d9a54e`) with theme tokens. Align `LOW_ACCURACY_METERS` 35 with the arrival accuracy of 40. Use `lat,lng` in the external map link when coordinates are known. | CQ-11 |
| O-02 | Default player names are saved in the language used at team setup ("Speler 1"). Translate them when displayed instead. | CQ-12 |
| O-03 | JS smooth scroll and map animations ignore `prefers-reduced-motion`. | UX-18 |
| O-04 | Remove the unused English maneuver strings (`maneuver-labels.ts`, `getImmediateLabel`). | I18N-09 |
| O-05 | Flags as language symbols (🇬🇧 for English, 🇳🇱 for Flemish visitors, 🇷🇺 next to 🇺🇦). This is a product choice. | I18N-11 |
| O-06 | Treat `Accept-Language` `q=0` as not acceptable. | I18N-12 |
| O-07 | Switch the few `http://` links to `https://`, including in the Commons script's output. | SEC-08 |
| O-08 | The "extraneous" optional WASM packages in `node_modules` clear with a clean `npm ci`. | BUILD-07 |
| O-09 | Adopt `noUncheckedIndexedAccess` gradually. Add `test:run` and `typecheck` scripts, and a `.gitattributes` (LF). Update README (it still calls "The 17 Gates" the first walk). | BUILD-08 |
| O-10 | The GPS simulation provider ships in production, inert. | GPS-13 |
| O-11 | The Grote Markt pause box has no `checkedOn`; 14 of 26 photographers are "unknown" (acceptable for public-domain images). | DATA-10 |
| O-12 | Design suggestions, not defects: a lighter variant of the dark game screens for sunlight; the "urgent" tremble animation runs once instead of looping; a sticky "Next: {stop} →" bar on long stop pages; a visible focus ring on the vote options. | UX (optional) |

---

## Architecture

**Verdict:** sound and consistently data-driven. See M-16, L-06, L-07, L-17, L-18 and L-19.

**What was verified:**
- There are no walk-specific conditions in app code. A grep for slug comparisons and walk names found only the repository's generic lookup.
- Pages are Server Components that read data through `walkRepository` and never import `src/data`.
- `session-reducer.ts` is pure: time and randomness are passed in as action data.
- Persistence sits behind the `WalkSessionStore` interface.
- Technical data is kept separate from per-language content (`pickContent`, `cachePerLocale`).

**Structural risks:**
- **Walk model (M-16).** The model is one flat type in which the guide-only and game-only fields are all optional, and there is no generic validator. A new walk could break at runtime without failing CI.
- **Duplicated players (L-06).** The two players repeat the same orchestration code, and their route lookups have already diverged.
- **Folder coupling (L-07).** The feature folders import each other in both directions.

**Largest files:** `GuideStopPage.tsx` (377 lines), `WalkPlayer.tsx` (275), `NavigationScreen.tsx` (273), `WalkingMap.tsx` (246). None of them is unmanageable.

**Recommended structural direction.** Change it step by step; no rewrite is needed:
1. Add `validateWalk()`.
2. Add a shared player shell (`usePlayerShell`), which also makes M-08 (one map instance for the whole walk) and M-15 easier.
3. Rename the "game" modules that both players use.

## Code Quality

**Verdict:** clean.

**What was verified:**
- No `any`, no `@ts-` comments and no non-null assertions. The 3 `eslint-disable`s are all justified.
- Effects clean up properly: `clearWatch`, `map.remove()`, markers, listeners and timeouts.
- The latest-callback ref pattern is used to avoid stale closures.
- Hydration is safe: localStorage and `Date` are only read in effects.
- Next 16 APIs are used correctly: async `params`, `cookies()` and `headers()`, `unstable_rethrow`, and `dynamic(..., {ssr:false})`.

**Defects:**
- M-02 (no error page)
- M-03 (language-switch reload)
- M-06 (camera)
- L-12, L-13, L-21, L-22 (smaller lifecycle and key issues)

## Security & Privacy

**Verdict:** very small attack surface and no Medium or higher issues.

**What was verified:**
- 0 `npm audit` vulnerabilities, including with `--omit=dev`.
- No secrets in the working tree or in git history. This was a regex scan, not a full secret scanner.
- Only two `NEXT_PUBLIC_*` variables, and neither is sensitive.
- No `dangerouslySetInnerHTML`, no `innerHTML`, no `eval`. Map markers are built with `textContent`.
- Every `target="_blank"` link has `rel="noopener noreferrer"`.
- The locale cookie is validated against an allow-list.
- The slug lookup is an exact match with `notFound()`.

**Location privacy (checked end to end):**
- GPS fixes live only in `NavigationScreen` state and refs.
- No `SessionAction` carries coordinates.
- There is no `console.log` of positions and no runtime `fetch`.
- A test asserts that no position is written to localStorage.

**Issues:**
- L-01 (headers)
- L-02 (dev wildcards)
- L-03 (answers sent to the client, by design)
- L-04 (playtest flag)
- L-05 (tile-provider disclosure)
- L-39 (script input validation)

## Maps / GPS / Navigation

**Verdict:** the core logic is well built.

**What was verified:**
- Arrival needs 2 consecutive good readings. Off-route detection uses `max(30 m, accuracy)` × 3.
- The logic is pure functions with unit tests. Arrival can't fire twice.
- The map is created once per screen and removed on cleanup.
- The worker URL is set before the map is created, and a test checks the worker's version.
- `watchPosition` is only active while navigating.
- The wake lock is requested again when the page becomes visible.
- Permission states are handled: if permission is already granted the explainer is skipped, and if it's denied the map, a retry button and manual mode remain.
- The guide player handles optional stops correctly with bypass legs.

**Problems:**
- The stuck-walker combination: H-01 with M-01.
- Weak handling of a single bad fix (M-07).
- The camera fights the user (M-06).
- The single tile provider with no offline support (M-08).
- No direction arrow at the start of a walk (M-20).
- Smaller items: L-08 to L-11.

**Real-device test list.** These must be tested on iOS Safari and Android Chrome over HTTPS:
1. Starting indoors, and how the first bad fix is handled.
2. Standing at the Sint-Jacob and Cathedral pins.
3. Narrow streets (Vlaeykensgang, Wolstraat).
4. Permission: deny, then allow in settings, then retry. On iOS, also with Location Services off. Also dismissing the prompt, and leaving it unanswered.
5. Reloading mid-leg.
6. Locking and unlocking the screen, and switching apps.
7. Being 50 m and 200 m off the route, walking backwards, and a 300 m jump.
8. Skipping a stop.
9. Taking and skipping the Poortjes optional stops.
10. Airplane mode or a dead zone mid-leg.
11. Battery use over 2 hours.
12. Pinch-zoom while following.
13. The very short legs (L-08).
14. A LAN playtest over plain `http` (GPS is blocked; use HTTPS).

## Performance

**Verdict:** the fundamentals are good.

**What was verified:**
- MapLibre (277 KB gzip) is lazy-loaded and only on the play route.
- `next/image` is used everywhere, with `sizes`. There are no raw `<img>` tags.
- No client component imports walk data, and only the active language's walk content is sent.
- Static chunks are cached as `immutable`.
- Server rendering takes 11–57 ms.

**Measured problems:**
- M-14: 6.3 MB of Classics images.
- M-15: the play page is blank until the JavaScript runs.
- M-08: the map is rebuilt for every leg, and there is no caching or offline support.
- L-14: 36 KB gzip of unused languages.
- L-15: about 200 KB of font preloads.
- L-16: the heavy Poortjes detail page.

**Main measurements:**

| Item | Size |
|---|---|
| Shared JS on every route | ~180 KB gzip |
| Poortjes play HTML (including the RSC payload) | 63.5 KB gzip |
| Classics images at 1200w | 6.3 MB |
| Poortjes drawing at 1200w | ~102 KB each |

## UX / Mobile / Accessibility

**Verdict:** a solid mobile-first base.

**What was verified:**
- Buttons have `min-h-11` or larger. Inputs are at least 16 px, so iOS doesn't zoom in.
- The native `<dialog>` handles the focus trap.
- `PlayScreen` and `GuideStopPage` move focus to their heading.
- There is a skip link, proper landmarks and `fieldset`/`legend`.
- `html lang` is set per language.
- The main text colours have strong contrast (12.7–15.6:1).
- There is a CSS rule for `prefers-reduced-motion`.

**Actual defects:**
- H-01 (stuck at a stop)
- M-09 (screen reader flooded)
- M-10 (focus lost)
- M-11 (wrong-answer feedback)
- M-12 (navigation screen height)
- M-13 (sheet can only be closed at the bottom)
- L-23 to L-30

**Design suggestions (not defects):** O-12.

## Internationalization

**Verdict:** the architecture is solid.

**What was verified:**
- Keys are typed from the English JSON, and the fallback never shows `undefined`.
- Plurals use `Intl.PluralRules`; ru and uk have one/few/many/other.
- Prices, dates, lists and distances are formatted per locale.
- `<html lang>` is correct on the first page load.
- The locale cookie is validated.
- Fonts include the Cyrillic subset.
- Walk-content structure matches across all 8 languages, which is tested.
- Answer lists accept every language, including Cyrillic and Ukrainian apostrophes.

**Defects:**
- **M-05:** hard-coded English, and the optional `t` pattern that let it through.
- **Smaller items:** L-24, L-30 to L-35.

**Product decision:** SEO and link previews with a cookie-only locale, before the site is indexed (L-33).

## Data & Content Integrity

**Verdict:** very high integrity.

**What was verified:**
- There are no duplicate ids anywhere.
- Every reference resolves when the data is built.
- All 78 images exist and are all referenced, and every Classics image has a license, author and source.
- All 61 coordinates are inside Antwerp, and lng/lat order is consistent between GeoJSON and the types.
- There is exactly one route leg per pair of consecutive stops, plus the Rodestraat bypass.
- Every drink round has an alcohol-free option, and there are no shots.
- Answers are non-empty in all 8 languages.
- Research markers are preserved in every translation (14 in Poortjes).
- Vanished gates are never waypoints.

**Issues:**
- H-02 (placeholder answers that can block a team)
- H-03 (drawing rights)
- M-01 (route ends vs. arrival radius)
- L-08 and L-40 to L-44

**CLAUDE.md corrections found:**
- Poortjes has **3** search tasks, not 2.
- All coordinates have status `to-verify`; none is `verified`.
- "Switching language keeps state" is true only when storage works (M-03).
- "Fully translated" is not true for the Hidden Pubs header and ledger (M-05).
- The "straight-line guidance" has no direction indicator (M-20).

## Testing

**Current state:**
- 23 files and 670 tests, all passing.
- The output has no `act()` warnings, key warnings or console errors.
- The pure logic has strong coverage: the reducer, answers, voting, navigation logic and the i18n core.
- The data tests run for every walk in every language (459 tests).
- The business rules are encoded as tests: the alcohol rules, history after the challenge, the hidden-café secrecy, and no GPS in localStorage.

**Gaps:**
- M-18 (critical runtime paths untested)
- M-19 (tests tied to placeholder content)
- No end-to-end tests and no CI (M-17)

**Remaining, smaller gaps:**
- storage edge cases (QA-06);
- missing UI flows: stops 2–8 through the UI, the off-route UI, a vote tie, resuming a guide walk (QA-08);
- dialogs only tested while hidden, because jsdom lacks `showModal` (QA-09);
- no shared test setup (QA-10);
- scripts untested (QA-12);
- only one component test renders a language other than English (QA-13).

## Dependencies & Build

**Verdict:** healthy.

**What was verified:**
- 0 vulnerabilities.
- The lockfile (v3) is committed.
- Every import resolves to a declared package, and no dependencies are unused. Each key package is installed once.
- 0 case mismatches across 837 imports, so the build won't break on Linux or Vercel.
- `.gitignore` is correct.
- The env variables in the code match `.env.example`.
- The runtime-critical packages are pinned exactly.
- `next dev` doesn't churn `AGENTS.md`, because the block is already committed.

**Issues:**
- M-17 (no CI or deploy configuration)
- L-36 (Node version)
- L-37 (worker copy script)
- L-38 (test tooling)
- L-39 (data scripts)
- O-08, O-09

---

## Cross-Agent Disagreements

| # | Topic | Position A | Position B | Resolution |
|---|---|---|---|---|
| 1 | Severity of route ends vs. the arrival radius | GPS agent: **HIGH** (GPS-02) | Data agent: **MEDIUM** (DATA-01) | QA measured the data and read the test tolerances. The severity depends on H-01: a hard stop while H-01 is open, a nuisance once it's fixed. **Final: Medium (M-01), fixed after H-01.** |
| 2 | Test tolerance for route endpoints | GPS agent: "60 m, Hidden Pubs only" | Data agent: "80 m Poortjes, 60 m Pubs, none for Classics" | **The data agent is right.** QA confirmed `poortjes-data.test.ts:129-130` < 80 m and that Classics has no check. |
| 3 | Hard-coded English | i18n agent: "none found" | UX and Architecture agents: 4 strings in `PlayHeader`/`LedgerPanel` | **The i18n agent missed them.** They are multi-line JSX text nodes that a single-line grep can't see. The lead confirmed them in the code, and a UX re-sweep found no others. **M-05.** |
| 4 | No CI | QA: **HIGH** | Build: **MEDIUM** | This is a prototype with one developer, and no known defect gets through because of it today. **Final: Medium (M-17).** It becomes High as soon as anyone else contributes or deploys. |
| 5 | Error boundary / bad saved session | Code quality: **MEDIUM** | Security reviewer: **LOW** (only a corrupted save reaches the blank screens) | Both are right about their own part. The *error page* is Medium because it also covers a map-chunk failure, which is realistic on mobile data. The *shallow save check* is part of M-04. **Split into M-02 and M-04.** |
| 6 | Node version pin | Build: **MEDIUM** | Security reviewer: **LOW** | No production runtime exists yet. **Final: Low (L-36).** |
| 7 | All locales in the bundle | Performance: **MEDIUM-LOW** | Architecture: **LOW**, and intentional per a code comment | It's a documented trade-off: the language switch needs no download. **Final: Low (L-14),** with the alternative noted. |
| 8 | "GPS never sent anywhere" | Security: CLAUDE.md is imprecise, since tiles reveal the viewport | Build reviewer: CLAUDE.md says never *store*, not never *send* | **Build reviewer is right** about the wording. It stays a disclosure item (L-05), not a defect. |
| 9 | No direction arrow in head-to-destination mode | GPS: **MEDIUM** | QA: **LOW–MEDIUM** (the map partly compensates) | It affects the first stop of every walk. **Final: Medium (M-20).** |
| 10 | Map chunk load failure | GPS: **MEDIUM** | QA: **LOW–MEDIUM**, LIKELY | Merged into M-02, which is Medium on the strength of several triggers. |
| 11 | UX-05 / UX-04 evidence | UX agent cited `ChallengeScreen.tsx:226-243` | GPS reviewer: the file has only 159 lines | **Corrected** to `:135-139`. UX-04 is confirmed only in part: `NavigationScreen` does have an `h1`, but only in the explainer. |
| 12 | CQ-09 wake lock | Code quality: LOW | Security reviewer: possibly OPTIONAL | It's an edge-case race and browsers release the lock when the page is hidden. **Kept Low (L-13), LIKELY.** |

---

## Technical Debt

1. **The loose `Walk` model and no generic validator** (M-16). This is the biggest risk when adding walk #4 or a CMS or database.
2. **Duplicated player orchestration and two-way coupling between feature folders** (L-06, L-07). A fix to the navigation wiring has to be made twice.
3. **Optional `t = englishTranslator` defaults** (M-05). They hide the next English leak.
4. **Session persistence:** there is no migration or merge step, and saves are rejected instead of reconciled (M-04). The storage key and a label still say "playtest" (L-18).
5. **Tests tied to placeholder content** (M-19) and no end-to-end or CI layer (M-17, M-18).
6. **Walk assembly boilerplate** repeated three times (L-19), and unused required model fields (L-18).
7. **Data scripts without hardening** (L-39, L-40, L-42), and stale docs (the README, CLAUDE.md's count of search tasks and its coordinate status).

## Production Risks

The top 10, ranked:

1. **A tourist gets stuck at a stop:** H-01 + M-01. This hits deterministically at Sint-Jacob and the Cathedral with good GPS.
2. **A team gets stuck on a challenge:** H-02 (the De Kat placeholder answer, closed cafés, no skip).
3. **Legal:** the Smekens drawing rights (H-03), plus the unreviewed placeholder history (`contentStatus: "placeholder"`, already known).
4. **Crash with no way to recover** on mobile networks or after a deploy (M-02).
5. **Loss of a game in progress:** language switch without storage (M-03), or a content deploy mid-day (M-04).
6. **Dependence on free third-party services:** the map tiles have no SLA and there is no offline mode (M-08).
7. **Battery on the 9.8 km walk:** continuous camera animation, high-accuracy GPS and the wake lock (M-06). This needs measuring.
8. **Configuration:** `NEXT_PUBLIC_PLAYTEST_TOOLS` left on would expose "show answer" (L-04). There is no CI or deploy config to prevent it (M-17).
9. **Readable answers and content in the client:** once there are paid walks, the answers are visible and the paid content is in the page payload (L-03).
10. **Accessibility:** a screen reader is flooded while navigating and focus is lost (M-09, M-10, M-11).

## Recommended Remediation Order

The fixes follow the root causes, and the full plan is in `IMPROVEMENT_PLAN.md`:

1. **Baseline:** CI (M-17), Node pin (L-36). These catch regressions from everything that follows.
2. **Nobody gets stuck:** H-01, then M-12 (make sure the button is visible), then M-01 (data plus tests), then H-02 (after an on-site check and a product decision).
3. **Nobody loses their game:** M-02 (error page), M-03, M-04.
4. **i18n correctness:** M-05 (strings plus required `t`).
5. **GPS and map quality:** M-06, M-07, M-20, then M-08 steps 1–2.
6. **Architecture safety net:** M-16 (`validateWalk`), L-06 (shared player shell). Do these before walk #4.
7. **Accessibility:** M-09, M-10, M-11, M-13, then the Low accessibility items.
8. **Performance:** M-14, M-15, L-14, L-15, L-16.
9. **Security hardening before launch:** L-01, L-02, L-04, L-05.
10. **Tests throughout:** M-18, M-19, and each fix gets a regression test.

## Proposed Testing Strategy

**P0, before any public use**
- CI gate on every push and PR: `tsc`, `lint`, `i18n:check`, `vitest run`, `build`.
- A regression test with every High or Medium fix:
  - H-01: a manual control exists with good GPS that is 80 m away, and before the first fix.
  - M-03: a rerender with the `nl` walk keeps state, including with a store that throws.
  - M-01: route endpoints are within about 30 m for every walk.
  - H-02: every main challenge has a way forward.
- Launch-flag tests:
  - `robots` noindex is present or absent as intended.
  - The playtest tools are hidden in production (`isPlaytestEnabled(env)`).
  - A test fails if the rights note is still present while `contentStatus` is `published`.

**P1, component and unit tests (Vitest + RTL)**
- A fake `navigator.geolocation`: denied, timeout, low accuracy, cleanup on unmount, simulated to real.
- `useWakeLock`.
- `getLocale` with a mocked `next/headers`; `LanguageSelector` and `LocaleSync` with a mocked router.
- Table-driven `parseSavedSession` cases: quota errors, added stops, a malformed status.
- The off-route and far-from-route UI.
- Every challenge type rendered at least once.
- A drink-vote tie through the UI.
- Resuming a guide walk after a reload.
- A locale smoke test (a start screen and one stop per locale, with no raw keys).
- A shared `setupFiles` with `restoreMocks`.
- Expected values derived from data instead of literals (M-19).

**P2, end to end (Playwright: a new dev dependency that needs the developer's OK)**
- Run against `next build && next start` with phone profiles at 390 px.
- `grantPermissions` + `setGeolocation` stepped along the `routes.json` geometry.
- The permission-denied path.
- A full Hidden Pubs game, plus Classics and Poortjes with the optional stop taken and skipped.
- A reload during a walk; an older save version.
- A `nl-BE` first visit, a switch to `uk` during a walk, and a cleared cookie.
- The map canvas renders with no `/maplibre` 404s or console errors.
- `@axe-core/playwright` accessibility checks on the main pages.
- Screenshots in de and ru.
- A privacy assertion: no coordinates in any storage or request, apart from tile indexes.

**P3, real-device field test.** See the device list under Maps / GPS / Navigation. Also:
- private browsing, then a language switch;
- sunlight readability;
- one-handed use;
- passing the phone round for group votes;
- closed-café fallbacks;
- every answer marked `on-site-verification-required`.

**Never mock:**
- the reducer, answer normalisation, arrival, tracking and route progress, `parseSavedSession`, and `pickContent`/`createTranslator`;
- the real walk data in the data tests;
- the real localStorage (stub it only to simulate a failure);
- the browser geolocation API, the real MapLibre worker and the real cookie flow in end-to-end tests.

## Things That Are Already Well Implemented

- **Data-driven design:** no walk-specific code. Sections render from data, and all three walks share the same components.
- **Pure, defensive session reducer:** it ignores stale or duplicate actions, and arrival can't fire twice. Time and randomness are passed in as action data, so behaviour is deterministic.
- **Location privacy:** GPS positions exist only in memory. It's tested that no GPS lands in localStorage, and there is no runtime network call carrying a position.
- **GPS and navigation logic:**
  - pure, unit-tested arrival and off-route logic;
  - correct cleanup;
  - optional stops routed with bypass legs;
  - a thoughtful permission flow;
  - a wake lock;
  - pre-generated routes, so there is no routing API at runtime.
- **i18n layer:** no library, typed keys, fallback that never shows `undefined`, correct Intl plurals and formatting, and content structure tests across all 8 languages.
- **Data integrity:** references fail at build time, there are no duplicates or orphans, the license metadata is complete, and research markers are preserved in every translation.
- **Business rules encoded as tests:** alcohol, history after the challenge, hidden-café secrecy, vanished gates never being waypoints.
- **Performance basics:** MapLibre is lazy-loaded, `next/image` is used everywhere, one language's content per request, and fast server rendering.
- **Security basics:** 0 vulnerabilities, no secrets, no raw HTML, validated inputs.
- **Build hygiene:** a committed lockfile, pinned runtime versions, a self-served MapLibre worker that is version-checked by a test, and correct `.gitignore`.

## Final Verification Checklist

State at audit time:

- [x] `npx tsc --noEmit` passes.
- [x] `npm run lint` passes.
- [x] `npm run i18n:check` passes (333 keys × 7 languages).
- [x] `npx vitest run` passes: 23 files, 670 tests, no warnings.
- [x] `npm run build` succeeds with Next 16.3.6 (Turbopack). All routes are dynamic, as intended.
- [x] `npm audit` reports 0 vulnerabilities, including `--omit=dev`.
- [x] No secrets in the working tree or git history.
- [x] No GPS persistence. The code path was traced and a test covers it.
- [x] No application code, config, dependency or data file was modified by this audit. The only new files are `AUDIT.md` and `IMPROVEMENT_PLAN.md`. Scratch scripts live outside the repo.

Before a public launch:

- [ ] H-01, H-02, M-01 fixed, and a field test done at Sint-Jacob, the Cathedral and De Kat.
- [ ] H-03: drawing rights cleared.
- [ ] M-02, M-03, M-04 fixed.
- [ ] M-05: no English on translated screens.
- [ ] CI required on `main` (M-17).
- [ ] Hosting decided; `NEXT_PUBLIC_PLAYTEST_TOOLS` unset in production.
- [ ] Security headers in place (L-01).
- [ ] Tile provider decided (M-08).
- [ ] Privacy notice written (L-05).
- [ ] Content reviewed by a historian; placeholder answers verified on site; café outdoor fallbacks in place.
- [ ] Real-device test list completed on iOS Safari and Android Chrome.
