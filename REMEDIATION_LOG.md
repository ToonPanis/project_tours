# Hidden Antwerp — Remediation Log

Tracks each finding from `AUDIT.md` as it is worked on (plan: `IMPROVEMENT_PLAN.md`). Kept short and without code diffs; `git diff` has the details.

Status values: `VERIFIED FIXED` · `PARTIALLY FIXED` · `BLOCKED` · `NOT REPRODUCIBLE` · `ALREADY RESOLVED`

---

## Phase 0 — Baseline & safety net (2026-09-29)

- **Branch:** `fix/phase-0-baseline`, uncommitted, awaiting approval.
- **Baseline:** local tag `audit-baseline-2026-09-29` on `1ce3a6c`.

### Validation gate (final run)

| Command | Result |
|---|---|
| `npm run typecheck` | ✅ exit 0 |
| `npm run lint` | ✅ exit 0 |
| `npm run i18n:check` | ✅ all languages complete |
| `npm run test:run` | ✅ 23 files, **675 tests** (was 670, +5 new) |
| `npm run build` | ✅ compiled; 11/11 pages; worker copied |

### M-17: No CI
- **Status:** PARTIALLY FIXED. The workflow exists but has not run on GitHub yet, and branch protection is a manual setting.
- **Root cause:** there was no CI configuration, so the checks depended on the developer running them.
- **Files:** `.github/workflows/ci.yml` (new)
- **What it does:** runs on push to `main` and on pull requests. Steps: `npm ci` (its postinstall copies the MapLibre worker), then typecheck, lint, i18n:check, test:run, build.
  - `permissions: contents: read`; uses `pull_request`, not `pull_request_target`.
  - No secrets, no third-party actions, 20-minute timeout.
  - A newer push cancels a running check only on pull requests.
  - `NEXT_PUBLIC_PLAYTEST_TOOLS` is not set, so CI builds what production would build.
- **Tests:** n/a. The YAML was validated with js-yaml, and every script it calls was run locally.
- **Reviewer:** approved (checkout@v5 / setup-node@v5 confirmed as real major versions; security OK).
- **QA:** passed (YAML parses, step order correct, all scripts exist).
- **Remaining limitations:**
  - It has not run on GitHub yet; it will on the first push or PR.
  - Branch protection must be enabled by hand in GitHub.
  - `npm run build` needs network access for Google Fonts, noted in the workflow.
  - Optional: pin actions to commit SHAs and add Dependabot for actions.

### L-36: Node version not pinned
- **Status:** PARTIALLY FIXED
- **Root cause:** no `engines` field and no `.nvmrc`; the local Node 20 is end-of-life.
- **Files:** `.nvmrc` (new, `22`); `package.json` (`engines.node: ">=20.9.0"`, which is Next 16's own minimum, so local Node 20.18 still works).
- **Tests:** n/a
- **Reviewer / QA:** OK. Both note that CI (22) and local (20.18) now differ.
- **Remaining limitations:**
  - **User action:** upgrade local Node to 22 so local and CI match.
  - **Needs approval (dependency change):** bump `@types/node` to 22.
  - **Not done on purpose:** `package-lock.json`'s root entry doesn't include `engines` yet, so the next `npm install` will add it. This doesn't affect `npm ci`. Syncing it needs `npm install --package-lock-only`, which is a dependency command I left to the user.

### L-37: Worker copy script had no error message
- **Status:** VERIFIED FIXED
- **Root cause:** bare `copyFile` gave an unexplained `ENOENT`. A missing second file could leave a half-copied worker behind.
- **Files:**
  - `scripts/lib/maplibre-worker.mjs` (new): `copyMaplibreWorker`, `WORKER_FILES`, `MissingWorkerFileError`.
  - `scripts/copy-maplibre-worker.mjs`: now a thin command that always runs. It prints a friendly message for a missing file and the full error otherwise, and exits with code 1 on failure.
- **Tests added:** 5 tests in `src/__tests__/map-worker.test.ts`:
  - the copy succeeds;
  - a clear message when files are missing;
  - a partial source copies nothing;
  - the real command started through a junction/symlink copies the worker (exit 0);
  - the real command fails loudly (exit 1 plus message).
  - The two command tests were confirmed to **fail against the first (guarded) version** and pass now.
- **Reviewer:**
  - First pass, REQUEST CHANGES. MAJOR: the first version's "only run when executed directly" guard silently skipped the copy when the repo was reached through a symlink or junction, which is a regression. Also: the CI cancel setting, error output, a font comment, and a command test.
  - All addressed. Second pass: **APPROVE**. The final minor items (a spawn timeout, the error `name`) were applied.
- **QA:**
  - Found the same MAJOR independently and reproduced it with `npm run predev` through a junction. Found the half-copy on a partial source (MINOR). Both fixed.
  - Passed:
    - every normal way of starting the command (relative, absolute, mixed-case `desktop`/`Desktop`, lowercase drive, 8.3 short names, `npm run predev`/`prebuild`);
    - failure paths in folders with spaces, `#`, `%20`, Unicode and brackets;
    - no side effects on import;
    - temp folders cleaned up.
- **Remaining limitations:** none known.

### L-44 (documentation part) and O-09 (README, scripts)
- **Status:** VERIFIED FIXED (docs and scripts only). The test part of L-44 (covering all search tasks) remains for Phase 8.
- **Root cause:** the docs had drifted from the code.
- **Files:**
  - `CLAUDE.md`:
    - 3 search tasks (Gildekamersstraat, Academie garden, Adriaan Brouwerstraat);
    - coordinate status is `verified`/`to-verify`, and all 61 are currently `to-verify`;
    - the Node/CI note;
    - the new commands.
  - `README.md`: the current status (three walks, 8 languages) instead of "The 17 Gates"; the new commands; Node and CI notes.
  - `package.json`: `test:run`, `typecheck`.
- **Reviewer:** the claims were checked against the code (3 `searchTask`s; 35 + 8 + 18 = 61 coordinates, all `to-verify`; 672 tests at the time).
- **QA:** the new script names were run.
- **Remaining limitations:**
  - The optional parts of O-09 are still open: `noUncheckedIndexedAccess`, `.gitattributes`.

### Supporting documents created
- `FIELD_TEST_CHECKLIST.md`: every item that needs a visit to Antwerp or a real phone:
  - pins and arrival points;
  - placeholder answers;
  - café outdoor fallbacks;
  - Poortjes access;
  - device scenarios.

  Each item has its current assumption, the evidence needed and the finding it blocks. All are `OPEN`.
- `REMEDIATION_LOG.md`: this file.

---

## Phase 1 — Core reliability (2026-09-29)

- **Branch:** `fix/phase-1-core-reliability`, branched from `fix/phase-0-baseline` (`e9e7f02`). Uncommitted, awaiting approval.
- **Scope:**
  - 1a navigation dead ends;
  - 1c session and error recovery;
  - 1b (H-02) is **blocked** on a product decision.

### Validation gate (final run)

| Command | Result |
|---|---|
| `npm run typecheck` | ✅ |
| `npm run lint` | ✅ 0 problems |
| `npm run i18n:check` | ✅ all 8 languages complete |
| `npm run test:run` | ✅ 25 files, **709 tests** (was 675, +34) |
| `npm run build` | ✅ |

### H-01: No manual arrival with good GPS
- **Status:** VERIFIED FIXED (in code). A field test is still needed (FIELD_TEST_CHECKLIST E2, E3).
- **Root cause:** `showManualArrival` depended on a GPS problem, so good but wrong GPS (or an unreachable pin) left no way forward. The button was also hidden before the first reading.
- **Fix** (`NavigationScreen.tsx`, `config.ts`):
  - "I'm here" is always rendered: an outline button while GPS is fine, primary with manual mode, a GPS problem or no coordinates.
  - With a good fix more than `MANUAL_ARRIVAL_CONFIRM_METERS` (150 m) from the pin, it asks for confirmation first (`gps.confirmArrival.*`, 8 languages). The distance shown is frozen when the question opens.
  - Automatic arrival is unchanged, and the reducer's `ARRIVE` guard prevents a double advance.
- **Tests:**
  - "I'm here" works just outside the radius with good GPS;
  - it is offered before the first reading, using a fake `navigator.geolocation`;
  - far away it asks, and both confirm and cancel work;
  - with weak GPS it doesn't ask.
  - The original two tests were confirmed to **fail on the old code**.
- **Reviewer:** approved; the far-away confirmation and frozen distance were its suggestions.
- **QA:** the button is present in every GPS status and absent only on the intro screen, as intended. A second tap after automatic arrival is harmless: the reducer returns the same state.
- **Remaining limitations:** the 150 m threshold is a first guess; tune it in playtests.

### M-12: Navigation screen height could push "I'm here" off small screens
- **Status:** VERIFIED FIXED (in code). A device check is still needed (FIELD_TEST_CHECKLIST E12).
- **Root cause:** a fixed `h-[calc(100dvh-9.5rem)]` assumed the headers never wrap.
- **Fix:**
  - `min-h` instead of `h`;
  - the map area gets `min-h-48 flex-1`, with the map in an `absolute inset-0` layer so it has a definite height;
  - the bottom bar is `sticky bottom-0`.
- **Tests:** none; jsdom has no layout. The reviewer checked that no ancestor has `overflow`, so `sticky` works.
- **Remaining limitations:**
  - At 200% zoom the sticky bar can cover much of the map (a11y reviewer, MINOR). Deferred to Phase 6.
  - The playtest panel overlaps the bar (playtest only).

### M-01: Route ends outside the arrival radius
- **Status:** PARTIALLY FIXED
  - **Guard added:** a test now checks every walk.
  - **Pins not moved:** FIELD VERIFICATION REQUIRED (FIELD_TEST_CHECKLIST A1–A5).
- **Root cause:** the pins are building centroids, and OSRM snaps the route to the nearest walkable path. Classics had no endpoint test at all.
- **Fix:** a generic test for **all walks** (`navigation-data.test.ts`): every route must end within 30 m of its stop's pin. Known exceptions are listed with their measured distance as a ceiling:
  - sint-jacob 49 m, kathedraal 42 m, classics-cathedral 42 m, rosier 42 m;
  - six stops between 31 and 35 m.

  A companion test flags list entries that are no longer needed. H-01 removes the dead end in the meantime.
- **Reviewer:** OK (test-only stop ids are acceptable).

### M-02: No error page
- **Status:** VERIFIED FIXED
- **Root cause:** there was no `error.tsx` or `global-error.tsx`, so crashes showed Next's generic English page with no recovery.
- **Fix:**
  - `src/app/walks/[slug]/play/error.tsx`, translated:
    - "Try again" does a full reload, because a failed map import stays cached until the page reloads;
    - "All walks";
    - a quiet "Start this walk again" behind a confirmation, which clears only this walk's save;
    - it moves focus to its heading.
  - `src/app/global-error.tsx`: own `<html>`/`<body>`; the locale comes from the cookie through `useSyncExternalStore` (English on the server), so hydration can't mismatch; neutral `errors.globalError` text.
  - `src/lib/reload-page.ts`, which tests can mock.
  - `src/lib/log-error.ts`: production logs only the name and digest, so no message (which could contain a position) ends up in logs.
  - New keys in 8 languages; es/fr/it use the same word for "walk" as the rest of their files.
- **Tests:** `play-error.test.tsx` checks that the page explains the problem and retries, that "Try again" keeps the save, that "Start again" asks first and deletes only this walk's key (other walks and the locale stay), and that it shows in Ukrainian.
- **Reviewer, i18n/a11y/privacy reviewer and QA:** approved after the minor fixes (button order, neutral global text, "normally saved", logging).
- **Remaining limitations:**
  - The error page uses the default theme colours.
  - `global-error` uses system fonts. Both are accepted and documented in the code.

### M-03: A language switch could lose the game when storage is unavailable
- **Status:** VERIFIED FIXED
- **Root cause:** the load effect depended on the `walk` object. `router.refresh()` delivers a new object, so the game was reloaded from storage, which returns `null` when storage is blocked.
- **Fix** (`useWalkSession.ts`):
  - It loads once per walk slug and store.
  - For the same walk in new data, the game in memory is kept only if it still passes `parseSavedSession` for that data; otherwise it falls back to the saved copy.
  - The hook never returns another walk's session, not even for one render.
- **Tests:** `use-walk-session.test.tsx` checks that:
  - the game is kept when storage is unavailable;
  - it is kept with working storage;
  - storage isn't read again on a language switch;
  - a game that no longer fits the walk is not kept;
  - no other walk's game is ever returned;
  - a different walk loads its own save.
  - The first and third were confirmed to **fail on the old code**.
- **Reviewer:** the stale game after a stop-id change is fixed. Re-review: APPROVE.
- **QA:** found a one-render crash on a guide-to-guide walk swap. It existed before this change and is probably unreachable, but it is now fixed. A language switch inside `WalkPlayer`, also with storage throwing, stays on the same screen.

### M-04: Saved sessions
- **Status:** PARTIALLY FIXED
  - **Validation part:** VERIFIED FIXED.
  - **Merge vs. reset when walk content changes:** `BLOCKED — PRODUCT OWNER DECISION REQUIRED` (IMPROVEMENT_PLAN decision #2).
- **Root cause:** `parseSavedSession` checked only the outer shape, so a damaged value reached the reducer and the screens.
- **Fix:** it now validates every stop's progress fields (status, votes, flags, counts, bonus status), the finale (which must be present exactly when the walk has one), the players, the team name, the session id and `completedAt`. Extra or unknown fields are still accepted, which keeps saves forward-compatible.
- **Tests:** a real mid-game save is accepted (also after a JSON round trip), and 16 damaged variants are rejected. 14 of those variants were **accepted by the old parser**.
- **QA:** **every** state from full playthroughs was accepted, with a JSON round trip after each step:
  - Hidden Pubs (3 players; votes, ties, skips, wrong answers, hints, bonus, finale, completion);
  - Poortjes with all detours taken, and with all skipped;
  - Classics.

  So no legitimate progress is rejected.
- **Remaining limitations:** a content change mid-walk still resets that walk's progress, pending the decision.

### H-02: Game challenges can dead-end
- **Status:** `BLOCKED — PRODUCT OWNER DECISION REQUIRED` (see the Phase 1 report). The on-site parts are FIELD VERIFICATION REQUIRED (FIELD_TEST_CHECKLIST B1–B4, C1–C4).
