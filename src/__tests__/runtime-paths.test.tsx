import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { hiddenPubsWalk } from "@/data/walks/hidden-pubs";
import { WalkPlayer } from "@/features/walk-session/components/WalkPlayer";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import { applySessionAction } from "@/features/walk-session/logic/session-reducer";
import { getJumpToStopActions } from "@/features/walk-session/playtest/get-correct-answer";
import { localWalkSessionStore } from "@/features/walk-session/storage/session-storage";
import { englishTranslator as t } from "@/i18n/translate";
import { getOrderedLocations } from "@/lib/walk-locations";
import { NAVIGATION_CONFIG } from "@/features/navigation/config";
import { useGeolocation } from "@/features/navigation/hooks/useGeolocation";
import { useWakeLock } from "@/features/navigation/hooks/useWakeLock";
import {
  PositionSimulationProvider,
  usePositionSimulation,
} from "@/features/navigation/simulation/PositionSimulation";
import { LocaleProvider, LocaleSync } from "@/i18n/client";
import { LOCALE_COOKIE, LOCALE_STORAGE_KEY, localeNames } from "@/i18n/config";
import type { GpsFix } from "@/types/navigation";

/**
 * M-18: the runtime paths that used to be mocked away everywhere: the real
 * geolocation watch, the wake lock, and how the language is detected and
 * switched (cookie, Accept-Language, localStorage, router).
 */

const router = vi.hoisted(() => ({ refresh: () => {} }));
vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  useRouter: () => router,
}));

// The real map needs WebGL, which jsdom doesn't have.
vi.mock("@/features/navigation/components/WalkingMap", () => ({ default: () => <div data-testid="walking-map" /> }));

// What the server sees of the request: set per test.
const request = vi.hoisted(() => ({ cookie: undefined as string | undefined, acceptLanguage: null as string | null }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: (name: string) => (name === "ha-locale" && request.cookie ? { value: request.cookie } : undefined) }),
  headers: async () => new Headers(request.acceptLanguage ? { "accept-language": request.acceptLanguage } : {}),
}));

// ── The real geolocation watch ────────────────────────────────────────────

interface FakeWatch {
  id: number;
  success: PositionCallback;
  error: PositionErrorCallback;
  options?: PositionOptions;
}

let watches: FakeWatch[];
let clearedIds: number[];

function installFakeGeolocation({ secure = true } = {}) {
  watches = [];
  clearedIds = [];
  vi.stubGlobal("navigator", {
    ...navigator,
    geolocation: {
      watchPosition: (success: PositionCallback, error: PositionErrorCallback, options?: PositionOptions) => {
        const id = watches.length + 1;
        watches.push({ id, success, error, options });
        return id;
      },
      clearWatch: (id: number) => clearedIds.push(id),
    },
  });
  Object.defineProperty(window, "isSecureContext", { configurable: true, value: secure });
}

const position = (accuracy: number, timestamp = Date.now()) =>
  ({
    coords: { latitude: 51.2211, longitude: 4.3997, accuracy, heading: null, speed: null },
    timestamp,
  }) as unknown as GeolocationPosition;

const gpsError = (code: number) =>
  ({ code, message: "", PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 }) as GeolocationPositionError;

/** Lets zero-delay timers run (the hook reports some statuses on the next tick). */
const nextTick = () => act(() => new Promise<void>((resolve) => setTimeout(resolve, 0)));

const withSimulation = ({ children }: { children: ReactNode }) => <PositionSimulationProvider>{children}</PositionSimulationProvider>;

describe("useGeolocation (real GPS path)", () => {
  beforeEach(() => installFakeGeolocation());

  test("watches with high accuracy, asks for permission, then reports readings", async () => {
    const onFix = vi.fn<(fix: GpsFix) => void>();
    const { result } = renderHook(() => useGeolocation({ enabled: true, onFix }), { wrapper: withSimulation });
    expect(watches).toHaveLength(1);
    expect(watches[0].options?.enableHighAccuracy).toBe(true);
    await nextTick(); // the "asking" status is reported on the next tick
    expect(result.current.status).toBe("requesting-permission");

    act(() => watches[0].success(position(8)));
    expect(result.current.status).toBe("active");
    expect(onFix).toHaveBeenCalledWith(expect.objectContaining({ accuracyMeters: 8 }));
  });

  test("a vague reading says 'low accuracy'", () => {
    const { result } = renderHook(() => useGeolocation({ enabled: true, onFix: () => {} }), { wrapper: withSimulation });
    act(() => watches[0].success(position(NAVIGATION_CONFIG.LOW_ACCURACY_METERS + 1)));
    expect(result.current.status).toBe("low-accuracy");
  });

  test.each([
    [1, "permission-denied"],
    [2, "unavailable"],
    [3, "searching"],
  ] as const)("browser error %i → %s", (code, status) => {
    const { result } = renderHook(() => useGeolocation({ enabled: true, onFix: () => {} }), { wrapper: withSimulation });
    act(() => watches[0].error(gpsError(code)));
    expect(result.current.status).toBe(status);
  });

  test("an insecure page (plain http) can't use GPS: 'unavailable', and no watch is started", async () => {
    installFakeGeolocation({ secure: false });
    const { result } = renderHook(() => useGeolocation({ enabled: true, onFix: () => {} }), { wrapper: withSimulation });
    await nextTick();
    expect(watches).toHaveLength(0);
    expect(result.current.status).toBe("unavailable");
  });

  test("nothing is watched until enabled, and leaving the screen stops the watch", () => {
    const { rerender, unmount } = renderHook(({ enabled }) => useGeolocation({ enabled, onFix: () => {} }), {
      wrapper: withSimulation,
      initialProps: { enabled: false },
    });
    expect(watches).toHaveLength(0);
    rerender({ enabled: true });
    expect(watches).toHaveLength(1);
    unmount();
    expect(clearedIds).toEqual([1]);
  });

  test("simulated positions pause the real GPS; stopping the simulation resumes it", () => {
    const onFix = vi.fn<(fix: GpsFix) => void>();
    const { result } = renderHook(
      () => ({ gps: useGeolocation({ enabled: true, onFix }), simulation: usePositionSimulation() }),
      { wrapper: withSimulation },
    );
    act(() => result.current.simulation.emit({ latitude: 51.22, longitude: 4.4 }));
    expect(clearedIds).toEqual([1]); // the real watch stopped
    expect(onFix).toHaveBeenLastCalledWith(expect.objectContaining({ coordinates: { latitude: 51.22, longitude: 4.4 } }));

    act(() => result.current.simulation.stop());
    expect(watches).toHaveLength(2); // a fresh real watch
  });

  test("PRIVACY: readings are passed on, never stored", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const onFix = vi.fn();
    renderHook(() => useGeolocation({ enabled: true, onFix }), { wrapper: withSimulation });
    act(() => {
      watches[0].success(position(5, 1));
      watches[0].success(position(6, 2));
    });
    expect(onFix).toHaveBeenCalledTimes(2);
    expect(setItem).not.toHaveBeenCalled();
    expect(window.localStorage.length).toBe(0);
    expect(document.cookie).not.toMatch(/51\.22|4\.39/);
  });
});

describe("PRIVACY: a whole walk to a café keeps no position", () => {
  beforeEach(() => installFakeGeolocation());

  test("readings on the way and at arrival never reach storage (only progress is saved)", async () => {
    const walk = hiddenPubsWalk;
    const destination = getOrderedLocations(walk)[1];
    const start = createWalkSession({
      walk,
      team: { id: "t", name: "", players: [{ id: "p", name: "Tony" }] },
      sessionId: "s",
      startedAt: "2026-09-29T10:00:00.000Z",
    });
    const travelling = getJumpToStopActions(walk, destination.order, "2026-09-29T10:30:00.000Z").reduce(
      (session, action) => applySessionAction(walk, session, action),
      start,
    );
    localWalkSessionStore.save(travelling);

    render(<WalkPlayer walk={walk} />);
    fireEvent.click(await screen.findByRole("button", { name: t("game.start.continueWalk") }));
    fireEvent.click(await screen.findByRole("button", { name: t("gps.enableLocation") }));
    expect(watches.length).toBeGreaterThan(0);

    // Distinctive readings: a few metres from the café, with digits that can't occur by chance.
    const { latitude, longitude } = destination.coordinates!;
    const readings = [0.0000123, 0.0000131, 0.0000147].map((offset, index) => ({
      coords: { latitude: latitude + offset, longitude: longitude + offset, accuracy: 5, heading: null, speed: null },
      timestamp: Date.now() + index * 1_000,
    }));
    for (const reading of readings) {
      await act(async () => watches.at(-1)!.success(reading as unknown as GeolocationPosition));
    }

    // The team arrived (so the game saved new progress)…
    const saved = Object.values({ ...window.localStorage }).join("\n");
    expect(saved).toContain('"status":"arrived"');
    // …and not one digit sequence of a reading was stored.
    for (const { coords } of readings) {
      expect(saved).not.toContain(String(coords.latitude)); // as JSON would write it
      expect(saved).not.toContain(String(coords.longitude));
    }
    expect(document.cookie).not.toMatch(/\d{2}\.\d{5}/);
  });
});

// ── Screen wake lock ──────────────────────────────────────────────────────

describe("useWakeLock", () => {
  test("a browser without the API: nothing happens, nothing breaks", () => {
    vi.stubGlobal("navigator", { ...navigator, wakeLock: undefined });
    expect(() => renderHook(() => useWakeLock(true))).not.toThrow();
  });

  test("a refused lock (e.g. battery saver) is not an error", async () => {
    const request = vi.fn(() => Promise.reject(new Error("NotAllowedError")));
    vi.stubGlobal("navigator", { ...navigator, wakeLock: { request } });
    renderHook(() => useWakeLock(true));
    await act(async () => {});
    expect(request).toHaveBeenCalledOnce();
  });

  test("no lock while inactive; a lock granted after leaving is released at once", async () => {
    let grant: (sentinel: WakeLockSentinel) => void = () => {};
    const release = vi.fn(() => Promise.resolve());
    const request = vi.fn(() => new Promise<WakeLockSentinel>((resolve) => (grant = resolve)));
    vi.stubGlobal("navigator", { ...navigator, wakeLock: { request } });

    const { rerender, unmount } = renderHook(({ active }) => useWakeLock(active), { initialProps: { active: false } });
    expect(request).not.toHaveBeenCalled();
    rerender({ active: true });
    unmount(); // leaves the screen while the browser is still deciding
    await act(async () => grant({ released: false, release } as unknown as WakeLockSentinel));
    expect(release).toHaveBeenCalledOnce();
  });
});

// ── The language: server detection ───────────────────────────────────────

describe("getLocale (server)", () => {
  beforeEach(() => {
    request.cookie = undefined;
    request.acceptLanguage = null;
  });

  test("the visitor's choice (cookie) wins over the browser language", async () => {
    const { getLocale } = await import("@/i18n/server");
    request.cookie = "de";
    request.acceptLanguage = "fr-BE,fr;q=0.9";
    expect(await getLocale()).toBe("de");
  });

  test("without a cookie: the browser language (nl-BE → nl), else English", async () => {
    const { getLocale } = await import("@/i18n/server");
    request.acceptLanguage = "nl-BE,nl;q=0.9,en;q=0.8";
    expect(await getLocale()).toBe("nl");
    request.acceptLanguage = "pt-BR";
    expect(await getLocale()).toBe("en");
    request.acceptLanguage = null;
    expect(await getLocale()).toBe("en");
  });

  test("a tampered cookie is ignored", async () => {
    const { getLocale } = await import("@/i18n/server");
    request.cookie = "xx<script>";
    request.acceptLanguage = "uk";
    expect(await getLocale()).toBe("uk");
  });
});

// ── The language: switching and restoring in the browser ──────────────────

describe("switching and restoring the language (browser)", () => {
  const clearCookie = () => (document.cookie = `${LOCALE_COOKIE}=; path=/; max-age=0`);
  beforeEach(() => {
    clearCookie();
    router.refresh = vi.fn();
  });
  afterEach(clearCookie);

  test("choosing a language saves it (cookie + storage), sets <html lang> and refreshes the page", () => {
    render(
      <LocaleProvider locale="en">
        <LanguageSelector />
      </LocaleProvider>,
    );
    fireEvent.click(screen.getByRole("button", { expanded: false }));
    fireEvent.click(screen.getByRole("button", { name: localeNames.nl.nativeName }));
    expect(document.cookie).toContain(`${LOCALE_COOKIE}=nl`);
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("nl");
    expect(document.documentElement.lang).toBe("nl");
    expect(router.refresh).toHaveBeenCalledOnce();
  });

  test("choosing the current language does nothing", () => {
    render(
      <LocaleProvider locale="en">
        <LanguageSelector />
      </LocaleProvider>,
    );
    fireEvent.click(screen.getByRole("button", { expanded: false }));
    fireEvent.click(screen.getByRole("button", { name: localeNames.en.nativeName }));
    expect(router.refresh).not.toHaveBeenCalled();
  });

  test("cookie gone but the choice saved: LocaleSync restores it once", () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "ru");
    render(
      <LocaleProvider locale="en">
        <LocaleSync />
      </LocaleProvider>,
    );
    expect(document.cookie).toContain(`${LOCALE_COOKIE}=ru`);
    expect(router.refresh).toHaveBeenCalledOnce();
  });

  test("LocaleSync leaves a present cookie alone (the server already used it)", () => {
    document.cookie = `${LOCALE_COOKIE}=fr; path=/`;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "ru");
    render(
      <LocaleProvider locale="fr">
        <LocaleSync />
      </LocaleProvider>,
    );
    expect(router.refresh).not.toHaveBeenCalled();
  });
});
