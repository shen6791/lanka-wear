import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { endSession, requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const NAV = [
  ["/admin", "Dashboard"],
  ["/admin/orders", "Orders"],
  ["/admin/products", "Products"],
  ["/admin/categories", "Categories"],
  ["/admin/subscribers", "Subscribers"],
  ["/admin/settings", "Settings"],
];

async function logout() {
  "use server";
  await endSession();
  redirect("/admin/login");
}

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const s = await getSettings();
  return (
    <div className="min-h-screen md:flex">
      <aside className="bg-ink text-white md:sticky md:top-0 md:h-screen md:w-56 md:shrink-0">
        <div className="flex items-center justify-between p-5 md:block">
          <p className="font-display text-xl uppercase tracking-[0.2em]">{s.brand_name}</p>
          <p className="hidden text-[10px] uppercase tracking-[0.2em] text-white/40 md:block">Admin</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:px-3">
          {NAV.map(([h, l]) => (
            <Link key={h} href={h} className="whitespace-nowrap px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white">{l}</Link>
          ))}
          <Link href="/" target="_blank" className="whitespace-nowrap px-3 py-2 text-sm text-gold-soft hover:text-white">View store ↗</Link>
          <form action={logout}><button className="px-3 py-2 text-sm text-white/50 hover:text-white">Sign out</button></form>
        </nav>
      </aside>
      <div className="min-w-0 flex-1 bg-muted/60 p-5 md:p-10">{children}</div>
    </div>
  );
}
