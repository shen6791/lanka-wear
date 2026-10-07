/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getCategories, getSettings, listProducts } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { CATEGORY_PHOTO, GALLERY, SITE, unsplash } from "@/lib/photos";
import { Newsletter } from "@/components/newsletter";

const PERKS = [
  ["Island-wide delivery", "Colombo in 1–2 days, rest of Sri Lanka in 2–4."],
  ["Pay your way", "Cash on delivery, bank transfer or card."],
  ["Easy exchanges", "Wrong size? Swap it within 7 days."],
  ["Made in Colombo", "Cut and finished by skilled local makers."],
];

const REVIEWS = [
  ["The linen shirt is perfect for Colombo weather. Fits true to size and the quality is far better than I expected.", "Dilshan P.", "Nugegoda"],
  ["Ordered on Monday, got it Tuesday morning with cash on delivery. The dress looks even better in person.", "Nethmi S.", "Kandy"],
  ["Finally a local brand with proper fabrics and clean cuts. I've already ordered a second hoodie.", "Ashen R.", "Galle"],
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
        <div className="absolute inset-0 -z-10 opacity-70" style={{ background: "radial-gradient(60% 80% at 85% 10%, rgba(201,162,74,0.32), transparent 60%), radial-gradient(50% 60% at 5% 95%, rgba(161,98,7,0.28), transparent 60%)" }} />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-12 md:min-h-[84vh] md:grid-cols-[1.05fr_1fr] md:px-8 md:py-16">
          <div>
            <p className="eyebrow fade-up">New collection · 2026</p>
            <h1 className="fade-up mt-4 text-[2.9rem] font-medium leading-[0.98] sm:text-6xl md:mt-5 md:text-8xl" style={{ animationDelay: "0.1s" }}>
              Dressed for the<br /><em className="font-normal text-gold-soft">island life.</em>
            </h1>
            <p className="fade-up mt-7 max-w-md text-base leading-relaxed text-white/70" style={{ animationDelay: "0.2s" }}>
              {s.tagline} Considered cuts in breathable cotton and linen, made for Colombo mornings and coastal evenings.
            </p>
            <div className="fade-up mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4 md:mt-10" style={{ animationDelay: "0.3s" }}>
              <Link href="/shop" className="btn btn-light hover:!bg-gold hover:!border-gold hover:!text-white">Shop the collection</Link>
              <Link href="/about" className="btn btn-ghost !text-white !border-white/40 hover:!bg-white hover:!text-ink">Our story</Link>
            </div>
            <dl className="fade-up mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/15 pt-6 text-sm md:mt-14 md:gap-6" style={{ animationDelay: "0.4s" }}>
              {[["18+", "New pieces"], ["1–2 days", "Colombo delivery"], ["7 days", "Easy exchange"]].map(([a, b]) => (
                <div key={b}><dt className="font-display text-3xl text-gold-soft">{a}</dt><dd className="mt-1 text-xs text-white/60">{b}</dd></div>
              ))}
            </dl>
          </div>
          <div className="fade-up relative mx-auto w-full max-w-lg" style={{ animationDelay: "0.25s" }}>
            <div className="absolute -right-3 -top-3 hidden h-full w-full border border-gold-soft/60 md:block" />
            <img src={unsplash(SITE.hero.url, 1000, 1250)} alt={SITE.hero.alt} width={1000} height={1250} fetchPriority="high" className="relative aspect-[4/5] w-full object-cover" />
            <Link href="/shop?sort=new" className="absolute -bottom-6 left-4 flex items-center gap-4 bg-background p-3 pr-6 text-ink shadow-xl md:-left-10">
              <img src={unsplash(SITE.heroCard.url, 200, 260)} alt="" width={64} height={84} className="h-[84px] w-16 object-cover" />
              <span><span className="eyebrow block !text-[10px]">Just landed</span><span className="font-display text-xl">The new arrivals</span></span>
            </Link>
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
        <section className="mx-auto max-w-7xl px-5 pt-14 md:px-8 md:pt-20">
          <p className="eyebrow">Browse</p>
          <h2 className="mt-2 text-4xl md:text-5xl">Shop by category</h2>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {cats.map((c) => (
              <Link key={c.id} href={`/shop?category=${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden bg-muted md:aspect-[3/4]">
                {CATEGORY_PHOTO[c.slug] && <img src={unsplash(CATEGORY_PHOTO[c.slug], 700, 900)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white">
                  <span className="font-display text-3xl">{c.name}</span>
                  <span className="translate-x-0 text-xs uppercase tracking-[0.2em] opacity-80 transition-transform group-hover:translate-x-1">Shop →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* New arrivals */}
      <section className="mx-auto max-w-7xl px-5 pt-16 md:px-8 md:pt-24">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Just landed</p>
            <h2 className="mt-2 text-4xl md:text-5xl">New arrivals</h2>
          </div>
          <Link href="/shop?sort=new" className="hidden text-xs font-semibold uppercase tracking-[0.18em] underline underline-offset-8 hover:text-gold sm:block">View all</Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {(fresh.length ? fresh : featured).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Lookbook banner */}
      <section className="mx-auto mt-16 max-w-7xl px-5 md:mt-24 md:px-8">
        <div className="grid overflow-hidden bg-ink text-white md:grid-cols-2">
          <img src={unsplash(SITE.lookbook.url, 1100, 900)} alt={SITE.lookbook.alt} loading="lazy" className="aspect-[4/3] h-full w-full object-cover md:aspect-auto" />
          <div className="flex flex-col justify-center p-7 sm:p-10 md:p-16">
            <p className="eyebrow">The Summer Edit</p>
            <h2 className="mt-3 text-4xl leading-tight md:text-6xl">Light layers for long afternoons.</h2>
            <p className="mt-5 max-w-md leading-relaxed text-white/70">Breathable linen shirts, easy shorts and fluid dresses — styled to go from the office to the beach without a change.</p>
            <Link href="/shop?category=dresses" className="btn btn-light mt-8 self-start hover:!bg-gold hover:!border-gold hover:!text-white">Shop the edit</Link>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-16 md:px-8 md:pt-24">
          <p className="eyebrow">Customer favourites</p>
          <h2 className="mt-2 text-4xl md:text-5xl">Most loved</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {featured.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      )}

      {/* Story */}
      <section className="mx-auto mt-16 max-w-7xl px-5 md:mt-24 md:px-8">
        <div className="grid items-stretch overflow-hidden bg-muted md:grid-cols-2">
          <div className="flex flex-col justify-center p-7 sm:p-10 md:p-16">
            <p className="eyebrow">Our promise</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Less noise.<br />Better clothes.</h2>
            <p className="mt-5 max-w-md leading-relaxed text-ink-soft">
              We make fewer pieces, in better fabrics, and we make them to last. Every garment is designed in Colombo and finished by skilled local hands.
            </p>
            <Link href="/about" className="btn btn-ghost mt-8 self-start">Read our story</Link>
          </div>
          <img src={unsplash(SITE.story.url, 1100, 900)} alt={SITE.story.alt} loading="lazy" className="aspect-[4/3] h-full w-full object-cover md:aspect-auto" />
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-5 pt-16 md:px-8 md:pt-24">
        <p className="eyebrow text-center">Kind words</p>
        <h2 className="mt-2 text-center text-4xl md:text-5xl">Loved across the island</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {REVIEWS.map(([q, n, c]) => (
            <figure key={n} className="border border-line bg-white p-8">
              <div className="mb-4 text-gold" aria-label="5 out of 5 stars">★★★★★</div>
              <blockquote className="font-display text-2xl leading-snug">&ldquo;{q}&rdquo;</blockquote>
              <figcaption className="mt-6 text-xs uppercase tracking-[0.18em] text-muted-fg">{n} · {c}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-5 pt-16 md:px-8 md:pt-24">
        <div className="flex items-end justify-between">
          <div><p className="eyebrow">On the gram</p><h2 className="mt-2 text-4xl md:text-5xl">{s.instagram ? "@" + (s.instagram.split("/").filter(Boolean).pop() ?? "lankawear") : "@lankawear"}</h2></div>
          {s.instagram && <a href={s.instagram} target="_blank" rel="noreferrer" className="hidden text-xs font-semibold uppercase tracking-[0.18em] underline underline-offset-8 hover:text-gold sm:block">Follow us</a>}
        </div>
        <div className="mt-10 grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
          {GALLERY.map((g) => (
            <Link key={g.slug} href={`/product/${g.slug}`} className="group relative block aspect-square overflow-hidden bg-muted">
              <img src={unsplash(g.url, 500, 500)} alt={g.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <span className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/25" />
            </Link>
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="mx-auto mt-16 grid max-w-7xl grid-cols-2 gap-6 px-5 md:mt-24 md:grid-cols-4 md:gap-8 md:px-8">
        {PERKS.map(([t, d]) => (
          <div key={t} className="border-t border-ink pt-5">
            <p className="font-display text-2xl">{t}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-fg">{d}</p>
          </div>
        ))}
      </section>

      <Newsletter />
    </>
  );
}
