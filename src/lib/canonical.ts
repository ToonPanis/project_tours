/**
 * The canonical address of a public page, from APP_BASE_URL (the live site's
 * own address). Without it (local development) there is no canonical URL.
 * The site has no locale in its URLs (decision B4): one URL serves every
 * language, so there are no per-language alternates (hreflang) to list.
 */
export function canonicalUrl(path: string): string | undefined {
  const base = process.env.APP_BASE_URL?.replace(/\/+$/, "");
  return base ? `${base}${path}` : undefined;
}
