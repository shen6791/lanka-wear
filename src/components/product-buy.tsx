"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "./cart";
import { lkr } from "@/lib/format";
import type { Variant } from "@/lib/data";

type Props = { slug: string; name: string; price: number; image: string | null; variants: Variant[] };

export function ProductBuy({ slug, name, price, image, variants }: Props) {
  const { add } = useCart();
  const colors = useMemo(() => {
    const m = new Map<string, string>();
    variants.forEach((v) => m.set(v.color, v.color_hex));
    return [...m.entries()];
  }, [variants]);

  const firstAvail = variants.find((v) => v.stock > 0) ?? variants[0];
  const [color, setColor] = useState(firstAvail?.color ?? "");
  const [size, setSize] = useState<string>("");
  const [err, setErr] = useState("");
  const mainBtn = useRef<HTMLButtonElement>(null);
  const [barVisible, setBarVisible] = useState(false);

  const sizes = variants.filter((v) => v.color === color);
  const chosen = sizes.find((v) => v.size === size);
  const totalStock = variants.reduce((a, v) => a + v.stock, 0);

  // show the sticky mobile bar once the main button scrolls out of view
  useEffect(() => {
    const el = mainBtn.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setBarVisible(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [totalStock]);

  if (variants.length === 0 || totalStock === 0)
    return <button disabled className="btn mt-8 w-full">Sold out</button>;

  const addToBag = () => {
    if (!chosen) {
      setErr("Please select a size.");
      mainBtn.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    add({ variantId: chosen.id, slug, name, price, size: chosen.size, color: chosen.color, image, max: chosen.stock });
  };

  return (
    <div className="mt-7 space-y-6 md:mt-8 md:space-y-7">
      {colors.length > 0 && colors[0][0] !== "" && (
        <div>
          <p className="label">Colour: <span className="font-medium normal-case tracking-normal text-ink">{color}</span></p>
          <div className="flex flex-wrap gap-2">
            {colors.map(([c, hex]) => (
              <button
                key={c}
                aria-label={c}
                aria-pressed={c === color}
                title={c}
                onClick={() => { setColor(c); setSize(""); setErr(""); }}
                className={`h-11 w-11 rounded-full border-2 p-1 transition ${c === color ? "border-ink" : "border-transparent hover:border-line"}`}
              >
                <span className="block h-full w-full rounded-full border border-black/10" style={{ background: hex || "#ccc" }} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="label">Size {chosen && chosen.stock <= 5 && <span className="ml-2 normal-case tracking-normal text-gold">Only {chosen.stock} left</span>}</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((v) => (
            <button
              key={v.id}
              disabled={v.stock <= 0}
              aria-pressed={v.size === size}
              onClick={() => { setSize(v.size); setErr(""); }}
              className={`min-h-11 min-w-12 border px-4 py-3 text-sm transition ${v.size === size ? "border-ink bg-ink text-white" : "border-line hover:border-ink"} ${v.stock <= 0 ? "text-muted-fg/50 line-through" : ""}`}
            >
              {v.size}
            </button>
          ))}
        </div>
        {err && <p role="alert" className="mt-2 text-sm text-red-700">{err}</p>}
      </div>

      <button ref={mainBtn} className="btn w-full !py-4" onClick={addToBag}>Add to bag</button>

      {/* sticky bar: phones only */}
      <div
        aria-hidden={!barVisible}
        className={`fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-line bg-background/95 px-4 pt-3 backdrop-blur transition-transform duration-300 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden ${barVisible ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-fg">{lkr(price)}{chosen ? ` · ${[chosen.color, chosen.size].filter(Boolean).join(" ")}` : ""}</p>
        </div>
        <button tabIndex={barVisible ? 0 : -1} className="btn shrink-0 !px-6" onClick={addToBag}>{chosen ? "Add to bag" : "Select size"}</button>
      </div>
    </div>
  );
}
