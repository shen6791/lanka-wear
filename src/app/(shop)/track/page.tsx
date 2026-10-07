import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { one } from "@/lib/db";
import { orderToken } from "@/lib/auth";
import { normalizePhone } from "@/lib/format";

export const metadata: Metadata = { title: "Track your order" };

async function track(form: FormData) {
  "use server";
  const no = String(form.get("order") ?? "").trim().toUpperCase();
  const phone = normalizePhone(String(form.get("phone") ?? ""));
  const o = await one<{ order_no: string }>("SELECT order_no FROM orders WHERE order_no = ? AND phone = ?", [no, phone]);
  redirect(o ? `/order/${o.order_no}?t=${orderToken(o.order_no)}` : "/track?error=1");
}

export default async function Track({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const err = (await searchParams).error;
  return (
    <div className="mx-auto max-w-md px-5 py-16 md:py-24">
      <p className="eyebrow text-center">Where&apos;s my order?</p>
      <h1 className="mb-10 mt-2 text-center text-5xl">Track order</h1>
      <form action={track} className="space-y-5 bg-white p-8">
        <div><label className="label" htmlFor="order">Order number</label><input id="order" name="order" required placeholder="LW2610071234" className="field" /></div>
        <div><label className="label" htmlFor="phone">Mobile number used</label><input id="phone" name="phone" required inputMode="tel" placeholder="077 123 4567" className="field" /></div>
        {err && <p role="alert" className="text-sm text-red-700">We couldn&apos;t find an order with those details.</p>}
        <button className="btn w-full">Track</button>
      </form>
    </div>
  );
}
