<template>
  <section class="form-faq container">
    <h2>Questions</h2>
    <div v-for="item in faq" :key="item.q" class="form-faq-item">
      <h3>{{ item.q }}</h3>
      <p>{{ item.a }}</p>
    </div>
    <p v-if="$slots.default" class="form-faq-more"><slot /></p>
  </section>
</template>

<script>
import seo from "@/seo/pages.json";

export default {
  name: "FormFaq",
  props: {
    // Read from the same place as the FAQPage structured data, so what the page
    // says and what the rich result claims can never drift apart.
    path: { type: String, required: true },
  },
  computed: {
    faq() {
      return seo.pages[this.path]?.faq || [];
    },
  },
};
</script>

<style scoped>
.form-faq {
  max-width: 760px;
  margin-inline: auto;
  padding-bottom: clamp(64px, 10vw, 112px);
  text-align: left;
}

.form-faq h2 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
  margin: 0 0 20px;
}

.form-faq-item {
  padding: 18px 0;
  border-top: 1px solid var(--border);
}

.form-faq-item h3 {
  margin: 0 0 6px;
  font-size: 1.0625rem;
  font-weight: 600;
}

.form-faq-item p {
  margin: 0;
  color: var(--text-muted);
}

.form-faq-more {
  margin: 28px 0 0;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  color: var(--text-muted);
}
</style>
