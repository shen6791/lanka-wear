/* eslint-disable @next/next/no-img-element */
const TONES = [
  ["#d9d2c5", "#b9ae9a"],
  ["#c9d0c2", "#a3ae9a"],
  ["#d8c3b6", "#b99a88"],
  ["#c4c8d1", "#9aa1b0"],
  ["#2b2724", "#14110f"],
];

/** Product photo, or an elegant monogram tile until real photography is uploaded. */
export function ProductImage({
  src,
  name,
  className = "",
  priority = false,
}: {
  src: string | null;
  name: string;
  className?: string;
  priority?: boolean;
}) {
  if (src) {
    return <img src={src} alt={name} loading={priority ? "eager" : "lazy"} decoding="async" className={`h-full w-full object-cover ${className}`} />;
  }
  const idx = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % TONES.length;
  const [a, b] = TONES[idx];
  const dark = idx === TONES.length - 1;
  return (
    <div
      role="img"
      aria-label={name}
      className={`flex h-full w-full items-center justify-center ${className}`}
      style={{ background: `linear-gradient(160deg, ${a}, ${b})` }}
    >
      <span className="font-display text-6xl font-light" style={{ color: dark ? "#c9a24a" : "rgba(28,25,23,0.55)" }}>
        {name.trim().charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
