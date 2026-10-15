import type { NextRequest } from "next/server";
import { adminPost } from "@/features/commerce/server/admin-route";
import { createDiscount } from "@/features/commerce/server/discount-service";

/**
 * POST /api/admin/discounts: a new discount code (admins only).
 * Body: { code, kind: "percent"|"fixed", value, productIds, validFrom, validUntil, maxRedemptions }.
 */
export function POST(request: NextRequest) {
  return adminPost(request, (ctx, admin, body) => createDiscount(ctx, admin, body));
}
