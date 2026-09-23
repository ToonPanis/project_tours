import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * DEVELOPMENT ONLY: lets a phone on the same network open the dev server
   * (e.g. http://192.168.1.23:3000). Without this, Next.js blocks the dev
   * scripts for any address other than localhost, and buttons do nothing.
   * These are the private (home/hotspot) network ranges; `*` = one number.
   * Has no effect on production builds.
   */
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*"],
};

export default nextConfig;
