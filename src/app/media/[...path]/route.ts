import { readFile } from "fs/promises";
import path from "path";
import { MIME_BY_EXT, STORAGE_DIR } from "@/lib/storage";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await ctx.params;
  if (parts.length !== 2 || !["products", "slips"].includes(parts[0])) return new Response("Not found", { status: 404 });
  const file = path.basename(parts[1]);
  const ext = path.extname(file).slice(1).toLowerCase();
  const type = MIME_BY_EXT[ext];
  if (!type) return new Response("Not found", { status: 404 });
  // payment slips are private
  if (parts[0] === "slips" && !(await isAdmin())) return new Response("Forbidden", { status: 403 });
  try {
    const data = await readFile(path.join(STORAGE_DIR, parts[0], file));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": type,
        "Cache-Control": parts[0] === "products" ? "public, max-age=2592000, immutable" : "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
