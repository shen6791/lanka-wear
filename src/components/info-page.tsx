export function InfoPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-3 text-5xl md:text-6xl">{title}</h1>
      {intro && <p className="mt-5 text-lg leading-relaxed text-ink-soft">{intro}</p>}
      <div className="mt-12 space-y-10 leading-relaxed text-ink-soft [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-gold">
        {children}
      </div>
    </div>
  );
}
