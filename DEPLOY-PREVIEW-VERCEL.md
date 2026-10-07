# Vercel + Supabase preview

Live preview: https://lanka-wear.vercel.app  (admin: /admin, login in `PREVIEW-CREDENTIALS.local.txt`, not committed)

- **Database:** Supabase project `nexora-pos`, but in its own isolated schema `lankawear`, accessed by the restricted role
  `lankawear_app` (cannot read any POS tables). Connection uses the pooler (port 6543). Schema: `supabase/schema.sql`, demo data: `supabase/seed.sql`.
- **Photos / payment slips:** stored in the `media_files` table (no Supabase service key is used, so the preview cannot touch POS storage).
  Vercel request bodies are capped at ~4.5 MB, so upload smaller photos on the preview. LankaHost has no such cap.
- **Env vars on Vercel (Production):** DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD.
- **Redeploy:** `npx vercel deploy --prod --yes` from this folder.
- The same code runs on LankaHost with a MySQL `DATABASE_URL`; the DB layer picks the dialect from the URL.

- **Sample catalogue:** 18 products with stock photography from Unsplash (free licence, hot-linked; choices in `scripts/photos.json`, seed via `node scripts/gen-seed.mjs`). Replace with the brand's own photos in /admin before launch.
- **Card payments:** PayHere. Enter credentials in /admin → Settings. Existing Supabase DBs need `supabase/migrations/002-card-payments.sql` (already applied to the preview).
- Existing DBs need `supabase/migrations/003-subscribers.sql` (newsletter table; applied to the preview).
