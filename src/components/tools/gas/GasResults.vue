<template>
  <div class="gr">
    <div v-if="plan.best" class="gr-best">
      <p class="eyebrow">Best place to fill up</p>
      <h3>{{ plan.best.station.name }}</h3>
      <p class="gr-best-meta">
        {{ perGallon(plan.best.price) }}/gal · {{ distanceText(plan.best) }}
        <template v-if="plan.best.station.address"> · {{ plan.best.station.address }}</template>
      </p>
      <p class="gr-best-total">
        <strong>{{ dollars(plan.best.totalCost) }}</strong>
        to fill {{ gallons(plan.needGallons) }}, including {{ dollars(plan.best.travelCost) }} of gas spent
        {{ destination ? "on the detour" : "on the drive" }}
      </p>
      <a :href="directions(plan.best.station)" target="_blank" rel="noopener" class="btn btn--primary btn--sm">
        Directions
      </a>
    </div>

    <p v-if="plan.stickerIsMisleading" class="gr-callout">
      <b>{{ plan.cheapestSticker.station.name }}</b> has the lowest sign price at
      {{ perGallon(plan.cheapestSticker.price) }}, but it
      {{ destination ? `adds ${miles(plan.cheapestSticker.detourMiles, plan.cheapestSticker.estimated)} to your trip` : `is ${miles(plan.cheapestSticker.oneWayMiles, plan.cheapestSticker.estimated)} away` }}.
      The extra driving costs more than it saves, so you'd pay
      <b>{{ dollars(plan.cheapestSticker.extraVsBest) }} more</b> going there.
    </p>

    <p v-if="!plan.options.length" class="gr-none">
      No {{ gradeLabel.toLowerCase() }} prices for these stations yet.
      <template v-if="plan.unpriced.length">Type in what you see on the signs below and they'll be ranked as you go.</template>
    </p>

    <p v-if="loadingMore" class="gr-loading">Still loading more stations…</p>

    <ol v-if="plan.options.length" class="gr-list">
      <li
        v-for="(o, i) in plan.options.slice(0, shownPriced)"
        :key="o.station.id"
        class="gr-row"
        :class="{ 'is-best': o === plan.best, 'is-out': !o.reachable }"
      >
        <span class="gr-rank">{{ o.reachable ? i + 1 : "–" }}</span>
        <div class="gr-main">
          <p class="gr-name">
            <a :href="directions(o.station)" target="_blank" rel="noopener">{{ o.station.name }}</a>
            <span v-if="o.station.source !== 'google'" class="gr-tag">your price</span>
          </p>
          <p class="gr-sub">
            {{ distanceText(o) }}
            <template v-if="o.station.address"> · {{ o.station.address }}</template>
            <template v-if="updatedAgo(o)"> · updated {{ updatedAgo(o) }}</template>
          </p>
        </div>
        <div class="gr-nums">
          <span class="gr-price">{{ perGallon(o.price) }}</span>
          <span class="gr-total">{{ dollars(o.totalCost) }}</span>
          <span v-if="!o.reachable" class="gr-diff gr-diff--bad">out of range</span>
          <span v-else-if="o.extraVsBest > 0.005" class="gr-diff">+{{ dollars(o.extraVsBest) }}</span>
          <span v-else class="gr-diff gr-diff--good">best</span>
        </div>
      </li>
    </ol>
    <button
      v-if="plan.options.length > shownPriced"
      type="button"
      class="btn btn--ghost btn--sm gr-more"
      @click="shownPriced += PAGE"
    >
      Show {{ Math.min(PAGE, plan.options.length - shownPriced) }} more
    </button>

    <details v-if="plan.unpriced.length" class="gr-unpriced" :open="unpricedOpen" @toggle="unpricedOpen = $event.target.open">
      <summary>
        {{ plan.unpriced.length }} nearby station{{ plan.unpriced.length === 1 ? "" : "s" }}
        without a {{ gradeLabel.toLowerCase() }} price: add one
      </summary>
      <ul>
        <li v-for="u in plan.unpriced.slice(0, shownUnpriced)" :key="u.station.id">
          <div class="gr-main">
            <p class="gr-name">{{ u.station.name }}</p>
            <p class="gr-sub">
              {{ distanceText(u) }}<template v-if="u.station.address"> · {{ u.station.address }}</template>
            </p>
          </div>
          <label class="gr-price-input">
            <span class="sr-only">{{ gradeLabel }} price at {{ u.station.name }}</span>
            <span aria-hidden="true">$</span>
            <input
              type="number"
              inputmode="decimal"
              min="0"
              step="0.01"
              placeholder="0.00"
              @change="onPrice(u.station.id, $event)"
            />
          </label>
        </li>
      </ul>
      <button
        v-if="plan.unpriced.length > shownUnpriced"
        type="button"
        class="btn btn--ghost btn--sm gr-more"
        @click="shownUnpriced += PAGE"
      >
        Show {{ Math.min(PAGE, plan.unpriced.length - shownUnpriced) }} more
      </button>
    </details>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { directionsUrl, FUEL_LABELS } from "@/core/gas";

const props = defineProps({
  plan: { type: Object, required: true },
  grade: { type: String, required: true },
  origin: { type: Object, default: null },
  destination: { type: Object, default: null },
  loadingMore: { type: Boolean, default: false },
});
const emit = defineEmits(["set-price"]);

const gradeLabel = computed(() => FUEL_LABELS[props.grade]);

// Not bound to plan.options, or entering the first price would collapse the list.
const unpricedOpen = ref(!props.plan.options.length);

const PAGE = 10;
const shownPriced = ref(PAGE);
const shownUnpriced = ref(PAGE);

const dollars = (n) => `$${n.toFixed(2)}`;
// Pumps post tenths of a cent ($3.499); show them only when present.
// "≈" marks distances estimated without a routing service.
const perGallon = (n) => `$${n.toFixed(Math.round(n * 1000) % 10 ? 3 : 2)}`;
const miles = (n, estimated = false) => `${estimated ? "≈" : ""}${n < 10 ? n.toFixed(1) : Math.round(n)} mi`;
const gallons = (n) => `${n.toFixed(1)} gal`;

function distanceText(o) {
  const e = o.estimated;
  if (!props.destination) return `${miles(o.oneWayMiles, e)} away`;
  if (o.detourMiles < 0.25) return `on your way, ${miles(o.alongMiles, e)} into the trip`;
  return `+${miles(o.detourMiles, e)} detour, ${miles(o.alongMiles, e)} into the trip`;
}

const directions = (station) =>
  directionsUrl(station, { origin: props.origin, destination: props.destination });

function updatedAgo(o) {
  const at = o.station.prices[props.grade]?.updatedAt;
  if (!at) return "";
  const hours = (Date.now() - new Date(at).getTime()) / 36e5;
  if (hours < 1) return "just now";
  if (hours < 24) return `${Math.round(hours)}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function onPrice(stationId, event) {
  const value = parseFloat(event.target.value);
  if (value > 0) emit("set-price", stationId, value);
}
</script>

<style scoped>
.gr-best {
  padding: 20px 22px;
  border: 1px solid rgba(179, 157, 219, 0.45);
  border-radius: var(--radius);
  background: linear-gradient(140deg, rgba(139, 127, 208, 0.18), rgba(192, 141, 190, 0.08));
}

.gr-best h3 {
  margin: 4px 0 6px;
  font-size: 1.5rem;
  font-weight: 600;
}

.gr-best-meta {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9375rem;
}

.gr-best-total {
  margin: 12px 0 16px;
  color: var(--text-soft);
}

.gr-best-total strong {
  font-family: var(--font-display);
  font-size: 1.375rem;
  color: var(--text);
}

.gr-loading {
  margin: 14px 0 0;
  color: var(--text-faint);
  font-size: 0.8125rem;
}

.gr-more {
  margin-top: 12px;
}

.gr-callout {
  margin: 14px 0 0;
  padding: 14px 16px;
  border-left: 3px solid var(--pink);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text-soft);
  font-size: 0.9375rem;
}

.gr-none {
  color: var(--text-muted);
}

.gr-list,
.gr-unpriced ul {
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}

.gr-row,
.gr-unpriced li {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 4px;
  border-top: 1px solid var(--border);
}

.gr-row.is-out {
  opacity: 0.55;
}

.gr-rank {
  flex: none;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--surface-2);
  color: var(--text-muted);
  font-size: 0.8125rem;
  font-weight: 600;
}

.gr-row.is-best .gr-rank {
  background: var(--gradient);
  color: #1b1830;
}

.gr-main {
  flex: 1;
  min-width: 0;
}

.gr-name {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  color: var(--text);
  font-weight: 500;
}

.gr-name a {
  color: inherit;
}

.gr-name a:hover {
  color: var(--pink);
}

.gr-tag {
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--text-faint);
  font-size: 0.6875rem;
  font-weight: 500;
}

.gr-sub {
  margin: 2px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-faint);
  font-size: 0.8125rem;
}

.gr-nums {
  flex: none;
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 14px;
  row-gap: 2px;
  justify-items: end;
  align-items: baseline;
  font-variant-numeric: tabular-nums;
}

.gr-price {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.gr-total {
  color: var(--text);
  font-weight: 600;
}

.gr-diff {
  grid-column: 2;
  color: var(--text-faint);
  font-size: 0.75rem;
}

.gr-diff--good {
  color: #9ad3b0;
}

.gr-diff--bad {
  color: #ef8f8f;
}

.gr-unpriced {
  margin-top: 22px;
}

.gr-unpriced summary {
  cursor: pointer;
  color: var(--accent);
  font-size: 0.9375rem;
}

.gr-price-input {
  flex: none;
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
}

.gr-price-input input {
  width: 84px;
  height: 38px;
  padding: 0 10px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--bg-deep);
  color: var(--text);
  font: inherit;
}
</style>
