import type { Metadata } from "next";
import { getPayhere, getSettings } from "@/lib/data";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = { title: "Checkout" };

export default async function Checkout() {
  const [s, ph] = await Promise.all([getSettings(), getPayhere()]);
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-16">
      <p className="eyebrow">Almost there</p>
      <h1 className="mb-8 mt-2 text-4xl md:mb-12 md:text-6xl">Checkout</h1>
      <CheckoutForm
        cfg={{
          colombo: s.shipping_colombo,
          island: s.shipping_island,
          freeOver: s.free_shipping_over,
          bankName: s.bank_name,
          bankBranch: s.bank_branch,
          accName: s.bank_account_name,
          accNo: s.bank_account_no,
          cardEnabled: ph.enabled,
        }}
      />
    </div>
  );
}
