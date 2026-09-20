/**
 * Everything that differs between the two documents.
 *
 * TransactionBuilder.vue and documentHtml.js read only from a spec, so adding a
 * third form (a purchase order, a quote) is a matter of adding an object here,
 * a route, and an entry in src/seo/pages.json.
 */

export const invoiceSpec = {
  kind: "invoice",
  path: "/forms/invoice",

  // Printed on the document.
  docTitle: "INVOICE",
  detailsHeading: "Invoice details",
  docNoun: "invoice",
  numberLabel: "Invoice #",
  numberPlaceholder: "INV-1001",
  dateLabel: "Invoice date",
  dueDateLabel: "Due date",
  referenceLabel: "",

  // Line items.
  lineHeading: "Services",
  lineNoun: "service",
  lineDescriptionLabel: "Description",
  lineRateLabel: "Rate",
  showWeight: false,

  // Panels.
  showShipTo: false,
  showTerms: true,
  statuses: ["Open", "Paid in Full", "Past Due"],
  paidLabel: "Amount paid",
  balanceLabel: "Balance due",
  // The status printed as a stamp across the document rather than as a line of
  // text; only "paid" is worth shouting about.
  stampStatus: "Paid in Full",

  filePrefix: "invoice",
  storageKey: "tng.forms.invoice.v1",
};

export const salesOrderSpec = {
  kind: "sales-order",
  path: "/forms/sales-order",

  docTitle: "SALES ORDER",
  detailsHeading: "Order details",
  docNoun: "order",
  numberLabel: "Order #",
  numberPlaceholder: "SO-1001",
  dateLabel: "Order date",
  dueDateLabel: "Ship date",
  referenceLabel: "Ship method",

  lineHeading: "Items",
  lineNoun: "item",
  lineDescriptionLabel: "Item",
  lineRateLabel: "Price",
  showWeight: true,

  showShipTo: true,
  showTerms: false,
  statuses: ["Pending Approval", "Pending Fulfillment", "Partially Fulfilled", "Billed", "Closed"],
  paidLabel: "Deposit received",
  balanceLabel: "Balance on delivery",
  stampStatus: "Closed",

  filePrefix: "sales-order",
  storageKey: "tng.forms.sales-order.v1",
};
