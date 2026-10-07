import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { lkr } from "@/lib/format";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = { title: "Shipping & Returns" };

export default async function Shipping() {
  const s = await getSettings();
  return (
    <InfoPage eyebrow="Policies" title="Shipping & returns" intro="Simple, transparent delivery across Sri Lanka, and an easy exchange if it isn't quite right.">
      <section>
        <h2>Delivery</h2>
        <ul>
          <li>Colombo, Gampaha &amp; Kalutara: {lkr(s.shipping_colombo)}, 1–2 working days.</li>
          <li>Rest of Sri Lanka: {lkr(s.shipping_island)}, 2–4 working days.</li>
          {s.free_shipping_over > 0 && <li>Free delivery on orders over {lkr(s.free_shipping_over)}.</li>}
          <li>Orders placed before 2 pm on working days are usually dispatched the same day.</li>
          <li>We&apos;ll call you to confirm your order and delivery address before dispatch.</li>
        </ul>
      </section>
      <section>
        <h2>Payment</h2>
        <p>Pay by cash on delivery, bank transfer or card. Card payments are processed securely by PayHere; we never see or store your card details. Bank-transfer orders are shipped once payment is confirmed.</p>
      </section>
      <section>
        <h2>Exchanges</h2>
        <ul>
          <li>Exchange for a different size or colour within 7 days of delivery.</li>
          <li>Items must be unworn, unwashed and have the original tags attached.</li>
          <li>Contact us on WhatsApp or by phone with your order number to arrange a pickup or drop-off.</li>
          <li>If an item arrives damaged or incorrect, tell us within 48 hours and we&apos;ll replace it at no cost.</li>
        </ul>
      </section>
      <section>
        <h2>Refunds</h2>
        <p>If a replacement isn&apos;t available, we&apos;ll refund the item price to your original payment method (bank transfer or card) within 7–10 working days. Delivery fees are non-refundable unless the item was faulty.</p>
      </section>
      <section>
        <h2>Need help?</h2>
        <p>Call <a href={`tel:${s.phone.replace(/\s/g, "")}`}>{s.phone}</a> or email <a href={`mailto:${s.email}`}>{s.email}</a>.</p>
      </section>
    </InfoPage>
  );
}
