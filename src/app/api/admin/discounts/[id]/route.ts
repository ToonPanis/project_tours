import type { NextRequest } from "next/server";
import { adminPost } from "@/features/commerce/server/admin-route";
import { setDiscountActive } from "@/features/commerce/server/discount-service";

/** POST /api/admin/discounts/[id]: switches a code on or off. Body: { active }. */
export async function POST(request: NextRequest, route: RouteContext<"/api/admin/discounts/[id]">) {
  const { id } = await route.params;
  return adminPost(request, (ctx, admin, body) => setDiscountActive(ctx, admin, id, body));
}
