"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { exec, transaction } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { saveUpload } from "@/lib/storage";

export type ProductState = { error?: string } | undefined;
type VariantIn = { id?: number; size: string; color: string; color_hex: string; stock: number };

export async function saveProduct(_prev: ProductState, form: FormData): Promise<ProductState> {
  await requireAdmin();
  const id = Number(form.get("id")) || 0;
  const name = String(form.get("name") ?? "").trim().slice(0, 200);
  const price = Number(form.get("price"));
  const compareRaw = String(form.get("compare_price") ?? "").trim();
  const compare = compareRaw ? Number(compareRaw) : null;
  if (name.length < 2) return { error: "Product name is required." };
  if (!(price > 0)) return { error: "Enter a valid price." };
  if (compare !== null && !(compare > 0)) return { error: "Compare-at price is invalid." };

  let variants: VariantIn[];
  try {
    variants = (JSON.parse(String(form.get("variants") ?? "[]")) as VariantIn[]).map((v) => ({
      id: v.id ? Number(v.id) : undefined,
      size: String(v.size ?? "").trim().slice(0, 30),
      color: String(v.color ?? "").trim().slice(0, 60),
      color_hex: /^#[0-9a-fA-F]{3,8}$/.test(v.color_hex ?? "") ? v.color_hex : "",
      stock: Math.max(0, Math.floor(Number(v.stock) || 0)),
    }));
  } catch {
    return { error: "Variants could not be read." };
  }
  variants = variants.filter((v) => v.size);
  if (variants.length === 0) return { error: "Add at least one size." };
  const seen = new Set<string>();
  for (const v of variants) {
    const k = `${v.size.toLowerCase()}|${v.color.toLowerCase()}`;
    if (seen.has(k)) return { error: `Duplicate variant: ${v.color} ${v.size}.` };
    seen.add(k);
  }

  const files = form.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const urls: string[] = [];
  for (const f of files) {
    const u = await saveUpload(f, "products");
    if (!u) return { error: `"${f.name}" must be a JPG, PNG or WebP under 6 MB.` };
    urls.push(u);
  }

  const catId = Number(form.get("category_id")) || null;
  const flags = [form.get("is_active") === "on" ? 1 : 0, form.get("is_featured") === "on" ? 1 : 0, form.get("is_new") === "on" ? 1 : 0];
  const description = String(form.get("description") ?? "").trim().slice(0, 4000) || null;

  let pid = id;
  try {
    pid = await transaction(async (tx) => {
      let productId = id;
      if (id) {
        await tx.exec(
          "UPDATE products SET name=?, description=?, price=?, compare_price=?, category_id=?, is_active=?, is_featured=?, is_new=? WHERE id=?",
          [name, description, price, compare, catId, ...flags, id],
        );
      } else {
        let slug = slugify(name);
        if ((await tx.rows("SELECT 1 FROM products WHERE slug = ?", [slug])).length) slug += "-" + Math.random().toString(36).slice(2, 6);
        productId = await tx.insert(
          "INSERT INTO products (slug,name,description,price,compare_price,category_id,is_active,is_featured,is_new) VALUES (?,?,?,?,?,?,?,?,?)",
          [slug, name, description, price, compare, catId, ...flags],
        );
      }

      // variants: update existing, insert new, delete removed
      const keep = variants.filter((v) => v.id).map((v) => v.id!);
      if (id) {
        if (keep.length) await tx.exec("DELETE FROM product_variants WHERE product_id=? AND id NOT IN (?)", [productId, keep]);
        else await tx.exec("DELETE FROM product_variants WHERE product_id=?", [productId]);
      }
      for (const v of variants) {
        if (v.id)
          await tx.exec("UPDATE product_variants SET size=?, color=?, color_hex=?, stock=? WHERE id=? AND product_id=?", [v.size, v.color, v.color_hex, v.stock, v.id, productId]);
        else await tx.exec("INSERT INTO product_variants (product_id,size,color,color_hex,stock) VALUES (?,?,?,?,?)", [productId, v.size, v.color, v.color_hex, v.stock]);
      }

      const remove = form.getAll("remove_image").map(Number).filter(Boolean);
      if (remove.length) await tx.exec("DELETE FROM product_images WHERE product_id=? AND id IN (?)", [productId, remove]);
      if (urls.length) {
        let sort = Number((await tx.rows<{ m: number }>("SELECT COALESCE(MAX(sort),0) m FROM product_images WHERE product_id=?", [productId]))[0].m);
        for (const u of urls) await tx.exec("INSERT INTO product_images (product_id,url,sort) VALUES (?,?,?)", [productId, u, ++sort]);
      }
      return productId;
    });
  } catch (e) {
    console.error("saveProduct failed", e);
    return { error: "Could not save (a size/colour combination may be duplicated)." };
  }
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProduct(form: FormData) {
  await requireAdmin();
  await exec("DELETE FROM products WHERE id = ?", [Number(form.get("id"))]);
  revalidatePath("/", "layout");
  redirect("/admin/products");
}
