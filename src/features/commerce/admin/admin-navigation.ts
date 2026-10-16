/**
 * The admin area's sections (frontend redesign). Only pages that exist and
 * work are listed: no placeholders for features that aren't built (e.g. editing
 * walks happens in the code, not in the admin). English, like the admin area.
 */

export interface AdminNavItem {
  href: string;
  label: string;
  /** One line under the title of the page (also the tooltip in the sidebar). */
  description: string;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_NAVIGATION: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", description: "Revenue, tickets, customers and reviews for a period." },
      { href: "/admin/readiness", label: "Launch readiness", description: "Which settings are in place, and what's left before real sales." },
    ],
  },
  {
    label: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders", description: "Every order, its payment, ticket and documents; refunds." },
      { href: "/admin/groups", label: "Hidden Pubs groups", description: "Games created with a ticket, and their places." },
      { href: "/admin/documents", label: "Receipts & invoices", description: "Receipts, credit notes and business invoices." },
      { href: "/admin/discounts", label: "Discount codes", description: "Shared codes, batches of unique codes and review rewards." },
    ],
  },
  {
    label: "Business",
    items: [
      { href: "/admin/partners", label: "Partners & commissions", description: "Partner links, portal access and the commission ledger." },
      { href: "/admin/quotes", label: "Quote requests", description: "Company and group requests from the corporate page." },
    ],
  },
  {
    label: "Customers",
    items: [
      { href: "/admin/reviews", label: "Reviews", description: "Verified reviews waiting for moderation, approved and rejected." },
      { href: "/admin/privacy", label: "Personal data requests", description: "Find, export or erase a person's data (GDPR)." },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/products", label: "Products & prices", description: "What can be sold, at what price and tax category." },
      { href: "/admin/tax", label: "Tax", description: "VAT regime, rates and the accountant's confirmation." },
      { href: "/admin/audit", label: "Audit log", description: "Who changed what, and when." },
    ],
  },
];

/** The section of a path ("/admin/orders/123" → Orders), for the active link and the page header. */
export function activeNavItem(pathname: string): AdminNavItem | null {
  const items = ADMIN_NAVIGATION.flatMap((group) => group.items);
  // The longest matching prefix wins ("/admin/orders/1" → Orders, "/admin" only for the dashboard itself).
  return (
    items
      .filter((item) => (item.href === "/admin" ? pathname === "/admin" : pathname === item.href || pathname.startsWith(`${item.href}/`)))
      .sort((a, b) => b.href.length - a.href.length)[0] ?? null
  );
}
