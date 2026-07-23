<template>
  <div
    class="sc-table-node"
    :class="{ 'is-selected': selected }"
    :style="{ left: table.x + 'px', top: table.y + 'px', width: node.w + 'px', height: node.h + 'px' }"
    @pointerdown="$emit('select', table.id)"
  >
    <div class="sc-table-toolbar">
      <input
        class="sc-table-name"
        :value="table.name"
        aria-label="Table name"
        @input="rename($event.target.value)"
      />
      <select
        :value="table.shape"
        aria-label="Table shape"
        @change="store.updateTable(table.id, { shape: $event.target.value })"
      >
        <option v-for="s in SHAPES" :key="s" :value="s">
          {{ s[0].toUpperCase() + s.slice(1) }}
        </option>
      </select>
      <div class="sc-stepper">
        <button title="Fewer seats" @click="setSeats(table.seats - 1)">−</button>
        <span>{{ table.seats }}</span>
        <button title="More seats" @click="setSeats(table.seats + 1)">+</button>
      </div>
      <button
        class="sc-table-del"
        title="Delete table"
        aria-label="Delete table"
        @click="confirmDelete"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 6h16M9 6V4h6v2M6 6l1 14h10l1-14M10 10v6M14 10v6"
          />
        </svg>
      </button>
    </div>

    <div
      class="sc-table-shape"
      :class="rounded ? 'is-oval' : 'is-rect'"
      :style="{ left: MARGIN + 'px', top: MARGIN + 'px', width: dims.w + 'px', height: dims.h + 'px' }"
      :title="editing ? undefined : 'Drag to move · double-click to rename'"
      @pointerdown="editing ? undefined : startDrag($event)"
      @dblclick="beginEdit"
    >
      <input
        v-if="editing"
        ref="nameRef"
        class="sc-table-shape-input"
        :value="table.name"
        @input="rename($event.target.value)"
        @pointerdown.stop
        @focus="$event.target.select()"
        @blur="editing = false"
        @keydown.enter="$event.target.blur()"
        @keydown.esc="$event.target.blur()"
      />
      <span v-else class="sc-table-shape-label">{{ table.name }}</span>
    </div>

    <SeatingSeat
      v-for="(p, i) in positions"
      :key="i"
      :seat-id="seatKey(table.id, i)"
      :index="i"
      :guest="guestAt(i)"
      :x="node.w / 2 + p.x"
      :y="node.h / 2 + p.y"
      @open="(id, e) => $emit('seat-click', id, e)"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, onUnmounted, ref } from "vue";
import { useSeatingStore, seatKey, MAX_SEATS } from "./store.js";
import { tableDims, seatPositions, nodeSize, MARGIN, SHAPES } from "./geometry.js";
import SeatingSeat from "./SeatingSeat.vue";

const props = defineProps({
  table: { type: Object, required: true },
  scale: { type: Number, default: 1 },
  selected: { type: Boolean, default: false },
});

defineEmits(["seat-click", "select"]);

const store = useSeatingStore();
const editing = ref(false);
const nameRef = ref(null);
let drag = null;

const dims = computed(() => tableDims(props.table.shape, props.table.seats));
const node = computed(() => nodeSize(props.table.shape, props.table.seats));
const positions = computed(() =>
  seatPositions(props.table.shape, props.table.seats, dims.value)
);
const rounded = computed(
  () => props.table.shape === "circle" || props.table.shape === "oval"
);

function guestAt(i) {
  const gid = store.state.assignments[seatKey(props.table.id, i)];
  return gid ? store.guestById.value[gid] || null : null;
}

const rename = (name) => store.updateTable(props.table.id, { name });

const setSeats = (n) =>
  store.updateTable(props.table.id, { seats: Math.max(1, Math.min(MAX_SEATS, n)) });

function confirmDelete() {
  const label = props.table.name || "this table";
  if (confirm(`Delete ${label}? Anyone seated there goes back to the guest list.`)) {
    store.removeTable(props.table.id);
  }
}

async function beginEdit() {
  editing.value = true;
  await nextTick();
  nameRef.value?.focus();
}

function startDrag(e) {
  if (e.button !== 0) return; // left button only; right button pans the canvas
  drag = { mx: e.clientX, my: e.clientY, x: props.table.x, y: props.table.y };
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", endDrag);
  e.preventDefault();
}

function onMove(e) {
  if (!drag) return;
  const s = props.scale || 1;
  store.moveTable(
    props.table.id,
    Math.max(0, drag.x + (e.clientX - drag.mx) / s),
    Math.max(0, drag.y + (e.clientY - drag.my) / s)
  );
}

function endDrag() {
  drag = null;
  window.removeEventListener("pointermove", onMove);
  window.removeEventListener("pointerup", endDrag);
}

onUnmounted(endDrag);
</script>
