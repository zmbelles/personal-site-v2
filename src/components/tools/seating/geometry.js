// Geometry helpers for laying out tables and their seats.

export const SEAT_SIZE = 46; // px diameter of a seat
export const SEAT_GAP = 28; // px from table edge to seat center
export const MARGIN = SEAT_GAP + SEAT_SIZE / 2 + 8; // padding inside a table node so seats fit

export const SHAPES = ["circle", "oval", "square", "rectangle"];

// The floor plan tables are laid out on, in unscaled px.
export const CANVAS_W = 2600;
export const CANVAS_H = 1800;

// Width/height of the table surface itself, sized to comfortably fit `seats`.
export function tableDims(shape, seats) {
  const n = Math.max(1, seats);
  switch (shape) {
    case "circle": {
      const d = Math.max(96, 46 + n * 12);
      return { w: d, h: d };
    }
    case "square": {
      const s = Math.max(96, 54 + n * 12);
      return { w: s, h: s };
    }
    case "oval": {
      const perSide = Math.ceil(n / 2);
      return { w: Math.max(150, 60 + perSide * 26), h: 104 };
    }
    case "rectangle":
    default: {
      const perSide = Math.ceil(n / 2);
      return { w: Math.max(160, 50 + perSide * 30), h: 96 };
    }
  }
}

// Seat centers relative to the table center, offset outward from the surface.
export function seatPositions(shape, seats, dims) {
  const n = Math.max(0, seats);
  if (shape === "circle" || shape === "oval") return ellipseSeats(dims.w, dims.h, n);
  return rectSeats(dims.w, dims.h, n);
}

function ellipseSeats(w, h, n) {
  const rx = w / 2 + SEAT_GAP;
  const ry = h / 2 + SEAT_GAP;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i / n) * 2 * Math.PI; // start at top, go clockwise
    pts.push({ x: rx * Math.cos(a), y: ry * Math.sin(a) });
  }
  return pts;
}

function rectSeats(w, h, n) {
  const perim = 2 * (w + h);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const d = ((i + 0.5) / n) * perim; // walk perimeter, centered on each segment
    let x;
    let y;
    let nx;
    let ny;
    if (d < w) {
      x = d;
      y = 0;
      nx = 0;
      ny = -1;
    } else if (d < w + h) {
      x = w;
      y = d - w;
      nx = 1;
      ny = 0;
    } else if (d < 2 * w + h) {
      x = w - (d - (w + h));
      y = h;
      nx = 0;
      ny = 1;
    } else {
      x = 0;
      y = h - (d - (2 * w + h));
      nx = -1;
      ny = 0;
    }
    pts.push({ x: x - w / 2 + nx * SEAT_GAP, y: y - h / 2 + ny * SEAT_GAP });
  }
  return pts;
}

// Full bounding box of a table node (surface + surrounding seats).
export function nodeSize(shape, seats) {
  const dims = tableDims(shape, seats);
  return { w: dims.w + 2 * MARGIN, h: dims.h + 2 * MARGIN, dims };
}
