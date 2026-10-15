# Hidden Antwerp: architecture audit for the commercial platform (Phase 0)

Date: 2026-10-15. Written from the code on branch `optimization/audit` (commit `20fd023`) and the open pull requests.
No code was changed for this audit. The other documents in this folder build on it:
[COMMERCIAL_IMPLEMENTATION_PLAN.md](COMMERCIAL_IMPLEMENTATION_PLAN.md), [DATABASE_DESIGN.md](DATABASE_DESIGN.md),
[SECURITY_AND_GDPR.md](SECURITY_AND_GDPR.md) and [TEST_STRATEGY.md](TEST_STRATEGY.md).

---

## 1. The most important findings first

1. **`main` is far behind.** `main` = PR #1 (phase 9). Hidden Pubs 2.0 (PR #3), MongoDB (PR #4, stacked on #3) and the optimisation (PR #5, stacked on #4) are **open, not merged**. PR #2 (Classics audio guide + quests) is a separate branch that **differs in 516 files** from `optimization/audit`, so a large merge conflict is waiting. Commercial work must not start on top of four unmerged PRs. See plan step P0.
2. **There are no accounts, no logins, no roles, no admin area and no email** in the code. The only "roles" are the per-game Hidden Pubs host (`isHost` in the game state) and the host page `/games/<CODE>/host` (evidence approval), identified by an httpOnly cookie. Everything the brief says about "existing accounts / admin pages / email" has to be **built new**.
3. **Several assumptions in the brief do not match the code** (section 9): "17 Gates", group voting in Hidden Pubs, Dark Antwerp/Rubens Code as products, per-person prices.
4. **Hard blockers for selling, outside the code:** Smekens drawing rights for the Poortjes walk not cleared; all content `contentStatus: "placeholder"` (not historian-reviewed, `[research required]` markers); all 61 coordinates `to-verify`; the site is `noindex` on purpose. Hosting plan and VAT status unknown (section 8).
5. **Good foundation to reuse:** the Hidden Pubs server layer (Route Handlers, `game-service`, optimistic versioning, idempotent `actionId`s, MongoDB with `$jsonSchema` validation and indexes from one schema file, httpOnly-cookie identity with only a SHA-256 hash stored, same-origin + JSON-only POST checks), the custom i18n layer (8 languages), security headers, CI with unit + browser tests.

---

## 2. Branches and open work

| Branch | State | Notes |
|---|---|---|
| `main` | Production (Vercel auto-deploy) | Protected: PR + green CI only (also for admins). |
| `feature/hidden-pubs-2` | PR #3 open | Multiplayer game. |
| `feature/mongodb` | PR #4 open, on #3 | Atlas store. |
| `optimization/audit` | PR #5 open, on #4 (current branch, clean) | 28 commits ahead of `main`. |
| `feature/classics-audio-quests` | PR #2 open | Not contained in `optimization/audit`; 516 files differ. |
| `backup/pre-i18n`, `feature/i18n-8-languages`, `fix/phase-0…9` | Local, merged or snapshots | Can be cleaned up later (not by me without your OK). |

Working tree: clean (only these new documents are added, uncommitted).

---

## 3. Stack and runtime

- Next.js **16.3.8** App Router (Turbopack), React 19.2, TypeScript strict, Tailwind v4.
- Runtime dependencies: `next`, `react`, `react-dom`, `maplibre-gl`, `mongodb` 6, `@vercel/blob` 2, `qrcode-generator`. **No** auth, payment, email, validation (e.g. zod) or chart library.
- Hosting: Vercel (main → Production; PR previews SSO-protected). One cron job (`vercel.json`: media cleanup 04:00 daily).
- Node 20 local, 22 in CI.

## 4. Frontend architecture

- Pages are Server Components; walks come from `walkRepository` (`MockWalkRepository` over `src/data/walks`). Pages don't know the data source, so a database-backed catalogue can be swapped in later.
- Routes: `/`, `/walks`, `/walks/[slug]`, `/walks/[slug]/play`, `/games/new`, `/games/[code]`, `/games/[code]/host`, `/games/[code]/claim`.
- Walk player: client state + pure reducer, progress in **localStorage only** (`hidden-antwerp:playtest:<slug>`). **The server never knows that a guide walk was started or completed.** That matters for "completed walks" KPIs and follow-up emails (section 9).
- Themes per walk (`classic`/`tavern`/`archive`), mobile-first, accessibility rules (focus h1, live status regions, `ConfirmDialog`).
- **The play page is open to everyone.** Walk content is server-rendered and sent to the browser as props. A paywall has to sit on the server (`/walks/[slug]/play` page + data), not in a client check.

## 5. Backend architecture (only Hidden Pubs)

| Route | What |
|---|---|
| `POST /api/games` | Create a game (organiser = host). **Open to anyone, no limit.** |
| `GET/POST /api/games/[code]` + `join`, `state` (polling `?since=`), `actions`, `claim`, `reveal`, `media/upload`, `media/file`, `players/[playerId]` | Game play |
| `GET /api/cron/media-cleanup` | Daily cleanup, needs `CRON_SECRET` |

- `server/http.ts`: same-origin check, JSON only, 10 kB body cap, `no-store`. **No rate limiting anywhere** (only body size and origin).
- `server/game-service.ts`: load → pure `applyPubGameAction` → save with version check, retries on conflict; `actionId` makes retries idempotent.
- `server/context.ts`: memory stores in dev, MongoDB + Blob in production.
- Identity (`server/identity.ts`): 32-byte random token in cookie `hp_<CODE>`, stored as SHA-256. Game codes: 6 characters from a 31-letter alphabet (~8.9 × 10⁸ codes), fine for a 7-day game but **too weak as a proof of payment on its own**.
- Synchronisation: every phone polls `state` every 2 s while visible; versioned events give each phone its popups once. Reconnection = reload; the cookie identifies the player. This already covers "offline players", "reconnection without losing progress", "one central state per group" and "server-side validation" from the brief.

## 6. Database (MongoDB Atlas)

- One database `HiddenAntwerpGeneral` (prod), `…_test` for `npm run test:db`. Schema, validation and indexes live in `db/mongo-schema.mjs` (`db:setup` only adds, `db:check` is read-only).
- 4 collections: `pub_games`, `pub_game_actions` (unique gameCode+actionId), `pub_game_events`, `pub_game_players`. **All with a TTL index: deleted 7 days after creation (D29).**
- Consequence: anything commercial (orders, tickets, invoices, groups that must outlive a game) **cannot live in these collections**. New collections, no TTL on financial records.
- One `MongoClient` per server instance (`server/mongo.ts`, kept on `globalThis`). Reusable for the new modules.
- Atlas tier and backups: **unknown from the code**. The free M0 tier has no backups (to check in Atlas).

## 7. Translation system

- 8 locales (en master/fallback, nl, fr, es, it, de, ru, uk), custom layer on `Intl`, no package. Cookie `ha-locale`, **no locale in the URL**.
- UI texts in `src/i18n/locales/<lang>/*.json`, typed keys, `npm run i18n:check`, `no-hardcoded-text.test.ts`.
- **SEO conflict:** hreflang and indexable language versions need a separate URL per language. Today the same URL serves 8 languages depending on a cookie. Phase 6 needs a decision (plan, decision B4). Changing it is an architecture change and affects a "decision to keep" in `CLAUDE.md`.

## 8. Deployment, CI, configuration

- CI (`.github/workflows/ci.yml`): typecheck → lint → i18n:check → unit tests with coverage → build → Playwright (390 px). ~1,030 unit tests. A good regression net; commercial modules plug into it.
- Env vars (`.env.example`): `MONGODB_URI`, `BLOB_READ_WRITE_TOKEN`, `CRON_SECRET`, `TEST_MONGODB_URI`, `MEDIA_DOWNLOAD_TOKEN`, optional map/playtest/dev ones. All secrets server-only.
- Security headers in `src/lib/security-headers.ts`; **CSP is Report-Only**. Stripe Checkout (redirect) needs `checkout.stripe.com` only as a navigation target; Stripe.js/Elements would need CSP additions (we propose redirect Checkout, so no extra scripts).
- **Vercel plan unknown.** Vercel's Hobby plan is for non-commercial use only; selling tickets requires a **Pro** plan (to confirm on your account).

## 9. The brief compared with the code

| Brief says | Code says | Consequence |
|---|---|---|
| "17 Gates" | The gates walk is **Poortjes van Antwerpen / The Gates of Antwerp**: 35 stops (33 + 2 optional), 52 drawings. No "17". | Is "17 Gates" a new, shorter product or a marketing name for Poortjes? **Your decision.** |
| Dark Antwerp, Rubens Code | Only "coming soon" cards (`upcoming-walks.ts`), no stops or content. | Not sellable; landing pages only as "coming soon" (as the brief itself allows). |
| Hidden Pubs "group voting" | The current game (HIDDEN_PUBS_CONCEPT.txt) has **no voting**: teams, Drunken Bastard cards, pubtasks, bonus tasks, host approval. Drink votes belonged to the old one-phone engine, removed in stage 12b. | Nothing to build or keep; the concept stays the source of truth. Tests in Phase 2 cover the real mechanics. |
| Group packages of 2–10 players | The game allows 1–10 teams × 1–10 players (up to 100). | A package sets a **seat limit** that the join route enforces; the game rules don't change. |
| Prices per person (€7.95 / €9.95 / €14.95 / €12.95) | Display prices today: Classics €9.95, Poortjes €12.95, Hidden Pubs €14.95; `Price` is documented as **"per team/group"**. | Prices move to the database (admin-editable). The per-person vs per-group model needs your confirmation (`Price` gets a `unit`). |
| Existing accounts, roles, admin pages | None, except the per-game host. | Admin/partner authentication is new work (largest security risk). |
| Existing email | None. | Email provider is new (decision). |
| "Completed walks", follow-up email after a walk | Guide walk progress is localStorage only; the server learns nothing. Hidden Pubs knows when a game ends. | Needs a small, privacy-safe "walk completed" call tied to a ticket (never a location). Your decision (D-list in the plan). |
| Brewery campaigns | Alcohol rules in `CLAUDE.md`: never celebrate or count drinking, alcohol-free equal, no drink stats. | Brewery sponsorship must fit those rules (e.g. a partner listing, never "drink brand X" tasks or drink counts). **Your decision**, and probably legal/ethical review. |
| Review → 10% discount | EU/Belgian consumer law: incentivised reviews must be disclosed, the reward may not depend on a positive review, and you must say how you check that reviews are from real customers. | Discount for *any* review (or for completing the walk), labelled. See SECURITY_AND_GDPR.md. |
| Public SEO pages | Site is `noindex` because content is placeholder; Smekens rights not cleared. | SEO goes live only when content and rights are ready. |
| "Use existing admin architecture and visual style" | Only the host dashboard exists (game-specific). Visual style: design tokens in `globals.css`, `Button`, `Badge`, `Dialog`… | Admin reuses the UI components and tokens; layout is new. |

## 10. Strengths to keep and reuse

- Server-decides-everything model, idempotent actions, version checks: the same pattern fits orders and webhooks.
- Schema-as-code (`db/mongo-schema.mjs`) with `db:setup`/`db:check`: extend with the commerce collections.
- Hash-only token storage, httpOnly cookies, same-origin checks: reuse for tickets, admin sessions, invitation links.
- Error logging without messages (`lib/log-error.ts`): matches "no payment secrets in logs".
- Test culture (pure logic + component + e2e + DB tests against a separate database).

## 11. Weak points for a commercial product

- No rate limiting, no bot protection on public POST routes.
- CSP still Report-Only.
- Unknown backups (Atlas tier) and unknown Vercel plan.
- Node 20 locally (end of life).
- Content and rights not ready to sell.
- A single database user for everything (to check in Atlas: least privilege per environment).
