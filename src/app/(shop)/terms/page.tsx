import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = { title: "Terms & conditions" };

export default async function Terms() {
  const s = await getSettings();
  return (
    <InfoPage eyebrow="Legal" title="Terms & conditions" intro={`By placing an order with ${s.brand_name} you agree to the following terms.`}>
      <section><h2>Orders</h2><p>An order is confirmed once we contact you and accept it. We may cancel an order if an item is out of stock or the details can&apos;t be verified; any payment made will be refunded in full.</p></section>
      <section><h2>Prices</h2><p>All prices are in Sri Lankan Rupees (LKR) and include applicable taxes. Delivery fees are shown at checkout. We reserve the right to correct pricing errors.</p></section>
      <section><h2>Payment</h2><p>We accept cash on delivery, bank transfer and card payments. Bank-transfer orders are dispatched after payment is received.</p></section>
      <section><h2>Delivery</h2><p>Delivery times are estimates and may be affected by courier delays or public holidays. Please make sure someone is available to receive your order.</p></section>
      <section><h2>Exchanges &amp; refunds</h2><p>See our Shipping &amp; Returns page for how exchanges and refunds work.</p></section>
      <section><h2>Contact</h2><p>Questions? Email <a href={`mailto:${s.email}`}>{s.email}</a> or call {s.phone}.</p></section>
    </InfoPage>
  );
}
