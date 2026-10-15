import type { NextRequest } from "next/server";
import { adminPost } from "@/features/commerce/server/admin-route";
import { moderateReview } from "@/features/commerce/server/review-service";

/** POST /api/admin/reviews/[id]: { action: "approve" | "reject" | "delete" } (admins only, audited). */
export async function POST(request: NextRequest, route: RouteContext<"/api/admin/reviews/[id]">) {
  const { id } = await route.params;
  return adminPost(request, (ctx, admin, body) => moderateReview(ctx, admin, id, body));
}
