<template>
  <aside class="sc-sidebar">
    <header class="sc-brand">
      <h2>Your chart</h2>
      <input
        class="sc-title-input"
        :value="store.state.title"
        placeholder="Event title"
        aria-label="Event title"
        @input="store.setTitle($event.target.value)"
      />
    </header>

    <section class="sc-panel">
      <h3>Add a table</h3>
      <div class="sc-row">
        <select v-model="shape" aria-label="Table shape">
          <option v-for="s in SHAPES" :key="s" :value="s">
            {{ s[0].toUpperCase() + s.slice(1) }}
          </option>
        </select>
        <input
          v-model.number="seats"
          type="number"
          min="1"
          :max="MAX_SEATS"
          aria-label="Seats"
        />
      </div>
      <button class="sc-btn sc-primary" @click="addTable">+ Add table</button>
    </section>

    <section class="sc-panel">
      <h3>Guests</h3>
      <div class="sc-row">
        <input
          v-model="newGuest"
          class="sc-grow"
          placeholder="Add one guest…"
          aria-label="Guest name"
          @keydown.enter="addGuest"
        />
        <button class="sc-btn" @click="addGuest">Add</button>
      </div>

      <button class="sc-btn sc-wide" @click="fileRef?.click()">Import CSV file</button>
      <input
        ref="fileRef"
        type="file"
        accept=".csv,text/csv,text/plain"
        hidden
        @change="importFile"
      />

      <details class="sc-paste">
        <summary>or paste a list</summary>
        <textarea
          v-model="paste"
          rows="4"
          placeholder="One name per line, or CSV:&#10;First,Last&#10;Jane Doe"
        ></textarea>
        <button class="sc-btn" @click="importPaste">Import pasted</button>
      </details>
    </section>

    <section class="sc-panel sc-pool-panel">
      <div class="sc-pool-head">
        <h3>Unassigned</h3>
        <span class="sc-counts">{{ seated }}/{{ store.state.guests.length }} seated</span>
      </div>

      <input
        v-if="store.state.guests.length > 6"
        v-model="filter"
        class="sc-filter"
        placeholder="Filter…"
        aria-label="Filter guests"
      />

      <div class="sc-pool" @dragover.prevent @drop.prevent="onPoolDrop">
        <p v-if="!shown.length" class="sc-muted">
          {{
            store.state.guests.length === 0
              ? "Import or add guests to begin."
              : "Everyone shown is seated. Drag a guest here to unseat them."
          }}
        </p>
        <SeatingGuestChip
          v-for="g in shown"
          :key="g.id"
          :guest="g"
          removable
          @remove="store.removeGuest"
        />
      </div>
    </section>

    <section class="sc-panel">
      <h3>Export</h3>
      <div class="sc-export-grid">
        <button class="sc-btn" @click="exportPNG(store.state)">PNG image</button>
        <button class="sc-btn" @click="exportCSV(store.state)">CSV list</button>
        <button class="sc-btn" @click="exportJSON(store.state)">Download JSON</button>
        <button class="sc-btn" @click="jsonRef?.click()">Load JSON</button>
      </div>
      <p class="sc-hint">
        The JSON file lists each table with the names seated at it, and reloads
        here exactly as you left it.
      </p>
      <input
        ref="jsonRef"
        type="file"
        accept=".json,application/json"
        hidden
        @change="importJSON"
      />

      <button class="sc-btn sc-danger sc-wide" @click="resetAll">Reset all</button>
    </section>
  </aside>
</template>

<script setup>
import { computed, ref } from "vue";
import { useSeatingStore, MAX_SEATS } from "./store.js";
import { SHAPES } from "./geometry.js";
import { parseGuestsFromCSV } from "./csv.js";
import { exportCSV, exportJSON, exportPNG, docToChart } from "./exporters.js";
import SeatingGuestChip from "./SeatingGuestChip.vue";

const store = useSeatingStore();

const shape = ref("circle");
const seats = ref(8);
const paste = ref("");
const newGuest = ref("");
const filter = ref("");
const fileRef = ref(null);
const jsonRef = ref(null);

const seated = computed(
  () => store.state.guests.length - store.unassigned.value.length
);

const shown = computed(() =>
  store.unassigned.value.filter((g) =>
    g.name.toLowerCase().includes(filter.value.toLowerCase())
  )
);

function addTable() {
  const n = Math.max(1, Math.min(MAX_SEATS, Number(seats.value) || 1));
  seats.value = n;
  store.addTable(shape.value, n);
}

function addGuest() {
  if (!newGuest.value.trim()) return;
  store.addGuests([newGuest.value]);
  newGuest.value = "";
}

function readFile(input, onText) {
  const f = input.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => onText(String(r.result));
  r.readAsText(f);
  input.value = "";
}

function importFile(e) {
  readFile(e.target, (text) => {
    const names = parseGuestsFromCSV(text);
    if (names.length) store.addGuests(names);
    else alert("No guest names were found in that file.");
  });
}

function importPaste() {
  const names = parseGuestsFromCSV(paste.value);
  if (names.length) {
    store.addGuests(names);
    paste.value = "";
  }
}

function importJSON(e) {
  readFile(e.target, (text) => {
    let chart = null;
    try {
      chart = docToChart(JSON.parse(text));
    } catch {
      chart = null;
    }
    if (!chart) {
      alert("That file could not be read as a saved seating chart.");
      return;
    }
    store.replace(chart);
  });
}

function onPoolDrop(e) {
  const gid = e.dataTransfer.getData("text/guest");
  if (gid) store.unassign(gid);
}

function resetAll() {
  const ok = confirm(
    "Reset all?\n\nThis permanently deletes every guest, table, and seat assignment. This cannot be undone.\n\nTip: use “Download JSON” first if you want a backup."
  );
  if (ok) store.reset();
}
</script>
