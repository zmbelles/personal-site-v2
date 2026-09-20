<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-pattern" aria-hidden="true"></div>
      <div class="container hero-grid">
        <div class="hero-copy">
          <p class="eyebrow status">
            <span class="status-dot" aria-hidden="true"></span>
            Developer II at Netgain
          </p>
          <h1 class="hero-title">
            Hi, I'm Zach. I build <span class="gradient-text">NetSuite software</span> for finance teams.
          </h1>
          <p class="hero-lede">
            I work on NetAsset and NetLease, Netgain's fixed asset and lease
            accounting SuiteApps. I've been building on NetSuite since 2023, first
            as a consultant, then as an in-house developer, and now on a product team.
          </p>
          <div class="hero-actions">
            <router-link to="/resume" class="btn btn--primary">View my resume</router-link>
            <router-link to="/blog" class="btn btn--ghost">Read the blog</router-link>
          </div>
          <dl class="hero-meta">
            <div>
              <dt>Company</dt>
              <dd><a href="https://www.netgain.tech/" target="_blank" rel="noopener">Netgain Solutions</a></dd>
            </div>
            <div>
              <dt>Alma mater</dt>
              <dd><a href="https://www.northcentralcollege.edu/" target="_blank" rel="noopener">North Central College</a></dd>
            </div>
          </dl>
        </div>

        <div class="hero-visual" aria-hidden="true">
          <div class="glow"></div>
          <LogoMark class="hero-mark" />
          <div class="code-card">
            <div class="code-bar">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              <span class="code-file">zach_sl.js</span>
            </div>
            <pre class="code"><code><span class="c">/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */</span>
<span class="k">define</span>([<span class="s">'N/query'</span>], (query) =&gt; {
  <span class="k">const</span> zach = {
    <span class="p">role</span>: <span class="s">'Developer II'</span>,
    <span class="p">company</span>: <span class="s">'Netgain'</span>,
    <span class="p">products</span>: [<span class="s">'NetAsset'</span>, <span class="s">'NetLease'</span>],
    <span class="p">stack</span>: [<span class="s">'SuiteScript'</span>, <span class="s">'SuiteQL'</span>,
            <span class="s">'React'</span>, <span class="s">'TypeScript'</span>],
  };
  <span class="k">return</span> { <span class="p">onRequest</span>: () =&gt; zach };
});</code></pre>
          </div>
        </div>
      </div>

      <div class="container">
        <ul class="stats">
          <li><strong>3+</strong><span>years building on NetSuite</span></li>
          <li><strong>2</strong><span>accounting SuiteApps I develop</span></li>
          <li><strong>{{ postCount }}</strong><span>posts on NetSuite and dev life</span></li>
          <li><strong>B.S.</strong><span>Computer Science, 2023</span></li>
        </ul>
      </div>
    </section>

    <!-- What I do -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow">What I do</p>
            <h2 class="section-title">Product work on NetSuite, end to end</h2>
          </div>
        </div>

        <div class="focus-grid">
          <article class="card focus">
            <div class="icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 3 3 7.5l9 4.5 9-4.5L12 3Z" /><path d="m3 12 9 4.5 9-4.5" /><path d="m3 16.5 9 4.5 9-4.5" /></svg>
            </div>
            <h3>SuiteApp development</h3>
            <p>
              Features for NetAsset and NetLease: depreciation, lease schedules,
              journals, disposals, and modifications, written in SuiteScript 2.1
              and held to the accounting standards behind them.
            </p>
          </article>
          <article class="card focus">
            <div class="icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M22 20H2" /></svg>
            </div>
            <h3>Reporting and UI</h3>
            <p>
              SuiteQL-backed reports and a React and TypeScript report generator,
              with the filters, waterfalls, and Excel exports people rely on at
              month end.
            </p>
          </article>
          <article class="card focus">
            <div class="icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="m6 6 2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></svg>
            </div>
            <h3>AI inside NetSuite</h3>
            <p>
              MCP tools that let assistants like Claude look up, create, and
              process assets directly, so routine work can be asked for instead
              of clicked through.
            </p>
          </article>
        </div>

        <div class="toolbox">
          <p class="toolbox-label">Toolbox</p>
          <ul class="chip-list">
            <li v-for="tool in toolbox" :key="tool" class="chip">{{ tool }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Experience -->
    <section class="section section--alt">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow">Experience</p>
            <h2 class="section-title">Where I've built</h2>
          </div>
          <router-link to="/resume" class="arrow-link">Full resume</router-link>
        </div>

        <ol class="timeline">
          <li v-for="item in timeline" :key="item.org" class="timeline-item">
            <span class="timeline-when">{{ item.when }}</span>
            <div class="timeline-body">
              <h3>{{ item.org }}</h3>
              <p class="timeline-role">{{ item.role }}</p>
              <p class="timeline-note">{{ item.note }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- Writing -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow">Writing</p>
            <h2 class="section-title">Latest from the blog</h2>
          </div>
          <router-link to="/blog" class="arrow-link">All posts</router-link>
        </div>

        <div class="post-grid">
          <router-link v-for="post in latestPosts" :key="post.path" :to="post.path" class="card card--link post-card">
            <p class="post-meta">
              <span>{{ post.section }}</span>
              <time :datetime="post.published">{{ post.date }}</time>
            </p>
            <h3>{{ post.title }}</h3>
            <p class="post-desc">{{ post.description }}</p>
            <span class="arrow-link">Read post</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Tools -->
    <section class="section section--alt">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow">Free tools</p>
            <h2 class="section-title">Things I've built for anyone to use</h2>
          </div>
        </div>

        <div class="tools-grid">
          <router-link to="/seating-chart" class="card card--link tool-feature">
            <div class="tool-copy">
              <span class="badge">New</span>
              <h3>Wedding Seating Chart Maker</h3>
              <p>
                Drag-and-drop seating for weddings and events. Import a guest list,
                arrange your tables, and export a PNG, CSV, or JSON. Free, no
                sign-up, and nothing leaves your device.
              </p>
              <span class="arrow-link">Plan your seating</span>
            </div>
            <svg class="tool-art" viewBox="0 0 220 160" aria-hidden="true">
              <g v-for="t in tables" :key="t.x + '-' + t.y">
                <circle :cx="t.x" :cy="t.y" r="22" class="art-table" />
                <circle
                  v-for="n in 8"
                  :key="n"
                  :cx="t.x + 34 * Math.cos((n * Math.PI) / 4)"
                  :cy="t.y + 34 * Math.sin((n * Math.PI) / 4)"
                  r="6"
                  :class="(n + t.seed) % 3 === 0 ? 'art-seat' : 'art-seat art-seat--filled'"
                />
              </g>
            </svg>
          </router-link>

          <router-link to="/games" class="card card--link tool-card">
            <h3>Browser games</h3>
            <p>Hyper Tic-Tac-Toe on a 9x9 board and Button Match. No download.</p>
            <span class="arrow-link">Play</span>
          </router-link>

          <router-link to="/forms" class="card card--link tool-card">
            <h3>Invoice &amp; sales order generators</h3>
            <p>Fill in the form, watch the sheet build itself, download the PDF.</p>
            <span class="arrow-link">Make one</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Fun facts -->
    <section class="section">
      <div class="container facts-wrap">
        <div>
          <p class="eyebrow">Off the clock</p>
          <h2 class="section-title">A few things about me</h2>
          <p class="section-lede">
            Formula 1, turn-based strategy, and a Dungeons &amp; Dragons table that
            has been going for a while. Flip a card to find out more.
          </p>
        </div>
        <FunFacts />
      </div>
    </section>

    <!-- Contact CTA -->
    <section class="container cta-wrap">
      <div class="cta">
        <div>
          <h2>Have a NetSuite question or an idea worth building?</h2>
          <p>Send me a note. I read everything and reply within a week.</p>
        </div>
        <router-link to="/contact" class="btn btn--primary">Get in touch</router-link>
      </div>
    </section>
  </div>
</template>

<script>
import FunFacts from "@/components/FunFacts.vue";
import LogoMark from "@/components/LogoMark.vue";
import { posts } from "@/data/posts.js";

// Title, meta and structured data for this page live in src/seo/pages.json.
export default {
  name: "HomePage",
  components: {
    FunFacts,
    LogoMark,
  },
  data() {
    return {
      postCount: posts.length,
      latestPosts: posts.slice(0, 3),
      toolbox: [
        "SuiteScript 2.1",
        "SuiteQL",
        "SuiteCloud SDF",
        "JavaScript",
        "TypeScript",
        "React",
        "Vue",
        "Tailwind CSS",
        "AG Grid",
        "SQL",
        "MCP",
        "Git",
      ],
      timeline: [
        {
          when: "2025 – Now",
          org: "Netgain Solutions",
          role: "Developer II",
          note: "NetAsset and NetLease: fixed asset and lease accounting SuiteApps.",
        },
        {
          when: "2024 – 2025",
          org: "Procare Solutions",
          role: "NetSuite Developer",
          note: "In-house NetSuite owner for scripts, integrations, and O2C and P2P.",
        },
        {
          when: "2023 – 2024",
          org: "Solution Source",
          role: "Application Development Engineer",
          note: "Client SuiteScript projects and company SuiteApps, 20 to 700 hours each.",
        },
        {
          when: "2020 – 2023",
          org: "North Central College",
          role: "B.S. Computer Science",
          note: "Naperville, Illinois.",
        },
      ],
      tables: [
        { x: 50, y: 50, seed: 0 },
        { x: 150, y: 58, seed: 1 },
        { x: 96, y: 118, seed: 2 },
      ],
    };
  },
};
</script>

<style scoped>
/* ---------- Hero ---------- */
.hero {
  position: relative;
  overflow: hidden;
  padding-block: clamp(40px, 8vw, 96px) 0;
}

.hero-pattern {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Cpath d='M28 4 52 28 28 52 4 28Z' fill='none' stroke='%23ffffff' stroke-opacity='0.05'/%3E%3C/svg%3E");
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 70% 30%, #000 20%, transparent 75%);
  mask-image: radial-gradient(ellipse 70% 60% at 70% 30%, #000 20%, transparent 75%);
  pointer-events: none;
}

.hero-grid {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  align-items: center;
  gap: clamp(32px, 6vw, 72px);
}

.status {
  padding: 6px 12px 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-soft);
  letter-spacing: 0.06em;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #7ee2b8;
  box-shadow: 0 0 0 0 rgba(126, 226, 184, 0.6);
}

@media (prefers-reduced-motion: no-preference) {
  .status-dot {
    animation: pulse 2.4s ease-out infinite;
  }

  .hero-copy > *,
  .hero-visual {
    animation: rise 0.7s var(--ease) both;
  }

  .hero-copy > :nth-child(2) { animation-delay: 60ms; }
  .hero-copy > :nth-child(3) { animation-delay: 120ms; }
  .hero-copy > :nth-child(4) { animation-delay: 180ms; }
  .hero-copy > :nth-child(5) { animation-delay: 240ms; }
  .hero-visual { animation-delay: 200ms; }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(126, 226, 184, 0.55); }
  70%, 100% { box-shadow: 0 0 0 8px rgba(126, 226, 184, 0); }
}

@keyframes rise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: none; }
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.25rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.04;
  margin: 22px 0 0;
}

.hero-lede {
  font-size: clamp(1.0625rem, 1.6vw, 1.1875rem);
  color: var(--text-muted);
  max-width: 54ch;
  margin: 22px 0 0;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 36px;
  margin: 36px 0 0;
}

.hero-meta dt {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.hero-meta dd {
  margin: 4px 0 0;
  font-weight: 500;
}

/* Visual */
.hero-visual {
  position: relative;
  min-height: 380px;
  display: grid;
  place-items: center;
}

.glow {
  position: absolute;
  width: 70%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(116, 103, 176, 0.45), rgba(224, 168, 205, 0.12) 55%, transparent 70%);
  filter: blur(20px);
}

.hero-mark {
  position: absolute;
  top: -6%;
  right: -4%;
  width: 46%;
  opacity: 0.9;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5));
}

.code-card {
  position: relative;
  width: min(100%, 440px);
  margin-top: 48px;
  border-radius: var(--radius);
  border: 1px solid var(--border-strong);
  background: rgba(18, 17, 32, 0.9);
  backdrop-filter: blur(8px);
  box-shadow: 0 30px 60px -24px rgba(0, 0, 0, 0.8);
  overflow: hidden;
  transform: rotate(-1.5deg);
}

.code-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border-strong);
}

.code-file {
  margin-left: 10px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-faint);
}

.code {
  margin: 0;
  padding: 18px 20px 20px;
  font-family: var(--font-mono);
  font-size: clamp(0.72rem, 1.1vw, 0.8125rem);
  line-height: 1.7;
  color: var(--text-soft);
  overflow-x: auto;
}

.code .c { color: #7f7a99; }
.code .k { color: #c792ea; }
.code .s { color: #e8b4d6; }
.code .p { color: #8fd3c7; }

/* Stats */
.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: clamp(48px, 7vw, 80px) 0 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--border);
}

.stats li {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 24px 20px 28px 0;
}

.stats li + li {
  padding-left: 20px;
  border-left: 1px solid var(--border);
}

.stats strong {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.5vw, 2.25rem);
  font-weight: 600;
  line-height: 1;
  color: var(--text);
}

.stats span {
  color: var(--text-muted);
  font-size: 0.875rem;
}

/* ---------- Sections ---------- */
.section--alt {
  background: var(--bg-deep);
  border-block: 1px solid var(--border);
}

.focus-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.focus h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 18px 0 8px;
}

.focus p {
  color: var(--text-muted);
  margin: 0;
}

.icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(116, 103, 176, 0.35), rgba(224, 168, 205, 0.18));
  border: 1px solid var(--border-strong);
  color: var(--pink);
}

.icon svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.toolbox {
  display: flex;
  align-items: baseline;
  gap: 16px 24px;
  margin-top: 28px;
}

.toolbox-label {
  flex: none;
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-faint);
}

/* Timeline */
.timeline {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.timeline-item {
  position: relative;
  padding-top: 28px;
}

.timeline-item::before {
  content: "";
  position: absolute;
  top: 5px;
  left: 0;
  right: -16px;
  height: 1px;
  background: var(--border-strong);
}

.timeline-item:last-child::before {
  right: 0;
  background: linear-gradient(90deg, var(--border-strong), transparent);
}

.timeline-item::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--bg-deep);
  border: 2px solid var(--mauve);
}

.timeline-item:first-child::after {
  background: var(--gradient);
  border-color: transparent;
  box-shadow: 0 0 0 4px rgba(192, 141, 190, 0.18);
}

.timeline-when {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-faint);
}

.timeline-body h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 8px 0 2px;
}

.timeline-role {
  margin: 0;
  color: var(--accent);
  font-size: 0.9375rem;
  font-weight: 500;
}

.timeline-note {
  margin: 8px 0 0;
  color: var(--text-muted);
  font-size: 0.9375rem;
}

/* Posts */
.post-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.post-card {
  display: flex;
  flex-direction: column;
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

.post-meta span {
  color: var(--accent);
}

.post-card h3 {
  font-size: 1.1875rem;
  font-weight: 600;
  margin: 14px 0 8px;
  color: var(--text);
}

.post-desc {
  color: var(--text-muted);
  font-size: 0.9375rem;
  margin: 0 0 20px;
  flex: 1;
}

/* Tools */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.tool-feature {
  grid-row: span 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  overflow: hidden;
}

.tool-feature h3,
.tool-card h3 {
  font-size: 1.375rem;
  font-weight: 600;
  margin: 14px 0 8px;
  color: var(--text);
}

.tool-card h3 {
  font-size: 1.1875rem;
  margin-top: 0;
}

.tool-feature p,
.tool-card p {
  color: var(--text-muted);
  margin: 0 0 18px;
}

.tool-art {
  width: 100%;
  max-width: 320px;
  align-self: center;
}

.art-table {
  fill: var(--surface-2);
  stroke: var(--border-strong);
}

.art-seat {
  fill: var(--bg-deep);
  stroke: var(--border-strong);
}

.art-seat--filled {
  fill: var(--mauve);
  stroke: none;
}

.tool-feature:hover .art-seat--filled {
  fill: var(--pink);
}

/* Facts */
.facts-wrap {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  align-items: center;
  gap: clamp(32px, 6vw, 72px);
}

/* CTA */
.cta-wrap {
  padding-bottom: clamp(56px, 9vw, 104px);
}

.cta {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: clamp(28px, 5vw, 48px);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-strong);
  background:
    radial-gradient(ellipse at 100% 0%, rgba(224, 168, 205, 0.18), transparent 55%),
    radial-gradient(ellipse at 0% 100%, rgba(116, 103, 176, 0.3), transparent 55%),
    var(--surface);
  overflow: hidden;
}

.cta h2 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
  margin: 0;
}

.cta p {
  margin: 10px 0 0;
  color: var(--text-muted);
}

/* ---------- Responsive ---------- */
@media (max-width: 960px) {
  .hero-grid,
  .facts-wrap {
    grid-template-columns: 1fr;
  }

  .hero-visual {
    min-height: 0;
    padding-bottom: 8px;
  }

  .hero-mark {
    width: 34%;
    top: 0;
    right: 2%;
  }

  .focus-grid,
  .post-grid {
    grid-template-columns: 1fr;
  }

  .timeline {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 32px;
  }

  .timeline-item::before {
    right: 0;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }

  .tool-feature {
    grid-row: auto;
  }

  .toolbox {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 640px) {
  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stats li:nth-child(3) {
    padding-left: 0;
    border-left: none;
  }

  .stats li:nth-child(n + 3) {
    border-top: 1px solid var(--border);
  }

  .timeline {
    grid-template-columns: 1fr;
    row-gap: 0;
  }

  .timeline-item {
    padding: 0 0 28px 28px;
  }

  .timeline-item::before {
    top: 11px;
    bottom: 0;
    left: 5px;
    right: auto;
    width: 1px;
    height: auto;
  }

  .timeline-item:last-child::before {
    background: linear-gradient(180deg, var(--border-strong), transparent);
  }

  .timeline-body h3 {
    margin-top: 2px;
  }

  .cta {
    flex-direction: column;
    align-items: flex-start;
  }

  .code-card {
    transform: none;
  }
}
</style>
