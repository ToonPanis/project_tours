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
