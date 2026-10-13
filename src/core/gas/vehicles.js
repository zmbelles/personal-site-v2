/**
 * Helpers for the vehicle table built by scripts/build-vehicles.mjs. Each model
 * has one or more EPA-rated engine/transmission/drivetrain variants with their
 * own MPG and fuel grade; tank size is a per-model estimate.
 */

export const FUEL_GRADES = ["regular", "midgrade", "premium", "diesel"];

export const FUEL_LABELS = {
  regular: "Regular",
  midgrade: "Midgrade",
  premium: "Premium",
  diesel: "Diesel",
};

const DRIVE_SHORT = {
  "Front-Wheel Drive": "FWD",
  "Rear-Wheel Drive": "RWD",
  "All-Wheel Drive": "AWD",
  "4-Wheel or All-Wheel Drive": "4WD/AWD",
  "4-Wheel Drive": "4WD",
  "Part-time 4-Wheel Drive": "4WD",
  "2-Wheel Drive": "2WD",
};

/** "Automatic (S8)" -> "8-speed automatic", "Manual 6-spd" -> "6-speed manual", CVTs -> "CVT". */
export function describeTransmission(trans) {
  if (!trans) return "";
  if (/variable|AV/.test(trans)) return "CVT";
  const speeds = trans.match(/(\d+)/)?.[1];
  const manual = trans.startsWith("Manual");
  const automatedManual = /\(AM/.test(trans);
  if (!speeds || speeds === "1") return manual ? "manual" : "automatic";
  return `${speeds}-speed ${manual ? "manual" : automatedManual ? "automated manual" : "automatic"}`;
}

/**
 * "2.0L 4-cyl turbo", "6.2L 8-cyl supercharged", "2.5L 4-cyl hybrid".
 * The EPA records cylinder count but not layout, so it's "8-cyl" rather than "V8".
 */
export function describeEngine({ displ, cyl, induction, electrified }) {
  const parts = [];
  if (displ) parts.push(`${displ.toFixed(1)}L`);
  if (cyl) parts.push(`${cyl}-cyl`);
  if (induction.includes("T")) parts.push("turbo");
  if (induction.includes("S")) parts.push("supercharged");
  if (electrified === "H") parts.push("hybrid");
  if (electrified === "P") parts.push("plug-in hybrid");
  return parts.join(" ");
}

/** "2.0L 4-cyl turbo · 8-speed automatic · RWD" */
export function describeVariant(v) {
  return [describeEngine(v), describeTransmission(v.trans), DRIVE_SHORT[v.drive] || v.drive]
    .filter(Boolean)
    .join(" · ");
}

/** Expands the compact JSON into model objects with their variants. */
export function decodeVehicles(data) {
  return data.models.map(([year, makeIndex, model, vclass, tankGallons, rawVariants]) => {
    const make = data.makes[makeIndex];
    const id = `${year}|${make}|${model}`;
    const variants = rawVariants.map(
      ([displ, cyl, induction, electrified, trans, drive, mpg, city, hwy, fuel], i) => {
        const v = {
          displ,
          cyl,
          induction,
          electrified,
          trans: data.transmissions[trans],
          drive: data.drives[drive],
          mpg,
          city,
          hwy,
          fuel: data.fuels[fuel],
        };
        v.id = `${id}|${i}`;
        v.label = describeVariant(v);
        return v;
      }
    );
    const mpgs = variants.map((v) => v.mpg);
    return {
      id,
      year,
      make,
      model,
      vclass,
      tankGallons,
      tankEstimated: true,
      variants,
      mpgMin: Math.min(...mpgs),
      mpgMax: Math.max(...mpgs),
    };
  });
}

export function yearsOf(vehicles) {
  return [...new Set(vehicles.map((v) => v.year))].sort((a, b) => b - a);
}

export function makesFor(vehicles, year) {
  const pool = year ? vehicles.filter((v) => v.year === year) : vehicles;
  return [...new Set(pool.map((v) => v.make))].sort((a, b) => a.localeCompare(b));
}

/** Every word of `query` must appear in "year make model". */
export function filterVehicles(vehicles, { year, make, query } = {}) {
  const words = (query || "").toLowerCase().split(/\s+/).filter(Boolean);
  return vehicles.filter((v) => {
    if (year && v.year !== year) return false;
    if (make && v.make !== make) return false;
    if (!words.length) return true;
    const hay = `${v.year} ${v.make} ${v.model}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}
