# Phase 9 report: security and GDPR

Date: 2026-10-17. Branch: `commercial/p9-security-gdpr` (from `main` = `c506abb`, after P8). Not merged, not deployed.
Brief: phase 8 "Beveiliging en GDPR". (In the original plan P9 was SEO; at your request security & GDPR came first, SEO moves to a later step and still needs decision B4.)

## 1. What was done

- **The audit:** `docs/commercial/SECURITY_AUDIT.md`, a risk overview of all new modules (22 risks with severity, impact, measure and status), the brief's checklist item by item, the retention periods, and what needs a lawyer or accountant (⚖️).
- **Personal data requests** (`/admin/privacy`, `server/privacy-service.ts`):
  - find everything about an email address (case-insensitive): orders, quote requests, reviews, email records, a partner account, unsubscribe status;
  - **export** as one JSON file (GDPR access/portability), downloaded in the browser, without internal hashes or email bodies;
  - **erase**: quotes, reviews and email records deleted; orders keep amounts, VAT, country and business details (accounting) but lose the email and name (`erasedAt`); a partner user is switched off, its address replaced and removed from the audit log; the address's hash goes on the unsubscribe list so no follow-up is ever sent again; admins can't be erased here; the address must be typed twice;
  - everything by POST, so an address never appears in a URL or server log; every request audited by the address's hash.
- **Retention**, applied every night inside the existing daily cron (Vercel's Hobby plan allows two crons, so no third one): audit log 2 years, rejected reviews 1 year, unpaid orders 1 year, email/name of paid orders removed after 10 years. Periods in `RETENTION` (`config.ts`), shown on `/admin/privacy`.
- **Admin sign-in alert:** every admin sign-in sends that admin an email ("wasn't you? remove the address from ADMIN_EMAILS…").
- **Guard tests** (`security-guards.test.ts`) that read the code: every admin route/page and partner route/page checks access itself; every cron route checks `CRON_SECRET` in constant time; every POST route checks origin and JSON (except the signed webhook endpoints and uploads); no API keys or connection strings in any tracked file; no secret as `NEXT_PUBLIC_`; no log line with an email, token, secret or cookie.
- **Memory stores refused on Vercel** (Hidden Pubs and commerce), even if a test flag were set there by mistake.
- **Backups (stopgap):** `npm run db:export` writes every `com_*` collection as Extended JSON to the git-ignored `backups/` (read-only; the files contain personal data). Atlas' free tier has no backups: a paid tier before launch (B12).
- **`/privacy`** (8 languages, footer link "Privacy & cookies"): a factual list of every cookie and phone-storage key (names taken from the code), the GPS rule, what is on our servers, the services used and your rights. It says clearly that the full privacy notice is still to be written and checked by a lawyer, and the contact address is a visible placeholder (never invented).
- `npm audit`: 0 vulnerabilities in what runs on the site; 5 in dev-only lint tooling (fix = downgrade to Next 14: not applied).

## 2. How it works (Next.js)

- `/admin/privacy` is a Server Component page (access check `requireAdmin()`), with a Client Component (`PrivacyRequests`) that calls three admin POST routes. The export is returned as JSON and turned into a download in the browser (`Blob` + `URL.createObjectURL`), so no file is written on the server.
- `/privacy` is a Server Component that reads the cookie durations from the same constants the code uses (`GAME_LIFETIME_DAYS`, `PARTNER_ATTRIBUTION_DAYS`), so the page can't drift from reality.

## 3. Tests (all run 2026-10-17)

| Check | Result |
|---|---|
| typecheck, lint, i18n:check | ✅ no errors; every language has every text (886 × 8) |
| `npm run test:coverage` | ✅ 1,456 tests passed; coverage 94.5 % statements, 87.7 % branches, 96.9 % functions, 97.4 % lines |
| `npm run test:db` (Atlas test database) | ✅ 71 passed, 2 skipped (twice) |
| build + Playwright `commerce`, `admin` | ✅ build OK; 15 browser tests passed. The full browser suite runs in CI. |

New: `commerce-privacy.test.ts` (8): finding data in any case, export without hashes/bodies and audited by hash, erase rules (confirmation, admins refused, accounting fields kept, quotes/reviews/emails gone, no follow-up afterwards, partner user erased and removed from the audit log), retention (what goes, what stays, idempotent), the admin sign-in alert, the routes need an admin session. `security-guards.test.ts` (8, see §1). Store contract tests (memory + MongoDB): lookups by email (any case, regex characters matched literally), deletes, audit anonymisation, retention queries. Browser: `/privacy` from the footer (lists the real cookies, phone width), `/admin/privacy` needs a session.

One existing test (the daily cron's answer) was updated: it now also reports the retention counts.

## 4. Files

**New:** `docs/commercial/SECURITY_AUDIT.md`, this report, `src/features/commerce/server/privacy-service.ts`, `src/features/commerce/admin/PrivacyRequests.tsx`, `src/app/admin/(console)/privacy/page.tsx`, `src/app/api/admin/privacy/{lookup,export,erase}/route.ts`, `src/app/privacy/page.tsx`, `src/i18n/locales/<8>/privacy.json`, `scripts/db-export.mjs`, `src/__tests__/{commerce-privacy,security-guards}.test.ts`.
**Changed:** `src/types/commerce.ts` (`Order.erasedAt`, audit actions), `config.ts` (`RETENTION`), `server/{auth-service,context,commerce-store,memory-store,mongo-store}.ts`, `src/features/pub-game/server/context.ts`, `src/app/api/cron/email-outbox/route.ts`, `src/app/admin/(console)/layout.tsx`, `admin/admin-api.ts`, `src/components/layout/SiteFooter.tsx`, `src/i18n/locales/<8>/{index.ts,navigation.json}`, `db/mongo-schema.mjs`, `package.json` (`db:export`), `.gitignore` (`/backups/`), `src/__tests__/commerce-store.test.ts`, `e2e/commerce.spec.ts`, `CLAUDE.md`.

## 5. Database (add-only; run `npm run db:setup` on production)

Indexes on `com_orders.email` and `com_quote_requests.email` (for requests), optional `com_orders.erasedAt`. Nothing deleted or rewritten by the setup. The nightly retention does delete old records as listed in §1 (none exist yet).

## 6. Open points (decisions and ⚖️)

1. **Second factor for admins** (TOTP code from an authenticator app, can be built without a new dependency): recommended before launch. Your decision.
2. **Atlas tier with backups** (B12) before launch; until then `npm run db:export` regularly, on an encrypted disk.
3. **Enforce the CSP:** check the browser console on real phones with a production build, then switch the header (one line).
4. ⚖️ Privacy notice, terms of sale, processor agreements, retention periods, `ha_ref` consent, the follow-up consent sentence, partner agreements (see SECURITY_AUDIT.md §4). The contact address for privacy questions must be filled in on `/privacy`.
5. Set `CRON_SECRET` on Vercel (the nightly maintenance and photo cleanup don't run without it).

## 7. How to test it yourself

1. `MONGODB_URI= npm run dev`, sign in at `/admin` → you get the sign-in alert email (in the terminal).
2. Make a test purchase (P2 report §9) or a quote request on `/corporate` with your address.
3. `/admin/privacy` → your address → Find → Export (JSON download) → Erase (type the address again) → Find again: nothing left except the anonymised order.
4. Open `/privacy` from the footer in a few languages.
5. `npm run db:export` (with a database) → `backups/<date>/`; delete the folder afterwards.
