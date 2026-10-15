import type { NextRequest } from "next/server";
import { adminPost } from "@/features/commerce/server/admin-route";
import { updateCorporatePricing } from "@/features/commerce/server/quote-service";

/**
 * POST /api/admin/corporate-pricing: the indicative price table on /corporate (admins only).
 * Body: { tiers: [{ persons, selfGuided: "149", guided: "299", guidedFrom }], pricesIncludeVat }.
 */
export function POST(request: NextRequest) {
  return adminPost(request, (ctx, admin, body) => updateCorporatePricing(ctx, admin, body));
}
