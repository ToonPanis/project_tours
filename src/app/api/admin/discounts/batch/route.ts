import type { NextRequest } from "next/server";
import { adminPost } from "@/features/commerce/server/admin-route";
import { createDiscountBatch } from "@/features/commerce/server/discount-service";

/**
 * POST /api/admin/discounts/batch: `count` unique single-use codes with the same rules.
 * Body: like a new code ({ code = prefix, kind, value, productIds, validFrom, validUntil }) + { count }.
 * Answer: { batchId, codes } (shown once, to copy).
 */
export async function POST(request: NextRequest) {
  return adminPost(request, (ctx, admin, body) => createDiscountBatch(ctx, admin, body));
}
