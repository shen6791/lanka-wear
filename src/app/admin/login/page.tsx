import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { checkCredentials, isAdmin, startSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };
export const dynamic = "force-dynamic";

// naive in-memory throttle: 8 attempts / 10 min per IP+process
const attempts = new Map<string, { n: number; t: number }>();

async function login(form: FormData) {
  "use server";
  const { headers } = await import("next/headers");
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  const a = attempts.get(ip);
  const now = Date.now();
  if (a && now - a.t < 600_000 && a.n >= 8) redirect("/admin/login?error=wait");
  if (!checkCredentials(String(form.get("email") ?? ""), String(form.get("password") ?? ""))) {
    attempts.set(ip, { n: a && now - a.t < 600_000 ? a.n + 1 : 1, t: a && now - a.t < 600_000 ? a.t : now });
    redirect("/admin/login?error=1");
  }
  attempts.delete(ip);
  await startSession();
  redirect("/admin");
}

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const err = (await searchParams).error;
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <form action={login} className="w-full max-w-sm space-y-5 bg-background p-8">
        <p className="font-display text-3xl uppercase tracking-[0.25em]">Admin</p>
        <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" required autoComplete="username" className="field" /></div>
        <div><label className="label" htmlFor="password">Password</label><input id="password" name="password" type="password" required autoComplete="current-password" className="field" /></div>
        {err && <p role="alert" className="text-sm text-red-700">{err === "wait" ? "Too many attempts. Try again in a few minutes." : "Incorrect email or password."}</p>}
        <button className="btn w-full">Sign in</button>
      </form>
    </div>
  );
}
