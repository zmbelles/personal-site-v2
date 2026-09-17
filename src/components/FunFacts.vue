<template>
  <div class="facts">
    <div class="flip" :class="{ 'is-flipped': flipped }">
      <div class="face face--front" :aria-hidden="flipped ? 'true' : 'false'">
        <span class="face-label">Did you know</span>
        <p class="face-text">{{ current.front }}</p>
        <button type="button" class="btn btn--ghost btn--sm" :tabindex="flipped ? -1 : 0" @click="flipped = true">
          Reveal
        </button>
      </div>
      <div class="face face--back" :aria-hidden="flipped ? 'false' : 'true'" aria-live="polite">
        <span class="face-label">{{ current.front }}</span>
        <p class="face-text face-text--answer">{{ current.back }}</p>
        <button type="button" class="btn btn--primary btn--sm" :tabindex="flipped ? 0 : -1" @click="next">
          Next fact
        </button>
      </div>
    </div>

    <div class="facts-nav">
      <span class="count">{{ index + 1 }} / {{ facts.length }}</span>
      <div class="pips" aria-hidden="true">
        <span v-for="(fact, i) in facts" :key="fact.front" :class="{ active: i === index }"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { funFactsData } from "@/data/funFactsData.js";

export default {
  name: "FunFacts",
  data() {
    return {
      facts: funFactsData,
      index: 0,
      flipped: false,
    };
  },
  computed: {
    current() {
      return this.facts[this.index];
    },
  },
  methods: {
    next() {
      this.flipped = false;
      // Swap the text once the card has turned back so the next answer is never visible mid-flip.
      setTimeout(() => {
        this.index = (this.index + 1) % this.facts.length;
      }, 250);
    },
  },
};
</script>

<style scoped>
.facts {
  perspective: 1400px;
}

.flip {
  position: relative;
  display: grid;
  min-height: 280px;
  transform-style: preserve-3d;
  transition: transform 0.6s var(--ease);
}

.flip.is-flipped {
  transform: rotateY(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .flip {
    transition: none;
  }
}

.face {
  grid-area: 1 / 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: clamp(24px, 4vw, 36px);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-strong);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.face--front {
  background:
    radial-gradient(ellipse at 100% 0%, rgba(116, 103, 176, 0.35), transparent 60%),
    var(--surface);
}

.face--back {
  transform: rotateY(180deg);
  background:
    radial-gradient(ellipse at 0% 100%, rgba(224, 168, 205, 0.16), transparent 60%),
    var(--surface);
}

.face-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
}

.face-text {
  flex: 1;
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
  line-height: 1.2;
  color: var(--text);
}

.face-text--answer {
  font-family: var(--font-sans);
  font-size: clamp(1.0625rem, 1.8vw, 1.1875rem);
  font-weight: 400;
  line-height: 1.6;
  color: var(--text-soft);
}

.facts-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}

.count {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-faint);
}

.pips {
  display: flex;
  gap: 6px;
}

.pips span {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--border-strong);
  transition: width 0.3s var(--ease), background-color 0.3s ease;
}

.pips span.active {
  width: 20px;
  background: var(--mauve);
}
</style>
