/**
 * Renders a document object as a sheet of printable HTML.
 *
 * One renderer feeds all three outputs, the live preview, the PDF and the
 * print dialog, so what you see while typing is exactly what comes out.
 *
 * Every rule is an inline style on purpose. html2canvas rasterises a clone of
 * this markup, and a clone only keeps the styling it carries with it; a
 * stylesheet that happens to be attached to the page would not survive.
 */
import {
  addressLines,
  computeTotals,
  formatDate,
  formatMoney,
  formatQuantity,
  lineAmount,
  num,
} from "./transaction.js";

/** Width of A4 at 96dpi. The preview scales this down; the PDF prints it 1:1. */
export const PAGE_WIDTH = 794;

const INK = "#1f2430";
const MUTED = "#6b7280";
const FAINT = "#9aa1ad";
const RULE = "#e3e6ec";
const WASH = "#f6f7f9";

const esc = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** A hex accent at partial strength, for washes behind the accent colour. */
function tint(hex, alpha) {
  const match = /^#?([0-9a-f]{6})$/i.exec(String(hex ?? "").trim());
  if (!match) return "rgba(59, 49, 99, " + alpha + ")";
  const int = parseInt(match[1], 16);
  return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`;
}

/**
 * Missing fields show as a faint dash while editing so the layout does not jump
 * around as it fills in, and collapse to nothing in the finished document.
 */
function value(text, preview) {
  const clean = String(text ?? "").trim();
  if (clean) return esc(clean);
  return preview ? `<span style="color:${FAINT}">-</span>` : "";
}

function addressBlock(text, preview, placeholder) {
  const lines = addressLines(text);
  if (!lines.length) {
    return preview
      ? `<div style="color:${FAINT};font-style:italic">${esc(placeholder)}</div>`
      : "";
  }
  return lines
    .map(
      (line, index) =>
        `<div style="${index === 0 ? "font-weight:600;" : ""}margin-bottom:2px">${esc(line)}</div>`
    )
    .join("");
}

function metaRow(label, text) {
  if (!text) return "";
  return `
    <tr>
      <td style="padding:3px 12px 3px 0;color:${MUTED};white-space:nowrap">${esc(label)}</td>
      <td style="padding:3px 0;text-align:right;font-weight:600;color:${INK};white-space:nowrap">${esc(text)}</td>
    </tr>`;
}

/** `amount` is already-escaped markup from money(); `label` is plain text. */
function totalRow(label, amount, { strong = false, accent = INK, rule = false } = {}) {
  return `
    <tr>
      <td style="padding:${strong ? "10px" : "5px"} 14px ${strong ? "10px" : "5px"} 0;text-align:right;color:${strong ? accent : MUTED};font-weight:${strong ? "700" : "400"};font-size:${strong ? "12.5px" : "11.5px"};${rule ? `border-top:1px solid ${RULE};` : ""}">${esc(label)}</td>
      <td style="padding:${strong ? "10px" : "5px"} 0;text-align:right;color:${strong ? accent : INK};font-weight:${strong ? "700" : "600"};font-size:${strong ? "13.5px" : "11.5px"};white-space:nowrap;${rule ? `border-top:1px solid ${RULE};` : ""}">${amount}</td>
    </tr>`;
}

export function renderDocumentHtml(doc, spec, { preview = false } = {}) {
  // Both of these land inside style and text nodes below, so neither is taken
  // on trust: the accent has to be a plain hex colour, and every formatted
  // amount is escaped like any other value.
  const trimmed = String(doc.accent ?? "").trim();
  const accent = /^#[0-9a-f]{6}$/i.test(trimmed) ? trimmed : "#3b3163";
  const totals = computeTotals(doc);
  const money = (amount) => esc(formatMoney(amount, doc.currency));

  /* ---------- masthead ---------- */

  const brand = doc.company.logo
    ? `<img src="${esc(doc.company.logo)}" alt="" style="max-width:240px;max-height:76px;width:auto;height:auto;object-fit:contain;display:block">`
    : `<div style="font-size:21px;font-weight:700;letter-spacing:-0.01em;color:${accent}">${
        value(doc.company.name, preview) || "&nbsp;"
      }</div>`;

  const fromLines = [
    doc.company.logo ? doc.company.name : "",
    ...addressLines(doc.company.address),
    [doc.company.phone, doc.company.email].filter(Boolean).join("  ·  "),
    doc.company.website,
  ].filter(Boolean);

  const from = fromLines
    .map((line) => `<div style="margin-bottom:2px">${esc(line)}</div>`)
    .join("");

  /* ---------- document meta ---------- */

  // The number is already set beneath the title, so it is not repeated here.
  const meta = [
    metaRow(spec.dateLabel, formatDate(doc.date)),
    metaRow(spec.dueDateLabel, formatDate(doc.dueDate)),
    spec.showTerms ? metaRow("Terms", doc.terms === "Custom" ? "" : doc.terms) : "",
    metaRow("PO #", doc.poNumber),
    spec.referenceLabel ? metaRow(spec.referenceLabel, doc.reference) : "",
    metaRow("Status", doc.status === spec.stampStatus ? "" : doc.status),
  ]
    .filter(Boolean)
    .join("");

  /* ---------- parties ---------- */

  const parties = [
    `<td style="vertical-align:top;padding-right:24px;width:${spec.showShipTo ? "34%" : "58%"}">
       <div style="font-size:9.5px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:${MUTED};margin-bottom:6px">Bill to</div>
       <div style="font-size:11.5px;line-height:1.45">${addressBlock(doc.billTo, preview, "Customer name and address")}</div>
     </td>`,
    spec.showShipTo
      ? `<td style="vertical-align:top;padding-right:24px;width:34%">
           <div style="font-size:9.5px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:${MUTED};margin-bottom:6px">Ship to</div>
           <div style="font-size:11.5px;line-height:1.45">${addressBlock(
             doc.shipTo || doc.billTo,
             preview,
             "Shipping name and address"
           )}</div>
         </td>`
      : "",
    `<td style="vertical-align:top;width:32%">
       <table style="width:100%;border-collapse:collapse;font-size:11px">${meta}</table>
     </td>`,
  ]
    .filter(Boolean)
    .join("");

  /* ---------- line items ---------- */

  const columns = [
    { label: "#", width: "28px", align: "right" },
    { label: spec.lineDescriptionLabel, width: "auto", align: "left" },
    { label: "Qty", width: "52px", align: "right" },
    { label: "Unit", width: "48px", align: "center" },
    spec.showWeight ? { label: "Weight", width: "64px", align: "right" } : null,
    { label: spec.lineRateLabel, width: "82px", align: "right" },
    { label: "Amount", width: "92px", align: "right" },
  ].filter(Boolean);

  const head = columns
    .map(
      (column) =>
        `<th style="padding:8px 10px;text-align:${column.align};font-size:9.5px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:#ffffff;background-color:${accent};${
          column.width === "auto" ? "" : `width:${column.width};`
        }">${esc(column.label)}</th>`
    )
    .join("");

  const cell = (content, align, extra = "") =>
    `<td style="padding:8px 10px;text-align:${align};font-size:11.5px;color:${INK};border-bottom:1px solid ${RULE};${extra}">${content}</td>`;

  const body = doc.lines
    .map((line, index) => {
      const cells = [
        cell(String(index + 1), "right", `color:${FAINT}`),
        cell(value(line.description, preview), "left"),
        cell(formatQuantity(line.quantity), "right"),
        cell(esc(line.unit || ""), "center", `color:${MUTED}`),
        spec.showWeight ? cell(num(line.weight) ? formatQuantity(line.weight) : "", "right") : "",
        cell(money(line.rate), "right"),
        cell(money(lineAmount(line)), "right", "font-weight:600"),
      ]
        .filter(Boolean)
        .join("");

      return `<tr style="page-break-inside:avoid;background-color:${
        index % 2 ? WASH : "#ffffff"
      }">${cells}</tr>`;
    })
    .join("");

  /* ---------- totals ---------- */

  const showBalance = totals.paid !== 0 || totals.balance !== totals.total;

  const totalsRows = [
    totalRow("Subtotal", money(totals.subtotal)),
    totals.discount
      ? totalRow(`Discount (${formatQuantity(doc.discountRate)}%)`, "-" + money(totals.discount))
      : "",
    totals.tax ? totalRow(`Tax (${formatQuantity(doc.taxRate)}%)`, money(totals.tax)) : "",
    totals.shipping ? totalRow("Shipping & handling", money(totals.shipping)) : "",
    totalRow("Total", money(totals.total), { strong: true, accent, rule: true }),
    showBalance ? totalRow(spec.paidLabel, "-" + money(totals.paid)) : "",
    showBalance
      ? totalRow(spec.balanceLabel, money(totals.balance), { strong: true, accent, rule: true })
      : "",
  ]
    .filter(Boolean)
    .join("");

  // Counts rather than money, so they sit beside the totals stack instead of
  // inside it where they would read as amounts.
  const tally = [
    `${doc.lines.length} line${doc.lines.length === 1 ? "" : "s"}`,
    spec.showWeight && totals.weight ? `total weight ${formatQuantity(totals.weight)}` : "",
  ]
    .filter(Boolean)
    .join("  ·  ");

  /* ---------- notes, stamp, footer ---------- */

  const notes = doc.memo.trim()
    ? `<div style="margin-top:26px;padding:14px 16px;border-left:3px solid ${accent};background-color:${WASH};page-break-inside:avoid">
         <div style="font-size:9.5px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:${MUTED};margin-bottom:6px">Notes</div>
         <div style="font-size:11.5px;line-height:1.5;color:${INK};white-space:pre-wrap">${esc(doc.memo.trim())}</div>
       </div>`
    : "";

  // Sits in the gap beside the totals rather than floating over the sheet,
  // where it would land on the meta table on a short document.
  const stamp =
    doc.status === spec.stampStatus
      ? `<div style="display:inline-block;transform:rotate(-8deg);margin:2px 0 12px 18px;padding:5px 16px;border:3px solid ${tint(
          accent,
          0.4
        )};border-radius:6px;color:${tint(
          accent,
          0.5
        )};font-size:21px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase">${esc(
          doc.status
        )}</div>`
      : "";

  const contact = [
    doc.company.email ? "Email: " + doc.company.email : "",
    doc.company.phone ? "Phone: " + doc.company.phone : "",
  ]
    .filter(Boolean)
    .join("  ·  ");

  const footer =
    doc.company.name || contact || doc.company.slogan
      ? `<div style="margin-top:32px;padding-top:14px;border-top:2px solid ${accent};text-align:center;page-break-inside:avoid">
           ${
             contact
               ? `<div style="font-size:10.5px;color:${MUTED};margin-bottom:4px">Questions about this ${esc(
                   spec.docTitle.toLowerCase()
                 )}? ${esc(contact)}</div>`
               : ""
           }
           ${
             doc.company.slogan
               ? `<div style="font-size:11.5px;font-weight:700;color:${accent}">${esc(
                   doc.company.slogan
                 )}</div>`
               : ""
           }
         </div>`
      : "";

  /* ---------- the sheet ---------- */

  return `
<div style="width:${PAGE_WIDTH}px;min-height:1123px;box-sizing:border-box;padding:48px 44px;background-color:#ffffff;color:${INK};font-family:Helvetica,Arial,sans-serif;font-size:11.5px;line-height:1.45">
  <table style="width:100%;border-collapse:collapse">
    <tr>
      <td style="vertical-align:top;width:58%">
        ${brand}
        <div style="margin-top:10px;font-size:11px;color:${MUTED};line-height:1.45">${from}</div>
      </td>
      <td style="vertical-align:top;text-align:right">
        <div style="font-size:30px;font-weight:800;letter-spacing:0.04em;color:${accent};line-height:1">${esc(
          spec.docTitle
        )}</div>
        <div style="margin-top:8px;font-size:12px;color:${MUTED}">${value(doc.number, preview)}</div>
      </td>
    </tr>
  </table>

  <div style="height:3px;margin:22px 0 20px;background-color:${accent}"></div>

  <table style="width:100%;border-collapse:collapse"><tr>${parties}</tr></table>

  <table style="width:100%;border-collapse:collapse;margin-top:26px">
    <thead><tr>${head}</tr></thead>
    <tbody>${body}</tbody>
  </table>

  <table style="width:100%;border-collapse:collapse;margin-top:18px;page-break-inside:avoid">
    <tr>
      <td style="width:55%;vertical-align:top;padding-top:6px">
        ${stamp}
        <div style="font-size:10.5px;color:${FAINT}">${esc(tally)}</div>
      </td>
      <td style="width:45%">
        <table style="width:100%;border-collapse:collapse">${totalsRows}</table>
      </td>
    </tr>
  </table>

  ${notes}
  ${footer}
</div>`;
}
