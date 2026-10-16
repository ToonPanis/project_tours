import type { NextRequest } from "next/server";
import { adminPost } from "@/features/commerce/server/admin-route";
import { findPersonalData } from "@/features/commerce/server/privacy-service";
import { fail, ok } from "@/features/commerce/server/result";

/**
 * POST /api/admin/privacy/lookup: what is stored about one address (counts and
 * dates only). Body: { email }. A POST, so the address never appears in a URL
 * (URLs end up in server logs).
 */
export async function POST(request: NextRequest) {
  return adminPost(request, async (ctx, _admin, body) => {
    const data = await findPersonalData(ctx, typeof body === "object" && body !== null && "email" in body ? body.email : null);
    if (!data) return fail(400, "invalid-email");
    return ok({
      email: data.email,
      orders: data.orders.map((order) => ({ id: order.id, status: order.status, createdAt: order.createdAt, erased: Boolean(order.erasedAt) })),
      quotes: data.quotes.length,
      reviews: data.reviews.length,
      emails: data.emails.length,
      account: data.user ? { roles: data.user.roles, active: data.user.active } : null,
      unsubscribed: data.unsubscribed,
    });
  });
}
