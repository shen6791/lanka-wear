"use client";

import { useEffect, useRef } from "react";

/** Posts the signed payment request to PayHere automatically; the button is a fallback. */
export function PayRedirect({ action, fields }: { action: string; fields: Record<string, string> }) {
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const t = setTimeout(() => ref.current?.submit(), 600);
    return () => clearTimeout(t);
  }, []);
  return (
    <form ref={ref} method="post" action={action}>
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <button className="btn w-full !py-4">Pay securely now</button>
    </form>
  );
}
