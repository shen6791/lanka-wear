import type { Metadata } from "next";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Contact" };

export default async function Contact() {
  const s = await getSettings();
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <p className="eyebrow">Get in touch</p>
      <h1 className="mt-3 text-5xl md:text-6xl">Contact us</h1>
      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        <div className="border-t border-ink pt-5"><p className="label">Visit</p><p>{s.address}</p></div>
        <div className="border-t border-ink pt-5"><p className="label">Call</p><a href={`tel:${s.phone.replace(/\s/g, "")}`} className="hover:text-gold">{s.phone}</a></div>
        <div className="border-t border-ink pt-5"><p className="label">Email</p><a href={`mailto:${s.email}`} className="hover:text-gold">{s.email}</a></div>
        {s.whatsapp && <div className="border-t border-ink pt-5"><p className="label">WhatsApp</p><a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-gold">Chat with us</a></div>}
      </div>
      <h2 className="mt-16 text-3xl">Delivery &amp; exchanges</h2>
      <ul className="mt-4 space-y-2 text-ink-soft">
        <li>• Colombo, Gampaha &amp; Kalutara: {`Rs. ${s.shipping_colombo}`}, 1–2 working days</li>
        <li>• Rest of Sri Lanka: {`Rs. ${s.shipping_island}`}, 2–4 working days</li>
        {s.free_shipping_over > 0 && <li>• Free delivery over Rs. {s.free_shipping_over.toLocaleString("en-LK")}</li>}
        <li>• Size exchanges within 7 days of delivery, items unworn with tags</li>
      </ul>
    </div>
  );
}
