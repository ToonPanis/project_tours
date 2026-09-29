import { describe, expect, test } from "vitest";
import { classicsOfAntwerpWalk } from "@/data/walks/classics-of-antwerp";
import { hiddenPubsWalk } from "@/data/walks/hidden-pubs";
import { poortjesWalk } from "@/data/walks/poortjes-van-antwerpen";
import { validateWalk } from "@/lib/validate-walk";
import type { Walk } from "@/types/walk";

// M-16: the mistakes a 4th walk (or data from a future CMS) could make are caught
// in a test, not on the street. Each case breaks one rule of a real walk.
describe("validateWalk catches structural mistakes", () => {
  test("the real walks are valid", () => {
    for (const walk of [poortjesWalk, hiddenPubsWalk, classicsOfAntwerpWalk]) expect(validateWalk(walk)).toEqual([]);
  });

  test("a guide stop without its stop page", () => {
    const broken: Walk = {
      ...classicsOfAntwerpWalk,
      locations: classicsOfAntwerpWalk.locations.map((stop, index) => (index === 2 ? { ...stop, guide: undefined } : stop)),
    };
    expect(validateWalk(broken).join()).toMatch(/needs guide content/);
  });

  test("a guide stop with a game challenge (the guide player can't finish it)", () => {
    const broken: Walk = {
      ...classicsOfAntwerpWalk,
      locations: classicsOfAntwerpWalk.locations.map((stop, index) =>
        index === 1 ? { ...stop, challenge: hiddenPubsWalk.locations[0].challenge } : stop,
      ),
    };
    expect(validateWalk(broken).join()).toMatch(/can't have a challenge/);
  });

  test("a number answer that isn't a whole number (typed numbers are read with thousands separators)", () => {
    const broken: Walk = {
      ...hiddenPubsWalk,
      locations: hiddenPubsWalk.locations.map((stop, index) =>
        index === 0
          ? { ...stop, challenge: { id: "c", type: "number-answer", title: "", question: "", hints: [], correctNumber: 1.5 } }
          : stop,
      ),
    };
    expect(validateWalk(broken).join()).toMatch(/must be a whole number \(1\.5\)/);
  });

  test("a missing walking route between two stops", () => {
    const broken: Walk = { ...hiddenPubsWalk, routeLegs: hiddenPubsWalk.routeLegs!.slice(1) };
    expect(validateWalk(broken).join()).toMatch(/no walking route pubs-rococo → pubs-den-engel/);
  });

  test("a missing bypass around an optional stop", () => {
    const optional = poortjesWalk.locations.find((stop) => stop.isBonus && stop.id === "poortjes-rodestraat")!;
    const bypassFree = poortjesWalk.routeLegs!.filter(
      (leg) => !(leg.toLocationId !== optional.id && leg.fromLocationId !== optional.id && isBypassAround(leg)),
    );
    function isBypassAround(leg: { fromLocationId: string; toLocationId: string }) {
      const order = (id: string) => poortjesWalk.locations.find((stop) => stop.id === id)!.order;
      return order(leg.fromLocationId) < optional.order && order(leg.toLocationId) > optional.order;
    }
    expect(validateWalk({ ...poortjesWalk, routeLegs: bypassFree }).join()).toMatch(/no bypass route .* around optional poortjes-rodestraat/);
  });

  test("a clue or chapter pointing at a stop that doesn't exist", () => {
    const brokenClue: Walk = {
      ...hiddenPubsWalk,
      clues: [...hiddenPubsWalk.clues!, { ...hiddenPubsWalk.clues![0], id: "x", sourceLocationId: "nowhere" }],
    };
    expect(validateWalk(brokenClue).join()).toMatch(/clue x comes from unknown stop/);

    const brokenChapter: Walk = {
      ...poortjesWalk,
      chapters: [...poortjesWalk.chapters!, { ...poortjesWalk.chapters![0], id: "y", firstLocationId: "nowhere" }],
    };
    expect(validateWalk(brokenChapter).join()).toMatch(/chapter y starts at unknown stop/);
  });
});
