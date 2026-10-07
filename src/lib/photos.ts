// Stock photography (Unsplash licence) hot-linked for the prototype. Replace with the brand's own photography.
// Product photos live in the database (see scripts/photos.json + scripts/gen-seed.mjs); the site-wide images are below.
export const unsplash = (url: string, w: number, h?: number) => `${url}?auto=format&fit=crop&crop=entropy&w=${w}${h ? `&h=${h}` : ""}&q=80`;

export const SITE = {
  hero: { url: "https://images.unsplash.com/photo-1653040321630-698cfc09254e", alt: "a woman standing against a wall with her hands on her head" },
  heroCard: { url: "https://images.unsplash.com/photo-1668952135120-7d997b1b3778", alt: "a woman in a long coat" },
  lookbook: { url: "https://images.unsplash.com/photo-1638265499174-62c2cb29137a", alt: "a woman sitting on top of a white block" },
  story: { url: "https://images.unsplash.com/photo-1606501126768-b78d4569d3f9", alt: "person in gray shirt sewing" },
  atelier: { url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04", alt: "clothing boutique interior with hanging racks" },
  men: { url: "https://images.unsplash.com/photo-1587072707615-c95b154d3ccb", alt: "man in brown leather jacket and green pants leaning on brown" },
};

/** Category tile photos (first photo of a representative product). */
export const CATEGORY_PHOTO: Record<string, string> = {
  "t-shirts": "https://images.unsplash.com/photo-1618453292507-4959ece6429e",
  "shirts": "https://images.unsplash.com/photo-1772583435283-b07bc9950497",
  "trousers": "https://images.unsplash.com/photo-1781145611612-98a564fcc648",
  "dresses": "https://images.unsplash.com/photo-1789110854238-ca55b1a3559c",
  "accessories": "https://images.unsplash.com/photo-1544816155-12df9643f363",
  "outerwear": "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7",
};

export const GALLERY: { url: string; alt: string; slug: string }[] = [
  { url: "https://images.unsplash.com/photo-1618453292610-4119319e5ac7", alt: "man in black t-shirt standing near white wall", slug: "classic-heavy-tee" },
  { url: "https://images.unsplash.com/photo-1704775989614-8435994e4e97", alt: "Woman in a dark blue dress on a maroon background", slug: "slip-midi-dress" },
  { url: "https://images.unsplash.com/photo-1770058428099-f2d64ab34006", alt: "Young man in a light blue collared shirt smiling", slug: "oxford-button-down" },
  { url: "https://images.unsplash.com/photo-1759992878336-a5dd342ea245", alt: "Woman in a floral wrap dress with a high slit", slug: "summer-maxi-dress" },
  { url: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5", alt: "men wearing a grey hoodie jacket leaning in a wall during daytime", slug: "oversized-hoodie" },
  { url: "https://images.unsplash.com/photo-1580651214613-f4692d6d138f", alt: "woman in white long sleeve shirt and blue pants", slug: "pleated-wide-trousers" },
];
