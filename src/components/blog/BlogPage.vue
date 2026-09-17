<template>
  <div class="blog-index">
    <header class="container page-hero">
      <p class="eyebrow">Blog</p>
      <h1>Notes on NetSuite and a developer career</h1>
      <p>
        SuiteScript patterns, Advanced PDF tricks, working with AI, and lessons
        learned along the way.
      </p>
      <div class="filters" role="group" aria-label="Filter posts by topic">
        <button
          v-for="option in sections"
          :key="option"
          type="button"
          class="filter"
          :class="{ active: option === active }"
          :aria-pressed="option === active ? 'true' : 'false'"
          @click="active = option"
        >
          {{ option }}
        </button>
      </div>
    </header>

    <div class="container posts">
      <router-link
        v-for="(post, i) in visible"
        :key="post.path"
        :to="post.path"
        class="card card--link post"
        :class="{ 'post--lead': i === 0 && active === 'All' }"
      >
        <p class="post-meta">
          <span class="post-section">{{ post.section }}</span>
          <time :datetime="post.published">{{ post.date }}</time>
        </p>
        <h2>{{ post.title }}</h2>
        <p class="post-desc">{{ post.description }}</p>
        <span class="arrow-link">Read post</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { posts } from "@/data/posts.js";

// Title, meta and structured data for this page live in src/seo/pages.json.
export default {
  name: "BlogPage",
  data() {
    return {
      posts,
      active: "All",
    };
  },
  computed: {
    sections() {
      return ["All", ...new Set(this.posts.map((p) => p.section))];
    },
    visible() {
      return this.active === "All" ? this.posts : this.posts.filter((p) => p.section === this.active);
    },
  },
};
</script>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 28px;
}

.filter {
  min-height: 36px;
  padding: 6px 16px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-muted);
  font: 500 0.875rem var(--font-sans);
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
}

.filter:hover {
  color: var(--text);
  border-color: var(--border-strong);
}

.filter.active {
  color: var(--text);
  border-color: rgba(179, 157, 219, 0.5);
  background: rgba(179, 157, 219, 0.14);
}

.posts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  padding-bottom: clamp(64px, 10vw, 112px);
}

.post {
  display: flex;
  flex-direction: column;
  min-height: 240px;
}

.post--lead {
  grid-column: 1 / -1;
  min-height: 0;
  background:
    radial-gradient(ellipse at 100% 0%, rgba(116, 103, 176, 0.28), transparent 60%),
    var(--surface);
  border-color: var(--border-strong);
}

.post-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-faint);
}

.post-section {
  color: var(--accent);
}

.post h2 {
  margin: 14px 0 8px;
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--text);
}

.post--lead h2 {
  font-size: clamp(1.625rem, 3.2vw, 2.25rem);
  max-width: 24ch;
}

.post-desc {
  margin: 0 0 20px;
  color: var(--text-muted);
  max-width: 62ch;
}

@media (max-width: 720px) {
  .posts {
    grid-template-columns: 1fr;
  }

  .post {
    min-height: 0;
  }
}
</style>
