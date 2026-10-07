import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

/**
 * Two backends:
 *  - Supabase Storage (Vercel preview): set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (private bucket, served via /media)
 *  - Local disk (LankaHost): STORAGE_DIR, keep it OUTSIDE the app folder so redeploys don't wipe uploads.
 */
export const STORAGE_DIR = path.resolve(process.env.STORAGE_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), "storage"));

const SB_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || "lanka-wear";
const useSupabase = !!(SB_URL && SB_KEY);

const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

export const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  pdf: "application/pdf",
};

/** Saves an uploaded File and returns its public URL, or null if rejected. */
export async function saveUpload(file: File, folder: "products" | "slips", opts: { pdf?: boolean; maxMB?: number } = {}) {
  const ext = TYPES[file.type];
  if (!ext || (ext === "pdf" && !opts.pdf)) return null;
  if (file.size === 0 || file.size > (opts.maxMB ?? 6) * 1024 * 1024) return null;
  const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${ext}`;
  const data = Buffer.from(await file.arrayBuffer());

  if (useSupabase) {
    const r = await fetch(`${SB_URL}/storage/v1/object/${BUCKET}/${folder}/${name}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${SB_KEY}`, "Content-Type": file.type, "x-upsert": "false" },
      body: new Uint8Array(data),
    });
    if (!r.ok) {
      console.error("supabase upload failed", r.status, await r.text());
      return null;
    }
  } else {
    const dir = path.join(STORAGE_DIR, folder);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), data);
  }
  return `/media/${folder}/${name}`;
}

/** Reads a stored file; null if missing. */
export async function readStored(folder: string, file: string): Promise<Uint8Array | null> {
  if (useSupabase) {
    const r = await fetch(`${SB_URL}/storage/v1/object/${BUCKET}/${folder}/${file}`, { headers: { Authorization: `Bearer ${SB_KEY}` } });
    return r.ok ? new Uint8Array(await r.arrayBuffer()) : null;
  }
  try {
    return new Uint8Array(await readFile(path.join(STORAGE_DIR, folder, file)));
  } catch {
    return null;
  }
}
