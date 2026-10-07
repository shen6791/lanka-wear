import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { rows, one } from "@/lib/db";
import { getSettings } from "@/lib/data";
import { lkr, STATUS_LABEL } from "@/lib/format";
import { ClearCart } from "@/components/clear-cart";

export const metadata: Metadata = { title: "Order confirmation", robots: { index: false } };

type Order = { id: number; order_no: string; payment_method: "cod" | "bank"; payment_status: string; status: string; subtotal: number; shipping: number; total: number; slip_url: string | null; tracking_note: string | null };
type Item = { name: string; size: string; color: string; price: number; qty: number };

export default async function OrderPage({ params, searchParams }: { params: Promise<{ orderNo: string }>; searchParams: Promise<{ new?: string }> }) {
  const { orderNo } = await params;
  const isNew = (await searchParams).new === "1";
  const o = await one<Order>("SELECT id, order_no, payment_method, payment_status, status, subtotal, shipping, total, slip_url, tracking_note FROM orders WHERE order_no = ?", [orderNo]);
  if (!o) notFound();
  const [items, s] = await Promise.all([rows<Item>("SELECT name, size, color, price, qty FROM order_items WHERE order_id = ?", [o.id]), getSettings()]);

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 md:py-24">
      {isNew && <ClearCart />}
      <p className="eyebrow text-center">{isNew ? "Thank you" : "Order status"}</p>
      <h1 className="mt-3 text-center text-5xl md:text-6xl">{isNew ? "Order placed" : `Order ${o.order_no}`}</h1>
      <p className="mt-4 text-center text-muted-fg">
        Order number <b className="text-ink">{o.order_no}</b> · Status: <b className="text-ink">{STATUS_LABEL[o.status]}</b>
        {o.payment_status === "paid" && <> · <b className="text-gold">Paid</b></>}
      </p>

      {o.payment_method === "bank" && o.payment_status !== "paid" && o.status !== "cancelled" && (
        <div className="mt-10 border border-gold/40 bg-white p-6 text-sm">
          <p className="font-display text-2xl">Complete your bank transfer</p>
          <p className="mt-2 text-muted-fg">Transfer <b className="text-ink">{lkr(o.total)}</b> using <b className="text-ink">{o.order_no}</b> as the reference.</p>
          <div className="mt-4 space-y-1 bg-muted p-4">
            <p><span className="text-muted-fg">Bank:</span> {s.bank_name} — {s.bank_branch}</p>
            <p><span className="text-muted-fg">Account name:</span> {s.bank_account_name}</p>
            <p><span className="text-muted-fg">Account no:</span> <b>{s.bank_account_no}</b></p>
          </div>
          <p className="mt-4 text-muted-fg">
            {o.slip_url ? "We've received your payment slip and will confirm shortly." : "Send your payment slip on WhatsApp"}
            {!o.slip_url && s.whatsapp && <> — <a className="underline" href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(`Payment slip for order ${o.order_no}`)}`} target="_blank" rel="noreferrer">open WhatsApp</a></>}
          </p>
        </div>
      )}
      {o.payment_method === "cod" && <p className="mt-8 text-center text-sm text-muted-fg">Pay <b className="text-ink">{lkr(o.total)}</b> in cash when your order arrives. We&apos;ll call you to confirm delivery.</p>}
      {o.tracking_note && <p className="mt-6 border-l-2 border-gold bg-white p-4 text-sm">{o.tracking_note}</p>}

      <div className="mt-10 bg-white p-7">
        <ul className="divide-y divide-line text-sm">
          {items.map((i, k) => (
            <li key={k} className="flex justify-between py-3"><span>{i.qty} × {i.name} <span className="text-muted-fg">({[i.color, i.size].filter(Boolean).join(" · ")})</span></span><span>{lkr(i.price * i.qty)}</span></li>
          ))}
        </ul>
        <dl className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{lkr(o.subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Delivery</dt><dd>{o.shipping === 0 ? "Free" : lkr(o.shipping)}</dd></div>
          <div className="flex justify-between pt-2 text-lg font-semibold"><dt>Total</dt><dd>{lkr(o.total)}</dd></div>
        </dl>
      </div>
      <div className="mt-10 text-center"><Link href="/shop" className="btn btn-ghost">Continue shopping</Link></div>
    </div>
  );
}
