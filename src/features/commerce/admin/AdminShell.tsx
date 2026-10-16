"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { activeNavItem, ADMIN_NAVIGATION } from "./admin-navigation";
import { SignOutButton } from "./SignOutButton";

/** Keyboard focus that is always visible on the dark admin background (WCAG 2.4.7). */
const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const active = activeNavItem(pathname);
  return (
    <nav aria-label="Admin sections" className="flex flex-col gap-5">
      {ADMIN_NAVIGATION.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-parchment/70">{group.label}</p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const isActive = active?.href === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={item.description}
                    aria-current={isActive ? "page" : undefined}
                    onClick={onNavigate}
                    className={`flex min-h-11 items-center rounded-sm border-l-2 px-3 text-[0.95rem] ${focusRing} ${
                      isActive ? "border-gold bg-gold/15 font-semibold text-parchment" : "border-transparent text-parchment/90 hover:bg-parchment/10 hover:text-parchment"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/**
 * The admin area's frame (frontend redesign): a sidebar with the sections on
 * large screens (can be hidden for wide tables), a menu panel on phones and
 * tablets, and a top bar with the current section, a link to the site and
 * sign-out. A Client Component only for the active link and the open/closed
 * state; the pages inside stay Server Components and check access themselves.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const current = activeNavItem(pathname);

  // Hiding the sidebar gives wide tables the whole screen (for this visit).
  const toggleCollapsed = () => setCollapsed((value) => !value);

  // The phone menu closes with Escape and gives focus back to its button.
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full text-parchment accent-gold">
      {/* Large screens: the sidebar. */}
      {!collapsed && (
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-parchment/15 bg-umber/40 px-3 py-6 lg:block">
          <NavLinks pathname={pathname} />
        </aside>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-14 z-10 flex min-h-14 flex-wrap items-center gap-x-4 gap-y-2 border-b border-parchment/15 bg-ink/95 px-4 py-2 backdrop-blur sm:px-6">
          <button
            ref={menuButton}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="admin-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className={`min-h-11 rounded-sm border border-parchment/30 px-3 text-sm font-semibold lg:hidden ${focusRing}`}
          >
            {menuOpen ? "Close menu" : "Menu"}
          </button>
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-pressed={collapsed}
            className={`hidden min-h-11 rounded-sm border border-parchment/30 px-3 text-sm lg:block ${focusRing}`}
          >
            {collapsed ? "Show menu" : "Hide menu"}
          </button>
          <p className="min-w-0 flex-1 truncate text-sm text-parchment/85">
            <span className="font-semibold text-gold">Admin</span>
            {current ? <span>{` · ${current.label}`}</span> : null}
          </p>
          <Link href="/" className={`min-h-11 content-center text-sm text-parchment/90 underline-offset-4 hover:underline ${focusRing}`}>
            View site
          </Link>
          <SignOutButton />
        </div>

        {/* Phones and tablets: the sections as a panel under the top bar. */}
        {menuOpen && (
          <div id="admin-menu" className="border-b border-parchment/15 bg-umber px-3 py-4 lg:hidden">
            <NavLinks pathname={pathname} onNavigate={() => setMenuOpen(false)} />
          </div>
        )}

        <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
