<template>
  <div
    class="sc-seat"
    :class="{ 'is-occupied': !!guest, 'is-over': over }"
    :style="{ left: x + 'px', top: y + 'px', '--c': guest ? colorFor(guest.name) : undefined }"
    :title="guest ? guest.name : `Seat ${index + 1} — click to assign`"
    :draggable="!!guest"
    @dragstart="onDragStart"
    @dragover.prevent="over = true"
    @dragleave="over = false"
    @drop.prevent="onDrop"
    @click="$emit('open', seatId, $event)"
  >
    <template v-if="guest">
      <span class="sc-seat-first">{{ firstName(guest.name) }}</span>
      <span class="sc-seat-full">{{ guest.name }}</span>
    </template>
    <span v-else class="sc-seat-label">{{ index + 1 }}</span>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useSeatingStore, colorFor, firstName } from "./store.js";

const props = defineProps({
  seatId: { type: String, required: true },
  index: { type: Number, required: true },
  guest: { type: Object, default: null },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

defineEmits(["open"]);

const store = useSeatingStore();
const over = ref(false);

function onDragStart(e) {
  if (!props.guest) return;
  e.dataTransfer.setData("text/guest", props.guest.id);
  e.dataTransfer.effectAllowed = "move";
}

function onDrop(e) {
  over.value = false;
  const gid = e.dataTransfer.getData("text/guest");
  if (gid) store.assign(gid, props.seatId);
}
</script>
