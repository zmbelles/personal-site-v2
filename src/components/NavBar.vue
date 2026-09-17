<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled, 'is-open': open }">
    <div class="container nav">
      <router-link to="/" class="brand" aria-label="Zachary Belles, home">
        <LogoMark class="brand-mark" />
        <span class="brand-text">
          <span class="brand-name">Zachary Belles</span>
          <span class="brand-sub">thenetsuiteguy</span>
        </span>
      </router-link>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="open ? 'true' : 'false'"
        aria-controls="site-nav"
        @click="open = !open"
      >
        <span class="sr-only">{{ open ? "Close menu" : "Open menu" }}</span>
        <span class="bars" aria-hidden="true"></span>
      </button>

      <nav id="site-nav" class="nav-links" aria-label="Primary">
        <router-link v-for="link in links" :key="link.to" :to="link.to" class="nav-link">
          {{ link.label }}
        </router-link>
        <router-link to="/contact" class="btn btn--primary btn--sm nav-cta">Contact</router-link>
      </nav>
    </div>
  </header>
</template>

<script>
import LogoMark from "@/components/LogoMark.vue";

export default {
  name: "NavBar",
  components: { LogoMark },
  data() {
    return {
      open: false,
      scrolled: false,
      links: [
        { to: "/resume", label: "Resume" },
        { to: "/blog", label: "Blog" },
        { to: "/seating-chart", label: "Seating Chart" },
        { to: "/games", label: "Games" },
        { to: "/forms", label: "Forms" },
      ],
    };
  },
  watch: {
    $route() {
      this.open = false;
    },
  },
  mounted() {
    this.onScroll();
    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("keydown", this.onKeydown);
  },
  unmounted() {
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("keydown", this.onKeydown);
  },
  methods: {
    onScroll() {
      this.scrolled = window.scrollY > 8;
    },
    onKeydown(event) {
      if (event.key === "Escape") this.open = false;
    },
  },
};
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(24, 24, 37, 0.72);
  backdrop-filter: saturate(160%) blur(14px);
  -webkit-backdrop-filter: saturate(160%) blur(14px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.site-header.is-scrolled,
.site-header.is-open {
  border-bottom-color: var(--border);
  background: rgba(20, 19, 32, 0.88);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: var(--header-h);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--text);
  text-decoration: none;
}

.brand:hover {
  color: var(--text);
}

.brand-mark {
  width: 34px;
  height: 34px;
  flex: none;
  transition: transform 0.4s var(--ease);
}

.brand:hover .brand-mark {
  transform: rotate(90deg);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand-name {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.brand-sub {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-faint);
  letter-spacing: 0.04em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  position: relative;
  padding: 8px 12px;
  border-radius: 999px;
  color: var(--text-muted);
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.nav-link:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.05);
}

.nav-link.router-link-active {
  color: var(--text);
  background: rgba(179, 157, 219, 0.12);
}

.nav-cta {
  margin-left: 10px;
}

.menu-toggle {
  display: none;
  position: relative;
  width: 44px;
  height: 44px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: transparent;
  color: var(--text);
  cursor: pointer;
}

.bars,
.bars::before,
.bars::after {
  position: absolute;
  left: 50%;
  width: 18px;
  height: 2px;
  margin-left: -9px;
  border-radius: 2px;
  background: currentColor;
  transition: transform 0.25s var(--ease), opacity 0.2s ease;
}

.bars {
  top: 50%;
  margin-top: -1px;
}

.bars::before,
.bars::after {
  content: "";
  left: 0;
  margin-left: 0;
}

.bars::before {
  transform: translateY(-6px);
}

.bars::after {
  transform: translateY(6px);
}

.is-open .bars {
  background: transparent;
}

.is-open .bars::before {
  background: var(--text);
  transform: rotate(45deg);
}

.is-open .bars::after {
  background: var(--text);
  transform: rotate(-45deg);
}

@media (max-width: 860px) {
  .menu-toggle {
    display: inline-block;
  }

  .nav-links {
    position: absolute;
    top: var(--header-h);
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 2px;
    padding: 12px var(--gutter) 20px;
    background: rgba(20, 19, 32, 0.97);
    border-bottom: 1px solid var(--border);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: opacity 0.2s ease, transform 0.25s var(--ease), visibility 0s linear 0.25s;
  }

  .is-open .nav-links {
    opacity: 1;
    visibility: visible;
    transform: none;
    transition: opacity 0.2s ease, transform 0.25s var(--ease);
  }

  .nav-link {
    padding: 12px 14px;
    border-radius: var(--radius-sm);
    font-size: 1rem;
  }

  .nav-cta {
    margin: 10px 0 0;
    min-height: 46px;
  }
}
</style>
