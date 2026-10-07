"use client";

import { useActionState } from "react";
import { subscribe, type SubState } from "@/app/(shop)/subscribe";

export function Newsletter() {
  const [state, action, pending] = useActionState<SubState, FormData>(subscribe, undefined);
  return (
    <section className="mx-auto mt-24 max-w-7xl px-5 md:px-8">
      <div className="bg-ink px-6 py-16 text-center text-white md:px-16">
        <p className="eyebrow">Stay in the loop</p>
        <h2 className="mt-3 text-4xl md:text-5xl">Be first to know</h2>
        <p className="mx-auto mt-4 max-w-md text-white/70">New drops, restocks and subscriber-only offers. No spam, unsubscribe anytime.</p>
        {state?.ok ? (
          <p role="status" className="mt-8 font-display text-2xl text-gold-soft">Thank you — you&apos;re on the list.</p>
        ) : (
          <form action={action} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="nl-email" className="sr-only">Email address</label>
            <input id="nl-email" name="email" type="email" required placeholder="Your email address" autoComplete="email" className="field !border-white/20 !bg-white/10 !text-white placeholder:text-white/50 focus:!border-gold-soft" />
            <button disabled={pending} className="btn btn-light shrink-0 hover:!bg-gold hover:!border-gold hover:!text-white">{pending ? "…" : "Subscribe"}</button>
          </form>
        )}
        {state?.error && <p role="alert" className="mt-3 text-sm text-red-300">{state.error}</p>}
      </div>
    </section>
  );
}
