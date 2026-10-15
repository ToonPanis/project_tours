import type { NextRequest } from "next/server";
import { adminPost } from "@/features/commerce/server/admin-route";
import { updatePartner } from "@/features/commerce/server/partner-service";

/** POST /api/admin/partners/[id]: edits a partner (name, type, commission for new orders, active). */
export async function POST(request: NextRequest, route: RouteContext<"/api/admin/partners/[id]">) {
  const { id } = await route.params;
  return adminPost(request, (ctx, admin, body) => updatePartner(ctx, admin, id, body));
}
