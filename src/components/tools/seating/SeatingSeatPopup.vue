<template>
  <div class="sc-popup-backdrop" @click="$emit('close')"></div>
  <div class="sc-popup" :style="{ left: menu.x + 'px', top: menu.y + 'px' }" @click.stop>
    <div v-if="occupant" class="sc-popup-current">
      <span class="sc-dot" :style="{ '--c': colorFor(occupant.name) }"></span>
      <span class="sc-popup-current-name">{{ occupant.name }}</span>
      <button class="sc-btn sc-tiny" @click="clear">Clear</button>
    </div>

    <input
      ref="searchRef"
      v-model="q"
      class="sc-popup-search"
      placeholder="Search unassigned guests…"
    />

    <div class="sc-popup-list">
      <div v-if="!matches.length" class="sc-popup-empty">No unassigned guests</div>
      <button
        v-for="g in matches"
        :key="g.id"
        class="sc-popup-item"
        @click="pick(g)"
      >
        <span class="sc-dot" :style="{ '--c': colorFor(g.name) }"></span>
        {{ g.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useSeatingStore, colorFor } from "./store.js";

const props = defineProps({
  menu: { type: Object, required: true },
});

const emit = defineEmits(["close"]);

const store = useSeatingStore();
const q = ref("");
const searchRef = ref(null);

const occupant = computed(() => {
  const id = store.state.assignments[props.menu.seatId];
  return id ? store.guestById.value[id] : null;
});

const matches = computed(() =>
  store.unassigned.value.filter((g) =>
    g.name.toLowerCase().includes(q.value.toLowerCase())
  )
);

onMounted(() => searchRef.value?.focus());

function clear() {
  store.clearSeat(props.menu.seatId);
  emit("close");
}

function pick(guest) {
  store.assign(guest.id, props.menu.seatId);
  emit("close");
}
</script>
