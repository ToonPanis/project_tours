# Hidden Antwerp: security and GDPR for the commercial platform

Date: 2026-10-15. Status: **proposal**. Items marked ⚖️ **need human legal or accounting review**. I am not a lawyer or accountant, and nothing here is presented as legal advice.

## 1. What exists today (baseline)

- Security headers (nosniff, Referrer-Policy, Permissions-Policy `geolocation=(self)`, `X-Frame-Options: DENY`, no `X-Powered-By`); **CSP Report-Only**.
- Hidden Pubs POST routes: same-origin check, JSON only, 10 kB cap, `no-store`; httpOnly `SameSite=Lax` player cookie; only SHA-256 hashes stored; answers server-only (tested).
- Error logs contain only the error name (`lib/log-error.ts`).
- No GPS storage, ever (tested in e2e "privacy").
- Privacy notice draft (`PRIVACY_NOTICE_DRAFT.md`), which promises "no account and no sign-up". That promise **changes** with commerce (buyers give an email address) and must be rewritten.
- **Missing:** rate limiting, brute-force protection, accounts/roles, audit log, backup policy, CSP enforcement.

## 2. Risk register (new modules)

| # | Risk | Severity | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Forged "paid" status (success-page redirect, client-sent amount) | Critical | Free products, lost revenue | Access only from a verified webhook; amount computed on the server; webhook checks amount, currency, session id and order id against our order. |
| R2 | Webhook spoofing | Critical | Free tickets | `stripe.webhooks.constructEvent` on the **raw** body (`await request.text()` in the Route Handler, never parsed first); secret in `STRIPE_WEBHOOK_SECRET`; separate secrets for test/live. |
| R3 | Duplicate/concurrent webhooks → double tickets/commissions | High | Wrong access, wrong payouts | Event id as `_id` (unique), order state machine (`pending → paid` only once via conditional update), unique `orderId + type` in the ledger, MongoDB transaction. |
| R4 | Admin account takeover | Critical | Price changes, refunds, data leak | Passwordless login links (15 min, one use, hashed), second factor for admins, session cookie httpOnly + Secure + SameSite=Strict for `/admin`, short session lifetime, rate limit per email and IP, audit log, alert email on new admin login. |
| R5 | Partner sees other partners' data (IDOR) | High | Data leak, trust | Partner id **always from the session**, never from the URL/body; every partner query filtered by it; tests per route. |
| R6 | Guessable ticket/invite codes | High | Free access | 32-byte random tokens (hash stored); short human codes only together with rate limiting and only as a convenience. |
| R7 | NoSQL injection | High | Data leak or modification | Never pass request objects into queries; narrow every field to string/number by hand (existing pattern); `$jsonSchema` validation; no `$where`. |
| R8 | XSS through reviews, quote text, group/partner names | High | Session theft | React escapes by default; no `dangerouslySetInnerHTML`; length limits; plain-text emails or escaped templates; enforce CSP before launch. |
| R9 | CSRF on admin/partner actions | Medium | Unwanted changes | JSON-only + same-origin check (existing), SameSite cookies; Server Actions have built-in origin checks. |
| R10 | Spam/abuse on quote form, checkout, login links | Medium | Cost, email reputation | Rate limiting (MongoDB TTL counters), honeypot field, time-to-submit check, duplicate detection; captcha only if needed (would be a new service). |
| R11 | Discount abuse (reuse, stacking, guessing) | Medium | Lost revenue | Server-side check, reservation + `used` status, max redemptions, per-customer limits, random codes for personal discounts, one code per order. |
| R12 | Secrets in code or logs | High | Account takeover | Env vars only, server-only (no `NEXT_PUBLIC_`), `.env.example` without values, logs without payloads/emails/tokens; a test that greps for `sk_live`/`sk_test`/`whsec_`. |
| R13 | Test/live mix-up | High | Real charges in tests, or lost live events | Separate Stripe keys per Vercel environment (Preview = test, Production = live only after your OK); the app refuses `sk_live_` outside Production. |
| R14 | Data loss (no backups) | High | Lost orders/invoices | Atlas tier with backups (M0 has none), restore test, invoice copies also in the invoicing tool and Stripe. |
| R15 | Dependency vulnerabilities | Medium | Various | Minimal dependencies, `npm audit` in CI (warning), Dependabot. |
| R16 | Error pages leaking details | Low | Info disclosure | Existing error-name-only logging; generic API errors. |

## 3. Authentication and authorisation

- **Customers:** no accounts. A ticket link (`/t/<token>`) is the proof of purchase; it can be re-sent by email from the order (`"resend my tickets"` with rate limiting).
- **Admin / partners:** decision B5 (plan). Roles: `ADMIN` (everything), later `SUPPORT` (orders, quotes; no prices/roles), `HOTEL_PARTNER`, `HORECA_PARTNER`, `TOURISM_PARTNER`, `CORPORATE_PARTNER` (own partner data only).
- Every admin/partner route checks the session **on the server** (a Server Component or Route Handler helper `requireRole(...)`), never only in the layout (layouts don't re-run on every navigation in the App Router).
- Next.js 16 note: middleware is now "proxy"; it can redirect early, but the real check stays in each route.

## 4. GDPR overview ⚖️

| Processing | Data | Legal basis (proposal) | Retention (proposal) |
|---|---|---|---|
| Sale and access | Email, order, Stripe ids, locale | Contract | Order 10 years (accounting) ⚖️, email pseudonymised after the period needed for support/refunds |
| Invoices | Name, company, VAT number, address | Legal obligation | 10 years ⚖️ |
| Hidden Pubs game | As today (names, photos, 7 days) | Contract / legitimate interest (as in the draft) | 7 days (unchanged) |
| Quote requests | Contact person, business email, phone (optional) | Pre-contractual steps | 2 years if no deal ⚖️ |
| Partner accounts | Contact person, email | Contract | Contract + legal period |
| Reviews | Text, rating, optional display name, ticket link | Consent (publication) | Until withdrawn |
| Review/follow-up email after the walk | Email | ⚖️ Existing-customer exception (soft opt-in) for similar products **with** an unsubscribe in every mail, or explicit consent | Until unsubscribe |
| Marketing | Email | Consent (checkbox, not pre-ticked), logged in `com_consents` | Until withdrawn |
| Partner attribution | First-party cookie with the partner code, click counters without IP | ⚖️ Probably strictly-necessary-for-commission or consent: to confirm (Belgian cookie rules are strict) | Cookie = attribution window (one year, owner's decision 2026-10-17) |
| Admin audit log | Admin id, actions | Legitimate interest (security) | 2 years |

Also needed: a processor list (Stripe, Vercel, MongoDB, email provider, invoicing tool) with DPAs; data export and deletion procedures (admin tool: find by email → export JSON / pseudonymise, keeping what accounting requires); a record of processing activities; an updated privacy notice in 8 languages; terms of sale.

**Never changes:** no GPS storage, no location history, no analytics or tracking cookies without consent, no drink counts.

## 5. Consumer law and business points ⚖️

- **Right of withdrawal** for dated leisure services / digital content: rules and exceptions to check; the checkout must show the right text and get the right confirmation.
- **Prices incl. VAT** shown to consumers; B2B prices may be shown excl. VAT with a clear label.
- **Reviews (EU Omnibus directive, Belgian Code of Economic Law):** say how reviews are verified; show only real reviews from ticket holders; publish negative reviews too (moderation only for abuse/illegal content); disclose incentives. A discount may not depend on the review being positive.
- **Alcohol:** Hidden Pubs is 18+; marketing to minors, and promotions that push drinking, are excluded (also by the project's own rules). Brewery campaigns: check the Belgian alcohol advertising convention ⚖️.
- **Partner commissions:** a written agreement, invoices from partners (self-billing needs an agreement), VAT on commissions ⚖️.

## 6. Invoicing and Peppol ⚖️

- Since 1 January 2026, structured e-invoicing (EN 16931, in practice over Peppol) is mandatory for **domestic B2B** between Belgian VAT-registered businesses; B2C is out of scope. Sources differ on details and exemptions, so your accountant should confirm.
- **Stripe:** no native Belgian Peppol support found in Stripe's documentation; third parties (e.g. Invopop) connect Stripe to Peppol. **We will not build our own Peppol sender** or call our PDFs Peppol-compliant.
- Proposal: our system keeps orders and VAT breakdowns; invoices for B2B go through a Peppol-capable provider chosen with your accountant; B2C gets a Stripe receipt and, on request, a regular invoice.
- VAT rate and place of supply (6 % vs 21 %; OSS for EU consumers if the walks count as electronically supplied services) must be decided by an accountant **before** the first sale.

## 7. Email provider comparison (to verify on the vendors' current pages)

| Provider | EU hosting | Free tier (indicative) | Notes |
|---|---|---|---|
| **Brevo** (FR) | Yes, EU by default | ~300 emails/day | Transactional + marketing + consent tools; EU company. |
| **Mailjet** (FR, Sinch) | Yes | ~6,000/month | Transactional + marketing, templates. |
| Amazon SES | EU regions | Very cheap per email | Raw infrastructure: bounces, templates and dashboard are up to us. |
| Resend | EU region available | Free tier | US company; good developer experience. |
| Postmark | Check | Paid | Excellent deliverability; US company. |

Recommendation: **Brevo or Mailjet** (EU company + EU hosting, free tier, marketing consent features for later). Plain HTTPS API with `fetch`, no SDK. Domain must get SPF, DKIM and DMARC. Not chosen without your OK.

## 8. Security checks per phase

Each phase report lists: auth/role tests per route, input validation tests, injection payload tests, rate limit tests, secret scan, `npm audit`, CSP console check in a production build, and a manual review of every new Route Handler against this register.
