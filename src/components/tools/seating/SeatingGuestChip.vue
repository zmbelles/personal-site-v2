<template>
  <div
    class="sc-chip"
    draggable="true"
    :style="{ '--c': colorFor(guest.name) }"
    :title="guest.name"
    @dragstart="onDragStart"
  >
    <span class="sc-dot"></span>
    <span class="sc-chip-name">{{ guest.name }}</span>
    <button
      v-if="removable"
      class="sc-chip-x"
      title="Remove guest"
      @click="$emit('remove', guest.id)"
    >
      ×
    </button>
  </div>
</template>

<script setup>
import { colorFor } from "./store.js";

const props = defineProps({
  guest: { type: Object, required: true },
  removable: { type: Boolean, default: false },
});

defineEmits(["remove"]);

function onDragStart(e) {
  e.dataTransfer.setData("text/guest", props.guest.id);
  e.dataTransfer.effectAllowed = "move";
}
</script>
