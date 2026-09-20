<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <navbar></navbar>

  <main id="main" class="site-main" :class="{ 'legacy-layout': $route.meta.legacyLayout }">
    <div v-if="isPost" class="post-back no-print">
      <router-link to="/blog" class="post-back-link">← All posts</router-link>
    </div>
    <router-view></router-view>
  </main>

  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <router-link to="/" class="footer-logo" aria-label="Home">
          <LogoMark class="footer-mark" />
          <span>Zachary Belles</span>
        </router-link>
        <p>
          NetSuite developer at Netgain. Writing about SuiteScript and building
          small, free tools on the side.
        </p>
        <div class="socials">
          <a href="https://www.linkedin.com/in/zachary-belles-333b42108/" target="_blank" rel="noopener" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>
          </a>
          <a href="https://github.com/zmbelles" target="_blank" rel="noopener" aria-label="GitHub">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57v-2c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .3Z"/></svg>
          </a>
          <a href="https://www.instagram.com/zachb1997/" target="_blank" rel="noopener" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z"/></svg>
          </a>
        </div>
      </div>

      <nav class="footer-col" aria-label="Site">
        <p class="footer-heading">Site</p>
        <router-link to="/">Home</router-link>
        <router-link to="/resume">Resume</router-link>
        <router-link to="/blog">Blog</router-link>
        <router-link to="/contact">Contact</router-link>
      </nav>

      <nav class="footer-col" aria-label="Free tools">
        <p class="footer-heading">Free tools</p>
        <router-link to="/seating-chart">Seating Chart Maker</router-link>
        <router-link to="/games">Games</router-link>
        <router-link to="/forms">Invoice &amp; Sales Order</router-link>
      </nav>
    </div>

    <div class="container footer-bottom">
      <p>&copy; {{ year }} Zachary Belles. All rights reserved.</p>
      <p>
        Made by
        <a href="https://www.facebook.com/profile.php?id=61587200002055" target="_blank" rel="noopener">Renderly</a>
        in Vue.js
      </p>
    </div>
  </footer>
</template>

<script>
import Navbar from "@/components/NavBar.vue";
import LogoMark from "@/components/LogoMark.vue";

export default {
  name: "App",
  components: {
    Navbar,
    LogoMark,
  },
  data() {
    return { year: new Date().getFullYear() };
  },
  computed: {
    isPost() {
      return this.$route.path.startsWith("/blog/") && this.$route.name !== "not-found";
    },
  },
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.site-main {
  flex: 1 0 auto;
}

/* Games, form templates and the one-off pages predate the redesign and were
   laid out against the old site-wide centered text. */
.legacy-layout {
  text-align: center;
  padding: 24px var(--gutter) 64px;
}

.skip-link {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 100;
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  background: var(--text);
  color: var(--bg);
  font-weight: 600;
  transform: translateY(-150%);
  transition: transform 0.2s ease;
}

.skip-link:focus {
  transform: none;
}

.post-back {
  max-width: 740px;
  margin: 0 auto;
  padding: clamp(32px, 6vw, 56px) var(--gutter) 20px;
}

.post-back-link {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.site-footer {
  margin-top: auto;
  border-top: 1px solid var(--border);
  background: var(--bg-deep);
  color: var(--text-muted);
  font-size: 0.9375rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) repeat(2, minmax(0, 1fr));
  gap: 40px;
  padding-block: 56px 40px;
}

.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 600;
}

.footer-logo:hover {
  color: var(--text);
}

.footer-mark {
  width: 28px;
  height: 28px;
}

.footer-brand p {
  max-width: 38ch;
  margin: 14px 0 20px;
}

.socials {
  display: flex;
  gap: 10px;
}

.socials a {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--border);
  color: var(--text-muted);
  transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
}

.socials a:hover {
  color: var(--text);
  border-color: var(--border-strong);
  background: rgba(255, 255, 255, 0.04);
}

.socials svg {
  width: 18px;
  height: 18px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-heading {
  margin: 0 0 4px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.footer-col a {
  color: var(--text-muted);
  width: fit-content;
}

.footer-col a:hover {
  color: var(--text);
}

.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 24px;
  padding-block: 20px 28px;
  border-top: 1px solid var(--border);
  font-size: 0.8125rem;
  color: var(--text-faint);
}

.footer-bottom p {
  margin: 0;
}

@media (max-width: 720px) {
  .footer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px;
  }

  .footer-brand {
    grid-column: 1 / -1;
  }
}
</style>
