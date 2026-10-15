# Hidden Antwerp — Go / No-Go (Phase 9, 2026-09-29)

Evidence-based launch decision after the remediation (phases 0–8, see `REMEDIATION_LOG.md`), a production-build browser test suite, and an independent lighter re-audit in three areas.

## Verdict

| Use | Decision |
|---|---|
| **Private playtest** (invited groups, `noindex`, placeholder content labelled) | **GO** |
| **Public launch** (open, indexed, paid or promoted) | **NO-GO** until the conditions below are met |

The code is not what holds the launch back: every code defect from the audit is fixed or has a documented decision. What remains is legal, content, field testing and a few configuration choices only the owner can make.

## Evidence

| Check | Result |
|---|---|
| Type-check, lint, translations (`npm run i18n:check`, incl. plural forms and placeholders) | ✅ |
| Unit and component tests (`npm run test:coverage`) | ✅ about 1,200 tests; logic coverage: lines 97.6 %, branches 89.4 % (thresholds 95/85) |
| Browser tests on the production build (`npm run test:e2e`, 390 px Chromium phone) | ✅ 20 tests, about 2.5 min |
| — every page loads without errors; real 404; security headers; no playtest tools in production | ✅ |
| — a Classics walk with emulated GPS: arrival, a leg along the route, the map and its versioned worker | ✅ |
| — reload in the middle of a walk; location refused (map stays, "I'm here" works) | ✅ |
| — a complete Hidden Pubs game (team setup → 8 cafés → final puzzle → completion), drink votes skipped | ✅ |
| — nl-BE phone → Dutch; switch to Ukrainian mid-walk; choice survives cleared cookies | ✅ |
| — no sideways scrolling at 390 px in German, Russian and Spanish (screenshots checked) | ✅ |
| **Privacy:** no GPS position in localStorage, sessionStorage, IndexedDB, cookies or any request URL | ✅ (browser test + two unit tests; a planted "save the position" bug fails them) |
| **Data use**, first visit to a walk until the map shows | about **1.3 MB** (scripts 644 KB incl. the map worker, cached for a year afterwards; map tiles 470 KB; images 87 KB; fonts 67 KB) |
| Dependencies | `npm audit`: 0 vulnerabilities |
| Content since the audit baseline | No change to facts, answers, coordinates, sources, research markers, drinks or story texts (verified by the re-audit with `git diff audit-baseline-2026-09-29`) |

Not measured here (needs real devices or approval): Lighthouse mobile scores, battery drain over a 2-hour walk, iOS Safari behaviour, screen readers on phones.

## Re-audit: finding counts

| Severity | In the audit | Fixed in code | Open as a code defect | Decided, deferred or outside the code |
|---|---|---|---|---|
| High | 3 | 2 (H-01, H-02) | 0 | H-03 Smekens rights (legal); H-02's content part (placeholder answers, outdoor fallbacks) |
| Medium | 20 | 16 | 0 | M-01 pins (field check), M-08 tile provider/offline (product), M-14 image target (kept quality 75), M-17 CI never ran on GitHub (needs push) |
| Low | 44 | about 30 | 0 | L-03 answers in the client (product), L-05 privacy notice (legal), L-08/L-09 (field), L-14/L-22/L-34 (accepted), L-16 (partly), L-18 key rename (on purpose), L-29 reopen a stop (later), L-33 SEO (product), L-36 local Node 20, L-38 tooling upgrade, L-43 hints (content) |

New findings in the re-audit were all Low or Info. They were fixed in Phase 9, apart from a few noted in `REMEDIATION_LOG.md`:
- a `sequence` challenge type would dead-end (now rejected by `validateWalk`);
- tile-server hiccups could fail the browser tests (now ignored);
- three unused texts were removed;
- test files named after remediation phases were renamed by feature;
- CLAUDE.md inaccuracies were corrected.

## Conditions for a public launch

### Owner / legal
1. **Smekens drawing rights (H-03)** cleared with the rights holder, or the drawings replaced. A test prevents marking Poortjes `verified` while the rights note is present.
2. **Privacy notice** published (draft: `PRIVACY_NOTICE_DRAFT.md`), after legal review: the map provider sees the map area, the language cookie, and no location storage.
3. **Hosting chosen**; production has **no** `NEXT_PUBLIC_PLAYTEST_TOOLS` (a browser test fails on a build with the tools).
4. **Tile provider for production** and what happens offline (M-08): OpenFreeMap has no SLA.
5. **SEO decision** (L-33): until then the site stays `noindex`. Remove `PROTOTYPE_ROBOTS` only on purpose (the play page keeps `noindex`).
6. **Answers in the browser** (L-03): move answer checking to a server before paid walks or prizes.

### Content
7. **Historian review** of all three walks; `contentStatus` becomes `verified` only after it (research markers stay until then).
8. **On-site answers** (Rococo gable, De Kat cat count, De Varkenspoot, bonus 't Gulick), Rococo and De Varkenspoot history, `to-verify` drinks.
9. **Outdoor fallbacks** for the café-interior challenges (Den Engel, De Muze, De Kat, Quinten Matsijs), so a closed café doesn't force three wrong answers.
10. **Hints decision (L-43)** for the finale and the Quinten Matsijs bonus.
11. **Native-speaker review** of the AI translations (ru/uk names and glossary; uk "Книга" as the Ledger's name is the same as ru).

### Field test (`FIELD_TEST_CHECKLIST.md`, 44 open items)
12. All **61 coordinates** checked on site (all `to-verify`); route ends inside the arrival radius (M-01).
13. iOS Safari and Android Chrome over HTTPS with real groups: GPS feel (M-06/M-07), manual arrival (E2/E3), dead zones (E8), battery (E9), small screens (E12), 390 px in de/ru/es (E21), VoiceOver/TalkBack (E22), language menu on iPhone (E23), position dot over the stop label (E24).
14. After that: switch the Content-Security-Policy from report-only to enforced (check the browser console on both phones first).

### Engineering
15. **Push and merge** the phase branches (`main` has none of the remediation yet), let CI run green on GitHub, then turn on branch protection (M-17).
16. Upgrade local Node to 22 (L-36).
17. Optional: Lighthouse and `@axe-core/playwright` checks (new dev dependencies, need approval); the test-tooling upgrade (L-38) on its own branch.
