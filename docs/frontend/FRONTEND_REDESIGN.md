# Frontend redesign: audit and plan

Date: 2026-10-17. Request: "Frontend redesign, About Us, Contact & Reviews" (owner's brief). Absolute rule: **no backend changes** (no API contracts, database schemas, server logic, payments, game mechanics).

## 1. Audit (phase 1)

| Question | Finding |
|---|---|
| Frontend stack | Next.js 16 App Router (Server Components by default), React 19, TypeScript, Tailwind CSS v4 with tokens in `src/app/globals.css` (`ink #17120e`, `parchment #f3ead8`, `gold #c3a064`, `umber`, `sepia`), fonts Cormorant Garamond (display) + Source Sans 3 (body). **No component library** (own `Button`, `ButtonLink`, `Badge`, `Dialog`, `ConfirmDialog`, `ProgressBar`, `PlaceholderNotice`). No dark/light switch: the site is one warm dark/parchment design; the admin is dark only. |
| Admin structure | `/admin` route group `(console)`: a flat row of 15 text links (Orders, Quotes, Partners, Reviews, Privacy, Readiness, Groups, Invoices, Products, Discounts, Tax, Audit log) above narrow pages (`max-w-3xl`). Access checked per page (`requireAdmin`) and per route (`adminPost`/`adminFromRequest`) — not in the layout (must stay that way). English only (owner tool). |
| Admin pages and their APIs | Dashboard (server-rendered, no API), Orders (+ refund/revoke/reset/resend routes), Quotes (status route, corporate pricing), Partners (+ users, QR, commissions), Reviews (moderation route), Privacy (lookup/export/erase), Readiness, Groups, Invoices, Products (+ price), Discounts (+ batch), Tax, Audit log. |
| Public navigation | Header: Walks, How it works, language menu. Footer: walks, For companies, Privacy & cookies. |
| Translations | Own i18n (8 languages, cookie-based, no locale in URLs), `npm run i18n:check`, `no-hardcoded-text.test.ts` forbids text in JSX outside `admin/` and `playtest/` folders. |
| SEO | Per-page `generateMetadata` (translated titles/descriptions, Open Graph via `baseOpenGraph`); **site-wide `noindex`** while content is placeholder; no locale URLs, so no real hreflang/canonical per language (decision B4 open). |
| About / Contact / Reviews pages | **None exist.** Related: `/corporate` (quote form → existing `/api/quotes`, for groups and companies), `/privacy`, `/review#token` (verified review form from the follow-up email). |
| Reviews in the database | `com_reviews` (P8): one per ticket, rating 1–5, optional text and display name, `mayPublish`, status pending/approved/rejected, `incentivised`. Submitted only with a **signed ticket link** (`/api/reviews` refuses anything else). Nothing is shown publicly yet. |
| Contact backend | **None.** No contact endpoint or service. The domain has **no MX record** (can't receive mail). The only configured contact detail is the postal address on `/privacy` (Melkmarkt 35, 2000 Antwerpen). |

## 2. Conflicts with the brief, and how they are handled

1. **Demo reviews (5.3).** Invented reviews on a live commercial site are "fake reviews" under EU consumer law (Omnibus Directive), even when labelled, and the project's own rule forbids fictitious reviews in public. They are stored as a clearly marked frontend fixture, labelled "Example review" in every language, never counted, never in structured data — and **shown only outside production** (development, preview) unless `NEXT_PUBLIC_SHOW_DEMO_REVIEWS=true` is set on purpose. One switch removes them; deleting the fixture file removes them for good.
2. **Contact form (4.3).** No backend may be added and the domain can't receive mail. The form builds a **mailto** to `NEXT_PUBLIC_CONTACT_EMAIL` (opens the visitor's own mail app; nothing is "sent" by the site and it never says so). Until that address is configured, the page shows the postal address and sends groups/companies to the existing quote form on `/corporate` (which does have a backend). The owner must choose the email address.
3. **Submitting reviews (5.2).** The existing endpoint only accepts verified reviews (a ticket's signed link). An open form with name/email would need a new endpoint and would invite fake reviews. `/reviews` therefore explains how verified customers review (the link in the follow-up email) and shows only approved, publishable real reviews; the public form is documented as needing backend work.
4. **"The Hidden Streets of Antwerp" (3.4)** is not a walk in the project (the walks are Poortjes/17 Gates, Hidden Pubs, Classics; Dark Antwerp and The Rubens Code are "coming soon"). It is not presented as an experience; demo review 4 keeps its text but links to no walk.
5. **Canonical / hreflang (phase 8):** without locale URLs (B4) one URL serves all languages; canonical URLs are set, hreflang is not faked. `noindex` stays until content and image rights are cleared (owner's earlier decision).

## 3. Plan (separate, small PRs)

1. **Admin redesign** (this branch): a sidebar layout (collapsible on desktop, drawer on phones) with grouped sections of the pages that really exist; a shared page header with title and description; readable tables (horizontal scroll), consistent buttons/cards/badges, visible keyboard focus, contrast checked; no change to any admin action or API.
2. **Public pages** `/about`, `/contact`, `/reviews` in 8 languages, linked in header and footer; metadata and Organization structured data; tests.
3. Report with what was done, tested, and what needs backend work later.

## 4. Delivery report (phase 10)

Branch `frontend/public-pages` (contains `frontend/admin-redesign`). Not pushed, not deployed.

### 4.1 Changed and new frontend files
- **Admin:** new `src/features/commerce/admin/{AdminShell,PageHeader}.tsx`, `admin-navigation.ts`; `src/app/admin/layout.tsx`, `src/app/admin/login/layout.tsx` (new), `src/app/admin/(console)/layout.tsx`; every console page (`page.tsx` of dashboard, orders(+detail), groups, documents, discounts, partners(+detail), quotes(+detail), reviews, privacy, products, tax, audit, readiness) now uses `PageHeader`; focus/contrast classes in the admin client components (`CommissionLedger`, `CorporatePricingEditor`, `DateRangeFilter`, `DiscountManager`, `LoginForm`, `OrderActions`, `PartnerForm`, `PartnerUsers`, `PrivacyRequests`, `ProductEditor`, `QuoteStatusForm`, `ReviewModeration`, `TaxSettingsForm`, `charts`).
- **Public:** `src/app/{about,contact,reviews}/page.tsx`, `src/features/contact/ContactForm.tsx`, `src/features/reviews/{demo-reviews,public-reviews}.ts`, `src/lib/canonical.ts`, `src/components/layout/{SiteHeader,SiteFooter}.tsx`.
- **Translations:** `src/i18n/locales/<8>/pages.json` (new), `<8>/navigation.json` (+ about, reviews, contact, menu), `<8>/index.ts`.
- **Tests:** `src/__tests__/{admin-shell,public-pages}.test.tsx`, `e2e/public-pages.spec.ts`.

### 4.2 Admin improvements
- Sidebar with five sections (Overview, Sales, Business, Customers, Settings) listing **only existing pages**; a test fails if a page is added without a sidebar entry or a link points to nothing. "Walks & games" and "Users" are not shown: they don't exist as admin features (walk content lives in the code; there are no customer accounts).
- Collapsible sidebar on desktop ("Hide menu" for wide tables), a menu panel on phones/tablets (Escape closes it and returns focus), a top bar with the current section, "View site" and sign-out.
- Every page: a clear title + one-line description; wider content column (`max-w-6xl` instead of `max-w-3xl`).
- Readability: no text below ~4.5:1 on the dark background (all `/40`–`/50` text raised), notes 14 px instead of 12 px, visible gold focus ring on every field and link, gold radio/checkbox accents, `aria-current` on the active section.
- Unchanged: every admin action, route, access check (still per page/route) and API.
- Checked visually (screenshots at 1366 px, 820 px tablet and 390 px phone) on a production build against the **test** database with a temporary admin session (removed afterwards).

### 4.3 New pages
- **/about:** hero ("Discover the city beyond the obvious.") + CTA to `/walks`; brand story (no claims about founders); the real walks via the existing `WalkCard` (own images, prices, links) + the "coming soon" walks; six "why" points (all supported by the app); a partner block (→ `/corporate`, `/contact`); the future vision, labelled as a plan; closing CTAs. Organization structured data (name, URL, postal address).
- **/contact:** form with name, email, request type (7 types), subject, message, privacy consent; validation with messages per field, focus to the first error, status message always mounted. It opens the visitor's own email app (mailto) to `CONTACT_EMAIL`; without it the form is switched off and says so. Side cards: groups/companies → existing quote form (`/corporate#quote`), partners, ticket help, postal address.
- **/reviews:** real reviews only (approved + `mayPublish`), with stars, name (or "a Hidden Antwerp walker"), walk, date, text, the "rewarded" disclosure; average and count of real reviews only; sorting (newest/highest/lowest, GET form); empty and "can't load" states; how to leave a verified review.

### 4.4 The four demo reviews
In `src/features/reviews/demo-reviews.ts` (a frontend fixture, no database): labelled "Example review" in every language, in a separate "Example reviews" section with a note, never counted in the average or the number, no structured data, shown **only outside production** (development and Vercel previews) unless `SHOW_DEMO_REVIEWS=true`. Delete the file (and its import on the page) to remove them. Demo review 4 mentions "Hidden Streets", which is not a walk in the project: shown as a label only.

### 4.5 Existing backend reused (nothing changed)
Walk repository (`getAllWalks`, `getUpcomingWalks`), the review store method `listReviews` (read only, from the server page), the corporate quote form/endpoint (`/corporate`, `/api/quotes`), the privacy page.

### 4.6 Still needs backend work (documented, not built)
1. A public review form without a ticket (brief 5.2) — needs a new endpoint and is a fake-review risk; verified reviews already work via the follow-up email.
2. Storing contact messages on the server (brief 4.3) — needs an endpoint and a mailbox; today mailto.
3. Real hreflang/canonical per language — needs locale URLs (decision B4).

### 4.7 Translations
`pages.json` in all 8 languages (marketing copy adapted per language, not word for word; register as in each language's existing texts; ru/uk plural forms), 4 navigation keys × 8. `npm run i18n:check`: complete.

### 4.8 Performance
- The new pages are Server Components (only the contact form and the admin shell send JavaScript); walk images reuse `next/image` via `WalkCard`.
- The phone menu in the header is a `<details>` element: no JavaScript.
- Admin: the shell is the only client part of the frame; pages stay server-rendered; no new dependencies.

### 4.9 Tests actually run
On the merged branch (2026-10-16): `npm run typecheck` ✓, `npm run lint` ✓, `npm run i18n:check` ✓ (8 languages complete), `npx vitest run` 82 files / **1,482 tests passed**. Browser tests (production build, 390 px): the public pages, pages, languages and layout specs (24) passed, an earlier full run 38 + 1 fixed (phone-menu selector). Screenshots checked: admin at 1366 / 820 / 390 px, /about desktop, /contact, /reviews and the menu in German on a phone.

### 4.10 Known limitations
- `noindex` stays on the whole site (content and image rights not cleared): the SEO metadata is ready but search engines won't index yet.
- The admin is dark only (there was no light mode).
- `CONTACT_EMAIL` must be set (and that mailbox must exist) before the contact form works; the domain has no MX record yet.
