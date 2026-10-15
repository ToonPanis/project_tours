# Hidden Antwerp — Improvement Plan

*Based on `AUDIT.md` (2026-09-29, commit `1ce3a6c`). Finding IDs (H-, M-, L-, O-) refer to that document.*
*Status: **proposal only, nothing implemented.** Every phase needs explicit approval before it starts.*

## Ground rules for every phase

- **Work on a branch per phase** (e.g. `fix/phase-1-no-dead-ends`) and open one PR per phase, or one per coherent group of findings.
- **Fix root causes, not symptoms.** Each fix gets a regression test that would have caught it.
- **Preserve what works.** That means the three walks, content, images, route ordering, coordinates (unless on-site checks say otherwise) and the "Decisions to keep" in `CLAUDE.md`:
  - custom i18n with the locale in a cookie;
  - pre-generated routes;
  - MapLibre with OpenFreeMap and a self-served worker;
  - no GPS storage;
  - the alcohol rules;
  - history after the challenge;
  - vanished gates never become waypoints.
- **Ask first** before any new npm package (Playwright, a coverage tool, a service-worker library), any architectural change, and any change to walk facts.
- **Every user-facing string** goes into all 8 `locales/<lang>/*.json` files, then `npm run i18n:check`.
- **Validation after every phase:** `npx tsc --noEmit`, `npm run lint`, `npm run i18n:check`, `npx vitest run`, `npm run build`, plus the phase-specific checks listed below.
- **Storage changes:** any change to the `WalkSession` shape either bumps `STORAGE_VERSION` or goes through the migration hook from Phase 3.

---

## PHASE 0 — Baseline, safety net, verification

**Objective:** make regressions visible before anything is changed.

| Item | Finding | Notes |
|---|---|---|
| Tag the current state (`git tag audit-baseline-2026-09-29`) | – | Rollback point |
| Add a GitHub Actions CI workflow: `npm ci` → `tsc` → `lint` → `i18n:check` → `vitest run` → `build`. Make it a required check on `main`. | M-17 | Run the worker copy step before the tests (L-37) |
| Pin Node: add `engines` and `.nvmrc` (22 or 24), upgrade local Node, align `@types/node` | L-36 | Rerun the full suite after the upgrade |
| Add `test:run` and `typecheck` scripts | O-09 | Used by CI |
| Add a clear error message to `copy-maplibre-worker.mjs` | L-37 | |
| Fix `CLAUDE.md` and README inaccuracies: 3 search tasks, coordinate status `to-verify`, README's "17 Gates" line | L-44, O-09 | Documentation only |

- **Affected areas:** `.github/`, `package.json` scripts and engines, `.nvmrc`, `scripts/copy-maplibre-worker.mjs`, docs.
- **Dependencies:** none. **Regression risk:** very low; no runtime code changes.
- **Validation:** the CI run is green on a PR. A deliberately broken commit on a scratch branch is blocked.

---

## PHASE 1 — Critical defects: nobody gets stuck, nobody loses their game

**Objective:** remove every known dead end and every data-loss path in the core walking flow.

### 1a. No dead ends in navigation
| Item | Finding |
|---|---|
| Always offer a secondary "I'm here" in GPS mode, including while waiting for the first fix. Keep automatic arrival as the main path. | H-01 |
| Replace the `calc(100dvh-9.5rem)` height with a full-height flex layout and give the map a minimum height, so the button is always visible | M-12 |
| On-site check of the Sint-Jacob, Cathedral (×2) and Rosier pins, then move them to the public entrance or viewpoint and rerun `generate-walking-routes.mjs` | M-01 |
| Tighten the route-endpoint test to about 30 m for **all** walks (Classics currently has none) | M-01 |

### 1b. No dead ends in the game (needs a product decision first)
| Item | Finding |
|---|---|
| **Decide:** after N wrong attempts, reveal the answer or skip? Does a skipped challenge still award its clue (needed for the finale)? | H-02 |
| Add a generic, data-driven "reveal/skip after N attempts" path: a new `SessionAction`, reducer support, translated UI | H-02 |
| Verify the placeholder answers on site (De Kat count, Rococo gable, Varkenspoot form). Add outdoor fallback challenges for the café-interior stops (Den Engel, De Muze, De Kat, Quinten Matsijs). | H-02 (content) |

### 1c. No lost progress, no dead crash screen
| Item | Finding |
|---|---|
| Add `src/app/walks/[slug]/play/error.tsx` (translated retry plus "reset this walk") and a minimal `global-error.tsx`. Optionally add a small error boundary around `<WalkingMap>`. | M-02 |
| `useWalkSession`: load once per `walk.slug` and never replace an in-memory session with `null` | M-03 |
| `parseSavedSession`: merge the save with the current walk instead of rejecting it, validate `status` and the numeric fields, and add a per-version migration hook | M-04 |

- **Affected areas:**
  - `NavigationScreen.tsx`, the play layout (`PlayHeader`, the player wrappers), `config.ts`;
  - the two walks' `coordinates.json` and `routes.json`, plus the data tests;
  - `session-reducer.ts`, `ChallengeScreen.tsx` and related, `types/session.ts`, Hidden Pubs stop data;
  - `useWalkSession.ts`, `session-storage.ts`, new `error.tsx` files;
  - `errors.json`/`gps.json`/`game.json` in all 8 languages.
- **Dependencies:**
  - Phase 0 (CI).
  - Fix H-01 before M-01.
  - H-02 needs the product decision and on-site research.
  - M-04's migration hook should land before, or together with, H-02's session change.
- **Regression risk:** Medium. The reducer and session format change, and the play layout is restructured. Mitigation: existing player tests plus new regression tests; bump `STORAGE_VERSION` or use the migration.
- **Validation:**
  - New tests:
    - manual arrival is visible with good GPS 80 m away and before the first fix;
    - route endpoints are within 30 m for every walk;
    - every main challenge has a way forward;
    - a rerender with the `nl` walk keeps state, including with a store that throws;
    - old or partial saves are merged, not discarded;
    - `error.tsx` renders a translated message and resets the walk.
  - Manual checks:
    - iPhone SE size in de and ru: the "I'm here" button is visible;
    - private window, then switch language mid-walk;
    - block the map chunk in DevTools and check the error page appears.
  - **Field test** at Sint-Jacob, the Cathedral and De Kat.

---

## PHASE 2 — GPS and navigation reliability

**Objective:** make navigation robust to real-world GPS behaviour and easier on the battery.

| Item | Finding |
|---|---|
| Leave follow mode on user zoom, rotate and pitch. Skip camera moves under about 3–5 m or 10°. Use shorter animations and respect `prefers-reduced-motion`. | M-06, O-03 |
| Handle bad readings: ignore readings with very poor accuracy for camera and instructions, reject implausible speed jumps, require 2 readings before far-from-route, count only readings with a newer timestamp, draw an accuracy circle | M-07, L-10 |
| Show a direction (compass text and/or heading-based arrow) in head-to-destination mode, including for the first stop | M-20 |
| Game player uses `getRouteLegToCurrent`, the bypass-aware lookup | L-06 (part) |
| Clear the retry timer; reset GPS status when the watch restarts; clean up the wake-lock race | L-12, L-13 |
| Better permission help (mention the phone's location services) and a separate timeout state | L-11 |
| Check the very short legs on site (De Kat → Quinten Matsijs); optionally hold arrival for the first seconds of a leg | L-08 |
| *(Later, M effort)* Route-progress continuity and a u-turn hint | L-09 |

- **Affected areas:** `src/features/navigation/**` (`WalkingMap`, `useGeolocation`, `tracking`, `navigation-view`, `DirectionPanel`, `config`), `WalkPlayer.tsx`, `gps.json` in all 8 languages.
- **Dependencies:** Phase 1a, so the layout and manual button are settled.
- **Regression risk:** Medium. The thresholds need tuning; keep every threshold in `config.ts`.
- **Validation:**
  - Unit tests:
    - a single 300 m outlier doesn't change the instruction;
    - a duplicate timestamp counts once;
    - the far-from-route switch needs 2 readings;
    - the game player picks the correct leg with a bypass fixture.
  - Hook tests with a fake `navigator.geolocation` (from Phase 8, or introduced here).
  - Simulated auto-walk through all three walks.
  - Real-device checks: pinch-zoom holds, battery over 1 hour, indoor start.

---

## PHASE 3 — Security and privacy hardening

**Objective:** prepare for public exposure without changing behaviour.

| Item | Finding |
|---|---|
| `next.config.ts`: `poweredByHeader: false`, nosniff, Referrer-Policy, `Permissions-Policy: geolocation=(self)`, `frame-ancestors 'none'` | L-01 |
| CSP in Report-Only mode first (allow the tile host, `/maplibre/`, `worker-src 'self' blob:`, `img-src 'self' data: blob:`), then enforce it after a phone test. Read `node_modules/next/dist/docs/.../content-security-policy.md` first. | L-01 |
| Replace the `allowedDevOrigins` wildcards with exact LAN IPs, or read them from `.env.local` | L-02 |
| Playtest tools: a production build guard or warning; "Clear" removes only `hidden-antwerp:playtest:*` keys; extract `isPlaytestEnabled(env)` and test it | L-04 |
| Harden the scripts: validate the `walk` argument and `localPath`; check `response.ok`; add timeouts and retries; put contact info in the User-Agent; keep metadata when a license is refused; https-only links | L-39, O-07 |
| Privacy notice draft: localStorage contents, OpenFreeMap (IP plus viewport), hosting logs | L-05 |
| **Product decision (not now):** move answer checking to the server and strip answers from the client payload when walks become paid | L-03 |

- **Affected areas:** `next.config.ts`, `PlaytestControls.tsx`, `scripts/*.mjs`, docs.
- **Dependencies:** Phase 0 CI. The hosting choice affects HSTS and header delivery.
- **Regression risk:** Low, except the CSP, which can blank the map if a directive is wrong. That's why it goes to Report-Only first.
- **Validation:** `curl -I` shows the headers. The map works on iOS and Android with the CSP enforced. The playtest gating test passes. The scripts run against a single walk without changes to the output.

---

## PHASE 4 — Architecture and code quality

**Objective:** make walk #4 (or a CMS or database) safe to add, and remove the duplication that makes fixes happen twice.

| Item | Finding |
|---|---|
| Generic `validateWalk(walk)` in `src/lib`, run for every walk × locale in `walk-data.test.ts`. It checks legs and bypass legs, that guide stops have `guide`, that there are no game fields on guide stops, and route endpoints. Add a visible fallback for a guide stop with missing content. | M-16 |
| Shared player shell (`usePlayerShell`, `<StopNavigation>`) used by both players; separate screens remain | L-06 |
| Pure moves and renames: `getOrderedLocations` → `src/lib`; `LedgerPanel` → `RoutePanel`, `GameCopy` → `WalkCopy` (behaviour unchanged) | L-07 |
| Helpers `loadRouteLegs()` / `findCoordinates()` to replace the boilerplate repeated in three walks | L-19 |
| React `cache()` around repository reads; fix or remove the misleading `generateStaticParams` comment | L-17 |
| One distance formatter for walk totals | L-20 |
| Stable keys; `PlayScreen` effect keyed on a screen id, not a translated title | L-21, L-22 |
| Make unused required fields optional; move `the-17-gates.ts` to test fixtures; rename "playtest" wording and the storage key (through the Phase 1 migration hook) | L-18 |
| *(Optional, later)* discriminated union `GuideWalk \| GameWalk` | M-16 |

- **Affected areas:** `src/types`, `src/lib`, `src/features/walk-session`, `src/features/guide`, `src/data/walks/*/index.ts`, `src/app/walks/**`, tests.
- **Dependencies:** Phase 1 (session migration), Phase 2 (navigation settled). Do this before adding a new walk.
- **Regression risk:** Medium for the player shell, which touches the core flow. Low for everything else.
- **Validation:**
  - All player tests pass unchanged.
  - `validateWalk` fails for a deliberately broken fixture.
  - A full simulated auto-walk through all three walks.
  - No visible UI change, confirmed by manual comparison on the three walks.

---

## PHASE 5 — Performance

**Objective:** faster first screen and less data on mobile networks.

| Item | Finding |
|---|---|
| Pre-process the Classics images (resize, denoise, re-encode) in the download script. Add `images` config (`qualities`, `deviceSizes`, `formats: avif/webp`). Check the images visually. | M-14, L-16 |
| Render the session-independent start screen straight away; fill in the Continue/Restart state after reading storage | M-15 |
| Keep one map instance for the whole walk (lift it into the player shell) instead of recreating it per leg | M-08 (step 2) |
| Long cache for a versioned `/maplibre/` path; a visible notice after repeated tile errors | M-08 (step 1) |
| Font preload for `latin` only; the other subsets load on demand | L-15 |
| *(Trade-off, discuss)* Send only the active locale's messages to the client | L-14 |
| **Product decision:** tile provider for production; offline or service worker (L effort, new architecture, must never cache positions) | M-08 (steps 3–4) |

- **Affected areas:** `next.config.ts`, `scripts/download-commons-images.mjs`, `public/images/classics` (re-encoded files; licenses unchanged), `useWalkSession`, the player shell, `WalkingMap`, `layout.tsx`, `src/i18n`.
- **Dependencies:** Phase 4 player shell (for M-15 and M-08 step 2).
- **Regression risk:**
  - Medium for M-15 (hydration) and the persistent map.
  - Low for images and fonts.
  - Re-encoded images need a visual check, and their attribution must stay intact.
- **Validation:**
  - Re-measure after building:
    - Classics images at 1200w (target under 2.5 MB in total);
    - the SSR HTML of the play page shows the start screen;
    - the font preloads.
  - Lighthouse mobile on the home, detail and play pages.
  - The map survives 5 legs without a new style request.
  - Cyrillic still renders in ru and uk.

---

## PHASE 6 — UX and accessibility

**Objective:** make the walk usable with a screen reader, one hand and in sunlight.

| Item | Finding |
|---|---|
| Only announce direction changes, not every GPS update | M-09 |
| Focus management on the navigation, chapter, start and completion screens and after the search-task reveal | M-10 |
| A live region that stays mounted for wrong answers, with the attempt count, `aria-invalid`, and the wrong option marked | M-11 |
| Sticky top close button on the route/ledger sheet | M-13 |
| Contrast of locked ledger entries | L-23 |
| `lang="nl"` on Smekens captions and Dutch source titles (optional `language` field on sources) | L-24 |
| ConfirmDialog focuses Cancel and has a destructive style | L-25 |
| Touch targets: map zoom controls, back link, credit links | L-26 |
| Translated map region label and loader | L-27 |
| Language menu ARIA and close on focus-out | L-28 |
| `break-words hyphens-auto` on headings and buttons; shorter es maneuver labels | L-30 |
| *(M effort, product)* Reopen a completed guide stop read-only | L-29 |
| *(Optional)* Design suggestions (light variant, one-shot tremble animation, sticky "Next" bar, vote focus ring) | O-12 |

- **Affected areas:** `src/features/navigation/components`, `walk-session/components`, `guide/components`, `src/components/ui`, `globals.css`, locales.
- **Dependencies:** Phase 2 (DirectionPanel changes), Phase 4 (renamed `RoutePanel`).
- **Regression risk:** Low.
- **Validation:**
  - RTL tests for focus and live-region behaviour.
  - Manual tests with VoiceOver (iOS) and TalkBack (Android) on a full stop cycle.
  - Screenshots at 390 px in de, ru and es.
  - `@axe-core` checks if Playwright is approved (Phase 8).

---

## PHASE 7 — Internationalization

**Objective:** zero English on translated screens, and checks that prevent it coming back.

| Item | Finding |
|---|---|
| Keys for "Clues", "Ledger", "Discovered clues", "Clue n · locked" in all 8 languages (or a walk-level panel-name field); pass `t` in `GuideCompletionScreen` | M-05 (**could be pulled into Phase 1:** small and user-visible) |
| Make `t` required, or use `useT()` inside client leaf components; keep the English default only in tests | M-05 (root cause) |
| Guard against hard-coded JSX text outside `playtest/` (a lint rule or a test) | M-05 |
| MapLibre control strings via the `locale` option | L-31 |
| `i18n:check`: check plural categories per locale and extra placeholders; check placeholder parity in the content-shape test | L-32 |
| OG locale in `ll_TT` format; shared base OG fields; restore `nofollow` on the play page | L-33 |
| Answer normalization: `ß→ss`; strip thousands separators in number answers (years) | L-35 |
| Document the cookie-cleared flash in `I18N.md` | L-34 |
| *(Optional)* Remove unused English maneuver strings; flags vs. language codes; Accept-Language `q=0`; store neutral default player names | O-04, O-05, O-06, O-02 |
| **Product decision:** SEO and link previews with a cookie-only locale (locale path prefixes would be an architectural change) | L-33 |

- **Affected areas:** `src/i18n/**`, `scripts/check-translations.mjs`, components with `t = englishTranslator`, `answers.ts`, `layout.tsx` metadata, all locale JSON files.
- **Dependencies:** none (the string fix can go first). The answer-normalization change must update the answer tests for all languages.
- **Regression risk:** Low. Making `t` required produces compile errors at every call site, which is intended.
- **Validation:**
  - `npm run i18n:check` with the new checks.
  - A locale smoke test (start screen and one stop per locale, with no raw keys and no English leak).
  - Manual check of the Hidden Pubs header and guide completion in nl, ru and uk.

---

## PHASE 8 — Testing

**Objective:** cover the runtime paths the current 670 tests can't see, and stop tests from breaking when content changes.

| Item | Finding |
|---|---|
| Fake `navigator.geolocation` tests: denied, timeout, low accuracy, cleanup, simulated to real. `useWakeLock` tests. | M-18 |
| `getLocale` with a mocked `next/headers`; `LanguageSelector` and `LocaleSync` with a mocked router | M-18 |
| Extract the pure camera, bounds and bearing logic from `WalkingMap` and unit-test it | M-18 |
| Replace literal content assertions with values derived from data; keep logic tests on the fixture | M-19 |
| Shared `setupFiles` (cleanup, storage, `scrollTo`/`showModal` polyfill, WalkingMap mock), `restoreMocks: true` | (QA-09, QA-10) |
| Storage edge-case table tests; every challenge type rendered; vote tie; guide resume; off-route UI | (QA-06, QA-08) |
| Locale smoke tests for all 8 languages; data tests for image dimensions (L-42), stale routes (L-40), empty hints (L-43), all search tasks (L-44) | (QA-13), L-40, L-42, L-43, L-44 |
| Hidden Pubs distance derived from legs | L-41 |
| **Ask first:** Playwright, run against `next build && next start` (geolocation emulation, denied path, full walks, reload, language flow, map smoke test, axe, privacy assertion) | M-18 |
| **Ask first:** `@vitest/coverage-v8` with thresholds on `logic/` folders only | – |
| **Ask first:** test-tooling upgrade (vitest, vite, plugin-react together) on its own branch | L-38 |

- **Affected areas:** `src/__tests__/**`, `vitest.config.mts`, possibly `e2e/` and CI, small extractions from `WalkingMap`/`PlaytestControls`.
- **Dependencies:** it runs alongside every phase (each fix brings its own regression test). The Playwright parts need approval.
- **Regression risk:** None to production. Extracting logic from `WalkingMap` is a small refactor that gets covered by the new tests.
- **Validation:** CI is green. The suite runtime stays under about 30 s for unit tests. The Playwright suite runs on PRs to `main`.

---

## PHASE 9 — Final production validation

**Objective:** a go/no-go decision based on evidence.

1. **Blockers closed:**
   - H-01, H-02, M-01, M-02, M-03, M-04 and M-05 closed;
   - H-03 rights cleared or the drawings replaced;
   - content marked other than `placeholder` only after a historian's review.
2. **Configuration:**
   - hosting chosen;
   - production env has no `NEXT_PUBLIC_PLAYTEST_TOOLS`;
   - `robots` noindex removed only on purpose;
   - headers and CSP enforced;
   - tile provider decided.
3. **Field test** on iOS Safari and Android Chrome over HTTPS, with real groups, covering every walk:
   - the real-device list in AUDIT.md (Maps/GPS section);
   - private browsing, then a language switch;
   - sunlight;
   - one-handed use;
   - closed-café fallbacks;
   - every `on-site-verification-required` answer.
4. **Measurements:**
   - Lighthouse mobile;
   - battery drain over a 2-hour walk;
   - data use per walk;
   - privacy assertion: no coordinates in any storage or request (except tile indexes).
5. **Docs:** update `CLAUDE.md` and `I18N.md` to match the new reality; privacy notice published.
6. **Re-run this audit** (or a lighter version) and compare the finding counts.

---

## Decisions needed from the product owner

| # | Decision | Blocks |
|---|---|---|
| 1 | Reveal/skip rule for game challenges, and whether a skipped challenge still awards its clue | H-02 (Phase 1b) |
| 2 | Keep (merge) or reset in-progress sessions when walk content changes | M-04 |
| 3 | Production tile provider (self-host OpenFreeMap or paid) and whether offline support is in scope | M-08 |
| 4 | Server-side answer checking and stripping content from the client, when payments or prizes come | L-03 |
| 5 | SEO and link-preview strategy with a cookie-only locale (English-only vs. locale path prefixes) | L-33 |
| 6 | Hosting target (e.g. Vercel vs. self-hosted) and per-environment playtest-tools policy | M-17, L-04, L-01 |
| 7 | Smekens drawings: clear the rights, or use replacement images | H-03 |
| 8 | Whether the "Ledger" panel name is Hidden Pubs branding (walk copy) or a generic game concept | M-05 |
| 9 | New dev dependencies: Playwright, a coverage tool | Phase 8 |

## Suggested sequencing at a glance

```
Phase 0 ──► Phase 1a ─► Phase 1c ─► Phase 2 ─► Phase 4 ─► Phase 5
              │            │                      │
              └► (decision) Phase 1b              └► Phase 6
Phase 7 (M-05 strings can ride along with Phase 1)
Phase 3 any time after Phase 0, before launch
Phase 8 continuous; Playwright after approval
Phase 9 last
```
