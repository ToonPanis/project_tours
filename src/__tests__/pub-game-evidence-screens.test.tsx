import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { pubGameAnswerKey } from "@/data/walks/hidden-pubs/game/answers.server";
import { pubGameTexts } from "@/data/walks/hidden-pubs/game/content";
import { pubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import { HostDashboard } from "@/features/pub-game/components/HostDashboard";
import { PubGame } from "@/features/pub-game/components/PubGame";
import { applyPubGameAction } from "@/features/pub-game/logic/apply-action";
import { createPubGame } from "@/features/pub-game/logic/create-game";
import { toPlayerView } from "@/features/pub-game/logic/player-view";
import { englishTranslator as t } from "@/i18n/translate";
import type { PubGameAction, PubGameState } from "@/types/pub-game";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), replace: vi.fn() }) }));

const CODE = "K7M2QX";
const AT = "2026-10-14T18:00:00.000Z";
const MEDIA_ID = `games/${CODE}/id1.jpg`;
const texts = pubGameTexts.en;
const route = pubGameDefinition.route.flatMap((group) => group.cafeIds);
const task = texts.cafes["pubs-de-kat"].tasks["pubs-de-kat-tap"];

beforeEach(() => {
  window.localStorage.setItem(`hidden-antwerp:pub-intro:${CODE}`, "seen");
  // jsdom has no object URLs (the preview of the chosen photo).
  URL.createObjectURL = vi.fn(() => "blob:preview");
  URL.revokeObjectURL = vi.fn();
});

function apply(state: PubGameState, actorId: string, action: PubGameAction): PubGameState {
  const result = applyPubGameAction(pubGameDefinition, pubGameAnswerKey, state, actorId, action);
  if (!result.ok) throw new Error(`${action.type}: ${result.error}`);
  return result.state;
}

/** Red (Host, Bea) at De Kat's bonus step; Blue (Dirk) elsewhere. */
function atDeKatBonus(): PubGameState {
  let state = createPubGame({
    teams: [
      { id: "t1", name: "Red" },
      { id: "t2", name: "Blue" },
    ],
    playersPerTeam: 4,
    host: { id: "h", name: "Host", teamId: "t1" },
  });
  state = apply(state, "b", { type: "JOIN", playerId: "b", name: "Bea", teamId: "t1" });
  state = apply(state, "d", { type: "JOIN", playerId: "d", name: "Dirk", teamId: "t2" });
  state = apply(state, "h", { type: "START_GAME", routes: { t1: route, t2: route }, at: AT });
  state.teams[0].cafeIndex = route.indexOf("pubs-de-kat");
  state.teams[0].step = "bonus";
  return state;
}

/** A fake server: /media answers the media id, /actions the queued states, /reveal nothing yet. */
function fakeServer(playerId: string, ...afterActions: PubGameState[]) {
  const queue = [...afterActions];
  let version = 10;
  const mock = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(async (url) => {
    let body: unknown = { changed: false, version };
    if (url.includes("/media?")) body = { mediaId: MEDIA_ID };
    else if (url.includes("/reveal")) body = { explanations: {}, funFact: null };
    else if (url.includes("/actions")) {
      const next = queue.shift();
      if (next) body = { version: ++version, view: toPlayerView(pubGameDefinition, next, playerId), events: [] };
    }
    return new Response(JSON.stringify(body), { status: 200 });
  });
  vi.stubGlobal("fetch", mock);
  return mock;
}
const sent = (mock: ReturnType<typeof fakeServer>, path: string) =>
  mock.mock.calls.filter(([url]) => url.includes(path)).map(([url, init]) => ({ url, init }));

function show(state: PubGameState, playerId: string) {
  render(
    <PubGame texts={texts} code={CODE} invite={null} initialView={toPlayerView(pubGameDefinition, state, playerId)} initialVersion={10} />,
  );
  toBonus();
}

/** Past Beery's bonus popup. (A phone that opens the game at the bonus goes straight there.) */
function toBonus() {
  fireEvent.click(screen.getByRole("button", { name: t("pubgame.beery.letsGo") }));
}

describe("sending evidence", () => {
  test("choose a photo → preview → who took part → sent → waiting for the host", async () => {
    const state = atDeKatBonus();
    const afterSubmit = apply(state, "b", {
      type: "SUBMIT_EVIDENCE",
      submissionId: "s1",
      taskId: "pubs-de-kat-tap",
      mediaId: MEDIA_ID,
      participantIds: ["b"],
      at: AT,
    });
    // Stay on the bonus screen to see the status (the team would move on to the fun fact).
    afterSubmit.teams[0].step = "bonus";
    const fetchMock = fakeServer("b", afterSubmit);
    show(state, "b");

    expect(screen.getByRole("heading", { name: task.title })).toBeTruthy();
    const photo = new File([new Uint8Array([1, 2, 3])], "tap.jpg", { type: "image/jpeg" });
    fireEvent.change(screen.getByLabelText(t("pubgame.evidence.takePhoto")), { target: { files: [photo] } });
    expect(screen.getByRole("img", { name: t("pubgame.evidence.previewPhoto") }).getAttribute("src")).toBe("blob:preview");

    // Both teammates are ticked; untick the host.
    const who = screen.getByRole("group", { name: t("pubgame.evidence.whoTookPart") });
    fireEvent.click(within(who).getByRole("checkbox", { name: "Host" }));
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.evidence.send") }));

    expect(await screen.findByText(t("pubgame.evidence.pending"))).toBeTruthy();
    const [upload] = sent(fetchMock, "/media?");
    expect(upload.url).toBe(`/api/games/${CODE}/media?task=pubs-de-kat-tap`);
    expect(upload.init?.body).toBe(photo);
    const [action] = sent(fetchMock, "/actions");
    expect(JSON.parse(String(action.init?.body)).action).toEqual({
      type: "SUBMIT_EVIDENCE",
      taskId: "pubs-de-kat-tap",
      mediaId: MEDIA_ID,
      participantIds: ["b"],
    });
  });

  test("a wrong file type is refused at once, before any upload", async () => {
    const fetchMock = fakeServer("b");
    show(atDeKatBonus(), "b");
    const document = new File(["<html>"], "page.html", { type: "text/html" });
    fireEvent.change(screen.getByLabelText(t("pubgame.evidence.takePhoto")), { target: { files: [document] } });
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.evidence.send") }));
    expect(await screen.findByText(t("pubgame.errors.invalidMedia"))).toBeTruthy();
    expect(sent(fetchMock, "/media?")).toEqual([]);
  });

  test("approved shows the points; rejected shows the reason and allows a new photo", () => {
    let state = atDeKatBonus();
    state = apply(state, "b", { type: "SUBMIT_EVIDENCE", submissionId: "s1", taskId: "pubs-de-kat-tap", mediaId: MEDIA_ID, participantIds: ["b"], at: AT });
    state = apply(state, "h", { type: "REVIEW_EVIDENCE", submissionId: "s1", approve: false, reason: "Nobody is tapping" });
    state.teams[0].step = "bonus";
    fakeServer("b");
    const { unmount } = render(
      <PubGame texts={texts} code={CODE} invite={null} initialView={toPlayerView(pubGameDefinition, state, "b")} initialVersion={10} />,
    );
    toBonus();
    expect(screen.getByText(new RegExp(t("pubgame.evidence.rejectedReason", { reason: "Nobody is tapping" })))).toBeTruthy();
    expect(screen.getByLabelText(t("pubgame.evidence.takePhoto"))).toBeTruthy();
    unmount();

    state = apply(state, "b", { type: "SUBMIT_EVIDENCE", submissionId: "s2", taskId: "pubs-de-kat-tap", mediaId: MEDIA_ID, participantIds: ["b"], at: AT });
    state = apply(state, "h", { type: "REVIEW_EVIDENCE", submissionId: "s2", approve: true });
    state.teams[0].step = "bonus";
    render(<PubGame texts={texts} code={CODE} invite={null} initialView={toPlayerView(pubGameDefinition, state, "b")} initialVersion={10} />);
    toBonus();
    expect(screen.getByText(t.plural("pubgame.evidence.approved", 200))).toBeTruthy();
    expect(screen.queryByLabelText(t("pubgame.evidence.takePhoto"))).toBeNull();
  });
});

describe("the host's review", () => {
  test("the host sees the photo from our own route and approves or rejects with a reason", async () => {
    let state = atDeKatBonus();
    state = apply(state, "b", { type: "SUBMIT_EVIDENCE", submissionId: "s1", taskId: "pubs-de-kat-tap", mediaId: MEDIA_ID, participantIds: ["b", "h"], at: AT });
    const fetchMock = fakeServer("h", apply(state, "h", { type: "REVIEW_EVIDENCE", submissionId: "s1", approve: false, reason: "Blurry" }));
    render(<HostDashboard texts={texts} code={CODE} initialView={toPlayerView(pubGameDefinition, state, "h")} initialVersion={10} />);

    expect(screen.getByText(t.plural("pubgame.host.pendingEvidence", 1))).toBeTruthy();
    const label = t("pubgame.host.mediaLabel", { team: "Red", task: task.title });
    expect(screen.getByRole("img", { name: label }).getAttribute("src")).toBe(
      `/api/games/${CODE}/media/file?id=${encodeURIComponent(MEDIA_ID)}`,
    );
    expect(screen.getByText(t("pubgame.host.tookPart", { names: "Bea, Host" }))).toBeTruthy();

    fireEvent.change(screen.getByLabelText(t("pubgame.host.rejectReason")), { target: { value: "Blurry" } });
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.host.reject") }));
    await waitFor(() => expect(screen.queryByRole("img", { name: label })).toBeNull());
    expect(JSON.parse(String(sent(fetchMock, "/actions")[0].init?.body)).action).toEqual({
      type: "REVIEW_EVIDENCE",
      submissionId: "s1",
      approve: false,
      reason: "Blurry",
    });
  });
});
