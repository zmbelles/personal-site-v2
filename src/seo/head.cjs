/**
 * Builds the <head> contents for a route as plain data.
 *
 * Written as CommonJS on purpose: it is consumed both by the app bundle
 * (src/seo/applyMeta.js, which writes the result into the DOM on navigation)
 * and by the build-time prerenderer (scripts/prerender.mjs, which serializes
 * the same result into static HTML). One definition, two renderers.
 */
const data = require("./pages.json");

const SITE = data.site;
const PAGES = data.pages;

// Every card is generated at this size by scripts/make-og-images.mjs.
const OG_WIDTH = "1200";
const OG_HEIGHT = "630";

const abs = (p) => (/^https?:\/\//.test(p) ? p : SITE.origin + p);

const canonicalFor = (path) => abs(path === "/" ? "/" : path.replace(/\/+$/, ""));

function pageFor(path) {
  const clean = path.split("?")[0].split("#")[0];
  const key = clean.length > 1 ? clean.replace(/\/+$/, "") : "/";
  return PAGES[key] || null;
}

function indexablePaths() {
  return Object.keys(PAGES).filter((p) => !PAGES[p].noindex);
}

// An unrecognised path is a 404 — never invite crawlers to index one.
const NOT_FOUND = {
  title: "Page Not Found",
  description: "That page does not exist. Head back to the home page to find your way around.",
  noindex: true,
};

function buildHead(path) {
  const page = pageFor(path) || NOT_FOUND;
  const title = page.title || SITE.titleFallback;
  const description = page.description || SITE.description;
  const image = abs(page.image || SITE.image);
  const imageAlt = page.imageAlt || SITE.imageAlt;
  const url = canonicalFor(path);
  const type = page.type || "website";
  const isArticle = type === "article";

  const metas = [];
  const push = (attr, key, content) => {
    if (content) metas.push({ attr, key, content });
  };
  const name = (k, v) => push("name", k, v);
  const prop = (k, v) => push("property", k, v);

  // --- core ---
  name("description", description);
  name("keywords", page.keywords);
  name("author", SITE.author);
  name("application-name", SITE.name);
  name("apple-mobile-web-app-title", SITE.name);
  name("theme-color", SITE.themeColor);

  // --- crawling ---
  const robots = page.noindex
    ? "noindex, nofollow"
    : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";
  name("robots", robots);
  name("googlebot", robots);
  name("bingbot", robots);

  // --- Open Graph ---
  prop("og:title", title);
  prop("og:description", description);
  prop("og:type", isArticle ? "article" : type);
  prop("og:url", url);
  prop("og:site_name", SITE.name);
  prop("og:locale", SITE.locale);
  prop("og:image", image);
  prop("og:image:secure_url", image);
  prop("og:image:type", "image/png");
  prop("og:image:width", OG_WIDTH);
  prop("og:image:height", OG_HEIGHT);
  prop("og:image:alt", imageAlt);

  if (isArticle) {
    prop("article:published_time", page.published);
    prop("article:modified_time", page.modified || page.published);
    prop("article:author", SITE.author);
    prop("article:section", page.section);
    (page.keywords || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((tag) => prop("article:tag", tag));
  }

  if (type === "profile") {
    const parts = SITE.author.split(" ");
    prop("profile:first_name", parts[0]);
    prop("profile:last_name", parts.slice(1).join(" "));
  }

  // --- Twitter / X ---
  name("twitter:card", SITE.twitterCard);
  name("twitter:title", title);
  name("twitter:description", description);
  name("twitter:image", image);
  name("twitter:image:alt", imageAlt);

  // --- geo ---
  if (SITE.geo) {
    name("geo.region", SITE.geo.region);
    name("geo.placename", SITE.geo.placename);
    name("geo.position", SITE.geo.position);
    name("ICBM", SITE.geo.icbm);
  }

  const links = [{ rel: "canonical", href: url }];

  return {
    title,
    description,
    metas,
    links,
    jsonLd: buildJsonLd(path, page, { title, description, image, url, isArticle }),
  };
}

function buildJsonLd(path, page, ctx) {
  const graph = [];

  const publisher = {
    "@type": "Person",
    "@id": SITE.origin + "/#person",
    name: SITE.author,
    url: SITE.origin + "/",
    sameAs: SITE.sameAs,
  };

  if (path === "/") {
    graph.push({
      "@type": "WebSite",
      "@id": SITE.origin + "/#website",
      url: SITE.origin + "/",
      name: SITE.name,
      description: SITE.description,
      inLanguage: SITE.lang,
      publisher: { "@id": SITE.origin + "/#person" },
    });
    graph.push({
      ...publisher,
      jobTitle: "NetSuite Developer",
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "North Central College",
      },
    });
  }

  if (page.breadcrumb) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": ctx.url + "#breadcrumb",
      itemListElement: page.breadcrumb.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: canonicalFor(c.path),
      })),
    });
  }

  if (ctx.isArticle) {
    graph.push({
      "@type": "BlogPosting",
      "@id": ctx.url + "#article",
      headline: ctx.title,
      description: ctx.description,
      image: ctx.image,
      datePublished: page.published,
      dateModified: page.modified || page.published,
      inLanguage: SITE.lang,
      author: publisher,
      publisher: { "@id": SITE.origin + "/#person" },
      keywords: page.keywords,
      articleSection: page.section,
      mainEntityOfPage: { "@type": "WebPage", "@id": ctx.url },
    });
  }

  if (path === "/blog") {
    graph.push({
      "@type": "Blog",
      "@id": ctx.url + "#blog",
      name: ctx.title,
      description: ctx.description,
      inLanguage: SITE.lang,
      author: publisher,
      blogPost: indexablePaths()
        .filter((p) => p.startsWith("/blog/"))
        .map((p) => ({
          "@type": "BlogPosting",
          headline: PAGES[p].title,
          description: PAGES[p].description,
          datePublished: PAGES[p].published,
          url: canonicalFor(p),
        })),
    });
  }

  if (page.application) {
    const app = page.application;
    graph.push({
      "@type": "WebApplication",
      "@id": ctx.url + "#app",
      name: app.name,
      url: ctx.url,
      description: ctx.description,
      applicationCategory: app.category,
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires JavaScript",
      inLanguage: SITE.lang,
      isAccessibleForFree: true,
      featureList: app.featureList,
      author: publisher,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    });
  }

  if (page.faq) {
    graph.push({
      "@type": "FAQPage",
      "@id": ctx.url + "#faq",
      mainEntity: page.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  if (!graph.length) return [];
  return [{ "@context": "https://schema.org", "@graph": graph }];
}

module.exports = {
  SITE,
  PAGES,
  buildHead,
  pageFor,
  canonicalFor,
  indexablePaths,
};
