import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { poortjesWalk } from "@/data/walks/poortjes-van-antwerpen";
import { classicsOfAntwerpWalk } from "@/data/walks/classics-of-antwerp";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ChapterCard } from "@/features/guide/components/ChapterCard";
import { CollectionItemCard } from "@/features/guide/components/CollectionItemCard";
import { GuideCompletionScreen } from "@/features/guide/components/GuideCompletionScreen";
import { SearchTaskView } from "@/features/guide/components/SearchTaskView";
import { DirectionPanel, type DirectionInstruction } from "@/features/navigation/components/DirectionPanel";
import { NavigationScreen } from "@/features/navigation/components/NavigationScreen";
import { getSpokenDirection, type SpokenDirection } from "@/features/navigation/logic/spoken-direction";
import { getRouteLegTo } from "@/features/navigation/logic/route-legs";
import { PositionSimulationProvider } from "@/features/navigation/simulation/PositionSimulation";
import { RoutePanel } from "@/features/walk-session/components/RoutePanel";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import { getWalkCopy } from "@/features/walk-session/logic/walk-copy";
import { createTranslator, englishTranslator as t } from "@/i18n/translate";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { GuideStartScreen } from "@/features/guide/components/GuideStartScreen";

// The language menu refreshes the page through the router.
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

// The real map needs WebGL, which jsdom doesn't have. The stand-in shows the label it gets.
vi.mock("@/features/navigation/components/WalkingMap", () => ({
  default: ({ regionLabel }: { regionLabel: string }) => <div role="region" aria-label={regionLabel} />,
}));

beforeEach(() => {
  window.localStorage.clear();
  window.scrollTo = () => {};
});
afterEach(cleanup);

// ── M-09: directions are not re-read on every GPS reading ─────────────────

describe("M-09: spoken directions", () => {
  const turnLeft = (distanceMeters: number): DirectionInstruction => ({
    kind: "maneuver",
    maneuver: "left",
    distanceMeters,
    streetName: "Wolstraat",
  });
  const speak = (distances: number[]) => {
    const spoken: SpokenDirection[] = [];
    let previous: SpokenDirection | null = null;
    for (const distance of distances) {
      previous = getSpokenDirection(turnLeft(distance), null, previous);
      if (spoken.at(-1) !== previous) spoken.push(previous);
    }
    return spoken.map((item) => item.band);
  };

  test("the same turn is read once per distance band (100, 50, 20 m and now), not per reading", () => {
    expect(speak([180, 170, 150, 99, 90, 60, 49, 30, 19, 12, 8])).toEqual(["far", "100", "50", "20", "now"]);
  });

  test("GPS noise around a band edge doesn't make it read again", () => {
    expect(speak([55, 49, 52, 48, 51])).toEqual(["100", "50"]);
  });

  test("a new turn is read straight away", () => {
    const first = getSpokenDirection(turnLeft(40), null, null);
    const next = getSpokenDirection({ kind: "maneuver", maneuver: "right", distanceMeters: 200 }, null, first);
    expect(next).not.toBe(first);
    expect(next.band).toBe("far");
  });

  test("the panel has no live region on itself; its hidden status changes only when needed", () => {
    const { container, rerender } = render(<DirectionPanel instruction={turnLeft(90)} t={t} />);
    expect(container.querySelector("[aria-live]")).toBeNull();
    const status = screen.getByRole("status");
    const first = status.textContent;
    expect(first).toContain("Turn left");

    rerender(<DirectionPanel instruction={turnLeft(80)} t={t} />); // the visible distance changes…
    expect(screen.getByRole("status").textContent).toBe(first); // …the spoken text doesn't

    rerender(<DirectionPanel instruction={turnLeft(45)} t={t} />); // crossed 50 m
    expect(screen.getByRole("status").textContent).not.toBe(first);
    expect(screen.getByRole("status")).toBe(status); // the same element, updated (so it is announced)
  });

  test("after a language switch the current direction is read again, in the new language", () => {
    const { rerender } = render(<DirectionPanel instruction={turnLeft(90)} t={t} />);
    const dutch = createTranslator("nl");
    rerender(<DirectionPanel instruction={turnLeft(88)} t={dutch} />);
    expect(screen.getByRole("status").textContent).toContain(dutch("gps.maneuvers.left"));
  });
});

// ── M-10: focus moves to the new screen's title ───────────────────────────

describe("M-10: focus on new screens", () => {
  test("a chapter card focuses its title", () => {
    const chapter = poortjesWalk.chapters![0];
    render(<ChapterCard chapter={chapter} totalChapters={5} t={t} onContinue={() => {}} />);
    expect(document.activeElement).toBe(screen.getByRole("heading", { level: 1, name: chapter.title }));
  });

  test("the guide completion screen focuses its title", () => {
    const session = createWalkSession({
      walk: classicsOfAntwerpWalk,
      sessionId: "s",
      startedAt: "2026-09-29T10:00:00.000Z",
    });
    const walkCopy = getWalkCopy(classicsOfAntwerpWalk, t);
    render(<GuideCompletionScreen walk={classicsOfAntwerpWalk} session={session} copy={walkCopy} t={t} onShowRoute={() => {}} />);
    expect(document.activeElement).toBe(screen.getByRole("heading", { level: 1, name: walkCopy.completionTitle }));
  });

  test("navigation focuses the destination: first the explainer, then the live map title", async () => {
    // Any stop with a walking route leading to it.
    const destinationStop = classicsOfAntwerpWalk.locations[3];
    render(
      <PositionSimulationProvider>
        <NavigationScreen
          destination={destinationStop}
          route={getRouteLegTo(classicsOfAntwerpWalk, destinationStop.id)!.route}
          gpsAlreadyEnabled={false}
          onGpsEnabled={() => {}}
          onArrive={() => {}}
          onShowRoute={() => {}}
        />
      </PositionSimulationProvider>,
    );
    expect(document.activeElement).toBe(screen.getByRole("heading", { level: 1, name: destinationStop.name }));

    fireEvent.click(screen.getByRole("button", { name: t("gps.continueWithoutGps") }));
    // The ★ is decorative (aria-hidden), so the accessible name is "Your next destination: <stop>".
    const mapTitle = screen.getByRole("heading", { level: 1, name: new RegExp(`^${t("gps.yourNextDestination")}:\\s+${destinationStop.name}$`) });
    expect(document.activeElement).toBe(mapTitle);
    // L-27: the map region has a translated, descriptive name.
    expect(await screen.findByRole("region", { name: t("gps.mapRegion", { name: destinationStop.name }) })).toBeDefined();
  });

  test("the guide start screen leaves focus alone on page load, and takes it after 'start again'", () => {
    const session = createWalkSession({
      walk: classicsOfAntwerpWalk,
      sessionId: "s",
      startedAt: "2026-09-29T10:00:00.000Z",
    });
    const renderStart = (saved: typeof session | null) => (
      <GuideStartScreen walk={classicsOfAntwerpWalk} savedSession={saved} t={t} onStart={() => {}} onContinue={() => {}} onRestart={() => rerender(renderStart(null))} />
    );
    const { rerender } = render(renderStart(session));
    expect(document.activeElement).toBe(document.body);

    fireEvent.click(screen.getByRole("button", { name: t("guide.startAgain") }));
    fireEvent.click(screen.getByRole("button", { name: t("guide.startAgainConfirm"), hidden: true }));
    expect(document.activeElement).toBe(screen.getByRole("heading", { level: 1, name: classicsOfAntwerpWalk.title }));
  });

  test("revealing a search-task solution moves focus to it (the pressed button disappears)", () => {
    const task = poortjesWalk.locations.find((location) => location.guide?.searchTask)!.guide!.searchTask!;
    render(<SearchTaskView task={task} t={t} />);
    const [showSolution] = screen.getAllByRole("button", { name: t("guide.showSolution") });
    showSolution.focus();
    fireEvent.click(showSolution);
    expect(document.activeElement).not.toBe(document.body);
    expect(document.activeElement?.textContent).toContain(task.items[0].solution);
  });
});

// ── M-13, L-23: the route panel ───────────────────────────────────────────

describe("M-13 / L-23: route panel", () => {
  test("a close button comes before the (long) list of stops", () => {
    const session = createWalkSession({ walk: poortjesWalk, sessionId: "s", startedAt: "2026-09-29T10:00:00.000Z" });
    const onClose = vi.fn();
    render(<RoutePanel walk={poortjesWalk} session={session} copy={getWalkCopy(poortjesWalk, t)} open onClose={onClose} />);
    const [topClose] = screen.getAllByRole("button", { name: t("common.close"), hidden: true });
    const firstStop = screen.getAllByRole("listitem", { hidden: true })[0];
    // DOCUMENT_POSITION_FOLLOWING: the first stop comes after the close button.
    expect(topClose.compareDocumentPosition(firstStop) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    fireEvent.click(topClose);
    expect(onClose).toHaveBeenCalled();
  });

  test("locked entries use a readable text colour (at least /65, not /40)", () => {
    // A route revealed step by step shows its locked stops as "???".
    const progressiveWalk = { ...poortjesWalk, routeReveal: "progressive" as const };
    const session = createWalkSession({ walk: progressiveWalk, sessionId: "s", startedAt: "2026-09-29T10:00:00.000Z" });
    render(<RoutePanel walk={progressiveWalk} session={session} copy={getWalkCopy(progressiveWalk, t)} open onClose={() => {}} />);
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog.innerHTML).not.toMatch(/text-parchment\/(40|50)\b/);
  });
});

// ── L-24: Dutch text is marked as Dutch ───────────────────────────────────

describe("L-24: lang on Dutch source text", () => {
  test("Smekens' captions are marked lang=nl", () => {
    const item = poortjesWalk.collection!.items[0];
    const { container } = render(<CollectionItemCard item={item} t={t} variant="featured" />);
    expect(container.querySelector("blockquote")?.getAttribute("lang")).toBe("nl");
  });

  test("every collection item says its caption is Dutch; the Smekens book is a Dutch source", () => {
    expect(poortjesWalk.collection!.items.every((item) => item.sourceCaptionLanguage === "nl")).toBe(true);
    const sources = poortjesWalk.locations.flatMap((location) => location.guide?.sources ?? []);
    expect(sources.find((source) => source.title.startsWith("P. Smekens"))?.language).toBe("nl");
    expect(sources.filter((source) => source.title.startsWith("Inventaris Onroerend Erfgoed")).every((s) => s.language === "nl")).toBe(true);
  });
});

// ── L-25: destructive confirmations ───────────────────────────────────────

describe("L-25: confirm dialog", () => {
  const renderDialog = (isDestructive: boolean) =>
    render(
      <ConfirmDialog
        open
        title="Start again?"
        message="Your progress will be lost."
        confirmLabel="Yes, start again"
        isDestructive={isDestructive}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );

  test("a destructive dialog focuses Cancel and shows the confirm button in red", () => {
    renderDialog(true);
    expect(document.activeElement).toBe(screen.getByRole("button", { name: t("common.cancel"), hidden: true }));
    expect(screen.getByRole("button", { name: "Yes, start again", hidden: true }).className).toContain("bg-red-800");
  });

  test("a normal question (e.g. 'Are you here?') keeps its usual look", () => {
    renderDialog(false);
    expect(screen.getByRole("button", { name: "Yes, start again", hidden: true }).className).not.toContain("bg-red-800");
  });
});

// ── L-26: touch targets ───────────────────────────────────────────────────

describe("L-26: map zoom buttons", () => {
  test("the 44 px rule is more specific than MapLibre's own (which loads later and would win a tie)", () => {
    const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
    expect(css).toContain(".maplibregl-ctrl.maplibregl-ctrl-group button {");
  });
});

// ── L-28: language menu ───────────────────────────────────────────────────

describe("L-28: language menu", () => {
  test("is a disclosure (no aria-haspopup) that closes when focus moves on", () => {
    render(
      <>
        <LanguageSelector />
        <button type="button">Next thing on the page</button>
      </>,
    );
    const toggle = screen.getByRole("button", { expanded: false });
    expect(toggle.getAttribute("aria-haspopup")).toBeNull();

    fireEvent.click(toggle);
    const list = document.getElementById(toggle.getAttribute("aria-controls")!)!;
    const lastLanguage = within(list).getAllByRole("button").at(-1)!;
    act(() => lastLanguage.focus());
    // Tab past the last language:
    act(() => screen.getByRole("button", { name: "Next thing on the page" }).focus());
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  test("stays open when focus goes nowhere (iOS Safari doesn't focus a tapped button)", () => {
    render(<LanguageSelector />);
    const toggle = screen.getByRole("button", { expanded: false });
    fireEvent.click(toggle);
    act(() => toggle.focus());
    fireEvent.blur(toggle, { relatedTarget: null });
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
  });
});
