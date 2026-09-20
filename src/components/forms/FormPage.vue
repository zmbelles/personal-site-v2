<template>
  <div class="forms">
    <header class="container page-hero">
      <p class="eyebrow">NetSuite forms</p>
      <h1>Open source transaction forms</h1>
      <p>
        Four printable transaction layouts you can fill in right here. Type
        into the form, watch the sheet build itself alongside, then download a
        PDF or print it. All four read and write JSON, all four are free, and
        nothing you type ever leaves your browser.
      </p>
    </header>

    <div class="container grid">
      <router-link
        v-for="form in forms"
        :key="form.path"
        :to="form.path"
        class="card card--link form"
      >
        <div class="doc" aria-hidden="true">
          <div class="doc-head">
            <span class="doc-logo"></span>
            <span class="doc-title">{{ form.short }}</span>
          </div>
          <span class="doc-line w70"></span>
          <span class="doc-line w45"></span>
          <div class="doc-table">
            <span v-for="n in 4" :key="n"></span>
          </div>
          <span class="doc-line w30 right"></span>
        </div>
        <h2>{{ form.name }}</h2>
        <p>{{ form.body }}</p>
        <ul class="chip-list">
          <li v-for="tag in form.tags" :key="tag" class="chip">{{ tag }}</li>
        </ul>
        <span class="arrow-link">{{ form.cta }}</span>
      </router-link>
    </div>

    <section class="container why">
      <h2>Why these exist</h2>
      <p>
        A lot of small and self-run businesses just need to send the
        occasional invoice, purchase order, or bill, not pay for a monthly
        subscription to a full accounting suite to do it. These four are
        free and permanent: fill in the fields, watch the sheet build itself
        alongside, and walk away with a real PDF.
      </p>
      <p>
        The layouts happen to be the same ones I use to preview NetSuite
        Advanced PDF templates before writing any FreeMarker, since that is
        most of what I build day to day, so they hold up the same way real
        billing paperwork does. The whole thing runs on your machine: no
        account, no server, and no copy of your customer list anywhere but
        your own browser.
      </p>
    </section>
  </div>
</template>

<script>
export default {
  name: "FormPage",
  data() {
    return {
      forms: [
        {
          name: "Invoice",
          short: "INVOICE",
          path: "/forms/invoice",
          body: "Bill a customer: payment terms that set the due date for you, tax and discount lines, and a running balance due.",
          tags: ["Live preview", "PDF & print", "JSON in and out"],
          cta: "Build an invoice",
        },
        {
          name: "Sales Order",
          short: "SALES ORDER",
          path: "/forms/sales-order",
          body: "Confirm an order before it ships: separate bill-to and ship-to, per-line weights, shipping costs and a deposit.",
          tags: ["Live preview", "PDF & print", "JSON in and out"],
          cta: "Build a sales order",
        },
        {
          name: "Purchase Order",
          short: "PURCHASE ORDER",
          path: "/forms/purchase-order",
          body: "Tell a vendor exactly what to send: a ship-to address, per-line weights, shipping costs and a deposit.",
          tags: ["Live preview", "PDF & print", "JSON in and out"],
          cta: "Build a purchase order",
        },
        {
          name: "Bill / Vendor Bill",
          short: "BILL",
          path: "/forms/vendor-bill",
          body: "Bill a customer, or record what a vendor billed you: payment terms that set the due date, tax and discount lines, and a running balance.",
          tags: ["Live preview", "PDF & print", "JSON in and out"],
          cta: "Build a bill",
        },
      ],
    };
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.form {
  display: flex;
  flex-direction: column;
}

.form h2 {
  margin: 20px 0 8px;
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--text);
}

.form p {
  margin: 0 0 16px;
  color: var(--text-muted);
}

.form .chip-list {
  margin-bottom: 20px;
}

.doc {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 22px;
  border-radius: var(--radius-sm);
  background: #f4f1fa;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.doc-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.doc-logo {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: var(--gradient);
}

.doc-title {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: var(--violet-deep);
}

.doc-line {
  height: 6px;
  border-radius: 3px;
  background: #d9d3e8;
}

.w70 { width: 70%; }
.w45 { width: 45%; }
.w30 { width: 30%; }
.right { align-self: flex-end; }

.doc-table {
  display: grid;
  gap: 5px;
  margin: 4px 0;
}

.doc-table span {
  height: 10px;
  border-radius: 2px;
  background: #e6e1f0;
}

.doc-table span:first-child {
  background: var(--violet);
  opacity: 0.55;
}

.why {
  max-width: 760px;
  margin-inline: auto;
  padding-block: clamp(48px, 8vw, 88px) clamp(64px, 10vw, 112px);
  text-align: left;
}

.why h2 {
  margin: 0 0 16px;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
}

.why p {
  margin: 0 0 1.1em;
  color: var(--text-muted);
}

@media (max-width: 720px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
