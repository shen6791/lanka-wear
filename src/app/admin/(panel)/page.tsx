import Link from "next/link";
import { rows, one } from "@/lib/db";
import { lkr, STATUS_LABEL } from "@/lib/format";

export default async function Dashboard() {
  const [today, month, pending, lowStock, recent] = await Promise.all([
    one<{ n: number; t: number }>("SELECT COUNT(*) n, COALESCE(SUM(total),0) t FROM orders WHERE DATE(created_at)=CURDATE() AND status<>'cancelled'"),
    one<{ n: number; t: number }>("SELECT COUNT(*) n, COALESCE(SUM(total),0) t FROM orders WHERE created_at >= DATE_FORMAT(NOW(),'%Y-%m-01') AND status<>'cancelled'"),
    one<{ n: number }>("SELECT COUNT(*) n FROM orders WHERE status='pending'"),
    rows<{ name: string; size: string; color: string; stock: number; id: number }>(
      "SELECT p.id, p.name, v.size, v.color, v.stock FROM product_variants v JOIN products p ON p.id=v.product_id WHERE p.is_active=1 AND v.stock<=3 ORDER BY v.stock, p.name LIMIT 8",
    ),
    rows<{ id: number; order_no: string; customer_name: string; total: number; status: string; payment_method: string }>(
      "SELECT id, order_no, customer_name, total, status, payment_method FROM orders ORDER BY id DESC LIMIT 8",
    ),
  ]);
  const cards = [
    ["Today's orders", String(today?.n ?? 0), lkr(today?.t ?? 0)],
    ["This month", String(month?.n ?? 0), lkr(month?.t ?? 0)],
    ["Awaiting confirmation", String(pending?.n ?? 0), "pending orders"],
  ];
  return (
    <div className="space-y-8">
      <h1 className="text-4xl">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(([a, b, c]) => (
          <div key={a} className="bg-white p-6"><p className="label">{a}</p><p className="font-display text-5xl">{b}</p><p className="text-sm text-muted-fg">{c}</p></div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="bg-white p-6">
          <div className="mb-4 flex justify-between"><h2 className="text-2xl">Recent orders</h2><Link href="/admin/orders" className="text-xs underline">All orders</Link></div>
          {recent.length === 0 ? <p className="text-sm text-muted-fg">No orders yet.</p> : (
            <ul className="divide-y divide-line text-sm">
              {recent.map((o) => (
                <li key={o.id}><Link href={`/admin/orders/${o.id}`} className="flex items-center justify-between py-3 hover:text-gold">
                  <span><b>{o.order_no}</b> · {o.customer_name}</span><span>{lkr(o.total)} · {STATUS_LABEL[o.status]}</span>
                </Link></li>
              ))}
            </ul>
          )}
        </section>
        <section className="bg-white p-6">
          <h2 className="mb-4 text-2xl">Low stock</h2>
          {lowStock.length === 0 ? <p className="text-sm text-muted-fg">All good.</p> : (
            <ul className="divide-y divide-line text-sm">
              {lowStock.map((v, i) => (
                <li key={i}><Link href={`/admin/products/${v.id}`} className="flex justify-between py-3 hover:text-gold"><span>{v.name} · {[v.color, v.size].filter(Boolean).join(" ")}</span><b className={v.stock === 0 ? "text-red-700" : ""}>{v.stock} left</b></Link></li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
