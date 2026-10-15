# Phase 3 report: Hidden Pubs groups (tickets → games, seat limit, invitations)

Date: 2026-10-16. Branch: `commercial/p3-groups` (from `main` = `662303e`, after P2). Not merged, not deployed.
Decision used: B3 (per person: the number of tickets bought is the number of places). Brief: phase 2 "Groepscodes en uitnodigingen", adapted to the existing Hidden Pubs game (its rules were **not** changed: brief §2.4).

**With ticket sales closed (the default) nothing changes:** games are created without a ticket and without a limit, exactly as before.

## 1. What was built

| Part | How it works |
|---|---|
| **One ticket, one game** | With sales open and Hidden Pubs on sale, `/games/new` and `POST /api/games` need an unused Hidden Pubs ticket opened on the organiser's phone (from the confirmation email). Without one: the "This walk needs a ticket" screen (403 for the API). The route reserves the ticket atomically, creates the game and then links the ticket to it; a refused form (e.g. 18+ not ticked) gives the ticket back; a reservation left by a crashed request is taken over after 2 minutes. Opening `/games/new` again with a used ticket shows a link back to that game. |
| **Seat limit** | The game gets `seatLimit` = persons on the ticket (organiser included), stored **next to** the game state (`StoredGame`), so the game rules in `apply-action.ts` are untouched. Joining (`JOIN`) and the host adding a late player (`ADD_PLAYER`) are refused with "game full" when every place is taken. The check runs against the state being saved inside the existing optimistic-locking loop, so two phones can't take the last place at once. A phone already in the game (cookie) always gets back in (reload, lost connection). |
| **Lobby** | "x of y places taken" / "All y places are taken" when the game has a limit; a **WhatsApp** button (WhatsApp's own `wa.me` share link with the join link in the message) next to the existing share sheet, copy and QR code. The join page says "game full" instead of "already started" when that is the reason. |
| **Create form** | Shows "Your ticket is for N persons, you included." |
| **8 languages** | New texts in `pubgame.json` and `commerce.json` × 8 (sub-agent translation; ru/uk phrased to work for any number). |

### What the brief asked and how it maps

| Brief (phase 2) | Status |
|---|---|
| Group created after purchase, organiser = host, unique secure invitation code and link, size bound to the package | ✅ The organiser creates the game with the ticket (becomes host, D33); the existing 6-character game code + `/games/<CODE>` link and QR are the invitation; places = tickets bought. (A group is a Hidden Pubs game, not a separate object: no second system.) |
| Copy link, QR, WhatsApp, see who joined, start | ✅ (WhatsApp button new; the rest existed) |
| Guests without an account | ✅ (existing: a cookie per game) |
| Rename the group, remove participants | ❌ **Not built**: both need new game actions (state changes in the game rules), which the brief forbids without your permission. Team names are set at creation. Your decision (see open points). |
| Realtime voting, vote counting | Not applicable: the current Hidden Pubs concept has no voting (see the Phase 0 audit). |
| One central state, server validation, offline/reconnect, after restart | ✅ Existing (polling, versioned state in MongoDB, cookie); tested again with the seat limit. |

## 2. Files

**Changed (Hidden Pubs, narrow):** `src/features/pub-game/server/game-store.ts` (`seatLimit?`), `server/mongo-store.ts` (store/read it), `server/game-service.ts` (`createGame` option, `isFull`/`seatsOf`, refusal in `commitWithRetry`, `JOIN`/`ADD_PLAYER` checks, lobby `seats`), `logic/api-types.ts` (`Lobby.seats`), `client/api.ts` (error texts), `components/LobbyScreen.tsx`, `components/PubGame.tsx`, `components/JoinGameForm.tsx`, `components/CreateGameForm.tsx`, `src/app/games/[code]/page.tsx`, `src/app/games/new/page.tsx`, `src/app/api/games/route.ts`.
**Changed (commerce):** `src/types/commerce.ts` (`TicketGrant.gameCode`), `server/commerce-store.ts`, `server/memory-store.ts`, `server/mongo-store.ts` (`swapGrantGame`), `server/ticket-service.ts` (`newGameAccess`, reserve/confirm/release).
**Schema:** `db/mongo-schema.mjs` (optional `seatLimit` on `pub_games`, optional `gameCode` on `com_ticket_grants`; additions only).
**Texts:** `src/i18n/locales/*/pubgame.json`, `src/i18n/locales/*/commerce.json`.
**Tests:** new `src/__tests__/pub-game-seats.test.ts`, `src/__tests__/commerce-groups.test.ts`; added to `pub-game-screens.test.tsx`, `pub-game-store.test.ts`, `commerce-store.test.ts`; `e2e/commerce.spec.ts`.
**Docs:** `CLAUDE.md`, this report.

## 3. Database changes

Optional fields only (no migration): `pub_games.seatLimit`, `com_ticket_grants.gameCode`. Existing games and tickets work unchanged (a missing field = no limit / unused). Test database exercised by `npm run test:db`; production untouched (`npm run db:setup` updates the validation).

## 4. Tests (all actually run, 2026-10-16)

| Check | Result |
|---|---|
| `npm run typecheck`, `npm run lint`, `npm run i18n:check` | ✅ (599 texts × 8 languages) |
| `npm run test:coverage` | ✅ **1,308 / 1,308** (72 files). Coverage: statements 94.96 %, branches 89.26 %, functions 98.43 %, lines 98 %. (A first run had 1 failure: an existing test compared the lobby exactly and didn't know the new `seats: null`; the test was updated, the behaviour is as intended.) |
| `npm run test:db` (Atlas test database) | ✅ 53 passed, 2 skipped (placeholders): seat limit kept through actions; ticket reservation atomic, never on a revoked ticket |
| `npm run build` | ✅ |
| Playwright `commerce` + `pub-game` specs (production build, sales closed) | ✅ 15 / 15: the full Hidden Pubs multiplayer suite (3 phones, 12 cafés, late joiner, 10 phones + an 11th refused by the team size, reload/lost connection, GPS, bonus photo) passes unchanged |
| Playwright full suite | left to CI on the pull request |

Brief scenarios: groups of **2, 4, 6 and 10** (service level and through the real routes); invalid ticket / no ticket (403); expired or revoked ticket; **full group**; **double joining** (same phone gets its own player back); **simultaneous joining** for the last place; second game with the same ticket, also **at the same moment**; host loses the connection / player returns (cookie, existing claim link); **state after a server restart** (same store, new service instance); access without a valid paid ticket; sales closed = unchanged.

**Not tested:** a real purchase through Stripe test mode and a game created from it in a browser (no Stripe test keys yet; the route tests use the same services with a fake Stripe). See section 8.

## 5. Security checks done

- The seat limit is decided by the server (ticket), never by the request body (tested: a `seatLimit` in the form is ignored).
- Ticket ownership: the ticket cookie on the organiser's phone (hash stored, P2), checked on the server for both the page and the API.
- Race conditions: ticket reservation is a conditional update (`gameCode` must still be the expected value, ticket active); the seat check runs inside the optimistic version check of the game save.
- No new endpoints; the existing same-origin/JSON checks of `/api/games` apply. WhatsApp link: opened only on tap, `rel="noopener noreferrer"`, no data sent anywhere by the app.

## 6. Open points

1. **Rename the group / remove participants** (brief 2.2): need new Hidden Pubs actions → your decision (game-rule change).
2. A **refunded** ticket after its game was created: the game continues (stopping a game mid-play wasn't asked); new players can still join up to the limit. Decide if a refund should close joining.
3. The organiser must open the ticket link on the phone that creates the game. Players never need a ticket: they join with the game link.
4. Translations by AI: native-speaker check recommended (as in P2).

## 7. External configuration / costs

None new. Same as P2 (Stripe test account, Vercel variables, `npm run db:setup`). No new dependencies.

## 8. How to test it yourself (test mode, local)

1. Set up P2's local test (see PHASE_2_REPORT §9) and put **Hidden Pubs** on sale in `/admin/products` (with a tax category).
2. On `/walks/hidden-pubs` buy 3 persons (card 4242 4242 4242 4242); open the ticket link from the email (terminal) on the same browser.
3. "Start" → `/games/new` shows "Your ticket is for 3 persons"; create the game: the lobby shows "1 of 3 places taken" and the WhatsApp button.
4. Join from two other browsers (private windows): the third extra one sees "game full".
5. Open `/games/new` again on the organiser's browser: "already belongs to a game" with a link back.
