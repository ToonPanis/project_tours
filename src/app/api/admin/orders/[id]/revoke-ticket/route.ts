import type { NextRequest } from "next/server";
import { adminPost } from "@/features/commerce/server/admin-route";
import { revokeTicket } from "@/features/commerce/server/order-admin-service";

/** POST /api/admin/orders/[id]/revoke-ticket: the ticket link and its phones stop working. */
export async function POST(request: NextRequest, route: RouteContext<"/api/admin/orders/[id]/revoke-ticket">) {
  const { id } = await route.params;
  return adminPost(request, (ctx, admin) => revokeTicket(ctx, admin, id));
}
