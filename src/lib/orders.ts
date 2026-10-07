import { transaction } from "./db";
import { COLOMBO_AREA } from "./format";
import type { Settings } from "./data";

export type CartLine = { variantId: number; qty: number };
export type OrderInput = {
  name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  district: string;
  notes: string | null;
  payment: "cod" | "bank" | "card";
  slipUrl: string | null;
};

export class OrderError extends Error {}

export function shippingFor(district: string, subtotal: number, s: Settings) {
  if (subtotal >= s.free_shipping_over && s.free_shipping_over > 0) return 0;
  return COLOMBO_AREA.includes(district) ? s.shipping_colombo : s.shipping_island;
}

function orderNo() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `LW${ymd}${Math.floor(1000 + Math.random() * 9000)}`;
}

/** Re-prices every line from the database, locks stock rows, and creates the order atomically. */
export async function createOrder(lines: CartLine[], input: OrderInput, settings: Settings) {
  const merged = new Map<number, number>();
  for (const l of lines) {
    if (!Number.isInteger(l.variantId) || !Number.isInteger(l.qty) || l.qty < 1 || l.qty > 20) throw new OrderError("Invalid cart.");
    merged.set(l.variantId, (merged.get(l.variantId) ?? 0) + l.qty);
  }
  if (merged.size === 0 || merged.size > 40) throw new OrderError("Your cart is empty.");

  return transaction(async (tx) => {
    const ids = [...merged.keys()];
    const vr = await tx.rows<{ id: number; product_id: number; size: string; color: string; stock: number; name: string; price: number; is_active: number }>(
      `SELECT v.id, v.product_id, v.size, v.color, v.stock, p.name, p.price, p.is_active
       FROM product_variants v JOIN products p ON p.id = v.product_id
       WHERE v.id IN (?) FOR UPDATE`,
      [ids],
    );
    if (vr.length !== ids.length) throw new OrderError("Some items are no longer available. Please review your cart.");

    let subtotal = 0;
    for (const v of vr) {
      const qty = merged.get(v.id)!;
      if (!v.is_active) throw new OrderError(`${v.name} is no longer available.`);
      if (v.stock < qty)
        throw new OrderError(v.stock > 0 ? `Only ${v.stock} left of ${v.name} (${v.size}).` : `${v.name} (${v.size}) is out of stock.`);
      subtotal += Number(v.price) * qty;
    }
    const shipping = shippingFor(input.district, subtotal, settings);
    const total = subtotal + shipping;

    let no = orderNo();
    for (let i = 0; i < 5; i++) {
      if (!(await tx.rows("SELECT 1 FROM orders WHERE order_no = ?", [no])).length) break;
      no = orderNo();
    }
    const orderId = await tx.insert(
      `INSERT INTO orders (order_no, customer_name, phone, email, address, city, district, notes, payment_method, subtotal, shipping, total, slip_url)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [no, input.name, input.phone, input.email, input.address, input.city, input.district, input.notes, input.payment, subtotal, shipping, total, input.slipUrl],
    );
    for (const v of vr) {
      const qty = merged.get(v.id)!;
      await tx.exec(
        "INSERT INTO order_items (order_id, product_id, variant_id, name, size, color, price, qty) VALUES (?,?,?,?,?,?,?,?)",
        [orderId, v.product_id, v.id, v.name, v.size, v.color, v.price, qty],
      );
      await tx.exec("UPDATE product_variants SET stock = stock - ? WHERE id = ?", [qty, v.id]);
    }
    return { orderNo: no, total };
  });
}
