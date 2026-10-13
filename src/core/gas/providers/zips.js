const ZIP = /^(\d{5})(?:-\d{4})?$/;

/**
 * ZIP code lookup against the Census table from scripts/build-zips.mjs.
 * `load` returns that JSON and is only called on the first lookup.
 */
export function createZipLookup({ load }) {
  let table = null;

  async function getTable() {
    if (!table) {
      const data = await load();
      table = new Map();
      // Rows are deltas from the previous row.
      let zip = 0;
      let lat = 0;
      let lng = 0;
      for (const row of data.zips.split(";")) {
        const [dz, dlat, dlng] = row.split(",").map(Number);
        zip += dz;
        lat += dlat;
        lng += dlng;
        table.set(String(zip).padStart(5, "0"), { lat: lat / 100, lng: lng / 100 });
      }
    }
    return table;
  }

  return {
    isZip: (text) => ZIP.test(text.trim()),

    async lookup(text) {
      const zip = text.trim().match(ZIP)?.[1];
      if (!zip) return null;
      const point = (await getTable()).get(zip);
      return point ? { ...point, label: `ZIP ${zip}` } : null;
    },
  };
}

/** ZIP codes from the bundled table, anything else from `geocoder`. */
export function createPlaceSearch({ zipLookup, geocoder }) {
  return {
    async geocode(text) {
      if (zipLookup.isZip(text)) {
        const hit = await zipLookup.lookup(text);
        if (hit) return hit;
      }
      return geocoder.geocode(text);
    },
  };
}
