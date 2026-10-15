# Phase 8 report: emails, reviews and discount codes

Date: 2026-10-17. Branch: `commercial/p8-emails-reviews` (from `main` = `e326d8a`, after P7). Not merged, not deployed.
Brief: phase 7 "Automatische e-mails, reviews en kortingscodes" (my step P8).

## 0. Decisions used (please confirm)

The four questions at the start were not answered. I built the safest recommended option each time, each easy to change:

| Question | Built | Change later |
|---|---|---|
| **B9** "actually finished" | The completion screen of a guide walk on a phone **with a ticket** sends one "finished" call (no location, no progress); for Hidden Pubs the host ending a game made with a ticket. First time only. | – |
| Legal basis for the follow-up | **Unticked box on the buy box** (explicit consent), recorded per order with time + sentence version (`FOLLOW_UP_CONSENT_VERSION`); unsubscribe link + one-click header in the email | Soft opt-in would be one condition in `queueFollowUp` (⚖️ first) |
| Where reviews go | **Our own review page**, only with a real ticket, one per ticket, moderated in `/admin/reviews`. **Nothing is shown on the site yet** (that's for the SEO phase, so there are never unchecked reviews online) | A Google link could be added to the email |
| **B11** reward | **10 % for every review, whatever the rating**, personal single-use code, valid 6 months, the review marked "incentivised" | `REVIEW_REWARD` in `config.ts` (`enabled: false` = only the question) |

## 1. What was built

| Brief | Built |
|---|---|
| **7.1 Transactional emails** | A shared layout (`server/email-templates.ts`): every customer email comes out as **plain text + HTML** from the same content (site colours, one button, everything escaped, no images, no tracking pixels). Templates: (1) payment confirmation and (2) access to the walk = one email with the ticket button; (3) group invitation = in that email for 2+ persons (everyone opens the same link; Hidden Pubs: the organiser invites from the lobby with link, QR code or WhatsApp); (4) invoice notice = template ready, connected in P6 (Billit); (5) quote request = confirmation (now HTML too, already from P4); (6) **corporate booking confirmed** = new, sent once when an admin moves a request to ACCEPTED, in the company's language; (7) refund (now HTML). All in 8 languages. |
| **7.2 Email after the walk** | Only when the walk was really finished (§0), only with consent, never to an address that unsubscribed, never for a refunded order, **once per order** (outbox id `follow-up:<orderId>`; finishing twice or two phones at once → one email). It asks for a review and offers the code. |
| Reviews | `/review#<token>` (8 languages): the token is signed for one ticket; 1–5 stars, optional text (≤ 1,000), optional display name, a separate "may be shown on the website" box. One per ticket (unique index, also at the same moment). After sending: the personal code on screen and by email. `/admin/reviews`: approve / reject / delete (words are never edited; delete = also the GDPR erasure route), all audited. The dashboard shows the average of approved reviews. |
| **7.3 Discount codes** | Already there (P2): percent, fixed, validity, maximum uses, products, checked on the server, a use reserved atomically. New: **unique codes per customer**: review rewards (personal, one use) and **batches** of up to 500 unique single-use codes in `/admin/discounts` (shown once to copy, then one summary line); **refunds**: a full refund gives the order's code use back (once) and switches off unused review rewards earned with that order. |
| **7.4 Email infrastructure** | See §3: Brevo stays (decision B6); the API now sends HTML and the `List-Unsubscribe` + `List-Unsubscribe-Post` headers. |
| **7.5 GDPR and marketing** | See §4. |

## 2. Where, and how it works (Next.js)

- `ReportWalkCompleted` is a tiny Client Component rendered on the completion screen only when the play page (a Server Component) saw a valid ticket (`playAccess === "granted"`). It POSTs `/api/tickets/complete`; the route reads the httpOnly ticket cookie itself, so the browser sends nothing but the walk's slug.
- The Hidden Pubs actions route uses `after()` (runs after the answer is sent) to record a finished game, only with sales open; the game rules are untouched.
- Signed links without storage: `signValue(purpose, value)` in `ticket-token.ts` (HMAC with `TICKET_SIGNING_SECRET`; the purpose is signed too, so a ticket link can't be used as a review or unsubscribe link). The unsubscribe token contains only the SHA-256 of the address.
- `/api/unsubscribe` accepts the page's JSON and the mail app's one-click POST (RFC 8058, form-encoded, from the provider: no JSON/same-origin check possible, the signature is the protection).

## 3. Email provider comparison (brief 7.4)

Figures from 2026 comparison sites (approximate, vendors change prices: check before deciding):

| Provider | Free | Entry price | EU | Notes |
|---|---|---|---|---|
| **Brevo** (chosen, B6) | 300/day (~9,000/month), transactional included | ~$15/month for 20,000 | EU company (France), EU hosting | Templates, logs, marketing in the same tool if ever wanted; API used with plain `fetch` |
| Postmark | 100/month (trial) | ~$15/month for 10,000 | not EU-hosted | Excellent deliverability, transactional only |
| Resend | 3,000/month (100/day) | $20/month for 50,000 | not EU-hosted by default | Developer-friendly |
| Mailgun | 100/day (sources differ) | ~$15/month for 10,000 | EU region available | |
| Amazon SES | 3,000/month for 12 months | $0.10 per 1,000 | EU regions | Cheapest at scale, but bounces/logs/templates are your own work |

Conclusion: at Hidden Antwerp's volumes (hundreds to a few thousand emails a month) **Brevo's free plan is enough**, it is an EU company with EU hosting (fits GDPR), has logs and templates, and is already built in. No paid plan is needed now. Before launch: set up SPF/DKIM/DMARC for the sending domain in Brevo (deliverability) and sign Brevo's DPA.

Sources: [Brevo – best email APIs 2026](https://www.brevo.com/blog/best-email-api/), [Email API pricing comparison (July 2026)](https://www.buildmvpfast.com/api-costs/email), [devtoollab – Resend vs Postmark vs SES vs Mailgun](https://devtoollab.com/blog/best-email-api-providers), [Lettr – transactional services 2026](https://lettr.com/blog/best-transactional-email-services/), [Mailflow Authority – free and paid APIs](https://mailflowauthority.com/esp-reviews/email-api-service-comparison), [Courier – 13 transactional services](https://www.courier.com/integrations/list/transactional-email), [Mailercloud](https://www.mailercloud.com/blog/best-transactional-email-services).

## 4. GDPR and marketing (brief 7.5)

| | Transactional (always) | Non-transactional (only with consent) |
|---|---|---|
| Emails | Order confirmation + ticket, refund, quote confirmation, booking confirmation, sign-in links, invoice notice, the review-reward code (a direct answer to the customer's own action) | The follow-up after the walk (feedback question + code) |
| Basis | Contract / pre-contractual steps | Consent: unticked box, recorded per order (`followUp: { consent, at, textVersion }`) |
| Way out | – | Unsubscribe link in every follow-up + `List-Unsubscribe` one-click; stored as a hash in `com_suppressions` |

- **Data minimisation:** the completion call sends no location or progress; the unsubscribe list holds hashes, not addresses; partners/reviews never show email addresses; review display names are optional.
- **Retention:** outbox texts are removed once sent (P1); consent stays with the order (as long as the order: accounting); suppressions are kept (needed to respect the opt-out); reviews until deleted (admin "delete", also on request).
- **Access and deletion requests:** today by hand (orders and reviews are in the admin area; delete a review there). A complete "find by email → export / pseudonymise" tool is planned for the security & GDPR phase (P9).
- **Rewarded reviews (EU Omnibus rules):** the reward never depends on the rating (tested with a 2-star review), it is said on the review page and in the email, and every review stores `incentivised` so a public display must label it.
- ⚖️ To check: the consent sentence and the follow-up text with a lawyer; the privacy notice must mention reviews, the follow-up email and Brevo as processor.

## 5. Tests (all run 2026-10-17)

| Check | Result |
|---|---|
| typecheck, lint, i18n:check | ✅ no errors; every language has every text (841 × 8) |
| `npm run test:coverage` | ✅ 1,439 tests passed; coverage 94.3 % statements, 87.7 % branches, 96.8 % functions, 97.3 % lines (above the thresholds) |
| `npm run test:db` (Atlas test database) | ✅ 69 passed, 2 skipped — 4 runs in a row |
| build + Playwright `commerce`, `admin` | ✅ build OK; 14 browser tests passed. The full browser suite runs in CI. |

`src/__tests__/commerce-followup.test.ts` (23 tests), the brief's list:
- **correct sending**: layout (text + HTML, escaping, only http(s) links), Brevo request (HTML, one-click headers only for follow-ups), HTML kept until sent then removed;
- **double events**: finishing twice and twice at the same moment → one follow-up; a game ended twice → one; a review sent twice at once → one;
- **invalid address / provider outage / repeated retries**: a provider refusal is retried with pauses and then marked failed (5 tries, never doubled);
- **unsubscribing**: token holds only the hash, tampered tokens and ticket signatures refused, page and one-click both work, an unsubscribed address gets no follow-up;
- **expired codes**: a reward code after 6 months is refused; **a code used twice** is refused;
- **code at a refund**: a full refund gives the use back (once) and switches off unused rewards;
- **multilingual emails**: confirmation (fr), follow-up (uk), reward (es), invoice notice (de), booking confirmation (nl);
- no consent / refunded / other walk / no ticket → no follow-up; Hidden Pubs end; the completion route; reviews (link checks, refunded order, input checks, moderation, average); batches.

Store contract tests (memory + MongoDB): finishing once also at the same moment, the ticket of a game, one review per ticket also at the same moment, suppressions. While running them on MongoDB I found that one of my P7 tests (and the new review test) assumed which of two simultaneous inserts wins; the store is right (exactly one wins), the tests now accept either.
Browser tests: the review page with a broken link (message, phone width, noindex), the unsubscribe page only acting on a button press, `/admin/reviews` needs a session. The buy box test now checks the consent box is unticked by default.

## 6. Files

**New:** `src/features/commerce/server/{email-templates,follow-up-service,review-service}.ts`, `src/features/commerce/components/{ReportWalkCompleted,ReviewForm,UnsubscribeButton}.tsx`, `src/features/commerce/admin/ReviewModeration.tsx`, `src/app/review/page.tsx`, `src/app/unsubscribe/page.tsx`, `src/app/admin/(console)/reviews/page.tsx`, `src/app/api/{tickets/complete,reviews,reviews/check,unsubscribe}/route.ts`, `src/app/api/admin/{reviews/[id],discounts/batch}/route.ts`, `src/i18n/locales/<8>/feedback.json`, `src/__tests__/commerce-followup.test.ts`, this report.
**Changed:** `src/types/commerce.ts` (Order.followUp, TicketGrant.completedAt, Discount.source/batchId/forOrderId, Review, OutboxEmail.html/unsubscribeUrl, audit actions), `config.ts`, `server/{mailer,email-service,order-emails,quote-service,discount-service,fulfilment-service,checkout-service,ticket-token,commerce-store,memory-store,mongo-store}.ts`, `components/BuyBox.tsx`, `admin/{DiscountManager.tsx,admin-api.ts}`, `src/features/guide/components/GuideWalkPlayer.tsx` + `walk-session/components/WalkPlayer.tsx` (one optional prop), `src/app/walks/[slug]/play/page.tsx`, `src/app/api/games/[code]/actions/route.ts`, `src/app/admin/(console)/{layout,page}.tsx`, `src/i18n/locales/<8>/{index.ts,commerce.json,corporate.json}`, `db/mongo-schema.mjs`, tests `commerce-store.test.ts`, `commerce-buyer-screens.test.tsx`, `e2e/commerce.spec.ts`, `CLAUDE.md`.

## 7. Database (add-only; run `npm run db:setup` on production)

New `com_reviews` (unique `grantId`), `com_suppressions` (`_id` = address hash). Optional new fields: `com_orders.followUp`, `com_ticket_grants.completedAt`, `com_discounts.source/batchId/forOrderId`, `com_email_outbox.html/unsubscribeUrl` (validation updated). Nothing is deleted or rewritten.

## 8. Open points

1. Confirm the four decisions in §0.
2. ⚖️ Consent sentence, follow-up text, privacy notice (reviews, follow-up, Brevo), Brevo DPA, SPF/DKIM/DMARC.
3. Showing reviews on the site (with "rewarded" labels and only `mayPublish` ones): planned with the SEO phase.
4. A full data-subject tool (export / erase by email): security & GDPR phase.
5. Guide walks played without a ticket (sales closed) never send anything: there is no email address.

## 9. How to test it yourself

1. Dev server with memory data (Git Bash): `MONGODB_URI= COMMERCE_SALES_ENABLED=true npm run dev` plus Stripe test keys (P2 report §9); sign in at `/admin`, confirm test tax settings, activate a product.
2. Buy a ticket, tick the new box; open the ticket link on the phone/browser; jump to the end of the walk (playtest tools) → the follow-up email appears in the terminal.
3. Open its review link → leave a review → the code appears; check `/admin/reviews` and the dashboard's average.
4. Use the code on a new purchase (works once). Refund that order fully in `/admin/orders` → the code is usable again.
5. `/admin/discounts` → "Unique codes" → 10 codes.
6. The follow-up's unsubscribe link → press the button → finishing another walk sends nothing.
