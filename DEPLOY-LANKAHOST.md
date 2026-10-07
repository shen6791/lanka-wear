# Deploying Lanka Wear on LankaHost (cPanel)

## What you get after building
Run `node scripts/build-lankahost.mjs`. It creates the `deploy/` folder:
- `lanka-wear-app.zip` – the website (Next.js, runs under cPanel "Setup Node.js App")
- `1-database.sql` – tables (run once)
- `2-demo-data-optional.sql` – sample products & categories (skip for the real store)

## 1. Database
1. cPanel → **MySQL® Databases** → create a database and a user, give the user ALL PRIVILEGES.
2. cPanel → **phpMyAdmin** → select the database → **Import** → `1-database.sql`.
   (Optionally import `2-demo-data-optional.sql` to see sample products.)

## 2. Upload the app
1. cPanel → **File Manager** → create a folder **outside** `public_html`, e.g. `lankawear-app`.
2. Upload `lanka-wear-app.zip` into it and **Extract**.
3. Create a second folder for photos that survives updates, e.g. `/home/<cpanel-user>/lankawear-storage`.

## 3. Setup Node.js App
cPanel → **Setup Node.js App** → **Create Application**
- Node.js version: 20 or newer
- Application mode: **Production**
- Application root: `lankawear-app`
- Application URL: the domain
- Application startup file: `server.js`

Add these **environment variables**:

| Name | Value |
|---|---|
| `DATABASE_URL` | `mysql://DBUSER:DBPASSWORD@localhost:3306/DBNAME` (URL-encode special characters in the password) |
| `AUTH_SECRET` | any long random string (32+ chars) |
| `ADMIN_EMAIL` | the owner's admin login email |
| `ADMIN_PASSWORD` | a strong admin password |
| `STORAGE_DIR` | `/home/<cpanel-user>/lankawear-storage` |
| `NODE_ENV` | `production` |

Dependencies are already bundled, so do **not** run NPM Install. Click **Create**, then **Start / Restart**.

## 4. First login
Open `https://your-domain/admin` → sign in → **Settings** (brand name, phone, WhatsApp, bank account details, delivery fees) → **Categories** → **Products** (photos, sizes, colours, stock).

## Updating later
Rebuild, upload the new zip, extract over the old app folder (photos in `STORAGE_DIR` are untouched), then **Restart** in Setup Node.js App. Database changes, if any, are listed in release notes.

## Notes
- Payment slips are private (only visible when signed in to admin).
- Back up the database (cPanel → Backup) and the storage folder regularly.
