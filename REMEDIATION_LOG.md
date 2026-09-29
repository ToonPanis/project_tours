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
