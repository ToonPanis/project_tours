/**
 * The launch readiness check (P10, brief phase 10): every setting and decision
 * the commercial platform depends on, as a list of checks. Pure: the server
 * passes in a snapshot of the environment and the database state, so this can
 * be tested without Vercel.
 *
 * Two stages:
 * - "test":  everything needed to run the site and test payments in Stripe TEST mode;
 * - "live":  what must also be true before real tickets are sold.
 */

export type CheckStatus = "ok" | "missing" | "warning" | "manual";

export interface ReadinessCheck {
  id: string;
  stage: "test" | "live";
  label: string;
  status: CheckStatus;
  /** What is the case now, and what to do (English, like the admin area). */
  detail: string;
}

export interface ReadinessInput {
  env: Record<string, string | undefined>;
  /** Tax regime chosen and confirmed by the accountant (B8). */
  taxConfirmed: boolean;
  /** Products that could be sold right now (active, tax category, price). */
  sellableProducts: number;
  /** process.env.VERCEL_REGION at runtime (e.g. "fra1"); undefined outside Vercel. */
  region: string | undefined;
}

const set = (value: string | undefined) => typeof value === "string" && value.trim() !== "";
/** Vercel's European regions (functions close to the EU database, data stays in the EU). */
const EU_REGIONS = new Set(["fra1", "cdg1", "dub1", "lhr1", "arn1"]);

export function readinessChecks({ env, taxConfirmed, sellableProducts, region }: ReadinessInput): ReadinessCheck[] {
  const baseUrl = env.APP_BASE_URL?.trim() ?? "";
  const stripeKey = env.STRIPE_SECRET_KEY ?? "";
  const stripeMode = !set(stripeKey) ? "none" : stripeKey.startsWith("sk_live_") || stripeKey.startsWith("rk_live_") ? "live" : "test";
  const salesOpen = env.COMMERCE_SALES_ENABLED === "true";
  const checks: ReadinessCheck[] = [
    {
      id: "base-url",
      stage: "test",
      label: "Site address (APP_BASE_URL)",
      status: /^https:\/\/[^/]+$/.test(baseUrl) ? "ok" : "missing",
      detail: set(baseUrl) ? `${baseUrl}${/^https:\/\/[^/]+$/.test(baseUrl) ? "" : " — must be https:// with no path or trailing slash"}` : "Not set: sign-in links and ticket links can't be made.",
    },
    {
      id: "database",
      stage: "test",
      label: "Database (MONGODB_URI)",
      status: set(env.MONGODB_URI) ? "ok" : "missing",
      detail: set(env.MONGODB_URI) ? "MongoDB Atlas." : "Not set: nothing can be stored.",
    },
    {
      id: "admins",
      stage: "test",
      label: "Admin addresses (ADMIN_EMAILS)",
      status: set(env.ADMIN_EMAILS) ? "ok" : "missing",
      detail: set(env.ADMIN_EMAILS) ? `${env.ADMIN_EMAILS?.split(",").filter((part) => part.trim()).length} address(es).` : "Nobody can sign in.",
    },
    {
      id: "email",
      stage: "test",
      label: "Email (BREVO_API_KEY, EMAIL_FROM)",
      status: set(env.BREVO_API_KEY) && set(env.EMAIL_FROM) ? "ok" : "missing",
      detail: set(env.BREVO_API_KEY) && set(env.EMAIL_FROM) ? `Brevo, from ${env.EMAIL_FROM}. (Brevo "Authorised IPs" must stay off: Vercel's addresses change.)` : "No email can be sent (sign-in, tickets).",
    },
    {
      id: "ticket-key",
      stage: "test",
      label: "Ticket signing key (TICKET_SIGNING_SECRET)",
      status: (env.TICKET_SIGNING_SECRET?.length ?? 0) >= 32 ? "ok" : "missing",
      detail: (env.TICKET_SIGNING_SECRET?.length ?? 0) >= 32 ? "Set. Never change it: every ticket link sent would stop working." : "Missing or shorter than 32 characters.",
    },
    {
      id: "cron",
      stage: "test",
      label: "Nightly jobs (CRON_SECRET)",
      status: set(env.CRON_SECRET) ? "ok" : "missing",
      detail: set(env.CRON_SECRET) ? "Set: email retries, retention periods, photo cleanup run every night." : "Not set: the nightly jobs refuse to run.",
    },
    {
      id: "blob",
      stage: "test",
      label: "Hidden Pubs photo storage (BLOB_READ_WRITE_TOKEN)",
      status: set(env.BLOB_READ_WRITE_TOKEN) ? "ok" : "missing",
      detail: set(env.BLOB_READ_WRITE_TOKEN) ? "Vercel Blob (private)." : "Not set: evidence photos/videos can't be uploaded.",
    },
    {
      id: "stripe",
      stage: "test",
      label: "Stripe keys (STRIPE_SECRET_KEY)",
      status: stripeMode === "test" ? "ok" : stripeMode === "live" ? (salesOpen ? "ok" : "warning") : "missing",
      detail:
        stripeMode === "test"
          ? "Test mode: no real money."
          : stripeMode === "live"
            ? salesOpen
              ? "LIVE keys and sales open: real payments."
              : "LIVE keys while sales are closed: refused by the site. Use the test key until launch."
            : "Not set: no payment page can be opened.",
    },
    {
      id: "stripe-webhook",
      stage: "test",
      label: "Stripe webhook (STRIPE_WEBHOOK_SECRET)",
      status: set(env.STRIPE_WEBHOOK_SECRET) ? "ok" : "missing",
      detail: set(env.STRIPE_WEBHOOK_SECRET)
        ? `Set. The endpoint in Stripe must be ${baseUrl || "<APP_BASE_URL>"}/api/webhooks/stripe (Stripe doesn't follow redirects).`
        : "Not set: payments would never be confirmed.",
    },
    {
      id: "playtest",
      stage: "test",
      label: "Playtest tools off (NEXT_PUBLIC_PLAYTEST_TOOLS)",
      status: env.NEXT_PUBLIC_PLAYTEST_TOOLS === "true" ? "warning" : "ok",
      detail: env.NEXT_PUBLIC_PLAYTEST_TOOLS === "true" ? "ON: visitors can skip stops and fake GPS. Remove it and redeploy before real players come." : "Off.",
    },
    {
      id: "test-flags",
      stage: "test",
      label: "No test-only flags",
      status: ["COMMERCE_MEMORY_STORES", "PUB_GAME_MEMORY_STORES", "COMMERCE_FAKE_PAYMENTS"].some((name) => env[name] === "true") ? "warning" : "ok",
      detail: ["COMMERCE_MEMORY_STORES", "PUB_GAME_MEMORY_STORES", "COMMERCE_FAKE_PAYMENTS"].some((name) => env[name] === "true")
        ? "A test-only flag is set: remove it (the site refuses it on Vercel, but it doesn't belong here)."
        : "None set.",
    },
    {
      id: "region",
      stage: "test",
      label: "Server region in the EU",
      status: region === undefined ? "manual" : EU_REGIONS.has(region) ? "ok" : "warning",
      detail:
        region === undefined
          ? "Unknown here (not running on Vercel)."
          : EU_REGIONS.has(region)
            ? `${region}: close to the EU database, data stays in the EU.`
            : `${region}: outside the EU. vercel.json sets "fra1"; redeploy to apply it.`,
    },
    // ── Before real sales ─────────────────────────────────────────────────
    {
      id: "tax",
      stage: "live",
      label: "VAT treatment confirmed by the accountant (B8)",
      status: taxConfirmed ? "ok" : "missing",
      detail: taxConfirmed ? "Confirmed in /admin/tax." : "Fill in /admin/tax and tick the accountant's confirmation. Until then nothing can be sold.",
    },
    {
      id: "products",
      stage: "live",
      label: "Products ready for sale",
      status: sellableProducts > 0 ? "ok" : "missing",
      detail: sellableProducts > 0 ? `${sellableProducts} product(s) active with a price and tax category.` : "Activate products in /admin/products (price + tax category).",
    },
    {
      id: "stripe-live",
      stage: "live",
      label: "Stripe activated and live keys (owner's explicit OK)",
      status: stripeMode === "live" ? "ok" : "manual",
      detail: stripeMode === "live" ? "Live keys in use." : "Activate the Stripe account (company number, IBAN, ID), add a LIVE webhook, then swap the keys. Never without the owner's explicit OK.",
    },
    {
      id: "sales",
      stage: "live",
      label: "Ticket sales open (COMMERCE_SALES_ENABLED)",
      status: salesOpen ? "ok" : "manual",
      detail: salesOpen ? "OPEN." : "Closed: the site works as a free prototype. Open only after everything above is green.",
    },
    {
      id: "backups",
      stage: "live",
      label: "Database backups",
      status: "manual",
      detail: "Atlas free tier has no backups: move to a tier with backups (B12) before launch; until then run npm run db:export regularly.",
    },
    {
      id: "csp",
      stage: "live",
      label: "Content Security Policy enforced",
      status: "manual",
      detail: "Still report-only. Check the browser console on real phones with a production build, then switch the header (security-headers.ts).",
    },
    {
      id: "legal",
      stage: "live",
      label: "Legal texts reviewed (⚖️)",
      status: "manual",
      detail: "Privacy notice, terms of sale, processor agreements, retention periods, ha_ref cookie consent (see docs/commercial/SECURITY_AUDIT.md §4).",
    },
    {
      id: "noindex",
      stage: "live",
      label: "Search engines allowed",
      status: "manual",
      detail: "The site is noindex while content is placeholder (src/app/layout.tsx). Lift it with the SEO phase, once content and image rights are cleared.",
    },
  ];
  return checks;
}

/** A short verdict per stage. */
export function readinessSummary(checks: ReadinessCheck[]): { test: boolean; live: boolean } {
  const ready = (stage: "test" | "live") => checks.filter((check) => check.stage === stage).every((check) => check.status === "ok");
  return { test: ready("test"), live: ready("test") && ready("live") };
}
