import type { NextRequest } from "next/server";
import { ADMIN_SESSION_LIFETIME_MS, PARTNER_ATTRIBUTION_MS, PARTNER_SESSION_LIFETIME_MS } from "../config";
import { hashSecret } from "./context";

/** The admin session cookie. Its value is a random secret; the database only has its hash. */
export const ADMIN_COOKIE = "ha_admin";

export function adminCookieOptions() {
  return {
    // JavaScript in the page can't read it, so an XSS bug can't steal the session.
    httpOnly: true,
    // Over plain http on the LAN during development, a Secure cookie would never be sent.
    secure: process.env.NODE_ENV === "production",
    // Strict: never sent when another site links or posts here, only on our own pages.
    sameSite: "strict" as const,
    path: "/",
    maxAge: ADMIN_SESSION_LIFETIME_MS / 1000,
  };
}

/** The buyer's cookie between "Pay" and the success page (so only they see their order there). */
export const BUYER_COOKIE = "ha_order";

export function buyerCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // Lax, not Strict: the browser must send it when Stripe's page sends the buyer back here.
    sameSite: "lax" as const,
    path: "/",
    maxAge: 24 * 60 * 60,
  };
}

/** A phone's ticket cookie: as long as the ticket is valid. */
export function ticketCookieOptions(validUntil: string) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires: new Date(validUntil),
  };
}

/**
 * A hash of the visitor's network address, for rate limits only (the address
 * itself is never stored). On Vercel the first entry of x-forwarded-for is the
 * real client; without it (local development) everyone shares one key.
 */
export function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return hashSecret(forwarded || "unknown-client");
}

/**
 * The site's address for links in emails. Production uses APP_BASE_URL only:
 * the request's own Host header can be forged, and a sign-in link must never
 * point to another site. In development the request's origin is fine (it also
 * works when the dev server is opened from a phone on the LAN).
 * Null when production has no APP_BASE_URL (the route then refuses to send links).
 */
export function siteBaseUrl(request: NextRequest): string | null {
  const configured = process.env.APP_BASE_URL?.replace(/\/+$/, "");
  if (configured) return configured;
  return process.env.NODE_ENV === "production" ? null : request.nextUrl.origin;
}

/** The partner portal's session cookie (P7). Like the admin cookie, with its own name and lifetime. */
export const PARTNER_COOKIE = "ha_partner";

export function partnerCookieOptions() {
  return { ...adminCookieOptions(), maxAge: PARTNER_SESSION_LIFETIME_MS / 1000 };
}

/**
 * The referral cookie (P7): which partner link brought this visitor, e.g.
 * "HOTELJULIEN..1760000000000" (code, campaign, click time; nothing personal).
 * Lax: it must be sent when the visitor comes back from another site.
 */
export const REFERRAL_COOKIE = "ha_ref";

export function referralCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: PARTNER_ATTRIBUTION_MS / 1000,
  };
}
