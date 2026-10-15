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
        {(
          [
            ["/admin/orders", "Orders"],
            ["/admin/quotes", "Quotes"],
            ["/admin/groups", "Groups"],
            ["/admin/documents", "Invoices"],
            ["/admin/products", "Products"],
            ["/admin/discounts", "Discounts"],
            ["/admin/tax", "Tax"],
            ["/admin/audit", "Audit log"],
          ] as const
        ).map(([href, label]) => (
          <Link key={href} href={href} className="min-h-11 content-center text-parchment underline-offset-4 hover:underline">
            {label}
          </Link>
        ))}
        <span className="ml-auto">
          <SignOutButton />
        </span>
      </nav>
      {children}
    </>
  );
}
