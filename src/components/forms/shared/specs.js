/**
 * Everything that differs between the documents.
 *
 * TransactionBuilder.vue and documentHtml.js read only from a spec, so adding a
 * fifth form (a quote, a credit memo) is a matter of adding an object here, a
 * route, and an entry in src/seo/pages.json.
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

  // Addresses. billTo is always required; shipTo only shows if showShipTo is
  // set. shipToSource picks what the "copy" shortcut fills in and what the
  // printed sheet falls back to when shipTo is left blank: "billTo" (ship to
  // the same party you're billing) or "company" (ship to yourself).
  billToLabel: "Bill to",
  billToExample: "Northwind Millwork\nAttn: Accounts Payable\n900 Rand Road\nArlington Heights, IL 60004",
  billToBlank: "Customer name and address",
  shipToBlank: "Shipping name and address",
  shipToSource: "billTo",

  // Panels.
  showShipTo: false,
  showTerms: true,
  showPoNumber: true,
  statuses: ["Open", "Paid in Full", "Past Due"],
  paidLabel: "Amount paid",
  balanceLabel: "Balance due",
  // The status printed as a stamp across the document rather than as a line of
  // text — only "paid" is worth shouting about.
  stampStatus: "Paid in Full",
  memoPlaceholder: "Anything the customer should read before paying.",

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

  billToLabel: "Bill to",
  billToExample: "Northwind Millwork\nAttn: Accounts Payable\n900 Rand Road\nArlington Heights, IL 60004",
  billToBlank: "Customer name and address",
  shipToBlank: "Shipping name and address",
  shipToSource: "billTo",

  showShipTo: true,
  showTerms: false,
  showPoNumber: true,
  statuses: ["Pending Approval", "Pending Fulfillment", "Partially Fulfilled", "Billed", "Closed"],
  paidLabel: "Deposit received",
  balanceLabel: "Balance on delivery",
  stampStatus: "Closed",
  memoPlaceholder: "Anything the customer should read before the order ships.",

  filePrefix: "sales-order",
  storageKey: "tng.forms.sales-order.v1",
};

export const purchaseOrderSpec = {
  kind: "purchase-order",
  path: "/forms/purchase-order",

  docTitle: "PURCHASE ORDER",
  detailsHeading: "Order details",
  docNoun: "purchase order",
  numberLabel: "PO #",
  numberPlaceholder: "PO-1001",
  dateLabel: "PO date",
  dueDateLabel: "Need-by date",
  referenceLabel: "Ship method",

  lineHeading: "Items",
  lineNoun: "item",
  lineDescriptionLabel: "Item",
  lineRateLabel: "Unit cost",
  showWeight: true,

  // The document's own number already is the PO number, so the generic PO #
  // reference field (which every other form uses to cite an outside PO) is
  // redundant here and hidden. billTo holds the vendor you're ordering from,
  // so a blank Ship to falls back to your own company address rather than
  // the vendor's, since that's who a purchase order almost always ships to.
  billToLabel: "Vendor",
  billToExample: "Timberline Steel Supply\nAttn: Order Desk\n4400 Industrial Pkwy\nJoliet, IL 60431",
  billToBlank: "Vendor name and address",
  shipToBlank: "Receiving name and address",
  shipToSource: "company",

  showShipTo: true,
  showTerms: false,
  showPoNumber: false,
  statuses: ["Draft", "Sent to Vendor", "Partially Received", "Received", "Closed"],
  paidLabel: "Deposit paid",
  balanceLabel: "Balance due on delivery",
  stampStatus: "Closed",
  memoPlaceholder: "Anything the vendor should read before fulfilling this order.",

  filePrefix: "purchase-order",
  storageKey: "tng.forms.purchase-order.v1",
};

export const vendorBillSpec = {
  kind: "vendor-bill",
  path: "/forms/vendor-bill",

  // Structurally the same document as an invoice: one company's invoice is
  // the next one's vendor bill. This version is worded for the accounts
  // payable side, and its generic PO # field is left on so it can cite the
  // purchase order it corresponds to.
  docTitle: "BILL",
  detailsHeading: "Bill details",
  docNoun: "bill",
  numberLabel: "Bill #",
  numberPlaceholder: "BILL-1001",
  dateLabel: "Bill date",
  dueDateLabel: "Due date",
  referenceLabel: "",

  lineHeading: "Charges",
  lineNoun: "charge",
  lineDescriptionLabel: "Description",
  lineRateLabel: "Rate",
  showWeight: false,

  billToLabel: "Bill to",
  billToExample: "Northwind Millwork\nAttn: Accounts Payable\n900 Rand Road\nArlington Heights, IL 60004",
  billToBlank: "Customer name and address",
  shipToBlank: "Shipping name and address",
  shipToSource: "billTo",

  showShipTo: false,
  showTerms: true,
  showPoNumber: true,
  statuses: ["Open", "Paid in Full", "Past Due"],
  paidLabel: "Amount paid",
  balanceLabel: "Balance due",
  stampStatus: "Paid in Full",
  memoPlaceholder: "Anything the customer should read before paying.",

  filePrefix: "vendor-bill",
  storageKey: "tng.forms.vendor-bill.v1",
};
