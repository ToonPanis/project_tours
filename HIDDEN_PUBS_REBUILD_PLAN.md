# Hidden Pubs 2.0: rebuild plan

Status: **approved on 2026-10-14** (all recommendations D1–D34 accepted). Stages 1 (game logic), 2 (server) and 3 (Postgres store, waiting for a database to test against) done; missing café answers still to come from the owner.
Source of truth for the game: `HIDDEN_PUBS_CONCEPT.txt` (your document, copied unchanged from `Downloads/Geplakte tekst.txt`).
Companion documents: `HIDDEN_PUBS_GAME_RULES.md` (the rules as the app will run them), `HIDDEN_PUBS_DATA_AUDIT.md` (per café: what is there, what is missing, what is wrong), `HIDDEN_PUBS_TEST_PLAN.md`.

Decisions are numbered **D1–D34** and listed in the data audit (section 1). This plan refers to them.

---

## 1. What exists today (and what we keep)

| Area | Today | For Hidden Pubs 2.0 |
|---|---|---|
| Walk data | `src/data/walks/hidden-pubs/`: 8 cafés, Lost Tavern Ledger fiction, finale, clues | **Replaced** by 12 café files + the new rules. Old files stay until the new game is tested (rollback). |
| Game flow | `src/features/walk-session/`: one phone per team, drink vote, story → challenge → solved → clue, finale. Only Hidden Pubs uses it. State in `localStorage`. | **Not reused for gameplay.** Your concept is a different game (multiplayer, cards, scoring). Removed in a separate, last step. |
| Guide walks | `GuideWalkPlayer`, Classics, Poortjes | **Untouched.** |
| Navigation | `NavigationScreen`, `WalkingMap` (MapLibre + OpenFreeMap), `useGeolocation`, arrival detection, pre-generated OSRM routes | **Reused as-is** for "navigate to the next café". |
| Route generator | `scripts/generate-walking-routes.mjs`, one leg per consecutive stop | **Extended**: a random order needs a leg for every possible pair (≈ 49 legs, section 5). |
| Spooky | `src/features/quests/` (on the Classics PR #2 branch) | **Pattern reused** for Beery (picture + speech bubble + popup), new component and personality. |
| UI kit | `Button`, `Dialog`, `ConfirmDialog`, `ProgressBar`, `Badge`, `useScreenFocus`, `tavern` theme | **Reused.** |
| i18n | Own layer, 8 languages, `content/<lang>.ts` per walk | **Reused.** New namespace `pubgame.json` × 8. |
| Walk pages | `/walks`, `/walks/[slug]` (detail page) | **Reused** (detail page gets the new description, 12 cafés, rules). |
| Database, auth, server logic | **None.** No backend, no accounts. Answers ship to the browser. | **New.** Needed for multiplayer, server-side scoring and uploads. See section 3. |

**Why the old game engine can't be adapted:** it assumes one phone per team, no shared state, no scores, a drink *vote*, clues and a finale, and answers checked in the browser. Your concept needs every one of those to change. Bending it would keep its complexity and add new complexity. A new feature folder is cleaner, and the old code can be removed in one go after the new game works.

---

## 2. Target structure

```
HIDDEN_PUBS_CONCEPT.txt               your concept (source of truth)
db/migrations/001_pub_game.sql        database tables (plain SQL)
scripts/db-migrate.mjs                applies migrations (no ORM)

src/data/walks/hidden-pubs/
  cafes/01-rococo.ts … 12-den-engel.ts   technical data per café: id, address, drinks, question ids,
                                         number of options, bonus type + points, media type
  answers.server.ts                       correct answers + scoring data ("server-only": never in the browser)
  content/<lang>.ts                       all texts per language: questions, options, hints, fun facts, Beery lines
  coordinates.json / routes.json          12 cafés, all legs a random route can need
  index.ts                                builds the Walk (experience: "pub-game")

src/features/pub-game/
  config.ts     the game's numbers (teams, players, 10 cards per offer, max 4 rules, 100/80/60 points)
  logic/        PURE TypeScript, no React, no database (fully unit-tested; "logic/" so the coverage thresholds apply):
                cards.ts (decks, offers, follow-ups per rank), route.ts (random route within your constraints),
                scoring.ts (100/80/60/0, scores computed from the state, ranking + tie-breaker),
                sips.ts (buddies + Beunaas), create-game.ts,
                apply-action.ts (one function: state + action → new state + events, like today's session reducer),
                player-view.ts (what one player may see: never other teams' routes, never unrevealed answers)
src/types/pub-game.ts               the game's types (definition, state, actions, events, errors)
  server/       "server-only": game-store.ts (interface), memory-store.ts (dev + tests), postgres-store.ts,
                identity.ts (player cookies), media.ts (upload + private download)
  components/   screens: CreateGame, Lobby/Join (+ QR), CafeArrival, DrinkChoice, BeerWheel, CardDraw, CardEffect,
                EffectsBar (Question Bitch / Thumb King / Beunaas / buddies / rules), Pubtask, BonusTask, FunFact,
                Leaderboard, Results, HostDashboard, Beery
  hooks/        useGameState (polling), useGameAction (send action once, with an id)

src/app/
  walks/[slug]/play/page.tsx        unchanged route: for a pub-game walk it shows "Create a game"
  games/[code]/page.tsx             the game for one phone (join screen if not joined yet)
  games/[code]/host/page.tsx        host dashboard
  api/games/route.ts                POST: create a game
  api/games/[code]/join/route.ts    POST: join a team
  api/games/[code]/state/route.ts   GET: the player's view of the game (polled)
  api/games/[code]/actions/route.ts POST: every game action (draw card, answer, choose buddy, …)
  api/games/[code]/media/route.ts   POST: upload evidence; GET [id]: download (only for players of this game)
```

Why `/games/[code]` and not `/walks/hidden-pubs/play`: a game is a *session* that several phones share, so the URL must identify that session. The join link and QR code point to `/games/K7M2QX`. The locale is still never in the URL.

---

## 3. Multiplayer architecture (D1: needs your OK)

This is the **major architectural change**: the project gets a server side for the first time.

### 3.1 Recommendation: Route Handlers + Postgres + polling + private Blob storage

| Piece | Choice | Why |
|---|---|---|
| Game server | **Next.js Route Handlers** (`app/api/.../route.ts`) | Already part of Next.js, runs on Vercel, no extra server. All game rules run here, so a phone can't fake a score. |
| Database | **Postgres** (Neon via the Vercel Marketplace, free tier) | You know SQL. Plain SQL files, no ORM. |
| Live sync | **Polling**: each phone asks `GET /state?v=<version>` every ~2 s while the screen is visible | Vercel functions can't keep WebSockets open. Polling copes with bad café wifi (no reconnect logic) and is easy to understand and test. 2 s is fast enough for a party game. |
| Media | **Vercel Blob, private** | Photos/videos are never public. They're served through our own route, which checks that you're a player in that game. |
| Identity | **No accounts.** Joining gives a random secret in an `httpOnly` cookie per game | The same phone rejoins automatically after a refresh. The host can make a "rejoin" link for a player who changed phone. |

**How an action works (no double points, no refresh exploits):**
1. The phone creates a random `actionId` and POSTs `{ actionId, type, payload }`.
2. The server loads the game state, checks the player is allowed (right team, right turn, right step), and runs the pure `applyAction` from `logic/`.
3. In **one database transaction** it saves the new state, bumps `version` and stores the action with a **unique `(game_id, action_id)`**. A double tap or retry sends the same `actionId`: the database refuses the duplicate and the server returns the first result.
4. Every phone sees the new `version` at its next poll and gets the new state plus the new events (popups such as "X and Y are drinking buddies").

**Correct answers never reach the browser before they're revealed**: they live in `answers.server.ts` (marked `import "server-only"`). `player-view.ts` builds the per-player view and leaves out answers, other teams' routes and other teams' pending evidence.

### 3.2 Database tables (`db/migrations/001_pub_games.sql`)

```
pub_games         code (6 chars, no look-alike letters), walk_slug, state jsonb (teams, players, decks, answers,
                  evidence…: the whole PubGameState), version, created_at, expires_at (+ 7 days)
pub_game_actions  game_code, action_id (PRIMARY KEY together: the same tap is never applied twice),
                  player_id, action jsonb, version it produced, created_at
pub_game_events   game_code, version, position, event jsonb (for "events since version X")
pub_game_players  game_code, token_hash (SHA-256 of the cookie secret), player_id
```
All tables delete their rows together with the game (`ON DELETE CASCADE`). Expired games are removed when a new game is created. Stage 8 adds a `pub_game_media` table for photos/videos.

Why game state as one `jsonb` document plus an action log instead of a table per team, player, card, rule and buddy: the rules are complex and change together, and the pure game logic is far easier to test on one plain object (as `session-reducer.ts` already does). The action log gives an audit trail for disputes, and the data is small (≤ 100 players).

**One store interface, two stores:** `GameStore` (`server/game-store.ts`) with `MemoryGameStore` (development without a database, tests) and `PostgresGameStore`. `pub-game-store.test.ts` runs the same tests on both (Postgres only with `TEST_DATABASE_URL`).

### 3.3 Alternative: Supabase
One service for Postgres, real-time push, storage and auth. Less code to write, but the real-time model and row-level security are new concepts, and more of the game rules would live outside your codebase. Recommendation: **3.1**.

### 3.4 New packages (each needs your OK before install, CLAUDE.md rule)

| Package | Why | Built-in alternative? |
|---|---|---|
| `postgres` (or `@neondatabase/serverless`) | Talk to Postgres | None: Node has no Postgres client |
| `@vercel/blob` | Private file uploads on Vercel | Could store files in Postgres (bad for video) |
| `qrcode` (small, no dependencies of its own) | QR code for the join link | Writing a QR encoder by hand is not "simple". Alternative: the browser's share button + a short code only |
| `server-only` (optional, ~0 bytes) | Build error if answer files are imported by a client component | Next.js supports the import without it, but the lint setup may want it listed |

No real-time library, no ORM, no state library, no UI kit, no animation library (cards and wheel are CSS/SVG).

### 3.5 Costs and limits to know
- Free tiers of Neon and Vercel Blob are enough for playtests. Check their current limits before launch.
- Vercel's **Hobby** plan is for non-commercial use. Selling tickets later means the Pro plan.
- Polling: 100 players × 1 request / 2 s = 50 requests/s at peak, which is fine for serverless. The state route returns a tiny "unchanged" answer when nothing happened.
- **Privacy (GDPR):** player names and photos of people are personal data. Proposal (D29): games and media are deleted automatically after 7 days, and the upload screen shows a consent reminder.

### 3.6 Location privacy stays as it is
GPS positions stay on the phone (in memory, only on the navigation screen), as today. The server and host dashboard only know **"team arrived at café X"** (a button press or arrival detection), never a position. The CLAUDE.md rule "No GPS storage, ever" is kept.

---

## 4. Alcohol rules (D2–D4: needs your OK)

Your CLAUDE.md has "Decisions to keep" that the new concept breaks: no drinking challenges, no quantities, no penalties, no shots, no proof of drinking. `walk-data.test.ts` enforces them. It's your game and your call, but the rules and the test have to be changed **openly**, not worked around. Proposal:

1. **Drunken Bastard stays as you designed it.** Every "drink" instruction means "take a sip of *your* drink", and your drink can always be alcohol-free. The app never counts sips or drinks, and never shows drink statistics.
2. **Points never depend on drinking alcohol.** Bonus tasks that reward drinking (Barok shot, Den Engel clog, rock-paper-scissors loser) also count with an alcohol-free drink. Your original wording stays in the audit next to the proposed version, for you to approve (D3).
3. **18+ confirmation** when creating and joining a game. Shots are spirits, and in Belgium spirits are 18+ (D4).
4. Every café's drink list gets an **"alcohol-free / soft drink"** option and a **skip**.
5. Respect reminders: ask staff before photos or tapping, don't disturb other guests, follow the café's rules.
6. CLAUDE.md "Alcohol and cafés" and `walk-data.test.ts` are rewritten to describe these new rules, so the tests protect them from now on.

---

## 5. Route and navigation

- Route rule (your document): `Rococo → random order of cafés 2–7 → café 8 → café 9 → random order of 10 and 11 → Den Engel`. Per team or per game: **D5**. Order of 8 and 9: **D6**.
- The server draws the route (`logic/route.ts`, tested on thousands of random routes against the constraints) and stores it. Each team only sees **its own next café** (progressive reveal, like today).
- A random order means the app must have a walking route between any two cafés that can follow each other. Pairs needed: Rococo→{2…7} (6) + all ordered pairs within 2…7 (30) + {2…7}→8 (6) + 8→9 (1) + 9→{10,11} (2) + 10↔11 (2) + {10,11}→Den Engel (2) = **49 legs**. The generator script gets a "pairs" mode. Everything is still generated in advance, with no routing API at runtime.
- **Barok, Billie's, Café Barries and Cabron** have no address or coordinates in the project yet, and I won't invent them. I'll geocode them from OpenStreetMap as `to-verify` once you confirm the exact cafés (audit section 3).
- **Café 8 and 9 "same location"**: in the current data, De Varkenspoot (Graanmarkt 3) and Boer van Tienen (Mechelseplein 6) are **~400 m apart**. Either the old data is wrong, or the cafés aren't at the same place (D6).
- When a team gets its next destination: Beery popup **"Beery brengt je naar de volgende locatie!"** → café name → "Start navigation" → the existing `NavigationScreen` (map, live dot, directions, distance, arrows, "I'm here", arrival detection).

---

## 6. Implementation stages (after approval)

Each stage ends with typecheck, lint, tests (+ i18n:check) and a short report. All work happens on `feature/hidden-pubs-2`. **Nothing reaches `main` (= production on Vercel) until the whole game works**, unless you want earlier merges behind a switch.

| # | Stage | Result you can try |
|---|---|---|
| 0 | Your decisions → final rules doc, CLAUDE.md alcohol section, café data audit closed | Approved docs |
| 1 | **Engine** (pure TS): deck, draws, card effects, buddies, rules, route, scoring, apply-action, player-view. Unit tests for all 13 ranks, 1 and 2 decks, buddies, routes, scoring | `npm run test:run` |
| 2 | **Server**: game store (memory first), identity cookies, Route Handlers, idempotent actions, polling endpoint. Tests against the memory store | API tests; dev works without a database |
| 3 | **Postgres + migrations** + Blob (after package approval); Neon dev database | Real multi-phone games on the LAN |
| 4 | **Setup and lobby**: create game (teams 1–10, players 1–10, names), join link + QR, team choice, host dashboard (basic), 18+ confirm, Beery intro + rules | Two phones in one game |
| 5 | **Route + navigation + Beery popups**, 12 cafés' data, 49 route legs | Walk the route with simulated GPS |
| 6 | **Café flow**: arrival → drink choice (+ Billie's wheel) → Drunken Bastard (card pick, effects, buddies popup, effects bar, rules list) | Full card game on several phones |
| 7 | **Pubtasks + scoring** (server-checked, hints, reveal on 4th/last attempt) + fun facts | Scores on the leaderboard |
| 8 | **Bonus tasks + media**: camera/upload, preview, host review, approve/reject | Evidence flow |
| 9 | **Leaderboard + Den Engel ending**: live scoreboard, results, tie-breaker, stats, shareable results card | Complete game |
| 10 | **8 languages** (content and UI texts are added in each stage in English + Dutch, full translation here), translation checks | `i18n:check` green |
| 11 | **QA**: Playwright multi-phone tests, 390 px layout, regression tests for Classics/Poortjes, field-test checklist | Test report |
| 12 | **Remove the old game** (walk-session game screens, voting, finale, clues, old Hidden Pubs files and their tests), in its own commit so it can be reverted | Smaller codebase |

Realistic size: this is the biggest change the project has had. It's several sessions of work, and most of the time goes into stages 1–3 and 6–7.

---

## 7. What I need from you before stage 1

1. **D1**: OK for the architecture (section 3) and the 3–4 packages (3.4).
2. **D2–D4**: the alcohol approach (section 4).
3. The gameplay decisions **D5–D34** in `HIDDEN_PUBS_DATA_AUDIT.md`. Each one has a recommendation; "accept all recommendations except D…" is a fine answer.
4. Missing content: correct answers (Barok, Quinten Matsijs ×2, Boer van Tienen), the spaarkas photo, Billie's beer list, addresses of the 4 new cafés.
