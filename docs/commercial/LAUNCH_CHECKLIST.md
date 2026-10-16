# Launch checklist (P10, brief phase 10)

State on 2026-10-17. Live view of the settings: **`/admin/readiness`** (green/red per setting, never a secret's value).
Legend: ✅ verified (how is written next to it) · 🟡 works, owner action left · ❌ not done yet · ⚖️ needs a lawyer/accountant.

**Rule:** live payments and paid services are only switched on with the owner's explicit approval. Ticket sales stay closed (`COMMERCE_SALES_ENABLED` off) until every line in "Before real sales" is green.

## The brief's 14 points

| # | Point | Status | How it was verified / what's left |
|---|---|---|---|
| 1 | All environment variables | 🟡 | Verified on www.hiddenantwerp.com from outside, without knowing any secret: `APP_BASE_URL` (sign-in route answers `invalid-email`, not `not-configured`), `ADMIN_EMAILS` + Brevo (owner signed in; outbox shows `sent`), `CRON_SECRET` (cron route answers 401), Stripe test key + webhook secret (forged webhooks → `400 invalid-signature`), `TICKET_SIGNING_SECRET` (set by the owner). Left: check `/admin/readiness` once after this release (Blob token, playtest tools off, region). |
| 2 | Production configuration | 🟡 | Domain `www.hiddenantwerp.com` (GoDaddy DNS → Vercel), https on both names, apex redirects to www; site `noindex`; security headers on; **functions moved to Frankfurt (`fra1`)** in this release, next to the Atlas cluster (Azure West Europe). Left: enforce the CSP (now report-only) after a phone check. |
| 3 | Stripe test mode | ✅ | Test key in use (a live key is refused while sales are closed); webhook endpoint on the www address with the 5 events; signature check verified on production. Optional: "Send test event" in Stripe → 200 `unknown-order`. |
| 4 | Complete purchase journeys | 🟡 | **Automated (new):** `e2e/purchase.spec.ts` on a second test server with sales open and a test payment page: guide walk (paywall → buy → pay → ticket → play) and Hidden Pubs (ticket for 2 → game with 2 places → second player joins, third refused). Unit/API tests cover webhook duplicates, refunds, discounts, VAT, partners, follow-up. **Left:** one real purchase in Stripe test mode (locally with the Stripe CLI, or briefly on production), guided by me. |
| 5 | Invoicing | 🟡 | Consumer receipts (own numbering R/C) and credit notes tested; the invoice email template is ready. **B2B invoices via Billit (P6) not connected**: waits for the Billit account (B7). |
| 6 | Group invitations | ✅ | Hidden Pubs seat limit in e2e (above) and unit tests; lobby share link/QR/WhatsApp in the existing e2e. |
| 7 | Partner attribution | 🟡 | 36 unit tests (last click, one-year window, refunds, rate changes, isolation). Left: a manual check on production once the first partner exists (`/?ref=CODE` → purchase → ledger line). |
| 8 | Email handling | ✅ | Brevo on production: domain authenticated (brevo-code, DKIM ×2, one DMARC `p=none`), sign-in emails delivered. Retries, give-up, duplicates and (new) expiry of sign-in emails tested. Note: Brevo "Authorised IPs" must stay off. No MX: the domain can't receive mail (owner's choice). |
| 9 | GDPR settings | 🟡 ⚖️ | `/admin/privacy` (export/erase), nightly retention, `/privacy` with contact address, unticked consent box, unsubscribe. Left ⚖️: privacy notice, terms of sale, processor agreements, retention periods, `ha_ref` consent. |
| 10 | Existing walks | ✅ | The full browser suite (GPS walk without positions leaving the phone, Hidden Pubs multiplayer, pages, 8 languages, 390 px layout, data use) runs in CI on every PR; green on every PR of the commercial platform (#7–#16). |
| 11 | Mobile usability | 🟡 | Every browser test runs on a 390 px phone (Chromium). Left: real phones, iOS Safari especially (`FIELD_TEST_CHECKLIST.md`). |
| 12 | Error messages and logging | ✅ | Clients get short error codes; server logs hold names/codes only (guard test fails on emails/tokens/secrets in log lines); admin actions in the audit log; Vercel logs for runtime errors. |
| 13 | Database backups and rollback | ❌ / ✅ | **Backups:** Atlas free tier has none → a tier with backups before launch (B12); stopgap `npm run db:export`. **Rollback:** code — Vercel keeps every deployment ("Instant Rollback" / promote a previous one); database — every schema change in P1–P10 was add-only (`db:setup` never deletes), so an older code version runs on the newer database. |
| 14 | Final security audit | ✅ | `docs/commercial/SECURITY_AUDIT.md` (P9, 22 risks) + guard tests in CI + `npm audit --omit=dev`: 0 vulnerabilities. Open items there: admin second factor (decision), CSP enforcement, backups. |

## Before real sales (in this order)

1. ⚖️ VAT treatment confirmed by the accountant → `/admin/tax` filled in and confirmed (B8).
2. ⚖️ Privacy notice, terms of sale, processor agreements (Stripe, Vercel, MongoDB, Brevo), retention periods, `ha_ref` consent.
3. Atlas tier with backups (B12).
4. A real purchase in Stripe test mode, end to end (with me).
5. CSP enforced after the phone check; iOS Safari field test.
6. Products, prices and tax categories in `/admin/products`.
7. Stripe account activated (company number, IBAN, ID), a **live** webhook, live keys — **only with the owner's explicit OK**.
8. `COMMERCE_SALES_ENABLED=true`, redeploy, watch the first orders in `/admin`.
9. Optional, recommended: admin second factor; Billit (P6) for business invoices.

Content before the public launch (separate from sales): historian review, on-site check of the coordinates, native-speaker review, Smekens drawing rights, then the SEO phase (B4) lifts `noindex`.
