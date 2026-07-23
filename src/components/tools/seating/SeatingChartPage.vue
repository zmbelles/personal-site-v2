<template>
  <div class="sc-page">
    <section class="sc-intro">
      <h1>Wedding Seating Chart Maker</h1>
      <p>
        Lay out your reception in the browser: add tables, drop in your guest
        list, then drag everyone into a seat. It is free, there is no sign-up,
        and nothing you type ever leaves your computer.
      </p>
      <ul class="sc-intro-tips">
        <li><b>Seat someone</b> — drag a name onto a chair, or click a chair to pick from the list.</li>
        <li><b>Move a table</b> — drag it. Hover it to rename, reshape, or change the seat count.</li>
        <li><b>Get around</b> — right-click and drag to pan, <kbd>Ctrl</kbd> + scroll to zoom.</li>
      </ul>
    </section>

    <div ref="shellRef" class="sc-app">
      <SeatingSidebar />
      <SeatingCanvas />
      <button
        class="sc-expand"
        :title="isFullscreen ? 'Exit full screen' : 'Full screen'"
        @click="toggleFullscreen"
      >
        {{ isFullscreen ? "✕ Exit full screen" : "⛶ Full screen" }}
      </button>
    </div>

    <section class="sc-outro">
      <p>
        Your chart saves itself in this browser, so you can close the tab and
        come back to it. Clearing your site data or switching devices will lose
        it — use <b>Download JSON</b> to keep a copy you can load again later.
      </p>
      <p class="sc-muted-note">
        Exports: a <b>PNG</b> to print or send to your venue, a <b>CSV</b> of
        every seat for the caterer, and a <b>JSON</b> file listing each table
        with the guests seated at it.
      </p>
    </section>

    <!-- Rendered from the same data as the FAQPage structured data, so the two
         can never disagree. -->
    <section class="sc-faq">
      <h2>Questions</h2>
      <div v-for="item in faq" :key="item.q" class="sc-faq-item">
        <h3>{{ item.q }}</h3>
        <p>{{ item.a }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import seo from "@/seo/pages.json";
import { provideSeatingStore } from "./store.js";
import SeatingSidebar from "./SeatingSidebar.vue";
import SeatingCanvas from "./SeatingCanvas.vue";

provideSeatingStore();

const faq = seo.pages["/seating-chart"].faq;

const shellRef = ref(null);
const isFullscreen = ref(false);

function syncFullscreen() {
  isFullscreen.value = document.fullscreenElement === shellRef.value;
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen?.();
  else shellRef.value?.requestFullscreen?.();
}

onMounted(() => document.addEventListener("fullscreenchange", syncFullscreen));
onUnmounted(() => document.removeEventListener("fullscreenchange", syncFullscreen));
</script>

<!--
  Not scoped: these rules style child components too. Every selector is kept
  under the `.sc-` namespace so nothing leaks into the rest of the site.
-->
<style>
.sc-page {
  /* Same palette as the rest of the site: #181825 page, #362e5f cards,
     #b39ddb accent, #bfa8cd secondary text. */
  --sc-bg: #14101f;
  --sc-panel: #362e5f;
  --sc-inset: #2a2350;
  --sc-raised: #40376f;
  --sc-ink: #f3eefb;
  --sc-muted: #bfa8cd;
  --sc-faint: #9d8bb8;
  --sc-accent: #b39ddb;
  --sc-accent-soft: #cbbbe8;
  --sc-line: #4c4278;
  --sc-danger: #ef8f8f;
  --sc-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);

  background-color: #181825;
  padding: 1.5rem 1rem 3rem;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}

.sc-page *,
.sc-page *::before,
.sc-page *::after {
  box-sizing: border-box;
}

/* ---------- Page framing ---------- */
.sc-intro,
.sc-outro,
.sc-faq {
  max-width: 860px;
  margin: 0 auto;
  background-color: var(--sc-panel);
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  text-align: left;
  color: #ffffff;
}

.sc-intro h1 {
  margin: 0 0 0.5rem;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.9rem;
  color: #ffffff;
}

.sc-intro p,
.sc-outro p {
  margin: 0 0 0.5rem;
  line-height: 1.55;
  color: #e6e0f5;
}

.sc-intro-tips {
  margin: 0.75rem 0 0;
  padding-left: 1.1rem;
  color: var(--sc-muted);
  line-height: 1.7;
}

.sc-intro-tips b {
  color: #ffffff;
}

.sc-intro-tips kbd {
  background: #1f1a38;
  border: 1px solid var(--sc-line);
  border-radius: 4px;
  padding: 0 0.3rem;
  font-size: 0.85em;
}

.sc-outro {
  margin-top: 1.25rem;
}

.sc-outro p:last-child {
  margin-bottom: 0;
}

.sc-muted-note {
  color: var(--sc-muted) !important;
  font-size: 0.92rem;
}

/* ---------- FAQ ---------- */
.sc-faq {
  margin-top: 1.25rem;
}

.sc-faq h2 {
  margin: 0 0 1rem;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.4rem;
  color: #ffffff;
}

.sc-faq-item + .sc-faq-item {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--sc-line);
}

.sc-faq-item h3 {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  color: var(--sc-accent);
}

.sc-faq-item p {
  margin: 0;
  line-height: 1.55;
  color: #e6e0f5;
}

/* ---------- App shell ---------- */
.sc-app {
  position: relative;
  display: flex;
  max-width: 1400px;
  height: 76vh;
  min-height: 560px;
  margin: 1.25rem auto 0;
  overflow: hidden;
  text-align: left;
  color: var(--sc-ink);
  background: var(--sc-bg);
  border: 1px solid var(--sc-line);
  border-radius: 10px;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.45);
}

.sc-app:fullscreen {
  height: 100vh;
  min-height: 0;
  max-width: none;
  margin: 0;
  border: 0;
  border-radius: 0;
}

.sc-expand {
  position: absolute;
  top: 10px;
  right: 14px;
  z-index: 12;
  font: inherit;
  font-size: 12px;
  color: var(--sc-muted);
  background: var(--sc-panel);
  border: 1px solid var(--sc-line);
  border-radius: 8px;
  padding: 5px 10px;
  cursor: pointer;
  box-shadow: var(--sc-shadow);
}

.sc-expand:hover {
  color: #ffffff;
  border-color: var(--sc-accent);
}

/* ---------- Sidebar ---------- */
.sc-sidebar {
  width: 330px;
  flex: 0 0 330px;
  background: var(--sc-panel);
  border-right: 1px solid var(--sc-line);
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.sc-brand h2 {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #ffffff;
  letter-spacing: 0.3px;
}

.sc-title-input {
  width: 100%;
  font-family: Georgia, serif;
  font-size: 15px;
}

.sc-panel h3 {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--sc-muted);
  margin: 0 0 10px;
}

.sc-pool-panel {
  flex: 1;
  min-height: 118px;
  display: flex;
  flex-direction: column;
}

.sc-pool-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.sc-counts {
  font-size: 12px;
  color: var(--sc-muted);
}

.sc-page input,
.sc-page select,
.sc-page textarea {
  font: inherit;
  color: var(--sc-ink);
  background: var(--sc-inset);
  border: 1px solid var(--sc-line);
  border-radius: 8px;
  padding: 8px 10px;
}

.sc-page input::placeholder,
.sc-page textarea::placeholder {
  color: var(--sc-faint);
}

.sc-page input:focus,
.sc-page select:focus,
.sc-page textarea:focus {
  outline: none;
  border-color: var(--sc-accent);
  box-shadow: 0 0 0 2px rgba(179, 157, 219, 0.28);
}

.sc-page textarea {
  width: 100%;
  resize: vertical;
}

.sc-page select option {
  background: var(--sc-inset);
  color: var(--sc-ink);
}

.sc-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.sc-row select {
  flex: 1;
  min-width: 0;
}

.sc-row input[type="number"] {
  width: 70px;
}

.sc-grow {
  flex: 1;
  min-width: 0;
}

.sc-btn {
  font: inherit;
  border: 1px solid var(--sc-line);
  background: var(--sc-inset);
  color: var(--sc-ink);
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.sc-btn:hover {
  background: var(--sc-raised);
  border-color: var(--sc-accent);
}

.sc-btn.sc-primary {
  background: var(--sc-accent);
  border-color: var(--sc-accent);
  color: #241d3d;
  width: 100%;
  font-weight: 600;
}

.sc-btn.sc-primary:hover {
  background: var(--sc-accent-soft);
  border-color: var(--sc-accent-soft);
}

.sc-btn.sc-wide {
  width: 100%;
  margin-top: 8px;
}

.sc-btn.sc-danger {
  color: var(--sc-danger);
  border-color: #6b4066;
}

.sc-btn.sc-danger:hover {
  background: #4a2c4a;
  border-color: var(--sc-danger);
}

.sc-btn.sc-tiny {
  padding: 3px 8px;
  font-size: 12px;
}

.sc-paste {
  margin-top: 10px;
}

.sc-paste summary {
  cursor: pointer;
  font-size: 13px;
  color: var(--sc-muted);
  margin-bottom: 8px;
}

.sc-paste textarea {
  margin-bottom: 8px;
}

.sc-export-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.sc-hint {
  font-size: 12px;
  line-height: 1.45;
  color: var(--sc-muted);
  margin: 8px 0 0;
}

.sc-filter {
  width: 100%;
  margin-bottom: 8px;
}

.sc-pool {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-content: flex-start;
  overflow-y: auto;
  border: 1px dashed var(--sc-line);
  border-radius: 10px;
  padding: 10px;
  min-height: 90px;
  flex: 1;
}

.sc-muted {
  color: var(--sc-muted);
  font-size: 13px;
  margin: 4px;
}

/* ---------- Guest chip ---------- */
.sc-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--sc-inset);
  border: 1px solid var(--sc-line);
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 13px;
  color: var(--sc-ink);
  cursor: grab;
  user-select: none;
  max-width: 100%;
}

.sc-chip:hover {
  border-color: var(--sc-accent);
}

.sc-chip:active {
  cursor: grabbing;
}

.sc-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--c, var(--sc-accent));
  flex: 0 0 auto;
}

.sc-chip-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px;
}

.sc-chip-x {
  border: none;
  background: none;
  color: var(--sc-faint);
  cursor: pointer;
  font-size: 15px;
  line-height: 1;
  padding: 0 2px;
}

.sc-chip-x:hover {
  color: var(--sc-danger);
}

/* ---------- Canvas ---------- */
.sc-canvas-wrap {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.sc-canvas-scroll {
  position: absolute;
  inset: 0;
  overflow: auto;
  overscroll-behavior: contain;
  background-color: var(--sc-bg);
  background-image: radial-gradient(circle at 1px 1px, #2e2748 1px, transparent 0);
  background-size: 24px 24px;
}

.sc-canvas-scroll.is-panning {
  cursor: grabbing;
}

.sc-canvas-scroll.is-panning * {
  cursor: grabbing !important;
}

.sc-canvas-sizer {
  position: relative;
}

.sc-canvas {
  position: relative;
  transform-origin: 0 0;
}

.sc-zoom {
  position: absolute;
  right: 16px;
  bottom: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--sc-panel);
  border: 1px solid var(--sc-line);
  border-radius: 10px;
  padding: 4px;
  box-shadow: var(--sc-shadow);
  z-index: 10;
}

.sc-zoom button {
  border: none;
  background: none;
  color: var(--sc-ink);
  cursor: pointer;
  font: inherit;
  border-radius: 7px;
  padding: 6px 10px;
  line-height: 1;
}

.sc-zoom button:hover {
  background: var(--sc-raised);
}

.sc-zoom .sc-zoom-reset {
  min-width: 52px;
  font-variant-numeric: tabular-nums;
  color: var(--sc-muted);
}

.sc-zoom .sc-zoom-fit {
  border-left: 1px solid var(--sc-line);
  border-radius: 0 7px 7px 0;
  color: var(--sc-accent);
  font-weight: 600;
}

.sc-canvas-empty {
  position: absolute;
  top: 80px;
  left: 60px;
  color: var(--sc-muted);
}

.sc-canvas-empty p {
  font-family: Georgia, serif;
  font-size: 22px;
  margin: 0 0 4px;
  color: var(--sc-accent);
}

/* ---------- Table ---------- */
.sc-table-node {
  position: absolute;
}

.sc-table-node:hover {
  z-index: 5;
}

.sc-table-toolbar {
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translate(-50%, -100%);
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--sc-panel);
  border: 1px solid var(--sc-line);
  border-radius: 8px;
  padding: 4px;
  box-shadow: var(--sc-shadow);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.12s;
  white-space: nowrap;
}

/* Hovering reveals a table's toolbar; selecting one pins it open. */
.sc-table-node:hover .sc-table-toolbar,
.sc-table-node.is-selected .sc-table-toolbar,
.sc-table-toolbar:focus-within {
  opacity: 1;
  pointer-events: auto;
}

.sc-table-node.is-selected {
  z-index: 6;
}

.sc-table-node.is-selected .sc-table-toolbar {
  border-color: var(--sc-accent);
}

.sc-table-node.is-selected .sc-table-shape {
  border-color: var(--sc-accent-soft);
  box-shadow: 0 0 0 3px rgba(179, 157, 219, 0.35), var(--sc-shadow);
}

.sc-table-name {
  width: 96px;
  padding: 4px 6px !important;
  font-size: 12px;
}

.sc-table-toolbar select {
  padding: 4px 6px !important;
  font-size: 12px;
}

.sc-stepper {
  display: flex;
  align-items: center;
  gap: 2px;
}

.sc-stepper button {
  width: 22px;
  height: 24px;
  border: 1px solid var(--sc-line);
  background: var(--sc-inset);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  color: var(--sc-ink);
}

.sc-stepper button:hover {
  background: var(--sc-raised);
}

.sc-stepper span {
  min-width: 18px;
  text-align: center;
  font-size: 13px;
}

.sc-table-del {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 24px;
  border: 1px solid var(--sc-line);
  background: var(--sc-inset);
  border-radius: 6px;
  cursor: pointer;
  padding: 0;
  color: var(--sc-muted);
}

.sc-table-del:hover {
  background: #4a2c4a;
  border-color: var(--sc-danger);
  color: var(--sc-danger);
}

.sc-table-shape {
  position: absolute;
  background: var(--sc-panel);
  border: 2px solid var(--sc-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  touch-action: none;
  user-select: none;
  box-shadow: var(--sc-shadow);
}

.sc-table-shape:active {
  cursor: grabbing;
}

.sc-table-shape.is-rect {
  border-radius: 12px;
}

.sc-table-shape.is-oval {
  border-radius: 50%;
}

.sc-table-shape-label {
  font-family: Georgia, serif;
  font-size: 13px;
  color: var(--sc-accent-soft);
  pointer-events: none;
  text-align: center;
  padding: 0 6px;
}

.sc-table-shape-input {
  width: 80%;
  max-width: 130px;
  font-family: Georgia, serif;
  font-size: 13px;
  text-align: center;
  padding: 3px 4px !important;
  border-color: var(--sc-accent) !important;
  border-radius: 6px;
}

/* ---------- Seat ---------- */
.sc-seat {
  position: absolute;
  width: 46px;
  height: 46px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: #2a2350;
  border: 1.5px solid #453c72;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 9.5px;
  color: var(--sc-faint);
  overflow: visible;
  transition: box-shadow 0.1s;
}

.sc-seat:hover {
  box-shadow: 0 0 0 3px rgba(179, 157, 219, 0.35);
}

.sc-seat.is-over {
  box-shadow: 0 0 0 3px var(--sc-accent);
}

.sc-seat.is-occupied {
  background: var(--c, var(--sc-accent));
  border-color: rgba(0, 0, 0, 0.25);
  color: #1d1832;
  cursor: grab;
}

.sc-seat.is-occupied:active {
  cursor: grabbing;
}

.sc-seat-label {
  padding: 0 2px;
  pointer-events: none;
}

/* First name shown by default, wrapping up to two lines inside the circle. */
.sc-seat-first {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.05;
  text-align: center;
  word-break: break-word;
  padding: 0 3px;
  font-weight: 700;
  pointer-events: none;
}

.sc-seat-full {
  display: none;
  pointer-events: none;
}

/* Hover expands the seat into a pill showing the complete name. */
.sc-seat.is-occupied:hover {
  width: auto;
  height: auto;
  min-width: 46px;
  min-height: 46px;
  padding: 6px 12px;
  border-radius: 16px;
  z-index: 40;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.5);
}

.sc-seat.is-occupied:hover .sc-seat-first {
  display: none;
}

.sc-seat.is-occupied:hover .sc-seat-full {
  display: inline;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 700;
}

/* ---------- Seat popup ---------- */
.sc-popup-backdrop {
  position: fixed;
  inset: 0;
  z-index: 20;
}

.sc-popup {
  position: fixed;
  z-index: 21;
  width: 250px;
  background: var(--sc-panel);
  border: 1px solid var(--sc-line);
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.55);
  padding: 10px;
  text-align: left;
}

.sc-popup-current {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 4px 8px;
  border-bottom: 1px solid var(--sc-line);
  margin-bottom: 8px;
}

.sc-popup-current-name {
  flex: 1;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sc-popup-search {
  width: 100%;
  margin-bottom: 8px;
}

.sc-popup-list {
  max-height: 220px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sc-popup-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-align: left;
  border: none;
  background: none;
  padding: 7px 8px;
  border-radius: 7px;
  cursor: pointer;
  font: inherit;
  color: var(--sc-ink);
}

.sc-popup-item:hover {
  background: var(--sc-raised);
}

.sc-popup-empty {
  color: var(--sc-muted);
  font-size: 13px;
  padding: 8px;
  text-align: center;
}

/* ---------- Narrow screens ---------- */
@media (max-width: 900px) {
  .sc-app {
    flex-direction: column;
    height: auto;
    min-height: 0;
  }

  /* Stacked: the sidebar sizes to its content and the page does the scrolling,
     rather than clipping the panel mid-row. */
  .sc-app:not(:fullscreen) .sc-sidebar {
    width: 100%;
    flex: 0 0 auto;
    overflow: visible;
    border-right: none;
    border-bottom: 1px solid var(--sc-line);
  }

  .sc-app:not(:fullscreen) .sc-pool-panel {
    min-height: 0;
  }

  .sc-app:not(:fullscreen) .sc-pool {
    max-height: 220px;
  }

  .sc-app:not(:fullscreen) .sc-canvas-wrap {
    flex: 0 0 auto;
    height: 70vh;
  }

  .sc-expand {
    display: none;
  }

  .sc-intro h1 {
    font-size: 1.5rem;
  }
}
</style>
