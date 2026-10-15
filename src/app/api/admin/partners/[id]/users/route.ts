import { after, type NextRequest } from "next/server";
import { adminPost } from "@/features/commerce/server/admin-route";
import { getCommerceContext } from "@/features/commerce/server/context";
import { deliverDueEmails } from "@/features/commerce/server/email-service";
import { siteBaseUrl } from "@/features/commerce/server/http";
import { deactivatePartnerUser, invitePartnerUser } from "@/features/commerce/server/partner-service";
import { fail } from "@/features/commerce/server/result";
import type { CommerceUser } from "@/types/commerce";

/**
 * POST /api/admin/partners/[id]/users: portal access for a partner.
 * Body: { action: "invite", email, locale } or { action: "deactivate", userId }.
 */
export async function POST(request: NextRequest, route: RouteContext<"/api/admin/partners/[id]/users">) {
  const { id } = await route.params;
  const baseUrl = siteBaseUrl(request);
  const response = await adminPost<{ deactivated: true } | CommerceUser>(request, async (ctx, admin, body) => {
    const action = typeof body === "object" && body !== null && "action" in body ? body.action : null;
    if (action === "deactivate") return deactivatePartnerUser(ctx, admin, id, body);
    if (action !== "invite") return fail(400, "invalid-action");
    return baseUrl ? invitePartnerUser(ctx, admin, id, body, baseUrl) : fail(503, "not-configured");
  });
  if (response.ok) after(() => deliverDueEmails(getCommerceContext()));
  return response;
}
