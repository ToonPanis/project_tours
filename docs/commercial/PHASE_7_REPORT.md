# Phase 7 report: partner codes and commissions

Date: 2026-10-17. Branch: `commercial/p7-partners` (from `main` = `28db53b`, after P5). Not merged, not deployed.
Brief: phase 3 "Partnercodes en commissies" (my step P7). P6 (invoicing via Billit) waits for the Billit account and business details (B7).

## 0. Decisions used (please confirm)

The two questions at the start of P7 were not answered; I built the recommended options, both easy to change:

| Question | Built | Change later |
|---|---|---|
| Attribution | First-party cookie, **30 days**, **last click wins** | `PARTNER_ATTRIBUTION_DAYS` in `src/features/commerce/config.ts`; "first click" = one condition in `recordPartnerClick` |
| Approval of commissions | **Admin approves by hand** (with a button "approve all older than 14 days"); no cron | A daily cron calling `approveOldCommissions` (needs `CRON_SECRET`) |

⚖️ **To check before launch:** whether the referral cookie may be set without consent under Belgian cookie rules (it holds only the partner code, an optional campaign and the click time; no personal data, no tracking across sites). If consent is required, the cookie is set only after consent; the rest stays the same.

## 1. What was built

| Brief | Built |
|---|---|
| **3.1 Partner accounts** | Partners with a type (`HOTEL_PARTNER`, `HORECA_PARTNER`, `TOURISM_PARTNER`, `CORPORATE_PARTNER`). Portal users are created by an admin (no sign-up) and sign in with the same one-time email link as the admin (B5), own cookie `ha_partner`. **A partner only ever sees its own data**: the partner id always comes from the session, never from the address or a form. |
| **3.2 Codes, link, QR, overviews** | Unique code (`HOTELJULIEN`), personal link `…/?ref=HOTELJULIEN` (optionally `&c=campaign`), downloadable QR code (SVG, made on the server with the QR library Hidden Pubs already uses), overviews of visitors, sales and commissions. A purchase later within the window counts (cookie). |
| **3.3 Commission system** | Percent of the net price **excluding VAT**, fixed per ticket, fixed per booking, or none (statistics only). Booked only when Stripe's webhook confirms the payment; a refund cancels or lowers it. |
| **3.4 Partner dashboard** | `/partner`: visitors via the link, sales, conversion, revenue excl. VAT, commission in the period, outstanding and paid commission, revenue and commission per day/week/month (chart + table), a sales list. Filters: date, product, campaign. In all 8 languages. |
| **3.5 Payouts** | An append-only **commission ledger** with the statuses pending → approved → payable → paid, and reversed. **No automatic payouts**: "paid" records a bank transfer the owner made (with its reference). Stripe Connect is not built (see §7). |
| **3.6 Tests** | See §4. |

Also: `/admin/partners` (list with totals, new partner, ledger of all partners with status filter and bulk steps), `/admin/partners/[id]` (details, link, QR, portal users, ledger), the admin dashboard now shows commissions and revenue per partner, and the orders CSV has a `partner_code` column.

## 2. Attribution rules

1. A partner link is any page of the site with `?ref=<CODE>` (and optionally `&c=<campaign>`).
2. `src/proxy.ts` (Next.js 16's name for middleware) sends such a request to `/api/r`, without touching the database. `/api/r` checks the code, counts the click, sets the cookie and sends the visitor to the same page without the parameters. An unknown or inactive code changes nothing and never blocks the visit; `to` can only be a path on our own site (no open redirect).
3. The cookie `ha_ref` (httpOnly, SameSite=Lax, 30 days) holds `CODE.campaign.clickTime`. Another partner's link later replaces it: **the last click wins**.
4. A click is counted per partner, Brussels day and campaign, **without IP address or visitor id**. The same visitor opening the same link again within 30 minutes is one click; one network address counts at most 20 clicks per hour (the rate-limit counter holds only a hash and expires).
5. When the payment page opens, the cookie is checked: within 30 days of the click, not in the future, partner still active → the order stores the partner, the campaign, the click time and **the commission rule of that moment**.
6. Only the webhook's "paid" books a commission (once: fixed id `accrual:<orderId>`).

## 3. Commission and ledger rules

- **Basis** = what was kept, excluding VAT: the order's net excl. VAT after refunds (the same figure as "net excl. VAT" on the admin dashboard).
- Percent: basis × rate, rounded to the cent (half up). Per ticket: amount × persons. Per booking: the amount once. After a partial refund, fixed amounts go down in the same proportion as the money kept. Never more than the basis, never negative.
- **Rounding** happens once per order; reports add whole cents, so a total is always exactly the sum of its lines.
- **Refund**: the commission is computed again. Nothing paid out yet and nothing left to earn → the lines become `reversed`. Otherwise one `adjustment` line with the (negative) difference, id `adjustment:<orderId>:<refunded total>`, which follows the same steps and is settled with the next payout. A retried Stripe event changes nothing.
- **Changed rate**: only for orders started after the change (each order keeps its copy). Tested also for a change while the buyer is on the payment page.
- Admin steps: pending → approved → payable → paid (with the transfer reference); each step is atomic (two admins at once: one wins), skipped lines are reported, every action is in the audit log.

## 4. Tests (all run 2026-10-17)

| Check | Result |
|---|---|
| typecheck, lint, i18n:check | ✅ no errors; every language has every text (780 texts × 8) |
| `npm run test:coverage` | ✅ 1,412 tests passed; coverage 94.3 % statements, 88.0 % branches, 96.8 % functions, 97.3 % lines (above the thresholds) |
| `npm run test:db` (Atlas test database) | ✅ 63 passed, 2 skipped (placeholders), incl. the new partner and ledger contract tests on MongoDB |
| build + Playwright `commerce`, `admin` | ✅ build OK (the proxy is listed as `ƒ Proxy`); 12 browser tests passed. The full browser suite runs in CI. |

`src/__tests__/commerce-partners.test.ts` (36 tests) covers the brief's list:
- **correct attribution**: the order keeps partner, campaign and rule; nothing before payment or for an expired checkout; outside the window, inactive partner or a tampered cookie → nothing;
- **several partners in one journey**: the last click wins;
- **double commissions**: the same webhook twice, twice at the same moment, and "completed" + "async succeeded" → one line;
- **refunds**: partial → negative adjustment; full before payout → reversed; full after payout → negative adjustment; the same refund event again → nothing;
- **changed rates**: old orders keep theirs, also when the change happens during payment;
- **unauthorised access**: a partner's figures contain only its own clicks and sales and no buyer data; an admin session is not a partner session and vice versa; removing a user or switching a partner off ends access at once; the QR route ignores a partner in the address; admin routes answer 401 without a session;
- **reporting and rounding**: the brief's example (15 % of net excl. VAT), per ticket/booking, the cap, rounding per order, ledger totals;
- clicks (repeat within 30 minutes, rate limit, campaigns), `/api/r` (cookie, redirect, no open redirect), the proxy, the admin dashboard's partner figures, sign-in emails in the partner's language.

Store contract tests (memory + MongoDB): partners with unique codes, partner users, click counters (also two at the same moment), a partner's paid orders by date, the ledger (one line per id also at the same moment, atomic steps with history, filters).
Browser tests: an unknown `?ref=` code opens the page normally without the parameter; `/partner` needs a session and its sign-in page fits a phone and is `noindex`; `/admin/partners` needs a session.

Note: one run of the full suite had a 5-second time-out in an unrelated file-scan test (`pub-game-data.test.ts`) while the database tests ran at the same time; alone and in the next full run it passed.

## 5. Files

**New:** `src/proxy.ts`, `src/app/api/r/route.ts`, `src/app/partner/{layout,page}.tsx`, `src/app/partner/login/page.tsx`, `src/app/partner/login/verify/page.tsx`, `src/app/api/partner/auth/{login-link,verify,logout}/route.ts`, `src/app/api/partner/qr/route.ts`, `src/app/admin/(console)/partners/page.tsx`, `src/app/admin/(console)/partners/[id]/page.tsx`, `src/app/api/admin/partners/route.ts`, `src/app/api/admin/partners/[id]/{route,users/route,qr/route}.ts`, `src/app/api/admin/commissions/route.ts`, `src/features/commerce/logic/partners.ts`, `src/features/commerce/server/{referral-service,commission-service,partner-service,partner-auth-service,partner-access,partner-report-service,partner-qr,page-base-url}.ts`, `src/features/commerce/admin/{PartnerForm,PartnerUsers,CommissionLedger}.tsx`, `src/features/commerce/partner/{PartnerLoginForm,PartnerVerifyLogin,PartnerSignOutButton,PartnerFilters}.tsx` + `partner-api.ts`, `src/i18n/locales/<8 languages>/partner.json`, `src/__tests__/commerce-partners.test.ts`, this report.
**Changed:** `src/types/commerce.ts` (roles, `Order.partner`, partner and ledger types, audit actions), `src/features/commerce/config.ts`, `server/{commerce-store,memory-store,mongo-store,http,checkout-service,fulfilment-service,report-service}.ts`, `logic/reports.ts` (per partner, CSV column), `admin/{charts.tsx,admin-api.ts}`, `src/app/api/checkout/route.ts`, `src/app/admin/(console)/{layout,page}.tsx`, `src/i18n/locales/<8>/index.ts`, `db/mongo-schema.mjs`, `src/__tests__/commerce-store.test.ts`, `e2e/commerce.spec.ts`, `CLAUDE.md`.

## 6. Database (add-only; run `npm run db:setup` on production)

- New collections: `com_partners` (unique code), `com_partner_clicks` (TTL 3 years), `com_commission_ledger` (never deleted).
- `com_users`: the role `PARTNER` and the field `partnerId` are allowed (validation update) + index on `partnerId`. **Important:** without `db:setup` (which updates the validation), saving a partner user fails in production.
- `com_orders`: optional field `partner` + index `partnerId_paidAt`.
- Nothing is deleted or rewritten; existing orders simply have no partner.

## 7. Security, GDPR, money

- Partner isolation (risk R5): the partner id comes from the session in every portal page and route; tested.
- No buyer data in the portal: no names, emails or order ids; only date, product, persons, amounts, status.
- Clicks: no IP, no visitor id; the cookie has no personal data (⚖️ consent question above).
- **No money moves automatically.** Stripe Connect could pay partners later, but it brings onboarding of each partner (KYC), Connect fees, a platform agreement and accounting questions (self-billing, VAT on commissions ⚖️). Only with your explicit approval, after legal and accounting advice.
- Partners invoice their commission to you (or self-billing with an agreement) — to arrange outside the app ⚖️.

## 8. Open points

1. Confirm the two decisions in §0 (30 days / last click; manual approval).
2. ⚖️ Cookie consent for `ha_ref`; partner agreement and invoices/VAT on commissions.
3. Quote requests (P4) don't carry a partner yet (a CORPORATE_PARTNER referring a company quote): easy to add if wanted.
4. The portal reads at most 50,000 orders/lines per view (like the dashboard): fine for years; then a MongoDB aggregation.

## 9. How to test it yourself

1. Dev server with memory data (Git Bash): `MONGODB_URI= npm run dev`, sign in at `/admin`.
2. `/admin/partners`: create `HOTELTEST` with 15 %. On its page, give access to an email address (the invitation appears in the terminal).
3. Open `http://localhost:3000/?ref=HOTELTEST&c=lobby`: the address loses the parameter; the click appears in the portal.
4. With sales open in test mode (P2 report §9), buy a ticket in the same browser: the order shows the partner; the ledger gets a pending line after the webhook.
5. `/partner/login` with the invited address (link in the terminal) → the portal: figures, filters, QR download.
6. Refund the order partly/fully in `/admin/orders` and watch the ledger; approve → payable → paid with a reference.
