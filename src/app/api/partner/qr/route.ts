import type { NextRequest } from "next/server";
import { siteBaseUrl } from "@/features/commerce/server/http";
import { partnerFromRequest } from "@/features/commerce/server/partner-access";
import { partnerQrSvg, svgDownload } from "@/features/commerce/server/partner-qr";
import { errorResponse } from "@/features/pub-game/server/http";

/** GET /api/partner/qr: the signed-in partner's own QR code (the partner comes from the session, never from the URL). */
export async function GET(request: NextRequest) {
  const actor = await partnerFromRequest(request);
  if (!actor) return errorResponse(401, "sign-in-required");
  const baseUrl = siteBaseUrl(request);
  if (!baseUrl) return errorResponse(503, "not-configured");
  return svgDownload(partnerQrSvg(actor.partner, baseUrl));
}
