import { cache } from "react";
import { rows, one } from "./db";

export type Settings = {
  brand_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  shipping_colombo: number;
  shipping_island: number;
  free_shipping_over: number;
  bank_name: string;
  bank_branch: string;
  bank_account_name: string;
  bank_account_no: string;
  announcement: string;
};

const DEFAULTS: Settings = {
  brand_name: "Lanka Wear",
  tagline: "Made in Colombo. Worn everywhere.",
  phone: "+94 77 000 0000",
  whatsapp: "94770000000",
  email: "hello@example.lk",
  address: "Colombo, Sri Lanka",
  instagram: "",
  facebook: "",
  shipping_colombo: 350,
  shipping_island: 450,
  free_shipping_over: 10000,
  bank_name: "Bank of Ceylon",
  bank_branch: "Colombo",
  bank_account_name: "Lanka Wear (Pvt) Ltd",
  bank_account_no: "0000000000",
  announcement: "Island-wide delivery · Cash on delivery available · Free shipping over Rs. 10,000",
};

const NUMERIC = new Set(["shipping_colombo", "shipping_island", "free_shipping_over"]);

export const getSettings = cache(async (): Promise<Settings> => {
  const out: Record<string, string | number> = { ...DEFAULTS };
  try {
    for (const r of await rows<{ k: string; v: string }>("SELECT k, v FROM settings")) {
      if (r.k in DEFAULTS) out[r.k] = NUMERIC.has(r.k) ? Number(r.v) || 0 : r.v;
    }
  } catch {
    /* table missing -> defaults */
  }
  return out as unknown as Settings;
});

export type Category = { id: number; slug: string; name: string };
export type Variant = { id: number; size: string; color: string; color_hex: string; stock: number };
export type ProductCard = {
  id: number;
  slug: string;
  name: string;
  price: number;
  compare_price: number | null;
  is_new: number;
  image: string | null;
  image2: string | null;
  category: string | null;
  in_stock: number;
};

export const getCategories = cache(async () =>
  rows<Category>("SELECT id, slug, name FROM categories ORDER BY sort, name"),
);

const CARD_SQL = `
  SELECT p.id, p.slug, p.name, p.price, p.compare_price, p.is_new, c.name AS category,
    (SELECT url FROM product_images i WHERE i.product_id = p.id ORDER BY i.sort, i.id LIMIT 1) AS image,
    (SELECT url FROM product_images i WHERE i.product_id = p.id ORDER BY i.sort, i.id LIMIT 1 OFFSET 1) AS image2,
    (SELECT COALESCE(SUM(stock),0) FROM product_variants v WHERE v.product_id = p.id) AS in_stock
  FROM products p LEFT JOIN categories c ON c.id = p.category_id
  WHERE p.is_active = 1`;

export async function listProducts(opts: {
  category?: string;
  sort?: string;
  q?: string;
  featured?: boolean;
  isNew?: boolean;
  limit?: number;
  excludeId?: number;
} = {}) {
  const where: string[] = [];
  const params: unknown[] = [];
  if (opts.category) {
    where.push("c.slug = ?");
    params.push(opts.category);
  }
  if (opts.q) {
    where.push("(p.name LIKE ? OR p.description LIKE ?)");
    params.push(`%${opts.q}%`, `%${opts.q}%`);
  }
  if (opts.featured) where.push("p.is_featured = 1");
  if (opts.isNew) where.push("p.is_new = 1");
  if (opts.excludeId) {
    where.push("p.id <> ?");
    params.push(opts.excludeId);
  }
  const order =
    opts.sort === "price-asc" ? "p.price ASC" : opts.sort === "price-desc" ? "p.price DESC" : "p.created_at DESC, p.id DESC";
  const limit = Math.min(opts.limit ?? 60, 100);
  return rows<ProductCard>(
    `${CARD_SQL}${where.length ? " AND " + where.join(" AND ") : ""} ORDER BY ${order} LIMIT ${limit}`,
    params,
  );
}

export type ProductFull = ProductCard & {
  description: string | null;
  category_slug: string | null;
  images: string[];
  variants: Variant[];
};

export async function getProduct(slug: string): Promise<ProductFull | null> {
  const p = await one<ProductCard & { description: string | null; category_slug: string | null }>(
    `SELECT p.id, p.slug, p.name, p.price, p.compare_price, p.is_new, p.description, c.name AS category, c.slug AS category_slug,
       NULL AS image, NULL AS image2, 0 AS in_stock
     FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE p.slug = ? AND p.is_active = 1`,
    [slug],
  );
  if (!p) return null;
  const images = (await rows<{ url: string }>("SELECT url FROM product_images WHERE product_id = ? ORDER BY sort, id", [p.id])).map(
    (i) => i.url,
  );
  const variants = await rows<Variant>(
    "SELECT id, size, color, color_hex, stock FROM product_variants WHERE product_id = ? ORDER BY color, id",
    [p.id],
  );
  return { ...p, images, image: images[0] ?? null, image2: images[1] ?? null, variants, in_stock: variants.reduce((a, v) => a + v.stock, 0) };
}
