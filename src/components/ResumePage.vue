<template>
  <div class="resume-page">
    <header class="container page-hero resume-hero">
      <p class="eyebrow">Resume</p>
      <h1>Zachary M. Belles</h1>
      <p>{{ summary }}</p>
      <div class="hero-actions no-print">
        <button type="button" class="btn btn--primary" @click="print">Save as PDF</button>
        <router-link to="/contact" class="btn btn--ghost">Get in touch</router-link>
      </div>
    </header>

    <div class="container resume-layout">
      <aside class="resume-side">
        <section class="side-block">
          <h2 class="side-title">Contact</h2>
          <ul class="contact-list">
            <li><span>Location</span>Chicagoland area</li>
            <li><span>Email</span><a href="mailto:zmbelles97@gmail.com">zmbelles97@gmail.com</a></li>
            <li>
              <span>LinkedIn</span>
              <a href="https://www.linkedin.com/in/zachary-belles-333b42108/" target="_blank" rel="noopener">zachary-belles</a>
            </li>
            <li><span>GitHub</span><a href="https://github.com/zmbelles" target="_blank" rel="noopener">zmbelles</a></li>
            <li><span>Phone</span>Available on request</li>
          </ul>
        </section>

        <section class="side-block">
          <h2 class="side-title">Education</h2>
          <p class="edu-degree">B.S. Computer Science</p>
          <p class="edu-school">North Central College, Naperville, IL</p>
          <p class="edu-dates">September 2020 – May 2023</p>
        </section>

        <section class="side-block">
          <h2 class="side-title">Skills</h2>
          <div v-for="group in skills" :key="group.label" class="skill-group">
            <h3>{{ group.label }}</h3>
            <ul class="chip-list">
              <li v-for="item in group.items" :key="item" class="chip">{{ item }}</li>
            </ul>
          </div>
        </section>
      </aside>

      <div class="resume-main">
        <section>
          <h2 class="main-title">Experience</h2>

          <article v-for="job in experience" :key="job.company" class="job">
            <header class="job-head">
              <div>
                <h3 class="job-company">
                  <a v-if="job.url" :href="job.url" target="_blank" rel="noopener">{{ job.company }}</a>
                  <template v-else>{{ job.company }}</template>
                </h3>
                <p class="job-role">{{ job.role }}</p>
              </div>
              <p class="job-dates">{{ job.dates }}</p>
            </header>

            <p v-if="job.intro" class="job-intro">{{ job.intro }}</p>

            <div v-for="group in job.groups" :key="group.label || 'main'" class="job-group">
              <h4 v-if="group.label" class="job-group-label">{{ group.label }}</h4>
              <ul class="job-bullets">
                <li v-for="bullet in group.bullets" :key="bullet">{{ bullet }}</li>
              </ul>
            </div>

            <ul class="chip-list job-stack" aria-label="Technologies">
              <li v-for="tech in job.stack" :key="tech" class="chip">{{ tech }}</li>
            </ul>
          </article>
        </section>

        <section>
          <h2 class="main-title">Projects</h2>

          <article v-for="project in projects" :key="project.name" class="project">
            <header class="project-head">
              <h3>
                <router-link v-if="project.link" :to="project.link">{{ project.name }}</router-link>
                <template v-else>{{ project.name }}</template>
              </h3>
              <p class="project-context">{{ project.context }}</p>
            </header>
            <ul class="job-bullets">
              <li v-for="bullet in project.bullets" :key="bullet">{{ bullet }}</li>
            </ul>
            <ul class="chip-list job-stack" aria-label="Technologies">
              <li v-for="tech in project.stack" :key="tech" class="chip">{{ tech }}</li>
            </ul>

            <div v-if="project.images" class="shots no-print">
              <figure v-for="shot in project.images" :key="shot.caption">
                <img :src="shot.src" :alt="shot.alt" loading="lazy" />
                <figcaption>{{ shot.caption }}</figcaption>
              </figure>
            </div>
          </article>
        </section>

        <p class="footnote">
          Work history before or unrelated to software development is available on
          request. References are available through the
          <router-link to="/contact">contact page</router-link>.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import preOptimized from "@/assets/pre-optimized.png";
import optimized from "@/assets/optimized.png";

// Title, meta and structured data for this page live in src/seo/pages.json.
export default {
  name: "ResumePage",
  data() {
    return {
      summary:
        "NetSuite developer with over three years on the platform across consulting, in-house, and SuiteApp product roles. At Netgain I build NetAsset and NetLease, from federally regulated asset accounting and lease accounting logic to SuiteQL reporting, React interfaces, and AI tooling built on MCP and Claude.",

      experience: [
        {
          company: "Netgain Solutions",
          url: "https://www.netgain.tech/",
          role: "Developer II",
          dates: "2025 – Present",
          intro:
            "Product developer on Netgain's NetSuite SuiteApps: NetAsset for fixed asset management and NetLease for ASC 842 and GASB 87 lease accounting.",
          groups: [
            {
              bullets: [
                "Build features and fix defects across NetAsset and NetLease, covering depreciation, disposals, transfers, lease schedules, modifications, and journal posting.",
                "Build AI into the products with MCP tools and Claude-based workflows, and contribute to AI insights where Claude and other LLMs turn NetSuite data into explanations and recommendations for finance teams.",
                "Build query-based reports and React and TypeScript interfaces that finance teams use for month-end reporting and exports.",
                "Work with clients in testing sessions, triage support escalations, and take changes through QA and code review.",
                "Deliver client customizations alongside product work, such as validation that requires a project and asset type on fixed asset CIP and clearing lines.",
              ],
            },
          ],
          stack: ["SuiteScript 2.1", "SuiteQL", "React", "TypeScript", "Tailwind CSS", "AG Grid", "SuiteCloud SDF", "MCP", "Claude"],
        },
        {
          company: "Procare Solutions",
          role: "NetSuite Developer",
          dates: "August 2024 – 2025",
          groups: [
            {
              bullets: [
                "Served as the primary point of contact for NetSuite development, configuration, and user support.",
                "Developed and maintained customizations with SuiteScript, SuiteAnalytics, SuiteTalk, and the wider SuiteCloud platform.",
                "Managed configuration changes to fields, workflows, roles and permissions, page layouts, custom objects, and custom record types.",
                "Helped optimize order-to-cash and procure-to-pay processes handling over $1 billion in monthly sales.",
                "Combed the existing codebase for suboptimal code and improved the NetSuite environment proactively.",
                "Performed NetSuite upgrades and deployments, and provided ongoing break-fix and optimization support in production.",
                "Implemented and maintained integrations with third-party applications including Salesforce, Boomi, Avalara, and AWS.",
              ],
            },
          ],
          stack: ["SuiteScript", "SuiteAnalytics", "SuiteTalk", "Salesforce", "Boomi", "Avalara", "AWS"],
        },
        {
          company: "Solution Source",
          role: "Application Development Engineer",
          dates: "May 2023 – August 2024",
          groups: [
            {
              bullets: [
                "Delivered Oracle NetSuite solutions using the SuiteScript API, SQL, jQuery, and Vue.js.",
                "Ran thorough code reviews with colleagues so only well-written, documented code reached client production accounts.",
                "Dedicated 30 or more hours a week to billable client-facing tasks and improvements.",
                "Brought in $15,000 of development revenue per week as part of a pod of developers.",
                "Worked on projects ranging from 20 to 700 hours of developer work.",
                "Performed CRUD operations on NetSuite data using records, queries, and HTTP.",
                "Helped create new SuiteScript products to expand company IP.",
              ],
            },
          ],
          stack: ["SuiteScript", "SQL", "jQuery", "Vue.js", "SuiteCommerce"],
        },
      ],

      projects: [
        {
          name: "Federally Regulated Asset Accounting (FERC)",
          context: "Netgain Solutions, NetAsset",
          bullets: [
            "Built group depreciation into NetAsset for companies regulated by the Federal Energy Regulatory Commission. Assets depreciate as a pool on an average-balance basis, (beginning + ending gross) ÷ 2 × the group rate, posting one journal per asset type, subsidiary, and period while writing per-asset schedule lines so every entry stays traceable to an asset.",
            "Implemented regulatory retirement accounting: retirements run through accumulated depreciation instead of booking a gain or loss, salvage proceeds and removal costs post on their own lines, and mid-period retirements are weighted correctly into the group average.",
            "Enforced the regulatory rules across the product: group-level depreciation caps, segments on every posting line, prior-period transfers and disposals locked for grouped assets, multi-book and alternate schedules blocked, a group depreciation page that runs only unprocessed periods, and rollback support for grouped journals. Refined over several rounds of client testing.",
          ],
          stack: ["SuiteScript 2.1", "Map/Reduce", "Suitelets", "User Event and Client Scripts"],
        },
        {
          name: "NetAsset MCP Tool SuiteApp",
          context: "Netgain Solutions, NetAsset",
          bullets: [
            "Built a SuiteApp of MCP tools that lets AI assistants such as Claude work in NetSuite directly: look up, create, and modify assets, pull asset summaries and transactions, queue assets for capitalization, generate depreciation schedules, and run journals.",
            "Fixed Claude-initiated capitalization queues that failed because requests did not come from the NetSuite UI.",
          ],
          stack: ["MCP", "Claude", "SuiteScript 2.1", "JSON Schema"],
        },
        {
          name: "Claude-Based Workflows in NetSuite",
          context: "Netgain Solutions, in progress",
          bullets: [
            "Building workflows that let Claude carry routine accounting work in NetSuite, such as creating, capitalizing, and posting assets, from a single request to finished journals.",
          ],
          stack: ["Claude", "MCP", "SuiteScript 2.1"],
        },
        {
          name: "Query-Based Reporting and Report Generator",
          context: "Netgain Solutions, NetAsset and NetLease",
          bullets: [
            "Ported the React and TypeScript report generator from NetAsset to NetLease and kept the two at parity: date and accounting-period filters, multi-select filters, separate standard and waterfall query reports, and a redesigned filter and export UI.",
            "Moved NetAsset's waterfall reports from saved searches to SuiteQL, adding fiscal year, calendar year, and monthly grouping, date range filters, and result caching.",
            "Rebuilt Excel exports to download in the browser, keeping large reports clear of NetSuite's 10 MB file limit.",
          ],
          stack: ["React", "TypeScript", "Tailwind CSS", "AG Grid", "Vite", "SuiteQL"],
        },
        {
          name: "Netgain Error SDK",
          context: "Netgain Solutions, Q4 2026 Dev Summit hackathon",
          bullets: [
            "Designed the telemetry and reporting channel for a shared error capture and support routing library built for Netgain's SuiteApps.",
          ],
          stack: ["SuiteScript 2.1", "Telemetry"],
        },
        {
          name: "Wedding Seating Chart Maker",
          link: "/seating-chart",
          context: "Personal project, free and open source",
          bullets: [
            "A drag-and-drop seating planner that runs entirely in the browser: import a guest list, arrange round or rectangular tables on a zoomable floor plan, and export a PNG, CSV, or JSON. No account, and no guest data ever leaves the device.",
          ],
          stack: ["Vue 3", "JavaScript", "SVG"],
        },
        {
          name: "Optimized Delivery Routing Solution",
          context: "Solution Source",
          bullets: [
            "Lead developer for a Vue.js-based NetSuite SuiteApp that let users select and optimize delivery routes, manage custom records, and communicate directly with TrackAbout.",
            "Generated $30,000 in implementation fees from the client and an additional $15,000 per year per client in recurring revenue.",
          ],
          stack: ["SuiteScript", "Vue.js", "HTML/CSS", "SQL"],
          images: [
            {
              src: preOptimized,
              caption: "Before optimizing",
              alt: "NetSuite delivery routing screen before optimizing and selecting tickets",
            },
            {
              src: optimized,
              caption: "After optimizing",
              alt: "NetSuite delivery routing screen after optimizing and selecting tickets",
            },
          ],
        },
        {
          name: "DDS SFTP Integration for PIM Data",
          context: "Solution Source",
          bullets: [
            "Designed and implemented GET and POST scripts for SFTP data transfer and a reusable SFTP connection class in NetSuite, plus scripts that processed and updated item data from a Data Distribution System server, contributing to $40,000 in development revenue.",
            "Also assisted with SuiteCommerce website front-end design.",
          ],
          stack: ["SuiteScript", "Axios", "jQuery", "SQL"],
        },
        {
          name: "Vendor Feedback App",
          context: "Solution Source",
          bullets: [
            "Developed a mobile application for employees of milling companies to record the quality of the goods they machine.",
          ],
          stack: ["SuiteScript", "jQuery", "HTML/CSS", "SQL"],
        },
      ],

      skills: [
        {
          label: "Languages",
          items: ["JavaScript", "TypeScript", "SQL", "SuiteQL", "PostgreSQL", "MySQL", "Oracle SQL", "HTML/CSS", "Java"],
        },
        {
          label: "NetSuite",
          items: ["SuiteScript 2.x", "SuiteCloud SDF", "SuiteTalk", "SuiteAnalytics", "SuiteCommerce", "Advanced PDF/HTML", "Workflows"],
        },
        {
          label: "Frameworks and libraries",
          items: ["React", "Vue.js", "Next.js", "Tailwind CSS", "AG Grid", "jQuery", "Axios", "Knockout.js", "MongoDB"],
        },
        {
          label: "Accounting domains",
          items: ["Federally regulated (FERC) asset accounting", "Group depreciation", "Fixed asset depreciation", "ASC 842 leases", "GASB 87 leases", "O2C and P2P"],
        },
        {
          label: "AI",
          items: ["MCP tools", "Claude", "Claude Code", "AI insights", "Agentic workflows"],
        },
        {
          label: "Integrations",
          items: ["AWS", "Boomi", "Salesforce", "Avalara", "TrackAbout", "Magento", "UPS WorldShip", "NextBillion"],
        },
        {
          label: "Tools",
          items: ["Git", "Jira", "Postman", "VS Code", "Shell"],
        },
      ],
    };
  },
  methods: {
    print() {
      window.print();
    },
  },
};
</script>

<style scoped>
.resume-hero p {
  font-size: 1.125rem;
  max-width: 68ch;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.resume-layout {
  display: grid;
  grid-template-columns: minmax(0, 320px) minmax(0, 1fr);
  align-items: start;
  gap: clamp(32px, 5vw, 64px);
  padding-top: 24px;
  padding-bottom: clamp(64px, 10vw, 112px);
  border-top: 1px solid var(--border);
}

/* ---------- Sidebar ---------- */
.resume-side {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 16px;
}

.side-title,
.main-title {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 16px;
}

.contact-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
  font-size: 0.9375rem;
  color: var(--text-soft);
}

.contact-list li {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  gap: 8px;
  overflow-wrap: anywhere;
}

.contact-list span {
  color: var(--text-faint);
  font-size: 0.8125rem;
  padding-top: 2px;
}

.edu-degree {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text);
}

.edu-school,
.edu-dates {
  margin: 4px 0 0;
  font-size: 0.9375rem;
  color: var(--text-muted);
}

.edu-dates {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-faint);
}

.skill-group + .skill-group {
  margin-top: 18px;
}

.skill-group h3 {
  margin: 0 0 8px;
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-soft);
}

.skill-group .chip {
  font-size: 0.75rem;
  padding: 3px 10px;
}

/* ---------- Main column ---------- */
.resume-main {
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding-top: 16px;
}

.job,
.project {
  position: relative;
  padding: 0 0 32px 28px;
  border-left: 1px solid var(--border-strong);
}

.job:last-child,
.project:last-child {
  padding-bottom: 0;
}

.job::before,
.project::before {
  content: "";
  position: absolute;
  top: 8px;
  left: -6px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--bg);
  border: 2px solid var(--mauve);
}

.job:first-of-type::before {
  background: var(--gradient);
  border-color: transparent;
  box-shadow: 0 0 0 4px rgba(192, 141, 190, 0.18);
}

.job-head,
.project-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px 24px;
  flex-wrap: wrap;
}

.job-company,
.project-head h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text);
}

.project-head h3 {
  font-size: 1.25rem;
}

.job-company a,
.project-head h3 a {
  color: inherit;
}

.job-company a:hover,
.project-head h3 a:hover {
  color: var(--pink);
}

.job-role {
  margin: 2px 0 0;
  color: var(--accent);
  font-weight: 500;
}

.job-dates,
.project-context {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text-faint);
  white-space: nowrap;
}

.project-context {
  white-space: normal;
}

.job-intro {
  margin: 14px 0 0;
  color: var(--text-soft);
}

.job-group {
  margin-top: 18px;
}

.job-group-label {
  margin: 0 0 6px;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text);
}

.job-bullets {
  margin: 10px 0 0;
  padding-left: 1.1em;
  color: var(--text-muted);
}

.job-bullets li {
  margin-bottom: 8px;
  padding-left: 4px;
}

.job-bullets li::marker {
  color: var(--mauve);
}

.job-stack {
  margin-top: 16px;
}

.job-stack .chip {
  font-size: 0.75rem;
  padding: 3px 10px;
}

.shots {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.shots figure {
  margin: 0;
}

.shots img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-strong);
}

.shots figcaption {
  margin-top: 8px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-faint);
}

.footnote {
  margin: 0;
  padding: 16px 20px;
  border-radius: var(--radius);
  border: 1px dashed var(--border-strong);
  color: var(--text-muted);
  font-size: 0.9375rem;
}

@media (max-width: 900px) {
  .resume-layout {
    grid-template-columns: 1fr;
  }

  .resume-side {
    order: 2;
  }

  .shots {
    grid-template-columns: 1fr;
  }
}

/* ---------- Print ---------- */
@media print {
  .resume-page,
  .resume-page * {
    color: #000 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  .page-hero {
    padding: 0 0 12px;
  }

  .page-hero h1 {
    font-size: 26pt;
  }

  .resume-hero p {
    font-size: 10.5pt;
  }

  .resume-layout {
    display: block;
    padding: 0;
    border: none;
  }

  .resume-side {
    display: block;
    padding: 0;
  }

  .side-block {
    margin-bottom: 14px;
  }

  .resume-main {
    display: block;
  }

  .resume-main section {
    margin-top: 14px;
  }

  .job,
  .project {
    border: none;
    padding: 0 0 12px;
    break-inside: avoid;
  }

  .job::before,
  .project::before {
    display: none;
  }

  .chip {
    border: 1px solid #bbb;
    padding: 1px 6px !important;
  }

  .footnote {
    border: none;
    padding: 0;
  }
}
</style>
