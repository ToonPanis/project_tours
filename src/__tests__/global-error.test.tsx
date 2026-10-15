import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import GlobalError from "@/app/global-error";
import { createTranslator } from "@/i18n/translate";

/**
 * The last-resort error page has no <LocaleProvider>: it reads the language
 * cookie and loads that language's error texts only when it shows (it is part
 * of every page's JavaScript, so it can't carry all 8 languages).
 */

// The page renders its own <html>; React mounts that into the document itself.
const show = () => render(<GlobalError error={new Error("boom")} />, { container: document });

afterEach(() => {
  document.cookie = "ha-locale=; path=/; max-age=0";
});

describe("global error page", () => {
  test("English without a language cookie", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    show();
    const en = createTranslator("en");
    expect(screen.getByRole("heading", { name: en("errors.globalError.title") })).toBeTruthy();
    expect(screen.getByRole("button", { name: en("errors.playError.tryAgain") })).toBeTruthy();
  });

  test("the cookie's language once its texts have loaded", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    document.cookie = "ha-locale=uk; path=/";
    show();
    const uk = createTranslator("uk");
    expect(await screen.findByRole("heading", { name: uk("errors.globalError.title") })).toBeTruthy();
    expect(screen.getByRole("link", { name: uk("errors.playError.allWalks") })).toBeTruthy();
    expect(document.documentElement.lang).toBe("uk");
  });
});
