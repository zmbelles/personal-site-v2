import { seatPositions, nodeSize, SEAT_SIZE, SHAPES } from "./geometry.js";
import {
  seatKey,
  colorFor,
  firstName,
  uid,
  findFreeSpot,
  sanitize,
  MAX_SEATS,
} from "./store.js";

function download(content, filename, type) {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const csvCell = (v) => {
  const s = String(v ?? "");
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

const slug = (s) =>
  (s || "seating-chart")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "seating-chart";

/**
 * The downloadable shape of a chart: a list of tables, each with the names of
 * the people sitting at it in seat order. `null` marks an empty seat, which is
 * what lets an exported file be re-imported with everyone back in their seat.
 */
export function chartToDoc(state) {
  const nameOf = (guestId) => {
    const g = state.guests.find((x) => x.id === guestId);
    return g ? g.name : null;
  };
  const seated = new Set(Object.values(state.assignments));

  return {
    title: state.title || "Seating Chart",
    tables: state.tables.map((t) => ({
      name: t.name,
      guests: Array.from({ length: t.seats }, (_, i) =>
        nameOf(state.assignments[seatKey(t.id, i)])
      ),
      shape: t.shape,
      x: Math.round(t.x),
      y: Math.round(t.y),
    })),
    unassigned: state.guests.filter((g) => !seated.has(g.id)).map((g) => g.name),
  };
}

/**
 * Rebuild internal chart state from a downloaded file. Accepts the table-list
 * format above, and also the older `{ guests, tables, assignments }` shape so
 * charts saved by earlier versions still load.
 */
export function docToChart(doc) {
  if (!doc || typeof doc !== "object") return null;

  const isLegacy =
    Array.isArray(doc.guests) &&
    doc.assignments &&
    typeof doc.assignments === "object";
  if (isLegacy) return sanitize(doc);

  if (!Array.isArray(doc.tables) && !Array.isArray(doc.unassigned)) return null;

  const guests = [];
  const tables = [];
  const assignments = {};

  (Array.isArray(doc.tables) ? doc.tables : []).forEach((t, i) => {
    if (!t || typeof t !== "object") return;
    const names = Array.isArray(t.guests) ? t.guests : [];
    const seats = Math.max(1, Math.min(MAX_SEATS, names.length || 1));
    const shape = SHAPES.includes(t.shape) ? t.shape : "circle";
    const id = uid("t");
    // Files written by hand often omit coordinates — lay those out for them.
    const placed =
      Number.isFinite(t.x) && Number.isFinite(t.y)
        ? { x: t.x, y: t.y }
        : findFreeSpot(tables, shape, seats);

    tables.push({
      id,
      name: typeof t.name === "string" && t.name.trim() ? t.name : `Table ${i + 1}`,
      shape,
      seats,
      x: placed.x,
      y: placed.y,
    });

    names.slice(0, seats).forEach((name, index) => {
      const clean = typeof name === "string" ? name.trim() : "";
      if (!clean) return; // null / blank means the seat is open
      const guest = { id: uid("g"), name: clean };
      guests.push(guest);
      assignments[seatKey(id, index)] = guest.id;
    });
  });

  (Array.isArray(doc.unassigned) ? doc.unassigned : []).forEach((name) => {
    const clean = typeof name === "string" ? name.trim() : "";
    if (clean) guests.push({ id: uid("g"), name: clean });
  });

  return {
    title: typeof doc.title === "string" ? doc.title : "Our Wedding",
    guests,
    tables,
    assignments,
  };
}

export function exportJSON(state) {
  const doc = chartToDoc(state);
  download(
    JSON.stringify(doc, null, 2),
    `${slug(state.title)}.json`,
    "application/json"
  );
}

export function exportCSV(state) {
  const rows = [["Table", "Shape", "Seat", "Guest"]];
  for (const t of state.tables) {
    for (let i = 0; i < t.seats; i++) {
      const gid = state.assignments[seatKey(t.id, i)];
      const g = state.guests.find((x) => x.id === gid);
      rows.push([t.name, t.shape, i + 1, g ? g.name : ""]);
    }
  }
  const seated = new Set(Object.values(state.assignments));
  for (const g of state.guests) {
    if (!seated.has(g.id)) rows.push(["(Unassigned)", "", "", g.name]);
  }
  const csv = rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
  download("﻿" + csv, `${slug(state.title)}.csv`, "text/csv;charset=utf-8");
}

export function exportPNG(state) {
  const scale = 2;
  const pad = 60;
  const titleH = 80;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const nodes = state.tables.map((t) => {
    const { w, h, dims } = nodeSize(t.shape, t.seats);
    minX = Math.min(minX, t.x);
    minY = Math.min(minY, t.y);
    maxX = Math.max(maxX, t.x + w);
    maxY = Math.max(maxY, t.y + h);
    return { t, w, h, dims };
  });
  if (!nodes.length) {
    minX = 0;
    minY = 0;
    maxX = 400;
    maxY = 200;
  }

  const width = maxX - minX + pad * 2;
  const height = maxY - minY + pad * 2 + titleH;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  // The export stays light on purpose — it is meant to be printed or sent to a
  // venue — but uses the site's purple rather than the UI's dark palette.
  ctx.fillStyle = "#faf8fd";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#2b2440";
  ctx.font = "600 34px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(state.title || "Seating Chart", width / 2, titleH / 2 + 12);

  const ox = pad - minX;
  const oy = pad + titleH - minY;

  for (const { t, w, h, dims } of nodes) {
    const cx = t.x + w / 2 + ox;
    const cy = t.y + h / 2 + oy;

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#8f74c9";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (t.shape === "circle" || t.shape === "oval") {
      ctx.ellipse(cx, cy, dims.w / 2, dims.h / 2, 0, 0, Math.PI * 2);
    } else {
      roundRect(ctx, cx - dims.w / 2, cy - dims.h / 2, dims.w, dims.h, 10);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#6f5aa8";
    ctx.font = "600 15px Georgia, serif";
    ctx.fillText(t.name, cx, cy);

    const positions = seatPositions(t.shape, t.seats, dims);
    positions.forEach((p, i) => {
      const sx = cx + p.x;
      const sy = cy + p.y;
      const gid = state.assignments[seatKey(t.id, i)];
      const g = state.guests.find((x) => x.id === gid);
      ctx.beginPath();
      ctx.arc(sx, sy, SEAT_SIZE / 2, 0, Math.PI * 2);
      ctx.fillStyle = g ? colorFor(g.name) : "#ece7f6";
      ctx.fill();
      ctx.strokeStyle = g ? "rgba(0,0,0,0.22)" : "#cfc4e6";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = g ? "#1d1832" : "#8a7ea8";
      ctx.font = g ? "600 11px system-ui, sans-serif" : "11px system-ui, sans-serif";
      ctx.fillText(g ? clip(firstName(g.name), 8) : String(i + 1), sx, sy);
    });
  }

  canvas.toBlob((blob) => {
    if (blob) download(blob, `${slug(state.title)}.png`, "image/png");
  }, "image/png");
}

function roundRect(ctx, x, y, w, h, r) {
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
