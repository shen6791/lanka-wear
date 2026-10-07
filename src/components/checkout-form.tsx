"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useCart } from "./cart";
import { placeOrder, type CheckoutState } from "@/app/(shop)/checkout/actions";
import { COLOMBO_AREA, DISTRICTS, lkr } from "@/lib/format";
import { ProductImage } from "./product-image";

type Cfg = { colombo: number; island: number; freeOver: number; bankName: string; bankBranch: string; accName: string; accNo: string };

export function CheckoutForm({ cfg }: { cfg: Cfg }) {
  const { items, subtotal } = useCart();
  const [state, action, pending] = useActionState<CheckoutState, FormData>(placeOrder, undefined);
  const [district, setDistrict] = useState("Colombo");
  const [payment, setPayment] = useState<"cod" | "bank">("cod");

  const shipping = subtotal >= cfg.freeOver && cfg.freeOver > 0 ? 0 : COLOMBO_AREA.includes(district) ? cfg.colombo : cfg.island;
  const total = subtotal + shipping;

  if (items.length === 0)
    return (
      <div className="py-24 text-center">
        <p className="font-display text-4xl">Your bag is empty</p>
        <Link href="/shop" className="btn mt-8">Continue shopping</Link>
      </div>
    );

  return (
    <form action={action} className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
      <input type="hidden" name="cart" value={JSON.stringify(items.map((i) => ({ variantId: i.variantId, qty: i.qty })))} />

      <div className="space-y-12">
        <section>
          <h2 className="mb-6 text-3xl">Delivery details</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className="label" htmlFor="name">Full name *</label><input id="name" name="name" required autoComplete="name" className="field" /></div>
            <div><label className="label" htmlFor="phone">Mobile number *</label><input id="phone" name="phone" required inputMode="tel" autoComplete="tel" placeholder="077 123 4567" className="field" /></div>
            <div><label className="label" htmlFor="email">Email (optional)</label><input id="email" name="email" type="email" autoComplete="email" className="field" /></div>
            <div className="sm:col-span-2"><label className="label" htmlFor="address">Address *</label><input id="address" name="address" required autoComplete="street-address" placeholder="House no, street, area" className="field" /></div>
            <div><label className="label" htmlFor="city">City / town *</label><input id="city" name="city" required autoComplete="address-level2" className="field" /></div>
            <div>
              <label className="label" htmlFor="district">District *</label>
              <select id="district" name="district" value={district} onChange={(e) => setDistrict(e.target.value)} className="field">
                {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2"><label className="label" htmlFor="notes">Order notes (optional)</label><textarea id="notes" name="notes" rows={2} className="field" /></div>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-3xl">Payment</h2>
          <div className="space-y-3">
            <label className={`flex gap-4 border p-5 transition ${payment === "cod" ? "border-ink bg-white" : "border-line"}`}>
              <input type="radio" name="payment" value="cod" checked={payment === "cod"} onChange={() => setPayment("cod")} className="mt-1 accent-[#1c1917]" />
              <span><b className="block text-sm">Cash on delivery</b><span className="text-sm text-muted-fg">Pay in cash when your order arrives.</span></span>
            </label>
            <label className={`flex gap-4 border p-5 transition ${payment === "bank" ? "border-ink bg-white" : "border-line"}`}>
              <input type="radio" name="payment" value="bank" checked={payment === "bank"} onChange={() => setPayment("bank")} className="mt-1 accent-[#1c1917]" />
              <span className="w-full">
                <b className="block text-sm">Bank transfer</b>
                <span className="text-sm text-muted-fg">Transfer the total now. We confirm and ship once the payment is received.</span>
                {payment === "bank" && (
                  <span className="mt-4 block space-y-1 bg-muted p-4 text-sm">
                    <span className="block"><span className="text-muted-fg">Bank:</span> {cfg.bankName} — {cfg.bankBranch}</span>
                    <span className="block"><span className="text-muted-fg">Account name:</span> {cfg.accName}</span>
                    <span className="block"><span className="text-muted-fg">Account no:</span> <b>{cfg.accNo}</b></span>
                    <span className="mt-3 block">
                      <span className="label">Upload payment slip (optional, you can also send it on WhatsApp)</span>
                      <input type="file" name="slip" accept="image/jpeg,image/png,image/webp,application/pdf" className="block w-full text-xs" />
                    </span>
                  </span>
                )}
              </span>
            </label>
          </div>
        </section>
      </div>

      <aside className="h-fit bg-white p-7 lg:sticky lg:top-28">
        <h2 className="mb-5 text-3xl">Order summary</h2>
        <ul className="divide-y divide-line">
          {items.map((i) => (
            <li key={i.variantId} className="flex gap-4 py-4">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-muted">
                <ProductImage src={i.image} name={i.name} />
                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center bg-ink px-1 text-[10px] text-white">{i.qty}</span>
              </div>
              <div className="flex-1 text-sm"><p className="font-medium">{i.name}</p><p className="text-xs text-muted-fg">{[i.color, i.size].filter(Boolean).join(" · ")}</p></div>
              <p className="text-sm">{lkr(i.price * i.qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{lkr(subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Delivery</dt><dd>{shipping === 0 ? "Free" : lkr(shipping)}</dd></div>
          <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold"><dt>Total</dt><dd>{lkr(total)}</dd></div>
        </dl>
        {state?.error && <p role="alert" className="mt-5 border border-red-300 bg-red-50 p-3 text-sm text-red-800">{state.error}</p>}
        <button type="submit" disabled={pending} className="btn mt-6 w-full !py-4">{pending ? "Placing order…" : payment === "cod" ? "Place order" : "Place order & pay by transfer"}</button>
        <p className="mt-4 text-center text-xs text-muted-fg">By placing your order you agree to be contacted to confirm delivery.</p>
      </aside>
    </form>
  );
}
