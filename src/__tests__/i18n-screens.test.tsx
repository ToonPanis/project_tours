import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { getClassicsWalk } from "@/data/walks/classics-of-antwerp";
import { getHiddenPubsWalk } from "@/data/walks/hidden-pubs";
import { GuideCompletionScreen } from "@/features/guide/components/GuideCompletionScreen";
import { PlayHeader } from "@/features/walk-session/components/PlayHeader";
import { RoutePanel } from "@/features/walk-session/components/RoutePanel";
import { checkAnswer, normalizeAnswer, parseNumber } from "@/features/walk-session/logic/answers";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import { formatElapsedTime } from "@/features/walk-session/logic/session-stats";
import { getWalkCopy } from "@/features/walk-session/logic/walk-copy";
import { LocaleProvider } from "@/i18n/client";
import { matchLocale } from "@/i18n/config";
import { createTranslator } from "@/i18n/translate";
import type { Challenge } from "@/types/challenge";

// Pages read the visitor's language on the server; here it is Dutch.
vi.mock("@/i18n/server", async () => {
  const { createTranslator: create } = await import("@/i18n/translate");
  return { getTranslator: async () => create("nl"), getLocale: async () => "nl" };
});
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }), notFound: vi.fn() }));

afterEach(cleanup);
beforeEach(() => {
  window.scrollTo = () => {};
});

const nl = createTranslator("nl");
const team = { id: "t", name: "", players: [{ id: "p", name: "Tony" }] };

// ── M-05: no English on translated screens ────────────────────────────────

describe("M-05: Hidden Pubs header and route panel in Dutch", () => {
  const walk = getHiddenPubsWalk("nl");
  const session = createWalkSession({ walk, team, sessionId: "s", startedAt: "2026-09-29T10:00:00.000Z" });

  test("the header shows the clue count and the Ledger button in Dutch", () => {
    render(
      <LocaleProvider locale="nl">
        <PlayHeader walk={walk} session={session} onOpenRoute={() => {}} />
      </LocaleProvider>,
    );
    const total = walk.clues!.length;
    expect(screen.getByText(nl("game.header.clues", { found: 0, total }))).toBeDefined();
    expect(screen.getByRole("button", { name: "Kasboek" })).toBeDefined();
    expect(document.body.textContent).not.toMatch(/Clues|Ledger/);
  });

  test("the route panel lists the clues in Dutch", () => {
    render(
      <LocaleProvider locale="nl">
        <RoutePanel walk={walk} session={session} copy={getWalkCopy(walk, nl)} open onClose={() => {}} />
      </LocaleProvider>,
    );
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog.textContent).toContain(nl("game.ledger.discoveredClues", { found: 0, total: walk.clues!.length }));
    expect(dialog.textContent).toContain(nl("game.ledger.clueLocked", { number: 1 }));
    expect(dialog.textContent).not.toMatch(/Discovered clues|locked/);
  });

  test("a walk without its own name for the route panel gets the translated default", () => {
    expect(getWalkCopy(getClassicsWalk("nl"), nl).routeButtonLabel).toBe(nl("game.header.route"));
  });
});

describe("M-05: guide completion time in the visitor's language", () => {
  test("the walking time is formatted in Russian, not as English '2h 47m'", () => {
    const ru = createTranslator("ru");
    const walk = getClassicsWalk("ru");
    const session = {
      ...createWalkSession({ walk, team, sessionId: "s", startedAt: "2026-09-29T10:00:00.000Z" }),
      completedAt: "2026-09-29T12:47:00.000Z",
    };
    render(<GuideCompletionScreen walk={walk} session={session} copy={getWalkCopy(walk, ru)} t={ru} onShowRoute={() => {}} />);
    const expected = formatElapsedTime(167 * 60 * 1000, ru);
    expect(expected).not.toBe("2h 47m");
    expect(screen.getByText(expected)).toBeDefined();
  });
});

// ── L-35: answer checking across languages ────────────────────────────────

describe("L-35: answers", () => {
  test("German ß counts as ss", () => {
    expect(normalizeAnswer("Faß")).toBe(normalizeAnswer("Fass"));
    expect(normalizeAnswer("STRASSE")).toBe(normalizeAnswer("Straße"));
  });

  test.each([
    ["1582", 1582],
    ["1.582", 1582],
    ["1,582", 1582],
    ["1 582", 1582],
    ["1 582", 1582],
    ["1'582", 1582],
    ["3,5", 3.5],
    ["3.5", 3.5],
    ["12", 12],
    ["1.58", 1.58],
    ["0,500", 0.5],
    ["1.5000", 1.5],
    ["abc", null],
    ["", null],
  ])("%s → %s", (input, expected) => {
    expect(parseNumber(input)).toBe(expected);
  });

  test("a year typed with a thousands separator is accepted", () => {
    const challenge: Challenge = { id: "c", type: "number-answer", title: "", question: "", hints: [], correctNumber: 1582 };
    expect(checkAnswer(challenge, "1.582")).toBe(true);
    expect(checkAnswer(challenge, "1 582")).toBe(true);
    expect(checkAnswer(challenge, "1583")).toBe(false);
  });
});

// ── O-06: browser language preferences ────────────────────────────────────

describe("O-06: Accept-Language q=0", () => {
  test("a language marked q=0 ('not this one') is never chosen", () => {
    expect(matchLocale("nl;q=0, fr;q=0.5")).toBe("fr");
    expect(matchLocale("de;q=0")).toBe("en");
    expect(matchLocale("fr-BE,fr;q=0.9,en;q=0.8")).toBe("fr");
  });
});

// ── L-33: link previews and robots ────────────────────────────────────────

describe("L-33: metadata", () => {
  test("a walk page keeps the shared Open Graph fields, with a language + region locale", async () => {
    const { generateMetadata } = await import("@/app/walks/[slug]/page");
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: "classics-of-antwerp" }) } as never);
    expect(metadata.openGraph).toMatchObject({ siteName: "Hidden Antwerp", locale: "nl_BE", type: "website" });
    expect(metadata.openGraph?.title).toBe(getClassicsWalk("nl").title);
  });

  test("the play page stays noindex AND nofollow (setting robots replaces the layout's)", async () => {
    const { generateMetadata } = await import("@/app/walks/[slug]/play/page");
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: "hidden-pubs" }) } as never);
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
