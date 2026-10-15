# Phase 1 report: foundation (admin sign-in, catalogue, audit log, email)

Date: 2026-10-16. Branch: `commercial/p1-foundation` (from `main` = `0afabf4`). Not merged, not deployed.
Plan: [COMMERCIAL_IMPLEMENTATION_PLAN.md](COMMERCIAL_IMPLEMENTATION_PLAN.md), step P1. Decisions used: B2, B3, B5, B6.

## 1. What was built

| Part | What it does |
|---|---|
| **Admin sign-in** (B5) | One-time email link, no passwords. `ADMIN_EMAILS` says who may be admin. The link opens `/admin/login/verify#<secret>`; the secret is only sent when the button is pressed (email scanners can't use it up) and is removed from the address bar afterwards. Links work once, for 15 minutes; sessions last 12 hours in an httpOnly, `SameSite=Strict` cookie. The same answer for admin and non-admin addresses. |
| **Sessions and access** | `requireAdmin()` on every admin page, `adminFromRequest()` on every admin route (the Next.js "data access layer" pattern; not in the layout). Removing an address from `ADMIN_EMAILS` or deactivating a user ends access at once. |
| **Rate limiting** | Fixed-window counters in MongoDB (TTL): 5 links per email and 20 per network address per 15 minutes, 20 link attempts per network address. Emails and IP addresses are only stored hashed. No new dependency. |
| **Product catalogue** | `/admin/products`: name, VAT rate (0/6/12/21 %), price per person (VAT included) and on/off sale, without code changes. A price change adds a new price; the history stays. A product can only go on sale with a VAT rate and a price. Starter products: Classics of Antwerp €7.95, **17 Gates** (= Poortjes, B2) €9.95, Hidden Pubs €14.95 per person (B3), all inactive and without VAT rate. |
| **Audit log** | `/admin/audit`: sign-ins, sign-outs, catalogue seeding and every change with "old → new" and who did it; server-side pagination. |
| **Email** (B6) | `Mailer` interface: Brevo (HTTPS API with `fetch`, no SDK) or memory (development prints emails, including your sign-in link, in the terminal). Outbox with idempotent ids, an atomic claim (two senders can't send the same email), retries after 1 min, 5 min, 30 min and 2 h, then "failed"; the text is removed once sent or given up. |
| **Admin pages** | `/admin/login`, `/admin/login/verify`, `/admin` (who is signed in, which services are configured: never their values), `/admin/products`, `/admin/audit`. English only (owner tool, like the playtest tools), `lang="en"`, `noindex`, mobile-first with the existing design tokens and `Button`. |

**Not changed:** Hidden Pubs rules, café order, walk content, GPS, i18n, visitor pages. "On sale" has no effect for visitors until P2 (payments).

## 2. Files

**New**
- `src/types/commerce.ts`
- `src/features/commerce/config.ts`
- `src/features/commerce/logic/` `money.ts`, `email.ts`, `rate-limit.ts`, `catalog.ts`, `starter-catalog.ts`
- `src/features/commerce/server/` `commerce-store.ts`, `memory-store.ts`, `mongo-store.ts`, `context.ts`, `mailer.ts`, `email-service.ts`, `auth-service.ts`, `catalog-service.ts`, `admin-access.ts`, `http.ts`, `support.ts`, `result.ts`
- `src/features/commerce/admin/` `admin-api.ts`, `AdminStatus.tsx`, `LoginForm.tsx`, `VerifyLogin.tsx`, `SignOutButton.tsx`, `ProductEditor.tsx`
- `src/app/admin/layout.tsx`, `src/app/admin/login/page.tsx`, `src/app/admin/login/verify/page.tsx`, `src/app/admin/(console)/layout.tsx`, `page.tsx`, `products/page.tsx`, `audit/page.tsx`
- `src/app/api/admin/auth/login-link/route.ts`, `verify/route.ts`, `logout/route.ts`, `src/app/api/admin/products/[id]/route.ts`, `[id]/price/route.ts`
- Tests: `src/__tests__/commerce-logic.test.ts`, `commerce-auth.test.ts`, `commerce-email.test.ts`, `commerce-catalog.test.ts`, `commerce-api.test.ts`, `commerce-store.test.ts`, `commerce-admin-screens.test.tsx`, `fixtures/commerce-context.ts`, `e2e/admin.spec.ts`
- Docs: `docs/commercial/*` (Phase 0, committed separately) and this report

**Changed**
- `db/mongo-schema.mjs`: 8 new `com_*` collections with validation and indexes (additions only)
- `src/__tests__/no-hardcoded-text.test.ts`: folders named `admin/` are skipped (English-only owner tool)
- `vitest.config.mts`: coverage includes `src/features/commerce/server/**` (MongoDB store, wiring and the cookie helper excluded, like Hidden Pubs)
- `playwright.config.ts`: the test server keeps commerce data in memory, has no admins and **empty Brevo keys** (tests can never send real email)
- `package.json`: `npm run test:db` also runs `commerce-store.test.ts`
- `.env.example`: `ADMIN_EMAILS`, `APP_BASE_URL`, `BREVO_API_KEY`, `EMAIL_FROM`, `COMMERCE_MEMORY_STORES`
- `CLAUDE.md`: new section "Commercial platform", folder map, env, status
- `docs/commercial/COMMERCIAL_IMPLEMENTATION_PLAN.md`, `DATABASE_DESIGN.md`: decisions recorded

## 3. Database changes

New collections (created by `npm run db:setup`, which only adds): `com_users` (unique email), `com_login_tokens` (TTL), `com_sessions` (TTL), `com_rate_limits` (TTL), `com_audit_log`, `com_products`, `com_prices`, `com_email_outbox` (TTL 90 days). No existing collection or document changed.
- **Test database** `HiddenAntwerpGeneral_test`: the collections were created by `npm run test:db` (the test deletes only its own documents).
- **Production database:** not touched. Run `npm run db:setup` once before using the admin area on Vercel (or the first write creates the collections without validation).

## 4. Tests run (all actually executed on 2026-10-16)

| Check | Result |
|---|---|
| `npm run typecheck` | ✅ passed |
| `npm run lint` | ✅ passed |
| `npm run i18n:check` | ✅ passed (no visitor texts changed) |
| `npm run test:coverage` (all unit/component tests) | ✅ **1,146 / 1,146** passed (65 files). Coverage: statements 95.05 %, branches 89.82 %, functions 99.09 %, lines 98.33 % (thresholds 90/85/95/95) |
| `npm run test:db` (MongoDB store tests against the Atlas **test** database) | ✅ 37 passed, 2 skipped (the "set TEST_MONGODB_URI" placeholders); the commerce contract tests ran against both memory and MongoDB |
| `npm run build` (without playtest tools) | ✅ passed; the 5 admin pages and 5 admin routes are dynamic (ƒ) |
| Playwright `e2e/admin.spec.ts` + `e2e/pages.spec.ts` | ✅ 15 / 15 passed |
| Playwright full suite | ⚠️ **not completed**: the run was stopped because the computer ran low on memory (not a test failure). Left to CI on the pull request. |

New tests cover: sign-in link for admin vs. non-admin (same answer, no email), one use, two uses at the same moment (one session), expiry, made-up and NoSQL-shaped links, removal from `ADMIN_EMAILS`, deactivated user, rate limits per email / per network / per link attempt, only hashes stored, session expiry and sign-out; outbox idempotency, concurrent senders, retries, failure without message, text removal; Brevo request shape, error codes without the key; catalogue seeding (also concurrent), activation rules, price history, audit details, pagination; the routes' origin/JSON checks, cookie flags, 401 without session, `APP_BASE_URL` over the request host, 503 in production without it; the store contract on MongoDB, including an unreachable database and injection attempts.

**Not run:** the complete Playwright suite (see above); the other suites (GPS walk, languages, layout, Hidden Pubs multiplayer) don't touch the new code, but only a full run proves that. A real Brevo email (no account/key yet). The admin pages on Vercel.

## 5. Security checks done

- Every new POST route uses the existing `checkPostRequest` (same origin + JSON only, 10 kB cap) and answers `no-store`.
- Admin routes check the session themselves; tests prove 401 without, with a forged and with a signed-out cookie.
- Secrets: 32 random bytes; only SHA-256 hashes in the database; the session secret only in the cookie, never in JSON; the link secret only after `#`.
- No account enumeration through the answer. Remaining, low: an admin request does a few more database writes than a non-admin one, so response *times* differ slightly (rate limited; the email itself is sent after the response).
- NoSQL injection: every filter value is checked as a short string in the MongoDB store (tested); request bodies are narrowed field by field.
- Logs: database errors by name/code only; email errors as short codes; no tokens, emails or bodies logged in production. (The memory mailer prints emails only in development.)
- Host header: links in emails come from `APP_BASE_URL` in production.
- Rate limiting depends on `x-forwarded-for`, which Vercel sets; locally everyone shares one key (fine for development).

## 6. Open points

1. **Second factor for admins** (planned in SECURITY_AND_GDPR.md): not built. The email link is one factor (access to the inbox). Proposal: passkeys or an emailed code later; secure the admin mailbox with 2FA meanwhile.
2. **Outbox cron:** not added. Every new email starts a delivery round that also retries due emails; a failed sign-in mail can simply be requested again. Order emails (P2) will need a cron (`CRON_SECRET` already exists).
3. **Two MongoDB clients per server instance** (Hidden Pubs + commerce, 10 connections each). Fine for Atlas limits; can be merged into one shared client later (small refactor touching Hidden Pubs' context).
4. **PR #6** (Classics audio) also adds `/admin/audio-test` and `/api/admin/*` dev routes and edits `CLAUDE.md`: expect small merge conflicts in `CLAUDE.md`; the `admin/` skip in the hardcoded-text test will also apply to its Voice Studio.
5. **Production DB:** run `npm run db:setup` before first use.
6. Admin UI is English only (decision taken here, following the brief's "English as main language"; easy to translate later if you want).

## 7. External configuration needed (owner)

| Where | What |
|---|---|
| Brevo | Create a (free) account; verify the sender domain (SPF + DKIM, and a DMARC record); create an API key |
| Vercel → Environment Variables (Production, and Preview with test values) | `ADMIN_EMAILS`, `APP_BASE_URL` (e.g. `https://<your domain>`), `BREVO_API_KEY`, `EMAIL_FROM` |
| Locally | Run `npm run db:setup` against production once (it only adds); optionally put `ADMIN_EMAILS` in `.env.local` to sign in on the dev server (the link appears in the terminal) |

## 8. Costs

No new paid service is required for P1. Brevo's free plan (about 300 emails/day, to verify on brevo.com) is enough for admin sign-in. No new npm dependency.

## 9. How to test it yourself

1. Put `ADMIN_EMAILS=<your address>` in `.env.local`. **Careful:** your `.env.local` has `MONGODB_URI` pointing at the REAL database, and `npm run dev` uses it when it's set. To test with memory instead, start the dev server with it emptied, in **Git Bash**: `MONGODB_URI= npm run dev` (an empty variable that is already set is never overwritten by `.env.local`). Not in PowerShell: there `$env:MONGODB_URI=""` deletes the variable, and Next.js would read the real one from `.env.local` again.
2. Open `http://localhost:3000/admin` → you're sent to the sign-in page.
3. Type your address → the sign-in email is printed in the terminal → open the link → press **Sign in**.
4. In `/admin/products` change a price (e.g. `16,50`), set a VAT rate, put a product on sale; then check `/admin/audit`.
5. Try a non-admin address (same message, nothing in the terminal), and open the link a second time (refused).
