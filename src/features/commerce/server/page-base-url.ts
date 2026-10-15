import { headers } from "next/headers";

/**
 * The site's address for links SHOWN on a page (a partner's link and QR code).
 * APP_BASE_URL when set (always in production); otherwise this request's own
 * host, so the link also works when the dev server is opened from a phone.
 * Emails never use this: they use siteBaseUrl (APP_BASE_URL only in production).
 */
export async function pageBaseUrl(): Promise<string> {
  const configured = process.env.APP_BASE_URL?.replace(/\/+$/, "");
  if (configured) return configured;
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") || /^\d/.test(host) ? "http" : "https");
  return `${protocol}://${host}`;
}
