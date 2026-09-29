import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { hiddenPubsWalk } from "@/data/walks/hidden-pubs";
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
import { ChallengeScreen } from "@/features/walk-session/components/ChallengeScreen";
import { RoutePanel } from "@/features/walk-session/components/RoutePanel";
import { createLocationProgress, createWalkSession } from "@/features/walk-session/logic/create-session";
import { getWalkCopy } from "@/features/walk-session/logic/walk-copy";
import { createTranslator, englishTranslator as t } from "@/i18n/translate";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { GuideStartScreen } from "@/features/guide/components/GuideStartScreen";
import type { Challenge } from "@/types/challenge";
import type { LocationProgress } from "@/types/session";

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

const copy = getWalkCopy(hiddenPubsWalk, t);

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
      team: { id: "t", name: "", players: [{ id: "p", name: "Visitor" }] },
      sessionId: "s",
      startedAt: "2026-09-29T10:00:00.000Z",
    });
    const walkCopy = getWalkCopy(classicsOfAntwerpWalk, t);
    render(<GuideCompletionScreen walk={classicsOfAntwerpWalk} session={session} copy={walkCopy} t={t} onShowRoute={() => {}} />);
    expect(document.activeElement).toBe(screen.getByRole("heading", { level: 1, name: walkCopy.completionTitle }));
  });

  test("navigation focuses the destination: first the explainer, then the live map title", async () => {
    const deMuze = hiddenPubsWalk.locations.find((location) => location.id === "pubs-de-muze")!;
    render(
      <PositionSimulationProvider>
        <NavigationScreen
          destination={deMuze}
          route={getRouteLegTo(hiddenPubsWalk, "pubs-de-muze")!.route}
          gpsAlreadyEnabled={false}
          onGpsEnabled={() => {}}
          onArrive={() => {}}
          onShowRoute={() => {}}
        />
      </PositionSimulationProvider>,
    );
    expect(document.activeElement).toBe(screen.getByRole("heading", { level: 1, name: deMuze.name }));

    fireEvent.click(screen.getByRole("button", { name: t("gps.continueWithoutGps") }));
    // The ★ is decorative (aria-hidden), so the accessible name is "Your next destination: De Muze".
    const mapTitle = screen.getByRole("heading", { level: 1, name: new RegExp(`^${t("gps.yourNextDestination")}:\\s+${deMuze.name}$`) });
    expect(document.activeElement).toBe(mapTitle);
    // L-27: the map region has a translated, descriptive name.
    expect(await screen.findByRole("region", { name: t("gps.mapRegion", { name: deMuze.name }) })).toBeDefined();
  });

  test("the guide start screen leaves focus alone on page load, and takes it after 'start again'", () => {
    const session = createWalkSession({
      walk: classicsOfAntwerpWalk,
      team: { id: "t", name: "", players: [{ id: "p", name: "Visitor" }] },
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

// ── M-11: every wrong answer gives fresh, announced feedback ──────────────

describe("M-11: wrong-answer feedback", () => {
  const textChallenge: Challenge = {
    id: "test-text",
    type: "text-answer",
    title: "Test",
    question: "What is written above the door?",
    hints: [],
    acceptedAnswers: ["anno"],
  };
  const choiceChallenge: Challenge = {
    id: "test-choice",
    type: "multiple-choice",
    title: "Test",
    question: "Which animal?",
    hints: [],
    options: ["Cat", "Dog", "Pig"],
    correctOptionIndex: 2,
  };
  const progressWith = (wrongAttempts: number): LocationProgress => ({ ...createLocationProgress("challenge"), wrongAttempts });
  const renderChallenge = (challenge: Challenge, wrongAttempts: number, onSubmit = vi.fn()) => (
    <ChallengeScreen
      challenge={challenge}
      progress={progressWith(wrongAttempts)}
      copy={copy}
      requiredClues={[]}
      onSubmit={onSubmit}
      onRevealHint={() => {}}
      onRevealAnswer={() => {}}
    />
  );

  test("the status exists before the first wrong answer, and its text changes with every attempt", () => {
    const { rerender } = render(renderChallenge(textChallenge, 0));
    const status = screen.getByRole("status");
    expect(status.textContent).toBe("");

    rerender(renderChallenge(textChallenge, 1));
    const afterFirst = screen.getByRole("status").textContent;
    expect(afterFirst).toContain(copy.wrongAnswer);
    expect(afterFirst).toContain(t("game.challenge.wrongAttempts", { count: 1 }));

    rerender(renderChallenge(textChallenge, 2));
    expect(screen.getByRole("status")).toBe(status);
    expect(screen.getByRole("status").textContent).not.toBe(afterFirst);
  });

  test("the answer field is marked invalid while it holds the wrong answer", () => {
    const { rerender } = render(renderChallenge(textChallenge, 0));
    const input = screen.getByRole("textbox", { name: t("common.yourAnswer") });
    expect(input.getAttribute("aria-describedby")).toBe(screen.getByRole("status").id);
    fireEvent.change(input, { target: { value: "wrong" } });
    fireEvent.submit(input.closest("form")!);
    rerender(renderChallenge(textChallenge, 1));
    expect(input.getAttribute("aria-invalid")).toBe("true");

    fireEvent.change(input, { target: { value: "new try" } });
    expect(input.getAttribute("aria-invalid")).toBe("false");
  });

  test("a wrong multiple-choice option is marked, for eyes and for screen readers", () => {
    const { rerender } = render(renderChallenge(choiceChallenge, 0));
    fireEvent.click(screen.getByRole("button", { name: /Dog/ }));
    rerender(renderChallenge(choiceChallenge, 1));
    expect(screen.getByRole("button", { name: /Dog/ }).textContent).toContain(t("game.challenge.wrongOption"));
    expect(screen.getByRole("button", { name: /Cat/ }).textContent).not.toContain(t("game.challenge.wrongOption"));
  });

  test("tapping an option that is already crossed out doesn't count as another wrong answer", () => {
    const onSubmit = vi.fn();
    const { rerender } = render(renderChallenge(choiceChallenge, 0, onSubmit));
    fireEvent.click(screen.getByRole("button", { name: /Dog/ }));
    rerender(renderChallenge(choiceChallenge, 1, onSubmit));
    fireEvent.click(screen.getByRole("button", { name: /Dog/ }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /Dog/ }).getAttribute("aria-disabled")).toBe("true");
  });
});

// ── M-13, L-23: the route panel ───────────────────────────────────────────

describe("M-13 / L-23: route panel", () => {
  test("a close button comes before the (long) list of stops", () => {
    const session = createWalkSession({
      walk: poortjesWalk,
      team: { id: "t", name: "", players: [{ id: "p", name: "Visitor" }] },
      sessionId: "s",
      startedAt: "2026-09-29T10:00:00.000Z",
    });
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
    const session = createWalkSession({
      walk: hiddenPubsWalk,
      team: { id: "t", name: "", players: [{ id: "p", name: "Tony" }] },
      sessionId: "s",
      startedAt: "2026-09-29T10:00:00.000Z",
    });
    render(<RoutePanel walk={hiddenPubsWalk} session={session} copy={copy} open onClose={() => {}} />);
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
