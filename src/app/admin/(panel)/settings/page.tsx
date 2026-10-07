import { revalidatePath } from "next/cache";
import { upsertSetting } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getSettings, type Settings } from "@/lib/data";

const GROUPS: { title: string; fields: [keyof Settings, string, "text" | "number"][] }[] = [
  { title: "Brand", fields: [["brand_name", "Brand name", "text"], ["tagline", "Tagline", "text"], ["announcement", "Top announcement bar", "text"]] },
  { title: "Contact", fields: [["phone", "Phone", "text"], ["whatsapp", "WhatsApp number (94771234567, no + or spaces)", "text"], ["email", "Email", "text"], ["address", "Address", "text"], ["instagram", "Instagram URL", "text"], ["facebook", "Facebook URL", "text"]] },
  { title: "Delivery (LKR)", fields: [["shipping_colombo", "Colombo / Gampaha / Kalutara", "number"], ["shipping_island", "Rest of island", "number"], ["free_shipping_over", "Free delivery over (0 = never)", "number"]] },
  { title: "Bank transfer details", fields: [["bank_name", "Bank", "text"], ["bank_branch", "Branch", "text"], ["bank_account_name", "Account name", "text"], ["bank_account_no", "Account number", "text"]] },
];

async function save(form: FormData) {
  "use server";
  await requireAdmin();
  const keys = GROUPS.flatMap((g) => g.fields.map((f) => f[0]));
  for (const k of keys) {
    const v = String(form.get(k) ?? "").trim().slice(0, 500);
    await upsertSetting(k, v);
  }
  revalidatePath("/", "layout");
}

export default async function SettingsPage() {
  const s = await getSettings();
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-4xl">Settings</h1>
      <form action={save} className="space-y-6">
        {GROUPS.map((g) => (
          <section key={g.title} className="bg-white p-6">
            <h2 className="mb-4 text-2xl">{g.title}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {g.fields.map(([k, label, type]) => (
                <div key={k} className={type === "text" && ["announcement", "address", "tagline"].includes(k) ? "sm:col-span-2" : ""}>
                  <label className="label" htmlFor={k}>{label}</label>
                  <input id={k} name={k} type={type} defaultValue={String(s[k])} className="field" />
                </div>
              ))}
            </div>
          </section>
        ))}
        <button className="btn">Save settings</button>
      </form>
    </div>
  );
}
