# Phase 10 report: tests, CI and production readiness

Date: 2026-10-17. Branch: `commercial/p10-launch-readiness` (from `main` = `7b59789`). Not merged, not deployed.
Brief: phases 9 ("Tests, CI/CD en regressiecontrole") and 10 ("Productiegereed maken").

## 0. Production setup done with the owner (before this branch)

Together with the owner, step by step and verified from outside (without seeing any secret):
- domain **www.hiddenantwerp.com** bought at GoDaddy, DNS → Vercel (A `@` → 216.198.79.1, CNAME `www`), https on both names, apex → www;
- Vercel: `APP_BASE_URL`, `ADMIN_EMAILS`, `TICKET_SIGNING_SECRET`, `CRON_SECRET`, Brevo, Stripe **test** keys + webhook;
- Brevo: domain authenticated (brevo-code TXT, DKIM CNAMEs, one DMARC `p=none`; GoDaddy's own DMARC record removed); "Authorised IPs" switched off (it blocked Vercel: `brevo-401` in the outbox);
- verified: sign-in emails delivered and the owner signed in to `/admin`; cron route 401 without the secret; forged Stripe webhooks → `400 invalid-signature`.

## 1. What was built

| Brief | Built |
|---|---|
| 10.1–10.2 environment and production configuration | **`/admin/readiness`**: every setting and decision as a check (OK / Missing / Check / To do), split into "running and testing" and "before real sales"; never shows a secret's value (`logic/readiness.ts`, tested). |
| EU region | **`vercel.json` → `"regions": ["fra1"]`** (Frankfurt). The functions ran in Washington (`iad1`) while the database is in Azure West Europe: every database call crossed the Atlantic, and personal data was processed in the US. |
| 10.8 email handling | Sign-in emails get `sendBefore` = the link's expiry: an email that couldn't be sent in time is given up ("expired") instead of delivering a dead link later (the Brevo outage showed the problem). |
| 9.1 / 10.4 / 10.6 complete purchase journeys | **`e2e/purchase.spec.ts`** on a second Playwright server ("shop", port 3301) with sales OPEN and a **test payment page** instead of Stripe (`COMMERCE_FAKE_PAYMENTS`): (1) guide walk: paywall without ticket → buy → pay → success page → open ticket → play page; (2) Hidden Pubs: ticket for 2 → game with 2 places → second player joins, lobby says full, a third is refused. "Pay" sends the webhook's event through the real handler, so everything after payment is the production code. |
| Safety of the test payment page | Works only with `COMMERCE_FAKE_PAYMENTS=true` **and** memory stores, **never** on Vercel (`fakePaymentsAllowed()`); everywhere else the page and both routes answer 404 — unit-tested and checked in the normal e2e project. The tax settings come from the test, so the code still holds no VAT rate (B8). |
| 10 checklist | **`docs/commercial/LAUNCH_CHECKLIST.md`**: the brief's 14 points with how each was verified and what's left, plus the ordered "before real sales" list. |

## 2. How it works (Next.js / Playwright)

- `/admin/readiness` is a Server Component: it reads `process.env` on the server and passes only "set / not set" and safe facts to the page (`readiness-service.ts`); `VERCEL_REGION` tells which region served the request.
- Playwright now starts **two** `next start` servers from the same build with different environment variables: one as visitors get it (sales closed, port 3300), one shop (sales open + test payments, port 3301). The project `shop` runs only `purchase.spec.ts`; CI's `npm run test:e2e` runs both.
- The test payment page lives under `app/playtest/` (English, like the other playtest tools) and calls `notFound()` unless the gate is open.

## 3. Tests (all run 2026-10-17)

| Check | Result |
|---|---|
| typecheck, lint, i18n:check | ✅ no errors; every language has every text |
| `npm run test:coverage` | ✅ 1,467 tests passed; coverage 94.1 % statements, 87.2 % branches, 96.5 % functions, 97.1 % lines |
| `npm run test:db` (Atlas test database) | ✅ 71 passed, 2 skipped |
| build + Playwright `purchase` (shop), `commerce`, `admin` | ✅ build OK; 3 purchase journeys + 15 commerce/admin tests + the new 404 test passed (first run: 1 failure in my test — it expected "2 of 2 places taken" where a full lobby says "All 2 places are taken"; fixed the test, the feature was right). The full browser suite runs in CI. |

New unit tests `commerce-launch.test.ts`: readiness (ready for test mode, missing/wrong settings named, warnings for live keys while closed / playtest tools / test flags / US region, no secret values shown, live stage), sign-in email expiry (given up after 15 min, sent within), fake payments (gate incl. Vercel, 404 without the flag, seed → checkout → pay through the real handler, gate present in every test-only file).

Found on the way: two tests that read the whole repository (`pub-game-data`, `security-guards`) passed alone but hit vitest's default 5-second limit in a busy full run. They now have a 30-second limit (the checks themselves are unchanged).

## 4. Files

**New:** `src/features/commerce/logic/readiness.ts`, `server/readiness-service.ts`, `server/fake-payment-gateway.ts`, `server/fake-payments.ts`, `src/features/commerce/playtest/FakeCheckout.tsx`, `src/app/admin/(console)/readiness/page.tsx`, `src/app/playtest/checkout/page.tsx`, `src/app/api/playtest/{seed,pay}/route.ts`, `e2e/purchase.spec.ts`, `src/__tests__/commerce-launch.test.ts`, `docs/commercial/LAUNCH_CHECKLIST.md`, this report.
**Changed:** `vercel.json` (region), `playwright.config.ts` (two servers, project "shop"), `src/types/commerce.ts` (`OutboxEmail.sendBefore`), `server/{email-service,auth-service,partner-auth-service,context,mongo-store}.ts`, `db/mongo-schema.mjs` (optional `sendBefore`), `src/app/admin/(console)/layout.tsx` (nav), `e2e/commerce.spec.ts`, `CLAUDE.md`.

## 5. Database

Only an optional field `com_email_outbox.sendBefore` in the validation (add-only; `npm run db:setup` updates the rule).

## 6. External configuration / costs

- After merging, the next deployment runs in **Frankfurt**: nothing to configure. (Vercel: no extra cost for choosing one region.)
- No new services, no new dependencies.

## 7. Open points (see LAUNCH_CHECKLIST.md)

1. A real purchase in Stripe test mode (I'll guide it; locally with the Stripe CLI is safest).
2. ⚖️ VAT confirmation (B8), legal texts, processor agreements.
3. Atlas tier with backups (B12); CSP enforcement after a phone check; iOS Safari field test.
4. Billit (P6) once the account exists; optional admin second factor.
5. Stripe activation and live keys only with the owner's explicit OK.

## 8. How to test it yourself

1. After merging: `www.hiddenantwerp.com/admin/readiness` → the "running and testing" list should be all green (Region: `fra1`).
2. Locally: `npm run build` then `npx playwright test e2e/purchase.spec.ts` (starts the shop server by itself) to watch the purchase journeys pass.
