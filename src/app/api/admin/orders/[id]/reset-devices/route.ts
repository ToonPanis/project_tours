import type { NextRequest } from "next/server";
import { adminPost } from "@/features/commerce/server/admin-route";
import { resetTicketDevices } from "@/features/commerce/server/order-admin-service";

/** POST /api/admin/orders/[id]/reset-devices: frees every seat of the ticket (e.g. a lost phone). */
export async function POST(request: NextRequest, route: RouteContext<"/api/admin/orders/[id]/reset-devices">) {
  const { id } = await route.params;
  return adminPost(request, (ctx, admin) => resetTicketDevices(ctx, admin, id));
}
