/* global globalThis */
const ENDPOINT = "https://nominatim.openstreetmap.org/search";

/** Address and place-name geocoding via OpenStreetMap's Nominatim. */
export function createNominatimGeocoder({ fetchImpl = globalThis.fetch, countryCodes = "us" } = {}) {
  return {
    async geocode(text) {
      const params = new URLSearchParams({
        q: text,
        format: "jsonv2",
        limit: "1",
        countrycodes: countryCodes,
      });
      const res = await fetchImpl(`${ENDPOINT}?${params}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Location search failed (${res.status})`);
      const [hit] = await res.json();
      if (!hit) return null;
      // "60540, Naperville, Naperville Township, DuPage County, ..." -> "60540, Naperville"
      const label = hit.display_name.split(", ").slice(0, 2).join(", ");
      return { lat: Number(hit.lat), lng: Number(hit.lon), label };
    },
  };
}
