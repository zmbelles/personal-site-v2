/* global globalThis */
import { METERS_PER_MILE } from "../geo.js";

// Public instances are often overloaded and reject most requests at busy
// times, so queries rotate through them and retry until a time budget runs out.
// The ones that fail fast go first; overpass-api.de tends to hang instead.
const ENDPOINTS = [
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];
const QUICK = { budgetMs: 15000, tryMs: 8000 };
const WIDE = { budgetMs: 45000, tryMs: 15000 };
const RETRY_DELAY_MS = 300;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function addressOf(tags) {
  const street = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
  return [street, tags["addr:city"]].filter(Boolean).join(", ");
}

/** Station locations from OpenStreetMap (Overpass API). OSM has no prices. */
export function createOverpassProvider({ fetchImpl = globalThis.fetch, endpoints = ENDPOINTS } = {}) {
  // Index of the endpoint that last answered; it's tried first next time.
  let preferred = 0;

  async function query(text, { budgetMs, tryMs }) {
    const started = Date.now();
    let lastError = new Error("OpenStreetMap station lookup timed out");
    for (let attempt = 0; Date.now() - started < budgetMs; attempt++) {
      const index = (preferred + attempt) % endpoints.length;
      const abort = new AbortController();
      const timer = setTimeout(() => abort.abort(), Math.min(tryMs, budgetMs - (Date.now() - started)));
      try {
        const res = await fetchImpl(endpoints[index], {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: "data=" + encodeURIComponent(text),
          signal: abort.signal,
        });
        if (res.ok) {
          const json = await res.json();
          preferred = index;
          return json;
        }
        lastError = new Error(`OpenStreetMap station lookup failed (${res.status})`);
      } catch (err) {
        lastError = err;
      } finally {
        clearTimeout(timer);
      }
      await sleep(RETRY_DELAY_MS);
    }
    throw lastError;
  }

  return {
    id: "openstreetmap",
    hasPrices: false,

    findStations(origin, radiusMiles) {
      return radiusMiles > 10 ? search([origin], radiusMiles, 1500, WIDE) : search([origin], radiusMiles, 300, QUICK);
    },

    findStationsAlongRoute(origin, destination, corridorMiles) {
      return search([origin, destination], corridorMiles, 400, QUICK);
    },
  };

  // `around` with one point searches a circle; with two, a corridor along the line.
  async function search(points, radiusMiles, limit, timing) {
    const r = Math.round(radiusMiles * METERS_PER_MILE);
    const at = points.map((p) => `${p.lat},${p.lng}`).join(",");
    const json = await query(`[out:json][timeout:25];
      (node["amenity"="fuel"](around:${r},${at});
       way["amenity"="fuel"](around:${r},${at}););
      out center tags ${limit};`, timing);

    return json.elements
      .map((el) => {
        const tags = el.tags || {};
        const point = el.center || el;
        return {
          id: `osm:${el.type}/${el.id}`,
          name: tags.name || tags.brand || "Gas station",
          brand: tags.brand || "",
          address: addressOf(tags),
          lat: point.lat,
          lng: point.lon,
          prices: {},
          source: "openstreetmap",
        };
      })
      .filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lng));
  }
}
