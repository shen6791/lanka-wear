"use server";

import { insertSubscriber } from "@/lib/db";

export type SubState = { ok?: boolean; error?: string } | undefined;

export async function subscribe(_prev: SubState, form: FormData): Promise<SubState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 190);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "Please enter a valid email address." };
  try {
    await insertSubscriber(email);
  } catch (e) {
    console.error("subscribe failed", e);
    return { error: "Couldn't subscribe right now. Please try again." };
  }
  return { ok: true };
}
