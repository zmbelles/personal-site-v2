<template>
  <div class="forms">
    <header class="container page-hero">
      <p class="eyebrow">NetSuite forms</p>
      <h1>Open source transaction form templates</h1>
      <p>
        Printable layouts for common NetSuite transactions, built to show what
        Advanced PDF customization can do. Both accept JSON. They're still in the
        works.
      </p>
    </header>

    <div class="container grid">
      <div v-for="form in forms" :key="form.name" class="card form" aria-disabled="true">
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
        <h2>{{ form.name }} <span class="badge">Coming soon</span></h2>
        <p>{{ form.body }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FormPage",
  data() {
    return {
      forms: [
        {
          name: "Sales Order",
          short: "SALES ORDER",
          body: "A completely open source template for your company's sales orders. Also accepts JSON.",
        },
        {
          name: "Invoice",
          short: "INVOICE",
          body: "A completely open source template for your company's invoices. Also accepts JSON.",
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
  padding-bottom: clamp(64px, 10vw, 112px);
}

.form h2 {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0 8px;
  font-size: 1.375rem;
  font-weight: 600;
}

.form p {
  margin: 0;
  color: var(--text-muted);
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

@media (max-width: 720px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
