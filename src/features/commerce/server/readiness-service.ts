import { currentPrice } from "../logic/catalog";
import { readinessChecks, type ReadinessCheck } from "../logic/readiness";
import { taxAllowsSales } from "../logic/tax";
import type { CommerceContext } from "./context";
import { getTaxSettings } from "./tax-service";

/** The variables the check looks at (values never leave the server: only "set / not set" and safe facts are shown). */
const NAMES = [
  "APP_BASE_URL",
  "MONGODB_URI",
  "ADMIN_EMAILS",
  "BREVO_API_KEY",
  "EMAIL_FROM",
  "TICKET_SIGNING_SECRET",
  "CRON_SECRET",
  "BLOB_READ_WRITE_TOKEN",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "COMMERCE_SALES_ENABLED",
  "NEXT_PUBLIC_PLAYTEST_TOOLS",
  "COMMERCE_MEMORY_STORES",
  "PUB_GAME_MEMORY_STORES",
  "COMMERCE_FAKE_PAYMENTS",
] as const;

/** /admin/readiness: the checks with this server's real settings and the database's state. */
export async function launchReadiness(ctx: CommerceContext): Promise<ReadinessCheck[]> {
  const env = Object.fromEntries(NAMES.map((name) => [name, process.env[name]]));
  const [settings, products] = await Promise.all([getTaxSettings(ctx), ctx.store.listProducts()]);
  const now = ctx.now();
  let sellable = 0;
  for (const product of products) {
    if (!product.active || !settings.categories.some((category) => category.id === product.taxCategoryId)) continue;
    if (currentPrice(await ctx.store.listPrices(product.id), now)) sellable += 1;
  }
  return readinessChecks({ env, taxConfirmed: taxAllowsSales(settings), sellableProducts: sellable, region: process.env.VERCEL_REGION });
}
