/* global globalThis */
import { METERS_PER_MILE } from "../geo.js";

const OSRM_ENDPOINT = "https://router.project-osrm.org";
// The public OSRM server asks for at most one request per second.
const OSRM_MIN_GAP_MS = 1000;
const GOOGLE_ENDPOINT = "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix";
const TIMEOUT_MS = 10000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithTimeout(fetchImpl, url, opts) {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), TIMEOUT_MS);
  try {
    return await fetchImpl(url, { ...opts, signal: abort.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Driving distances from the OSRM routing engine on OpenStreetMap data.
 * `table(sources, destinations)` returns road miles as matrix[source][destination],
 * null where no route exists.
 */
export function createOsrmRouter({ fetchImpl = globalThis.fetch, endpoint = OSRM_ENDPOINT } = {}) {
  let lastCall = 0;

  return {
    id: "osrm",
    maxBatch: 90,

    async table(sources, destinations) {
      const wait = lastCall + OSRM_MIN_GAP_MS - Date.now();
      if (wait > 0) await sleep(wait);
      lastCall = Date.now();

      const coords = [...sources, ...destinations].map((p) => `${p.lng.toFixed(6)},${p.lat.toFixed(6)}`).join(";");
      const src = sources.map((_, i) => i).join(";");
      const dst = destinations.map((_, i) => i + sources.length).join(";");
      const res = await fetchWithTimeout(
        fetchImpl,
        `${endpoint}/table/v1/driving/${coords}?sources=${src}&destinations=${dst}&annotations=distance`
      );
      if (!res.ok) throw new Error(`OSRM routing failed (${res.status})`);
      const json = await res.json();
      if (json.code !== "Ok") throw new Error(`OSRM routing failed (${json.code})`);
      return json.distances.map((row) => row.map((m) => (m == null ? null : m / METERS_PER_MILE)));
    },
  };
}

/** Driving distances from the Google Routes API (Compute Route Matrix). */
export function createGoogleRouter({ apiKey, fetchImpl = globalThis.fetch }) {
  const waypoint = ({ lat, lng }) => ({ waypoint: { location: { latLng: { latitude: lat, longitude: lng } } } });

  return {
    id: "google",
    maxBatch: 25,

    async table(sources, destinations) {
      const res = await fetchWithTimeout(fetchImpl, GOOGLE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "originIndex,destinationIndex,distanceMeters,condition",
        },
        body: JSON.stringify({
          origins: sources.map(waypoint),
          destinations: destinations.map(waypoint),
          travelMode: "DRIVE",
        }),
      });
      if (!res.ok) throw new Error(`Google routing failed (${res.status})`);
      const matrix = sources.map(() => destinations.map(() => null));
      for (const e of await res.json()) {
        if (e.condition === "ROUTE_EXISTS" && e.distanceMeters != null) {
          matrix[e.originIndex ?? 0][e.destinationIndex ?? 0] = e.distanceMeters / METERS_PER_MILE;
        }
      }
      return matrix;
    },
  };
}

/**
 * Tries each router in order until one answers. Requests are one-to-many or
 * many-to-one, split into batches each router can handle.
 */
export function createRouter(routers) {
  async function tableWith(router, sources, destinations) {
    const manyDestinations = sources.length === 1;
    const many = manyDestinations ? destinations : sources;
    const rows = manyDestinations ? [[]] : [];
    for (let i = 0; i < many.length; i += router.maxBatch) {
      const chunk = many.slice(i, i + router.maxBatch);
      const part = manyDestinations ? await router.table(sources, chunk) : await router.table(chunk, destinations);
      if (manyDestinations) rows[0].push(...part[0]);
      else rows.push(...part);
    }
    return rows;
  }

  return {
    async table(sources, destinations) {
      let lastError;
      for (const router of routers) {
        try {
          return await tableWith(router, sources, destinations);
        } catch (err) {
          lastError = err;
        }
      }
      throw lastError;
    },
  };
}

/**
 * Road miles for a search: the trip itself (when there's a destination) and,
 * for each station, the drive to it from the start and from it to the destination.
 */
export async function measureRoads(router, { origin, destination, stations, tripMiles }) {
  const legs = new Map();
  if (destination && tripMiles == null) tripMiles = (await router.table([origin], [destination]))[0][0];
  if (!stations.length) return { tripMiles, legs };

  const fromOrigin = (await router.table([origin], stations))[0];
  const toDestination = destination ? (await router.table(stations, [destination])).map((row) => row[0]) : [];

  stations.forEach((s, i) => {
    legs.set(s.id, { fromOrigin: fromOrigin[i], toDestination: destination ? toDestination[i] : null });
  });
  return { tripMiles, legs };
}
