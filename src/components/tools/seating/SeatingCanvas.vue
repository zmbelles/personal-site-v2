<template>
  <main class="sc-canvas-wrap">
    <div
      ref="scrollRef"
      class="sc-canvas-scroll"
      :class="{ 'is-panning': panning }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="endPan"
      @pointercancel="endPan"
      @contextmenu.prevent
    >
      <div
        class="sc-canvas-sizer"
        :style="{ width: CANVAS_W * scale + 'px', height: CANVAS_H * scale + 'px' }"
      >
        <div
          class="sc-canvas"
          :style="{ width: CANVAS_W + 'px', height: CANVAS_H + 'px', transform: `scale(${scale})` }"
        >
          <div v-if="!store.state.tables.length" class="sc-canvas-empty">
            <p>No tables yet</p>
            <span>Use “Add a table” on the left, then drag guests into seats.</span>
          </div>
          <SeatingTable
            v-for="t in store.state.tables"
            :key="t.id"
            :table="t"
            :scale="scale"
            :selected="t.id === selectedId"
            @select="selectedId = $event"
            @seat-click="openSeatMenu"
          />
        </div>
      </div>
    </div>

    <div class="sc-zoom">
      <button title="Zoom out" @click="zoomAt((s) => s / 1.2)">−</button>
      <button class="sc-zoom-reset" title="Reset to 100%" @click="zoomAt(() => 1)">
        {{ Math.round(scale * 100) }}%
      </button>
      <button title="Zoom in" @click="zoomAt((s) => s * 1.2)">+</button>
      <button class="sc-zoom-fit" title="Fit all tables in view" @click="fit">Fit</button>
    </div>

    <SeatingSeatPopup v-if="menu" :menu="menu" @close="menu = null" />
  </main>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { useSeatingStore } from "./store.js";
import { nodeSize, CANVAS_W, CANVAS_H } from "./geometry.js";
import SeatingTable from "./SeatingTable.vue";
import SeatingSeatPopup from "./SeatingSeatPopup.vue";

const MIN_SCALE = 0.2;
const MAX_SCALE = 2;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const store = useSeatingStore();
const scrollRef = ref(null);
const scale = ref(1);
const panning = ref(false);
const menu = ref(null);
// The selected table keeps its edit toolbar open; hovering any table still
// reveals its toolbar temporarily.
const selectedId = ref(null);
let pan = null;

function openSeatMenu(seatId, e) {
  const x = Math.min(e.clientX, window.innerWidth - 260);
  const y = Math.min(e.clientY, window.innerHeight - 340);
  menu.value = { seatId, x: Math.max(8, x), y: Math.max(8, y) };
}

// Change the zoom while keeping the point under the cursor (or the center of
// the viewport) pinned in place.
async function zoomAt(next, clientX, clientY) {
  const el = scrollRef.value;
  const from = scale.value;
  const target = clamp(next(from), MIN_SCALE, MAX_SCALE);
  if (!el || target === from) {
    scale.value = target;
    return;
  }
  const rect = el.getBoundingClientRect();
  const viewX = clientX == null ? rect.width / 2 : clientX - rect.left;
  const viewY = clientY == null ? rect.height / 2 : clientY - rect.top;
  const contentX = (el.scrollLeft + viewX) / from;
  const contentY = (el.scrollTop + viewY) / from;

  scale.value = target;
  await nextTick();
  el.scrollLeft = contentX * target - viewX;
  el.scrollTop = contentY * target - viewY;
}

// Ctrl/⌘ + wheel zooms toward the cursor. A native, non-passive listener is
// required so we can preventDefault; a plain wheel keeps scrolling the canvas.
function onWheel(e) {
  if (!e.ctrlKey && !e.metaKey) return;
  e.preventDefault();
  const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
  zoomAt((s) => s * factor, e.clientX, e.clientY);
}

function onKeydown(e) {
  if (e.key !== "Escape") return;
  if (menu.value) menu.value = null;
  else selectedId.value = null;
}

let wheelEl = null;
onMounted(() => {
  wheelEl = scrollRef.value;
  wheelEl?.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKeydown);
});
onUnmounted(() => {
  wheelEl?.removeEventListener("wheel", onWheel);
  window.removeEventListener("keydown", onKeydown);
});

// Right-click drag pans the canvas.
function onPointerDown(e) {
  if (e.button !== 2) {
    // A press on empty floor clears the selection; presses inside a table
    // bubble up from it and are left alone.
    if (!e.target.closest(".sc-table-node")) selectedId.value = null;
    return; // right button only
  }
  const el = scrollRef.value;
  if (!el) return;
  pan = { x: e.clientX, y: e.clientY, sl: el.scrollLeft, st: el.scrollTop };
  panning.value = true;
  el.setPointerCapture?.(e.pointerId);
  e.preventDefault();
}

function onPointerMove(e) {
  if (!pan) return;
  const el = scrollRef.value;
  el.scrollLeft = pan.sl - (e.clientX - pan.x);
  el.scrollTop = pan.st - (e.clientY - pan.y);
}

function endPan(e) {
  if (!pan) return;
  pan = null;
  panning.value = false;
  scrollRef.value?.releasePointerCapture?.(e.pointerId);
}

async function fit() {
  const el = scrollRef.value;
  const tables = store.state.tables;
  if (!el || !tables.length) {
    scale.value = 1;
    return;
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const t of tables) {
    const { w, h } = nodeSize(t.shape, t.seats);
    minX = Math.min(minX, t.x);
    minY = Math.min(minY, t.y);
    maxX = Math.max(maxX, t.x + w);
    maxY = Math.max(maxY, t.y + h);
  }
  const pad = 60;
  const bw = maxX - minX + pad * 2;
  const bh = maxY - minY + pad * 2;
  const next = clamp(
    Math.min(el.clientWidth / bw, el.clientHeight / bh),
    MIN_SCALE,
    MAX_SCALE
  );

  scale.value = next;
  await nextTick();
  el.scrollLeft = (minX - pad) * next;
  el.scrollTop = (minY - pad) * next;
}
</script>
