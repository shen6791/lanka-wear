import { revalidatePath } from "next/cache";
import { exec, insertCategory, rows } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";

async function add(form: FormData) {
  "use server";
  await requireAdmin();
  const name = String(form.get("name") ?? "").trim().slice(0, 120);
  if (!name) return;
  await insertCategory(slugify(name), name, Number(form.get("sort")) || 0);
  revalidatePath("/", "layout");
}
async function del(form: FormData) {
  "use server";
  await requireAdmin();
  await exec("DELETE FROM categories WHERE id = ?", [Number(form.get("id"))]);
  revalidatePath("/", "layout");
}

export default async function Categories() {
  const cats = await rows<{ id: number; name: string; n: number }>("SELECT c.id, c.name, (SELECT COUNT(*) FROM products p WHERE p.category_id=c.id) n FROM categories c ORDER BY sort, name");
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-4xl">Categories</h1>
      <form action={add} className="flex gap-3 bg-white p-5">
        <input name="name" required placeholder="New category (e.g. Shorts)" className="field" />
        <input name="sort" type="number" placeholder="Order" className="field !w-24" />
        <button className="btn">Add</button>
      </form>
      <ul className="divide-y divide-line bg-white">
        {cats.map((c) => (
          <li key={c.id} className="flex items-center justify-between p-4 text-sm">
            <span>{c.name} <span className="text-muted-fg">· {c.n} products</span></span>
            <form action={del}><input type="hidden" name="id" value={c.id} /><button className="text-xs text-red-700 underline">Delete</button></form>
          </li>
        ))}
      </ul>
    </div>
  );
}
