/**
 * Builds the ZIP code -> coordinates table (src/core/gas/data/zips.json).
 * OpenStreetMap's postcode data misplaces some ZIPs (60601 lands in Riverside
 * rather than the Chicago Loop), so ZIPs are looked up here instead.
 *
 * Source: U.S. Census Bureau Gazetteer, ZIP Code Tabulation Areas (public domain)
 * https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2024_Gazetteer/2024_Gaz_zcta_national.zip
 * Download and unzip it, then:
 *
 *   node scripts/build-zips.mjs path/to/2024_Gaz_zcta_national.txt
 *
 * Coordinates are rounded to 0.01° (~1 km) and each row is stored as a delta
 * from the previous one, which keeps the file ~100 KB gzipped. Decoded by
 * createZipLookup in src/core/gas/providers/zips.js.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "src/core/gas/data/zips.json");

const src = process.argv[2];
if (!src) {
  console.error("Usage: node scripts/build-zips.mjs path/to/2024_Gaz_zcta_national.txt");
  process.exit(1);
}

const [header, ...lines] = fs.readFileSync(src, "utf8").trim().split(/\r?\n/);
const cols = header.split("\t").map((c) => c.trim());
const at = (name) => cols.indexOf(name);
const [iZip, iLat, iLng] = [at("GEOID"), at("INTPTLAT"), at("INTPTLONG")];

const rows = lines
  .map((line) => line.split("\t").map((c) => c.trim()))
  .filter((c) => /^\d{5}$/.test(c[iZip]))
  .map((c) => [Number(c[iZip]), Math.round(Number(c[iLat]) * 100), Math.round(Number(c[iLng]) * 100)])
  .sort((a, b) => a[0] - b[0]);

let prev = [0, 0, 0];
const entries = rows.map((row) => {
  const delta = row.map((v, i) => v - prev[i]);
  prev = row;
  return delta.join(",");
});

const data = {
  source: "U.S. Census Bureau 2024 Gazetteer, ZIP Code Tabulation Areas (public domain)",
  generated: new Date().toISOString().slice(0, 10),
  format: "rows of dZip,dLat,dLng joined by ';', each a change from the previous row; lat/lng in hundredths of a degree",
  zips: entries.join(";"),
};

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(data));
console.log(`${entries.length} ZIP codes -> ${path.relative(root, out)}`);
