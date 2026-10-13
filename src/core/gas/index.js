/**
 * Gas finder logic. No Vue, DOM or browser storage, so a mobile app can reuse
 * it as-is; network calls go through an injectable `fetch`. Each platform
 * supplies its own location, storage and UI (web: src/components/tools/gas/).
 */
import { haversineMiles } from "./geo.js";
import { createOverpassProvider } from "./providers/overpass.js";
import { createGooglePlacesProvider } from "./providers/googlePlaces.js";

export * from "./geo.js";
export * from "./planner.js";
export * from "./vehicles.js";
export { createOverpassProvider, createGooglePlacesProvider };
export { createNominatimGeocoder } from "./providers/nominatim.js";
export { createZipLookup, createPlaceSearch } from "./providers/zips.js";
export { createOsrmRouter, createGoogleRouter, createRouter, measureRoads } from "./providers/routing.js";

// Listings closer than this are treated as the same station.
const SAME_STATION_MILES = 0.05;
// Wide searches show stations within this radius first, then fill in the rest.
const QUICK_RADIUS_MILES = 5;

// Same id means a repeat from a later stage; otherwise only listings from a
// different source can be the same station under another id.
function mergeStations(lists) {
  const merged = [];
  const ids = new Set();
  for (const list of lists) {
    for (const station of list) {
      if (ids.has(station.id)) continue;
      const dupe = merged.some(
        (s) => s.source !== station.source && haversineMiles(s, station) < SAME_STATION_MILES
      );
      if (dupe) continue;
      ids.add(station.id);
      merged.push(station);
    }
  }
  return merged;
}

/**
 * Queries every provider and merges the results. Google's priced listings take
 * precedence over OpenStreetMap duplicates; one provider failing is fine as
 * long as another succeeds. Both searches accept `onPartial`, called with the
 * merged stations so far each time a provider answers, so results can show
 * before the slower providers finish.
 *
 * @param {object} [opts]
 * @param {string} [opts.googleApiKey]  enables posted prices when set
 * @param {Function} [opts.fetchImpl]
 */
export function createStationSearch({ googleApiKey, fetchImpl } = {}) {
  const providers = [
    googleApiKey && createGooglePlacesProvider({ apiKey: googleApiKey, fetchImpl }),
    createOverpassProvider({ fetchImpl }),
  ].filter(Boolean);

  // Each stage is a list of [provider, call] pairs run in parallel; stages run in order.
  async function gather(stages, onPartial) {
    const batches = [];
    let lastError;
    const merged = () =>
      mergeStations([...batches].sort((a, b) => b.priced - a.priced).map((b) => b.list));

    for (const stage of stages) {
      await Promise.all(
        stage.map(([provider, call]) =>
          call().then(
            (list) => {
              batches.push({ priced: provider.hasPrices, list });
              onPartial?.(merged());
            },
            (err) => {
              lastError = err;
            }
          )
        )
      );
    }
    if (!batches.length) throw lastError;
    return merged();
  }

  return {
    hasLivePrices: providers.some((p) => p.hasPrices),

    /**
     * Priced providers search the full radius once (they return their nearest
     * stations anyway). Free ones search QUICK_RADIUS_MILES first, then the full
     * radius, so nearby stations show while the wide search is still running.
     */
    findStations(origin, radiusMiles, { onPartial } = {}) {
      const quick = Math.min(radiusMiles, QUICK_RADIUS_MILES);
      const first = providers.map((p) => [p, () => p.findStations(origin, p.hasPrices ? radiusMiles : quick)]);
      const wide =
        radiusMiles > quick
          ? providers.filter((p) => !p.hasPrices).map((p) => [p, () => p.findStations(origin, radiusMiles)])
          : [];
      return gather([first, wide], onPartial);
    },

    /** Stations within corridorMiles of the line from origin to destination. */
    findStationsAlongRoute(origin, destination, corridorMiles, { onPartial } = {}) {
      const calls = providers.map((p) => [p, () => p.findStationsAlongRoute(origin, destination, corridorMiles)]);
      return gather([calls], onPartial);
    },
  };
}
