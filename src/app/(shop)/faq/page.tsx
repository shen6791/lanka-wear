import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = { title: "FAQ" };

export default async function FAQ() {
  const s = await getSettings();
  const qa: [string, string][] = [
    ["How long does delivery take?", `Colombo, Gampaha and Kalutara usually receive orders in 1–2 working days. The rest of Sri Lanka takes 2–4 working days. We'll call you to confirm before dispatch.`],
    ["How much is delivery?", `Rs. ${s.shipping_colombo.toLocaleString("en-LK")} to the Colombo area and Rs. ${s.shipping_island.toLocaleString("en-LK")} to the rest of the island.${s.free_shipping_over > 0 ? ` Orders over Rs. ${s.free_shipping_over.toLocaleString("en-LK")} ship free.` : ""}`],
    ["Which payment methods do you accept?", "Cash on delivery, bank transfer, and credit/debit cards (Visa, Mastercard, Amex) through PayHere's secure checkout."],
    ["How do bank transfers work?", "Choose bank transfer at checkout, transfer the total using your order number as the reference, and upload the slip (or send it on WhatsApp). We confirm and ship once the payment is received."],
    ["Can I exchange for a different size?", "Yes. Unworn items with tags can be exchanged within 7 days of delivery. See our Shipping & Returns page for details."],
    ["How do I find my size?", "Check our size guide for measurements. If you're between sizes, we recommend sizing up for a relaxed fit."],
    ["How can I track my order?", "Use the Track Order page with your order number and mobile number. We'll also update you by phone or WhatsApp."],
    ["How should I care for my garments?", "Machine wash cold with similar colours, avoid tumble drying, and iron on low heat. Linen softens with every wash."],
  ];
  return (
    <InfoPage eyebrow="Help" title="Frequently asked questions" intro="Quick answers to the things customers ask most. Can't find yours? We're one message away.">
      <div className="divide-y divide-line border-y border-line">
        {qa.map(([q, a]) => (
          <details key={q} className="group py-5">
            <summary className="flex list-none items-center justify-between gap-4 font-display text-2xl text-ink [&::-webkit-details-marker]:hidden">
              {q}<span className="text-gold transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 max-w-2xl">{a}</p>
          </details>
        ))}
      </div>
      <p>Still need help? {s.whatsapp && <><a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp us</a> or </>}<a href={`mailto:${s.email}`}>email {s.email}</a>.</p>
    </InfoPage>
  );
}
