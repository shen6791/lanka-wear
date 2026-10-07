import { exec, one } from "@/lib/db";
import { getPayhere } from "@/lib/data";
import { money, notifySig } from "@/lib/payhere";
import { timingSafeEqual } from "crypto";

export const dynamic = "force-dynamic";

/** PayHere server-to-server payment notification. Verifies the signature before touching the order. */
export async function POST(req: Request) {
  const ph = await getPayhere();
  if (!ph.ready) return new Response("not configured", { status: 503 });

  const f = await req.formData();
  const v = (k: string) => String(f.get(k) ?? "");
  const orderId = v("order_id");
  const statusCode = v("status_code");

  const expected = notifySig(v("merchant_id"), orderId, v("payhere_amount"), v("payhere_currency"), statusCode, ph.secret);
  const given = v("md5sig").toUpperCase();
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  if (v("merchant_id") !== ph.merchantId || a.length !== b.length || !timingSafeEqual(a, b)) return new Response("bad signature", { status: 400 });

  const o = await one<{ id: number; total: number; payment_method: string }>("SELECT id, total, payment_method FROM orders WHERE order_no = ?", [orderId]);
  if (!o || o.payment_method !== "card") return new Response("unknown order", { status: 404 });
  if (v("payhere_currency") !== "LKR" || money(o.total) !== money(Number(v("payhere_amount")))) return new Response("amount mismatch", { status: 400 });

  // 2 = success. Other codes (0 pending, -1 cancelled, -2 failed, -3 chargeback) leave the order unpaid.
  if (statusCode === "2") {
    await exec(
      "UPDATE orders SET payment_status = 'paid', status = CASE WHEN status = 'pending' THEN 'confirmed' ELSE status END WHERE id = ?",
      [o.id],
    );
  }
  return new Response("OK");
}
