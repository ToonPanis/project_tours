import Link from "next/link";
import { SignOutButton } from "@/features/commerce/admin/SignOutButton";

/**
 * The navigation of the signed-in admin area. "(console)" is a route group: the
 * folder name doesn't appear in the URL (/admin, /admin/products), it only
 * gives these pages this layout and keeps it off /admin/login.
 * The pages check access themselves (requireAdmin), not this layout.
 */
export default function AdminConsoleLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <nav aria-label="Admin" className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-parchment/20 pb-3">
        <Link href="/admin" className="min-h-11 content-center font-semibold text-gold">
          Admin
        </Link>
        <Link href="/admin/products" className="min-h-11 content-center text-parchment underline-offset-4 hover:underline">
          Products
        </Link>
        <Link href="/admin/audit" className="min-h-11 content-center text-parchment underline-offset-4 hover:underline">
          Audit log
        </Link>
        <span className="ml-auto">
          <SignOutButton />
        </span>
      </nav>
      {children}
    </>
  );
}
