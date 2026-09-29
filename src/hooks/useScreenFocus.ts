"use client";

import { useEffect, useRef } from "react";

/**
 * For screens that replace each other in place (the player has no page loads):
 * when `screenKey` changes, scroll to the top and move focus to the screen's
 * title, so screen readers announce the new screen and keyboard users don't
 * lose their place when the button they pressed disappears.
 *
 * Put the returned ref on the title and give it `tabIndex={-1}` (focusable by
 * code, not by Tab) and `outline-none` (no focus ring on a heading).
 * `screenKey` should be a stable id (e.g. a stop id), not translated text: a
 * language switch must not jump back to the top.
 */
export function useScreenFocus<T extends HTMLElement = HTMLHeadingElement>(screenKey: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    window.scrollTo?.({ top: 0 });
    ref.current?.focus({ preventScroll: true });
  }, [screenKey]);

  return ref;
}
