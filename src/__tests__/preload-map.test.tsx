import { act, render, renderHook } from "@testing-library/react";
import Link from "next/link";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { LinkPendingHint } from "@/components/ui/LinkPendingHint";
import { mapWorkerUrl } from "@/features/navigation/config";
import { preloadWalkingMap, resetMapPreload, usePreloadMap } from "@/features/navigation/preload-map";

// The real map needs WebGL; here it only has to be importable.
vi.mock("@/features/navigation/components/WalkingMap", () => ({ default: () => null }));
vi.mock("maplibre-gl", () => ({ getVersion: () => "9.9.9" }));

const linkStatus = vi.hoisted(() => ({ pending: false }));
vi.mock("next/link", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/link")>()),
  useLinkStatus: () => linkStatus,
}));

const prefetchLinks = () =>
  [...document.head.querySelectorAll<HTMLLinkElement>('link[rel="prefetch"]')].map((link) => link.getAttribute("href"));

/** Lets the chained dynamic imports finish. */
const settle = () => act(async () => vi.dynamicImportSettled());

beforeEach(() => {
  resetMapPreload();
  document.head.querySelectorAll('link[rel="prefetch"]').forEach((link) => link.remove());
});

afterEach(() => {
  vi.useRealTimers();
});

describe("preloading the map", () => {
  test("in production: the map code, then a prefetch hint for its worker files", async () => {
    vi.stubEnv("NODE_ENV", "production");
    preloadWalkingMap();
    await settle();

    const worker = mapWorkerUrl("9.9.9");
    expect(prefetchLinks()).toEqual([worker, worker.replace("maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs")]);

    // Once per page visit.
    preloadWalkingMap();
    await settle();
    expect(prefetchLinks()).toHaveLength(2);
  });

  test("never when the phone asks to save data, and never in development or tests", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubGlobal("navigator", { ...navigator, connection: { saveData: true } });
    preloadWalkingMap();
    vi.unstubAllGlobals();
    vi.stubEnv("NODE_ENV", "development");
    preloadWalkingMap();
    await settle();
    expect(prefetchLinks()).toEqual([]);
  });

  test("the hook waits for idle time (a timer where requestIdleCallback is missing, as in Safari)", async () => {
    vi.useFakeTimers();
    vi.stubEnv("NODE_ENV", "production");
    vi.stubGlobal("requestIdleCallback", undefined);
    const { rerender } = renderHook(({ enabled }) => usePreloadMap(enabled), { initialProps: { enabled: false } });
    await act(async () => vi.advanceTimersByTimeAsync(5_000));
    expect(prefetchLinks()).toEqual([]);

    rerender({ enabled: true });
    await act(async () => vi.advanceTimersByTimeAsync(1_999));
    expect(prefetchLinks()).toEqual([]);
    await act(async () => vi.advanceTimersByTimeAsync(1));
    vi.useRealTimers();
    await settle();
    expect(prefetchLinks()).toHaveLength(2);
  });
});

describe("link pending hint", () => {
  test("always there, hidden from screen readers; only visible while the next page loads", () => {
    linkStatus.pending = false;
    const { container, rerender } = render(
      <Link href="/walks">
        Walks <LinkPendingHint />
      </Link>,
    );
    const hint = container.querySelector("span[aria-hidden='true']")!;
    expect(hint.className).toContain("opacity-0");

    linkStatus.pending = true;
    rerender(
      <Link href="/walks">
        Walks <LinkPendingHint />
      </Link>,
    );
    expect(container.querySelector("span[aria-hidden='true']")!.className).not.toContain("opacity-0");
  });
});
