import type { ReactNode } from "react";

/**
 * The top of every admin page: a clear title, one line saying what the page is
 * for, and optional actions on the right (secondary links, exports). Server
 * Component (no state). English, like the admin area.
 */
export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="flex flex-col gap-3 border-b border-parchment/15 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1.5">
        <h1 className="font-display text-3xl font-semibold leading-tight text-parchment [overflow-wrap:anywhere] sm:text-4xl">{title}</h1>
        {description ? <p className="max-w-3xl text-base leading-relaxed text-parchment/85">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
