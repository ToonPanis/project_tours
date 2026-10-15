import { describe, expect, test, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { getWalks } from "@/data/walks";
import { classicsOfAntwerpWalk } from "@/data/walks/classics-of-antwerp";
import { englishLeaksIn, RAW_KEY } from "./fixtures/english-leaks";
import { NavigationScreen } from "@/features/navigation/components/NavigationScreen";
import { NAVIGATION_CONFIG } from "@/features/navigation/config";
import { getRouteLegTo } from "@/features/navigation/logic/route-legs";
import { pointAlongRoute, projectOntoRoute } from "@/features/navigation/logic/route-progress";
import { PositionSimulationProvider, usePositionSimulation } from "@/features/navigation/simulation/PositionSimulation";
import { WalkPlayer } from "@/features/walk-session/components/WalkPlayer";
import { LocaleProvider } from "@/i18n/client";
import { messagesByLocale } from "@/i18n/messages";
import { locales } from "@/i18n/config";
import { createTranslator, englishTranslator as t } from "@/i18n/translate";
import type { GeoCoordinates } from "@/types/common";

// The real map needs WebGL, which jsdom doesn't have.
vi.mock("@/features/navigation/components/WalkingMap", () => ({ default: () => <div data-testid="walking-map" /> }));
// The yellow playtest tools are English on purpose (for the team, not for visitors).
vi.mock("@/features/walk-session/playtest/PlaytestControls", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/features/walk-session/playtest/PlaytestControls")>()),
  PlaytestControls: () => null,
}));

// ── Locale smoke test: every language, every walk ─────────────────────────

describe.each(locales)("smoke test in %s", (locale) => {
  const tr = createTranslator(locale);

  // The walks played on /walks/[slug]/play (the pub game has its own pages and tests).
  const guideWalks = getWalks(locale).filter((walk) => walk.experience === "guide");
  test.each(guideWalks.map((walk) => [walk.slug, walk] as const))(
    "%s: start screen and the first step, fully in the language",
    async (_slug, walk) => {
      render(
        <LocaleProvider locale={locale} messages={messagesByLocale[locale]}>
          <WalkPlayer walk={walk} />
        </LocaleProvider>,
      );
      fireEvent.click(await screen.findByRole("button", { name: tr("guide.startWalk") }));

      const text = document.body.textContent ?? "";
      expect(text).not.toMatch(RAW_KEY);
      if (locale !== "en") expect(englishLeaksIn(locale, text)).toEqual([]);
    },
  );
});

// ── Off the route ─────────────────────────────────────────────────────────

describe("off the route", () => {
  // Any stop with a walking route leading to it.
  const destination = classicsOfAntwerpWalk.locations[3];
  const route = getRouteLegTo(classicsOfAntwerpWalk, destination.id)!.route!;
  const handle: { emit: (coordinates: GeoCoordinates) => void } = { emit: () => {} };
  function Handle() {
    const { emit } = usePositionSimulation();
    useEffect(() => {
      handle.emit = emit;
    }, [emit]);
    return null;
  }

  test("a few readings away from the line show 'back to the route'", async () => {
    render(
      <PositionSimulationProvider>
        <Handle />
        <NavigationScreen destination={destination} route={route} gpsAlreadyEnabled onGpsEnabled={() => {}} onArrive={() => {}} onShowRoute={() => {}} />
      </PositionSimulationProvider>,
    );
    // A point clearly off the line, but not so far that it counts as "far from the route"
    // (which shows a different message): tried beside a point 100 m along the route.
    const onRoute = pointAlongRoute(route.geometry, 100);
    const step = 70 / 111_320; // about 70 m in degrees of latitude
    const candidates = [
      { latitude: onRoute.latitude + step, longitude: onRoute.longitude },
      { latitude: onRoute.latitude - step, longitude: onRoute.longitude },
      { latitude: onRoute.latitude, longitude: onRoute.longitude + step * 1.6 },
      { latitude: onRoute.latitude, longitude: onRoute.longitude - step * 1.6 },
    ];
    const aside = candidates.find((point) => {
      const away = projectOntoRoute(point, route.geometry).distanceFromRouteMeters;
      return away > NAVIGATION_CONFIG.OFF_ROUTE_METERS * 1.5 && away < NAVIGATION_CONFIG.FAR_FROM_ROUTE_METERS * 0.8;
    });
    if (!aside) throw new Error("no test point between 'off route' and 'far from route' found");
    for (let reading = 0; reading < 4; reading++) {
      await act(async () => handle.emit({ ...aside, longitude: aside.longitude + reading * 1e-6 }));
    }
    expect(screen.getByText(t("gps.backToRoute"))).toBeDefined();
  });
});
