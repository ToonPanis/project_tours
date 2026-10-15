# Hidden Antwerp: test strategy for the commercial platform

Date: 2026-10-15. Status: **proposal**. Builds on the existing setup: Vitest 4 + React Testing Library (~1,030 tests), coverage thresholds for logic folders, Playwright on a 390 px phone against the production build, MongoDB store tests against a separate `…_test` database, CI on every PR.

## 1. Principles

- **Pure logic first.** Pricing, discounts, VAT split, rounding, commission calculation, attribution, order state transitions and seat limits are plain functions in `src/features/commerce/logic/` with high coverage (added to the thresholds in `vitest.config.mts`).
- **Services with memory stores** (like `pub-game`): the same service tests run against the memory store in CI and against MongoDB with `npm run test:db`.
- **Stripe is never called in CI.** Webhook tests sign payloads with a test secret via the SDK's test-header helper; the Stripe client sits behind an interface with a fake. Manual tests use Stripe test mode + Stripe CLI (`stripe listen`, `stripe trigger`).
- **Email is never sent in CI:** a memory outbox, asserted in tests.
- **Tests take texts from the translations and data from the data files** (existing rule): no literal product names or UI texts.
- **Nothing is called "tested" in a report unless it actually ran.**

## 2. Regression net for existing features (every PR)

| Area | Existing coverage | Added for commerce |
|---|---|---|
| Hidden Pubs rules, cards, scoring, sips, player view | Unit + e2e `pub-game.spec.ts` | Same suite with `COMMERCE_ENABLED=true` and a test grant: game must behave identically. |
| Café order / route groups | Unit (`route`) | Unchanged; a test that `route-groups.json` is not touched by commerce code. |
| Guide walks, session, storage migration | Unit + e2e | Play page with/without a ticket (flag on), and unchanged with flag off. |
| GPS, map, privacy | e2e (no location in storage/requests) | Extended: no location in any commerce request or email. |
| i18n | `i18n:check`, content tests | New keys in all 8 languages; emails rendered in all 8. |
| Alcohol rules | `pub-game-*` tests | Reviews/emails/landing texts: no drink counts, "any drink counts" kept. |

## 3. Phase tests (from the brief, mapped to layers)

**Payments (P2):** successful payment → one grant; failed; canceled (session expired); duplicate webhook → still one grant; **concurrent** delivery of the same event (two parallel calls) → one grant; wrong signature → 400 and nothing changes; amount manipulation (client sends a price → ignored; webhook amount ≠ order total → order flagged, no grant); discount code (valid, expired, max reached, wrong product, reused); refund (full/partial → grant revoked per policy, commission reversed, credit note queued); Stripe unavailable (checkout shows a friendly error, no orphan grant); invoice record created once.

**Groups (P3):** groups of 2, 4, 6 and 10 players (e2e with several browser contexts, as `pub-game.spec.ts` already does); invalid code; expired grant; full group (11th player refused); same player joining twice (cookie → same player); two players joining at the same moment for the last seat (one wins); host loses connection and comes back (cookie); late player via the host's claim link; state after a server restart (MongoDB store test); creating a game without a valid ticket (refused when the flag is on).

**Partners (P7):** attribution from `?ref=`; two partners in one journey (rule: last click within the window, documented); duplicate commission (unique index); refund → reversal; changed commission rate (old orders keep their snapshot); partner A cannot read partner B (every route); rounding: totals over many orders equal the sum of rounded lines (fixed rule, tested with edge amounts).

**Corporate (P4):** validation of every field; honeypot and too-fast submission; duplicate request within 24 h; rate limit; confirmation and admin emails queued once; status workflow transitions (allowed and refused); only admins can read quotes.

**Admin (P5):** every admin route refuses no session, an expired session, a partner session; pagination and date filters (time zone Europe/Brussels, month boundaries); KPI sums equal the underlying orders (gross, net, VAT, refunds, commissions separate); audit log entry for each change.

**Emails, reviews, discounts (P8):** one email per event (idempotent outbox id); invalid address; provider error → retry with back-off, then `failed`; unsubscribe works and is respected; expired codes; code of a refunded order; reviews only with a valid ticket, one per ticket, moderation states; templates in 8 languages.

**Security (all phases):** auth and role tests per route; injection payloads (`{"$gt": ""}`, very long strings, wrong types); XSS strings in names/reviews rendered escaped; rate limits; secret scan; webhook raw-body test.

## 4. End-to-end (Playwright)

- A Stripe-free e2e path: the test build uses a fake payment provider (like `PUB_GAME_MEMORY_STORES=true` for games) that "completes" checkout through the same webhook handler with a test signature. Never enabled on Vercel.
- Purchase → ticket link → play page; group package → invite link → 2+ phones join → game starts; quote form; admin login (test magic link from the memory outbox); partner portal isolation.
- Layout at 390 px with long German words and Cyrillic for every new page.

## 5. CI changes

- Same workflow; new tests just join `test:coverage` and `test:e2e`.
- Optional: `npm audit --omit=dev` as a non-blocking step; a job matrix with the commerce flag on/off for the e2e suite if the run time allows.
- `test:db` stays manual (needs the Atlas test database); run before each phase report and recorded in it.

## 6. Manual test checklist per phase (in the phase report)

Stripe test mode with test cards (success, 3-D Secure, declined), Stripe CLI webhook forwarding to `npm run dev`, real phone test over LAN (`DEV_ALLOWED_ORIGINS`), check of emails in the provider's test/sandbox, CSP console check on a production build, Vercel Preview with test keys.
