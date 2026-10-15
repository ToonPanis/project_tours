import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { cache } from "react";
import { getCommerceContext } from "./context";
import { PARTNER_COOKIE } from "./http";
import { getPartnerFromSession, type PartnerActor } from "./partner-auth-service";

/**
 * The partner portal's "data access layer", like admin-access.ts: every
 * portal PAGE calls `requirePartner()`, every portal ROUTE `partnerFromRequest()`.
 * The partner id used for every query comes from what these return.
 */

export const getCurrentPartner = cache(async (): Promise<PartnerActor | null> => {
  const secret = (await cookies()).get(PARTNER_COOKIE)?.value;
  return getPartnerFromSession(getCommerceContext(), secret);
});

export async function requirePartner(): Promise<PartnerActor> {
  const partner = await getCurrentPartner();
  if (!partner) redirect("/partner/login");
  return partner;
}

export function partnerFromRequest(request: NextRequest): Promise<PartnerActor | null> {
  return getPartnerFromSession(getCommerceContext(), request.cookies.get(PARTNER_COOKIE)?.value);
}
