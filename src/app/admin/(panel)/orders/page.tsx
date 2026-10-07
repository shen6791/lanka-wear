import Link from "next/link";
import { LIKE, rows } from "@/lib/db";
import { lkr, STATUS_LABEL } from "@/lib/format";

const TABS = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];
const BADGE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900",
  confirmed: "bg-blue-100 text-blue-900",
  shipped: "bg-indigo-100 text-indigo-900",
  delivered: "bg-green-100 text-green-900",
  cancelled: "bg-stone-200 text-stone-700",
};

export default async function Orders({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const sp = await searchParams;
  const where: string[] = [];
  const params: unknown[] = [];
  if (sp.status && TABS.includes(sp.status) && sp.status !== "all") { where.push("status = ?"); params.push(sp.status); }
  if (sp.q) { where.push(`(order_no ${LIKE} ? OR customer_name ${LIKE} ? OR phone ${LIKE} ?)`); params.push(`%${sp.q}%`, `%${sp.q}%`, `%${sp.q}%`); }
  const list = await rows<{ id: number; order_no: string; customer_name: string; phone: string; district: string; total: number; status: string; payment_method: string; payment_status: string; created_at: Date }>(
    `SELECT id, order_no, customer_name, phone, district, total, status, payment_method, payment_status, created_at FROM orders ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY id DESC LIMIT 200`,
    params,
  );
  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Orders</h1>
      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((t) => (
          <Link key={t} href={`/admin/orders?status=${t}${sp.q ? `&q=${sp.q}` : ""}`} className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${(sp.status ?? "all") === t ? "bg-ink text-white" : "bg-white hover:bg-white/60"}`}>{t}</Link>
        ))}
        <form className="ml-auto"><input name="q" defaultValue={sp.q} placeholder="Search order / name / phone" className="field !w-64 !py-2" /></form>
      </div>
      <div className="overflow-x-auto bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wider text-muted-fg">
            <tr><th className="p-4">Order</th><th>Customer</th><th>District</th><th>Payment</th><th>Total</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((o) => (
              <tr key={o.id} className="hover:bg-muted/50">
                <td className="p-4"><Link href={`/admin/orders/${o.id}`} className="font-semibold underline-offset-4 hover:underline">{o.order_no}</Link></td>
                <td>{o.customer_name}<br /><span className="text-xs text-muted-fg">{o.phone}</span></td>
                <td>{o.district}</td>
                <td className="uppercase">{o.payment_method}{o.payment_status === "paid" && <span className="ml-1 text-green-700">✓</span>}</td>
                <td>{lkr(o.total)}</td>
                <td><span className={`px-2 py-1 text-xs ${BADGE[o.status]}`}>{STATUS_LABEL[o.status]}</span></td>
                <td className="text-muted-fg">{new Date(o.created_at).toLocaleDateString("en-GB")}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={7} className="p-10 text-center text-muted-fg">No orders.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
