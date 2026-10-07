import Link from "next/link";
import type { ProductCard as P } from "@/lib/data";
import { lkr } from "@/lib/format";
import { ProductImage } from "./product-image";

export function ProductCard({ p }: { p: P }) {
  const sold = p.in_stock <= 0;
  const off = p.compare_price && p.compare_price > p.price ? Math.round((1 - p.price / p.compare_price) * 100) : 0;
  return (
    <Link href={`/product/${p.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
          <ProductImage src={p.image} name={p.name} />
        </div>
        {p.image2 && (
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <ProductImage src={p.image2} name={p.name} />
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {sold ? (
            <span className="bg-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">Sold out</span>
          ) : (
            <>
              {p.is_new === 1 && <span className="bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink">New</span>}
              {off > 0 && <span className="bg-gold px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">-{off}%</span>}
            </>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[0.95rem] font-medium leading-tight tracking-normal" style={{ fontFamily: "var(--font-body)" }}>
            {p.name}
          </h3>
          {p.category && <p className="mt-0.5 text-xs text-muted-fg">{p.category}</p>}
        </div>
        <p className="shrink-0 text-sm">
          {off > 0 && <span className="mr-1.5 text-xs text-muted-fg line-through">{lkr(p.compare_price!)}</span>}
          <span className="font-medium">{lkr(p.price)}</span>
        </p>
      </div>
    </Link>
  );
}
