/**
 * Generates the walking routes between consecutive stops of a walk.
 *
 *   node scripts/generate-walking-routes.mjs classics-of-antwerp
 *   node scripts/generate-walking-routes.mjs hidden-pubs/game
 *
 * Run it once after changing coordinates.json. Locations marked
 * `"optional": true` (detours) also get a bypass leg, from the stop before
 * the detour straight to the stop after it, for walkers who skip it. It asks the free OpenStreetMap
 * walking router run by FOSSGIS (OSRM, foot profile) for one route per leg and
 * saves the result to routes.json, which the app reads. Players never call
 * the router themselves, so the game needs no routing service or API key.
 *
 *
 * A folder with a route-groups.json (Hidden Pubs 2.0: a random café order per
 * team) gets a leg for every pair of cafés that can follow each other instead
 * (the rule of requiredLegs() in src/features/pub-game/logic/route.ts). Cafés
 * without coordinates yet are skipped with a warning; their navigation shows
 * the address without a map until they have a position.
 *
 * Usage policy of the router: max. 1 request per second, no heavy use,
 * a valid User-Agent. See https://routing.openstreetmap.de/about.html
 */
import { readFile, writeFile } from "node:fs/promises";
import { fetchWithRetry, readWalkFolderArg, USER_AGENT_CONTACT } from "./lib/script-utils.mjs";

const walk = readWalkFolderArg(process.argv[2], "node scripts/generate-walking-routes.mjs <walk-folder>");
const DATA_DIR = new URL(`../src/data/walks/${walk}/`, import.meta.url);
const ROUTER_URL = "https://routing.openstreetmap.de/routed-foot/route/v1/foot";
const USER_AGENT = `HiddenAntwerp-route-generator/0.1 (${USER_AGENT_CONTACT})`;

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchWalkingRoute(from, to) {
  const url =
    `${ROUTER_URL}/${from.longitude},${from.latitude};${to.longitude},${to.latitude}` +
    "?overview=full&geometries=geojson&steps=true";
  // Retries temporary errors (busy router, network); a timeout never hangs the script.
  const response = await fetchWithRetry(url, { headers: { "User-Agent": USER_AGENT } });

  const data = await response.json();
  if (data.code !== "Ok" || !data.routes?.[0]) throw new Error(`No route for ${from.name} → ${to.name}`);

  // Keep only what the app needs (the app normalizes it into its own format).
  const route = data.routes[0];
  return {
    distance: route.distance,
    duration: route.duration,
    geometry: route.geometry.coordinates,
    steps: route.legs[0].steps.map((step) => ({
      distance: step.distance,
      name: step.name,
      type: step.maneuver.type,
      modifier: step.maneuver.modifier ?? null,
      location: step.maneuver.location,
    })),
  };
}

const { locations } = JSON.parse(await readFile(new URL("coordinates.json", DATA_DIR), "utf8"));
const routeGroups = await readFile(new URL("route-groups.json", DATA_DIR), "utf8")
  .then((text) => JSON.parse(text).groups)
  .catch(() => null);

/** The same rule as requiredLegs() in src/features/pub-game/logic/route.ts. */
function requiredLegs(groups) {
  const result = [];
  groups.forEach((group, index) => {
    const ids = group.cafeIds;
    if (group.shuffle) {
      for (const from of ids) for (const to of ids) if (from !== to) result.push([from, to]);
    } else {
      for (let i = 0; i < ids.length - 1; i++) result.push([ids[i], ids[i + 1]]);
    }
    const next = groups[index + 1];
    if (!next) return;
    const lasts = group.shuffle ? ids : ids.slice(-1);
    const firsts = next.shuffle ? next.cafeIds : next.cafeIds.slice(0, 1);
    for (const from of lasts) for (const to of firsts) result.push([from, to]);
  });
  return result;
}

const hasPosition = (location) => Number.isFinite(location?.latitude) && Number.isFinite(location?.longitude);
const legs = [];
const pairs = [];

if (routeGroups) {
  // Random order: every pair that can follow each other. Cafés without a position are skipped.
  const byId = new Map(locations.map((location) => [location.id, location]));
  const skipped = new Set();
  for (const [fromId, toId] of requiredLegs(routeGroups)) {
    const from = byId.get(fromId);
    const to = byId.get(toId);
    if (hasPosition(from) && hasPosition(to)) pairs.push([from, to]);
    else for (const id of [fromId, toId]) if (!hasPosition(byId.get(id))) skipped.add(id);
  }
  if (skipped.size > 0) console.warn(`! No position yet for ${[...skipped].join(", ")}: their legs are skipped.`);
} else {
  // A stop without coordinates can't be routed: fail clearly instead of asking the router for "null,null".
  const missing = locations.filter((location) => !hasPosition(location));
  if (missing.length > 0) {
    throw new Error(`No coordinates yet for: ${missing.map((location) => location.id).join(", ")}. Add them to coordinates.json first.`);
  }
  // Every consecutive pair, plus a bypass around each optional stop.
  for (let index = 0; index < locations.length - 1; index++) {
    pairs.push([locations[index], locations[index + 1]]);
    const next = locations[index + 1];
    if (next.optional && index + 2 < locations.length) {
      const lastMainStop = locations.slice(0, index + 1).reverse().find((location) => !location.optional);
      const afterDetour = locations.slice(index + 2).find((location) => !location.optional);
      if (lastMainStop && afterDetour) pairs.push([lastMainStop, afterDetour]);
    }
  }
}

for (const [from, to] of pairs) {
  const route = await fetchWalkingRoute(from, to);
  legs.push({ fromLocationId: from.id, toLocationId: to.id, osrm: route });
  console.log(`✓ ${from.name} → ${to.name}: ${Math.round(route.distance)} m, ${route.steps.length} steps`);
  await wait(1100); // respect the 1 request/second policy
}

const output = {
  _comment: "GENERATED by scripts/generate-walking-routes.mjs. Do not edit by hand.",
  source: "Walking routes: OSRM (foot) via routing.openstreetmap.de. Map data © OpenStreetMap contributors.",
  generatedAt: new Date().toISOString(),
  legs,
};
await writeFile(new URL("routes.json", DATA_DIR), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Saved ${legs.length} legs to src/data/walks/${walk}/routes.json`);
