// Generates mysql/seed.sql and supabase/seed.sql (demo catalogue) from one definition.
//   node scripts/gen-seed.mjs   (and node scripts/gen-samples.mjs for the illustrations)
import { writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const cats = [[1, "t-shirts", "T-Shirts"], [2, "shirts", "Shirts"], [3, "trousers", "Trousers"], [4, "dresses", "Dresses"], [5, "accessories", "Accessories"], [6, "outerwear", "Outerwear"]];
const S = (sizes, color, hex, stocks) => sizes.map((s, i) => [s, color, hex, stocks[i] ?? 8]);
// id, slug, name, description, price, compare, category, featured, new, variants
const P = [
  [1, "classic-heavy-tee", "Classic Heavy Tee", "240 GSM combed cotton with a boxy, structured fit. Pre-washed so it stays true to size.", 3490, null, 1, 1, 1, [...S(["S", "M", "L", "XL"], "Black", "#111111", [12, 20, 15, 6]), ...S(["S", "M", "L"], "Bone", "#E7E0D3", [8, 14, 10])]],
  [2, "linen-resort-shirt", "Linen Resort Shirt", "Breathable pure linen made for Colombo humidity. Relaxed collar, coconut-shell buttons.", 6990, 7990, 2, 1, 1, [...S(["S", "M", "L"], "Sand", "#CDB891", [6, 10, 8]), ...S(["M", "L"], "Sage", "#8A9A7B", [5, 4])]],
  [3, "tailored-chino", "Tailored Chino", "Stretch cotton twill with a clean taper. Smart enough for the office, easy enough for the weekend.", 7490, null, 3, 1, 0, [...S(["30", "32", "34", "36"], "Navy", "#1F2A44", [7, 9, 9, 4]), ...S(["32", "34"], "Khaki", "#A89A78", [6, 6])]],
  [4, "ceylon-wrap-dress", "Ceylon Wrap Dress", "Flowing viscose wrap dress with a fluid hem and adjustable tie waist.", 8990, null, 4, 1, 1, S(["S", "M", "L"], "Terracotta", "#B5573A", [5, 8, 3])],
  [5, "oversized-hoodie", "Oversized Hoodie", "Brushed-back fleece, dropped shoulders, double-lined hood.", 8490, 9990, 1, 0, 1, S(["M", "L", "XL"], "Charcoal", "#3A3A3C", [10, 12, 0])],
  [6, "canvas-tote", "Everyday Canvas Tote", "Heavy 12oz canvas, internal zip pocket, reinforced straps.", 2990, null, 5, 0, 0, S(["One size"], "Natural", "#E9DFC8", [30])],
  [7, "essential-polo", "Essential Polo", "Piqué cotton polo with a soft collar that holds its shape. Clean enough for work, relaxed enough for the weekend.", 4990, null, 1, 1, 1, [...S(["S", "M", "L", "XL"], "Navy", "#14304F", [9, 14, 12, 6]), ...S(["M", "L"], "Ecru", "#E9E4D8", [8, 8])]],
  [8, "linen-shorts", "Linen Blend Shorts", "Cotton-linen shorts with a 7-inch inseam, elastic back waist and side pockets. Built for hot afternoons.", 4490, null, 3, 0, 1, [...S(["S", "M", "L"], "Stone", "#D9C9A3", [10, 14, 9]), ...S(["M", "L"], "Olive", "#5A6B52", [7, 6])]],
  [9, "oxford-button-down", "Oxford Button-Down", "Classic oxford weave with a soft roll collar. Gets better with every wash.", 6490, null, 2, 0, 0, [...S(["S", "M", "L", "XL"], "Sky", "#CFDCEC", [6, 12, 10, 5]), ...S(["M", "L"], "White", "#F1EFE8", [9, 9])]],
  [10, "pleated-wide-trousers", "Pleated Wide Trousers", "Double-pleat wide leg in a fluid cotton blend. High waist, full length, effortless drape.", 8290, 9490, 3, 1, 1, [...S(["30", "32", "34", "36"], "Graphite", "#4A4A45", [5, 8, 8, 4]), ...S(["32", "34"], "Sand", "#B9AB8C", [5, 5])]],
  [11, "slip-midi-dress", "Slip Midi Dress", "Bias-cut satin-finish midi with adjustable straps. Dress it up with heels or down with a tee.", 9490, null, 4, 1, 1, [...S(["S", "M", "L"], "Forest", "#2E3B32", [6, 9, 5]), ...S(["S", "M"], "Gold", "#C9A24A", [4, 4])]],
  [12, "summer-maxi-dress", "Summer Maxi Dress", "Lightweight tiered maxi in breathable viscose. Pockets included.", 9990, 11990, 4, 0, 0, [...S(["S", "M", "L", "XL"], "Blush", "#E1B8A0", [5, 9, 8, 4]), ...S(["M", "L"], "Sea", "#7E9AA6", [5, 5])]],
  [13, "cropped-boxy-tee", "Cropped Boxy Tee", "Heavyweight cotton in a cropped, boxy cut with a ribbed neck. Pairs with high-waisted everything.", 3290, null, 1, 0, 1, [...S(["XS", "S", "M", "L"], "Cream", "#F2EEE6", [6, 10, 10, 6]), ...S(["S", "M"], "Clay", "#C97B63", [6, 6])]],
  [14, "denim-overshirt", "Denim Overshirt", "Mid-weight washed denim in a relaxed overshirt cut. Wear it as a light jacket or buttoned up as a shirt.", 9990, null, 6, 1, 0, S(["S", "M", "L", "XL"], "Indigo", "#4D6784", [5, 9, 9, 4])],
  [15, "bucket-hat", "Cotton Bucket Hat", "Soft cotton twill bucket hat with a wide brim for sun protection. Packs flat.", 2490, null, 5, 0, 1, [...S(["One size"], "Khaki", "#BFAE8A", [25]), ...S(["One size"], "Black", "#2B2A27", [18])]],
  [16, "quilted-bomber-jacket", "Quilted Bomber Jacket", "Lightly padded bomber with a ribbed collar and hem, zip front and two hand pockets.", 12990, 14990, 6, 1, 1, [...S(["S", "M", "L", "XL"], "Moss", "#3F4A3A", [4, 7, 7, 3]), ...S(["M", "L"], "Black", "#1D1D1F", [5, 5])]],
  [17, "cotton-joggers", "Cotton Joggers", "Brushed-back french terry joggers with a tapered leg, drawcord waist and zip pocket.", 5490, null, 3, 0, 0, [...S(["S", "M", "L", "XL"], "Heather", "#7A7A7E", [8, 14, 12, 6]), ...S(["M", "L"], "Black", "#232325", [9, 9])]],
  [18, "everyday-cap", "Everyday Cap", "Six-panel cotton cap with a curved brim and adjustable strap. Embroidered logo.", 2290, null, 5, 0, 0, [...S(["One size"], "Rust", "#A85A3D", [20]), ...S(["One size"], "Ecru", "#E8E0CF", [16])]],
];

const q = (s) => "'" + String(s).replace(/'/g, "''") + "'";
let id = 0;
const body = [
  "INSERT IGNORE INTO categories (id, slug, name, sort) VALUES\n " + cats.map(([i, s, n]) => `(${i},${q(s)},${q(n)},${i})`).join(",\n ") + ";",
  "INSERT IGNORE INTO products (id, slug, name, description, price, compare_price, category_id, is_featured, is_new) VALUES\n " +
    P.map((p) => `(${p[0]},${q(p[1])},${q(p[2])},${q(p[3])},${p[4]},${p[5] ?? "NULL"},${p[6]},${p[7]},${p[8]})`).join(",\n ") + ";",
  "INSERT IGNORE INTO product_variants (product_id, size, color, color_hex, stock) VALUES\n " +
    P.flatMap((p) => p[9].map((v) => `(${p[0]},${q(v[0])},${q(v[1])},${q(v[2])},${v[3]})`)).join(",\n ") + ";",
  "INSERT IGNORE INTO product_images (id, product_id, url, sort) VALUES\n " +
    P.flatMap((p) => [1, 2].map((n) => `(${++id},${p[0]},${q(`/samples/${p[1]}-${n}.svg`)},${n})`)).join(",\n ") + ";",
  "INSERT IGNORE INTO settings (k, v) VALUES ('brand_name','Lanka Wear');",
].join("\n\n");

const my = "-- Demo content. Safe to delete once the real catalogue is entered in /admin.\nSET NAMES utf8mb4;\n\n" + body + "\n";
const pg =
  "-- Demo content (Postgres). Safe to delete once the real catalogue is entered in /admin.\n\n" +
  body.replace(/INSERT IGNORE INTO/g, "INSERT INTO").replace(/;(\n|$)/g, " ON CONFLICT DO NOTHING;$1") +
  "\n" +
  ["categories", "products", "product_images"].map((t) => `SELECT setval(pg_get_serial_sequence('${t}','id'), (SELECT MAX(id) FROM ${t}));`).join("\n") +
  "\n";
writeFileSync(path.join(root, "mysql", "seed.sql"), my);
writeFileSync(path.join(root, "supabase", "seed.sql"), pg);
console.log(P.length, "products,", id, "images");
