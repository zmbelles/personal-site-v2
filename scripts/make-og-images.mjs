/**
 * Regenerates the 1200x630 Open Graph cards in public/og/.
 *
 * Dev-only tool: the cards are committed, so a normal build never runs this.
 * Re-run it after changing a title in src/seo/pages.json:
 *
 *   npm i -D playwright && npm run og-images
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "og");

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error(
    "make-og-images: playwright is not installed.\n" +
      "  npm i -D playwright   (then re-run: npm run og-images)"
  );
  process.exit(1);
}

const BG = "#181825";
const CARD = "#362e5f";
const ACCENT = "#b39ddb";
const MUTED = "#bfa8cd";
const LINE = "#4c4278";

const shell = (body, extraCss = "") => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px; display: flex; overflow: hidden;
    background: ${BG};
    font-family: "Segoe UI", system-ui, sans-serif;
    color: #fff;
  }
  .card {
    flex: 1; margin: 32px; padding: 56px 64px; border-radius: 20px;
    background: ${CARD};
    display: flex; flex-direction: column; justify-content: center;
    position: relative; overflow: hidden;
  }
  .stripe {
    position: absolute; top: -80px; right: -120px; width: 420px; height: 900px;
    transform: rotate(24deg);
    background: linear-gradient(180deg, ${ACCENT}, #6f5aa8);
    opacity: .28;
  }
  .kicker {
    font-size: 24px; letter-spacing: .18em; text-transform: uppercase;
    color: ${MUTED}; margin-bottom: 20px;
  }
  h1 {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 68px; line-height: 1.1; max-width: 15ch;
  }
  h1.small { font-size: 52px; max-width: 20ch; }
  p.sub { margin-top: 24px; font-size: 27px; line-height: 1.4; color: ${MUTED}; max-width: 30ch; }
  .foot {
    position: absolute; left: 64px; bottom: 44px;
    font-size: 23px; color: ${ACCENT}; letter-spacing: .04em;
  }
  ${extraCss}
</style></head><body>${body}</body></html>`;

const titleCard = (kicker, title, sub, small) =>
  shell(`<div class="card">
    <div class="stripe"></div>
    <div class="kicker">${kicker}</div>
    <h1 class="${small ? "small" : ""}">${title}</h1>
    ${sub ? `<p class="sub">${sub}</p>` : ""}
    <div class="foot">thenetsuiteguy.com</div>
  </div>`);

// A miniature floor plan, so the card shows what the tool actually does.
const seatingCard = () => {
  const table = (cx, cy, r, label, seats, filled) => {
    const chairs = Array.from({ length: seats }, (_, i) => {
      const a = -Math.PI / 2 + (i / seats) * 2 * Math.PI;
      const x = cx + Math.cos(a) * (r + 26) - 15;
      const y = cy + Math.sin(a) * (r + 26) - 15;
      const on = filled.includes(i);
      return `<div class="seat${on ? " on" : ""}" style="left:${x}px;top:${y}px"></div>`;
    }).join("");
    return `${chairs}<div class="table" style="left:${cx - r}px;top:${cy - r}px;width:${r * 2}px;height:${r * 2}px">${label}</div>`;
  };

  return shell(
    `<div class="card">
      <div class="stripe"></div>
      <div class="kicker">Free · No sign-up</div>
      <h1>Wedding Seating&nbsp;Chart Maker</h1>
      <p class="sub">Drag your guests into their seats, then export.</p>
      <div class="foot">thenetsuiteguy.com/seating-chart</div>
      <div class="plan">
        ${table(148, 140, 62, "Table 1", 8, [0, 2, 5])}
        ${table(338, 330, 52, "Table 2", 7, [1, 4])}
      </div>
    </div>`,
    `.plan {
       position: absolute; right: 40px; top: 40px; width: 470px; height: 470px;
       background: #14101f; border-radius: 16px; border: 1px solid ${LINE};
       background-image: radial-gradient(circle at 1px 1px, #2e2748 2px, transparent 0);
       background-size: 26px 26px;
     }
     .table {
       position: absolute; border-radius: 50%; background: ${CARD};
       border: 3px solid ${ACCENT}; display: flex; align-items: center;
       justify-content: center; font-family: Georgia, serif;
       font-size: 17px; color: #cbbbe8;
     }
     .seat {
       position: absolute; width: 30px; height: 30px; border-radius: 50%;
       background: #2a2350; border: 2px solid #453c72;
     }
     .seat.on { background: #7fb3d5; border-color: rgba(0,0,0,.25); }`
  );
};

const cards = {
  "default.png": titleCard(
    "Zachary Belles",
    "NetSuite Developer &amp; Software Engineer",
    "SuiteScript, Advanced PDFs, and free browser tools."
  ),
  "seating-chart.png": seatingCard(),
  "gpt-in-netsuite.png": titleCard(
    "Blog · NetSuite",
    "The N/GPT Module: Navigating SuiteScript with GPT-4",
    null,
    true
  ),
  "first-year-lessons.png": titleCard(
    "Blog · Career",
    "Lessons from My First Year as a NetSuite Developer",
    null,
    true
  ),
  "be-intentional.png": titleCard(
    "Blog · Career",
    "Be Intentional: Tips for Software Developers",
    null,
    true
  ),
  "find-a-niche.png": titleCard(
    "Blog · Career",
    "Find a Niche and Fill It",
    "Standing out in a saturated tech job market."
  ),
};

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});

fs.mkdirSync(outDir, { recursive: true });
for (const [file, html] of Object.entries(cards)) {
  await page.setContent(html, { waitUntil: "load" });
  await page.screenshot({ path: path.join(outDir, file) });
  const kb = (fs.statSync(path.join(outDir, file)).size / 1024).toFixed(0);
  console.log(`og: ${file} (${kb} KB)`);
}

await browser.close();
