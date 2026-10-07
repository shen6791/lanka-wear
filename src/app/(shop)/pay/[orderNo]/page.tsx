import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { one } from "@/lib/db";
import { getPayhere, getSettings } from "@/lib/data";
import { orderToken, validOrderToken } from "@/lib/auth";
import { baseUrl } from "@/lib/site";
import { checkoutHash, money, payhereUrl } from "@/lib/payhere";
import { lkr } from "@/lib/format";
import { PayRedirect } from "@/components/pay-redirect";

export const metadata: Metadata = { title: "Secure payment", robots: { index: false } };

type Order = {
  id: number; order_no: string; customer_name: string; phone: string; email: string | null; address: string; city: string;
  payment_method: string; payment_status: string; status: string; total: number;
};

export default async function Pay({ params, searchParams }: { params: Promise<{ orderNo: string }>; searchParams: Promise<{ t?: string }> }) {
  const { orderNo } = await params;
  const t = (await searchParams).t;
  if (!validOrderToken(orderNo, t)) notFound();
  const o = await one<Order>(
    "SELECT id, order_no, customer_name, phone, email, address, city, payment_method, payment_status, status, total FROM orders WHERE order_no = ?",
    [orderNo],
  );
  if (!o || o.payment_method !== "card") notFound();
  if (o.payment_status === "paid" || o.status === "cancelled") redirect(`/order/${o.order_no}?t=${orderToken(o.order_no)}`);

  const [ph, s, base] = await Promise.all([getPayhere(), getSettings(), baseUrl()]);

  if (!ph.ready) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <p className="eyebrow">Order {o.order_no} saved</p>
        <h1 className="mt-3 text-4xl">Card payment isn&apos;t set up yet</h1>
        <p className="mt-4 text-muted-fg">
          Your order for <b className="text-ink">{lkr(o.total)}</b> has been placed. Online card payment is not yet available, so please contact us to pay by another method.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {s.whatsapp && <a className="btn" href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(`Hi, I'd like to pay for order ${o.order_no}`)}`} target="_blank" rel="noreferrer">WhatsApp us</a>}
          <Link className="btn btn-ghost" href={`/order/${o.order_no}?t=${t}`}>View order</Link>
        </div>
      </div>
    );
  }

  const [first, ...rest] = o.customer_name.trim().split(/\s+/);
  const orderUrl = `${base}/order/${o.order_no}?t=${t}`;
  const host = new URL(base).hostname;
  const fields: Record<string, string> = {
    merchant_id: ph.merchantId,
    return_url: orderUrl,
    cancel_url: orderUrl,
    notify_url: `${base}/api/payhere/notify`,
    order_id: o.order_no,
    items: `${s.brand_name} order ${o.order_no}`,
    currency: "LKR",
    amount: money(o.total),
    first_name: first || "Customer",
    last_name: rest.join(" ") || "-",
    email: o.email || `customer@${host.includes(".") ? host : "example.lk"}`,
    phone: o.phone,
    address: o.address,
    city: o.city,
    country: "Sri Lanka",
    hash: checkoutHash(ph.merchantId, o.order_no, o.total, "LKR", ph.secret),
  };

  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <p className="eyebrow">Order {o.order_no}</p>
      <h1 className="mt-3 text-4xl">Redirecting to secure payment…</h1>
      <p className="mb-8 mt-4 text-muted-fg">
        You&apos;ll pay <b className="text-ink">{lkr(o.total)}</b> on PayHere&apos;s secure page{ph.sandbox ? " (test mode)" : ""}. Card details never touch our site.
      </p>
      <PayRedirect action={payhereUrl(ph.sandbox)} fields={fields} />
    </div>
  );
}
