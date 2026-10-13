<template>
  <div class="wedding container">
    <header class="wp-head">
      <p class="eyebrow">Photo gallery</p>
      <h1>Wedding Photos</h1>
    </header>

    <form v-if="!unlocked" class="wp-gate" @submit.prevent="unlock">
      <p class="wp-gate-copy">Enter the password to see the photos.</p>
      <div class="wp-gate-row">
        <input
          v-model="password"
          type="password"
          class="wp-input"
          placeholder="Password"
          autocomplete="current-password"
          :disabled="busy"
          autofocus
        />
        <button type="submit" class="btn btn--primary" :disabled="busy || !password">
          {{ busy ? "Unlocking…" : "View photos" }}
        </button>
      </div>
      <p v-if="error" class="wp-error">{{ error }}</p>
    </form>

    <div v-else class="wp-gallery">
      <p ref="top" class="wp-count">
        {{ dims.length.toLocaleString() }} photos · showing {{ pageStart + 1 }}–{{ pageEnd }}
      </p>
      <nav v-for="where in ['top', 'bottom']" :key="where" :class="['wp-pager', `wp-pager--${where}`]" aria-label="Pages">
        <button class="btn btn--ghost btn--sm" :disabled="page === 0" aria-label="Previous page" @click="goTo(page - 1)">‹<span class="wp-word"> Prev</span></button>
        <template v-for="(p, n) in pageLinks" :key="n">
          <span v-if="p === null" class="wp-gap">…</span>
          <button
            v-else
            :class="['wp-page', { 'wp-page--on': p === page }]"
            :aria-current="p === page ? 'page' : null"
            @click="goTo(p)"
          >{{ p + 1 }}</button>
        </template>
        <button class="btn btn--ghost btn--sm" :disabled="page === pageCount - 1" aria-label="Next page" @click="goTo(page + 1)"><span class="wp-word">Next </span>›</button>
      </nav>
      <div class="wp-grid">
        <button
          v-for="i in pageIndexes"
          :key="i"
          class="wp-cell"
          :aria-label="`Open photo ${i + 1}`"
          @click="openAt(i)"
        >
          <img v-if="thumbs[i]" :src="thumbs[i]" alt="" />
        </button>
      </div>
    </div>

    <div
      v-if="current !== null"
      class="wp-lightbox"
      role="dialog"
      aria-modal="true"
      @click.self="close"
      @touchstart.passive="touchStart"
      @touchend.passive="touchEnd"
    >
      <img v-if="fulls[current]" :src="fulls[current]"  class="wp-full" alt="" />
      <img v-else-if="thumbs[current]" :src="thumbs[current]" class="wp-full wp-full--loading" alt="" />
      <button class="wp-nav wp-nav--prev" aria-label="Previous photo" @click="step(-1)">‹</button>
      <button class="wp-nav wp-nav--next" aria-label="Next photo" @click="step(1)">›</button>
      <div class="wp-bar">
        <span>{{ current + 1 }} / {{ dims.length }}</span>
        <a
          v-if="fulls[current]"
          :href="fulls[current]"
          :download="`wedding-${String(current + 1).padStart(4, '0')}.webp`"
          class="btn btn--ghost btn--sm"
        >Download</a>
        <button class="btn btn--ghost btn--sm" @click="close">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
// Photos live in the zmbelles/wedding-photos repo, encrypted with a key derived
// from the page password (see tools/build.mjs there). Nothing readable is
// published; the browser derives the key and decrypts each image on demand.
// VUE_APP_WEDDING_BASE points at a local copy while developing.
const BASE = process.env.VUE_APP_WEDDING_BASE || "https://zmbelles.github.io/wedding-photos/p/";
const SESSION_KEY = "wedding-photos-pw";
const MAX_IN_FLIGHT = 6;
const FULL_CACHE = 8;
const PAGE_SIZE = 60;

const fetchBytes = async (path) => {
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return new Uint8Array(await res.arrayBuffer());
};

export default {
  name: "WeddingPhotos",
  data() {
    return {
      password: "",
      busy: false,
      error: "",
      unlocked: false,
      dims: [],
      thumbs: {},
      fulls: {},
      current: null,
      page: 0,
    };
  },
  computed: {
    pageCount() {
      return Math.max(1, Math.ceil(this.dims.length / PAGE_SIZE));
    },
    pageStart() {
      return this.page * PAGE_SIZE;
    },
    pageEnd() {
      return Math.min(this.pageStart + PAGE_SIZE, this.dims.length);
    },
    pageIndexes() {
      const out = [];
      for (let i = this.pageStart; i < this.pageEnd; i++) out.push(i);
      return out;
    },
    // First, last, and two either side of the current page; null marks a gap.
    pageLinks() {
      const last = this.pageCount - 1;
      const keep = new Set([0, last]);
      for (let p = this.page - 2; p <= this.page + 2; p++) if (p >= 0 && p <= last) keep.add(p);
      const sorted = [...keep].sort((a, b) => a - b);
      const out = [];
      sorted.forEach((p, n) => {
        if (n && p - sorted[n - 1] > 1) out.push(null);
        out.push(p);
      });
      return out;
    },
  },
  watch: {
    "$route.query.page"() {
      this.page = this.pageFromRoute();
    },
    page() {
      this.loadPage();
    },
  },
  created() {
    this.key = null;
    this.queue = [];
    this.inFlight = 0;
    this.requested = new Set();
    this.fullOrder = [];
    this.touchX = null;
  },
  mounted() {
    window.addEventListener("keydown", this.onKey);
    let saved = null;
    try {
      saved = sessionStorage.getItem(SESSION_KEY);
    } catch {
      /* storage blocked: just ask again */
    }
    if (saved) {
      this.password = saved;
      this.unlock();
    }
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.onKey);
    for (const url of [...Object.values(this.thumbs), ...Object.values(this.fulls)]) URL.revokeObjectURL(url);
    document.body.style.overflow = "";
  },
  methods: {
    async unlock() {
      this.busy = true;
      this.error = "";
      try {
        const meta = await (await fetch(BASE + "meta.json")).json();
        const base = await crypto.subtle.importKey(
          "raw",
          new TextEncoder().encode(this.password),
          "PBKDF2",
          false,
          ["deriveKey"]
        );
        const key = await crypto.subtle.deriveKey(
          {
            name: "PBKDF2",
            salt: Uint8Array.from(atob(meta.salt), (c) => c.charCodeAt(0)),
            iterations: meta.iterations,
            hash: "SHA-256",
          },
          base,
          { name: "AES-GCM", length: 256 },
          false,
          ["decrypt"]
        );
        let manifest;
        try {
          manifest = await this.decrypt(key, await fetchBytes("m.bin"));
        } catch (e) {
          if (e.name === "OperationError") {
            this.error = "That password isn't right.";
            try {
              sessionStorage.removeItem(SESSION_KEY);
            } catch {
              /* ignore */
            }
            return;
          }
          throw e;
        }
        this.key = key;
        this.dims = JSON.parse(new TextDecoder().decode(manifest));
        try {
          sessionStorage.setItem(SESSION_KEY, this.password);
        } catch {
          /* ignore */
        }
        this.unlocked = true;
        this.page = this.pageFromRoute();
        this.loadPage();
      } catch (e) {
        console.error(e);
        this.error = "Couldn't load the photos. Check your connection and try again.";
      } finally {
        this.busy = false;
      }
    },

    async decrypt(key, blob) {
      const plain = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: blob.subarray(0, 12) },
        key,
        blob.subarray(12)
      );
      return new Uint8Array(plain);
    },

    async loadImage(path) {
      const bytes = await this.decrypt(this.key, await fetchBytes(path));
      return URL.createObjectURL(new Blob([bytes], { type: "image/webp" }));
    },

    pageFromRoute() {
      const n = parseInt(this.$route.query.page, 10);
      return Number.isFinite(n) ? Math.min(Math.max(n - 1, 0), this.pageCount - 1) : 0;
    },

    goTo(p) {
      const query = { ...this.$route.query, page: p ? String(p + 1) : undefined };
      this.$router.push({ query });
      this.page = p;
      this.$refs.top?.scrollIntoView({ block: "start" });
    },

    // Drop thumbnails still queued for the page being left, then queue this one.
    loadPage() {
      if (!this.key) return;
      this.queue = this.queue.filter((job) => {
        const keep = job.full || (job.i >= this.pageStart && job.i < this.pageEnd);
        if (!keep) this.requested.delete(`t${job.i}`);
        return keep;
      });
      for (const i of this.pageIndexes) this.enqueue(i, false);
    },

    // Thumbnails and full images share one small pool so a fast scroll can't
    // fire hundreds of requests; the photo being viewed jumps the line.
    enqueue(i, full) {
      const id = `${full ? "f" : "t"}${i}`;
      if (this.requested.has(id)) return;
      this.requested.add(id);
      const job = { i, full };
      if (full) this.queue.unshift(job);
      else this.queue.push(job);
      this.pump();
    },

    pump() {
      while (this.inFlight < MAX_IN_FLIGHT && this.queue.length) {
        const { i, full } = this.queue.shift();
        const name = String(i).padStart(4, "0");
        this.inFlight++;
        this.loadImage(`${full ? "f" : "t"}/${name}.bin`)
          .then((url) => {
            if (full) this.storeFull(i, url);
            else this.thumbs = { ...this.thumbs, [i]: url };
          })
          .catch((e) => {
            console.error(e);
            this.requested.delete(`${full ? "f" : "t"}${i}`);
          })
          .finally(() => {
            this.inFlight--;
            this.pump();
          });
      }
    },

    // Keep only the last few full-size images in memory.
    storeFull(i, url) {
      const fulls = { ...this.fulls, [i]: url };
      this.fullOrder.push(i);
      while (this.fullOrder.length > FULL_CACHE) {
        const old = this.fullOrder.shift();
        if (old === this.current) {
          this.fullOrder.push(old);
          continue;
        }
        URL.revokeObjectURL(fulls[old]);
        delete fulls[old];
        this.requested.delete(`f${old}`);
      }
      this.fulls = fulls;
    },

    openAt(i) {
      this.current = i;
      document.body.style.overflow = "hidden";
      this.enqueue(i, true);
      this.enqueue(i, false);
      const next = (i + 1) % this.dims.length;
      this.enqueue(next, true);
    },

    step(delta) {
      const n = this.dims.length;
      const i = (this.current + delta + n) % n;
      const p = Math.floor(i / PAGE_SIZE);
      if (p !== this.page) {
        this.$router.replace({ query: { ...this.$route.query, page: p ? String(p + 1) : undefined } });
        this.page = p;
      }
      this.openAt(i);
    },

    close() {
      this.current = null;
      document.body.style.overflow = "";
    },

    onKey(e) {
      if (this.current === null) return;
      if (e.key === "Escape") this.close();
      else if (e.key === "ArrowLeft") this.step(-1);
      else if (e.key === "ArrowRight") this.step(1);
    },

    touchStart(e) {
      this.touchX = e.changedTouches[0].clientX;
    },

    touchEnd(e) {
      if (this.touchX === null) return;
      const dx = e.changedTouches[0].clientX - this.touchX;
      this.touchX = null;
      if (Math.abs(dx) > 50) this.step(dx < 0 ? 1 : -1);
    },
  },
};
</script>

<style scoped>
.wedding {
  padding-block: 48px 72px;
}

.wp-head h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 600;
  margin: 8px 0 0;
}

.wp-gate {
  max-width: 440px;
  margin-top: 28px;
}

.wp-gate-copy {
  color: var(--text-muted);
  margin: 0 0 16px;
}

.wp-gate-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.wp-input {
  flex: 1 1 200px;
  min-width: 0;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-strong);
  background: var(--surface);
  color: var(--text);
  font: inherit;
}

.wp-input:focus {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.wp-error {
  color: var(--pink);
  margin: 12px 0 0;
}

.wp-gallery {
  display: flex;
  flex-direction: column;
}

.wp-grid {
  order: 2;
}

.wp-pager--bottom {
  order: 3;
  margin-top: 24px;
}

.wp-pager {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 18px;
}

.wp-page {
  min-width: 38px;
  height: 38px;
  padding: 0 8px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-soft);
  font: inherit;
  cursor: pointer;
}

.wp-page:hover {
  border-color: var(--border-strong);
  color: var(--text);
}

.wp-page--on {
  background: var(--violet-deep);
  border-color: var(--violet);
  color: var(--text);
}

@media (max-width: 520px) {
  .wp-word {
    display: none;
  }
}

.wp-gap {
  color: var(--text-faint);
  padding: 0 2px;
}

.wp-count {
  color: var(--text-muted);
  margin: 12px 0 20px;
}

.wp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 6px;
}

@media (max-width: 520px) {
  .wp-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 3px;
  }
}

.wp-cell {
  aspect-ratio: 1;
  padding: 0;
  border: 0;
  border-radius: 4px;
  overflow: hidden;
  background: var(--surface);
  cursor: zoom-in;
}

.wp-cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  animation: wp-fade 0.3s var(--ease);
}

.wp-cell:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

@keyframes wp-fade {
  from {
    opacity: 0;
  }
}

.wp-lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 9, 18, 0.96);
}

.wp-full {
  max-width: 100vw;
  max-height: calc(100vh - 64px);
  max-height: calc(100dvh - 64px);
  object-fit: contain;
}

.wp-full--loading {
  filter: blur(6px);
  width: min(100vw, 1100px);
}

.wp-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 52px;
  height: 52px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
}

.wp-nav:hover {
  background: rgba(255, 255, 255, 0.16);
}

.wp-nav--prev {
  left: 12px;
}

.wp-nav--next {
  right: 12px;
}

@media (hover: none) {
  .wp-nav {
    display: none;
  }
}

.wp-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 16px;
  color: var(--text-muted);
  font-size: 0.9375rem;
}

.wp-bar span {
  margin-right: auto;
}
</style>
