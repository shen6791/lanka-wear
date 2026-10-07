import { rows } from "@/lib/db";
import { ProductForm } from "@/components/product-form";

export default async function NewProduct() {
  const cats = await rows<{ id: number; name: string }>("SELECT id, name FROM categories ORDER BY sort, name");
  return (
    <div className="space-y-6">
      <h1 className="text-4xl">New product</h1>
      <ProductForm cats={cats} init={{ name: "", description: "", price: "", compare_price: "", category_id: "", is_active: true, is_featured: false, is_new: true, variants: [], images: [] }} />
    </div>
  );
}
