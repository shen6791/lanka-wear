"use client";

/* eslint-disable @next/next/no-img-element */
import { useActionState, useState } from "react";
import { saveProduct, type ProductState } from "@/app/admin/(panel)/products/actions";

type V = { id?: number; size: string; color: string; color_hex: string; stock: number };
type Init = {
  id?: number; name: string; description: string; price: number | ""; compare_price: number | ""; category_id: number | "";
  is_active: boolean; is_featured: boolean; is_new: boolean; variants: V[]; images: { id: number; url: string }[];
};

export function ProductForm({ init, cats }: { init: Init; cats: { id: number; name: string }[] }) {
  const [state, action, pending] = useActionState<ProductState, FormData>(saveProduct, undefined);
  const [variants, setVariants] = useState<V[]>(init.variants.length ? init.variants : [{ size: "M", color: "", color_hex: "", stock: 0 }]);
  const upd = (i: number, patch: Partial<V>) => setVariants((vs) => vs.map((v, k) => (k === i ? { ...v, ...patch } : v)));

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <input type="hidden" name="id" value={init.id ?? ""} />
      <input type="hidden" name="variants" value={JSON.stringify(variants)} />

      <div className="space-y-6">
        <section className="space-y-5 bg-white p-6">
          <div><label className="label" htmlFor="name">Name *</label><input id="name" name="name" defaultValue={init.name} required className="field" /></div>
          <div><label className="label" htmlFor="description">Description</label><textarea id="description" name="description" rows={5} defaultValue={init.description} className="field" /></div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div><label className="label" htmlFor="price">Price (LKR) *</label><input id="price" name="price" type="number" min="1" step="1" defaultValue={init.price} required className="field" /></div>
            <div><label className="label" htmlFor="compare_price">Compare-at (was)</label><input id="compare_price" name="compare_price" type="number" min="1" step="1" defaultValue={init.compare_price} className="field" /></div>
            <div><label className="label" htmlFor="category_id">Category</label>
              <select id="category_id" name="category_id" defaultValue={init.category_id} className="field"><option value="">None</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          </div>
        </section>

        <section className="bg-white p-6">
          <h2 className="mb-1 text-2xl">Sizes, colours &amp; stock</h2>
          <p className="mb-4 text-xs text-muted-fg">One row per size/colour combination. Leave colour blank if not applicable.</p>
          <div className="space-y-2">
            <div className="hidden grid-cols-[1fr_1.4fr_5rem_5rem_2rem] gap-2 text-[10px] uppercase tracking-wider text-muted-fg sm:grid"><span>Size</span><span>Colour</span><span>Swatch</span><span>Stock</span><span /></div>
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1.4fr_5rem_5rem_2rem]">
                <input aria-label="Size" placeholder="M / 32 / One size" value={v.size} onChange={(e) => upd(i, { size: e.target.value })} className="field" />
                <input aria-label="Colour" placeholder="Black" value={v.color} onChange={(e) => upd(i, { color: e.target.value })} className="field" />
                <input aria-label="Swatch" type="color" value={v.color_hex || "#000000"} onChange={(e) => upd(i, { color_hex: e.target.value })} className="field !p-1 h-[46px]" />
                <input aria-label="Stock" type="number" min="0" value={v.stock} onChange={(e) => upd(i, { stock: Number(e.target.value) })} className="field" />
                <button type="button" aria-label="Remove row" onClick={() => setVariants((vs) => vs.filter((_, k) => k !== i))} className="text-xl text-muted-fg hover:text-red-700">×</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setVariants((vs) => [...vs, { size: "", color: vs.at(-1)?.color ?? "", color_hex: vs.at(-1)?.color_hex ?? "", stock: 0 }])} className="btn btn-ghost mt-4 !py-2">+ Add row</button>
        </section>
      </div>

      <div className="space-y-6">
        <section className="space-y-3 bg-white p-6 text-sm">
          <h2 className="mb-1 text-2xl">Visibility</h2>
          <label className="flex items-center gap-2"><input type="checkbox" name="is_active" defaultChecked={init.is_active} className="accent-[#1c1917]" /> Visible in store</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="is_featured" defaultChecked={init.is_featured} className="accent-[#1c1917]" /> Featured on homepage</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="is_new" defaultChecked={init.is_new} className="accent-[#1c1917]" /> Mark as “New”</label>
        </section>

        <section className="bg-white p-6">
          <h2 className="mb-3 text-2xl">Photos</h2>
          {init.images.length > 0 && (
            <div className="mb-4 grid grid-cols-3 gap-2">
              {init.images.map((im) => (
                <label key={im.id} className="relative block cursor-pointer">
                  <img src={im.url} alt="" className="aspect-[3/4] w-full object-cover" />
                  <span className="mt-1 flex items-center gap-1 text-[11px]"><input type="checkbox" name="remove_image" value={im.id} className="accent-red-700" /> Remove</span>
                </label>
              ))}
            </div>
          )}
          <input type="file" name="images" multiple accept="image/jpeg,image/png,image/webp" className="block w-full text-xs" />
          <p className="mt-2 text-xs text-muted-fg">JPG, PNG or WebP, up to 6 MB each. First photo is the cover. Portrait 3:4 looks best.</p>
        </section>

        {state?.error && <p role="alert" className="border border-red-300 bg-red-50 p-3 text-sm text-red-800">{state.error}</p>}
        <button className="btn w-full !py-4" disabled={pending}>{pending ? "Saving…" : init.id ? "Save changes" : "Create product"}</button>
      </div>
    </form>
  );
}
