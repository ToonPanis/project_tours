# Hidden Antwerp: commercial implementation plan

Date: 2026-10-15. Status: **proposal, waiting for approval**. Based on [ARCHITECTURE_AUDIT.md](ARCHITECTURE_AUDIT.md).
Nothing here is built yet. Prices, costs and legal points are estimates or open questions, marked as such.

---

## 1. Guiding principles

1. **Add, don't rewrite.** Commerce is a layer around the existing walks and Hidden Pubs. The game rules (`HIDDEN_PUBS_CONCEPT.txt`, D1–D34), café order, content, GPS and i18n stay untouched.
2. **The server decides everything that costs money:** amounts, discounts, VAT, access, seats, commissions. The browser only sends *what* someone wants (product id, quantity, code).
3. **Stripe is the source of truth for payments; our database is the source of truth for access.** Access is granted only by a verified webhook, never by a success page.
4. **No new system where an existing one fits:** same MongoDB database and client, same i18n layer, same Route Handler + service + pure-logic pattern, same UI components, same CI.
5. **Minimal personal data:** guest checkout (no customer accounts), email only where needed, no location ever.
6. **Every external, paid or live step needs your explicit OK** (Stripe live mode, paid plans, sending real email).

## 2. Target architecture

```
Browser (phone)
  ├─ public pages (Server Components): walks, /corporate, /partners, checkout start, ticket page
  ├─ /admin/*   (Server Components + small client parts; admin session cookie)
  └─ /partner/* (partner session cookie, only own data)
        │
Route Handlers (src/app/api/…)
  ├─ /api/checkout            → creates a Stripe Checkout Session (price computed on the server)
  ├─ /api/webhooks/stripe     → verifies signature on the raw body → idempotent order processing
  ├─ /api/tickets/…, /api/join/…, /api/quotes, /api/reviews, /api/r (partner click)
  ├─ /api/admin/…, /api/partner/…
  └─ /api/cron/…              → email outbox retries, cleanup
        │
src/features/commerce/          (NEW, same layering as pub-game)
  logic/   pure: pricing, discounts, VAT split, commission calc, attribution, order state machine
  server/  services + stores (memory | MongoDB), Stripe client, email client, auth/session
  components/ checkout button, ticket screen, invite screen, admin tables…
        │
MongoDB Atlas (same cluster/database, new collections, prefix `com_`)    Stripe (Checkout, Tax?, Refunds)
Email provider (transactional)                                           Invoicing/Peppol provider
```

- **Products in the database, content in the code.** A `com_products` document links to a walk slug (`walkSlug`) and holds prices; walk content stays in `src/data/walks`. Admin can change prices and activate/deactivate without a deploy.
- **Tickets and access.** A paid order creates an `access grant` with a random token (32 bytes, base64url, only the SHA-256 hash stored, like `hp_` cookies). The buyer gets a link `/t/<token>`; opening it sets an httpOnly cookie for that walk. `/walks/[slug]/play` checks the cookie on the server. Free/promo tickets are the same grant with `source: "promo"`.
- **Hidden Pubs groups.** A paid Hidden Pubs package creates a grant with `seats`. `/games/new` requires a valid grant; the created game stores `orderId` + `seatLimit`; the existing join route refuses players above the seat limit. **No change to game rules**, only an extra check at create/join. The invitation link (`/join/<code>`) reuses the existing join + QR (`qrcode-generator`) + share (`client/share.ts`, includes WhatsApp via the Web Share API).
- **Sync** stays the existing 2-second polling (works on Vercel serverless, already tested on bad networks). No WebSockets.

## 3. Decisions I need from you (before or during the phases)

**Taken (2026-10-15):**
- **B1:** PRs #3 → #4 → #5 merged into `main`; PR #2 replaced by PR #6 (waits for the audio recordings).
- **B2:** "17 Gates" is the **product name** of the existing Poortjes van Antwerpen walk. The walk's content and title are not changed; only the catalogue name.
- **B3:** **everything per person**, also Hidden Pubs (€14.95 per player). No group packages: the number of tickets bought sets how many players may join (seat limit in P3).
- **B5:** admins (later partners) sign in with a **one-time email link**, built in-house (no new dependency).
- **B6:** **Brevo** for transactional email (HTTPS API with `fetch`, no SDK).

Still open: B4, B7–B12.

| # | Decision | My recommendation |
|---|---|---|
| **B1** | Merge order of the open PRs (#3 → #4 → #5, then resolve #2) before commercial work starts. | Yes, in that order, each with green CI. I can prepare the #2 conflict resolution on a separate branch. |
| **B2** | "17 Gates": new product, or the Poortjes walk renamed? | Ask yourself what is sold; I don't rename content without your text. |
| **B3** | Price model: per person or per group, for each walk? (`Price` today says "per team/group".) | Per-person tickets for guide walks with quantity; Hidden Pubs as group packages (your table). |
| **B4** | SEO and URLs: hreflang needs a URL per language (e.g. `/nl/walks/...`). Today: cookie, no locale in the URL (a "decision to keep"). | Only the **public marketing pages** get locale URLs (`/[lang]/...`); the app keeps the cookie. Separate plan when we reach Phase 6. |
| **B5** | Login for admin and partners: (a) own passwordless email link with database sessions (no new dependency; reuses the hashed-token pattern), or (b) Auth.js (library, more dependencies, beta for this Next version). | (a), with a second factor for admin (email code or later passkeys), rate-limited, heavily tested. Customers: no accounts. |
| **B6** | Email provider (compare in SECURITY_AND_GDPR.md §7). | Brevo or Mailjet (EU-hosted, free tier to start). Not chosen without your OK. |
| **B7** | Invoicing/Peppol: Stripe has no confirmed native Peppol. Use a Belgian invoicing/accounting tool with a Peppol access point (e.g. Billit, or Invopop as a Stripe integration), or have your accountant handle it. | B2C: Stripe receipt + VAT invoice on request from our system or the tool. B2B: the Peppol provider. **Accountant first.** |
| **B8** | Your VAT situation: VAT-registered or small-business exemption? Which rate (6 % / 21 %)? Are self-guided app walks "electronically supplied services" (then EU consumers pay their own country's VAT above the €10,000 OSS threshold)? | **Accountant decision.** Stripe Tax can compute it if needed (≈0.5 % per transaction, to verify). |
| **B9** | Completion signal for guide walks (for KPIs, review requests, discount email). | A single "completed" call per ticket, no location, no timestamps per stop. |
| **B10** | Brewery campaigns vs. the alcohol rules. | Only as partner listings/sponsored "did you know" with a label, never drink tasks, drink counts or promotions to drink more. Needs your call. |
| **B11** | Review incentive (10 % off). | Offer it for completing the walk or for *any* review, disclosed on the review page. |
| **B12** | Paid plans: Vercel Pro (commercial use), Atlas tier with backups. | Required before going live; not before testing. |

## 4. Implementation order (proposal)

Different from the brief's numbering on purpose: authentication and the product catalogue come first because payments, admin and partners all need them. Each step = its own branch from an up-to-date `main`, its own PR, its own `PHASE_X_REPORT.md`, and a stop for your approval.

| Step | Scope | Depends on | Brief phase |
|---|---|---|---|
| **P0** | Merge PRs #3–#5, resolve #2; Node 22 locally; confirm Vercel plan and Atlas backups. No new code. | – | – |
| **P1 Foundation** | `src/features/commerce/` skeleton; new collections in the schema file; rate limiter (MongoDB TTL counters, no new dependency); admin login (B5) + roles + audit log; products and prices in the DB with an admin page to edit them; email provider abstraction with an outbox (memory in dev). | P0, B5, B6 | 4 (part), 8 |
| **P2 Payments + access** | Stripe Checkout (test mode), webhook, orders, payment states, refunds from admin, tickets/access grants, gating `/walks/[slug]/play`, confirmation email, discount codes (server-side). | P1, B3, B8 | 1 (without Peppol) |
| **P3 Groups** | Hidden Pubs packages → grant with seats; `/games/new` requires a grant; seat limit on join; `/join/<code>` invite page (copy, QR, WhatsApp share), rename group. Tests for 2/4/6/10 players. | P2 | 2 |
| **P4 Corporate** | `/corporate` page (8 languages), quote form with validation + rate limit + honeypot, `com_quotes`, statuses NEW…CANCELLED in admin, emails. | P1 (can run in parallel with P2/P3) | 5 |
| **P5 Admin dashboard** | KPIs, charts (no chart library unless agreed: simple SVG), orders, groups, quotes, server-side pagination, date filters. | P2–P4 | 4 |
| **P6 Invoicing** | Invoice numbering, VAT breakdown, credit notes, PDF download, B2B via the Peppol provider. | P2, B7, B8 | 1.4 |
| **P7 Partners** | Partner accounts, codes, `?ref=` attribution (first-party cookie, documented window), click counters without IP, commission ledger (pending → approved → payable → paid / reversed), partner portal. **No automatic payouts.** | P2, P5 | 3 |
| **P8 Reviews + follow-up emails** | Completion signal (B9), verified reviews tied to a ticket, moderation, follow-up email once, unique discount codes, marketing consent and unsubscribe. | P2, P6 | 6.4, 7 |
| **P9 SEO** | Locale URLs for public pages (B4), sitemap, robots, canonical, hreflang, structured data, real reviews only. **Only after content and rights are ready** (noindex stays until then). | Content ready, B4 | 6 |
| **P10 Production readiness** | Checklist from the brief, Stripe live keys (your OK), final security audit. | All | 10 |

## 5. New dependencies (each needs your OK before install)

| Package | Why | Built-in alternative |
|---|---|---|
| `stripe` (official Node SDK) | Checkout Sessions, webhook signature verification, refunds. | Raw `fetch` to the API is possible but signature checking and types are error-prone; the brief asks for the official SDK. **Recommended.** |
| Email provider SDK | Optional | Most providers have a simple HTTPS API: plain `fetch`, **no SDK needed**. |
| PDF for invoices | Only if we generate PDFs ourselves | Prefer the invoicing provider's PDFs (B7). |
| Validation library (e.g. zod) | Not needed | The project validates by hand with typed narrowing; we keep that. |
| Auth library | Only if B5 = (b) | Own implementation (B5 a). |

## 6. API endpoints (planned)

Public: `POST /api/checkout`, `POST /api/webhooks/stripe`, `GET /t/[token]` (page, sets ticket cookie), `GET /join/[code]` (page), `POST /api/quotes`, `GET /api/r?ref=` (or proxy logic for `?ref=` on any page), `POST /api/reviews`, `POST /api/walk-completed`, `GET /api/unsubscribe?token=`.
Admin (session + role): `/api/admin/products`, `/prices`, `/discounts`, `/orders` (+ `/refund`), `/groups`, `/quotes`, `/partners`, `/commissions`, `/reviews`, `/campaigns`, `/kpis`, `/audit-log`, `/data-requests`.
Partner (session, own data only): `/api/partner/summary`, `/api/partner/sales`, `/api/partner/commissions`, `/api/partner/qr`.
Auth: `POST /api/auth/login-link`, `GET /api/auth/verify`, `POST /api/auth/logout`.
Cron: `/api/cron/email-outbox`, `/api/cron/commission-approval`, `/api/cron/retention`.

Collections: see [DATABASE_DESIGN.md](DATABASE_DESIGN.md).

## 7. Preventing regressions

- The game, walk and navigation code is not edited except at **two narrow points**: the access check on `/walks/[slug]/play` and the grant/seat check in Hidden Pubs create/join. Both behind a feature flag (`COMMERCE_ENABLED`), off by default, so `main` keeps working as today until you switch it on.
- All existing tests (~1,030 unit, Playwright e2e) must stay green on every PR; new e2e tests run with the flag on and off.
- Pub-game collections and their TTL are never touched; commerce collections have their own prefix.
- `db:setup` stays add-only; no destructive migration.

## 8. External services and accounts

| Service | Needed for | Account | Cost (estimate, verify) |
|---|---|---|---|
| Stripe | Payments, refunds, (Tax) | You create it; test keys first | EEA cards ≈1.5 % + €0.25; Stripe Tax ≈0.5 %; Invoicing ≈0.4 % if used. No monthly fee. |
| Vercel Pro | Commercial hosting | Upgrade of your account | ≈$20/month per member |
| MongoDB Atlas | Backups for financial data | Upgrade of the cluster | Flex ≈$8–30/month or M10 ≈$57/month (check current Atlas prices) |
| Email provider | Transactional + later marketing | New | Free tier at the start (Brevo ~300/day, Mailjet ~6,000/month) |
| Peppol / invoicing tool | B2B e-invoices | New (with your accountant) | ≈€10–30/month typical; verify |
| Domain + DNS (SPF/DKIM/DMARC) | Email deliverability, `hiddenantwerp.com` | You | Domain ≈€10–20/year |

## 9. Main risks (summary)

1. **Merge debt** (PR #2 vs #5): solve first (P0).
2. **Auth built in-house:** largest security risk; mitigated by passwordless design, hashed tokens, rate limits, audit log, tests (SECURITY_AND_GDPR.md).
3. **Legal/tax errors** (VAT rate, OSS, Peppol, review incentives, consumer withdrawal right): human review required; I won't present our invoices as Peppol-compliant.
4. **Selling unfinished content** (placeholders, Smekens rights): business risk; keep `noindex` and products inactive until ready.
5. **Webhook mistakes** (double tickets, lost payments): idempotency by Stripe event id + order state machine + tests for duplicates and concurrency.
6. **Data retention conflict:** games deleted after 7 days, invoices kept 10 years: separate collections, minimal data in orders.
7. **Scope:** this is several months of work for one developer; the phased order delivers a sellable product after P2/P3.
