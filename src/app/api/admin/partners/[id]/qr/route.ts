import type { NextRequest } from "next/server";
import { adminFromRequest } from "@/features/commerce/server/admin-access";
import { getCommerceContext } from "@/features/commerce/server/context";
import { siteBaseUrl } from "@/features/commerce/server/http";
import { partnerQrSvg, svgDownload } from "@/features/commerce/server/partner-qr";
import { errorResponse } from "@/features/pub-game/server/http";

/** GET /api/admin/partners/[id]/qr: a partner's QR code (admins only), e.g. to print it for them. */
export async function GET(request: NextRequest, route: RouteContext<"/api/admin/partners/[id]/qr">) {
  const admin = await adminFromRequest(request);
  if (!admin) return errorResponse(401, "sign-in-required");
  const { id } = await route.params;
  const partner = id.length <= 100 ? await getCommerceContext().store.getPartner(id) : null;
  if (!partner) return errorResponse(404, "unknown-partner");
  const baseUrl = siteBaseUrl(request);
  if (!baseUrl) return errorResponse(503, "not-configured");
  return svgDownload(partnerQrSvg(partner, baseUrl));
}
