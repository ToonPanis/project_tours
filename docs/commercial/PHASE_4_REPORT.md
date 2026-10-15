# Phase 4 report: corporate page and quote requests

Date: 2026-10-16. Branch: `commercial/p4-corporate` (from `main` = `20c8959`, after P3). Not merged, not deployed.
Brief: phase 5 "Zakelijke boekingen en offerteaanvragen" (my step P4).

Unlike tickets, the quote form doesn't depend on `COMMERCE_SALES_ENABLED`: it takes no payments, so it works as soon as this is deployed (emails need Brevo in production, P1).

## 1. What was built

| Part | How it works |
|---|---|
| **`/corporate`** | Hero, the six offers from the brief (team building, Hidden Pubs Team Challenge, alcohol-free City Challenge, private walk, company outing, international group), an indicative price table per group size, "how it works" in three steps, and the quote form. 8 languages (`corporate.json`, formal address for businesses), own title/description/Open Graph. Linked from the footer ("For companies"). No invented claims: no testimonials, no client logos, no numbers beyond your price table; every programme is "made to measure". |
| **Price guide** | Your table from the brief (10/20/30/50 persons, self-guided €149/279/399/649, guided €299/499/699/from €999) as the starting point; editable in `/admin/quotes` (lines, "from", empty = "on request", VAT included or not), saved in `com_settings`, audited. Shown with "Drinks, catering and extra services are priced separately" (brief 5.2). Default: "excluding VAT" (please check). |
| **Quote form** | Company, contact person, business email, phone (optional), preferred date (optional = flexible), participants (2–1000), activity, language (8), formula (self-guided / guided / not sure), other wishes (optional). Nothing more (data minimisation). A short privacy line under the form. |
| **Spam and abuse** | 5 requests per hour per network address (hashed); a hidden field people never see; a form sent in under 3 seconds counts as a bot. Bots get the same "received" answer, but nothing is saved or emailed. The same company + email + date + activity within 24 hours is kept once (double clicks, re-sends). |
| **Workflow** | Saved as `NEW` → the company gets a confirmation in the language chosen on the form → every `ADMIN_EMAILS` address gets a notice with a link → `/admin/quotes` (filter by status, pages) → `/admin/quotes/[id]`: details, history, "email the contact", next status with an internal note. Steps only go forward (NEW → CONTACTED → QUOTED → ACCEPTED → COMPLETED; DECLINED and CANCELLED close it). Each change is atomic and in the audit log. |
| **Retention** | Requests are deleted automatically 2 years after they came in (TTL index): a proposal, see open points. |

## 2. Files

**New:** `src/features/commerce/logic/quotes.ts`, `server/quote-service.ts`, `components/QuoteForm.tsx`, `admin/QuoteStatusForm.tsx`, `admin/CorporatePricingEditor.tsx`, `src/app/corporate/page.tsx`, `src/app/admin/(console)/quotes/page.tsx`, `quotes/[id]/page.tsx`, `src/app/api/quotes/route.ts`, `src/app/api/admin/quotes/[id]/route.ts`, `src/app/api/admin/corporate-pricing/route.ts`, `src/i18n/locales/*/corporate.json` (8), tests `commerce-quotes.test.ts`, `commerce-quote-form.test.tsx`.
**Changed:** `src/types/commerce.ts`, `src/features/commerce/config.ts`, `server/{commerce-store,memory-store,mongo-store}.ts`, `admin/admin-api.ts`, `src/app/admin/(console)/layout.tsx` (Quotes link), `src/components/layout/SiteFooter.tsx`, `src/i18n/locales/*/{index.ts,navigation.json}`, `db/mongo-schema.mjs`, `commerce-store.test.ts`, `e2e/commerce.spec.ts`, `CLAUDE.md`.

## 3. Database (additions only)

`com_quote_requests` (validation; indexes on status/date and the duplicate key; TTL 2 years) and `com_settings` (small documents by key). Test database exercised; production: run `npm run db:setup`.

## 4. Tests (all actually run, 2026-10-16)

| Check | Result |
|---|---|
| `npm run typecheck`, `npm run lint`, `npm run i18n:check` | ✅ (674 texts × 8 languages) |
| `npm run test:coverage` | ✅ **1,346 / 1,346** (74 files). Coverage: statements 95.14 %, branches 89.28 %, functions 98.5 %, lines 98.12 % |
| `npm run test:db` (Atlas test database) | ✅ 57 passed, 2 skipped (placeholders): quotes saved/listed/deduplicated, atomic status change, settings |
| `npm run build` | ✅ |
| Playwright `commerce` (incl. `/corporate` at 390 px and a real form submission), `pages`, `layout-and-data` | ✅ 23 / 23 |
| Playwright full suite | left to CI on the pull request |

Brief 5.5: form security (hidden field, timing, origin check, rate limit), validation (every field, edge cases), duplicate requests (and a new one after 24 h or with another date), email sending (confirmation in the form's language, one notice per admin, nothing for bots), authorisation (admin routes 401 without a session), the whole workflow (all steps, refused steps, closed requests, two admins at once).

**Not tested:** real emails through Brevo (no account yet; the email texts and recipients are tested with the memory mailer).

## 5. Security and privacy

- Same-origin + JSON on `/api/quotes`; admin routes through `adminPost` (session check).
- Input narrowed field by field; text trimmed and length-limited; React escapes on display; emails are plain text.
- Network addresses only stored hashed (rate limit); no tracking.
- The hidden field and timing never reveal themselves (bots get the normal answer).

## 6. Open points (your decision)

1. **Retention**: 2 years for requests is a proposal (GDPR: keep only as long as useful). Accepted requests may need to be kept longer for accounting once they become orders: tell me the period your accountant wants.
2. **Prices excluding VAT**: the default label; change it in `/admin/quotes` if your prices include VAT.
3. **"Business email"** is not enforced (a gmail address is accepted): small companies and associations often use one.
4. **Sending the quote itself** (a PDF or email with the offer) is not built: the brief says "later"; for now you email the contact from the request page.
5. The offers are listed as you wrote them in the brief; the alcohol-free City Challenge and guided formats don't exist as products in the app yet (they're organised on request).
6. Translations by AI: native-speaker check recommended.

## 7. External configuration / costs

None new (Brevo from P1 sends the emails). No new dependencies.

## 8. How to test it yourself

1. Dev server with memory data (Git Bash): `MONGODB_URI= npm run dev`, with `ADMIN_EMAILS=<you>` in `.env.local`.
2. Open `/corporate` (or the footer link), fill in the form, wait a few seconds, send: the thank-you message appears; the terminal prints the confirmation and your admin notice.
3. Send the same form again: no second request, no second email.
4. Sign in at `/admin`, open Quotes: the request, then move it through the statuses with a note; check the audit log.
5. Change the price guide in `/admin/quotes` and reload `/corporate`.
