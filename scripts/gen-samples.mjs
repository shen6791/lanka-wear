// Generates tasteful SVG product illustrations for the demo catalogue -> public/samples/*.svg
//   node scripts/gen-samples.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const out = path.resolve(import.meta.dirname, "..", "public", "samples");
mkdirSync(out, { recursive: true });

const SHAPES = {
  tee: (c) => `<path d="M205 150 L118 205 L88 305 L152 325 L172 285 L172 655 L428 655 L428 285 L448 325 L512 305 L482 205 L395 150 Q300 215 205 150Z" fill="${c}"/>
    <path d="M205 150 Q300 222 395 150 Q300 182 205 150Z" fill="rgba(0,0,0,.22)"/>`,
  crop: (c) => `<path d="M205 190 L125 240 L98 330 L158 348 L176 312 L176 560 L424 560 L424 312 L442 348 L502 330 L475 240 L395 190 Q300 250 205 190Z" fill="${c}"/>
    <path d="M205 190 Q300 255 395 190 Q300 218 205 190Z" fill="rgba(0,0,0,.22)"/>`,
  polo: (c) => `<path d="M205 150 L118 205 L88 305 L152 325 L172 285 L172 655 L428 655 L428 285 L448 325 L512 305 L482 205 L395 150 L300 205Z" fill="${c}"/>
    <path d="M205 150 L300 205 L255 235 L195 175Z M395 150 L300 205 L345 235 L405 175Z" fill="rgba(255,255,255,.22)"/>
    <path d="M300 205 L300 330" stroke="rgba(0,0,0,.25)" stroke-width="3"/><circle cx="300" cy="245" r="5" fill="rgba(0,0,0,.35)"/><circle cx="300" cy="290" r="5" fill="rgba(0,0,0,.35)"/>`,
  shirt: (c) => `<path d="M205 145 L112 200 L70 520 L140 535 L172 330 L172 665 L428 665 L428 330 L460 535 L530 520 L488 200 L395 145 L300 205Z" fill="${c}"/>
    <path d="M205 145 L300 205 L255 245 L190 175Z M395 145 L300 205 L345 245 L410 175Z" fill="rgba(255,255,255,.28)"/>
    <path d="M300 205 L300 665" stroke="rgba(0,0,0,.22)" stroke-width="3"/>
    ${[260, 345, 430, 515, 600].map((y) => `<circle cx="300" cy="${y}" r="5" fill="rgba(0,0,0,.35)"/>`).join("")}
    <rect x="195" y="360" width="62" height="64" rx="3" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="3"/>`,
  hoodie: (c) => `<path d="M215 150 L112 215 L72 560 L146 575 L172 340 L172 665 L428 665 L428 340 L454 575 L528 560 L488 215 L385 150 Q300 215 215 150Z" fill="${c}"/>
    <path d="M215 150 Q300 70 385 150 Q300 230 215 150Z" fill="rgba(0,0,0,.2)"/><path d="M262 205 L258 290 M338 205 L342 290" stroke="rgba(255,255,255,.55)" stroke-width="5" stroke-linecap="round"/>
    <path d="M205 500 L395 500 L415 600 L185 600Z" fill="rgba(0,0,0,.12)"/>
    <rect x="172" y="636" width="256" height="29" fill="rgba(0,0,0,.16)"/>`,
  jacket: (c) => `<path d="M215 148 L112 212 L72 580 L148 592 L172 335 L172 650 L428 650 L428 335 L452 592 L528 580 L488 212 L385 148 Q300 195 215 148Z" fill="${c}"/>
    <path d="M300 185 L300 650" stroke="rgba(0,0,0,.35)" stroke-width="4"/><rect x="172" y="622" width="256" height="28" fill="rgba(0,0,0,.2)"/>
    <path d="M215 148 Q300 205 385 148 L385 170 Q300 225 215 170Z" fill="rgba(0,0,0,.2)"/><path d="M200 470 L270 470 M330 470 L400 470" stroke="rgba(0,0,0,.28)" stroke-width="4"/>`,
  trousers: (c) => `<path d="M192 130 L408 130 L432 705 L322 705 L300 340 L278 705 L168 705Z" fill="${c}"/>
    <rect x="192" y="130" width="216" height="34" fill="rgba(0,0,0,.2)"/><path d="M300 164 L300 340" stroke="rgba(0,0,0,.28)" stroke-width="3"/>
    <path d="M205 190 Q250 215 262 255 M395 190 Q350 215 338 255" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="3"/>`,
  shorts: (c) => `<path d="M188 190 L412 190 L446 480 L324 480 L300 330 L276 480 L154 480Z" fill="${c}"/>
    <rect x="188" y="190" width="224" height="36" fill="rgba(0,0,0,.2)"/><path d="M300 226 L300 330" stroke="rgba(0,0,0,.28)" stroke-width="3"/>`,
  dress: (c) => `<path d="M238 128 L268 128 Q300 188 332 128 L362 128 L384 330 L478 705 L122 705 L216 330Z" fill="${c}"/>
    <path d="M216 330 L384 330 L388 352 L212 352Z" fill="rgba(0,0,0,.2)"/><path d="M300 352 L300 705" stroke="rgba(0,0,0,.1)" stroke-width="3"/>
    <path d="M268 128 Q300 188 332 128" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="4"/>`,
  tote: (c) => `<path d="M225 300 Q225 130 300 130 Q375 130 375 300" fill="none" stroke="${c}" stroke-width="22" stroke-linecap="round"/>
    <path d="M165 300 L435 300 L458 690 L142 690Z" fill="${c}"/><rect x="165" y="300" width="270" height="22" fill="rgba(0,0,0,.14)"/>
    <rect x="235" y="440" width="130" height="90" rx="4" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="4"/>`,
  hat: (c) => `<ellipse cx="300" cy="500" rx="230" ry="62" fill="${c}"/><path d="M175 500 Q170 290 300 285 Q430 290 425 500Z" fill="${c}"/>
    <ellipse cx="300" cy="500" rx="230" ry="62" fill="rgba(0,0,0,.14)"/><path d="M176 470 Q300 520 424 470 L426 500 Q300 550 174 500Z" fill="rgba(0,0,0,.3)"/>`,
};

const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v + amt)));
  return "#" + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, "0")).join("");
};

function svg(kind, color, bgA, bgB, label) {
  const g = SHAPES[kind](color);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" role="img" aria-label="${label}">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bgA}"/><stop offset="1" stop-color="${bgB}"/></linearGradient>
<linearGradient id="sh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".45" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
<filter id="blur"><feGaussianBlur stdDeviation="14"/></filter>
</defs>
<rect width="600" height="800" fill="url(#bg)"/>
<ellipse cx="300" cy="742" rx="190" ry="20" fill="#000" opacity=".16" filter="url(#blur)"/>
<g>${g}</g>
<g style="mix-blend-mode:multiply" opacity=".9"><rect width="600" height="800" fill="url(#sh)" opacity=".35"/></g>
</svg>`;
}

// slug, kind, garment colour, second colour
const ITEMS = [
  ["classic-heavy-tee", "tee", "#1b1b1b", "#e7e0d3"],
  ["linen-resort-shirt", "shirt", "#cdb891", "#8a9a7b"],
  ["tailored-chino", "trousers", "#1f2a44", "#a89a78"],
  ["ceylon-wrap-dress", "dress", "#b5573a", "#6b2f20"],
  ["oversized-hoodie", "hoodie", "#3a3a3c", "#8d8f93"],
  ["canvas-tote", "tote", "#e9dfc8", "#3b3a36"],
  ["essential-polo", "polo", "#14304f", "#e9e4d8"],
  ["linen-shorts", "shorts", "#d9c9a3", "#5a6b52"],
  ["oxford-button-down", "shirt", "#cfdcec", "#f1efe8"],
  ["pleated-wide-trousers", "trousers", "#4a4a45", "#b9ab8c"],
  ["slip-midi-dress", "dress", "#2e3b32", "#c9a24a"],
  ["summer-maxi-dress", "dress", "#e1b8a0", "#7e9aa6"],
  ["cropped-boxy-tee", "crop", "#f2eee6", "#c97b63"],
  ["denim-overshirt", "jacket", "#4d6784", "#2c3e55"],
  ["bucket-hat", "hat", "#bfae8a", "#2b2a27"],
  ["quilted-bomber-jacket", "jacket", "#3f4a3a", "#1d1d1f"],
  ["cotton-joggers", "trousers", "#7a7a7e", "#232325"],
  ["everyday-cap", "hat", "#a85a3d", "#e8e0cf"],
];

const bgs = [
  ["#efe9de", "#d8cfbd"],
  ["#e6ebe4", "#c8d1c3"],
  ["#ece2da", "#d9c7bb"],
  ["#e3e6ec", "#c9cfdb"],
];

ITEMS.forEach(([slug, kind, c1, c2], i) => {
  const [a, b] = bgs[i % bgs.length];
  writeFileSync(path.join(out, `${slug}-1.svg`), svg(kind, c1, a, b, slug.replace(/-/g, " ")));
  writeFileSync(path.join(out, `${slug}-2.svg`), svg(kind, c2, "#2a2623", "#12100f", slug.replace(/-/g, " ") + " alternate"));
});
console.log("wrote", ITEMS.length * 2, "illustrations to", out);
