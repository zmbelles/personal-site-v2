/**
 * The data model behind both printable documents.
 *
 * An invoice and a sales order are the same document with different labels, so
 * one plain object backs both and src/components/forms/shared/specs.js supplies
 * the wording and which panels apply. Everything here is plain data and pure
 * functions — the Vue layer owns the reactivity, the renderer owns the markup.
 */

export const CURRENCIES = [
  { code: "USD", label: "USD — US dollar" },
  { code: "CAD", label: "CAD — Canadian dollar" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "GBP", label: "GBP — British pound" },
  { code: "AUD", label: "AUD — Australian dollar" },
  { code: "NZD", label: "NZD — New Zealand dollar" },
  { code: "CHF", label: "CHF — Swiss franc" },
  { code: "SEK", label: "SEK — Swedish krona" },
  { code: "MXN", label: "MXN — Mexican peso" },
  { code: "BRL", label: "BRL — Brazilian real" },
  { code: "INR", label: "INR — Indian rupee" },
  { code: "JPY", label: "JPY — Japanese yen" },
  { code: "ZAR", label: "ZAR — South African rand" },
];

// Net terms double as a shortcut: picking one recalculates the due date from
// the document date. "Custom" leaves whatever date was typed alone.
export const TERMS = [
  { label: "Due on receipt", days: 0 },
  { label: "Net 15", days: 15 },
  { label: "Net 30", days: 30 },
  { label: "Net 45", days: 45 },
  { label: "Net 60", days: 60 },
  { label: "Custom", days: null },
];

/* ---------- numbers, money, dates ---------- */

/** Coerces anything an input or a pasted JSON blob can hold into a number. */
export function num(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = parseFloat(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * The result is interpolated straight into the document markup, so the code is
 * reduced to three letters first: anything else is dropped rather than passed
 * through, and a currency that Intl does not know falls back to a bare number.
 */
export function formatMoney(value, currency = "USD") {
  const amount = num(value);
  const code = /^[A-Za-z]{3}$/.test(String(currency ?? "").trim())
    ? String(currency).trim().toUpperCase()
    : "";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: code || "USD" }).format(
      amount
    );
  } catch {
    return code ? amount.toFixed(2) + " " + code : amount.toFixed(2);
  }
}

export function formatQuantity(value) {
  const n = num(value);
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

function isoFrom(year, month, day) {
  return [year, String(month).padStart(2, "0"), String(day).padStart(2, "0")].join("-");
}

export function todayIso() {
  const now = new Date();
  return isoFrom(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/**
 * new Date("2026-09-20") is parsed as UTC midnight, which prints as the 19th
 * anywhere west of Greenwich, so date-only strings are split by hand.
 */
export function formatDate(iso) {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso ?? ""));
  if (!parts) return "";
  const date = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function addDays(iso, days) {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso ?? ""));
  if (!parts || days == null) return "";
  const date = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]) + days);
  return isoFrom(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

/* ---------- addresses ---------- */

/**
 * Addresses are edited as free text, one line per line of the label, because no
 * fixed set of fields survives contact with international addresses. Pasted
 * JSON may still arrive in the older { name, addr1, cityStateZip } shape, so
 * that is flattened back to text here rather than rejected.
 */
export function normalizeAddress(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.filter(Boolean).join("\n");
  if (typeof value !== "object") return String(value);

  const cityLine =
    value.cityStateZip ||
    [value.city, [value.state, value.zip].filter(Boolean).join(" ")].filter(Boolean).join(", ");

  return [value.name, value.addr1, value.addr2, value.addr3, cityLine, value.country]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join("\n");
}

export function addressLines(text) {
  return String(text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/* ---------- the document ---------- */

export function blankLine() {
  return { description: "", quantity: 1, unit: "EA", rate: 0, weight: 0 };
}

export function createDocument(spec) {
  const date = todayIso();
  return {
    kind: spec.kind,
    accent: "#3b3163",
    currency: "USD",

    company: { name: "", address: "", phone: "", email: "", website: "", slogan: "", logo: "" },

    number: "",
    poNumber: "",
    date,
    terms: "Net 30",
    dueDate: addDays(date, 30),
    status: spec.statuses[0],
    reference: "",

    billTo: "",
    shipTo: "",

    lines: [blankLine()],

    discountRate: 0,
    taxRate: 0,
    shipping: 0,
    paid: 0,

    memo: "",
  };
}

const str = (value) => (value == null ? "" : String(value));

const isoOr = (value, fallback) =>
  /^\d{4}-\d{2}-\d{2}$/.test(String(value ?? "")) ? String(value) : fallback;

/**
 * Merges arbitrary parsed JSON onto a fresh document. Unknown keys are dropped
 * and every known key is coerced, so a malformed paste cannot leave the form in
 * a state the renderer will choke on. The key names the first version of these
 * forms used (companyName, billto, items, services, price) are still accepted.
 */
export function fromJson(spec, raw) {
  const doc = createDocument(spec);
  if (!raw || typeof raw !== "object") return doc;

  const source = raw.document && typeof raw.document === "object" ? raw.document : raw;

  // Only values the form itself could have produced are let through: the select
  // has no way to express anything else, and the renderer trusts both.
  if (/^#[0-9a-f]{6}$/i.test(String(source.accent ?? "").trim())) {
    doc.accent = String(source.accent).trim().toLowerCase();
  }
  const code = String(source.currency ?? "").trim().toUpperCase();
  if (CURRENCIES.some((entry) => entry.code === code)) doc.currency = code;

  const company = source.company || {};
  doc.company = {
    name: str(company.name ?? source.companyName),
    address: normalizeAddress(company.address ?? source.companyAddress),
    phone: str(company.phone ?? source.companyPhone),
    email: str(company.email ?? source.companyEmail),
    website: str(company.website ?? source.companyWebsite),
    slogan: str(company.slogan ?? source.slogan),
    logo: str(company.logo ?? source.logoDataUrl),
  };

  doc.number = str(source.number ?? source.documentNumber);
  doc.poNumber = str(source.poNumber);
  doc.reference = str(source.reference ?? source.shipMethod);
  doc.date = isoOr(source.date ?? source.todaysDate, doc.date);
  doc.dueDate = isoOr(source.dueDate ?? source.billDate ?? source.shipDate, "");
  doc.terms = TERMS.some((term) => term.label === source.terms) ? source.terms : "Custom";

  // Terms without a date means "work it out", which is derived here rather than
  // left to the form's watcher — that only fires when a value actually changes,
  // and a payload can easily repeat the defaults.
  const term = TERMS.find((entry) => entry.label === doc.terms);
  if (!doc.dueDate && term && term.days != null) doc.dueDate = addDays(doc.date, term.days);
  if (doc.dueDate && !source.terms) doc.terms = "Custom";

  doc.status = spec.statuses.includes(source.status) ? source.status : spec.statuses[0];

  doc.billTo = normalizeAddress(source.billTo ?? source.billto);
  doc.shipTo = normalizeAddress(source.shipTo ?? source.shipto);

  const lines = source.lines || source.items || source.services;
  if (Array.isArray(lines) && lines.length) {
    doc.lines = lines.map((line) => ({
      description: str(line.description ?? line.name),
      quantity: num(line.quantity ?? 1),
      unit: str(line.unit) || "EA",
      rate: num(line.rate ?? line.price ?? line.amount),
      weight: num(line.weight),
    }));
  }

  doc.discountRate = num(source.discountRate);
  doc.taxRate = num(source.taxRate);
  doc.shipping = num(source.shipping);
  doc.paid = num(source.paid ?? source.amountPaid);
  doc.memo = str(source.memo ?? source.notes);

  return doc;
}

/** The shape Copy JSON writes and fromJson reads back, so the two round-trip. */
export function toJson(doc, spec) {
  const payload = {
    kind: doc.kind,
    currency: doc.currency,
    accent: doc.accent,
    company: { ...doc.company },
    number: doc.number,
    date: doc.date,
    terms: doc.terms,
    dueDate: doc.dueDate,
    status: doc.status,
    billTo: doc.billTo,
    lines: doc.lines.map((line) => {
      const out = {
        description: line.description,
        quantity: num(line.quantity),
        unit: line.unit,
        rate: num(line.rate),
      };
      if (spec.showWeight) out.weight = num(line.weight);
      return out;
    }),
    discountRate: num(doc.discountRate),
    taxRate: num(doc.taxRate),
    shipping: num(doc.shipping),
    paid: num(doc.paid),
    memo: doc.memo,
  };

  if (spec.showShipTo) payload.shipTo = doc.shipTo;
  if (spec.referenceLabel) payload.reference = doc.reference;
  if (spec.showPoNumber) payload.poNumber = doc.poNumber;

  // An uploaded logo is tens of kilobytes of base64: useless to read and it
  // swamps the editor, so it stays out of the copied JSON.
  delete payload.company.logo;

  return payload;
}

/* ---------- totals ---------- */

export function lineAmount(line) {
  return round2(num(line.quantity) * num(line.rate));
}

export function computeTotals(doc) {
  const subtotal = round2(doc.lines.reduce((sum, line) => sum + lineAmount(line), 0));
  const discount = round2((subtotal * num(doc.discountRate)) / 100);
  const taxable = round2(subtotal - discount);
  const tax = round2((taxable * num(doc.taxRate)) / 100);
  const shipping = round2(num(doc.shipping));
  const total = round2(taxable + tax + shipping);
  const paid = round2(num(doc.paid));
  const weight = round2(
    doc.lines.reduce((sum, line) => sum + num(line.quantity) * num(line.weight), 0)
  );

  return {
    subtotal,
    discount,
    taxable,
    tax,
    shipping,
    total,
    paid,
    balance: round2(total - paid),
    weight,
  };
}

/** Lowercase, dash separated, safe as a filename on every platform. */
export function slugify(value, fallback) {
  const slug = String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || fallback;
}
