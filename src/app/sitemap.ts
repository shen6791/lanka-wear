import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/site";
import { rows } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = await baseUrl();
  const products = await rows<{ slug: string }>("SELECT slug FROM products WHERE is_active = 1");
  const pages = ["", "/shop", "/about", "/contact", "/faq", "/shipping-returns", "/size-guide", "/track"].map((p) => ({ url: base + p }));
  return [...pages, ...products.map((p) => ({ url: `${base}/product/${p.slug}` }))];
}
