import Link from "next/link";
import type { Settings } from "@/lib/data";

const PAY = ["Visa", "Mastercard", "Amex", "COD", "Bank transfer"];

export function Footer({ s }: { s: Settings }) {
  const link = "transition-colors hover:text-white";
  return (
    <footer className="mt-24 bg-ink text-white/80">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.6fr_1fr_1fr_1.2fr] md:px-8">
        <div>
          <p className="font-display text-3xl font-semibold uppercase tracking-[0.28em] text-white">{s.brand_name}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">{s.tagline} Designed and cut in Colombo, delivered across Sri Lanka.</p>
          <div className="mt-6 flex flex-wrap gap-2" aria-label="Accepted payment methods">
            {PAY.map((p) => <span key={p} className="border border-white/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/70">{p}</span>)}
          </div>
        </div>
        <div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-soft">Shop</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link className={link} href="/shop">All products</Link></li>
            <li><Link className={link} href="/shop?sort=new">New arrivals</Link></li>
            <li><Link className={link} href="/shop?category=dresses">Dresses</Link></li>
            <li><Link className={link} href="/shop?category=outerwear">Outerwear</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-soft">Help</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link className={link} href="/track">Track your order</Link></li>
            <li><Link className={link} href="/shipping-returns">Shipping &amp; returns</Link></li>
            <li><Link className={link} href="/size-guide">Size guide</Link></li>
            <li><Link className={link} href="/faq">FAQ</Link></li>
            <li><Link className={link} href="/about">Our story</Link></li>
            <li><Link className={link} href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-soft">Visit &amp; contact</p>
          <ul className="space-y-2.5 text-sm">
            <li>{s.address}</li>
            <li><a className={link} href={`tel:${s.phone.replace(/\s/g, "")}`}>{s.phone}</a></li>
            <li><a className={link} href={`mailto:${s.email}`}>{s.email}</a></li>
            {s.whatsapp && <li><a className={link} href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp us</a></li>}
            {s.instagram && <li><a className={link} href={s.instagram} target="_blank" rel="noreferrer">Instagram</a></li>}
            {s.facebook && <li><a className={link} href={s.facebook} target="_blank" rel="noreferrer">Facebook</a></li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-xs text-white/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 md:flex-row md:px-3">
          <p>© {new Date().getFullYear()} {s.brand_name}. All rights reserved.</p>
          <p className="flex gap-5"><Link className={link} href="/privacy">Privacy</Link><Link className={link} href="/terms">Terms</Link></p>
        </div>
      </div>
    </footer>
  );
}
