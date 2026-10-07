import { revalidatePath } from "next/cache";
import { upsertSetting } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getPayhere, getSettings, type Settings } from "@/lib/data";
import { baseUrl } from "@/lib/site";

type Field = [keyof Settings, string, "text" | "number" | "check"];
const GROUPS: { title: string; fields: Field[] }[] = [
  { title: "Brand", fields: [["brand_name", "Brand name", "text"], ["tagline", "Tagline", "text"], ["announcement", "Top announcement bar", "text"]] },
  { title: "Contact", fields: [["phone", "Phone", "text"], ["whatsapp", "WhatsApp number (94771234567, no + or spaces)", "text"], ["email", "Email", "text"], ["address", "Address", "text"], ["instagram", "Instagram URL", "text"], ["facebook", "Facebook URL", "text"]] },
  { title: "Delivery (LKR)", fields: [["shipping_colombo", "Colombo / Gampaha / Kalutara", "number"], ["shipping_island", "Rest of island", "number"], ["free_shipping_over", "Free delivery over (0 = never)", "number"]] },
  { title: "Bank transfer details", fields: [["bank_name", "Bank", "text"], ["bank_branch", "Branch", "text"], ["bank_account_name", "Account name", "text"], ["bank_account_no", "Account number", "text"]] },
];
const CARD_FIELDS: Field[] = [["card_enabled", "Offer card payment at checkout", "check"], ["payhere_sandbox", "Test (sandbox) mode — untick when you go live", "check"], ["payhere_merchant_id", "PayHere Merchant ID", "text"]];

async function save(form: FormData) {
  "use server";
  await requireAdmin();
  for (const [k, , type] of [...GROUPS.flatMap((g) => g.fields), ...CARD_FIELDS]) {
    const raw = type === "check" ? (form.get(k) === "on" ? "1" : "0") : String(form.get(k) ?? "").trim().slice(0, 500);
    await upsertSetting(k, raw);
  }
  // the secret is write-only: blank = keep the saved one
  const secret = String(form.get("payhere_merchant_secret") ?? "").trim().slice(0, 200);
  if (secret) await upsertSetting("payhere_merchant_secret", secret);
  revalidatePath("/", "layout");
}

export default async function SettingsPage() {
  const [s, ph, base] = await Promise.all([getSettings(), getPayhere(), baseUrl()]);
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-4xl">Settings</h1>
      <form action={save} className="space-y-6">
        {GROUPS.map((g) => (
          <section key={g.title} className="bg-white p-6">
            <h2 className="mb-4 text-2xl">{g.title}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {g.fields.map(([k, label, type]) => (
                <div key={k} className={["announcement", "address", "tagline"].includes(k) ? "sm:col-span-2" : ""}>
                  <label className="label" htmlFor={k}>{label}</label>
                  <input id={k} name={k} type={type} defaultValue={String(s[k])} className="field" />
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="bg-white p-6">
          <h2 className="mb-1 text-2xl">Card payments (PayHere)</h2>
          <p className="mb-4 text-sm text-muted-fg">
            Customers pay on PayHere&apos;s secure page; card details never touch this site. Get your Merchant ID and Merchant Secret from the PayHere dashboard
            (Settings → Domains &amp; Credentials). Status: {" "}
            <b className={ph.ready ? "text-green-700" : "text-amber-700"}>{ph.ready ? (ph.sandbox ? "ready (test mode)" : "ready (live)") : "not configured yet"}</b>
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="card_enabled" defaultChecked={s.card_enabled === 1} className="accent-[#1c1917]" /> {CARD_FIELDS[0][1]}</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="payhere_sandbox" defaultChecked={s.payhere_sandbox === 1} className="accent-[#1c1917]" /> {CARD_FIELDS[1][1]}</label>
            <div><label className="label" htmlFor="payhere_merchant_id">Merchant ID</label><input id="payhere_merchant_id" name="payhere_merchant_id" defaultValue={s.payhere_merchant_id} className="field" autoComplete="off" /></div>
            <div><label className="label" htmlFor="payhere_merchant_secret">Merchant Secret {ph.secret && <span className="normal-case tracking-normal text-green-700">· saved</span>}</label>
              <input id="payhere_merchant_secret" name="payhere_merchant_secret" type="password" placeholder={ph.secret ? "•••••••• (leave blank to keep)" : "Paste secret"} className="field" autoComplete="new-password" /></div>
          </div>
          <div className="mt-5 bg-muted p-4 text-xs leading-relaxed text-ink-soft">
            In PayHere, add this site&apos;s domain to your approved domains. Payment notifications are sent to:<br />
            <code className="font-mono text-[11px] text-ink">{base}/api/payhere/notify</code>
          </div>
        </section>
        <button className="btn">Save settings</button>
      </form>
    </div>
  );
}
