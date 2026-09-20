<template>
  <aside class="cr" :class="{ 'cr--wide': wide }">
    <span class="cr-badge"><CoffeeIcon /></span>

    <h2 class="cr-title">{{ heading }}</h2>
    <p class="cr-copy">
      <slot>
        Free, no sign-up, nothing uploaded — and built and maintained by one
        person in his own time. If it saved you some, a coffee goes a long way.
      </slot>
    </p>

    <a
      class="cr-btn"
      :href="url"
      target="_blank"
      rel="noopener"
      aria-label="Buy me a coffee — opens buymeacoffee.com in a new tab"
    >
      Buy me a coffee
    </a>
  </aside>
</template>

<script>
import CoffeeIcon from "./CoffeeIcon.vue";
import { COFFEE_URL } from "./coffee.js";

export default {
  name: "CoffeeRail",
  components: { CoffeeIcon },
  props: {
    heading: { type: String, default: "Free, and staying that way" },
    /**
     * Set on pages whose content is wider than the usual 1120px container, so
     * it knows how much margin it actually has to work with.
     */
    wide: { type: Boolean, default: false },
  },
  data() {
    return { url: COFFEE_URL };
  },
};
</script>

<style scoped>
/*
 * The support card, parked in the left margin and pinned so it rides along as
 * you scroll.
 *
 * It is fixed, so it is out of flow and cannot squeeze the content column —
 * the page stays exactly as wide as it was. Its width is derived from whatever
 * margin the viewport actually leaves, rather than being a fixed size that
 * looks marooned on a big screen, and it is centred in that margin.
 *
 * Nothing is needed to keep it out of the seating chart's full-screen mode: a
 * full-screen element renders in the top layer and the rest of the document is
 * not painted at all.
 */
.cr {
  /* The gap between the content column and the viewport edge. */
  --cr-margin: calc((100vw - var(--container)) / 2);
  /* As wide as that margin allows, up to a comfortable reading measure. */
  --cr-w: min(300px, calc(var(--cr-margin) - 44px));

  position: fixed;
  top: 50%;
  left: calc((var(--cr-margin) - var(--cr-w)) / 2);
  transform: translateY(-50%);
  z-index: 40;

  width: var(--cr-w);
  padding: 20px 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: linear-gradient(160deg, rgba(255, 221, 0, 0.09), rgba(255, 255, 255, 0.02)),
    var(--surface);
  box-shadow: var(--shadow);
  text-align: left;
}

/* The seating chart's app shell is 1400px, not 1120px. */
.cr--wide {
  --cr-margin: calc((100vw - 1400px) / 2);
}

.cr-badge {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  margin-bottom: 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 221, 0, 0.3);
  background: rgba(255, 221, 0, 0.12);
  color: #ffdd00;
  font-size: 21px;
}

.cr-title {
  margin: 0 0 6px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text);
}

.cr-copy {
  margin: 0 0 16px;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: var(--text-muted);
}

.cr-btn {
  display: block;
  padding: 9px 12px;
  border-radius: 999px;
  background: #ffdd00;
  color: #1a1628;
  font: 700 0.8125rem/1 var(--font-sans);
  text-align: center;
  text-decoration: none;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.cr-btn:hover {
  color: #1a1628;
  background: #ffe84d;
  box-shadow: 0 8px 22px -8px rgba(255, 221, 0, 0.7);
}

/*
 * Three sizes, because the margin is whatever the viewport leaves over:
 *   full card  — room for the heading and the copy
 *   compact    — cup and button only, still filling the margin
 *   corner cup — no usable margin at all, so it tucks into the corner
 * The corner rules come last so they win when both queries match.
 */
@media (max-width: 1629px) {
  .cr:not(.cr--wide) {
    padding: 14px 12px;
    text-align: center;
  }

  .cr:not(.cr--wide) .cr-badge {
    margin: 0 auto 10px;
  }

  .cr:not(.cr--wide) .cr-title,
  .cr:not(.cr--wide) .cr-copy {
    display: none;
  }

  .cr:not(.cr--wide) .cr-btn {
    padding: 8px 6px;
    font-size: 0.75rem;
  }
}

@media (max-width: 1909px) {
  .cr--wide {
    padding: 14px 12px;
    text-align: center;
  }

  .cr--wide .cr-badge {
    margin: 0 auto 10px;
  }

  .cr--wide .cr-title,
  .cr--wide .cr-copy {
    display: none;
  }

  .cr--wide .cr-btn {
    padding: 8px 6px;
    font-size: 0.75rem;
  }
}

@media (max-width: 1339px) {
  .cr:not(.cr--wide) {
    --cr-w: 40px;
    top: auto;
    bottom: clamp(14px, 3vw, 22px);
    left: clamp(12px, 2.5vw, 18px);
    transform: none;
    height: 40px;
    padding: 0;
    border-radius: 12px;
    border-color: rgba(255, 221, 0, 0.4);
  }

  .cr:not(.cr--wide) .cr-badge {
    margin: 0;
    border: 0;
    background: none;
    width: 100%;
    height: 100%;
  }

  .cr:not(.cr--wide) .cr-btn {
    /* The whole card is the link at this size — see the overlay below. */
    position: absolute;
    inset: 0;
    padding: 0;
    border-radius: 12px;
    background: none;
    font-size: 0;
  }

  .cr:not(.cr--wide) .cr-btn:hover {
    background: rgba(255, 221, 0, 0.12);
    box-shadow: none;
  }
}

@media (max-width: 1674px) {
  .cr--wide {
    --cr-w: 40px;
    top: auto;
    bottom: clamp(14px, 3vw, 22px);
    left: clamp(12px, 2.5vw, 18px);
    transform: none;
    height: 40px;
    padding: 0;
    border-radius: 12px;
    border-color: rgba(255, 221, 0, 0.4);
  }

  .cr--wide .cr-badge {
    margin: 0;
    border: 0;
    background: none;
    width: 100%;
    height: 100%;
  }

  .cr--wide .cr-btn {
    position: absolute;
    inset: 0;
    padding: 0;
    border-radius: 12px;
    background: none;
    font-size: 0;
  }

  .cr--wide .cr-btn:hover {
    background: rgba(255, 221, 0, 0.12);
    box-shadow: none;
  }
}

@media print {
  .cr {
    display: none;
  }
}
</style>
