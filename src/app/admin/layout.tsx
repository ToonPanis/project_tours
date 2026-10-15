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
  return (
    <div lang="en" className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      {children}
    </div>
  );
}
