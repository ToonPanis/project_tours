import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { getClassicsWalk } from "@/data/walks/classics-of-antwerp";
import { GuideCompletionScreen } from "@/features/guide/components/GuideCompletionScreen";
import { PlayHeader } from "@/features/walk-session/components/PlayHeader";
import { RoutePanel } from "@/features/walk-session/components/RoutePanel";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import { formatElapsedTime, getSessionStats } from "@/features/walk-session/logic/session-stats";
import { getWalkCopy } from "@/features/walk-session/logic/walk-copy";
import { LocaleProvider } from "@/i18n/client";
import { messagesByLocale } from "@/i18n/messages";
import { matchLocale } from "@/i18n/config";
import { createTranslator } from "@/i18n/translate";

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

// ── M-05: no English on translated screens ────────────────────────────────

describe("M-05: the header and route panel in Dutch", () => {
  const walk = getClassicsWalk("nl");
  const session = createWalkSession({ walk, sessionId: "s", startedAt: "2026-09-29T10:00:00.000Z" });
  const copy = getWalkCopy(walk, nl);

  test("the header shows the stop counter and the route button in Dutch", () => {
    render(
      <LocaleProvider locale="nl" messages={messagesByLocale.nl}>
        <PlayHeader walk={walk} session={session} onOpenRoute={() => {}} />
      </LocaleProvider>,
    );
    const { currentStopNumber, totalStops } = getSessionStats(walk, session);
    expect(screen.getByText(nl("game.header.stopCounter", { current: currentStopNumber, total: totalStops }))).toBeDefined();
    expect(screen.getByRole("button", { name: copy.routeButtonLabel })).toBeDefined();
  });

  test("the route panel's headings are in Dutch", () => {
    render(
      <LocaleProvider locale="nl" messages={messagesByLocale.nl}>
        <RoutePanel walk={walk} session={session} copy={copy} open onClose={() => {}} />
      </LocaleProvider>,
    );
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog.textContent).toContain(nl("game.ledger.yourRoute", { title: walk.title }));
    expect(dialog.textContent).toContain(copy.locationsTitle);
    expect(dialog.textContent).toContain(nl("game.ledger.current"));
  });

  test("a walk without its own name for the route panel gets the translated default", () => {
    expect(copy.routeButtonLabel).toBe(nl("game.header.route"));
  });
});

describe("M-05: guide completion time in the visitor's language", () => {
  test("the walking time is formatted in Russian, not as English '2h 47m'", () => {
    const ru = createTranslator("ru");
    const walk = getClassicsWalk("ru");
    const session = {
      ...createWalkSession({ walk, sessionId: "s", startedAt: "2026-09-29T10:00:00.000Z" }),
      completedAt: "2026-09-29T12:47:00.000Z",
    };
    render(<GuideCompletionScreen walk={walk} session={session} copy={getWalkCopy(walk, ru)} t={ru} onShowRoute={() => {}} />);
    const expected = formatElapsedTime(167 * 60 * 1000, ru);
    expect(expected).not.toBe("2h 47m");
    expect(screen.getByText(expected)).toBeDefined();
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
