<template>
  <div class="not-found container">
    <LogoMark class="nf-mark" />
    <p class="eyebrow">Error 404</p>
    <h1>That page doesn’t exist</h1>
    <p class="nf-body">
      The link may be out of date, or the address may have a typo in it.
    </p>
    <div class="nf-actions">
      <router-link to="/" class="btn btn--primary">Back to home</router-link>
      <router-link to="/blog" class="btn btn--ghost">Read the blog</router-link>
    </div>
    <div class="nf-links">
      <router-link to="/resume">Resume</router-link>
      <router-link to="/seating-chart">Seating Chart</router-link>
      <router-link to="/games">Games</router-link>
      <router-link to="/contact">Contact</router-link>
    </div>
  </div>
</template>

<script>
import LogoMark from "@/components/LogoMark.vue";

export default {
  name: "NotFound",
  components: { LogoMark },
};
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 64vh;
  padding-block: 64px;
  text-align: center;
}

.nf-mark {
  width: 72px;
  height: 72px;
  margin-bottom: 24px;
  opacity: 0.9;
}

.not-found h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 600;
  margin: 12px 0 0;
}

.nf-body {
  color: var(--text-muted);
  margin: 14px 0 0;
}

.nf-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 28px;
}

.nf-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 24px;
  margin-top: 28px;
  font-size: 0.9375rem;
}
</style>
