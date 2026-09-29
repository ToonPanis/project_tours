import type { NextConfig } from "next";
import { MAP_STYLE_URL, MAP_WORKER_FOLDER } from "./src/features/navigation/config";
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
   * next/image: AVIF first (about 20% smaller than WebP at the same quality; the
   * first request of each size is slower to encode, later ones come from the cache),
   * WebP for browsers without AVIF. Fewer widths than the defaults: the pages are at
   * most 32rem wide except the hero, and the smallest image is 6rem (96 px). Fewer
   * widths also make every image's srcset (and so the HTML) shorter.
   * The original files and their licenses are untouched.
   */
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    qualities: [75],
  },

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
      // MapLibre's worker (about 530 KB uncompressed). Safe to cache for a year because
      // the MapLibre version is part of the path (see mapWorkerUrl in features/navigation/config.ts).
      // Without this, public/ files get "max-age=0" and are re-checked on every leg.
      // Not in development: a locally patched maplibre-gl keeps its version number.
      ...(isDevelopment
        ? []
        : [
            {
              source: `${MAP_WORKER_FOLDER}/:version/:file*`,
              headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
            },
          ]),
    ];
  },
};

export default nextConfig;
