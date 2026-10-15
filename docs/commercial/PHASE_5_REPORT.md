# Phase 5 report: commercial admin dashboard

Date: 2026-10-16. Branch: `commercial/p5-dashboard` (from `main` = `7f86658`, after P4). Not merged, not deployed.
Brief: phase 4 "Commercieel admin-dashboard" (my step P5). Admin-only, English like the rest of the admin area.

## 1. What was built

| Brief | Built |
|---|---|
| **4.1 KPIs** | Revenue today and this month (Brussels days), tickets sold, average order value, number of orders, customers, new vs returning, Hidden Pubs groups from tickets, open quote requests. Revenue split into **gross** (paid, VAT incl.), **refunds**, **net** (after refunds, VAT incl.), **VAT after refunds** and **net excluding VAT**; commissions shown as "– (P7)". |
| **4.2 Charts** | Net revenue per day / week / month (column chart), per product and per buyer's language (bar lists). New vs returning as tiles. |
| **4.3 Management** | Already there: prices, products, discounts, orders, quotes, tax. New: **`/admin/documents`** (receipts, invoices, credit notes; filter "waiting for the invoicing provider"), **`/admin/groups`** (Hidden Pubs games from tickets → their order), and a **CSV export** of the period's paid orders for the accountant (amounts, VAT, country, OSS, business details). |
| **4.4 Technical** | Responsive; date filter (presets + custom days + day/week/month, a GET form so a view can be bookmarked); server-side pagination on every list; admin-only (session checked per page/route); the export is in the audit log; no customer data in any public response. |

**Not measured yet (shown on the dashboard with the reason):** completed walks / started vs completed (walk progress lives only on the phone: needs decision B9), average rating (reviews: P8), conversion from visit to purchase (the site has no analytics on purpose: needs a privacy decision), revenue per partner (P7), brewery campaigns (later).

### How the numbers are counted (also on the page)
- An order counts in the period it was **paid**; refunds count **with their order** (not on the refund date).
- VAT after a refund goes back in proportion; net excluding VAT = net − that VAT. The per-order VAT itself was fixed at payment with the tax settings that applied (P2).
- Tickets = persons on orders that were not refunded in full.
- New customer = their first paid order (by email, case-insensitive) falls in the period.
- Days, weeks (Monday start) and months are Brussels calendar units, correct across the summer/winter time change.

### Charts
Server-rendered SVG/HTML, no library. Following the data-visualisation guide: one series per chart (no legend; the title names it), one colour **`#b8862b`** chosen with the palette validator (passes lightness band, chroma floor and ≥ 3:1 contrast on the admin's `#17120e` background; the site's gold `#c3a064` failed lightness and chroma), bars ≤ 24 px with a 4 px rounded end and 2 px gaps, hairline grid, text in text colours, a tooltip per bar (keyboard-focusable), and every chart also as a table. Rendered and checked visually at 390 px: the first render had unreadable axis labels (fixed: explicit SVG fill, narrower coordinate system, larger font).

## 2. Files

**New:** `src/features/commerce/logic/report-dates.ts`, `logic/reports.ts`, `server/report-service.ts`, `admin/charts.tsx`, `admin/DateRangeFilter.tsx`, `src/app/admin/(console)/documents/page.tsx`, `groups/page.tsx`, `src/app/api/admin/reports/orders/route.ts`, `src/__tests__/commerce-reports.test.tsx`.
**Changed:** `src/app/admin/(console)/page.tsx` (the dashboard; the server configuration moved below it), `admin/(console)/layout.tsx` (nav), `src/types/commerce.ts` (audit action), `server/{commerce-store,memory-store,mongo-store}.ts` (report queries), `db/mongo-schema.mjs` (indexes), `src/__tests__/commerce-store.test.ts`, `e2e/commerce.spec.ts`, `CLAUDE.md`.

## 3. Database

Indexes only (additions): `com_orders (status, paidAt)`, `com_ticket_grants (gameCode, createdAt)`, `com_documents (status, createdAt)`. Run `npm run db:setup` on production.

## 4. Tests (all actually run, 2026-10-16)

| Check | Result |
|---|---|
| typecheck, lint, i18n:check | ✅ no errors; every language has every text |
| `npm run test:coverage` | ✅ 1,374 tests passed; coverage 95.3 % statements, 89.2 % branches, 98.5 % functions, 98.1 % lines (above the thresholds) |
| `npm run test:db` (Atlas test database) | ✅ 59 passed, 2 skipped (placeholders): paid orders by date, documents filter, groups list on MongoDB |
| build + Playwright `commerce`, `admin` | ✅ build OK; 10 browser tests passed (incl. `/admin/groups` and `/admin/documents` need a session). The full browser suite runs in CI. |

Covered: Brussels midnight in summer/winter, the 25-hour day of the clock change, calendar overflow, all presets, custom and invalid ranges, granularity, Monday weeks, empty buckets; sums (gross/refunds/net/VAT/ex-VAT add up), boundaries at local midnight, unpaid orders excluded, per product/language order, new vs returning, empty period; CSV quoting and formula neutralising; dashboard tiles (also with a past range); export audit and 401 without session; documents/groups pages; chart rendering (tooltips, no zero-height sliver, table).

## 5. Security

Admin session checked in every page and the export route; the export is audited (it contains emails and business data); CSV cells starting with `= + - @` are neutralised against spreadsheet formula injection; the dashboard is server-rendered (no figures in public responses).

## 6. Open points

1. **B9 – completed walks**: a privacy-safe "walk completed" signal (one call per ticket, no location) would unlock "completed walks", review requests and the follow-up email (P8). Your decision.
2. **Conversion**: needs some analytics (even counting page views of buy boxes) → a privacy/consent decision.
3. Refund timing: refunds are counted with their order's payment date. If your accountant wants them on the refund date, the refund events need their own dates (small change).
4. Scale: fine for tens of thousands of orders; beyond `MAX_REPORT_ORDERS` the page warns and the computation should move to MongoDB aggregation.

## 7. External configuration / costs

None. No new dependencies.

## 8. How to test it yourself

1. Dev server with memory data (Git Bash) `MONGODB_URI= npm run dev`, sign in at `/admin`.
2. Make a few test purchases (P2 report §9) or, in test mode with Stripe CLI, trigger payments; refund one partly.
3. `/admin`: change the period and "per", hover the bars, open "Show as a table", export the CSV and open it in Excel; check the audit log.
4. `/admin/documents?status=awaiting-provider` after a purchase with a VAT number; `/admin/groups` after creating a Hidden Pubs game with a ticket.
