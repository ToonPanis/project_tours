import type { NextRequest } from "next/server";
import { adminPost } from "@/features/commerce/server/admin-route";
import { refundOrder } from "@/features/commerce/server/order-admin-service";

/**
 * POST /api/admin/orders/[id]/refund: asks Stripe for a refund (admins only).
 * Body: { amount?: "12,50" (empty = everything left), revokeTicket?: boolean }.
 * The order itself changes when Stripe's webhook confirms the refund.
 */
export async function POST(request: NextRequest, route: RouteContext<"/api/admin/orders/[id]/refund">) {
  const { id } = await route.params;
  return adminPost(request, (ctx, admin, body) => refundOrder(ctx, admin, id, body));
}
