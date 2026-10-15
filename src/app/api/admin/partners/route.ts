import type { NextRequest } from "next/server";
import { adminPost } from "@/features/commerce/server/admin-route";
import { createPartner } from "@/features/commerce/server/partner-service";

/** POST /api/admin/partners: creates a partner. Body: { code, name, type, commission: { kind, value }, active }. */
export async function POST(request: NextRequest) {
  return adminPost(request, (ctx, admin, body) => createPartner(ctx, admin, body));
}
