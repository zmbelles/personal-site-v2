import seo from "@/seo/pages.json";

// Blog listings read titles, descriptions and dates from src/seo/pages.json so
// the cards, the sitemap and the structured data can never disagree.
const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export const posts = Object.entries(seo.pages)
  .filter(([path, page]) => path.startsWith("/blog/") && !page.noindex)
  .map(([path, page]) => ({
    path,
    title: page.title,
    description: page.description,
    section: page.section,
    published: page.published,
    date: dateFormat.format(new Date(page.published)),
  }))
  .sort((a, b) => new Date(b.published) - new Date(a.published));
