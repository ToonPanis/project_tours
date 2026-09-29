import type { NextConfig } from "next";
import { MAP_STYLE_URL } from "./src/features/navigation/config";
import { buildSecurityHeaders, parseDevAllowedOrigins } from "./src/lib/security-headers";

const isDevelopment = process.env.NODE_ENV === "development";

// A production build with the playtest tools switched on shows "show answer" and
// "jump to stop" to every visitor: fine for a playtest deployment, never for real players.
if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_PLAYTEST_TOOLS === "true") {
  console.warn(
    "\n⚠ NEXT_PUBLIC_PLAYTEST_TOOLS=true: this production build shows the playtest tools " +
      "(answers, jump to stop) to everyone. Remove it before real players use the site.\n",
  );
}

const nextConfig: NextConfig = {
  // Don't advertise the framework in every response.
  poweredByHeader: false,

  /**
   * DEVELOPMENT ONLY: lets a phone on the same network open the dev server
   * (e.g. http://192.168.1.23:3000). Without this, Next.js blocks the dev
   * scripts for any address other than localhost, and buttons do nothing.
   * List your computer's exact LAN IP(s) in DEV_ALLOWED_ORIGINS in .env.local
   * (see .env.example). Has no effect on production builds.
   */
  allowedDevOrigins: parseDevAllowedOrigins(process.env.DEV_ALLOWED_ORIGINS),

  async headers() {
    return [
      {
        source: "/:path*",
        headers: buildSecurityHeaders({
          isDevelopment,
          mapStyleUrl: MAP_STYLE_URL,
        }),
      },
    ];
  },
};

export default nextConfig;
