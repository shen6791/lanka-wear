import Link from "next/link";
import { getCategories, getSettings, listProducts } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";

const PERKS = [
  ["Island-wide delivery", "Colombo in 1–2 days, rest of Sri Lanka in 2–4"],
  ["Cash on delivery", "Pay when your order arrives at your door"],
  ["Easy exchanges", "Wrong size? Swap it within 7 days"],
  ["Designed in Colombo", "Cut and finished by local makers"],
];

export default async function Home() {
  const [s, cats, featured, fresh] = await Promise.all([
    getSettings(),
    getCategories(),
    listProducts({ featured: true, limit: 4 }),
    listProducts({ isNew: true, limit: 8 }),
  ]);
  const marquee = ["New season", "Designed in Colombo", "Cash on delivery", "Island-wide shipping", "Premium cotton & linen"];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 -z-10 opacity-60" style={{ background: "radial-gradient(60% 80% at 80% 20%, rgba(201,162,74,0.35), transparent 60%), radial-gradient(50% 60% at 10% 90%, rgba(161,98,7,0.25), transparent 60%)" }} />
        <div className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-[1.2fr_1fr] md:px-8">
          <div>
            <p className="eyebrow fade-up">New collection</p>
            <h1 className="fade-up mt-5 text-6xl font-medium leading-[0.95] md:text-8xl" style={{ animationDelay: "0.1s" }}>
              Dressed for the<br /><em className="font-normal text-gold-soft">island life.</em>
            </h1>
            <p className="fade-up mt-7 max-w-md text-base leading-relaxed text-white/70" style={{ animationDelay: "0.2s" }}>
              {s.tagline} Considered cuts in breathable fabrics, made for Colombo mornings and coastal evenings.
            </p>
            <div className="fade-up mt-10 flex flex-wrap gap-4" style={{ animationDelay: "0.3s" }}>
              <Link href="/shop" className="btn btn-light hover:!bg-gold hover:!border-gold hover:!text-white">Shop the collection</Link>
              <Link href="/about" className="btn btn-ghost !text-white !border-white/40 hover:!bg-white hover:!text-ink">Our story</Link>
            </div>
          </div>
          <div className="fade-up hidden gap-4 md:grid md:grid-cols-2" style={{ animationDelay: "0.25s" }}>
            {featured.slice(0, 2).map((p, i) => (
              <Link key={p.id} href={`/product/${p.slug}`} className={`group relative block aspect-[3/4] overflow-hidden ${i === 1 ? "mt-12" : ""}`}>
                <ProductImage src={p.image} name={p.name} className="transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm">{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-b border-line bg-background py-4" aria-hidden="true">
        <div className="marquee flex w-max gap-12 whitespace-nowrap font-display text-xl italic text-ink-soft">
          {[...marquee, ...marquee, ...marquee, ...marquee].map((t, i) => (
            <span key={i} className="flex items-center gap-12">{t}<span className="text-gold">✦</span></span>
          ))}
        </div>
      </div>

      {/* Categories */}
      {cats.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-20 md:px-8">
          <p className="eyebrow">Browse</p>
          <h2 className="mt-2 text-4xl md:text-5xl">Shop by category</h2>
          <div className="mt-10 flex flex-wrap gap-3">
            {cats.map((c) => (
              <Link key={c.id} href={`/shop?category=${c.slug}`} className="border border-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-white">
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* New arrivals */}
      <section className="mx-auto max-w-7xl px-5 pt-20 md:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Just landed</p>
            <h2 className="mt-2 text-4xl md:text-5xl">New arrivals</h2>
          </div>
          <Link href="/shop" className="hidden text-xs font-semibold uppercase tracking-[0.18em] underline underline-offset-8 hover:text-gold sm:block">View all</Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {(fresh.length ? fresh : featured).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Story band */}
      <section className="mx-auto mt-24 max-w-7xl px-5 md:px-8">
        <div className="grid overflow-hidden bg-muted md:grid-cols-2">
          <div className="flex flex-col justify-center p-10 md:p-16">
            <p className="eyebrow">Our promise</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Less noise.<br />Better clothes.</h2>
            <p className="mt-5 max-w-md leading-relaxed text-ink-soft">
              We make fewer pieces, in better fabrics, and we make them to last. Every garment is designed in Colombo and finished by skilled local hands.
            </p>
            <Link href="/about" className="btn btn-ghost mt-8 self-start">Read our story</Link>
          </div>
          <div className="min-h-72 bg-ink">
            <div className="flex h-full items-center justify-center p-10" style={{ background: "radial-gradient(circle at 30% 30%, rgba(201,162,74,0.4), transparent 60%), #1c1917" }}>
              <p className="font-display text-center text-5xl italic leading-tight text-white/90">&ldquo;Made slowly.<br />Worn for years.&rdquo;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="mx-auto mt-20 grid max-w-7xl gap-8 px-5 md:grid-cols-4 md:px-8">
        {PERKS.map(([t, d]) => (
          <div key={t} className="border-t border-ink pt-5">
            <p className="font-display text-2xl">{t}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-fg">{d}</p>
          </div>
        ))}
      </section>
    </>
  );
}
