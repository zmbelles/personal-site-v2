/* global globalThis */
import { haversineMiles, METERS_PER_MILE, pointsAlong } from "../geo.js";

const ENDPOINT = "https://places.googleapis.com/v1/places:searchNearby";
const MAX_RADIUS_METERS = 50000;
// Each search is billed, so this caps the searches per trip.
const MAX_ROUTE_SEARCHES = 6;

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.shortFormattedAddress",
  "places.location",
  "places.fuelOptions",
].join(",");

const GRADE_FOR = {
  REGULAR_UNLEADED: "regular",
  MIDGRADE: "midgrade",
  PREMIUM: "premium",
  DIESEL: "diesel",
};

const money = ({ units = "0", nanos = 0 } = {}) => Number(units) + nanos / 1e9;

/**
 * Stations with posted prices from the Google Places API (New). The key ships
 * to the client, so restrict it to the site's referrers (or the app's bundle ID).
 * Each search returns at most the 20 nearest stations.
 */
export function createGooglePlacesProvider({ apiKey, fetchImpl = globalThis.fetch }) {
  async function nearby({ lat, lng }, radiusMiles) {
    const res = await fetchImpl(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({
        includedTypes: ["gas_station"],
        maxResultCount: 20,
        rankPreference: "DISTANCE",
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: Math.min(radiusMiles * METERS_PER_MILE, MAX_RADIUS_METERS),
          },
        },
      }),
    });
    if (!res.ok) throw new Error(`Google Places lookup failed (${res.status})`);
    const json = await res.json();
    return (json.places || []).map(toStation);
  }

  return {
    id: "google",
    hasPrices: true,

    findStations: nearby,

    /** Nearby searches spaced along the straight line from origin to destination. */
    async findStationsAlongRoute(origin, destination, corridorMiles) {
      const length = haversineMiles(origin, destination);
      const count = Math.min(Math.max(Math.ceil(length / (corridorMiles * 2)) + 1, 2), MAX_ROUTE_SEARCHES);
      // Overlap neighbouring circles slightly so the line has no gaps.
      const radius = Math.max(corridorMiles, (length / (count - 1) / 2) * 1.15);
      const batches = await Promise.all(pointsAlong(origin, destination, count).map((p) => nearby(p, radius)));
      const byId = new Map(batches.flat().map((st) => [st.id, st]));
      return [...byId.values()];
    },
  };
}

function toStation(p) {
  const prices = {};
  for (const fp of p.fuelOptions?.fuelPrices || []) {
    const grade = GRADE_FOR[fp.type];
    if (grade) prices[grade] = { price: money(fp.price), updatedAt: fp.updateTime || null };
  }
  return {
    id: `google:${p.id}`,
    name: p.displayName?.text || "Gas station",
    brand: "",
    address: p.shortFormattedAddress || "",
    lat: p.location.latitude,
    lng: p.location.longitude,
    prices,
    source: "google",
  };
}
