"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface PlayScreenProps {
  /** Small label above the title, e.g. "Your next destination". */
  eyebrow?: string;
  title: string;
  /**
   * Identifies the screen, e.g. "challenge-pubs-rococo". When it changes, the page
   * scrolls to the top and focuses the title. Defaults to the title, but the title is
   * translated: a stable id means switching language doesn't jump back to the top.
   */
  screenId?: string;
  children?: ReactNode;
  /** The screen's action buttons, pinned to the bottom on phones. */
  actions?: ReactNode;
}

/**
 * The layout of every game screen: one clear title, content, and the
 * main action at the bottom where a thumb can reach it.
 */
export function PlayScreen({ eyebrow, title, screenId, children, actions }: PlayScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const screenKey = screenId ?? title;

  // Each new screen starts at the top, and screen readers announce its title.
  useEffect(() => {
    window.scrollTo?.({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [screenKey]);

  return (
    <section className="flex min-h-[calc(100dvh-10rem)] flex-col gap-6 px-4 pb-6 pt-8 sm:px-6">
      <header className="animate-[fade-in_400ms_ease-out]">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">{eyebrow}</p>
        )}
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-2 font-display text-4xl font-semibold leading-tight text-parchment outline-none"
        >
          {title}
        </h1>
      </header>

      {children && <div className="flex flex-1 flex-col gap-5 text-parchment/90">{children}</div>}

      {actions && <div className="mt-auto flex flex-col gap-3 pt-2">{actions}</div>}
    </section>
  );
}
