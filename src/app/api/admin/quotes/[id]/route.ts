import type { NextRequest } from "next/server";
import { adminPost } from "@/features/commerce/server/admin-route";
import { changeQuoteStatus } from "@/features/commerce/server/quote-service";

/** POST /api/admin/quotes/[id]: moves a quote request to its next status (admins only). Body: { status, note? }. */
export async function POST(request: NextRequest, route: RouteContext<"/api/admin/quotes/[id]">) {
  const { id } = await route.params;
  return adminPost(request, (ctx, admin, body) => changeQuoteStatus(ctx, admin, id, body));
}
