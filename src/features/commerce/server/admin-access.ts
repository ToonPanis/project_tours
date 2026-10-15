import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { cache } from "react";
import { getAdminFromSession } from "./auth-service";
import { getCommerceContext } from "./context";
import { ADMIN_COOKIE } from "./http";
import type { Actor } from "./support";

/**
 * The "data access layer" for the admin area (Next.js authentication guide):
 * every admin PAGE calls `requireAdmin()` and every admin ROUTE calls
 * `adminFromRequest()`. The check is deliberately NOT in the admin layout:
 * a layout isn't re-run when you navigate between its pages, so it can't
 * protect them.
 */

/**
 * The signed-in admin for the page being rendered, or null.
 * `cache` (React) makes it run once per request even when several components ask.
 */
export const getCurrentAdmin = cache(async (): Promise<Actor | null> => {
  const secret = (await cookies()).get(ADMIN_COOKIE)?.value;
  return getAdminFromSession(getCommerceContext(), secret);
});

/** For admin pages: the admin, or a redirect to the sign-in page. */
export async function requireAdmin(): Promise<Actor> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

/** For admin Route Handlers: the admin, or null (the route then answers 401). */
export function adminFromRequest(request: NextRequest): Promise<Actor | null> {
  return getAdminFromSession(getCommerceContext(), request.cookies.get(ADMIN_COOKIE)?.value);
}
