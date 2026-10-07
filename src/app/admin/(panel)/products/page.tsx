import Link from "next/link";
import { rows } from "@/lib/db";
import { lkr } from "@/lib/format";
import { ProductImage } from "@/components/product-image";

export default async function Products() {
  const list = await rows<{ id: number; name: string; price: number; is_active: number; category: string | null; stock: number; image: string | null }>(
    `SELECT p.id, p.name, p.price, p.is_active, c.name category,
       (SELECT COALESCE(SUM(stock),0) FROM product_variants v WHERE v.product_id=p.id) stock,
       (SELECT url FROM product_images i WHERE i.product_id=p.id ORDER BY sort,id LIMIT 1) image
     FROM products p LEFT JOIN categories c ON c.id=p.category_id ORDER BY p.id DESC`,
  );
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-4xl">Products</h1><Link href="/admin/products/new" className="btn">+ New product</Link></div>
      <div className="overflow-x-auto bg-white">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wider text-muted-fg"><tr><th className="p-4">Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr></thead>
          <tbody className="divide-y divide-line">
            {list.map((p) => (
              <tr key={p.id} className="hover:bg-muted/50">
                <td className="p-3"><Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 font-medium hover:text-gold">
                  <span className="block h-14 w-11 shrink-0 overflow-hidden bg-muted"><ProductImage src={p.image} name={p.name} /></span>{p.name}</Link></td>
                <td>{p.category ?? "—"}</td><td>{lkr(p.price)}</td>
                <td className={p.stock <= 0 ? "font-semibold text-red-700" : ""}>{p.stock}</td>
                <td>{p.is_active ? "Live" : <span className="text-muted-fg">Hidden</span>}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={5} className="p-10 text-center text-muted-fg">No products yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
