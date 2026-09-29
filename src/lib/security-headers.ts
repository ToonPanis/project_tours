/**
 * HTTP security headers for every page, set in next.config.ts (see the Next.js
 * guide "Content Security Policy", the "without nonces" variant).
 *
 * The Content Security Policy is sent as REPORT-ONLY for now: the browser does
 * not block anything, it only lists violations in the console. Check the map on
 * real phones (iOS Safari, Android Chrome) with a production build, and only then
 * switch the key to "Content-Security-Policy" (a wrong rule would blank the map).
 */

export interface SecurityHeader {
  key: string;
  value: string;
}

interface SecurityHeaderOptions {
  isDevelopment: boolean;
  /** The map style URL (NEXT_PUBLIC_MAP_STYLE_URL or the OpenFreeMap default). */
  mapStyleUrl: string;
}

/**
 * The origin of an absolute map style URL ("https://tiles.openfreemap.org"), or null
 * for a relative one ("/style.json", served by this site: covered by 'self') or an
 * invalid one. Never throws: a typo in NEXT_PUBLIC_MAP_STYLE_URL must not break the build.
 */
export function mapStyleOrigin(mapStyleUrl: string): string | null {
  try {
    return new URL(mapStyleUrl).origin;
  } catch {
    return null;
  }
}

/**
 * The Content Security Policy, as one header value.
 *
 * Deliberately not included (yet):
 * - `upgrade-insecure-requests`: ignored in report-only mode, and it would break the
 *   plain-http dev server on the LAN. Add it (production only) when enforcing.
 * - `report-to` / `report-uri`: there is no backend to receive reports, and sending them
 *   to a third party would be tracking. Violations show in the browser console.
 * HSTS (https only) comes from the hosting provider (e.g. Vercel sets it).
 */
export function buildContentSecurityPolicy({ isDevelopment, mapStyleUrl }: SecurityHeaderOptions): string {
  // MapLibre loads the style, tiles, sprites and fonts (glyphs) from the map host. A
  // custom style whose tiles live on yet other hosts needs those hosts added here.
  const mapOrigin = mapStyleOrigin(mapStyleUrl);
  const map = mapOrigin ? ` ${mapOrigin}` : "";
  const directives = [
    "default-src 'self'",
    // Next.js adds small inline scripts; React needs eval only in development.
    `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    // Map tiles are drawn from blob: URLs (or loaded directly from the map host with some
    // MapLibre options); next/image serves from 'self'.
    `img-src 'self' blob: data:${map}`,
    // Fonts are self-hosted by next/font.
    "font-src 'self'",
    // The map data. (Development also needs the hot-reload websocket.)
    `connect-src 'self'${map}${isDevelopment ? " ws: wss:" : ""}`,
    // MapLibre's web worker is served from /maplibre/ and may create blob: workers.
    "worker-src 'self' blob:",
    "child-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];
  return directives.join("; ");
}

/**
 * Headers for every response. Enforced ones are safe today; the CSP is report-only
 * (see the note at the top of this file).
 */
export function buildSecurityHeaders(options: SecurityHeaderOptions): SecurityHeader[] {
  return [
    // Don't guess file types (e.g. treat an uploaded text as a script).
    { key: "X-Content-Type-Options", value: "nosniff" },
    // Other sites get only our domain, never the full page address.
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    // Location only for this site (not for pages that embed it); no camera or microphone.
    { key: "Permissions-Policy", value: "geolocation=(self), camera=(), microphone=(), payment=()" },
    // No other site may show this one in a frame (clickjacking).
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Content-Security-Policy-Report-Only", value: buildContentSecurityPolicy(options) },
  ];
}

/**
 * Development only: which addresses (e.g. a phone on the same Wi-Fi) may use the
 * dev server. Exact IPs from DEV_ALLOWED_ORIGINS, e.g. "192.168.1.23,192.168.1.24".
 * Next.js compares host names only, so "http://" and ":3000" are removed if typed.
 * Wildcards are refused: "192.168.*.*" would also match names like "192.168.evil.com".
 */
export function parseDevAllowedOrigins(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin !== "" && !origin.includes("*"))
    .map((origin) => {
      try {
        // Parse as a URL to get just the host name (also handles "[fe80::1]:3000").
        // A bare IPv6 address ("fe80::1") needs brackets to be read as a host.
        const isBareIpv6 = (origin.match(/:/g) ?? []).length >= 2 && !origin.includes("[") && !origin.includes("//");
        const host = isBareIpv6 ? `[${origin}]` : origin;
        const withScheme = /^[a-z]+:\/\//i.test(host) ? host : `http://${host}`;
        return new URL(withScheme).hostname;
      } catch {
        return origin;
      }
    });
}
