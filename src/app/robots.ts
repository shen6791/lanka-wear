import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = await baseUrl();
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/pay", "/order", "/checkout"] }, sitemap: `${base}/sitemap.xml` };
}
