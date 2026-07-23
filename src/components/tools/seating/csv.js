// Minimal CSV parsing plus guest-name extraction with light header detection.

export function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// Turn arbitrary CSV/pasted text into a flat list of guest names.
export function parseGuestsFromCSV(text) {
  const rows = parseCSV(text).filter((r) => r.some((c) => c && c.trim()));
  if (!rows.length) return [];

  const header = rows[0].map((c) => c.trim().toLowerCase());
  let firstIdx = -1;
  let lastIdx = -1;
  let nameIdx = -1;
  header.forEach((h, i) => {
    if (["first", "first name", "firstname"].includes(h)) firstIdx = i;
    if (["last", "last name", "lastname", "surname"].includes(h)) lastIdx = i;
    if (["name", "guest", "full name", "guest name"].includes(h)) nameIdx = i;
  });
  const hasHeader = firstIdx >= 0 || lastIdx >= 0 || nameIdx >= 0;
  const dataRows = hasHeader ? rows.slice(1) : rows;

  const names = [];
  for (const r of dataRows) {
    let name = "";
    if (hasHeader) {
      if (nameIdx >= 0 && r[nameIdx]) name = r[nameIdx];
      else name = [r[firstIdx] || "", r[lastIdx] || ""].join(" ");
    } else {
      const cells = r.map((c) => c.trim()).filter(Boolean);
      if (cells.length >= 2 && cells.every((c) => Number.isNaN(Number(c)))) {
        name = cells.slice(0, 2).join(" ");
      } else {
        name = cells[0] || "";
      }
    }
    name = name.trim();
    if (name) names.push(name);
  }
  return names;
}
