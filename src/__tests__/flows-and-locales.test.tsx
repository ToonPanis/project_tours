import { describe, expect, test, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { getWalks } from "@/data/walks";
import { hiddenPubsWalk } from "@/data/walks/hidden-pubs";
import { NavigationScreen } from "@/features/navigation/components/NavigationScreen";
import { NAVIGATION_CONFIG } from "@/features/navigation/config";
import { getRouteLegTo } from "@/features/navigation/logic/route-legs";
import { pointAlongRoute, projectOntoRoute } from "@/features/navigation/logic/route-progress";
import { PositionSimulationProvider, usePositionSimulation } from "@/features/navigation/simulation/PositionSimulation";
import { ChallengeScreen } from "@/features/walk-session/components/ChallengeScreen";
import { VoteResult } from "@/features/walk-session/components/VoteResult";
import { WalkPlayer } from "@/features/walk-session/components/WalkPlayer";
import { createLocationProgress } from "@/features/walk-session/logic/create-session";
import { getWalkCopy } from "@/features/walk-session/logic/walk-copy";
import { LocaleProvider } from "@/i18n/client";
import { locales } from "@/i18n/config";
import { messagesByLocale as messages } from "@/i18n/messages";
import { createTranslator, englishTranslator as t } from "@/i18n/translate";
import { SITE_NAME } from "@/lib/site";
import type { Challenge } from "@/types/challenge";
import type { GeoCoordinates } from "@/types/common";

// The real map needs WebGL, which jsdom doesn't have.
vi.mock("@/features/navigation/components/WalkingMap", () => ({ default: () => <div data-testid="walking-map" /> }));
// The yellow playtest tools are English on purpose (for the team, not for visitors).
vi.mock("@/features/walk-session/playtest/PlaytestControls", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/features/walk-session/playtest/PlaytestControls")>()),
  PlaytestControls: () => null,
}));

// ── Locale smoke test: every language, every walk ─────────────────────────

/** "game.header.route", "gps.mapControls.zoomIn"… : a raw key shown instead of its text. */
const RAW_KEY = /\b(common|navigation|meta|home|errors|walks|game|guide|gps)\.[a-z][A-Za-z]+(\.[A-Za-z]+)*\b/;

/**
 * English interface texts that must not appear on a page in another language. Each
 * text is split at its {placeholders} ("Stop {current} / {total}" → "Stop"), and every
 * piece of at least 6 characters that the language translates differently counts
 * (shorter words and names can legitimately be the same in both languages).
 */
function englishLeaksIn(locale: (typeof locales)[number], pageText: string): string[] {
  const english: string[] = [];
  const translated = new Set<string>();
  const collect = (node: unknown, into: (text: string) => void) => {
    if (typeof node === "string") into(node);
    else if (node && typeof node === "object") for (const value of Object.values(node)) collect(value, into);
  };
  collect(messages.en, (text) => english.push(text));
  collect(messages[locale], (text) => translated.add(text));
  return english
    .filter((text) => !translated.has(text))
    .flatMap((text) => text.split(/\{\w+\}/).map((piece) => piece.trim()))
    // Whole words only ("Antwerp" is not a leak inside "Antwerpen"), and never the brand name.
    .filter((piece) => piece.length >= 6 && !SITE_NAME.includes(piece))
    .filter((piece) => new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(piece)}(?![\\p{L}\\p{N}])`, "u").test(pageText));
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

describe.each(locales)("smoke test in %s", (locale) => {
  const tr = createTranslator(locale);

  test.each(getWalks(locale).map((walk) => [walk.slug, walk] as const))(
    "%s: start screen and the first step, fully in the language",
    async (_slug, walk) => {
      render(
        <LocaleProvider locale={locale}>
          <WalkPlayer walk={walk} />
        </LocaleProvider>,
      );
      const startLabel = walk.experience === "guide" ? tr("guide.startWalk") : tr("game.start.newAdventure");
      fireEvent.click(await screen.findByRole("button", { name: startLabel }));

      const text = document.body.textContent ?? "";
      expect(text).not.toMatch(RAW_KEY);
      if (locale !== "en") expect(englishLeaksIn(locale, text)).toEqual([]);
    },
  );
});

// ── Every challenge type renders something playable ───────────────────────

describe("every challenge type", () => {
  const base = { id: "c", title: "Test", question: "Question?", hints: [] };
  const cases: [string, Challenge, (container: HTMLElement) => void][] = [
    ["multiple-choice", { ...base, type: "multiple-choice", options: ["A1", "B1"], correctOptionIndex: 1 }, () =>
      expect(screen.getAllByRole("button", { name: /A1|B1/ })).toHaveLength(2)],
    ["text-answer", { ...base, type: "text-answer", acceptedAnswers: ["x"] }, () =>
      expect(screen.getByRole("textbox", { name: t("common.yourAnswer") }).getAttribute("inputmode")).toBe("text")],
    ["code", { ...base, type: "code", acceptedAnswers: ["1234"] } as Challenge, () =>
      expect(screen.getByRole("textbox", { name: t("common.yourAnswer") })).toBeDefined()],
    ["number-answer", { ...base, type: "number-answer", correctNumber: 7 }, () =>
      expect(screen.getByRole("textbox", { name: t("common.yourAnswer") }).getAttribute("inputmode")).toBe("numeric")],
    ["observation", { ...base, type: "observation", instruction: "Look up.", confirmLabel: "Found it" }, () =>
      expect(screen.getByRole("button", { name: "Found it" })).toBeDefined()],
    ["sequence", { ...base, type: "sequence", items: ["a", "b"], correctOrder: [1, 0] }, () =>
      expect(screen.getByText(t("game.challenge.notPlayable"))).toBeDefined()],
  ];

  test.each(cases)("%s", (_type, challenge, check) => {
    const { container } = render(
      <ChallengeScreen
        challenge={challenge}
        progress={createLocationProgress("challenge")}
        copy={getWalkCopy(hiddenPubsWalk, t)}
        requiredClues={[]}
        onSubmit={() => {}}
        onRevealHint={() => {}}
        onRevealAnswer={() => {}}
      />,
    );
    check(container);
  });
});

// ── A tied drink vote ─────────────────────────────────────────────────────

describe("a tied drink vote", () => {
  const stop = hiddenPubsWalk.locations.find((location) => location.drinkRound)!;
  const round = stop.drinkRound!;
  const [first, second] = round.options;
  const copy = getWalkCopy(hiddenPubsWalk, t);
  const tiedProgress = {
    ...createLocationProgress("drink-selected"),
    votes: [
      { playerId: "p1", drinkOptionId: first.id },
      { playerId: "p2", drinkOptionId: second.id },
    ],
    wasTie: true,
    selectedDrinkOptionId: second.id,
  };

  test("builds suspense first, then shows the drink the walk chose", () => {
    vi.useFakeTimers();
    try {
      render(<VoteResult drinkRound={round} progress={tiedProgress} copy={copy} playTieAnimation onContinue={() => {}} />);
      expect(screen.getByRole("heading", { name: copy.tieTitle })).toBeDefined();
      expect(screen.queryByText(t("game.result.chosenByLedger"))).toBeNull(); // not yet: suspense first
      act(() => vi.advanceTimersByTime(2_000));
      expect(screen.getByText(t("game.result.chosenByLedger"))).toBeDefined();
    } finally {
      vi.useRealTimers();
    }
  });

  test("after a page refresh the result shows straight away (no second suspense)", () => {
    render(<VoteResult drinkRound={round} progress={tiedProgress} copy={copy} playTieAnimation={false} onContinue={() => {}} />);
    expect(screen.getByText(t("game.result.chosenByLedger"))).toBeDefined();
  });
});

// ── Off the route ─────────────────────────────────────────────────────────

describe("off the route", () => {
  const deMuze = hiddenPubsWalk.locations.find((location) => location.id === "pubs-de-muze")!;
  const route = getRouteLegTo(hiddenPubsWalk, "pubs-de-muze")!.route!;
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
        <NavigationScreen destination={deMuze} route={route} gpsAlreadyEnabled onGpsEnabled={() => {}} onArrive={() => {}} onShowRoute={() => {}} />
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
