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
- **Status:** VERIFIED FIXED in code (decision: **option A, N = 3**).
  - The on-site parts remain FIELD VERIFICATION REQUIRED: the placeholder answers and the café outdoor fallbacks (FIELD_TEST_CHECKLIST B1–B4, C1–C4).
- **Root cause:** solving was the only way forward. Hints never reveal the answer, and the "show answer" button existed only in the playtest tools.
- **Fix:**
  - `logic/reveal-answer.ts`: `REVEAL_ANSWER_AFTER_WRONG_ATTEMPTS = 3`, `canRevealAnswer`, `getRevealContent`, `getAnswerText`.
  - A new `REVEAL_ANSWER` action: the reducer solves the stop, still **awards its clue** (so the finale stays solvable), and sets `LocationProgress.answerRevealed`.
  - `ChallengeScreen`, after 3 wrong answers:
    - it shows an offer (announced to screen readers) and "Show the answer";
    - the answer box shows the answer line for multiple choice and numbers, and the **translated explanation**, because typed-answer lists are shared across languages;
    - focus moves to the answer;
    - the form and the hint button are hidden;
    - "Continue" goes on.
  - `SolvedScreen` skips its "Correct" step after a reveal.
  - Nothing mentions reveals on the completion screen.
  - Texts in 8 languages (`game.challenge.revealOffer/revealAnswer/answerIs`).
- **Also fixed (QA, existed before):** an empty multiple-choice answer counted as option A.
- **Tests:**
  - `reveal-answer.test.ts`:
    - answer text per challenge type;
    - translated content;
    - every typed challenge × 8 languages has an explanation;
    - reveal rules.
  - Reducer:
    - no reveal before 3 attempts;
    - a reveal solves the stop and awards the clue;
    - a stale reveal is ignored;
    - an empty multiple-choice answer.
  - Player: De Kat, 3 wrong → show → the answer and explanation, form hidden → Continue → history, not "Correct"; saved `answerRevealed`.
- **Reviewer:** approved with changes. MAJOR "Correct after a reveal" and "answer not translated" are both fixed.
- **QA:**
  - Revealing **every** challenge still collects all 8 clues and completes the finale.
  - A reveal is ignored during the bonus question, the finale, after completion, and on double taps.
  - The translation MAJOR was found independently and is now fixed.
- **i18n/a11y reviewer:** the translation MAJOR is fixed; screen-reader announcement, focus and the Dutch wording are done.
- **Remaining limitations:**
  - The finale questions have no reveal of their own. Each finale answer is printed on a collected clue, so it is reachable, but the owner may want the same rule there later.

### H-02 follow-up: the final puzzle gets the same reveal (owner request)
- **Status:** VERIFIED FIXED
- **Fix:**
  - `REVEAL_FINALE_ANSWER` is allowed after 3 wrong answers on that question, using the same rule (`canRevealFinaleAnswer`).
  - The answer shown is the translated value of the clue the answer is written on. This uses the new optional, data-driven `Challenge.answerClueId`; the finale links time, horse and barrel. It is read from the walk's clue definitions, so it is translated even if the clue was missed.
  - A shared `components/RevealAnswer.tsx` is now used by `ChallengeScreen` and `FinaleScreen`.
  - The session format is unchanged, so no migration is needed.
- **Tests:**
  - reducer: reveal ignored until 3 wrong answers; revealing all 3 questions completes the walk;
  - data, all 8 languages: every finale question's linked clue exists, and its value really is an accepted answer;
  - player: 3 wrong answers → the translated clue value is shown, the form and the clue toggle are hidden → the next question.
- **Review + QA:** approved. Ignored cases were verified: finale locked, too early, unknown or solved question, double tap, after completion, separate counters per question. The minor points (translated fallback, id consistency) are fixed.

### M-04 (merge part)
- **Status:** VERIFIED FIXED (decision: **merge**).
- **Fix:**
  - `STORAGE_VERSION` is now 3, with `migrateToCurrent`: version 2 saves gain `answerRevealed: false`. **Groups mid-walk keep their game.**
  - Storage keeps the migration and field validation (`isWellFormedSession`) and then calls the game rule in `logic/reconcile-session.ts`:
    - new stops are added as locked;
    - removed stops, and the clues they gave, are dropped;
    - the finale is added or removed to match the walk (a completed game gets none);
    - reset only if the current stop was removed;
    - it returns the same object when nothing changed.
  - `useWalkSession` runs the same reconcile on in-memory state.
  - `createFinaleProgress()` is shared.
- **Tests:**
  - migration: a v2 save loads; v1 gives a fresh start;
  - merge: a new stop; a removed stop and its clue; a removed current stop; a finale gained; a completed game gets no finale; the same object when unchanged; the hook keeps the game in memory after a stop is added;
  - a stop inserted before the current one: the walk still completes.
- **Reviewer (architecture):** moving the merge from storage into logic is done.
- **QA:**
  - A real v2 save resumes at the same stop and screen.
  - Every merge variant plays on to completion.
  - Guide walks are unaffected (deep-equal).
- **Accepted limitation (owner decision "merge"):** the walk only moves forward, so a stop inserted *before* the group's current stop is not visited on that play-through. The completion stats then show one stop fewer than the total.

### Phase 1 final validation gate

| Command | Result |
|---|---|
| `npm run typecheck` | ✅ |
| `npm run lint` | ✅ 0 problems |
| `npm run i18n:check` | ✅ |
| `npm run test:run` | ✅ 26 files, **755 tests** (incl. finale reveal) |
| `npm run build` | ✅ |

---

## Phase 2 — GPS & navigation reliability (2026-09-29)

- **Branch:** `fix/phase-2-navigation`, branched from `a78fda6`. Uncommitted, awaiting approval.
- **Principle:** GPS is treated as noisy and unreliable. Positions stay in memory only; at most two readings are held (the one in use plus one unconfirmed jump).

### Validation gate

| Command | Result |
|---|---|
| `npm run typecheck` | ✅ |
| `npm run lint` | ✅ 0 problems |
| `npm run i18n:check` | ✅ all 8 languages |
| `npm run test:run` | ✅ 28 files, **790 tests** (was 755, +35) |
| `npm run build` | ✅ |

### M-07 + L-10: One bad reading moved everything; cached readings counted twice
- **Status:** VERIFIED FIXED (in code). Field verification is required (FIELD_TEST_CHECKLIST E1, E3, E15, E16, E18).
- **Root cause:** every reading was used as it came in. Only arrival and off-route counted consecutive readings, and the timestamp was ignored.
- **Fix** (`logic/tracking.ts`, pure; thresholds in `config.ts`):
  - exact repeated readings are ignored;
  - readings worse than 150 m are not used for position, but still show "GPS weak";
  - a jump faster than 10 m/s is held back until a second, **different** reading confirms it, unless it is a precise reading (≤ 35 m) replacing an imprecise position (> 35 m);
  - repeated or stepped-back timestamps with new coordinates are still used;
  - "far from route" needs 2 readings;
  - an accuracy circle on the map.
  - The playtest simulation uses strictly increasing timestamps, and its teleports send two readings.
- **Tests:** 10 new logic tests, among them:
  - a cached duplicate doesn't count twice;
  - a single 300 m jump is held back;
  - a real move is accepted after confirmation;
  - a slow long move is not a jump;
  - far-from-route needs 2 readings;
  - frozen or stepped-back timestamps;
  - a cached jump can't confirm itself;
  - alternating network/GPS (5/5 GPS readings used).
  - The first 7 were confirmed to **fail on the old code**.
- **Reviewer:** MAJOR 1 (a cached jump confirmed itself) and MAJOR 2 (a bad fix stuck while readings alternated) are fixed.
- **QA:**
  - 59 legs × 20 noisy walks over all 3 walks: every stop whose pin is within 30 m of the route end arrived 20/20.
  - 0 of 251,637 normal walking readings were rejected.
  - Auto-walk and teleports work.
  - M1 and M3 are fixed. On re-check, the cell/GPS mix keeps the GPS position on 19 of 20 ticks; frozen and stepped-back timestamps keep the dot moving; a cached jump no longer confirms itself.
  - Two readings with the same time count as one arrival confirmation (test added).
  - Accepted trade-offs, both on the field list (E16):
    - a precise-looking outlier can replace an already weak (> 35 m) fix at once; it is corrected after 2 good readings, and it cannot trigger arrival;
    - a late, older reading can replace a newer one.

### M-06: Camera fights the user and re-animates on every reading
- **Status:** VERIFIED FIXED (logic). Needs a device check for battery and feel (E9, E10).
- **Fix** (`WalkingMap.tsx`, `logic/camera.ts`):
  - follow mode ends on any user pan, zoom, rotate or pitch;
  - the camera moves only for ≥ 4 m, ≥ 10°, or a mode change (overview, north-up, follow-direction), and resets when there's no position;
  - 500 ms animation, 0 ms with `prefers-reduced-motion` (also covers O-03 for the map).
- **Tests:** `camera-and-geo.test.ts` (throttle, wrap-around, mode change, geo helpers). In jsdom the map itself is mocked.

### M-20: No direction when heading straight to the destination
- **Status:** VERIFIED FIXED (in code). Field check: E17.
- **Fix:** "Head to X" shows "Direction: north-east" (8 languages, with hysteresis so the word doesn't flicker) and an arrow. The arrow points relative to the walking direction when the phone reports a heading while moving, otherwise on the north-up map (`logic/compass.ts`, `lib/geo.ts` `bearingInDegrees`).
- **Tests:** compass points, heading only trusted while moving, arrow rotation, the panel showing the direction for the first stop, hysteresis.
- **Remaining limitation (MINOR):** after the walker rotates the map by hand, the arrow without a heading still assumes north-up. The text direction stays correct.

### L-06: Game player route lookup
- **Status:** VERIFIED FIXED. `WalkPlayer` uses `getRouteLegToCurrent` and `getRouteLeg(current, next)`, the same as the guide player.
  - Hidden Pubs has no optional stops, so its behaviour is unchanged (reviewer).
  - QA verified the bypass lookup with a synthetic game walk.

### L-11, L-12, L-13: GPS status, retry, wake lock
- **Status:** VERIFIED FIXED
- **Fix:**
  - A browser TIMEOUT gives a new `"searching"` status: "Still looking for your position…". It counts as a GPS problem only while there is no fix.
  - `permissionHelp` also mentions the phone's own location setting (8 languages).
  - "Try again" restarts the watch through `restartKey` (no untracked timer), and the status resets in the cleanup.
  - At most one wake lock is held.
- **Tests:** a fake `navigator.geolocation` covers:
  - a timeout showing "still looking";
  - a timeout after a fix still asking before a far-away "I'm here";
  - retry restarting the watch and clearing the old message.

  A fake wake-lock API checks there is no second lock and that the lock is released.

### Deferred
- **L-08:** very short legs. FIELD VERIFICATION REQUIRED (A6, A7).
- **L-09:** route-progress continuity and a u-turn hint. Medium effort, planned later.
- **Simulation vs real device clock:** playtest-only.

---

## Phase 3 — Security & privacy hardening (2026-09-29)

- **Branch:** `fix/phase-3-security`, branched from `a0dabaa`. Uncommitted, awaiting approval.
- **Principle:** conservative. The CSP is report-only, and nothing new is tracked, stored or sent.

### Validation gate

| Command | Result |
|---|---|
| `npm run typecheck` | ✅ |
| `npm run lint` | ✅ 0 problems |
| `npm run i18n:check` | ✅ |
| `npm run test:run` | ✅ 29 files, **813 tests** (was 790, +23) |
| `npm run build` | ✅ |
| Production server check | ✅ Headers present on HTML, `/maplibre/*.mjs` (still `application/javascript`), images, `_next/*` and 404. No `X-Powered-By`. The map style and tiles come only from `tiles.openfreemap.org`, and all `<img>` are same-origin. |

### L-01: Security headers
- **Status:** VERIFIED FIXED (the CSP is report-only by design; enforcing it needs a phone check).
- **Fix** (`src/lib/security-headers.ts`, `next.config.ts` `headers()`):
  - `X-Content-Type-Options: nosniff`;
  - `Referrer-Policy: strict-origin-when-cross-origin`;
  - `Permissions-Policy: geolocation=(self), camera=(), microphone=(), payment=()`;
  - `X-Frame-Options: DENY`;
  - `poweredByHeader: false`;
  - **`Content-Security-Policy-Report-Only`**, which allows the self-served worker, `blob:` workers and images, and the map host (derived from `MAP_STYLE_URL`). A relative or invalid style URL never breaks the build.
  - No `upgrade-insecure-requests` or `report-to` yet (reasons in the code). HSTS comes from the host.
- **To enforce later:** run a production build on iOS Safari and Android Chrome and check the console for "[Report Only]" violations, then rename the header key to `Content-Security-Policy`.

### L-02: Dev-server origins
- **Status:** VERIFIED FIXED
- **Fix:** instead of wildcards, the exact host names come from `DEV_ALLOWED_ORIGINS`. Scheme and port are stripped, IPv6 addresses are bracketed, and wildcards are refused. Documented in `.env.example`, CLAUDE.md and README.
- **Workflow change for the developer:** to open the dev server from a phone, set `DEV_ALLOWED_ORIGINS=<your LAN IP>` in `.env.local`.

### L-04: Playtest tools in production
- **Status:** VERIFIED FIXED
- **Fix:**
  - `isPlaytestEnabled(env)` is a tested pure function; the literal `process.env` reads are kept, so Next still inlines the variable.
  - The build prints a warning when `NEXT_PUBLIC_PLAYTEST_TOOLS=true` in production.
  - "Clear saved walks" (formerly "Clear localStorage") removes only `hidden-antwerp:playtest:*`, never the language choice, and is safe when storage is blocked.

### L-05: Privacy notice
- **Status:** PARTIALLY FIXED. `PRIVACY_NOTICE_DRAFT.md` is written from the code, with code references.
  - PRODUCT/LEGAL DECISION REQUIRED: legal review, hosting provider, contact address, translations, publication.
- **Reviewer:** MAJOR fixed. The language cookie *is* sent to the website, and the draft now says so.

### L-39 / SEC-07 / O-07: Data scripts
- **Status:** VERIFIED FIXED
- **Fix** (`scripts/lib/script-utils.mjs` plus both scripts):
  - the walk-folder argument is validated;
  - image files can only be written inside `public/images/`;
  - timeouts, and retries for 429, 5xx and network errors (Retry-After honoured, 15 s steps after a rate limit, unread bodies released);
  - a clear error for missing coordinates, raised before any request;
  - a refused license keeps the previous metadata and exits with code 1;
  - a User-Agent with contact info;
  - https for known hosts (links with an explicit port are left alone).
  - `images.json`: two CC0 `licenseUrl` links changed to https. The attribution (`credit`) is untouched.
- **QA:** both scripts were run in a scratch copy with a stubbed fetch: a null coordinate stops before any request; a 503 is retried; a first run works; a refused license gives exit code 1. Every path-traversal trick is refused.

### Not in scope
- **L-03** (answers are in the client payload; server-side answer checking): PRODUCT OWNER DECISION REQUIRED, tied to payments or prizes.

---

## Phase 4 — Architecture & code quality (2026-09-29)

- **Branch:** `fix/phase-4-architecture`, branched from `46f96f1`. Uncommitted, awaiting approval.
- **Process:** the Architecture Guardian reviewed the plan **before** implementation and **amended** it:
  - a narrower player shell;
  - the storage-key rename deferred;
  - the discriminated-union rewrite dropped.

  That plan was followed.
- **Constraint:** no change to the saved-game format or the reducer actions. Player tests pass without assertion changes, except the reworded restart label.

### Validation gate

| Command | Result |
|---|---|
| `npm run typecheck` | ✅ |
| `npm run lint` | ✅ 0 problems |
| `npm run i18n:check` | ✅ |
| `npm run test:run` | ✅ 33 files, **872 tests** (was 813, +59) |
| `npm run build` | ✅ All routes still dynamic (`ƒ`). The build now prepares 5 internal pages instead of 11, because the no-op `generateStaticParams` was removed. |

### L-06: Duplicated player orchestration
- **Status:** VERIFIED FIXED
- **Fix:**
  - `logic/current-stop.ts` `getCurrentStop()` (pure, tested): the current stop, the next stop, progress, the route to the current stop (bypass-aware) and the **exact** route to the next stop.
  - `state/usePlayerShell.ts`: the session plus the route panel, GPS flag, navigation reset and `restartBase()`.
  - `components/StopNavigation.tsx`: the same key as before.
  - `getPlaytestNavigation()`.
  - Each player keeps its own flow and local state: game phases, tie animation, chapter cards, detours.
- **Tests:** `player-shell.test.tsx`:
  - the exact next leg;
  - after skipping a detour, the route comes from the bypass.

### L-07: Coupling and naming
- **Status:** VERIFIED FIXED (pure moves and renames; `git mv` keeps history; all imports updated, no re-exports):
  - `walk-session/logic/route.ts` → `src/lib/walk-locations.ts`;
  - `LedgerPanel` → `RoutePanel` (`onOpenLedger` → `onOpenRoute`);
  - `GameCopy`/`game-copy.ts` → `WalkCopy`/`walk-copy.ts`.
  - The i18n keys and the visible "Ledger" text are unchanged.

### M-16: Walk model and structural checks
- **Status:** VERIFIED FIXED
- **Fix:**
  - `src/lib/validate-walk.ts`, run in tests for every walk × language. It checks:
    - unique stop ids;
    - guide stops have content and no game fields;
    - a route for every consecutive pair, plus a bypass around each optional stop;
    - references (clues, chapters, required and answer clues).
  - A guide stop without content shows a translated "continue" fallback: never a blank page or dead end.
  - The discriminated-union rewrite was dropped (Guardian).
- **Tests:**
  - `validate-walk.test.ts`: the real walks are valid, and 6 deliberately broken cases are each caught;
  - `walk-data.test.ts`: all 24 walk × language combinations pass;
  - `player-shell.test.tsx`: the fallback moves on.

### L-17: Double reads, misleading comment
- **Status:** VERIFIED FIXED
- **Fix:** `getWalk = cache(...)` in `src/lib/repositories/index.ts`, shared by `generateMetadata` and the page (the Next.js docs pattern). The no-op `generateStaticParams` was removed, with a comment explaining why pages are rendered per request.

### L-18: Unused fields, fixture location, playtest wording
- **Status:** VERIFIED FIXED (storage-key rename DEFERRED by the Guardian)
- **Fix:**
  - `unlockCondition` and `nearbyPlaces` are optional; the data is kept.
  - The fixture moved to `src/__tests__/fixtures/the-17-gates.ts`.
  - "Restart playtest" → "Start again", and "Restart the playtest?" → "Start the adventure again?", in all 8 languages (key `game.start.startAgain`).
  - A comment on the historical storage key: never rename it without a migration.
  - The privacy draft wording was aligned.

### L-19: Repeated walk-assembly code
- **Status:** VERIFIED FIXED
- **Fix:** `src/data/walks/shared.ts` (`findPosition`, `loadRouteLegs`) is used by all 3 walks.
- **Evidence:** every built walk in all 8 languages is **byte-identical** before and after (4.2 MB JSON compared).

### L-20: Two distance formatters
- **Status:** VERIFIED FIXED
- **Fix:** walk totals on the guide start and completion screens use `formatDistance`, like the cards and detail page. The output is the same for today's walks.

### L-21: A language switch scrolled to the top
- **Status:** VERIFIED FIXED
- **Fix:** `PlayScreen` has an optional `screenId` (falls back to the title), set on all in-walk screens from data ids.
- **Tests:** `play-screen.test.tsx`: a language switch doesn't scroll, a new screen does.
- **Intended difference:** switching language no longer jumps to the top or refocuses the heading.

### L-22: Text used as list keys
- **Status:** VERIFIED FIXED by a guard, not by changing keys. These lists have no ids, and the Guardian forbade index keys.
- **Fix:** `unique-list-texts.test.ts` checks that every list of texts in every walk × language has unique entries, so text keys can never collide. There are no duplicates today.

### Reviews
- **Architecture Guardian:** approved the amended plan beforehand, and in the final check.
  - The implementation matches the plan.
  - Coupling is clean: nothing in `src/lib`, `src/data` or `src/types` imports from features or the app.
  - No unnecessary abstraction; the L-22 guard is accepted.
  - Two comment wordings fixed.
- **Code reviewer:** APPROVE. It verified that every prop is passed identically, restart behaves as before, `cache()` is used correctly, and removing `generateStaticParams` has no side effects (unknown slugs still 404).
- **QA:** no regressions across 9 scenarios, with 25 probe tests:
  - all 3 walks end to end through the UI;
  - Poortjes: after skipping the detour, the **bypass** is shown (595 m vs 687 m);
  - the chapter card after a restart;
  - reset navigation;
  - a language switch mid-navigation in all 3 walks (same stop, GPS kept, no scroll);
  - the tie animation plays once;
  - the route panel and restart;
  - old v2 and v3 saves continue in all 3 walks;
  - the guide fallback.
- **Minors fixed afterwards:**
  - the game completion screen gets a `screenId` (no scroll on a language switch);
  - the guide fallback reuses `PlayScreen` (scrolls to the top and focuses its title).

### Documented side effects (intended or harmless)
- **Drink vote:** passing the phone to the next player now scrolls to the top and focuses the title (screen id per player). Before, the title was the same for every player, so nothing happened. This is better for pass-the-phone and for screen readers.
- **Hidden Pubs:** a café missing from `coordinates.json` would now also get `coordinatesStatus: "to-verify"` (shared `findPosition`). All cafés are listed, so the output is unchanged (byte-identical check).
- **Game player's route to the next stop:** it no longer falls back to "any leg ending at the next stop". It uses the exact leg, which `validateWalk` guarantees for every walk.
- **Walk total distance:** round totals now show without ".0" ("10 km"). Today's totals are unchanged.

### Remaining (optional, not from this phase)
- **Simulated GPS "arrive":** needs two clicks right after "Reset navigation". The first reading only switches to live mode. Playtest-only.
- **Guide stop page → navigation:** no scroll to the top. Candidate for Phase 6 (UX).
- **Start, team-setup and intro screens:** still follow the title (they come before the game).
