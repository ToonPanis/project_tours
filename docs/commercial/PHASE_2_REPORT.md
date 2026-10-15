# Phase 2 report: Stripe payments, tickets, configurable VAT, invoicing (test mode)

Date: 2026-10-16. Branch: `commercial/p2-payments` (from `main` = `502cd99`, after P1). Not merged, not deployed.
Decisions used: B3 (per person), B7 (Stripe + Billit as intended invoicing provider, modular, Billit only after the account exists), B8 (configurable VAT, no hardcoded rate, admin-only, per-order record, no real sales before confirmation). Package approved by the owner: `stripe@23.0.0`.

**Ticket sales are CLOSED by default** (`COMMERCE_SALES_ENABLED` off): no buy box, play pages unchanged. A live Stripe key is refused while sales are closed. Everything was built and tested in test mode.

## 1. What was built

| Part | How it works |
|---|---|
| **Configurable VAT** (`/admin/tax`) | Regime (not configured / exempt with the accountant's legal mention / VAT-registered), tax categories with any rate, optional OSS rates per EU country, and "approved by the accountant". Every save is a new version with its author (audit log). Changing anything withdraws the confirmation unless it's ticked again. **No rate exists in the code** (the P1 list 0/6/12/21 % was removed); products point to a category. |
| **Per-order tax record** | Each order copies what applied when it was made (`taxBasis`: settings version, regime, category, home rate, that category's OSS rates, exemption mention). When paid, the VAT split is worked out with the buyer's country (`tax`: rate, OSS yes/no, net, VAT, mention). Later changes to the settings never change an order. |
| **Checkout** (`POST /api/checkout`) | The browser sends only walk, persons, optional code and language. The server takes the price from the catalogue, applies and reserves the discount, saves a `pending` order and asks Stripe for a Checkout page with **our total as the only amount**. Stripe collects email, billing country and (optionally) business name and VAT number. Rate limited per network address. |
| **Webhook** (`POST /api/webhooks/stripe`) | Raw body + official signature check (`stripe.webhooks.constructEvent`, 5-minute replay tolerance). The **only** place an order becomes paid. The payment is checked against our order (Stripe session, amount, EUR). Every step is idempotent: atomic `pending → paid`, one ticket per order (unique index), fixed ids for documents and emails; Stripe event ids are recorded. A duplicate or concurrent event changes nothing; an error answers 500 so Stripe retries. Expired / failed payment pages cancel the order and give the discount use back once. |
| **Tickets** | One ticket per paid order, seats = persons. Link `/tickets/open#<id>.<HMAC>` signed with `TICKET_SIGNING_SECRET` (not stored; can be made again for the success page or a resend). Each phone that opens it takes one seat atomically and gets its own httpOnly cookie (hash stored); opening again on the same phone takes no seat. `/walks/[slug]/play` checks on the server; without a ticket it shows "This walk needs a ticket" (walk content never sent). Valid 1 year. |
| **Success / cancel pages** | `/checkout/success?order=…` shows the status from **our database** (never trusts the redirect), only to the browser with the buyer cookie; refreshes itself while waiting for the webhook; shows the ticket link, email and receipt number when paid. `/checkout/canceled` links back only to our own walk pages. |
| **Receipts and invoices** (B7) | Consumers: our own numbered payment receipt `R2026-000001`, credit notes `C2026-…` (explicitly **not** a Peppol e-invoice). Businesses: an invoice request for the `InvoiceProvider` interface; the Billit provider is a **disabled stub** (no account): requests wait as "awaiting-provider" and are listed in red in `/admin/orders` to be made by hand. Nothing pretends to send Peppol. |
| **Refunds** | `/admin/orders/[id]`: full or partial, with confirmation dialog → Stripe Refund API with an idempotency key → the `charge.refunded` webhook records the amount, makes a credit note, emails the buyer; a full refund revokes the ticket (optionally also on a partial one). |
| **Discount codes** (`/admin/discounts`) | Percent or fixed, product limits, dates, maximum uses; switched on/off (never deleted). Checked only on the server; a use is reserved atomically when the payment page opens (so a limited code can't be overused by simultaneous buyers) and released on expiry/failure. |
| **Admin orders** | List with status filter and server-side pagination; detail with lines, discount, buyer/business, VAT applied, tax version used, Stripe ids, ticket (phones used), documents; actions: refund, revoke ticket, free all seats, resend confirmation (all audited). |
| **Emails** | Confirmation (ticket link, total, VAT or exemption mention, receipt number / "invoice follows", validity) and refund emails in the buyer's language, through the P1 outbox (one per order). New daily cron `/api/cron/email-outbox` (vercel.json, `CRON_SECRET`) retries waiting emails. |
| **8 languages** | All buyer screens and emails in `commerce.json` × 8 (translated by a sub-agent following each locale's existing tone; see open points). Admin stays English. |

**Not changed:** Hidden Pubs game rules, café order, walk content, GPS. Hidden Pubs tickets do **not** unlock games yet (P3); the admin products page says to keep Hidden Pubs off sale until then.

## 2. Files

**New (app):**
- `src/features/commerce/logic/` `tax.ts`, `pricing.ts`, `discounts.ts`
- `src/features/commerce/server/` `payment-gateway.ts`, `invoicing.ts`, `ticket-token.ts`, `ticket-service.ts`, `tax-service.ts`, `discount-service.ts`, `checkout-service.ts`, `fulfilment-service.ts`, `document-service.ts`, `order-emails.ts`, `order-admin-service.ts`, `admin-route.ts`
- `src/features/commerce/components/` `BuyBox.tsx`, `OpenTicket.tsx`, `RefreshWhilePending.tsx`, `TicketRequired.tsx`, `commerce-errors.ts`
- `src/features/commerce/admin/` `TaxSettingsForm.tsx`, `DiscountManager.tsx`, `OrderActions.tsx`
- Pages: `src/app/checkout/layout.tsx`, `checkout/success/page.tsx`, `checkout/canceled/page.tsx`, `tickets/open/page.tsx`, `admin/(console)/orders/page.tsx`, `orders/[id]/page.tsx`, `tax/page.tsx`, `discounts/page.tsx`
- Routes: `src/app/api/checkout/route.ts`, `api/webhooks/stripe/route.ts`, `api/tickets/activate/route.ts`, `api/cron/email-outbox/route.ts`, `api/admin/tax/route.ts`, `api/admin/discounts/route.ts`, `api/admin/discounts/[id]/route.ts`, `api/admin/orders/[id]/{refund,revoke-ticket,reset-devices,resend}/route.ts`
- Translations: `src/i18n/locales/{en,nl,fr,es,it,de,ru,uk}/commerce.json`
- Tests: `commerce-p2-logic.test.ts`, `commerce-payments.test.ts`, `commerce-tickets.test.ts`, `commerce-payments-api.test.ts`, `commerce-buyer-screens.test.tsx`, `fixtures/commerce-sales.ts`, `e2e/commerce.spec.ts`

**Changed:** `src/types/commerce.ts` (P2 types; product `vatRateBasisPoints` → `taxCategoryId`), `src/features/commerce/config.ts`, `logic/catalog.ts`, `server/{commerce-store,memory-store,mongo-store,context,http,catalog-service}.ts`, `admin/{ProductEditor.tsx,admin-api.ts}`, `src/app/admin/(console)/{layout,page,products/page}.tsx`, `src/app/api/admin/products/[id]/route.ts` (comment), `src/app/walks/[slug]/page.tsx` (buy box when on sale), `src/app/walks/[slug]/play/page.tsx` (ticket check), `src/i18n/locales/*/index.ts`, `db/mongo-schema.mjs`, `vercel.json`, `playwright.config.ts` (Stripe keys emptied, sales closed), `package.json` + lock (`stripe` 23.0.0), `.env.example`, `CLAUDE.md`, P1 tests (`commerce-logic`, `commerce-catalog`, `commerce-api`, `commerce-store`, `fixtures/commerce-context`).

## 3. Database changes (additions only)

New collections: `com_tax_settings` (unique version), `com_orders` (indexes on createdAt, status, payment intent; kept, no TTL), `com_stripe_events` (TTL 5 days), `com_ticket_grants` (unique orderId), `com_ticket_devices` (TTL = ticket validity), `com_discounts` (unique code), `com_counters`, `com_documents`. Changed validation: `com_products` now requires `taxCategoryId` instead of `vatRateBasisPoints` (no production data existed: `db:setup` was never run on production).
- Test database: updated and exercised by `npm run test:db`.
- Production: untouched. Run `npm run db:setup` before first use.

## 4. Tests (all actually run, 2026-10-16)

| Check | Result |
|---|---|
| `npm run typecheck` | ✅ |
| `npm run lint` | ✅ |
| `npm run i18n:check` | ✅ 8 languages complete (590 texts) |
| `npm run test:coverage` | ✅ **1,281 / 1,281** (70 files). Coverage: statements 94.94 %, branches 89.13 %, functions 98.41 %, lines 97.96 % |
| `npm run test:db` (Atlas **test** database) | ✅ 49 passed, 2 skipped (placeholders): the P2 store contract (orders, atomic transitions, seats, discount reservations, number series, documents, Stripe events, tax versions) on memory **and** MongoDB |
| `npm run build` (without playtest tools) | ✅ |
| Playwright `commerce`, `admin`, `pages` specs (production build, sales closed, no Stripe keys) | ✅ 20 / 20 |
| Playwright full suite | not run locally (it ran out of memory on this machine in P1); left to CI on the pull request |

The brief's scenarios and where they're tested (`commerce-payments.test.ts` unless noted): successful payment; failed payment (async-failed); canceled payment (expired page, discount released once); duplicate webhook; **concurrent** delivery of the same event; wrong signature / missing signature / changed body (`commerce-payments-api.test.ts`, real Stripe SDK check); amount, session and currency manipulation; browser-sent prices ignored; discount codes (valid, expired, unknown, limited under concurrency); refund partial and full, duplicate refund event, refusals; invoice creation (receipt numbering, B2B awaiting Billit); Stripe unavailable (order failed, discount released, nothing charged); tax version kept per order; OSS and exempt regimes; tickets (seats, same phone, concurrency on the last seat, forged/other-key/expired/revoked links, access per walk, reset); admin tax/discount/order actions and their audit lines; buyer screens (no price ever sent, errors in the buyer's language); live key refused while sales are closed.

**Not tested:** a real payment through Stripe's test mode (no Stripe test keys in this environment; the gateway's request is built with the SDK's types and the webhook check uses the real SDK, but `checkout.sessions.create` and `refunds.create` were never called against Stripe). Do step 9 below once the test account exists. Emails through Brevo (no account yet).

## 5. Security checks done

- Amounts only on the server; the webhook re-checks session, amount and currency before granting anything.
- Webhook: raw body, official signature verification, size cap; no same-origin check there (Stripe's servers; the signature is the proof). `constructEventWithoutVerification` is never used.
- Secrets: Stripe keys server-only; live key refused while sales are closed; ticket links HMAC-signed (constant-time comparison); buyer, device and session secrets stored as hashes only; tickets after `#` (never in server logs).
- Every new POST route: same-origin + JSON (`checkPostRequest`) except the webhook; admin routes through one helper (`adminPost`) so none can skip the session check; checkout and ticket activation rate limited.
- NoSQL: every filter value checked in the MongoDB store (tested); request bodies narrowed field by field.
- Logs: Stripe errors by code only, database errors by name; no card data ever reaches our server (Stripe Checkout).
- The cancel page only links to our own walk paths (open-redirect check, tested in e2e).

## 6. Open points

1. **Billit integration** (B7): stub only. B2B invoices and credit notes wait in `/admin/orders` until the account and business details exist; then build `BillitInvoiceProvider` against Billit's API documentation.
2. **VAT treatment** (B8): to be confirmed by the accountant, then entered in `/admin/tax` and confirmed there. B2B specifics (e.g. reverse charge) are not computed by us.
3. **Translations** were made by an AI sub-agent; a native-speaker check is recommended, especially ru/uk (`success.share` and `email.confirmation.linkIntro` were rephrased for correct grammar) and the forms of address (es "tú", de "du" for the buyer).
4. **Hidden Pubs tickets** don't unlock games yet (P3). Keep the Hidden Pubs product off sale.
5. **Free / promo tickets** issued by the admin, and group/corporate orders > 30 persons: later phases (P4/P5).
6. Withdrawal-right text, terms of sale and privacy notice for buyers: legal review needed before real sales (SECURITY_AND_GDPR.md).
7. CSP: Stripe Checkout is a full-page redirect, so no CSP change was needed; re-check when the CSP is enforced.
8. Receipt PDF download: not built (the receipt data is in the email and on the success page).

## 7. External configuration (owner)

| Where | What |
|---|---|
| Stripe (test mode) | Account; API keys (test); webhook endpoint `https://<domain>/api/webhooks/stripe` with events `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`, `charge.refunded`; payment methods (e.g. cards, Bancontact) in the dashboard |
| Vercel (Preview/Production) | `STRIPE_SECRET_KEY` (test), `STRIPE_WEBHOOK_SECRET`, `TICKET_SIGNING_SECRET` (≥ 32 random characters), keep `COMMERCE_SALES_ENABLED` unset; plus the P1 variables |
| Locally | `stripe listen --forward-to localhost:3000/api/webhooks/stripe` for webhooks on the dev server; `npm run db:setup` on production once |

## 8. Costs

No fixed costs. Stripe charges per successful payment (EEA cards roughly 1.5 % + €0.25; check Stripe's Belgian pricing page); test mode is free. Stripe Tax is **not** used (VAT is computed by our own configurable rules). Billit: subscription when connected (to be chosen with the accountant).

## 9. How to test it yourself (test mode, local)

1. `.env.local`: `STRIPE_SECRET_KEY=sk_test_…`, `STRIPE_WEBHOOK_SECRET=<from stripe listen>`, `COMMERCE_SALES_ENABLED=true`, `ADMIN_EMAILS=<you>`. Start in **Git Bash** with the database emptied: `MONGODB_URI= npm run dev`, and in a second terminal `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.
2. `/admin/tax`: regime "VAT-registered", a category with a test rate, tick the confirmation, save. `/admin/products`: give Classics that category, put it on sale.
3. `/walks/classics-of-antwerp`: the ticket box appears; buy 2 persons with Stripe's test card `4242 4242 4242 4242`.
4. The success page shows "payment received" once the webhook arrived; the terminal prints the confirmation email with the ticket link; open it (it takes a seat) and play.
5. `/admin/orders`: see the order, VAT, receipt; refund it and watch the ticket stop working.
