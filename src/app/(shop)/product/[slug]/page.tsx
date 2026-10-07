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
    <div className="mx-auto max-w-7xl px-5 py-6 pb-28 md:px-8 md:py-12 md:pb-12">
      <nav className="mb-4 truncate text-xs text-muted-fg md:mb-6" aria-label="Breadcrumb">
        <Link href="/shop" className="hover:text-ink">Shop</Link>
        {p.category && <> / <Link href={`/shop?category=${p.category_slug}`} className="hover:text-ink">{p.category}</Link></>}
        <> / <span className="text-ink">{p.name}</span></>
      </nav>

      <div className="grid gap-8 md:grid-cols-[1.15fr_1fr] md:gap-16">
        <div className="-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:grid md:gap-3 md:overflow-visible md:px-0 md:pb-0 md:grid-cols-2 [&::-webkit-scrollbar]:hidden" aria-label="Product photos">
          {gallery.map((src, i) => (
            <div key={i} className={`aspect-[3/4] shrink-0 snap-center overflow-hidden bg-muted ${gallery.length > 1 ? "w-[86%]" : "w-full"} md:w-auto ${gallery.length > 1 && i === 0 && gallery.length % 2 === 1 ? "md:col-span-2" : ""}`}>
              <ProductImage src={src} name={p.name} priority={i === 0} />
            </div>
          ))}
        </div>

        <div className="min-w-0 md:sticky md:top-28 md:self-start">
          {p.is_new === 1 && <p className="eyebrow mb-3">New</p>}
          <h1 className="text-[2.2rem] leading-tight md:text-5xl">{p.name}</h1>
          <p className="mt-4 text-xl">
            {off > 0 && <span className="mr-3 text-base text-muted-fg line-through">{lkr(p.compare_price!)}</span>}
            {lkr(p.price)}
            {off > 0 && <span className="ml-3 bg-gold px-2 py-1 align-middle text-[10px] font-semibold uppercase tracking-widest text-white">Save {off}%</span>}
          </p>

          <ProductBuy slug={p.slug} name={p.name} price={p.price} image={p.image} variants={p.variants} />

          <div className="mt-10 divide-y divide-line border-y border-line text-sm text-ink-soft">
            {[
              ["Description", <p key="d" className="whitespace-pre-line leading-relaxed">{p.description ?? "A wardrobe essential, designed in Colombo."}</p>],
              ["Delivery", <ul key="s" className="space-y-1.5"><li>Colombo area {lkr(s.shipping_colombo)} · 1–2 days</li><li>Rest of Sri Lanka {lkr(s.shipping_island)} · 2–4 days</li>{s.free_shipping_over > 0 && <li>Free over {lkr(s.free_shipping_over)}</li>}</ul>],
              ["Returns & exchanges", <p key="r" className="leading-relaxed">Free size exchange within 7 days of delivery on unworn items with tags. <Link href="/shipping-returns" className="underline underline-offset-4">Read more</Link></p>],
              ["Size & fit", <p key="f" className="leading-relaxed">Not sure of your size? <Link href="/size-guide" target="_blank" className="underline underline-offset-4">View the size guide</Link>. If you&apos;re between sizes, size up for a relaxed fit.</p>],
            ].map(([t, body], i) => (
              <details key={String(t)} className="group py-4" open={i === 0}>
                <summary className="flex list-none items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-ink [&::-webkit-details-marker]:hidden">
                  {t}<span className="text-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-3">{body}</div>
              </details>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-[11px] uppercase tracking-wider text-muted-fg">
            <span className="border border-line p-3">Cash on delivery</span><span className="border border-line p-3">Secure card payment</span><span className="border border-line p-3">7-day exchange</span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 md:mt-24">
          <h2 className="text-3xl md:text-4xl">You may also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {related.map((r) => <ProductCard key={r.id} p={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
