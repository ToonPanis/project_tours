import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, describe, expect, test } from "vitest";
import { MAP_WORKER_URL } from "@/features/navigation/config";
import { copyMaplibreWorker, WORKER_FILES } from "../../scripts/lib/maplibre-worker.mjs";

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

describe("copy-maplibre-worker script", () => {
  // Each test copies into its own temporary folder, never into the real public/maplibre/.
  const tempDirs: string[] = [];
  const makeTempDir = () => {
    const dir = mkdtempSync(join(tmpdir(), "maplibre-worker-test-"));
    tempDirs.push(dir);
    return dir;
  };
  const dirUrl = (dir: string) => pathToFileURL(`${dir}/`);

  afterEach(() => {
    for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
  });

  test("copies both worker files from the installed library", async () => {
    const target = makeTempDir();
    await copyMaplibreWorker(dirUrl(join(process.cwd(), "node_modules/maplibre-gl/dist")), dirUrl(target));
    for (const file of WORKER_FILES) expect(existsSync(join(target, file))).toBe(true);
  });

  test("fails with a clear, actionable message when the worker files are missing", async () => {
    const emptySource = makeTempDir();
    await expect(copyMaplibreWorker(dirUrl(emptySource), dirUrl(makeTempDir()))).rejects.toThrow(
      /MapLibre worker file "maplibre-gl-worker\.mjs" was not found.*npm install/,
    );
  });

  test("copies nothing when only some worker files exist (no half-copied worker)", async () => {
    const source = makeTempDir();
    const target = makeTempDir();
    writeFileSync(join(source, WORKER_FILES[0]), "// worker");
    await expect(copyMaplibreWorker(dirUrl(source), dirUrl(target))).rejects.toThrow(WORKER_FILES[1]);
    for (const file of WORKER_FILES) expect(existsSync(join(target, file))).toBe(false);
  });

  /**
   * Runs the real command (`node scripts/copy-maplibre-worker.mjs`) in a throwaway copy of the
   * project layout, started through a junction/symlink: npm runs it this way when the checkout
   * lives behind a linked folder. The command must still copy (or fail loudly), never skip silently.
   */
  function runCommandThroughLink(withWorkerFiles: boolean) {
    const root = makeTempDir();
    cpSync(join(process.cwd(), "scripts/copy-maplibre-worker.mjs"), join(root, "scripts/copy-maplibre-worker.mjs"));
    cpSync(join(process.cwd(), "scripts/lib"), join(root, "scripts/lib"), { recursive: true });
    const dist = join(root, "node_modules/maplibre-gl/dist");
    mkdirSync(dist, { recursive: true });
    if (withWorkerFiles) for (const file of WORKER_FILES) writeFileSync(join(dist, file), `// ${file}`);

    const link = join(makeTempDir(), "linked-project");
    symlinkSync(root, link, "junction"); // "junction" needs no admin rights on Windows; ignored on Linux/macOS
    const result = spawnSync(process.execPath, [join(link, "scripts/copy-maplibre-worker.mjs")], {
      encoding: "utf8",
      timeout: 15_000,
    });
    rmSync(link, { force: true, recursive: false }); // remove only the link, not the folder it points to
    expect(result.error).toBeUndefined(); // e.g. the process hung and was killed by the timeout
    return { result, publicDir: join(root, "public/maplibre") };
  }

  test("the command copies the worker when started through a linked folder", () => {
    const { result, publicDir } = runCommandThroughLink(true);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Copied MapLibre worker");
    for (const file of WORKER_FILES) expect(existsSync(join(publicDir, file))).toBe(true);
  });

  test("the command exits with code 1 and explains the problem when the worker is missing", () => {
    const { result, publicDir } = runCommandThroughLink(false);
    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/MapLibre worker file "maplibre-gl-worker\.mjs" was not found.*npm install/);
    expect(existsSync(join(publicDir, WORKER_FILES[0]))).toBe(false);
  });
});
