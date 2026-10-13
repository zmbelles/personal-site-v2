<template>
  <div class="vp">
    <div class="vp-filters">
      <label class="field">
        <span>Year</span>
        <select v-model.number="year" :disabled="!vehicles">
          <option :value="0">Any year</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </label>
      <label class="field">
        <span>Make</span>
        <select v-model="make" :disabled="!vehicles">
          <option value="">Any make</option>
          <option v-for="m in makes" :key="m" :value="m">{{ m }}</option>
        </select>
      </label>
      <label class="field field--grow">
        <span>Search</span>
        <input
          v-model="query"
          type="search"
          placeholder="e.g. Camry hybrid"
          :disabled="!vehicles"
          autocomplete="off"
        />
      </label>
    </div>

    <p v-if="vehicles" class="vp-hint" :class="{ 'vp-hint--next': selectedModel }">
      <template v-if="!selectedModel">
        <b>Click your car</b> in the list to see its engine and transmission options.
      </template>
      <template v-else-if="selectedModel.variants.length > 1">
        <b>Now pick your engine.</b> The {{ selectedModel.year }} {{ selectedModel.model }} comes in
        {{ selectedModel.variants.length }} versions, listed under it; the base engine is chosen until you do.
      </template>
      <template v-else>
        <b>{{ selectedModel.year }} {{ selectedModel.make }} {{ selectedModel.model }}</b> selected. It has one engine option.
      </template>
    </p>

    <div class="vp-table-wrap">
      <table class="vp-table">
        <caption class="sr-only">Vehicles: pick yours, then its engine and transmission, to load fuel economy and tank size</caption>
        <thead>
          <tr>
            <th scope="col">Year</th>
            <th scope="col">Make</th>
            <th scope="col">Model</th>
            <th scope="col" class="num">MPG</th>
            <th scope="col" class="num">Tank</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!vehicles">
            <td colspan="5" class="vp-empty">Loading vehicles…</td>
          </tr>
          <tr v-else-if="!filtered.length">
            <td colspan="5" class="vp-empty">No vehicles match. Try fewer words.</td>
          </tr>
          <template v-for="v in visible" :key="v.id">
            <tr
              class="vp-row"
              :class="{ 'is-selected': selectedId === v.id, 'is-open': expandedId === v.id }"
              tabindex="0"
              :aria-expanded="v.variants.length > 1 ? String(expandedId === v.id) : undefined"
              @click="pickModel(v)"
              @keydown.enter.prevent="pickModel(v)"
              @keydown.space.prevent="pickModel(v)"
            >
              <td>{{ v.year }}</td>
              <td>{{ v.make }}</td>
              <td class="vp-model">
                {{ v.model }}
                <span v-if="v.variants.length > 1" class="vp-count">
                  {{ v.variants.length }} versions <span class="vp-chevron" aria-hidden="true">▾</span>
                </span>
              </td>
              <td class="num">{{ v.mpgMin === v.mpgMax ? v.mpgMin : `${v.mpgMin}–${v.mpgMax}` }}</td>
              <td class="num">{{ v.tankGallons }} gal<sup title="Estimated">*</sup></td>
            </tr>
            <template v-if="expandedId === v.id && v.variants.length > 1">
              <tr
                v-for="variant in v.variants"
                :key="variant.id"
                class="vp-variant"
                :class="{ 'is-selected': selectedVariantId === variant.id }"
                tabindex="0"
                @click="$emit('select', v, variant)"
                @keydown.enter.prevent="$emit('select', v, variant)"
                @keydown.space.prevent="$emit('select', v, variant)"
              >
                <td></td>
                <td colspan="2">
                  <span class="vp-radio" aria-hidden="true"></span>
                  {{ variant.label }}
                  <span class="vp-fuel">{{ variant.fuel }}</span>
                </td>
                <td class="num">{{ variant.mpg }}</td>
                <td></td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>

    <div v-if="vehicles" class="vp-foot">
      <span>{{ filtered.length.toLocaleString() }} vehicles</span>
      <button v-if="filtered.length > limit" type="button" class="btn btn--ghost btn--sm" @click="limit += PAGE">
        Show more
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { filterVehicles, makesFor, yearsOf } from "@/core/gas";

const props = defineProps({
  vehicles: { type: Array, default: null },
  selectedId: { type: String, default: "" },
  selectedVariantId: { type: String, default: "" },
});
const emit = defineEmits(["select"]);

const PAGE = 25;
const year = ref(0);
const make = ref("");
const query = ref("");
const limit = ref(PAGE);
const expandedId = ref(props.selectedId);

const years = computed(() => (props.vehicles ? yearsOf(props.vehicles) : []));
const makes = computed(() => (props.vehicles ? makesFor(props.vehicles, year.value || null) : []));
const filtered = computed(() =>
  props.vehicles
    ? filterVehicles(props.vehicles, { year: year.value || null, make: make.value, query: query.value })
    : []
);
const visible = computed(() => filtered.value.slice(0, limit.value));
const selectedModel = computed(
  () => (props.selectedId && props.vehicles?.find((v) => v.id === props.selectedId)) || null
);

watch([year, make, query], () => (limit.value = PAGE));

function pickModel(v) {
  const opening = expandedId.value !== v.id;
  expandedId.value = opening ? v.id : "";
  if (props.selectedId !== v.id) emit("select", v);
}
watch(makes, (list) => {
  if (make.value && !list.includes(make.value)) make.value = "";
});
</script>

<style scoped>
.vp-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 140px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-muted);
}

.field--grow {
  flex: 1 1 220px;
}

.field select,
.field input {
  height: 42px;
  padding: 0 12px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--bg-deep);
  color: var(--text);
  font: inherit;
  font-size: 0.9375rem;
}

.vp-hint {
  margin: 0 0 10px;
  padding: 10px 14px;
  border-left: 3px solid var(--accent);
  border-radius: var(--radius-sm);
  background: var(--bg-deep);
  color: var(--text-muted);
  font-size: 0.875rem;
}

.vp-hint b {
  color: var(--text);
}

.vp-hint--next {
  border-left-color: var(--pink);
}

.vp-table-wrap {
  max-height: 420px;
  overflow: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.vp-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9375rem;
}

.vp-table th {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 10px 12px;
  background: var(--surface-2);
  color: var(--text-soft);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-align: left;
}

.vp-table td {
  padding: 9px 12px;
  border-top: 1px solid var(--border);
  color: var(--text-soft);
}

.vp-table tbody tr {
  cursor: pointer;
}

.vp-table tbody tr:hover td {
  background: rgba(255, 255, 255, 0.03);
}

.vp-table tbody tr.is-selected td {
  background: rgba(179, 157, 219, 0.16);
  color: var(--text);
}

.vp-table .num {
  text-align: right;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.vp-table sup {
  color: var(--text-faint);
}

.vp-model {
  color: var(--text);
}

.vp-count {
  margin-left: 8px;
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--text-muted);
  font-size: 0.75rem;
  white-space: nowrap;
}

.vp-chevron {
  display: inline-block;
  transition: transform 0.2s ease;
}

.vp-row.is-open .vp-chevron {
  transform: rotate(180deg);
}

.vp-table tbody tr.vp-variant td {
  padding-block: 7px;
  border-top-color: transparent;
  background: var(--bg-deep);
  font-size: 0.875rem;
}

.vp-table tbody tr.vp-variant:hover td {
  background: rgba(255, 255, 255, 0.04);
}

.vp-table tbody tr.vp-variant.is-selected td {
  background: rgba(179, 157, 219, 0.16);
  color: var(--text);
}

.vp-radio {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 8px;
  vertical-align: -1px;
  border: 2px solid var(--border-strong);
  border-radius: 50%;
}

.vp-variant.is-selected .vp-radio {
  border-color: var(--mauve);
  background: radial-gradient(circle, var(--mauve) 40%, transparent 45%);
}

.vp-fuel {
  margin-left: 6px;
  color: var(--text-faint);
  font-size: 0.75rem;
  text-transform: capitalize;
}

.vp-empty {
  text-align: center;
  color: var(--text-faint) !important;
  cursor: default;
}

.vp-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.8125rem;
  color: var(--text-faint);
}

@media (max-width: 560px) {
  .field {
    flex: 1 1 calc(50% - 6px);
    min-width: 0;
  }
}
</style>
