import type { NextRequest } from "next/server";
import { after } from "next/server";
import { adminPost } from "@/features/commerce/server/admin-route";
import { getCommerceContext } from "@/features/commerce/server/context";
import { deliverDueEmails } from "@/features/commerce/server/email-service";
import { siteBaseUrl } from "@/features/commerce/server/http";
import { resendConfirmation } from "@/features/commerce/server/order-admin-service";
import { fail } from "@/features/commerce/server/result";

/** POST /api/admin/orders/[id]/resend: emails the confirmation with the ticket link again. */
export async function POST(request: NextRequest, route: RouteContext<"/api/admin/orders/[id]/resend">) {
  const { id } = await route.params;
  const baseUrl = siteBaseUrl(request);
  const response = await adminPost(request, async (ctx, admin) =>
    baseUrl ? resendConfirmation(ctx, admin, id, baseUrl) : fail(503, "not-configured"),
  );
  if (response.ok) after(() => deliverDueEmails(getCommerceContext()));
  return response;
}
