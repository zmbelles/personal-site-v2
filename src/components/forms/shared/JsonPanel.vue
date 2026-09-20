<template>
  <div class="jp-backdrop" @mousedown.self="$emit('close')">
    <div
      class="jp"
      role="dialog"
      aria-modal="true"
      :aria-label="`Edit the ${spec.docTitle.toLowerCase()} as JSON`"
    >
      <header class="jp-head">
        <div>
          <h2>Edit as JSON</h2>
          <p>
            Paste a payload from your own system, or copy this one out to feed
            somewhere else. Unknown keys are ignored.
          </p>
        </div>
        <button type="button" class="jp-close" aria-label="Close" @click="$emit('close')">
          &times;
        </button>
      </header>

      <div class="jp-bar">
        <button type="button" class="btn btn--ghost btn--sm" @click="loadExample">
          Load example
        </button>
        <button type="button" class="btn btn--ghost btn--sm" @click="loadCurrent">
          Load current {{ spec.docNoun }}
        </button>
        <button type="button" class="btn btn--ghost btn--sm" @click="copy">
          {{ copied ? "Copied" : "Copy" }}
        </button>
        <button type="button" class="btn btn--ghost btn--sm" @click="$emit('download')">
          Download .json
        </button>
      </div>

      <!-- A real textarea handles the typing; the <pre> behind it only paints
           the colours. Keeping them in lockstep is a matter of identical font
           metrics, padding and scroll offset. -->
      <div class="jp-editor">
        <pre class="jp-paint" ref="paint" aria-hidden="true"><code
          class="language-json"
          v-html="painted"
        ></code></pre>
        <textarea
          ref="input"
          v-model="text"
          class="jp-input language-json"
          spellcheck="false"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          aria-label="JSON"
          @scroll="syncScroll"
        ></textarea>
      </div>

      <p v-if="error" class="jp-error" role="alert">{{ error }}</p>
      <p v-else class="jp-hint">
        {{ lineCount }} lines · applying replaces every field on the form.
      </p>

      <footer class="jp-foot">
        <button type="button" class="btn btn--ghost" @click="$emit('close')">Cancel</button>
        <button type="button" class="btn btn--primary" @click="apply">Apply to form</button>
      </footer>
    </div>
  </div>
</template>

<script>
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "@/themes/prism-night-owl.css";
import { addDays, toJson, todayIso } from "./transaction.js";

/**
 * The parts of the example that vary by document kind. exampleFor() below
 * wraps this in the shape every kind shares (company, currency, discount…).
 */
const KIND_EXAMPLES = {
  invoice: {
    number: "INV-1042",
    dueDateDays: 30,
    terms: "Net 30",
    billTo: "Northwind Millwork\nAttn: Accounts Payable\n900 Rand Road\nArlington Heights, IL 60004",
    lines: [
      { description: "Shop drawings and takeoff", quantity: 8, unit: "HR", rate: 125 },
      { description: "Fabrication and finishing", quantity: 34, unit: "HR", rate: 96 },
    ],
    shipping: 0,
    paid: 0,
    memo: "Thank you for your business. Remit by ACH or check using the invoice number above.",
  },
  "sales-order": {
    number: "SO-1042",
    dueDateDays: 18,
    terms: "Custom",
    billTo: "Northwind Millwork\nAttn: Accounts Payable\n900 Rand Road\nArlington Heights, IL 60004",
    shipTo: "Northwind Millwork, Dock 3\n914 Rand Road\nArlington Heights, IL 60004",
    reference: "LTL freight, prepaid",
    lines: [
      { description: "Steel shelving bay, powder coated", quantity: 12, unit: "EA", rate: 148.5, weight: 41.2 },
      { description: "Mounting hardware kit", quantity: 12, unit: "KIT", rate: 22, weight: 3.5 },
    ],
    shipping: 310,
    paid: 1000,
    memo: "Ships complete. Call the dock 24 hours ahead to schedule the delivery window.",
  },
  "purchase-order": {
    number: "PO-1042",
    dueDateDays: 21,
    terms: "Custom",
    billTo: "Timberline Steel Supply\nAttn: Order Desk\n4400 Industrial Pkwy\nJoliet, IL 60431",
    shipTo: "Lakeshore Fabrication, Receiving Dock\n118 Harbor Way\nNaperville, IL 60540",
    reference: "LTL freight, collect",
    lines: [
      { description: "Hot-rolled steel angle, 2x2x1/4", quantity: 40, unit: "FT", rate: 6.75, weight: 3.1 },
      { description: "Powder coat finishing service", quantity: 1, unit: "LOT", rate: 850, weight: 0 },
    ],
    shipping: 175,
    paid: 500,
    memo: "Please confirm lead time and ship complete. Call with any substitutions before fulfilling.",
  },
  "vendor-bill": {
    number: "BILL-1042",
    dueDateDays: 30,
    terms: "Net 30",
    billTo: "Northwind Millwork\nAttn: Accounts Payable\n900 Rand Road\nArlington Heights, IL 60004",
    poNumber: "PO-88120",
    lines: [
      { description: "Monthly hosting and maintenance", quantity: 1, unit: "EA", rate: 450 },
      { description: "Emergency after-hours support", quantity: 2, unit: "HR", rate: 175 },
    ],
    shipping: 0,
    paid: 0,
    memo: "Thank you for your business. Remit by ACH or check using the bill number above.",
  },
};

/** A filled-in document, so "Load example" shows the shape and the wording. */
function exampleFor(spec) {
  const kind = KIND_EXAMPLES[spec.kind] || KIND_EXAMPLES.invoice;
  // Dated relative to today, so the example never reads as stale.
  const date = addDays(todayIso(), -6);
  return {
    company: {
      name: "Lakeshore Fabrication",
      address: "118 Harbor Way\nSuite 400\nNaperville, IL 60540",
      phone: "(630) 555-0142",
      email: "billing@lakeshorefab.com",
      website: "lakeshorefab.com",
      slogan: "Built square, delivered on time.",
    },
    number: kind.number,
    ...(spec.showPoNumber ? { poNumber: kind.poNumber || "PO-88120" } : {}),
    date,
    dueDate: addDays(date, kind.dueDateDays),
    terms: kind.terms,
    status: spec.statuses[0],
    currency: "USD",
    billTo: kind.billTo,
    ...(spec.showShipTo ? { shipTo: kind.shipTo } : {}),
    ...(spec.referenceLabel ? { reference: kind.reference } : {}),
    lines: kind.lines,
    discountRate: 0,
    taxRate: 8.25,
    shipping: kind.shipping,
    paid: kind.paid,
    memo: kind.memo,
  };
}

export default {
  name: "JsonPanel",
  props: {
    spec: { type: Object, required: true },
    doc: { type: Object, required: true },
  },
  emits: ["apply", "close", "download"],
  data() {
    return { text: "", error: "", copied: false, copyTimer: null };
  },
  computed: {
    painted() {
      return Prism.highlight(this.text || "", Prism.languages.json, "json");
    },
    lineCount() {
      return this.text ? this.text.split("\n").length : 0;
    },
  },
  mounted() {
    this.loadCurrent();
    document.addEventListener("keydown", this.onKeydown);
    this.$nextTick(() => this.$refs.input?.focus());
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.onKeydown);
    clearTimeout(this.copyTimer);
  },
  methods: {
    onKeydown(event) {
      if (event.key === "Escape") this.$emit("close");
    },
    loadExample() {
      this.replaceWith(exampleFor(this.spec));
    },
    loadCurrent() {
      this.replaceWith(toJson(this.doc, this.spec));
    },
    replaceWith(payload) {
      this.text = JSON.stringify(payload, null, 2);
      this.error = "";
      // Swapping the contents under a scrolled textarea leaves you looking at
      // the middle of the new payload.
      this.$nextTick(() => {
        const field = this.$refs.input;
        if (!field) return;
        field.scrollTop = 0;
        field.setSelectionRange(0, 0);
        if (this.$refs.paint) this.$refs.paint.scrollTop = 0;
      });
    },
    async copy() {
      try {
        await navigator.clipboard.writeText(this.text);
      } catch {
        // Clipboard access can be refused; select the text so Ctrl+C still works.
        this.$refs.input?.select();
        return;
      }
      this.copied = true;
      clearTimeout(this.copyTimer);
      this.copyTimer = setTimeout(() => (this.copied = false), 1600);
    },
    apply() {
      let parsed;
      try {
        parsed = JSON.parse(this.text);
      } catch (error) {
        this.error = "That is not valid JSON — " + error.message;
        return;
      }
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        this.error = "Expected a JSON object, like the example.";
        return;
      }
      this.error = "";
      this.$emit("apply", parsed);
    },
    // Tab deliberately moves focus rather than indenting: trapping it inside a
    // modal leaves keyboard users with no way out, and this box is for pasting.
    syncScroll(event) {
      const paint = this.$refs.paint;
      if (!paint) return;
      paint.scrollTop = event.target.scrollTop;
      paint.scrollLeft = event.target.scrollLeft;
    },
  },
};
</script>

<style scoped>
.jp-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: var(--gutter);
  background: rgba(10, 8, 18, 0.72);
  backdrop-filter: blur(3px);
}

.jp {
  display: flex;
  flex-direction: column;
  width: min(760px, 100%);
  max-height: min(86vh, 760px);
  padding: clamp(18px, 3vw, 26px);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow);
  text-align: left;
}

.jp-head {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.jp-head h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.jp-head p {
  margin: 6px 0 0;
  color: var(--text-muted);
  font-size: 0.9rem;
  max-width: 54ch;
}

.jp-close {
  margin-left: auto;
  width: 34px;
  height: 34px;
  flex: none;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: transparent;
  color: var(--text-muted);
  font-size: 1.3rem;
  line-height: 1;
  cursor: pointer;
}

.jp-close:hover {
  color: var(--text);
  border-color: var(--border-strong);
}

.jp-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 18px 0 10px;
}

/* ---- editor ---- */

.jp-editor {
  position: relative;
  flex: 1;
  min-height: 220px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-deep);
  overflow: hidden;
}

.jp-paint,
.jp-input {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 12px 14px;
  border: 0;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.55;
  tab-size: 2;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  background: transparent;
}

.jp-paint {
  overflow: auto;
  pointer-events: none;
}

.jp-paint code {
  font: inherit;
  white-space: inherit;
  overflow-wrap: inherit;
  background: none;
  padding: 0;
  text-shadow: none;
}

.jp-input {
  resize: none;
  overflow: auto;
  color: transparent;
  caret-color: var(--pink);
  -webkit-text-fill-color: transparent;
}

.jp-input::selection {
  background: rgba(192, 141, 190, 0.35);
}

.jp-input:focus {
  outline: none;
}

.jp-editor:focus-within {
  border-color: var(--accent);
}

/* ---- status + footer ---- */

.jp-hint,
.jp-error {
  margin: 10px 0 0;
  font-size: 0.8125rem;
}

.jp-hint {
  color: var(--text-faint);
  font-family: var(--font-mono);
}

.jp-error {
  color: #ffb4b4;
}

.jp-foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}
</style>
