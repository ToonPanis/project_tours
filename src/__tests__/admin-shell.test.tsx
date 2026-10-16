import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { activeNavItem, ADMIN_NAVIGATION } from "@/features/commerce/admin/admin-navigation";
import { AdminShell } from "@/features/commerce/admin/AdminShell";
import { PageHeader } from "@/features/commerce/admin/PageHeader";

/** Frontend redesign: the admin's sidebar sections, the active link, the phone menu, the page header. */

const pathname = vi.hoisted(() => ({ value: "/admin/orders/abc" }));
vi.mock("next/navigation", () => ({
  usePathname: () => pathname.value,
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn(), push: vi.fn() }),
}));

describe("admin navigation", () => {
  test("every admin page with its own folder is in the sidebar (no page forgotten, none invented)", () => {
    const root = join(process.cwd(), "src", "app", "admin", "(console)");
    const pages: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) walk(path);
        else if (entry === "page.tsx") pages.push(relative(root, dir).split(sep).join("/"));
      }
    };
    walk(root);
    // Top-level sections only (detail pages like orders/[id] belong to their list).
    const sections = [...new Set(pages.map((page) => page.split("/")[0]))].map((section) => (section === "" ? "/admin" : `/admin/${section}`));
    const linked = ADMIN_NAVIGATION.flatMap((group) => group.items.map((item) => item.href));
    expect([...sections].sort()).toEqual([...linked].sort());
  });

  test("the active section is the longest matching path; the dashboard only on /admin itself", () => {
    expect(activeNavItem("/admin")?.label).toBe("Dashboard");
    expect(activeNavItem("/admin/orders/123")?.href).toBe("/admin/orders");
    expect(activeNavItem("/admin/partners")?.href).toBe("/admin/partners");
    expect(activeNavItem("/admin/unknown")).toBeNull();
  });
});

describe("admin shell", () => {
  test("marks the current section, shows it in the top bar, and the phone menu opens and closes (Escape)", () => {
    pathname.value = "/admin/orders/abc";
    render(
      <AdminShell>
        <p>content</p>
      </AdminShell>,
    );
    expect(screen.getByText("content")).toBeDefined();
    const sections = screen.getAllByRole("navigation", { name: "Admin sections" })[0];
    expect(within(sections).getByRole("link", { name: "Orders" }).getAttribute("aria-current")).toBe("page");
    expect(within(sections).getByRole("link", { name: "Dashboard" }).getAttribute("aria-current")).toBeNull();

    const menu = screen.getByRole("button", { name: "Menu" });
    expect(menu.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(menu);
    expect(screen.getByRole("button", { name: "Close menu" }).getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById("admin-menu")).not.toBeNull();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.getElementById("admin-menu")).toBeNull();
  });

  test("the sidebar can be hidden for wide tables", () => {
    render(
      <AdminShell>
        <p>content</p>
      </AdminShell>,
    );
    const toggle = screen.getByRole("button", { name: "Hide menu" });
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Show menu" }).getAttribute("aria-pressed")).toBe("true");
  });

  test("the page header shows the title as the page's only h1, with its description", () => {
    render(<PageHeader title="Orders" description="Every order." />);
    expect(screen.getByRole("heading", { level: 1, name: "Orders" })).toBeDefined();
    expect(screen.getByText("Every order.")).toBeDefined();
  });
});
