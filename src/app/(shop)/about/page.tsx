import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Our story" };

export default async function About() {
  const s = await getSettings();
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <p className="eyebrow">Our story</p>
      <h1 className="mt-3 text-5xl leading-tight md:text-7xl">Born in Colombo.<br /><em className="text-gold">Made to last.</em></h1>
      <div className="mt-10 space-y-6 text-lg leading-relaxed text-ink-soft">
        <p>{s.brand_name} started with a simple idea: Sri Lankans deserve clothes that look sharp, feel good in the heat, and don&apos;t fall apart after a few washes.</p>
        <p>Every piece is designed in Colombo and made with local craftspeople, using breathable cotton and linen chosen for our climate. We release fewer styles, and we make them properly.</p>
        <p>From a first order to a repeat customer, we promise honest sizing, fair prices, and delivery to your door anywhere on the island.</p>
      </div>
      <Link href="/shop" className="btn mt-12">Shop the collection</Link>
    </div>
  );
}
