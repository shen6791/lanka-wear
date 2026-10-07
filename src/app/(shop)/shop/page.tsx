import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, listProducts } from "@/lib/data";
import { ProductCard } from "@/components/product-card";

export const metadata: Metadata = { title: "Shop" };

const SORTS = [
  ["new", "Newest"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
];

export default async function Shop({ searchParams }: { searchParams: Promise<{ category?: string; sort?: string; q?: string }> }) {
  const sp = await searchParams;
  const [cats, products] = await Promise.all([getCategories(), listProducts({ category: sp.category, sort: sp.sort, q: sp.q?.slice(0, 60) })]);
  const href = (over: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const m = { category: sp.category, sort: sp.sort, q: sp.q, ...over };
    for (const [k, v] of Object.entries(m)) if (v) p.set(k, v);
    const qs = p.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };
  const active = cats.find((c) => c.slug === sp.category);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
      <p className="eyebrow">Collection</p>
      <h1 className="mt-2 text-5xl md:text-6xl">{active ? active.name : sp.q ? `Results for “${sp.q}”` : "All products"}</h1>

      <div className="mt-8 flex min-w-0 flex-col gap-4 border-y border-line py-4 md:mt-10 md:flex-row md:items-center md:justify-between">
        <nav aria-label="Categories" className="-mx-5 flex min-w-0 gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
          <Link href={href({ category: undefined })} className={`shrink-0 border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${!sp.category ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}>All</Link>
          {cats.map((c) => (
            <Link key={c.id} href={href({ category: c.slug })} className={`shrink-0 border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${sp.category === c.slug ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}>
              {c.name}
            </Link>
          ))}
        </nav>
        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-3">
          <form action="/shop" className="flex w-full min-w-0 md:w-auto">
            {sp.category && <input type="hidden" name="category" value={sp.category} />}
            <input name="q" defaultValue={sp.q} placeholder="Search" aria-label="Search products" className="field !py-2 md:!w-40" />
          </form>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {SORTS.map(([v, l]) => (
              <Link key={v} href={href({ sort: v === "new" ? undefined : v })} className={`whitespace-nowrap ${(sp.sort ?? "new") === v ? "font-semibold text-ink underline underline-offset-4" : "text-muted-fg hover:text-ink"}`}>
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-3xl">Nothing found</p>
          <Link href="/shop" className="btn mt-6">Clear filters</Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
          {products.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
