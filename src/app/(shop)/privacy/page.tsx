import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = { title: "Privacy policy" };

export default async function Privacy() {
  const s = await getSettings();
  return (
    <InfoPage eyebrow="Legal" title="Privacy policy" intro={`How ${s.brand_name} collects, uses and protects your information.`}>
      <section><h2>What we collect</h2><p>When you place an order we collect your name, phone number, delivery address and, optionally, your email. If you subscribe to our newsletter we collect your email address.</p></section>
      <section><h2>How we use it</h2><ul><li>To process, deliver and support your order.</li><li>To contact you about your order by phone, SMS, WhatsApp or email.</li><li>To send newsletters, only if you subscribed — unsubscribe anytime.</li></ul></section>
      <section><h2>Payments</h2><p>Card payments are handled by PayHere. We never see or store your card number. Bank-transfer slips you upload are visible only to our staff.</p></section>
      <section><h2>Sharing</h2><p>We share your name, phone number and address with our delivery partners only so they can deliver your order. We do not sell your data.</p></section>
      <section><h2>Your rights</h2><p>You can ask us to access, correct or delete your information at any time by contacting <a href={`mailto:${s.email}`}>{s.email}</a>.</p></section>
    </InfoPage>
  );
}
