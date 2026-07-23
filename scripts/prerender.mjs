/**
 * Writes a real static HTML file for every route after the webpack build.
 *
 * Without this the site is a single index.html and GitHub Pages answers every
 * deep link (/blog/..., /seating-chart) with a 404, so crawlers never index
 * them and social scrapers — which do not run JavaScript — never see any
 * Open Graph tags. Each generated file carries that route's full <head>, so a
 * crawler gets the right title, description, canonical, card and JSON-LD from
 * the raw HTML, and the SPA takes over from there.
 *
 * Also emits sitemap.xml and a 404.html that returns a real 404 status while
 * still booting the app at the requested URL.
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

const head = require(path.join(root, "src/seo/head.cjs"));
const { SITE, PAGES, buildHead, canonicalFor, indexablePaths } = head;

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Removes anything a previous run injected so re-running without a rebuild
// cannot stack duplicate tags.
function stripOwned(html) {
  return html
    .replace(/\s*<(meta|link|script)[^>]*\sdata-seo(=""|)[^>]*>(<\/script>)?/g, "")
    .replace(/\s*<noscript data-seo[\s\S]*?<\/noscript>/g, "");
}

function renderHead({ title, metas, links, jsonLd }) {
  const out = [`<title>${esc(title)}</title>`];
  for (const m of metas) {
    out.push(`<meta ${m.attr}="${esc(m.key)}" content="${esc(m.content)}" data-seo>`);
  }
  for (const l of links) {
    out.push(`<link rel="${esc(l.rel)}" href="${esc(l.href)}" data-seo>`);
  }
  for (const block of jsonLd) {
    const json = JSON.stringify(block).replace(/</g, "\\u003c");
    out.push(`<script type="application/ld+json" data-seo>${json}</script>`);
  }
  return out.map((l) => "  " + l).join("\n");
}

// Readable fallback for scrapers and crawlers that do not execute JavaScript.
function renderNoscript(title, description) {
  const nav = [
    ["/", "Home"],
    ["/resume", "Resume"],
    ["/blog", "Blog"],
    ["/seating-chart", "Wedding Seating Chart Maker"],
    ["/games", "Games"],
    ["/forms", "Forms"],
    ["/contact", "Contact"],
  ]
    .map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`)
    .join("");
  return [
    `<noscript data-seo>`,
    `<h1>${esc(title)}</h1>`,
    `<p>${esc(description)}</p>`,
    `<p>This page needs JavaScript to run. Other pages on this site:</p>`,
    `<ul>${nav}</ul>`,
    `</noscript>`,
  ].join("");
}

function pageHtml(template, routePath) {
  const built = buildHead(routePath);
  let html = template.replace(
    /(\s*)<title>[\s\S]*?<\/title>/,
    "\n" + renderHead(built) + "\n"
  );
  if (!html.includes("<title>")) {
    html = html.replace("</head>", renderHead(built) + "\n</head>");
  }
  return html.replace(
    '<div id="app">',
    renderNoscript(built.title, built.description) + '<div id="app">'
  );
}

function writePage(routePath, html) {
  const target =
    routePath === "/"
      ? path.join(dist, "index.html")
      : path.join(dist, routePath.replace(/^\//, ""), "index.html");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
  return path.relative(dist, target).replace(/\\/g, "/");
}

function sitemap() {
  const urls = indexablePaths()
    .map((p) => {
      const page = PAGES[p];
      const lastmod = page.modified || page.published;
      return [
        "  <url>",
        `    <loc>${esc(canonicalFor(p))}</loc>`,
        lastmod ? `    <lastmod>${esc(lastmod)}</lastmod>` : null,
        page.changefreq ? `    <changefreq>${page.changefreq}</changefreq>` : null,
        page.priority ? `    <priority>${page.priority}</priority>` : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function main() {
  const indexPath = path.join(dist, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.error("prerender: dist/index.html is missing — run the build first.");
    process.exit(1);
  }

  const template = stripOwned(fs.readFileSync(indexPath, "utf8"));
  const written = [];

  for (const routePath of Object.keys(PAGES)) {
    written.push(writePage(routePath, pageHtml(template, routePath)));
  }

  // GitHub Pages serves this with a 404 status for anything unmatched, which is
  // the correct signal; the app still boots and renders its not-found view.
  fs.writeFileSync(path.join(dist, "404.html"), pageHtml(template, "/__not-found__"));
  written.push("404.html");

  fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap());
  fs.writeFileSync(
    path.join(dist, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE.origin}/sitemap.xml\n`
  );

  console.log(`prerender: ${written.length} html files`);
  for (const f of written) console.log("  " + f);
  console.log(`prerender: sitemap.xml (${indexablePaths().length} urls), robots.txt`);
}

main();
