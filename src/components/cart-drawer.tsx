"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "./cart";
import { lkr } from "@/lib/format";
import { ProductImage } from "./product-image";

export function CartDrawer({ freeOver }: { freeOver: number }) {
  const { items, open, setOpen, subtotal, setQty, remove } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  if (!open) return null;
  const toFree = freeOver > 0 ? Math.max(0, freeOver - subtotal) : 0;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-2xl">Your bag</h2>
          <button aria-label="Close cart" className="p-1" onClick={() => setOpen(false)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 5l14 14M19 5L5 19" /></svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <p className="font-display text-2xl">Your bag is empty</p>
            <Link href="/shop" onClick={() => setOpen(false)} className="btn">Start shopping</Link>
          </div>
        ) : (
          <>
            {freeOver > 0 && (
              <div className="border-b border-line bg-muted px-6 py-3 text-xs">
                {toFree > 0 ? (
                  <>Add <b>{lkr(toFree)}</b> more for free delivery</>
                ) : (
                  <b className="text-gold">You&apos;ve unlocked free delivery</b>
                )}
                <div className="mt-2 h-1 bg-line"><div className="h-1 bg-gold transition-all" style={{ width: `${Math.min(100, (subtotal / freeOver) * 100)}%` }} /></div>
              </div>
            )}
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {items.map((i) => (
                <li key={i.variantId} className="flex gap-4 py-5">
                  <Link href={`/product/${i.slug}`} onClick={() => setOpen(false)} className="block h-28 w-20 shrink-0 overflow-hidden bg-muted">
                    <ProductImage src={i.image} name={i.name} />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <p className="text-sm font-medium">{i.name}</p>
                      <p className="text-sm">{lkr(i.price * i.qty)}</p>
                    </div>
                    <p className="mt-1 text-xs text-muted-fg">{[i.color, i.size].filter(Boolean).join(" · ")}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-line">
                        <button aria-label="Decrease quantity" className="h-8 w-8" onClick={() => setQty(i.variantId, i.qty - 1)}>−</button>
                        <span className="w-8 text-center text-sm" aria-live="polite">{i.qty}</span>
                        <button aria-label="Increase quantity" className="h-8 w-8 disabled:opacity-30" disabled={i.qty >= i.max} onClick={() => setQty(i.variantId, i.qty + 1)}>+</button>
                      </div>
                      <button className="text-xs underline underline-offset-4 text-muted-fg hover:text-ink" onClick={() => remove(i.variantId)}>Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line p-6">
              <div className="mb-1 flex justify-between text-sm"><span>Subtotal</span><span className="font-semibold">{lkr(subtotal)}</span></div>
              <p className="mb-4 text-xs text-muted-fg">Delivery calculated at checkout.</p>
              <Link href="/checkout" onClick={() => setOpen(false)} className="btn w-full">Checkout</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
