import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { exec, one, rows, restockOrder, unrestockOrder } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { lkr, STATUS_LABEL } from "@/lib/format";

type Order = {
  id: number; order_no: string; customer_name: string; phone: string; email: string | null; address: string; city: string; district: string;
  notes: string | null; payment_method: string; payment_status: string; status: string; subtotal: number; shipping: number; total: number;
  slip_url: string | null; tracking_note: string | null; created_at: Date;
};

async function update(form: FormData) {
  "use server";
  await requireAdmin();
  const id = Number(form.get("id"));
  const status = String(form.get("status"));
  const paid = form.get("paid") === "on" ? "paid" : "pending";
  const note = String(form.get("note") ?? "").slice(0, 300) || null;
  if (!["pending", "confirmed", "shipped", "delivered", "cancelled"].includes(status)) return;
  const cur = await one<{ status: string }>("SELECT status FROM orders WHERE id = ?", [id]);
  if (!cur) return;
  await exec("UPDATE orders SET status=?, payment_status=?, tracking_note=? WHERE id=?", [status, paid, note, id]);
  if (status === "cancelled" && cur.status !== "cancelled") await restockOrder(id);
  if (cur.status === "cancelled" && status !== "cancelled")
    await unrestockOrder(id);
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
}

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const o = await one<Order>("SELECT * FROM orders WHERE id = ?", [id]);
  if (!o) notFound();
  const items = await rows<{ name: string; size: string; color: string; price: number; qty: number }>("SELECT name,size,color,price,qty FROM order_items WHERE order_id=?", [id]);
  const waText = encodeURIComponent(`Hi ${o.customer_name}, this is regarding your order ${o.order_no}.`);
  const wa = "94" + o.phone.replace(/^0/, "");

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="text-xs underline">← Orders</Link>
      <h1 className="text-4xl">Order {o.order_no}</h1>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <section className="bg-white p-6">
            <h2 className="mb-3 text-2xl">Items</h2>
            <ul className="divide-y divide-line text-sm">
              {items.map((i, k) => <li key={k} className="flex justify-between py-3"><span>{i.qty} × {i.name} <span className="text-muted-fg">({[i.color, i.size].filter(Boolean).join(" · ")})</span></span><span>{lkr(i.price * i.qty)}</span></li>)}
            </ul>
            <dl className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{lkr(o.subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Delivery</dt><dd>{lkr(o.shipping)}</dd></div>
              <div className="flex justify-between text-base font-semibold"><dt>Total ({o.payment_method === "cod" ? "collect on delivery" : "bank transfer"})</dt><dd>{lkr(o.total)}</dd></div>
            </dl>
          </section>
          <section className="bg-white p-6 text-sm">
            <h2 className="mb-3 text-2xl">Customer</h2>
            <p className="font-medium">{o.customer_name}</p>
            <p>{o.address}, {o.city}, {o.district}</p>
            <p className="mt-2"><a className="underline" href={`tel:${o.phone}`}>{o.phone}</a> · <a className="underline" target="_blank" rel="noreferrer" href={`https://wa.me/${wa}?text=${waText}`}>WhatsApp</a>{o.email && <> · <a className="underline" href={`mailto:${o.email}`}>{o.email}</a></>}</p>
            {o.notes && <p className="mt-3 bg-muted p-3">Note: {o.notes}</p>}
            <p className="mt-3 text-xs text-muted-fg">Placed {new Date(o.created_at).toLocaleString("en-GB")}</p>
          </section>
        </div>
        <section className="h-fit bg-white p-6">
          <h2 className="mb-4 text-2xl">Update</h2>
          <form action={update} className="space-y-4 text-sm">
            <input type="hidden" name="id" value={o.id} />
            <div><label className="label" htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={o.status} className="field">{Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            <label className="flex items-center gap-2"><input type="checkbox" name="paid" defaultChecked={o.payment_status === "paid"} className="accent-[#1c1917]" /> Payment received</label>
            <div><label className="label" htmlFor="note">Note shown to customer (e.g. courier tracking no.)</label><input id="note" name="note" defaultValue={o.tracking_note ?? ""} className="field" /></div>
            <button className="btn w-full">Save</button>
            <p className="text-xs text-muted-fg">Cancelling returns the items to stock.</p>
          </form>
          {o.slip_url && (
            <div className="mt-6 border-t border-line pt-4 text-sm">
              <p className="label">Payment slip</p>
              <a href={o.slip_url} target="_blank" rel="noreferrer" className="underline">Open slip ↗</a>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
