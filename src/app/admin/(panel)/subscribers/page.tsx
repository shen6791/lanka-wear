import { rows } from "@/lib/db";

export default async function Subscribers() {
  const list = await rows<{ id: number; email: string; created_at: Date }>("SELECT id, email, created_at FROM subscribers ORDER BY id DESC LIMIT 500");
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-4xl">Newsletter subscribers</h1>
      <p className="text-sm text-muted-fg">{list.length} subscriber{list.length === 1 ? "" : "s"}. Copy the list into your email tool of choice.</p>
      <div className="divide-y divide-line bg-white">
        {list.map((s) => (
          <div key={s.id} className="flex justify-between p-4 text-sm"><span>{s.email}</span><span className="text-muted-fg">{new Date(s.created_at).toLocaleDateString("en-GB")}</span></div>
        ))}
        {list.length === 0 && <p className="p-8 text-center text-muted-fg">No subscribers yet.</p>}
      </div>
    </div>
  );
}
