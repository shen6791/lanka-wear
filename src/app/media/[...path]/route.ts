import path from "path";
import { MIME_BY_EXT, readStored } from "@/lib/storage";
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
  const data = await readStored(parts[0], file);
  if (!data) return new Response("Not found", { status: 404 });
  return new Response(data as BodyInit, {
    headers: {
      "Content-Type": type,
      "Cache-Control": parts[0] === "products" ? "public, max-age=2592000, immutable" : "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
