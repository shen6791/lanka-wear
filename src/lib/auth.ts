import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "lw-admin";
const TTL_MS = 1000 * 60 * 60 * 12;

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("AUTH_SECRET must be set (16+ chars)");
  return s;
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

function safeEq(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Short signed token proving the holder came from checkout / verified tracking (guards the pay page). */
export const orderToken = (orderNo: string) => sign("order:" + orderNo).slice(0, 22);
export const validOrderToken = (orderNo: string, t?: string | null) => !!t && safeEq(t, orderToken(orderNo));

export function checkCredentials(email: string, password: string) {
  const e = process.env.ADMIN_EMAIL ?? "";
  const p = process.env.ADMIN_PASSWORD ?? "";
  if (!e || !p) return false;
  // evaluate both so timing doesn't reveal which one was wrong
  const okE = safeEq(email.trim().toLowerCase(), e.trim().toLowerCase());
  const okP = safeEq(password, p);
  return okE && okP;
}

export async function startSession() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + TTL_MS })).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_MS / 1000,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const v = (await cookies()).get(COOKIE)?.value;
  if (!v) return false;
  const [payload, sig] = v.split(".");
  if (!payload || !sig || !safeEq(sig, sign(payload))) return false;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString()).exp > Date.now();
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
