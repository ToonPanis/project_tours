import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import PlayError from "@/app/walks/[slug]/play/error";
import { storageKey } from "@/features/walk-session/storage/session-storage";
import { LocaleProvider } from "@/i18n/client";
import { LOCALE_STORAGE_KEY } from "@/i18n/config";
import { reloadPage } from "@/lib/reload-page";

vi.mock("next/navigation", () => ({
  useParams: () => ({ slug: "hidden-pubs" }),
  useRouter: () => ({ refresh: vi.fn() }),
}));
vi.mock("@/lib/reload-page", () => ({ reloadPage: vi.fn() }));

beforeEach(() => {
  window.localStorage.clear();
  vi.mocked(reloadPage).mockClear();
  vi.spyOn(console, "error").mockImplementation(() => {}); // the page logs the error on purpose
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const crash = Object.assign(new Error("Failed to load chunk"), { digest: undefined });

describe("Play error page (M-02)", () => {
  test("explains the problem, says progress is saved, and offers a retry", () => {
    render(<PlayError error={crash} />);
    expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeDefined();
    expect(screen.getByText(/Your progress is normally saved on this phone/)).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reloadPage).toHaveBeenCalledTimes(1);
  });

  test("'Try again' keeps the saved progress", () => {
    window.localStorage.setItem(storageKey("hidden-pubs"), '{"saved":true}');
    render(<PlayError error={crash} />);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(window.localStorage.getItem(storageKey("hidden-pubs"))).toBe('{"saved":true}');
  });

  test("'Start this walk again' asks first, then deletes only this walk's progress", () => {
    window.localStorage.setItem(storageKey("hidden-pubs"), '{"broken":true}');
    window.localStorage.setItem(storageKey("classics-of-antwerp"), '{"other":true}');
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "nl");
    render(<PlayError error={crash} />);

    fireEvent.click(screen.getByRole("button", { name: "Start this walk again" }));
    // Nothing is deleted before confirming. (jsdom has no showModal, so the dialog counts as hidden.)
    expect(window.localStorage.getItem(storageKey("hidden-pubs"))).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Yes, start again", hidden: true }));

    expect(window.localStorage.getItem(storageKey("hidden-pubs"))).toBeNull();
    expect(window.localStorage.getItem(storageKey("classics-of-antwerp"))).toBe('{"other":true}');
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("nl");
    expect(reloadPage).toHaveBeenCalledTimes(1);
  });

  test("is shown in the visitor's language", () => {
    render(
      <LocaleProvider locale="uk">
        <PlayError error={crash} />
      </LocaleProvider>,
    );
    expect(screen.getByRole("heading", { name: "Щось пішло не так" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Спробувати ще раз" })).toBeDefined();
  });
});
