"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./cart";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?sort=new", label: "New In" },
  { href: "/about", label: "Our Story" },
  { href: "/track", label: "Track Order" },
  { href: "/contact", label: "Contact" },
];

export function Header({ brand, announcement }: { brand: string; announcement: string }) {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menu]);

  return (
    <>
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-line">
      {announcement && (
        <div className="bg-ink px-4 py-2 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-white/90">{announcement}</div>
      )}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <button className="md:hidden -ml-3 flex h-11 w-11 items-center justify-center" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(true)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7h18M3 12h18M3 17h18" /></svg>
        </button>

        <Link href="/" className="font-display text-xl font-semibold uppercase tracking-[0.22em] sm:text-2xl sm:tracking-[0.28em] md:text-[1.7rem]">
          {brand}
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft transition-colors hover:text-gold">
              {n.label}
            </Link>
          ))}
        </nav>

        <button className="relative -mr-3 flex h-11 w-11 items-center justify-center" aria-label={`Open cart, ${count} items`} onClick={() => setOpen(true)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
          {count > 0 && (
            <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-white">{count}</span>
          )}
        </button>
      </div>

    </header>
      {menu && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenu(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col overflow-y-auto bg-background p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <button className="mb-6 -mr-2 flex h-11 w-11 items-center justify-center self-end" aria-label="Close menu" onClick={() => setMenu(false)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 5l14 14M19 5L5 19" /></svg>
            </button>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setMenu(false)} className="border-b border-line py-4 font-display text-3xl">
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
