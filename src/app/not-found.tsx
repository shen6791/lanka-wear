import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-5 text-center text-white">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 font-display text-7xl md:text-9xl">Lost?</h1>
      <p className="mt-4 max-w-sm text-white/60">We couldn&apos;t find that page. Let&apos;s get you back to something beautiful.</p>
      <div className="mt-10 flex gap-3"><Link href="/" className="btn btn-light">Home</Link><Link href="/shop" className="btn btn-ghost !text-white !border-white/40 hover:!bg-white hover:!text-ink">Shop</Link></div>
    </div>
  );
}
