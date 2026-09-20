<template>
  <div class="cd-backdrop" @mousedown.self="dismiss">
    <div
      ref="card"
      class="cd"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cd-title"
      aria-describedby="cd-body"
    >
      <span class="cd-cup"><CoffeeIcon /></span>

      <h2 id="cd-title">Enjoying this?</h2>
      <p id="cd-body">
        {{ thing }} is free and always will be, no account, no watermark, and
        nothing you type ever leaves your browser. It also takes a real person
        real time and energy to build and keep working. If it saved you some
        trouble, would you buy me a coffee?
      </p>

      <div class="cd-actions">
        <a
          ref="first"
          class="btn cd-coffee"
          :href="url"
          target="_blank"
          rel="noopener"
          @click="support"
        >
          <CoffeeIcon class="cd-btn-icon" /> Buy me a coffee
        </a>
        <button type="button" class="btn btn--ghost" @click="dismiss">
          No thanks
        </button>
      </div>

      <p class="cd-note">Either way, your {{ noun }} is on its way.</p>

      <!-- Already only once a session, but someone churning out a batch should
           be able to switch it off for good rather than trusting that. -->
      <button type="button" class="cd-never" @click="never">
        Don't ask again
      </button>
    </div>
  </div>
</template>

<script>
import CoffeeIcon from "./CoffeeIcon.vue";
import { COFFEE_URL, markNeverAsk, markSupported } from "./coffee.js";

export default {
  name: "CoffeeDialog",
  components: { CoffeeIcon },
  props: {
    /** What the reader just used, e.g. "This invoice generator". */
    thing: { type: String, default: "This tool" },
    /** What they are about to receive, e.g. "PDF", "download". */
    noun: { type: String, default: "download" },
  },
  emits: ["close"],
  data() {
    return { url: COFFEE_URL };
  },
  mounted() {
    document.addEventListener("keydown", this.onKeydown);
    this.$nextTick(() => this.$refs.first?.focus());
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.onKeydown);
  },
  methods: {
    onKeydown(event) {
      if (event.key === "Escape") this.dismiss();
      // A modal that leaks focus to the page behind it is a modal in name only.
      if (event.key === "Tab") this.keepFocusInside(event);
    },
    keepFocusInside(event) {
      const focusable = this.$refs.card?.querySelectorAll("a[href], button");
      if (!focusable || !focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    support() {
      // The link opens in its own tab; this only records that they said yes.
      markSupported();
      this.$emit("close");
    },
    never() {
      markNeverAsk();
      this.$emit("close");
    },
    dismiss() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.cd-backdrop {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: var(--gutter);
  background: rgba(10, 8, 18, 0.72);
  backdrop-filter: blur(3px);
  animation: cd-fade 0.18s ease;
}

.cd {
  position: relative;
  width: min(440px, 100%);
  padding: 30px clamp(22px, 4vw, 32px) 24px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow);
  text-align: center;
  animation: cd-rise 0.22s var(--ease);
}

.cd-cup {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin: 0 auto 16px;
  border-radius: 16px;
  background: rgba(255, 221, 0, 0.12);
  border: 1px solid rgba(255, 221, 0, 0.3);
  color: #ffdd00;
  font-size: 26px;
}

.cd-btn-icon {
  font-size: 17px;
}

.cd h2 {
  margin: 0 0 10px;
  font-size: 1.375rem;
  font-weight: 600;
}

.cd p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9375rem;
  line-height: 1.6;
}

.cd-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin: 22px 0 0;
}

/* Buy Me a Coffee's own yellow, so the button is recognisable at a glance. */
.cd-coffee {
  color: #1a1628;
  background: #ffdd00;
  border-color: #ffdd00;
  font-weight: 700;
}

.cd-coffee:hover {
  color: #1a1628;
  background: #ffe633;
  box-shadow: 0 10px 26px -12px rgba(255, 221, 0, 0.8);
}

.cd-note {
  margin-top: 16px;
  font-size: 0.8125rem;
  color: var(--text-faint);
}

/* Deliberately quiet: available, but not competing with the actual answer. */
.cd-never {
  margin-top: 12px;
  padding: 4px 8px;
  border: 0;
  background: none;
  color: var(--text-faint);
  font: inherit;
  font-size: 0.75rem;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
  transition: color 0.15s ease;
}

.cd-never:hover {
  color: var(--text-muted);
}

@keyframes cd-fade {
  from { opacity: 0; }
}

@keyframes cd-rise {
  from { opacity: 0; transform: translateY(10px); }
}

@media (prefers-reduced-motion: reduce) {
  .cd-backdrop,
  .cd {
    animation: none;
  }
}
</style>
