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

  test("a missing walking route between two stops", () => {
    const [firstLeg, ...otherLegs] = classicsOfAntwerpWalk.routeLegs!;
    const broken: Walk = { ...classicsOfAntwerpWalk, routeLegs: otherLegs };
    expect(validateWalk(broken)).toContain(`no walking route ${firstLeg.fromLocationId} → ${firstLeg.toLocationId}`);
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

  test("a chapter pointing at a stop that doesn't exist", () => {
    const brokenChapter: Walk = {
      ...poortjesWalk,
      chapters: [...poortjesWalk.chapters!, { ...poortjesWalk.chapters![0], id: "y", firstLocationId: "nowhere" }],
    };
    expect(validateWalk(brokenChapter).join()).toMatch(/chapter y starts at unknown stop/);
  });
});
