import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

// On cPanel keep this OUTSIDE the app folder so redeploys don't wipe uploads.
export const STORAGE_DIR = path.resolve(process.env.STORAGE_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), "storage"));

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
  const dir = path.join(STORAGE_DIR, folder);
  await mkdir(dir, { recursive: true });
  const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${ext}`;
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/media/${folder}/${name}`;
}
