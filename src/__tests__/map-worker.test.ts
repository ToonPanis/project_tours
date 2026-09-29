import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { MAP_WORKER_URL } from "@/features/navigation/config";

/**
 * The map stays empty when MapLibre can't start its web worker. The worker is
 * copied into /public by scripts/copy-maplibre-worker.mjs (npm postinstall,
 * predev, prebuild). These tests catch a missing or outdated copy.
 */
describe("MapLibre worker", () => {
  const publicFile = (url: string) => join(process.cwd(), "public", url);
  const installedVersion: string = JSON.parse(
    readFileSync(join(process.cwd(), "node_modules/maplibre-gl/package.json"), "utf8"),
  ).version;

  test("the worker and the shared module it imports are served from /public", () => {
    expect(existsSync(publicFile(MAP_WORKER_URL))).toBe(true);
    const worker = readFileSync(publicFile(MAP_WORKER_URL), "utf8");
    expect(worker).toContain('from"./maplibre-gl-shared.mjs"');
    expect(existsSync(publicFile(MAP_WORKER_URL.replace("maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs")))).toBe(true);
  });

  test("the served worker is the same version as the installed library", () => {
    const worker = readFileSync(publicFile(MAP_WORKER_URL), "utf8");
    expect(worker).toContain(`v${installedVersion}`);
  });
});
