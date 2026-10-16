import { AdminShell } from "@/features/commerce/admin/AdminShell";

/**
 * The frame of the signed-in admin area: sidebar with the sections, top bar,
 * content column (AdminShell). "(console)" is a route group: the folder name
 * doesn't appear in the URL (/admin, /admin/products), it only gives these
 * pages this layout and keeps it off /admin/login.
 * The pages check access themselves (requireAdmin), not this layout: a layout
 * isn't re-run when navigating between its pages.
 */
export default function AdminConsoleLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}
