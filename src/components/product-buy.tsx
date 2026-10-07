"use client";

import { useMemo, useState } from "react";
import { useCart } from "./cart";
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

  const sizes = variants.filter((v) => v.color === color);
  const chosen = sizes.find((v) => v.size === size);
  const totalStock = variants.reduce((a, v) => a + v.stock, 0);

  if (variants.length === 0 || totalStock === 0)
    return <button disabled className="btn mt-8 w-full">Sold out</button>;

  return (
    <div className="mt-8 space-y-7">
      {colors.length > 0 && colors[0][0] !== "" && (
        <div>
          <p className="label">Colour: <span className="font-medium normal-case tracking-normal text-ink">{color}</span></p>
          <div className="flex gap-3">
            {colors.map(([c, hex]) => (
              <button
                key={c}
                aria-label={c}
                aria-pressed={c === color}
                title={c}
                onClick={() => { setColor(c); setSize(""); setErr(""); }}
                className={`h-9 w-9 rounded-full border-2 p-0.5 transition ${c === color ? "border-ink" : "border-transparent hover:border-line"}`}
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
              className={`min-w-12 border px-4 py-3 text-sm transition ${v.size === size ? "border-ink bg-ink text-white" : "border-line hover:border-ink"} ${v.stock <= 0 ? "text-muted-fg/50 line-through" : ""}`}
            >
              {v.size}
            </button>
          ))}
        </div>
        {err && <p role="alert" className="mt-2 text-sm text-red-700">{err}</p>}
      </div>

      <button
        className="btn w-full !py-4"
        onClick={() => {
          if (!chosen) return setErr("Please select a size.");
          add({ variantId: chosen.id, slug, name, price, size: chosen.size, color: chosen.color, image, max: chosen.stock });
        }}
      >
        Add to bag
      </button>
    </div>
  );
}
