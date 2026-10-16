import type { Metadata } from "next";

/**
 * Everything under /admin: never in search results, and English only (lang="en"
 * for screen readers; the admin area is for the owner, like the playtest tools).
 * No access check here: a layout isn't re-run when navigating between its pages,
 * so every admin page checks for itself (requireAdmin).
 */
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  // The width comes from the parts: the console's sidebar layout, or the narrow sign-in pages.
  return (
    <div lang="en" className="w-full bg-ink">
      {children}
    </div>
  );
}
