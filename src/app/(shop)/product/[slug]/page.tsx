import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getSettings, listProducts } from "@/lib/data";
import { lkr } from "@/lib/format";
import { ProductBuy } from "@/components/product-buy";
import { ProductImage } from "@/components/product-image";
import { ProductCard } from "@/components/product-card";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  return p ? { title: p.name, description: p.description?.slice(0, 150) } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  const [s, related] = await Promise.all([getSettings(), listProducts({ category: p.category_slug ?? undefined, limit: 4, excludeId: p.id })]);
  const off = p.compare_price && p.compare_price > p.price ? Math.round((1 - p.price / p.compare_price) * 100) : 0;
  const gallery = p.images.length ? p.images : [null];

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
      <nav className="mb-6 text-xs text-muted-fg" aria-label="Breadcrumb">
        <Link href="/shop" className="hover:text-ink">Shop</Link>
        {p.category && <> / <Link href={`/shop?category=${p.category_slug}`} className="hover:text-ink">{p.category}</Link></>}
        <> / <span className="text-ink">{p.name}</span></>
      </nav>

      <div className="grid gap-10 md:grid-cols-[1.15fr_1fr] md:gap-16">
        <div className={`grid gap-3 ${gallery.length > 1 ? "grid-cols-2" : ""}`}>
          {gallery.map((src, i) => (
            <div key={i} className={`overflow-hidden bg-muted ${gallery.length === 1 || i === 0 ? "aspect-[3/4]" : "aspect-[3/4]"} ${gallery.length > 1 && i === 0 && gallery.length % 2 === 1 ? "col-span-2" : ""}`}>
              <ProductImage src={src} name={p.name} priority={i === 0} />
            </div>
          ))}
        </div>

        <div className="md:sticky md:top-28 md:self-start">
          {p.is_new === 1 && <p className="eyebrow mb-3">New</p>}
          <h1 className="text-4xl leading-tight md:text-5xl">{p.name}</h1>
          <p className="mt-4 text-xl">
            {off > 0 && <span className="mr-3 text-base text-muted-fg line-through">{lkr(p.compare_price!)}</span>}
            {lkr(p.price)}
            {off > 0 && <span className="ml-3 bg-gold px-2 py-1 align-middle text-[10px] font-semibold uppercase tracking-widest text-white">Save {off}%</span>}
          </p>

          <ProductBuy slug={p.slug} name={p.name} price={p.price} image={p.image} variants={p.variants} />

          {p.description && <p className="mt-10 whitespace-pre-line border-t border-line pt-8 text-sm leading-relaxed text-ink-soft">{p.description}</p>}

          <ul className="mt-8 space-y-3 border-t border-line pt-8 text-sm text-ink-soft">
            <li>• Delivery {lkr(s.shipping_colombo)} within Colombo area, {lkr(s.shipping_island)} island-wide</li>
            {s.free_shipping_over > 0 && <li>• Free delivery on orders over {lkr(s.free_shipping_over)}</li>}
            <li>• Cash on delivery &amp; bank transfer accepted</li>
            <li>• Size exchange within 7 days</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="text-3xl md:text-4xl">You may also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {related.map((r) => <ProductCard key={r.id} p={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
