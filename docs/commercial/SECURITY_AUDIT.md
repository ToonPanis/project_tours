# Security and privacy audit of the commercial platform (P9)

Date: 2026-10-17, on `main` after P8 (`c506abb`) plus the P9 changes. Scope: everything added in P1–P8 (admin and partner sign-in, catalogue, Stripe payments and webhook, tickets, Hidden Pubs ticket games, corporate quotes, dashboard and exports, partners and commissions, emails, reviews, discount codes) and how it touches the existing app (walks, Hidden Pubs, GPS). Method: reading every route, service and store method; the existing tests; new automated guards (`src/__tests__/security-guards.test.ts`); `npm audit`.

⚖️ = needs a human legal/accounting decision. Severity = what could happen if the measure were missing; **Status** = where we are now.

## 1. Risk overview

| # | Risk | Severity | Impact | Measure (where) | Status |
|---|---|---|---|---|---|
| A1 | Admin account taken over (stolen mailbox or link) | Critical | Prices, refunds, personal data | One-time links (15 min, once, hash stored, secret after `#`, used by button so mail scanners can't), sessions 12 h httpOnly Secure SameSite=Strict, `ADMIN_EMAILS` re-checked on every request, rate limits per email hash and IP hash, audit log; **P9: an alert email on every admin sign-in** | Done. Open: a second factor (TOTP app code, no new dependency needed) — **decision** |
| A2 | Partner sees another partner's data (IDOR) | High | Leak of sales and commissions | Partner id only from the session (`requirePartner`/`partnerFromRequest`), never from URL/body; tests per route; **P9: a guard test fails if a partner route or page lacks the check** | Done |
| A3 | A protected page or route forgets its check | High | Open admin data | Checks per page/route, never only in a layout; **P9: guard tests for every admin route/page, partner route/page and cron route** | Done |
| A4 | Session theft by XSS | High | Account takeover | httpOnly cookies, React escaping, no `dangerouslySetInnerHTML`; emails escaped (`renderEmail`), only http(s) links; CSV formulas neutralised | Done. CSP still **report-only** (A13) |
| A5 | CSRF on state-changing requests | Medium | Unwanted changes | JSON-only + same-origin check on every POST (`checkPostRequest`/`adminPost`), SameSite cookies; exceptions are signed (Stripe webhook, one-click unsubscribe) or same-origin (uploads); **P9 guard test** | Done |
| A6 | NoSQL injection | High | Data leak/modification | Every filter value through `key()` (short strings only), email matches escaped, `$jsonSchema` validation, no `$where` | Done |
| A7 | Brute force (links, tickets, codes) | Medium | Free access | 32-byte secrets, HMAC-signed tickets/review/unsubscribe links (constant-time compare), rate limits on login, verify, checkout, ticket opening, quotes, reviews, partner clicks; discount codes reserved atomically | Done. `/api/reviews/check` and `/api/unsubscribe` have no rate limit (HMAC makes guessing useless) — low |
| A8 | Forged or replayed Stripe webhooks | Critical | Free tickets | Signature on the raw body, event id stored, atomic `pending → paid`, amount/currency/session compared with our order, idempotent ticket/documents/emails/commission | Done |
| A9 | Double or concurrent events | High | Double tickets, commissions, emails | Fixed ids + unique indexes (ticket per order, ledger ids, outbox ids, review per ticket, follow-up per order), atomic updates; tested also at the same moment on MongoDB | Done |
| A10 | Secrets in code, logs or the browser | High | Account takeover | Env vars only, never `NEXT_PUBLIC_`; errors log names/codes only; **P9 guard tests: no key patterns in tracked files, no secret env as NEXT_PUBLIC_, no email/token/secret in log lines** | Done |
| A11 | Memory stores switched on in production | Medium | Data silently lost per instance | Test flags only in `playwright.config.ts`; **P9: refused when running on Vercel (`VERCEL=1`)** | Done |
| A12 | Database access | High | Leak of everything | Atlas user per environment, Network Access, separate `_test` database for tests, fixed error message on connection errors | Owner: keep the Atlas user limited to the app database; check Network Access |
| A13 | Content Security Policy only report-only | Medium | XSS impact larger | Strict policy written (`security-headers.ts`); enforce after checking real phones with a production build | **Open** (owner test on phones, then one-line switch) |
| A14 | No backups (Atlas free tier) | High | Loss of orders/accounting data | **P9: `npm run db:export`** (read-only, all `com_*` collections as Extended JSON to git-ignored `backups/`, contains personal data: encrypted disk) | Stopgap. Before launch: Atlas tier with backups (decision B12) |
| A15 | Error details leaking | Low | Information for attackers | Generic error codes to clients, names only in logs, Next.js hides stack traces in production | Done |
| A16 | Dependencies | Medium | Known vulnerabilities | `npm audit --omit=dev`: **0** in what runs on the site. 5 "high" in dev-only lint tooling (`braces` via `eslint-config-next`); the offered "fix" downgrades to Next 14: not applied, wait for an upstream update | Monitor |
| A17 | Personal data kept too long | Medium (GDPR) | Fines, trust | **P9: retention applied nightly** (audit log 2 y, rejected reviews 1 y, unpaid orders 1 y, paid orders lose email/name after 10 y) + TTL indexes | Done ⚖️ periods to confirm |
| A18 | Access/erasure requests impossible | Medium (GDPR) | Fines | **P9: `/admin/privacy`** (find by email, export JSON, erase/pseudonymise), audited by hash | Done |
| A19 | Cookies without consent | Medium (legal) | Fines | Only functional first-party cookies; no analytics/ads; `ha_ref` (partner attribution) is the one to check; **P9: `/privacy` lists every cookie and storage key (taken from the code)** | ⚖️ `ha_ref` consent question open |
| A20 | Location tracking | High (trust) | Location history | GPS stays on the phone (existing rule); the P8 completion call sends no location; tested in e2e (no position in any request) | Done |
| A21 | Open redirect | Medium | Phishing via our domain | `safeReturnPath` on partner links; checkout cancel link limited to our walks | Done |
| A22 | Hidden Pubs evidence media | Medium | Photos of people | Private Blob store, served only to the game's players, deleted after 7 days (cron) | Existing; `CRON_SECRET` must be set on Vercel |

## 2. The brief's checklist

| Brief item | Where it is covered |
|---|---|
| Authentication and session security | A1, A2 (`auth-service`, `partner-auth-service`, `http.ts` cookies) |
| Role-based authorisation | Roles `ADMIN`/`PARTNER`; admin needs `ADMIN_EMAILS` too; partner scoped to its partner; A2, A3 |
| Input validation | Every service parses field by field (`logic/*`: catalogue, tax, discounts, quotes, partners, reviews…), length limits, `$jsonSchema` |
| NoSQL injection | A6 |
| XSS | A4, A13 |
| CSRF | A5 |
| Rate limiting / brute force | A7 |
| Secrets | A10 |
| Logging | Errors by name/code only; audit log for admin actions (who, what, old → new), never secrets or customer data |
| Webhook security | A8, A9 |
| Database access | A6, A12 |
| Backups | A14 |
| Error handling | A15; webhook returns 500 on failure so Stripe retries; outbox retries with back-off |
| Privacy settings | Follow-up only with an unticked box (consent recorded), unsubscribe in every follow-up + one-click header, reviews published only with `mayPublish` |
| Personal data handling | Hashes for secrets and unsubscribes, no card data (Stripe), minimal fields, no emails to partners, POST-only lookups so addresses never appear in URLs/logs |
| Data retention | A17 |
| Account deletion | Customers have no accounts; partner users: erased in `/admin/privacy`; admins: remove from `ADMIN_EMAILS` |
| Export of personal data | A18 |
| Cookies and tracking consent | A19 |

## 3. Retention periods (proposals ⚖️)

| Data | Kept | How |
|---|---|---|
| Sign-in links | 15 minutes | TTL |
| Sessions | 12 h (admin), 7 days (partner) | TTL |
| Rate-limit counters | minutes | TTL |
| Outbox | text removed on sending; record 90 days | TTL |
| Quote requests | 2 years | TTL |
| Partner click counters | 3 years | TTL |
| Hidden Pubs games and evidence | 7 days | TTL + cron |
| Audit log | 2 years | nightly retention |
| Rejected reviews | 1 year | nightly retention |
| Unpaid orders (no email) | 1 year | nightly retention |
| Paid orders | email and name removed after 10 years; amounts kept | nightly retention |
| Reviews (approved/pending) | until deleted | admin |
| Unsubscribed addresses | kept (hash only) | needed to respect the opt-out |
| Commission ledger | kept (no personal data) | accounting |

## 4. For a human (⚖️) before launch

1. Privacy notice (the `/privacy` page is a factual overview, marked as such; it has a visible placeholder for the contact address), terms of sale, processor agreements (Stripe, Vercel, MongoDB, Brevo, later Billit), record of processing activities.
2. Retention periods above (accountant: 10 years? audit log 2 years?).
3. `ha_ref` partner cookie: consent needed or not.
4. Consent sentence for the follow-up email; rewarded reviews wording.
5. Partner agreements (commission invoices/self-billing, VAT).
6. Decision on a second factor for admins (A1) and an Atlas tier with backups (A14, B12).
