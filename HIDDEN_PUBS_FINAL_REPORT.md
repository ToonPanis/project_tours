# Hidden Pubs 2.0: final report

Branch `feature/hidden-pubs-2`, 14 commits on top of `main` (2026-10-14 to 2026-10-15). Not merged: `main` deploys to production on Vercel, and the game first needs a real database and Blob store (section 10).

Your concept (`HIDDEN_PUBS_CONCEPT.txt`) is the source of truth. Where it left something open, the decision is in `HIDDEN_PUBS_DATA_AUDIT.md` (D1–D34, all recommendations accepted on 2026-10-14). The rules as the app runs them are in `HIDDEN_PUBS_GAME_RULES.md`. How everything is tested is in `HIDDEN_PUBS_TEST_PLAN.md`.

---

## 1. Summary

Hidden Pubs is now the multiplayer party game from your concept:

- **1–10 teams of 1–10 players**, every player on their own phone, in the browser (no app, no account).
- **12 cafés**: Rococo first, cafés 2–7 shuffled, De Varkenspoot → Boer van Tienen back to back, De Muze / Cabron shuffled, Den Engel last. **A random route per team.**
- At every café: **arrival → drink choice → Drunken Bastard → pubtask → bonus task → fun fact**.
- **Drunken Bastard** with all 13 cards, 1 or 2 decks, drinking buddies (also across teams), rules, Thumb King, Question Bitch, Beunaas.
- **Pubtasks** scored 100 / 80 / 60 / 0, checked by the server. **Bonus photo/video tasks** score only after the host approves.
- **Beery** with your exact lines ("Beery brengt je naar de volgende locatie!", "Beery heeft een bonusopdracht voor je!").
- **Live leaderboard** during the game and **results** at the end.
- **8 languages** (en, nl, fr, es, it, de, ru, uk).

Everything works end to end in automated tests (980 unit/component/API tests, 28 browser tests, including one player playing all 12 cafés and a team of 10 phones). It has **not yet** run against a real Postgres database or Vercel Blob store, on real phones, or in the cafés.

## 2. What was changed

| Stage | Commit | What |
|---|---|---|
| 1 | `083f364` | Plan, rules, data audit, test plan; the pure game logic (cards, route, scoring, actions, player view) |
| 2 | `ecbdd0f` | Game server: Route Handlers, player cookies, idempotent actions, polling; in-memory store |
| 3 | `26cd8a4` | Postgres store + migration (`postgres` package) |
| 4 | `ecf4f58`, `6e15af1` | Create game, join, lobby, 18+ check, Beery's intro, host dashboard, QR code (`qrcode-generator`) |
| 5 | `d1935b0` | The 12 cafés' positions, 49 walking legs, navigation between cafés, Beery's popups |
| 6 | `1ca7ee2` | Drink choice, Billie's beer wheel, Drunken Bastard |
| 7 | `5b0f23a` | Pubtasks, scoring, bonus tasks, fun facts |
| 8 | `49746d6` | Photo/video evidence with host approval (`@vercel/blob`, private files) |
| 9 | `93a92cb` | Live leaderboard and results |
| 10 | (in every stage) | All texts in 8 languages as they were written (no separate commit) |
| 11 | `8169d67` | Browser tests with several phones, QA |
| 12a | `9cb1035` | `/walks/hidden-pubs/play` → the new game; new detail page; old game moved to a test fixture |
| 12b | `6082ea4` | The old one-phone game engine removed (one commit, can be reverted on its own) |
| 13 | `7f53ec4` | Your 20 test points checked against the tests; gaps closed; a reload bug fixed |

In numbers: 296 files changed, about 28,000 lines added and 10,900 removed. Three npm packages were added, each with your OK: `postgres`, `@vercel/blob`, `qrcode-generator`.

New in the app:

- **Pages:** `/games/new` (create), `/games/<CODE>` (the game on a phone), `/games/<CODE>/host` (host dashboard), `/games/<CODE>/claim` (personal link for a late player or a new phone).
- **API:** `/api/games/…` (create, join, state, actions, claim, reveal, media upload/file).
- **Code:** `src/features/pub-game/` (logic, server, client, components) and `src/types/pub-game.ts`.
- **Data:** `src/data/walks/hidden-pubs/` (`game/` + the detail-page texts).
- **Database:** `db/migrations/001_pub_games.sql`, run by `npm run db:migrate`.

What was removed: the old 8-café game ("The Lost Tavern Ledger") and the one-phone game engine behind it (challenges, team drink votes, clues, finale). The guide walks (Poortjes, Classics) keep working: their saved progress is migrated (storage version 4).

## 3. Which components were reused

| From the existing app | Used for |
|---|---|
| `NavigationScreen` (MapLibre map, live GPS, arrival detection, off-route help, "I'm here") | Walking to every café (`CafeNavigation`) |
| `scripts/generate-walking-routes.mjs` + pre-generated `routes.json` | The 49 walking legs a random route can need (no routing service while playing) |
| `PlayScreen` (screen frame, focuses the title for screen readers) | Every game screen |
| `Button`, `Dialog`, `ConfirmDialog` | All buttons, popups and "are you sure?" questions |
| The i18n layer (`useT`, `getTranslator`, plurals, `LocalizedContent`, `i18n:check`) | All game texts in 8 languages (`pubgame.json` + game content files) |
| `walkRepository`, the walk list and detail page | Hidden Pubs' card and detail page, built from the game data |
| Security headers and CSP (`security-headers.ts`) | Extended with the Blob hosts |
| Playwright setup and helpers (GPS emulation, privacy checks) | The multi-phone browser tests |

Nothing in the shared parts was rewritten for the game. The game adds its own folder, and the walk player kept only the guide part.

## 4. Database models

One migration, `db/migrations/001_pub_games.sql`, with four tables:

| Table | What | Key |
|---|---|---|
| `pub_games` | One row per game: the whole game state as one JSON document (`state`, typed as `PubGameState`), a `version` that goes up with every action, `expires_at` | `code` (6 characters) |
| `pub_game_actions` | Every accepted action and the version it produced. The key makes the same action id impossible twice, so a double tap or a retry counts once | `(game_code, action_id)` |
| `pub_game_events` | What happened (card drawn, buddies linked, sips…) per version, for the popups on every phone | `(game_code, version, position)` |
| `pub_game_players` | Which phone is which player: only a **SHA-256 hash** of the secret in the phone's cookie | `(game_code, token_hash)` |

The other three tables are deleted together with their game (`ON DELETE CASCADE`). Games, and their photos and videos, are deleted **7 days** after creation (D29).

Photos and videos are not in the database: they are **private files in Vercel Blob**, shown only through `/api/games/<CODE>/media/file` to players of that game. Their submissions (task, team, who took part, approved or rejected) are part of the game state.

**Never stored:** GPS positions (they stay in the phone's memory while the map is open), drink choices, and anything about how much anyone drinks.

## 5. How multiplayer works

```
phone ──POST /actions {action, actionId, knownVersion}──▶ server: load game ▶ applyPubGameAction ▶ save (version + 1)
phone ◀─GET /state?since=<version> (every 2 s while visible)── server: "nothing new" or the phone's own view + new events
```

1. **The rules are one pure function**, `applyPubGameAction(definition, answerKey, state, actorId, action)` in `logic/apply-action.ts`. It gets the state and an action, and returns the new state plus what happened (events), or a refusal with a reason. It never reads the clock or random numbers, so it's fully tested without a server or browser.
2. **The server decides everything that has to be fair:** each team's random route, the 10 face-down cards a player chooses from, all times and ids. Phones only send what the player tapped ("pick card 4", "answer B").
3. **Saving is safe when two phones tap at the same moment:** the server saves only on the expected version (Postgres: `SELECT … FOR UPDATE`) and retries on a conflict, so both actions are applied one after the other. An action carries an `actionId`: a retry after a bad connection is recognised and applied once.
4. **Phones poll** every 2 seconds while the screen is visible (not in a pocket), asking "what changed since version X". The answer is the phone's own **player view** (`toPlayerView`), which never contains another team's route, the answers, or the face-down cards. Events are numbered, so every popup shows once per phone even when a poll and an action cross.
5. **Who is who:** joining sets an httpOnly cookie `hp_<CODE>` with a secret; the server keeps only its hash. A reload or a lost connection brings the phone back as the same player. After the first card nobody can join freely; the host makes a **personal link** (`/games/<CODE>/claim#secret`) for a late player or a player with a new phone.
6. **Answers stay on the server:** the answer key (`answers.server.ts`) and the explanations and fun facts (`reveals/`) are imported only by `src/features/pub-game/server/`, which a test enforces. A browser test checks they never reach the phone before they're earned.

Why polling and not websockets: it works on Vercel without an extra service, and a phone in a pocket or on bad café wifi simply catches up at the next poll.

## 6. How scoring works

Pure functions in `logic/scoring.ts`:

- **Pubtask question:** right on the 1st try **100**, 2nd **80**, 3rd **60**; after 3 wrong answers the answer is shown and scores **0**. Wrong options are struck out, so with 3 options the 3rd try is always right (D19). A café with 2 questions scores them separately (D21). After each wrong answer the next hint shows (D24).
- **Who scores:** with several teams, a team scores together and the first answer on any team phone counts. In a **one-team game every player answers on their own phone and scores for themselves**, and the winner is a player (D25).
- **Bonus tasks:** points only after the **host approves** the photo/video. A rejected submission can be sent again with the reason shown (D26). Barok counts 100 **per player who took part**; the others count per team.
- **Total** = question points + approved bonus points, shown live in the leaderboard (Scores, in the game menu).
- **Winner:** most points. **Tie:** most first-try answers; still tied = shared win (D27).
- **End:** results open when every team has finished Den Engel, or when the host ends the game (D7). The results show the winner, ranking, totals and highlights (most first-try answers, most right answers, most approved bonus tasks), plus the winner's tradition ("not an obligation", D28). They never show anything about drinks.
- **Points never depend on drinking alcohol:** every bonus task that involves a drink says any drink counts (D3).

## 7. How the 12 cafés were implemented

Data, not code: the same screens play every café. Each piece of data exists once:

| File | What |
|---|---|
| `game/route-groups.json` | The route rule: 1 · [2–7 shuffled] · 8 → 9 · [10, 11 shuffled] · 12 |
| `game/cafes.ts` | Name and address |
| `game/definition.ts` | Per café: question ids with their option ids, photo/video tasks (points, per team or per player, photo or video, pubtask or bonus) |
| `game/drinks.ts` | Your three drinks per café; Billie's has the 1–10 beer wheel. The screen always adds "alcohol-free" and "no drink" |
| `game/answers.server.ts` | The right option per question (server only) |
| `game/content/<lang>.ts` | Questions, options, hints and task instructions, per language |
| `game/reveals/<lang>.ts` | Explanations and fun facts, per language (server only) |
| `game/coordinates.json`, `game/routes.json` | 12 positions (all **to verify** on site) and the 49 walking legs |

| # | Café | Address | Pubtask | Bonus | Fun fact |
|---|---|---|---|---|---|
| 1 | Rococo | Grote Markt 32 | Gates hidden in the café | – | history, partially verified |
| 2–7 | Barok | Melkmarkt 11 | Where is the Baroque style (ceiling) | Shot, 100 per player, photo | research required |
| | Quinten Matsijs | Moriaanstraat 17 | Painter/smith/both; café game (barrel game) | – | research required |
| | De Kat | Wolstraat 22 | Cats in the café | Tap a beer, 200, photo | research required |
| | Billie's Bier Kafétaria | Kammenstraat 12 | Dogs (beer wheel for the drink) | – | research required |
| | Café Barries | Reyndersstraat 21 | Savings box + find Lucie (photo, 100) | – | café story, partially verified |
| | Paters Vaetje | Blauwmoezelstraat 1 | Quinten Matsijs on the terrace | Photo with staff, 100 | legend, partially verified |
| 8 | De Varkenspoot | Graanmarkt 3 | Why this name | – | café story, partially verified |
| 9 | In den Boer van Tienen | Mechelseplein 6 | What's special (2nd-oldest café) | Rock-paper-scissors, 100, photo | research required |
| 10–11 | De Muze | Melkmarkt 15 | Hidden animal; number of floors | – | research required |
| | Cabron | Kaasrui 1 | How many cafés Antwerp had | – | research required |
| 12 | Den Engel | Grote Markt 3 | The clock that stands still; why | Beer from the clog, 300, video | café story, partially verified |

15 questions in total, all playable (none waiting for an answer). A question can be marked `pending` while its answer is missing: it's then left out of the game automatically.

## 8. How the Drunken Bastard system works

Pure logic in `logic/cards.ts`, `logic/sips.ts` and `logic/apply-action.ts`:

- **Decks:** 52 cards without jokers; a team with more than 4 players plays with **2 decks (104 cards)**. One deck per team for the whole game. A drawn card leaves the deck; when fewer than 10 are left, the drawn cards are shuffled back in (D11).
- **A turn:** players draw in joining order, and the first player moves one place every café (D17). The server offers **10 random face-down cards** from the team's deck. The player taps one, it flips on every phone of the team, and the other 9 go back.
- **The 13 cards** (meaning from your concept; "drink" = **one sip of your own drink, alcohol-free counts**):
  - **2:** hand out a sip to a teammate.
  - **3:** take a sip.
  - **4 / 7:** touch the floor / point up, the last one drinks.
  - **5 / 6:** instructions for women / men (no gender stored).
  - **8:** pick a drinking buddy, **also from another team**.
  - **9 / 10:** rhyme / categories.
  - **J:** write a rule (at most 4; a 5th drops the oldest).
  - **Q:** Question Bitch.
  - **K:** Thumb King.
  - **A:** Beunaas, who drinks double.
  - For 4, 7, 9 and 10 the team may tap who lost; that's optional.
- **Powers:** Q, K and A each belong to one player per team, until someone else draws that card. The effects bar shows them, plus your buddy and the number of rules (tap for the full list).
- **Buddies** (D14): one buddy each; a new 8 replaces the old links; buddy sips **never chain** (no loops). A Beunaas drinks 2 sips and so does their buddy, never more than 2 from one instruction.
- **Popups:** new buddies and buddy sips appear on every phone involved, also in another team.
- **Nothing is counted:** the app shows who sips and records nothing. No screen or statistic shows a number of drinks.

## 9. Which tests passed

All on 2026-10-15, on the final branch state:

| Check | Result |
|---|---|
| `npm run typecheck` | ✅ |
| `npm run lint` | ✅ no errors, no warnings |
| `npm run i18n:check` | ✅ all 8 languages complete (525 interface texts) |
| `npm run test:coverage` | ✅ **980 tests** in 54 files; coverage 98.0 % lines, 88.8 % branches (thresholds 95 / 85) |
| `npm run build` | ✅ |
| `npm run test:e2e` | ✅ **28 browser tests** (8 for Hidden Pubs) |

Hidden Pubs in the browser, at 390 px:

- Three phones in two teams, one of them in Russian: lobby, a café round, live scores, the host ends the game, results.
- One player plays **all 12 cafés** of a random route to the results (15 first-try answers = 1,500 points).
- **A team of 10 phones** (the 11th is refused) plays a card round with 2 decks.
- A late player gets in through the host's personal link.
- A reload in the middle of a question keeps the answer state; going offline shows a notice and the game recovers.
- Arrival by **GPS**, with no position in any request or in storage.
- A German phone through a whole café without sideways scrolling.
- Answers, explanations and fun facts never reach the phone early.

Each of your 20 test points is covered; the full table, with how each one is proven, is in `HIDDEN_PUBS_TEST_PLAN.md` section 5. The other walks were regression-tested by the same runs (all Classics, Poortjes, navigation, i18n and security tests pass).

**Not tested (needs keys, devices or a visit):**

- the Postgres store against a real database (`npm run test:db`, skipped without `TEST_DATABASE_URL`)
- uploads to a real Blob store
- one real multi-phone game on the LAN
- the field test in the 12 cafés
- a native-speaker review of the translations

**Failing checks:** none. **Bug found and fixed in stage 13:** after a reload in the middle of a question, the phone first showed the round's last card again.

## 10. Questions that still need your decision

**Before the first real game:**

1. **Database and photo storage:** create the Neon database and the Vercel Blob store and fill `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN` (and optionally `TEST_DATABASE_URL`) in `.env.local` and on Vercel. Then run `npm run db:migrate` and `npm run test:db`. Production refuses to start the game without them.
2. **Answer options I proposed** (your concept gave only the answer, D20): Rococo gates **25 / 33 / 41** and De Kat cats **2 / 3 / 5**. Quinten Matsijs Q1 uses painter / smith / both. OK as they are?
3. **Café Barries' savings box:** a photo of the box, or keep "look for it in the café"?
4. **Addresses to confirm:** Barok (Melkmarkt 11), Billie's Bier Kafétaria (Kammenstraat 12) and Cabron (Kaasrui 1) were looked up, not given by you. All 12 positions are still "to verify" on site.
5. **Den Engel's "own clog"** if the clog can't be found: what counts (D3 says any drink counts, but what about the clog)?
6. **Billie's beer list** (D9): does the bar have a numbered list of 10 beers? The wheel only shows a number.
7. **Price, duration and team size on the detail page** (D32): now €14.95 per group, 5–7 hours, 1–10 players per team, all placeholders.

**Content (labelled visibly until answered):**

8. **Fun facts** of 7 cafés are `research required` (Barok, Quinten Matsijs, De Kat, Billie's, Boer van Tienen, De Muze, Cabron), including the "oldest / second-oldest café" claims (F4). Do you have sources, or should I research them?
9. **Factual flags F1–F8** in the audit: e.g. the Baroque century (F1), whether Quinten Matsijs was a smith (F2: the Classics walk says it's a legend), the fly story (F3), the year of "420 cafés" (F6).
10. **On-site counts** to check (they can change): Rococo's gates, De Kat's cats, Billie's dogs, De Muze's animal and floors, Den Engel's clock.
11. **Drink names** to check against the menus (e.g. "Charle Quint", "Tongerloo Blond", "Triple Anvers").

**Project:**

12. **Merging to `main`** (= production): after items 1–2, open a PR from `feature/hidden-pubs-2`. PR #2 (Classics audio and quests) should go in first or right after; the merge will need small fixes (the `team` argument in its quest test, `content: []` on its stops, `StopNavigation`, `location.ts`, `validate-walk.ts`).
13. **Security update:** `npm audit` reports an advisory for `next` ≤ 16.3.7; updating Next is worth a separate small PR.
14. **Native-speaker review** of the 8 languages (all translations are AI-made).
