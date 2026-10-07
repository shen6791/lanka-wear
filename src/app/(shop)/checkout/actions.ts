"use server";

import { redirect } from "next/navigation";
import { getSettings } from "@/lib/data";
import { createOrder, OrderError, type CartLine } from "@/lib/orders";
import { saveUpload } from "@/lib/storage";
import { DISTRICTS, isLkMobile, normalizePhone } from "@/lib/format";

export type CheckoutState = { error?: string } | undefined;

const str = (f: FormData, k: string, max: number) => String(f.get(k) ?? "").trim().slice(0, max);

export async function placeOrder(_prev: CheckoutState, form: FormData): Promise<CheckoutState> {
  let lines: CartLine[];
  try {
    lines = JSON.parse(String(form.get("cart") ?? "[]"));
    if (!Array.isArray(lines)) throw new Error();
  } catch {
    return { error: "Your cart could not be read. Please refresh and try again." };
  }

  const name = str(form, "name", 160);
  const phone = str(form, "phone", 30);
  const email = str(form, "email", 190);
  const address = str(form, "address", 400);
  const city = str(form, "city", 120);
  const district = str(form, "district", 60);
  const notes = str(form, "notes", 600);
  const payment = form.get("payment") === "bank" ? "bank" : "cod";

  if (name.length < 2) return { error: "Please enter your full name." };
  if (!isLkMobile(phone)) return { error: "Enter a valid Sri Lankan mobile number (e.g. 0771234567)." };
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "That email address doesn't look right." };
  if (address.length < 5) return { error: "Please enter your delivery address." };
  if (city.length < 2) return { error: "Please enter your city / town." };
  if (!(DISTRICTS as readonly string[]).includes(district)) return { error: "Please choose a district." };

  let slipUrl: string | null = null;
  const slip = form.get("slip");
  if (payment === "bank" && slip instanceof File && slip.size > 0) {
    slipUrl = await saveUpload(slip, "slips", { pdf: true });
    if (!slipUrl) return { error: "Payment slip must be a JPG, PNG, WebP or PDF under 6 MB." };
  }

  let orderNo: string;
  try {
    ({ orderNo } = await createOrder(
      lines.map((l) => ({ variantId: Number(l.variantId), qty: Number(l.qty) })),
      { name, phone: normalizePhone(phone), email: email || null, address, city, district, notes: notes || null, payment, slipUrl },
      await getSettings(),
    ));
  } catch (e) {
    if (e instanceof OrderError) return { error: e.message };
    console.error("placeOrder failed", e);
    return { error: "Something went wrong placing your order. Please try again." };
  }
  redirect(`/order/${orderNo}?new=1`);
}
