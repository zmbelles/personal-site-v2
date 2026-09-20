<template>
  <div class="txn">
    <header class="container page-hero txn-hero">
      <p class="eyebrow">NetSuite forms</p>
      <h1>{{ heading }}</h1>
      <p>{{ lede }}</p>

      <div class="txn-actions no-print">
        <button type="button" class="btn btn--primary" :disabled="busy" @click="startDownload">
          {{ busy ? "Building PDF…" : "Download PDF" }}
        </button>
        <button type="button" class="btn btn--ghost" @click="startPrint">Print</button>
        <button type="button" class="btn btn--ghost" @click="jsonOpen = true">JSON</button>
        <button type="button" class="btn btn--ghost" @click="reset">Start over</button>
      </div>

      <p class="txn-status" role="status">{{ status }}</p>
    </header>

    <div class="container txn-grid">
      <!-- The output buttons live up in the hero, so they call reportValidity()
           on this form themselves: the browser then points at the first field
           that needs filling in, exactly as a submit would. -->
      <form ref="form" class="txn-form" @submit.prevent="startDownload">
        <section class="card txn-card">
          <h2>Your company</h2>

          <div class="txn-row">
            <label class="txn-field txn-field--wide">
              <span>Company name <i aria-hidden="true">*</i></span>
              <input v-model="doc.company.name" type="text" required placeholder="Lakeshore Fabrication" />
            </label>

            <label class="txn-field">
              <span>Tagline</span>
              <input v-model="doc.company.slogan" type="text" placeholder="Built square, delivered on time." />
            </label>
          </div>

          <label class="txn-field">
            <span>Address</span>
            <textarea
              v-model="doc.company.address"
              rows="3"
              placeholder="118 Harbor Way&#10;Suite 400&#10;Naperville, IL 60540"
            ></textarea>
          </label>

          <div class="txn-row">
            <label class="txn-field">
              <span>Phone</span>
              <input v-model="doc.company.phone" type="tel" placeholder="(630) 555-0142" />
            </label>
            <label class="txn-field">
              <span>Email</span>
              <input v-model="doc.company.email" type="email" placeholder="billing@example.com" />
            </label>
            <label class="txn-field">
              <span>Website</span>
              <input v-model="doc.company.website" type="text" placeholder="example.com" />
            </label>
          </div>

          <div class="txn-row txn-row--brand">
            <div class="txn-field">
              <span>Logo</span>
              <div class="txn-logo">
                <img v-if="doc.company.logo" :src="doc.company.logo" alt="Current logo" />
                <label class="btn btn--ghost btn--sm txn-file">
                  {{ doc.company.logo ? "Replace" : "Upload image" }}
                  <input type="file" accept="image/*" @change="uploadLogo" />
                </label>
                <button
                  v-if="doc.company.logo"
                  type="button"
                  class="btn btn--ghost btn--sm"
                  @click="doc.company.logo = ''"
                >
                  Remove
                </button>
              </div>
            </div>

            <label class="txn-field txn-field--colour">
              <span>Accent colour</span>
              <input v-model="doc.accent" type="color" />
            </label>
          </div>
        </section>

        <section class="card txn-card">
          <h2>{{ spec.detailsHeading }}</h2>

          <div class="txn-row">
            <label class="txn-field">
              <span>{{ spec.numberLabel }} <i aria-hidden="true">*</i></span>
              <input v-model="doc.number" type="text" required :placeholder="spec.numberPlaceholder" />
            </label>
            <label class="txn-field">
              <span>PO #</span>
              <input v-model="doc.poNumber" type="text" placeholder="PO-88120" />
            </label>
            <label class="txn-field">
              <span>Currency</span>
              <select v-model="doc.currency">
                <option v-for="c in currencies" :key="c.code" :value="c.code">{{ c.label }}</option>
              </select>
            </label>
          </div>

          <div class="txn-row">
            <label class="txn-field">
              <span>{{ spec.dateLabel }}</span>
              <input v-model="doc.date" type="date" />
            </label>

            <label v-if="spec.showTerms" class="txn-field">
              <span>Terms</span>
              <select v-model="doc.terms">
                <option v-for="t in terms" :key="t.label" :value="t.label">{{ t.label }}</option>
              </select>
            </label>

            <label class="txn-field">
              <span>{{ spec.dueDateLabel }}</span>
              <input v-model="doc.dueDate" type="date" @change="doc.terms = 'Custom'" />
            </label>
          </div>

          <div class="txn-row">
            <label class="txn-field txn-field--wide">
              <span>Status</span>
              <select v-model="doc.status">
                <option v-for="s in spec.statuses" :key="s" :value="s">{{ s }}</option>
              </select>
            </label>

            <label v-if="spec.referenceLabel" class="txn-field txn-field--wide">
              <span>{{ spec.referenceLabel }}</span>
              <input v-model="doc.reference" type="text" placeholder="LTL freight, prepaid" />
            </label>
          </div>
        </section>

        <section class="card txn-card">
          <h2>Addresses</h2>

          <div class="txn-row">
            <label class="txn-field">
              <span>Bill to <i aria-hidden="true">*</i></span>
              <textarea
                v-model="doc.billTo"
                rows="5"
                required
                placeholder="Northwind Millwork&#10;Attn: Accounts Payable&#10;900 Rand Road&#10;Arlington Heights, IL 60004"
              ></textarea>
            </label>

            <label v-if="spec.showShipTo" class="txn-field">
              <span>
                Ship to
                <button type="button" class="txn-inline-btn" @click="doc.shipTo = doc.billTo">
                  copy bill to
                </button>
              </span>
              <textarea
                v-model="doc.shipTo"
                rows="5"
                placeholder="Leave blank to reuse the billing address"
              ></textarea>
            </label>
          </div>
          <p class="txn-note">One line per line of the label — name first, then street, then city.</p>
        </section>

        <section class="card txn-card">
          <div class="txn-card-head">
            <h2>{{ spec.lineHeading }}</h2>
            <button type="button" class="btn btn--ghost btn--sm" @click="addLine">
              Add {{ spec.lineNoun }}
            </button>
          </div>

          <!-- Laid out as a grid rather than a <table> so it can collapse into
               stacked, labelled fields on a phone. Each cell carries its own
               screen-reader label, so no header association is needed. -->
          <div class="txn-lines" :class="{ 'txn-lines--weight': spec.showWeight }">
            <div class="txn-line txn-line--head" aria-hidden="true">
              <span>{{ spec.lineDescriptionLabel }}</span>
              <span>Qty</span>
              <span>Unit</span>
              <span v-if="spec.showWeight">Weight</span>
              <span>{{ spec.lineRateLabel }}</span>
              <span>Amount</span>
              <span></span>
            </div>

            <div v-for="(line, index) in doc.lines" :key="index" class="txn-line">
              <label class="txn-cell" :data-label="spec.lineDescriptionLabel">
                <span class="sr-only">{{ spec.lineDescriptionLabel }} {{ index + 1 }}</span>
                <input v-model="line.description" type="text" :placeholder="`${spec.lineDescriptionLabel} ${index + 1}`" />
              </label>
              <label class="txn-cell" data-label="Qty">
                <span class="sr-only">Quantity for line {{ index + 1 }}</span>
                <input v-model="line.quantity" type="number" step="any" inputmode="decimal" />
              </label>
              <label class="txn-cell" data-label="Unit">
                <span class="sr-only">Unit for line {{ index + 1 }}</span>
                <input v-model="line.unit" type="text" placeholder="EA" />
              </label>
              <label v-if="spec.showWeight" class="txn-cell" data-label="Weight">
                <span class="sr-only">Weight for line {{ index + 1 }}</span>
                <input v-model="line.weight" type="number" step="any" inputmode="decimal" />
              </label>
              <label class="txn-cell" :data-label="spec.lineRateLabel">
                <span class="sr-only">{{ spec.lineRateLabel }} for line {{ index + 1 }}</span>
                <input v-model="line.rate" type="number" step="any" inputmode="decimal" />
              </label>
              <span class="txn-cell txn-amount" data-label="Amount">{{ money(amountOf(line)) }}</span>
              <span class="txn-cell txn-line-tools">
                <button
                  type="button"
                  class="txn-icon"
                  :disabled="index === 0"
                  :aria-label="`Move line ${index + 1} up`"
                  @click="moveLine(index, -1)"
                >
                  ↑
                </button>
                <button
                  type="button"
                  class="txn-icon"
                  :disabled="index === doc.lines.length - 1"
                  :aria-label="`Move line ${index + 1} down`"
                  @click="moveLine(index, 1)"
                >
                  ↓
                </button>
                <button
                  type="button"
                  class="txn-icon txn-icon--danger"
                  :aria-label="`Remove line ${index + 1}`"
                  @click="removeLine(index)"
                >
                  ✕
                </button>
              </span>
            </div>
          </div>
        </section>

        <section class="card txn-card">
          <h2>Totals and notes</h2>

          <div class="txn-row">
            <label class="txn-field">
              <span>Discount %</span>
              <input v-model="doc.discountRate" type="number" step="any" min="0" max="100" inputmode="decimal" />
            </label>
            <label class="txn-field">
              <span>Tax %</span>
              <input v-model="doc.taxRate" type="number" step="any" min="0" inputmode="decimal" />
            </label>
            <label class="txn-field">
              <span>Shipping</span>
              <input v-model="doc.shipping" type="number" step="any" inputmode="decimal" />
            </label>
            <label class="txn-field">
              <span>{{ spec.paidLabel }}</span>
              <input v-model="doc.paid" type="number" step="any" inputmode="decimal" />
            </label>
          </div>

          <dl class="txn-totals">
            <div><dt>Subtotal</dt><dd>{{ money(totals.subtotal) }}</dd></div>
            <div v-if="totals.discount"><dt>Discount</dt><dd>−{{ money(totals.discount) }}</dd></div>
            <div v-if="totals.tax"><dt>Tax</dt><dd>{{ money(totals.tax) }}</dd></div>
            <div v-if="totals.shipping"><dt>Shipping</dt><dd>{{ money(totals.shipping) }}</dd></div>
            <div class="txn-totals-strong"><dt>Total</dt><dd>{{ money(totals.total) }}</dd></div>
            <div v-if="totals.paid" class="txn-totals-strong">
              <dt>{{ spec.balanceLabel }}</dt><dd>{{ money(totals.balance) }}</dd>
            </div>
          </dl>

          <label class="txn-field">
            <span>Notes</span>
            <textarea v-model="doc.memo" rows="3" placeholder="Anything the customer should read before paying."></textarea>
          </label>
        </section>

        <!-- The form runs well past a screenful, so the output buttons are
             repeated here: you finish the last field and the download is right
             under your cursor, rather than back at the top of the page.
             The status line above is the live region; this one is visual only,
             so a screen reader does not hear the same message twice. -->
        <div class="txn-foot no-print">
          <button type="button" class="btn btn--primary" :disabled="busy" @click="startDownload">
            {{ busy ? "Building PDF…" : "Download PDF" }}
          </button>
          <button type="button" class="btn btn--ghost" @click="startPrint">Print</button>
          <p class="txn-foot-status" aria-hidden="true">{{ status }}</p>
        </div>
      </form>

      <aside class="txn-preview">
        <div class="txn-preview-head">
          <span class="eyebrow">Live preview</span>
          <span class="txn-preview-zoom">{{ Math.round(scale * 100) }}%</span>
        </div>

        <!-- The same markup the PDF is built from, shrunk to fit the column.
             `zoom` rather than `transform: scale()` because zoom shrinks the
             layout box too, so the container's height follows on its own and
             the text stays crisp instead of being scaled up from a bitmap. -->
        <div ref="paperBox" class="txn-paper">
          <div class="txn-paper-inner" :style="{ zoom: scale }" v-html="previewHtml"></div>
        </div>

        <p class="txn-note txn-preview-note">
          Everything stays in this browser — the sheet is built on your machine
          and nothing is uploaded.
        </p>
      </aside>
    </div>

    <JsonPanel
      v-if="jsonOpen"
      :spec="spec"
      :doc="doc"
      @apply="applyJson"
      @download="downloadJsonFile"
      @close="jsonOpen = false"
    />

    <CoffeeDialog
      v-if="coffeeOpen"
      :thing="`This ${spec.docNoun} generator`"
      :noun="pendingNoun"
      @close="closeCoffee"
    />
  </div>
</template>

<script>
import CoffeeDialog from "@/components/support/CoffeeDialog.vue";
import { markAsked, shouldAsk } from "@/components/support/coffee.js";
import JsonPanel from "./JsonPanel.vue";
import { PAGE_WIDTH, renderDocumentHtml } from "./documentHtml.js";
import { downloadJson, downloadPdf, fileName, printDocument } from "./output.js";
import {
  CURRENCIES,
  TERMS,
  addDays,
  blankLine,
  computeTotals,
  createDocument,
  formatMoney,
  fromJson,
  lineAmount,
  toJson,
} from "./transaction.js";

const MAX_LOGO_BYTES = 2 * 1024 * 1024;

export default {
  name: "TransactionBuilder",
  components: { CoffeeDialog, JsonPanel },
  props: {
    spec: { type: Object, required: true },
    heading: { type: String, required: true },
    lede: { type: String, required: true },
  },
  data() {
    return {
      doc: createDocument(this.spec),
      currencies: CURRENCIES,
      terms: TERMS,
      jsonOpen: false,
      coffeeOpen: false,
      pendingNoun: "download",
      afterCoffee: null,
      busy: false,
      status: "",
      scale: 1,
      observer: null,
      frame: 0,
      saveTimer: null,
      statusTimer: null,
    };
  },
  computed: {
    totals() {
      return computeTotals(this.doc);
    },
    previewHtml() {
      return renderDocumentHtml(this.doc, this.spec, { preview: true });
    },
  },
  watch: {
    doc: {
      deep: true,
      handler() {
        clearTimeout(this.saveTimer);
        this.saveTimer = setTimeout(this.persist, 400);
      },
    },
    // Picking a term restates the due date; typing a due date switches the
    // select to Custom (handled on the input itself) so the two never disagree.
    "doc.terms"(label) {
      const match = TERMS.find((term) => term.label === label);
      if (match && match.days != null) this.doc.dueDate = addDays(this.doc.date, match.days);
    },
    "doc.date"() {
      const match = TERMS.find((term) => term.label === this.doc.terms);
      if (match && match.days != null) this.doc.dueDate = addDays(this.doc.date, match.days);
    },
  },
  created() {
    this.restore();
  },
  mounted() {
    if (typeof ResizeObserver !== "undefined") {
      this.observer = new ResizeObserver(this.onResize);
      this.observer.observe(this.$refs.paperBox);
    } else {
      window.addEventListener("resize", this.onResize);
    }
    // Measured straight away rather than through onResize, so a page opened in
    // a background tab — where rAF does not run — is still sized correctly.
    this.measure();
  },
  beforeUnmount() {
    this.observer?.disconnect();
    window.removeEventListener("resize", this.onResize);
    cancelAnimationFrame(this.frame);
    clearTimeout(this.saveTimer);
    clearTimeout(this.statusTimer);
    this.persist();
  },
  methods: {
    money(value) {
      return formatMoney(value, this.doc.currency);
    },
    amountOf(line) {
      return lineAmount(line);
    },

    /* ---- preview sizing ---- */
    measure() {
      const box = this.$refs.paperBox;
      if (!box || !box.clientWidth) return;
      const scale = Math.min(1, box.clientWidth / PAGE_WIDTH);
      if (Math.abs(scale - this.scale) > 0.002) this.scale = scale;
    },

    /**
     * Zooming the sheet changes the height of the very box being observed, so
     * the write is pushed out of the observation callback. Doing it inline is
     * what produces "ResizeObserver loop completed with undelivered
     * notifications".
     */
    onResize() {
      cancelAnimationFrame(this.frame);
      this.frame = requestAnimationFrame(this.measure);
    },

    /* ---- lines ---- */
    addLine() {
      this.doc.lines.push(blankLine());
    },
    removeLine(index) {
      this.doc.lines.splice(index, 1);
      if (!this.doc.lines.length) this.addLine();
    },
    moveLine(index, step) {
      const target = index + step;
      if (target < 0 || target >= this.doc.lines.length) return;
      const [line] = this.doc.lines.splice(index, 1);
      this.doc.lines.splice(target, 0, line);
    },

    /* ---- logo ---- */
    uploadLogo(event) {
      const file = event.target.files && event.target.files[0];
      // Clear the input so picking the same file twice still fires a change.
      event.target.value = "";
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        this.say("That file is not an image.");
        return;
      }
      if (file.size > MAX_LOGO_BYTES) {
        this.say("That logo is over 2 MB — try a smaller PNG or SVG.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (loaded) => {
        this.doc.company.logo = String(loaded.target.result);
        this.say("Logo added.");
      };
      reader.onerror = () => this.say("That image could not be read.");
      reader.readAsDataURL(file);
    },

    /* ---- output ---- */
    /** Points the browser at the first field that still needs filling in. */
    valid() {
      const form = this.$refs.form;
      if (!form || form.reportValidity()) return true;
      this.say("Fill in the highlighted field first.");
      return false;
    },

    /**
     * Validate, ask about a coffee if it is time to, then hand over the file.
     * The ask never gates the output — `closeCoffee` runs the action whichever
     * button was pressed.
     */
    startDownload() {
      if (this.busy || !this.valid()) return;
      this.askThen("PDF", () => this.download());
    },

    startPrint() {
      if (!this.valid()) return;
      this.askThen("document", () => this.print());
    },

    askThen(noun, action) {
      if (!shouldAsk()) {
        action();
        return;
      }
      markAsked();
      this.pendingNoun = noun;
      this.afterCoffee = action;
      this.coffeeOpen = true;
    },

    closeCoffee() {
      this.coffeeOpen = false;
      const action = this.afterCoffee;
      this.afterCoffee = null;
      action?.();
    },

    async download() {
      if (this.busy) return;
      this.busy = true;
      this.say("Building the PDF…");
      try {
        await downloadPdf(this.doc, this.spec);
        this.say("Saved " + fileName(this.doc, this.spec, "pdf") + ".");
      } catch (error) {
        this.say("The PDF could not be built: " + error.message);
      } finally {
        this.busy = false;
      }
    },
    async print() {
      try {
        await printDocument(this.doc, this.spec);
      } catch (error) {
        this.say("The print view could not be opened: " + error.message);
      }
    },
    downloadJsonFile() {
      downloadJson(toJson(this.doc, this.spec), fileName(this.doc, this.spec, "json"));
    },
    applyJson(parsed) {
      const logo = this.doc.company.logo;
      this.doc = fromJson(this.spec, parsed);
      // An uploaded logo is not part of the JSON, so keep the one already here.
      if (!this.doc.company.logo) this.doc.company.logo = logo;
      this.jsonOpen = false;
      this.say("Form updated from JSON.");
      this.$nextTick(this.measure);
    },
    reset() {
      if (!window.confirm("Clear this form and start over?")) return;
      this.doc = createDocument(this.spec);
      try {
        window.localStorage.removeItem(this.spec.storageKey);
      } catch {
        // Private mode can refuse storage; the in-memory reset still happened.
      }
      this.say("Cleared.");
    },

    /* ---- draft persistence ---- */
    persist() {
      const save = (payload) =>
        window.localStorage.setItem(this.spec.storageKey, JSON.stringify(payload));
      try {
        save({ ...toJson(this.doc, this.spec), company: { ...this.doc.company } });
      } catch {
        // Usually the logo pushing the draft past the ~5 MB quota. Drop it and
        // keep the rest of the draft rather than losing everything.
        try {
          save(toJson(this.doc, this.spec));
        } catch {
          // Storage is unavailable entirely — the form still works, it just
          // will not survive a refresh.
        }
      }
    },
    restore() {
      let saved;
      try {
        saved = window.localStorage.getItem(this.spec.storageKey);
      } catch {
        // No storage, nothing to restore.
        return;
      }
      if (!saved) return;
      try {
        this.doc = fromJson(this.spec, JSON.parse(saved));
      } catch {
        // A draft we cannot read is a draft we do not want.
        this.doc = createDocument(this.spec);
      }
    },

    say(message) {
      this.status = message;
      clearTimeout(this.statusTimer);
      this.statusTimer = setTimeout(() => (this.status = ""), 5000);
    },
  },
};
</script>

<style scoped>
.txn {
  text-align: left;
}

.txn-hero {
  padding-bottom: 0;
}

.txn-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
}

.txn-status {
  min-height: 1.4em;
  margin: 10px 0 0;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--accent);
}

.txn-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
  gap: 24px;
  align-items: start;
  padding-top: 24px;
  padding-bottom: clamp(64px, 10vw, 112px);
}

.txn-form {
  display: grid;
  gap: 16px;
  min-width: 0;
}

.txn-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.txn-foot-status {
  flex-basis: 100%;
  min-height: 1.4em;
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--accent);
}

/* ---------- cards and fields ---------- */

.txn-card {
  padding: clamp(18px, 2.6vw, 24px);
}

.txn-card h2 {
  margin: 0 0 18px;
  font-size: 1.125rem;
  font-weight: 600;
}

.txn-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.txn-card-head h2 {
  margin: 0;
}

.txn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 14px;
}

.txn-row > .txn-field {
  flex: 1 1 170px;
  margin-bottom: 0;
}

.txn-row > .txn-field--wide {
  flex: 2 1 260px;
}

.txn-field {
  display: block;
  margin-bottom: 14px;
  min-width: 0;
}

.txn-field > span {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-muted);
}

.txn-field i {
  color: var(--pink);
  font-style: normal;
}

.txn-field input,
.txn-field select,
.txn-field textarea,
.txn-cell input {
  width: 100%;
  padding: 9px 11px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-deep);
  color: var(--text);
  font: inherit;
  font-size: 0.9375rem;
}

.txn-field textarea {
  resize: vertical;
  line-height: 1.5;
}

.txn-field input::placeholder,
.txn-field textarea::placeholder,
.txn-cell input::placeholder {
  color: var(--text-faint);
}

.txn-field input:focus,
.txn-field select:focus,
.txn-field textarea:focus,
.txn-cell input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(179, 157, 219, 0.16);
}

.txn-field select {
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--text-muted) 50%),
    linear-gradient(135deg, var(--text-muted) 50%, transparent 50%);
  background-position: right 16px center, right 11px center;
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
  padding-right: 32px;
}

.txn-field--colour {
  flex: 0 0 120px;
}

.txn-field--colour input[type="color"] {
  height: 42px;
  padding: 4px;
  cursor: pointer;
}

.txn-inline-btn {
  border: 0;
  padding: 0;
  background: none;
  color: var(--accent);
  font: inherit;
  font-size: 0.75rem;
  text-decoration: underline;
  cursor: pointer;
}

.txn-note {
  margin: 4px 0 0;
  font-size: 0.8125rem;
  color: var(--text-faint);
}

/* ---------- logo ---------- */

.txn-row--brand {
  align-items: flex-end;
}

.txn-logo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.txn-logo img {
  max-width: 120px;
  max-height: 42px;
  padding: 4px 8px;
  border-radius: 6px;
  background: #fff;
}

.txn-file {
  position: relative;
  overflow: hidden;
}

.txn-file input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

/* ---------- line items ---------- */

.txn-lines {
  display: grid;
  gap: 8px;
}

.txn-line {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 68px 64px 84px minmax(72px, auto) 92px;
  gap: 8px;
  align-items: center;
}

.txn-lines--weight .txn-line {
  grid-template-columns: minmax(0, 1fr) 62px 56px 66px 74px minmax(64px, auto) 92px;
}

.txn-line--head {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-faint);
  padding-bottom: 2px;
}

.txn-cell {
  display: block;
  min-width: 0;
}

.txn-cell input {
  padding: 8px 9px;
  font-size: 0.875rem;
}

.txn-amount {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  text-align: right;
  color: var(--text-soft);
  white-space: nowrap;
}

.txn-line-tools {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}

.txn-icon {
  width: 26px;
  height: 30px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.75rem;
  line-height: 1;
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.txn-icon:hover:not([disabled]) {
  color: var(--text);
  border-color: var(--border-strong);
}

.txn-icon[disabled] {
  opacity: 0.35;
  cursor: default;
}

.txn-icon--danger:hover {
  color: #ffb4b4;
  border-color: rgba(255, 180, 180, 0.4);
}

/* ---------- totals ---------- */

.txn-totals {
  display: grid;
  gap: 4px;
  margin: 4px 0 18px;
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.03);
  font-size: 0.875rem;
}

.txn-totals > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.txn-totals dt {
  color: var(--text-muted);
}

.txn-totals dd {
  margin: 0;
  font-family: var(--font-mono);
  color: var(--text-soft);
}

.txn-totals-strong dt,
.txn-totals-strong dd {
  color: var(--text);
  font-weight: 600;
}

/* ---------- preview ---------- */

.txn-preview {
  position: sticky;
  top: calc(var(--header-h) + 16px);
  min-width: 0;
}

.txn-preview-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.txn-preview-zoom {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-faint);
}

.txn-paper {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: #fff;
  box-shadow: var(--shadow);
  line-height: 0;
}

.txn-paper-inner {
  width: 794px;
}

.txn-preview-note {
  margin-top: 10px;
}

/* ---------- narrow screens ---------- */

@media (max-width: 1080px) {
  .txn-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .txn-preview {
    position: static;
    max-width: 640px;
  }
}

@media (max-width: 720px) {
  /* The line grid collapses into stacked, labelled fields. */
  .txn-line--head {
    display: none;
  }

  .txn-line,
  .txn-lines--weight .txn-line {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    padding: 14px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: rgba(255, 255, 255, 0.02);
  }

  .txn-line .txn-cell:first-child {
    grid-column: 1 / -1;
  }

  .txn-cell::before {
    content: attr(data-label);
    display: block;
    margin-bottom: 4px;
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-faint);
  }

  .txn-amount {
    align-self: end;
    text-align: left;
  }

  .txn-line-tools {
    grid-column: 1 / -1;
    justify-content: flex-start;
  }

  .txn-line-tools::before {
    content: none;
  }
}
</style>
