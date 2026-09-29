import { describe, expect, test } from "vitest";
import { CAMERA_MIN_MOVE_METERS, shouldMoveCamera, type CameraMode, type CameraTarget } from "@/features/navigation/logic/camera";
import { bearingInDegrees, circleAround, distanceInMeters } from "@/lib/geo";

const grooteMarkt = { latitude: 51.2211, longitude: 4.3997 };
/** A point `meters` north of Grote Markt (1° latitude ≈ 111 km). */
const north = (meters: number) => ({ latitude: grooteMarkt.latitude + meters / 111_195, longitude: grooteMarkt.longitude });
const target = (position = grooteMarkt, bearing = 0, mode: CameraMode = "follow-direction"): CameraTarget => ({ position, bearing, mode });

// M-06: the camera must not re-animate for every bit of GPS noise (battery, jitter).
describe("shouldMoveCamera", () => {
  test("the first time, it always moves", () => {
    expect(shouldMoveCamera(null, target())).toBe(true);
  });

  test("GPS noise of a metre or two doesn't move the camera", () => {
    expect(shouldMoveCamera(target(), target(north(2)))).toBe(false);
  });

  test(`moving ${CAMERA_MIN_MOVE_METERS} m or more does`, () => {
    expect(shouldMoveCamera(target(), target(north(CAMERA_MIN_MOVE_METERS + 1)))).toBe(true);
  });

  test("turning 10° or more does, also across north (355° → 5°)", () => {
    expect(shouldMoveCamera(target(grooteMarkt, 90), target(grooteMarkt, 95))).toBe(false);
    expect(shouldMoveCamera(target(grooteMarkt, 90), target(grooteMarkt, 101))).toBe(true);
    expect(shouldMoveCamera(target(grooteMarkt, 355), target(grooteMarkt, 5))).toBe(true);
    expect(shouldMoveCamera(target(grooteMarkt, 358), target(grooteMarkt, 2))).toBe(false);
  });

  test("switching between overview and close-up always moves", () => {
    expect(shouldMoveCamera(target(grooteMarkt, 0, "overview"), target(grooteMarkt, 0, "follow-direction"))).toBe(true);
  });

  test("tapping north-up always moves, even from a small angle (7° → 0°)", () => {
    expect(shouldMoveCamera(target(grooteMarkt, 7, "follow-direction"), target(grooteMarkt, 0, "north-up"))).toBe(true);
  });
});

describe("geo helpers", () => {
  test.each([
    ["north", { latitude: 51.23, longitude: 4.3997 }, 0],
    ["east", { latitude: 51.2211, longitude: 4.41 }, 90],
    ["south", { latitude: 51.21, longitude: 4.3997 }, 180],
    ["west", { latitude: 51.2211, longitude: 4.39 }, 270],
  ])("bearingInDegrees: due %s", (_name, to, expected) => {
    expect(bearingInDegrees(grooteMarkt, to)).toBeCloseTo(expected, 0);
  });

  test("circleAround: a closed ring at the given radius", () => {
    const ring = circleAround(grooteMarkt, 30);
    expect(ring[0]).toEqual(ring.at(-1));
    for (const point of ring) expect(distanceInMeters(grooteMarkt, point)).toBeCloseTo(30, 0);
  });
});
