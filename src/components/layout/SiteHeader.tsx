import Link from "next/link";

const navigationLinks = [
  { href: "/walks", label: "Walks" },
  { href: "/#how-it-works", label: "How it works" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-gold/20 bg-ink/95 text-parchment backdrop-blur">
      {/* Lets keyboard users jump past the navigation. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:bg-gold focus:px-3 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-h-11 items-center font-display text-xl font-semibold tracking-wide"
        >
          Hidden <span className="ml-1.5 text-gold">Antwerp</span>
        </Link>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-1 sm:gap-4">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex min-h-11 items-center px-2 text-sm text-parchment/85 transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
