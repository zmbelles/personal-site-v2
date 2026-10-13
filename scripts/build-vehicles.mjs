/**
 * Trims the EPA fuel economy dataset down to the compact vehicle table the gas
 * finder ships with (src/core/gas/data/vehicles.json).
 *
 * Source: https://www.fueleconomy.gov/feg/epadata/vehicles.csv.zip
 * (U.S. EPA / DOE, public domain). Download and unzip it, then:
 *
 *   node scripts/build-vehicles.mjs path/to/vehicles.csv
 *
 * One entry per year + make + model with each engine / transmission /
 * drivetrain the EPA rated, and its MPG and fuel grade. EVs are dropped.
 * Tank capacity isn't published, so it's estimated (see estimateTank).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describeVariant } from "../src/core/gas/vehicles.js";

const MIN_YEAR = 2000;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "src/core/gas/data/vehicles.json");

const src = process.argv[2];
if (!src) {
  console.error("Usage: node scripts/build-vehicles.mjs path/to/vehicles.csv");
  process.exit(1);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// EPA size class -> the short class codes the app understands.
function classify(vclass) {
  const v = vclass.toLowerCase();
  if (v.includes("pickup")) return v.includes("small") ? "pickup-small" : "pickup";
  if (v.includes("van")) return v.includes("cargo") || v.includes("passenger") ? "van" : "minivan";
  if (v.includes("sport utility")) return v.includes("small") ? "suv-small" : "suv";
  if (v.includes("special purpose")) return "suv";
  if (v.includes("station wagon")) return v.includes("small") ? "compact" : "midsize";
  if (v.includes("two seater") || v.includes("minicompact") || v.includes("subcompact")) return "subcompact";
  if (v.includes("compact")) return "compact";
  if (v.includes("midsize")) return "midsize";
  if (v.includes("large")) return "large";
  return "midsize";
}

function fuelGrade(fuelType1) {
  const f = fuelType1.toLowerCase();
  if (f.includes("diesel")) return "diesel";
  if (f.includes("premium")) return "premium";
  if (f.includes("midgrade")) return "midgrade";
  if (f.includes("regular")) return "regular";
  return null;
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const mode = (xs) => {
  const counts = new Map();
  for (const x of xs) counts.set(x, (counts.get(x) || 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1])[0][0];
};

// No open dataset has tank capacity, so it's estimated per model as the larger
// of a typical tank for the EPA size class and the tank needed for
// RANGE_MILES of highway driving. EPA classes go by interior room, which
// undersells sports cars (a Camaro is a "subcompact"); the range figure catches
// those, capped so supercars with single-digit MPG don't get absurd tanks.
// Hybrids get 80% of the class figure and no range check.
const TANK_BY_CLASS = {
  subcompact: 12,
  compact: 13,
  midsize: 15,
  large: 18,
  "suv-small": 15,
  suv: 21,
  minivan: 19,
  "pickup-small": 20,
  pickup: 26,
  van: 28,
};
const RANGE_MILES = 480;
const MAX_OVER_CLASS = 1.75;

function estimateTank(cls, variants) {
  const classTank = TANK_BY_CLASS[cls];
  const conventional = variants.filter((v) => !v.electrified);
  let gallons = classTank * (conventional.length ? 1 : 0.8);
  if (conventional.length) {
    const forRange = RANGE_MILES / median(conventional.map((v) => v.hwy));
    gallons = Math.max(gallons, Math.min(forRange, classTank * MAX_OVER_CLASS));
  }
  return Math.round(gallons * 2) / 2;
}

const [header, ...rows] = parseCsv(fs.readFileSync(src, "utf8"));
const col = Object.fromEntries(header.map((h, i) => [h, i]));

// The EPA spells some makes differently across years ("Mini" vs "MINI");
// fold them together under the newest spelling.
const makeSpelling = new Map();
for (const r of rows) {
  if (r.length < header.length) continue;
  const make = r[col.make].trim();
  const prev = makeSpelling.get(make.toLowerCase());
  if (!prev || Number(r[col.year]) > prev.year) {
    makeSpelling.set(make.toLowerCase(), { make, year: Number(r[col.year]) });
  }
}

const ELECTRIFIED = { Hybrid: "H", "Plug-in Hybrid": "P" };

const models = new Map();
for (const r of rows) {
  if (r.length < header.length) continue;
  const year = Number(r[col.year]);
  const comb = Number(r[col.comb08]);
  const fuel = fuelGrade(r[col.fuelType1]);
  if (year < MIN_YEAR || !comb || !fuel || r[col.atvType] === "EV") continue;

  const make = makeSpelling.get(r[col.make].trim().toLowerCase()).make;
  const model = r[col.model].trim();
  const key = `${year}|${make}|${model}`;
  if (!models.has(key)) models.set(key, { year, make, model, cls: [], variants: new Map() });
  const m = models.get(key);
  m.cls.push(classify(r[col.VClass]));

  const variant = {
    displ: Number(r[col.displ]) || 0,
    cyl: Number(r[col.cylinders]) || 0,
    induction: (r[col.tCharger] === "T" ? "T" : "") + (r[col.sCharger] === "S" ? "S" : ""),
    electrified: ELECTRIFIED[r[col.atvType]] || "",
    trans: r[col.trany].trim(),
    drive: r[col.drive].trim(),
    comb,
    city: Number(r[col.city08]),
    hwy: Number(r[col.highway08]),
    fuel,
  };
  // Sub-trims the EPA rates separately but the app would show identically are merged.
  const choice = `${describeVariant(variant)}|${fuel}`;
  if (!m.variants.has(choice)) m.variants.set(choice, []);
  m.variants.get(choice).push(variant);
}

function mergeVariants(group) {
  const mid = (field) => Math.round(median(group.map((v) => v[field])));
  return { ...group[0], comb: mid("comb"), city: mid("city"), hwy: mid("hwy") };
}

const list = [...models.values()].sort(
  (a, b) => b.year - a.year || a.make.localeCompare(b.make) || a.model.localeCompare(b.model)
);

const makes = [...new Set(list.map((m) => m.make))].sort((a, b) => a.localeCompare(b));
const transmissions = [...new Set(list.flatMap((m) => [...m.variants.values()].flat().map((v) => v.trans)))].sort();
const drives = [...new Set(list.flatMap((m) => [...m.variants.values()].flat().map((v) => v.drive)))].sort();
const fuels = ["regular", "midgrade", "premium", "diesel"];
const index = (arr) => new Map(arr.map((x, i) => [x, i]));
const [makeIdx, transIdx, driveIdx, fuelIdx] = [makes, transmissions, drives, fuels].map(index);

const variantOrder = (a, b) =>
  a.displ - b.displ ||
  a.electrified.localeCompare(b.electrified) ||
  a.induction.localeCompare(b.induction) ||
  a.drive.localeCompare(b.drive) ||
  b.comb - a.comb;

const data = {
  source: "U.S. EPA fueleconomy.gov vehicles.csv (public domain)",
  generated: new Date().toISOString().slice(0, 10),
  // Lookup tables keep the rows small; rows store indexes into them.
  makes,
  transmissions,
  drives,
  fuels,
  modelFields: ["year", "make", "model", "class", "tankGallons", "variants"],
  variantFields: ["displ", "cyl", "induction", "electrified", "trans", "drive", "comb", "city", "hwy", "fuel"],
  models: list.map((m) => {
    const variants = [...m.variants.values()].map(mergeVariants).sort(variantOrder);
    const cls = mode(m.cls);
    return [
      m.year,
      makeIdx.get(m.make),
      m.model,
      cls,
      estimateTank(cls, variants),
      variants.map((v) => [
        v.displ,
        v.cyl,
        v.induction,
        v.electrified,
        transIdx.get(v.trans),
        driveIdx.get(v.drive),
        v.comb,
        v.city,
        v.hwy,
        fuelIdx.get(v.fuel),
      ]),
    ];
  }),
};

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(data));
const variantCount = data.models.reduce((n, m) => n + m[5].length, 0);
console.log(
  `${data.models.length} models, ${variantCount} engine/transmission variants, ${makes.length} makes -> ${path.relative(root, out)}`
);
