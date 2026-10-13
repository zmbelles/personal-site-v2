<template>
  <div class="helpful">
    <header class="container page-hero">
      <p class="eyebrow">Helpful pages</p>
      <h1>Free tools for everyday jobs</h1>
      <p>
        Small, useful things that run entirely in your browser. No account, no
        sign-up, and nothing to install.
      </p>
    </header>

    <div class="container grid">
      <router-link to="/tools/gas-finder" class="card card--link tool">
        <div class="art art-gas" aria-hidden="true">
          <span v-for="s in pumps" :key="s.x" class="pump" :class="{ best: s.best }" :style="{ left: s.x + '%', top: s.y + '%' }">
            {{ s.price }}
          </span>
          <span class="you"></span>
        </div>
        <h2>Cheapest Gas Finder <span class="badge">New</span></h2>
        <p>Ranks nearby stations by what a fill-up really costs once the drive there is counted, not just the sign price.</p>
        <span class="arrow-link">Find gas</span>
      </router-link>

      <router-link to="/seating-chart" class="card card--link tool">
        <div class="art art-seat" aria-hidden="true">
          <span v-for="n in 3" :key="n" class="table">
            <i v-for="k in 6" :key="k" :style="{ transform: `rotate(${k * 60}deg) translateY(-26px)` }"></i>
          </span>
        </div>
        <h2>Wedding Seating Chart Maker</h2>
        <p>Drag-and-drop seating for weddings and events. Import a guest list, arrange your tables, export a PNG, CSV, or JSON.</p>
        <span class="arrow-link">Plan your seating</span>
      </router-link>

      <router-link to="/forms" class="card card--link tool">
        <div class="art art-doc" aria-hidden="true">
          <div class="doc">
            <span class="doc-bar"></span>
            <span class="doc-line w70"></span>
            <span class="doc-line w45"></span>
            <span class="doc-row"></span>
            <span class="doc-row"></span>
            <span class="doc-line w30 right"></span>
          </div>
        </div>
        <h2>Business Forms</h2>
        <p>Invoice, sales order, purchase order, and bill generators. Fill in the fields and download a printable PDF.</p>
        <span class="arrow-link">Make one</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelpfulPages",
  data() {
    return {
      pumps: [
        { x: 58, y: 22, price: "$3.49", best: true },
        { x: 14, y: 62, price: "$3.52" },
        { x: 70, y: 66, price: "$3.39" },
      ],
    };
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding-bottom: clamp(64px, 10vw, 112px);
}

.tool {
  display: flex;
  flex-direction: column;
}

.tool h2 {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0 8px;
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--text);
}

.tool p {
  margin: 0 0 20px;
  color: var(--text-muted);
}

.art {
  position: relative;
  aspect-ratio: 16 / 10;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--bg-deep);
  overflow: hidden;
}

/* gas */
.art-gas {
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 28px 28px;
}

.pump {
  position: absolute;
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--surface-2);
  border: 1px solid var(--border-strong);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.pump.best {
  background: var(--gradient);
  border-color: transparent;
  color: #1b1830;
  font-weight: 600;
}

.you {
  position: absolute;
  left: 44%;
  top: 46%;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 6px rgba(179, 157, 219, 0.25);
}

/* seating */
.art-seat {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 34px;
}

.table {
  position: relative;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--surface-2);
  border: 1px solid var(--border-strong);
}

.table i {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 10px;
  height: 10px;
  margin: -5px 0 0 -5px;
  border-radius: 50%;
  background: var(--mauve);
}

/* forms */
.art-doc {
  display: grid;
  place-items: center;
}

.doc {
  display: flex;
  flex-direction: column;
  gap: 7px;
  width: 62%;
  padding: 14px 16px;
  border-radius: 6px;
  background: #f4f1fa;
}

.doc-bar {
  width: 22px;
  height: 22px;
  border-radius: 5px;
  background: var(--gradient);
}

.doc-line,
.doc-row {
  height: 5px;
  border-radius: 3px;
  background: #d9d3e8;
}

.doc-row {
  height: 8px;
  background: #e6e1f0;
}

.w70 { width: 70%; }
.w45 { width: 45%; }
.w30 { width: 30%; }
.right { align-self: flex-end; }

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
