/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/data";
import { SITE, unsplash } from "@/lib/photos";

export const metadata: Metadata = { title: "Our story" };

const VALUES = [
  ["Made for our climate", "Breathable cotton and linen, cut to move in Sri Lankan heat and humidity."],
  ["Fewer, better pieces", "Small, considered collections instead of endless trends — made to be worn for years."],
  ["Local hands", "Designed in Colombo and finished by skilled local makers, paid fairly."],
];

export default async function About() {
  const s = await getSettings();
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow">Our story</p>
            <h1 className="mt-3 text-5xl leading-[1.02] md:text-7xl">Born in Colombo.<br /><em className="text-gold">Made to last.</em></h1>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-soft">
              <p>{s.brand_name} started with a simple idea: Sri Lankans deserve clothes that look sharp, feel good in the heat, and don&apos;t fall apart after a few washes.</p>
              <p>Every piece is designed in Colombo and made with local craftspeople, using breathable fabrics chosen for our climate. We release fewer styles, and we make them properly.</p>
            </div>
            <Link href="/shop" className="btn mt-10">Shop the collection</Link>
          </div>
          <img src={unsplash(SITE.story.url, 1000, 1200)} alt={SITE.story.alt} className="aspect-[5/6] w-full object-cover" />
        </div>
      </section>

      <section className="bg-muted">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-3 md:px-8">
          {VALUES.map(([t, d], i) => (
            <div key={t}>
              <p className="font-display text-5xl text-gold">0{i + 1}</p>
              <h2 className="mt-3 text-3xl">{t}</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <img src={unsplash(SITE.atelier.url, 1000, 800)} alt={SITE.atelier.alt} loading="lazy" className="aspect-[5/4] w-full object-cover" />
          <div>
            <p className="eyebrow">Visit us</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Come say hello</h2>
            <p className="mt-5 leading-relaxed text-ink-soft">Drop by to try things on, feel the fabrics, or pick up an online order. We&apos;re happy to help you find your size.</p>
            <p className="mt-6 text-sm"><b>{s.address}</b><br />{s.phone}<br />{s.email}</p>
            <Link href="/contact" className="btn btn-ghost mt-8">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
