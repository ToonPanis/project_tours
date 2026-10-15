import { NextResponse, type NextRequest } from "next/server";
import { partnerLinkRedirect } from "@/features/commerce/logic/partners";

/**
 * Proxy (Next.js 16's new name for middleware): runs BEFORE a page is rendered.
 * Only used for partner links (P7): a page opened with `?ref=CODE` is sent to
 * /api/r, which counts the click, remembers the partner in a cookie and sends
 * the visitor back to the same page without the parameter.
 *
 * Deliberately tiny: no database here (the Next.js docs advise against slow
 * work in a proxy), and thanks to `has` in the matcher it doesn't even run for
 * requests without `?ref=`.
 */
export function proxy(request: NextRequest) {
  const target = partnerLinkRedirect(request.nextUrl);
  // 307: a temporary redirect (the same link must keep working and counting).
  return target ? NextResponse.redirect(target, 307) : NextResponse.next();
}

export const config = {
  matcher: [
    {
      // Every page, not the API, Next.js' own files or the public folders.
      source: "/((?!api|_next/static|_next/image|favicon.ico|images|audio|maplibre).*)",
      has: [{ type: "query", key: "ref" }],
    },
  ],
};
