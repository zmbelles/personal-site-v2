import { computed, inject, provide, reactive, watch } from "vue";
import { nodeSize, CANVAS_W, CANVAS_H } from "./geometry.js";

const STORAGE_KEY = "wedding-seating-chart-v1";
const STORE_KEY = Symbol("seating-store");

export const MAX_SEATS = 30;

export const seatKey = (tableId, index) => `${tableId}::${index}`;

export function parseSeatKey(k) {
  const idx = k.lastIndexOf("::");
  return { tableId: k.slice(0, idx), index: Number(k.slice(idx + 2)) };
}

let counter = 0;
export const uid = (p = "id") =>
  `${p}_${Date.now().toString(36)}_${(counter++).toString(36)}`;

const PALETTE = [
  "#d98880", "#f0b27a", "#e6c229", "#7dcea0", "#7fb3d5", "#bb8fce",
  "#f1948a", "#5dade2", "#48c9b0", "#f5b041", "#af7ac5", "#dc7633",
];

// Seeded off the guest's name so colors survive an export/import round trip.
export function colorFor(seed = "") {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export const firstName = (name = "") => name.trim().split(/\s+/)[0] || name;

export const blankChart = () => ({
  title: "Our Wedding",
  guests: [],
  tables: [],
  assignments: {}, // seatKey -> guestId
});

const GAP_X = 20;
const GAP_Y = 56; // vertical gaps also have to clear the hover toolbar
const ORIGIN_X = 20;
const ORIGIN_Y = 56;
const STEP = 20;

// The first open spot, scanning left to right then down, so a new table never
// lands on top of an existing one however many seats either of them has.
export function findFreeSpot(tables, shape, seats) {
  const { w, h } = nodeSize(shape, seats);
  const boxes = tables.map((t) => {
    const n = nodeSize(t.shape, t.seats);
    return { x: t.x, y: t.y, w: n.w, h: n.h };
  });
  const collides = (x, y) =>
    boxes.some(
      (b) =>
        x < b.x + b.w + GAP_X &&
        x + w + GAP_X > b.x &&
        y < b.y + b.h + GAP_Y &&
        y + h + GAP_Y > b.y
    );

  for (let y = ORIGIN_Y; y + h <= CANVAS_H; y += STEP) {
    for (let x = ORIGIN_X; x + w <= CANVAS_W; x += STEP) {
      if (!collides(x, y)) return { x, y };
    }
  }
  return { x: ORIGIN_X, y: ORIGIN_Y };
}

export function sanitize(s) {
  const base = blankChart();
  return {
    title: typeof s?.title === "string" ? s.title : base.title,
    guests: Array.isArray(s?.guests) ? s.guests : [],
    tables: Array.isArray(s?.tables) ? s.tables : [],
    assignments:
      s?.assignments && typeof s.assignments === "object" ? s.assignments : {},
  };
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return sanitize(JSON.parse(raw));
  } catch {
    /* private mode, corrupt entry — fall through to a blank chart */
  }
  return blankChart();
}

function createStore() {
  const state = reactive(loadFromStorage());

  const guestById = computed(() =>
    Object.fromEntries(state.guests.map((g) => [g.id, g]))
  );

  const guestSeat = computed(() => {
    const m = {};
    for (const k in state.assignments) m[state.assignments[k]] = k;
    return m;
  });

  const unassigned = computed(() =>
    state.guests.filter((g) => !guestSeat.value[g.id])
  );

  // Debounced so dragging a table doesn't write to storage on every frame.
  let timer = null;
  watch(state, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* storage full or blocked — the chart still works for this session */
      }
    }, 200);
  });

  function addGuests(names) {
    const toAdd = names
      .map((n) => String(n).trim())
      .filter(Boolean)
      .map((name) => ({ id: uid("g"), name }));
    state.guests.push(...toAdd);
    return toAdd.length;
  }

  function removeGuest(id) {
    for (const k in state.assignments) {
      if (state.assignments[k] === id) delete state.assignments[k];
    }
    state.guests = state.guests.filter((g) => g.id !== id);
  }

  function addTable(shape, seats, name) {
    const i = state.tables.length;
    const { x, y } = findFreeSpot(state.tables, shape, seats);
    state.tables.push({
      id: uid("t"),
      name: name || `Table ${i + 1}`,
      shape,
      seats,
      x,
      y,
    });
  }

  function removeTable(id) {
    for (const k in state.assignments) {
      if (parseSeatKey(k).tableId === id) delete state.assignments[k];
    }
    state.tables = state.tables.filter((t) => t.id !== id);
  }

  function updateTable(id, patch) {
    const table = state.tables.find((t) => t.id === id);
    if (!table) return;
    Object.assign(table, patch);
    if (patch.seats != null) {
      for (const k in state.assignments) {
        const p = parseSeatKey(k);
        if (p.tableId === id && p.index >= patch.seats) {
          delete state.assignments[k];
        }
      }
    }
  }

  function moveTable(id, x, y) {
    const table = state.tables.find((t) => t.id === id);
    if (!table) return;
    table.x = x;
    table.y = y;
  }

  // Seat a guest, handling moves out of their old seat and swaps with an occupant.
  function assign(guestId, targetKey) {
    let fromKey = null;
    for (const k in state.assignments) {
      if (state.assignments[k] === guestId) {
        fromKey = k;
        break;
      }
    }
    const occupant = state.assignments[targetKey];
    if (fromKey && fromKey !== targetKey) {
      if (occupant) state.assignments[fromKey] = occupant; // swap
      else delete state.assignments[fromKey];
    }
    state.assignments[targetKey] = guestId; // a prior occupant with no swap partner returns to the pool
  }

  function unassign(guestId) {
    for (const k in state.assignments) {
      if (state.assignments[k] === guestId) delete state.assignments[k];
    }
  }

  function clearSeat(key) {
    delete state.assignments[key];
  }

  function setTitle(title) {
    state.title = title;
  }

  function replace(next) {
    Object.assign(state, sanitize(next));
  }

  function reset() {
    Object.assign(state, blankChart());
  }

  return {
    state,
    guestById,
    guestSeat,
    unassigned,
    addGuests,
    removeGuest,
    addTable,
    removeTable,
    updateTable,
    moveTable,
    assign,
    unassign,
    clearSeat,
    setTitle,
    replace,
    reset,
  };
}

export function provideSeatingStore() {
  const store = createStore();
  provide(STORE_KEY, store);
  return store;
}

export function useSeatingStore() {
  const store = inject(STORE_KEY, null);
  if (!store) throw new Error("useSeatingStore requires provideSeatingStore in an ancestor");
  return store;
}
