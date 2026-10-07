// Builds the app and packages a zip ready for cPanel "Setup Node.js App" on LankaHost.
//   node scripts/build-lankahost.mjs
import { execSync } from "node:child_process";
import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "deploy");
const stage = path.join(out, "app");
const run = (c, cwd = root) => execSync(c, { cwd, stdio: "inherit" });

rmSync(out, { recursive: true, force: true });
mkdirSync(stage, { recursive: true });

run("npm run build");

const sa = path.join(root, ".next", "standalone");
if (!existsSync(path.join(sa, "server.js"))) throw new Error("standalone build missing");

// Only what the server needs at runtime (no sources, no local .env, no storage).
cpSync(path.join(sa, "server.js"), path.join(stage, "server.js"));
cpSync(path.join(sa, "package.json"), path.join(stage, "package.json"));
cpSync(path.join(sa, "node_modules"), path.join(stage, "node_modules"), { recursive: true });
cpSync(path.join(sa, ".next"), path.join(stage, ".next"), { recursive: true });
cpSync(path.join(root, ".next", "static"), path.join(stage, ".next", "static"), { recursive: true });
if (existsSync(path.join(root, "public"))) cpSync(path.join(root, "public"), path.join(stage, "public"), { recursive: true });

// Database scripts
const schema = readFileSync(path.join(root, "mysql", "schema.sql"), "utf8");
writeFileSync(path.join(out, "1-database.sql"), schema);
cpSync(path.join(root, "mysql", "seed.sql"), path.join(out, "2-demo-data-optional.sql"));

// Zip the app folder (bsdtar ships with Windows 10+)
run(`tar -a -c -f ../lanka-wear-app.zip *`, stage);
console.log("\nDone ->", path.join(out, "lanka-wear-app.zip"));
