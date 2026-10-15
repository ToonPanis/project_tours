# Hidden Antwerp: commercial database design

Date: 2026-10-15. Status: **proposal**. Same Atlas database as Hidden Pubs (`HiddenAntwerpGeneral`; tests in `…_test`), new collections with the prefix `com_`. Defined like the existing ones in `db/mongo-schema.mjs` (`$jsonSchema` validation, indexes, `db:setup` add-only).

> **Update after decision B3 (2026-10-15):** every product is sold **per person**. `kind: "group-package"` and `unit: "group"` below are not used for now; a Hidden Pubs order of N tickets gives N seats.
> **Built in P1:** `com_users`, `com_login_tokens`, `com_sessions`, `com_audit_log`, `com_rate_limits`, `com_products`, `com_prices`, `com_email_outbox` (see `db/mongo-schema.mjs`, the source of truth).

## Rules for every commercial collection

- **Money as integers in cents** (`amountCents`), currency `"EUR"`. Never floats. Rounding happens once, in pure tested functions.
- **Prices are snapshotted** into the order (net, VAT, gross per line). A later price change never changes an old order.
- **No TTL on financial records** (orders, payments, invoices, commission ledger). Personal data in them is minimal and is pseudonymised after the legal retention period by a retention job.
- **Secrets hashed:** tokens for tickets, invites, login links and unsubscribe links are stored as SHA-256 only.
- **No card data** ever (Stripe holds it). We store only Stripe ids (`cs_…`, `pi_…`, `re_…`, `evt_…`).
- **No locations** ever.
- `createdAt`/`updatedAt` as BSON dates; ids as strings (random, URL-safe).
- Existing `pub_*` collections and their 7-day TTL are **not changed**.

## Collections

| Collection | Purpose | Key fields | Indexes | Retention |
|---|---|---|---|---|
| `com_products` | What can be sold | `_id` (e.g. `classics-ticket`), `walkSlug`, `kind` (`ticket` \| `group-package` \| `corporate`), `active`, `names` per locale (optional override), `vatRateBasisPoints` (from accountant), `sortOrder` | `walkSlug`, `active` | Kept |
| `com_prices` | Versioned prices per product | `productId`, `unit` (`person` \| `group`), `minQty`, `maxQty` / `seats`, `amountCents` (gross incl. VAT), `validFrom`, `validTo`, `createdBy` | `productId + validFrom` | Kept (history needed for audit) |
| `com_discounts` | Discount definitions | `codeHash` or `code` (uppercase), `type` (`percent` \| `fixed`), `value`, `productIds`, `validFrom/To`, `maxRedemptions`, `perCustomer`, `singleUse`, `source` (`admin` \| `review` \| `partner` \| `promo`), `active` | unique `code` | Kept |
| `com_discount_redemptions` | Each use of a code | `discountId`, `orderId`, `status` (`reserved` \| `used` \| `released`), `expiresAt` for reservations | unique `discountId + orderId`; count by `discountId` | Kept |
| `com_orders` | One checkout | `_id`, `status` (`pending` → `paid` \| `failed` \| `canceled`; `paid` → `refunded` \| `partially-refunded`), `lines[]` (productId, qty, unit price, net, VAT, gross), `totals`, `discountId`, `partnerId` (attribution), `locale`, `email` (buyer), `billing` (only for invoices: name, company, VAT number, address), `stripe` (`checkoutSessionId`, `paymentIntentId`), `idempotencyKey`, `createdAt`, `paidAt` | unique `stripe.checkoutSessionId`; `status + createdAt`; `partnerId + paidAt`; `email` | 10 years (Belgian accounting rule, confirm with accountant); email/billing pseudonymised after |
| `com_payments` (or embedded in order) | Payment and refund events from Stripe | `orderId`, `type` (`charge` \| `refund`), `stripeId`, `amountCents`, `status` | unique `stripeId` | As orders |
| `com_stripe_events` | Webhook idempotency | `_id` = Stripe `evt_…` id, `type`, `status` (`processing` \| `done` \| `failed`), `attempts`, `receivedAt`, `processedAt` | `_id` unique by nature | 90 days (TTL OK here: Stripe keeps its own) |
| `com_access_grants` | Tickets: the right to play | `_id`, `orderId`, `productId`, `walkSlug`, `tokenHash`, `seats` (persons/players), `usedSeats`, `status` (`active` \| `revoked` \| `expired`), `validUntil`, `source` (`purchase` \| `promo` \| `corporate`), `gameCode` (Hidden Pubs, once created) | unique `tokenHash`; `orderId` | Until `validUntil` + 1 year |
| `com_groups` | Commercial group around a Hidden Pubs game | `_id`, `grantId`, `name`, `inviteCodeHash`, `seatLimit`, `gameCode`, `status`, `createdAt` | unique `inviteCodeHash`; `gameCode` | Group name/players follow the game's 7 days (names live in `pub_games`); the group record keeps no names |
| `com_quotes` | Corporate quote requests | `company`, `contactName`, `email`, `phone?`, `date`, `participants`, `activity`, `language`, `formula` (`self` \| `guided`), `wishes`, `status` (`NEW` … `CANCELLED`), `history[]` (status, by, at), `dedupeKey` | `status + createdAt`; `dedupeKey` (24 h) | 2 years if not converted (to decide), else as orders |
| `com_partners` | Hotels, cafés, tourism, corporate | `_id`, `code` (unique, e.g. `HOTELJULIEN`), `type` (`HOTEL_PARTNER` …), `name`, `commission` (`{ kind: "percent-net" \| "fixed-per-ticket" \| "fixed-per-booking" \| "none", value }`, versioned with `validFrom`), `active`, contact (minimal) | unique `code` | Contract period + 10 years for ledger references |
| `com_partner_stats` | Click counters, **no IP, no visitor id** | `partnerId`, `day`, `clicks`, `campaign` | unique `partnerId + day + campaign` | 3 years |
| `com_commission_ledger` | Append-only commission entries | `partnerId`, `orderId`, `type` (`accrual` \| `reversal` \| `adjustment` \| `payout`), `amountCents` (signed), `status` (`pending` → `approved` → `payable` → `paid`; `reversed`), `rule` snapshot, `createdAt` | unique `orderId + type` for accruals; `partnerId + status` | 10 years |
| `com_invoices` | Our record of invoices / credit notes | `number` (gap-free sequence per year), `kind` (`invoice` \| `credit-note`), `orderId`, `provider` + `providerId` (Peppol tool), `pdfUrl` (private), `issuedAt` | unique `number`; `orderId` | 10 years |
| `com_counters` | Gap-free sequences (invoice numbers) | `_id` = `invoice-2026`, `next` | – | Kept |
| `com_reviews` | Verified reviews | `grantId` (proof of participation), `walkSlug`, `rating` 1–5, `text` (max ~1,000), `locale`, `displayName?`, `status` (`pending` \| `approved` \| `rejected`), `incentivised` (bool, shown), `createdAt` | unique `grantId` (one per ticket), `walkSlug + status` | While published; deletable on request |
| `com_completions` | "Walk completed" signal (B9) | `grantId`, `walkSlug`, `completedAt` | unique `grantId + walkSlug` | 2 years |
| `com_email_outbox` | Emails to send, idempotent | `_id` = `<template>:<entityId>` (e.g. `order-paid:ord_123`), `to`, `template`, `locale`, `data`, `status`, `attempts`, `nextAttemptAt`, `providerMessageId` | `_id`; `status + nextAttemptAt` | 90 days, then delete (keep only provider id in order history) |
| `com_consents` | Marketing consent log | `emailHash`, `purpose` (`marketing`), `given`/`withdrawn` at, `source`, `textVersion` | `emailHash + purpose` | As long as relevant + proof period |
| `com_suppressions` | Unsubscribed / bounced addresses | `emailHash`, `reason` | unique `emailHash` | Kept (needed to respect opt-out) |
| `com_users` | Admins and partner users | `_id`, `email`, `roles` (`ADMIN`, `PARTNER_<TYPE>`, later `SUPPORT`), `partnerId?`, `active`, `lastLoginAt` | unique `email` | While active + 1 year |
| `com_sessions` | Login sessions | `tokenHash`, `userId`, `expiresAt`, `createdAt`, `userAgentHint?` | unique `tokenHash`; TTL `expiresAt` | TTL |
| `com_login_tokens` | One-time login links/codes | `tokenHash`, `email`, `expiresAt` (15 min), `usedAt` | TTL | TTL |
| `com_audit_log` | Who changed what (prices, refunds, roles, partner rules, data requests) | `actorId`, `action`, `target`, `before`/`after` (no secrets), `at` | `at`; `target` | 2 years (to decide) |
| `com_rate_limits` | Fixed-window counters | `_id` = `<route>:<key>:<window>`, `count`, `expiresAt` | TTL | TTL (minutes) |
| `com_settings` | Feature flags, attribution window, company details on invoices | `_id`, `value` | – | Kept |

## Important flows

**Checkout:** `POST /api/checkout` reads the active price from `com_prices`, applies the discount (reserved redemption with a 30-minute expiry), stores a `pending` order with the computed totals, creates a Stripe Checkout Session with `line_items` built from **our** amounts and `metadata.orderId`, `client_reference_id = orderId`, and an `Idempotency-Key`.

**Webhook:** verify the signature on the raw body → insert `com_stripe_events` (`_id` = event id; a duplicate key error = already seen → 200) → in one MongoDB transaction: load order, check amount/currency/session id against the order, move `pending → paid`, create the access grant, mark the redemption `used`, add the commission accrual, enqueue emails in the outbox → mark the event `done`. On failure: event stays `failed`, we return 500, Stripe retries (exactly that is the retry mechanism).

**Refund:** from admin → Stripe Refund API (idempotency key) → `charge.refunded` webhook → order `refunded`, grant `revoked` (if not used, per policy), commission `reversal` entry, credit note, email.

**Hidden Pubs link:** `/games/new` with a ticket cookie → `createGame` gets `seatLimit` from the grant → the grant stores `gameCode`. The join route checks `players.length < seatLimit`. The `pub_games` document gets two optional fields (`orderId`, `seatLimit`), validated in the schema. **No change to the game logic.**

## Migration

Only additions: new collections and two optional fields on `pub_games`. `db:setup` creates them; `db:check` reports them. No existing document is changed or deleted.
