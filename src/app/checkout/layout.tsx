import type { Metadata } from "next";

/** Payment result pages: personal, never in search results. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function CheckoutLayout({ children }: LayoutProps<"/checkout">) {
  return <div className="bg-night-map min-h-full text-parchment">{children}</div>;
}
