import type { NextRequest } from "next/server";
import { adminPost } from "@/features/commerce/server/admin-route";
import { updateTaxSettings } from "@/features/commerce/server/tax-service";

/**
 * POST /api/admin/tax: saves the tax settings as a new version (admins only, decision B8).
 * Body: { regime, homeCountry, categories, ossEnabled, ossRates, exemptionNote, confirmedByAccountant }.
 */
export function POST(request: NextRequest) {
  return adminPost(request, (ctx, admin, body) => updateTaxSettings(ctx, admin, body));
}
