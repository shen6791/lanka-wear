import Link from "next/link";
import { notFound } from "next/navigation";
import { one, rows } from "@/lib/db";
import { ProductForm } from "@/components/product-form";
import { deleteProduct } from "../actions";

type P = { id: number; slug: string; name: string; description: string | null; price: number; compare_price: number | null; category_id: number | null; is_active: number; is_featured: number; is_new: number };

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const p = await one<P>("SELECT * FROM products WHERE id = ?", [id]);
  if (!p) notFound();
  const [cats, variants, images] = await Promise.all([
    rows<{ id: number; name: string }>("SELECT id, name FROM categories ORDER BY sort, name"),
    rows<{ id: number; size: string; color: string; color_hex: string; stock: number }>("SELECT id,size,color,color_hex,stock FROM product_variants WHERE product_id=? ORDER BY color,id", [id]),
    rows<{ id: number; url: string }>("SELECT id,url FROM product_images WHERE product_id=? ORDER BY sort,id", [id]),
  ]);
  return (
    <div className="space-y-6">
      <Link href="/admin/products" className="text-xs underline">← Products</Link>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl">{p.name}</h1>
        <div className="flex gap-4 text-sm"><Link href={`/product/${p.slug}`} target="_blank" className="underline">View in store ↗</Link></div>
      </div>
      <ProductForm cats={cats} init={{ id: p.id, name: p.name, description: p.description ?? "", price: p.price, compare_price: p.compare_price ?? "", category_id: p.category_id ?? "", is_active: !!p.is_active, is_featured: !!p.is_featured, is_new: !!p.is_new, variants, images }} />
      <form action={deleteProduct} className="pt-6">
        <input type="hidden" name="id" value={p.id} />
        <button className="text-sm text-red-700 underline">Delete this product permanently</button>
        <p className="mt-1 text-xs text-muted-fg">Tip: untick “Visible in store” to hide it instead. Past orders keep their item details either way.</p>
      </form>
    </div>
  );
}
