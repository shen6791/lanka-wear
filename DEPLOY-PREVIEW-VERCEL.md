# Vercel + Supabase preview

The live preview runs on Vercel with a Postgres database on Supabase. The same code runs on MySQL for a cPanel host (see `DEPLOY-LANKAHOST.md`); the database layer picks the dialect from `DATABASE_URL`.

- **Database:** Postgres. Schema in `supabase/schema.sql`, demo data in `supabase/seed.sql`, later changes in `supabase/migrations/`. The tables live in their own schema with a restricted database user, because the Supabase project is shared with another app.
- **Photos and payment slips:** stored in the `media_files` table, so no Supabase service key is needed. Vercel caps request bodies at about 4.5 MB, so use smaller photos on the preview. A cPanel host has no such cap and stores uploads on disk (`STORAGE_DIR`).
- **Environment variables (Production):** `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
- **Redeploy:** `npx vercel deploy --prod --yes`.
- **Demo catalogue:** 18 products using free stock photography from Unsplash, linked directly. Choices are in `scripts/photos.json`; rebuild the seed files with `node scripts/gen-seed.mjs`. Replace them with the brand's own photos in the admin before launch.
- **Card payments:** PayHere. Add the merchant ID and secret under Admin → Settings.
