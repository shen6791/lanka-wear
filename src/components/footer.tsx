import Link from "next/link";
import type { Settings } from "@/lib/data";

export function Footer({ s }: { s: Settings }) {
  return (
    <footer className="mt-24 bg-ink text-white/80">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <p className="font-display text-3xl font-semibold uppercase tracking-[0.28em] text-white">{s.brand_name}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">{s.tagline} Designed and cut in Colombo, delivered across Sri Lanka.</p>
        </div>
        <div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-soft">Shop</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link className="hover:text-white" href="/shop">All products</Link></li>
            <li><Link className="hover:text-white" href="/shop?sort=new">New arrivals</Link></li>
            <li><Link className="hover:text-white" href="/track">Track your order</Link></li>
            <li><Link className="hover:text-white" href="/about">Our story</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-soft">Contact</p>
          <ul className="space-y-2.5 text-sm">
            <li>{s.address}</li>
            <li><a className="hover:text-white" href={`tel:${s.phone.replace(/\s/g, "")}`}>{s.phone}</a></li>
            <li><a className="hover:text-white" href={`mailto:${s.email}`}>{s.email}</a></li>
            {s.whatsapp && <li><a className="hover:text-white" href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp us</a></li>}
            {s.instagram && <li><a className="hover:text-white" href={s.instagram} target="_blank" rel="noreferrer">Instagram</a></li>}
            {s.facebook && <li><a className="hover:text-white" href={s.facebook} target="_blank" rel="noreferrer">Facebook</a></li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {s.brand_name}. All rights reserved. · Cash on delivery &amp; bank transfer accepted.
      </div>
    </footer>
  );
}
