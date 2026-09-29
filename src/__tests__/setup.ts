/**
 * Runs before every test file (vitest.config.mts `setupFiles`): what every
 * component test needs, in one place instead of copied into each file.
 */
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

/**
 * jsdom has no <dialog> methods. This stand-in does what browsers do, so dialog
 * tests check real behaviour: showModal() opens it and focuses the first focusable
 * element (opening an already open modal does nothing, as in the HTML spec);
 * close() closes it and fires "close". Not imitated: the page behind a modal
 * becoming inert (tests could click it; real browsers block that).
 */
if (typeof HTMLDialogElement !== "undefined" && !HTMLDialogElement.prototype.showModal) {
  const FOCUSABLE =
    'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    if (this.hasAttribute("open")) return;
    this.setAttribute("open", "");
    this.querySelector<HTMLElement>(FOCUSABLE)?.focus();
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
}

beforeEach(() => {
  // Saved games, the chosen language… never leak from one test into the next.
  window.localStorage.clear();
  // jsdom doesn't implement scrolling; every new screen scrolls to the top.
  window.scrollTo = () => {};
});

afterEach(() => {
  // Remove what the test rendered (Testing Library only does this itself with `globals: true`).
  cleanup();
  // A language chosen in one test must not carry over.
  document.cookie = "ha-locale=; path=/; max-age=0";
  document.documentElement.lang = "";
});
