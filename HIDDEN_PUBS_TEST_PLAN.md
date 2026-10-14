# Hidden Pubs 2.0: test plan

How every part of the new game will be tested. Levels:
- **Unit** (Vitest): the pure game logic in `src/features/pub-game/logic/` and the café data. Fast, runs in CI.
- **API** (Vitest): the Route Handlers against the in-memory game store, several fake players.
- **Component** (Vitest + Testing Library): screens, texts from the translations.
- **E2E** (Playwright): real browser, **several phones = several browser contexts** in one test, 390 px, production build.
- **Field**: on site in Antwerp with real phones (added to `FIELD_TEST_CHECKLIST.md`).

Rule from CLAUDE.md: tests take content from the data and texts from the translations, never typed literally.

---

## 1. Coverage of your 20 test points

| # | What | Unit | API | Comp. | E2E | Field |
|---|---|---|---|---|---|---|
| 1 | Single player and single team | scoring per player, winner = player | 1 team × 1 player full game | results screen shows a player | ✔ one phone, all 12 cafés (simulated GPS) | ✔ |
| 2 | Several teams in one game | team scores, ranking | 10 teams join one game | lobby lists teams | ✔ 3 teams × 2 phones | ✔ |
| 3 | Teams up to 10 players | 2 decks from 5 players; 1–10 boundaries, 0 and 11 refused | 10 players join, 11th refused | setup form limits | ✔ 1 team × 10 contexts (smoke) | |
| 4 | Random routes | 10,000 random routes: Rococo first, Den Engel last, 2–7 in slots 2–7, 8 → 9 at slots 8–9, 10/11 at slots 10–11, each café once; every pair has a route leg | route stored once, same after refresh | only own next café visible | ✔ two teams get their own route | |
| 5 | All 12 cafés | every café has drinks, task(s), answers (server file), fun fact, in every language; `validateWalk` rules | every café's actions accepted in order | each café screen renders | ✔ full route | ✔ every café |
| 6 | All 13 ranks | each rank → correct effect and state change | draw → state for every phone | each card face + effect text | sample of ranks via seeded deck | |
| 7 | Two decks | 104 cards, 8 of each rank, no duplicates beyond 2 per card, reshuffle when < 10 left | 5-player team uses 2 decks | | | |
| 8 | Buddy notifications | 8 → link; A drinks → B drinks; no chains; replace on new 8; Beunaas doubling for buddy; never > 2 sips | popup event reaches every player, other teams too | buddy picker lists all players | ✔ buddy across teams, popup on other team's phone | |
| 9 | Jack rules | rules persist; 5th jack drops the oldest | rules survive refresh | rules list | ✔ | |
| 10 | Queen / King / Ace | holder set, transferred on a new draw, cleared never otherwise | | effects bar | ✔ | |
| 11 | Correct and wrong attempts | attempt counting; wrong options greyed out | answers never in GET `/state` before reveal; wrong option ids rejected | hint shown after a wrong attempt; live status element | ✔ | |
| 12 | Scoring | 100 / 80 / 60 / 0, two-question cafés, bonus only after approval, tie-breaker | double submit with same `actionId` → points once; replayed request after refresh → no extra points | leaderboard | ✔ | |
| 13 | Photo/video uploads | file type/size checks | upload, private download only for players of that game (other game's cookie → 403) | camera/file input, preview | ✔ upload a test image | ✔ iPhone + Android camera |
| 14 | Host approval | approve/reject → points | only the host can approve | dashboard | ✔ | |
| 15 | GPS navigation | route legs per pair | no positions ever sent to the server (request body check) | navigation screen with the next café | ✔ simulated GPS + privacy check (existing `gps-walk` style) | ✔ |
| 16 | Refresh and reconnection | | cookie → same player after reload; stale version → full state | "connection lost" notice | ✔ reload mid-card, mid-question, offline → online | ✔ bad wifi |
| 17 | Multiplayer sync | apply-action is deterministic | concurrent actions from 2 phones → one wins, other gets a clear refusal | polling stops when the tab is hidden | ✔ action on phone A visible on phone B within ~3 s | ✔ |
| 18 | Final leaderboard | ranking, ties, stats (never drink counts) | results only when finished (D7) | results + share card | ✔ | |
| 19 | All 8 languages | content structure equal to English, technical values unchanged | | every screen renders in each language; no hardcoded text | ✔ smoke per language; long German words + Cyrillic at 390 px | |
| 20 | Mobile | | | | ✔ 390 px layout, no horizontal scroll, buttons ≥ 44 px | ✔ |

## 2. Safety and rules tests (always run in CI)

- Every café has an alcohol-free option and a skip (every language).
- No screen or statistic shows a number of drinks or sips taken.
- Points never depend on choosing an alcoholic drink (D3): bonus approval data has no "alcoholic" field.
- No GPS position in any request body or in the database (extends the existing privacy e2e test).
- Correct answers: the client bundle and every `/state` response before reveal contain no answer (scan of the built `.next/static` chunks for the answer ids, like the existing security tests).
- 18+ confirmation required before create/join (D4).
- Media URL of game A refused for a player of game B.

## 3. Regression

- All existing tests for Classics, Poortjes, navigation, i18n, security keep passing (`npm run test:run`, `npm run test:e2e`).
- `walk-data.test.ts` keeps running every walk × language; its alcohol checks are rewritten for the new rules (D2), not deleted.
- The old Hidden Pubs tests are removed only in the final "remove old game" commit, together with the old code.

## 4. Before saying "done"

`npm run typecheck`, `npm run lint`, `npm run i18n:check`, `npm run test:coverage`, `npm run build`, `npm run test:e2e`, plus one real multi-phone run on the LAN (dev server, `DEV_ALLOWED_ORIGINS`). Failures are reported as they are.
