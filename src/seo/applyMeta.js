import head from "./head.cjs";

// Marks the tags this module owns. The prerenderer stamps the same attribute on
// the tags it writes into the static HTML, so the first client-side pass
// replaces them instead of leaving duplicates behind.
const OWNED = "data-seo";

function clearOwned() {
  document.head.querySelectorAll(`[${OWNED}]`).forEach((el) => el.remove());
}

export default function applyMeta(path) {
  const { title, metas, links, jsonLd } = head.buildHead(path);

  document.title = title;
  clearOwned();

  const frag = document.createDocumentFragment();

  for (const m of metas) {
    const el = document.createElement("meta");
    el.setAttribute(m.attr, m.key);
    el.setAttribute("content", m.content);
    el.setAttribute(OWNED, "");
    frag.appendChild(el);
  }

  for (const l of links) {
    const el = document.createElement("link");
    el.setAttribute("rel", l.rel);
    el.setAttribute("href", l.href);
    el.setAttribute(OWNED, "");
    frag.appendChild(el);
  }

  for (const block of jsonLd) {
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON.stringify(block);
    el.setAttribute(OWNED, "");
    frag.appendChild(el);
  }

  document.head.appendChild(frag);
}
