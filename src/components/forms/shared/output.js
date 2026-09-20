/**
 * Turns the rendered sheet into something you can keep: a PDF, the browser
 * print dialog, or a JSON file.
 *
 * html2pdf pulls in html2canvas and jsPDF — around half a megabyte that nobody
 * who is only reading the page should have to download — so it is imported
 * dynamically and webpack keeps it in its own chunk.
 */
import { PAGE_WIDTH, renderDocumentHtml } from "./documentHtml.js";
import { slugify, todayIso } from "./transaction.js";

export function fileName(doc, spec, extension) {
  const who = slugify(doc.company.name, spec.filePrefix);
  const which = slugify(doc.number, todayIso());
  return `${who}-${spec.filePrefix}-${which}.${extension}`;
}

/** Builds the sheet in a real, laid-out, offscreen node. */
function mountSheet(doc, spec) {
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  // Off to the left rather than display:none — html2canvas measures layout, and
  // a hidden element has none.
  host.style.cssText = `position:fixed;left:-10000px;top:0;width:${PAGE_WIDTH}px;background:#ffffff;`;
  host.innerHTML = renderDocumentHtml(doc, spec, { preview: false });
  document.body.appendChild(host);
  return host;
}

/** Resolves once every image inside has loaded, or after `timeout` either way. */
function imagesReady(root, timeout = 4000) {
  const pending = Array.from(root.querySelectorAll("img")).filter((img) => !img.complete);
  if (!pending.length) return Promise.resolve();

  return Promise.race([
    Promise.all(
      pending.map(
        (img) =>
          new Promise((resolve) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
          })
      )
    ),
    new Promise((resolve) => setTimeout(resolve, timeout)),
  ]);
}

export async function downloadPdf(doc, spec) {
  const { default: html2pdf } = await import("html2pdf.js");
  const host = mountSheet(doc, spec);

  try {
    await imagesReady(host);
    await html2pdf()
      .set({
        margin: 0,
        filename: fileName(doc, spec, "pdf"),
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"], avoid: "tr" },
      })
      .from(host.firstElementChild)
      .save();
  } finally {
    host.remove();
  }
}

/**
 * Prints through a throwaway iframe so the browser lays the sheet out itself —
 * real selectable text, and no rasterising.
 */
export async function printDocument(doc, spec) {
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.setAttribute("title", "Print preview");
  frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
  document.body.appendChild(frame);

  const inner = frame.contentDocument;
  inner.open();
  inner.write(
    `<!doctype html><html><head><meta charset="utf-8"><title>${fileName(doc, spec, "pdf").replace(
      /\.pdf$/,
      ""
    )}</title><style>@page{size:A4;margin:0}html,body{margin:0;padding:0;background:#fff}</style></head><body>${renderDocumentHtml(
      doc,
      spec,
      { preview: false }
    )}</body></html>`
  );
  inner.close();

  await imagesReady(inner);

  const view = frame.contentWindow;
  // Safari needs focus on the frame before print() will target it.
  view.focus();
  view.print();

  // afterprint does not fire everywhere, so the timer is the backstop.
  const cleanUp = () => frame.remove();
  view.addEventListener("afterprint", cleanUp, { once: true });
  setTimeout(cleanUp, 60000);
}

export function downloadJson(payload, name) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
