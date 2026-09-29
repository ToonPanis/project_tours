import { describe, expect, test } from "vitest";
import { hiddenPubsWalk } from "@/data/walks/hidden-pubs";
import { the17GatesWalk } from "@/data/walks/the-17-gates";
import { getOrderedLocations } from "@/features/walk-session/logic/route";
import { distanceInMeters } from "@/lib/geo";

describe("Hidden Pubs navigation data", () => {
  const locations = getOrderedLocations(hiddenPubsWalk);

  test("every café has (draft) coordinates, marked for verification until checked", () => {
    for (const location of locations) {
      expect(location.coordinates).not.toBeNull();
      expect(location.coordinatesStatus).toBeDefined();
    }
  });

  test("every café is in Antwerp's old town (catches a wrong geocoding match)", () => {
    for (const location of locations) {
      expect(location.coordinates!.latitude).toBeGreaterThan(51.2);
      expect(location.coordinates!.latitude).toBeLessThan(51.23);
      expect(location.coordinates!.longitude).toBeGreaterThan(4.39);
      expect(location.coordinates!.longitude).toBeLessThan(4.42);
    }
  });

  test("there is a walking route for every leg (café 1→2 … 7→8)", () => {
    const legs = hiddenPubsWalk.routeLegs ?? [];
    expect(legs).toHaveLength(locations.length - 1);
    locations.slice(1).forEach((location, index) => {
      const leg = legs.find((candidate) => candidate.toLocationId === location.id);
      expect(leg?.fromLocationId).toBe(locations[index].id);
    });
  });

  test("each route starts near its start café and ends near its destination", () => {
    for (const leg of hiddenPubsWalk.routeLegs ?? []) {
      const from = locations.find((location) => location.id === leg.fromLocationId)!.coordinates!;
      const to = locations.find((location) => location.id === leg.toLocationId)!.coordinates!;
      expect(distanceInMeters(leg.route.geometry[0], from)).toBeLessThan(60);
      expect(distanceInMeters(leg.route.geometry.at(-1)!, to)).toBeLessThan(60);
      expect(leg.route.steps.at(-1)?.maneuver).toBe("arrive");
    }
  });
});

describe("The 17 Gates placeholder (no longer a listed walk; kept as a test fixture)", () => {
  test("has no invented coordinates", () => {
    for (const location of the17GatesWalk.locations) {
      expect(location.coordinates).toBeNull();
    }
  });
});
