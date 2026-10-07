/**
 * Dual-dialect database layer.
 *   mysql://...      -> MySQL / MariaDB   (LankaHost production)
 *   postgres://...   -> Postgres          (Supabase, used for the Vercel preview)
 * App SQL is written MySQL-style with `?` placeholders; arrays expand for IN (?).
 */
import mysql, { type Pool as MyPool, type PoolConnection } from "mysql2/promise";
import { Pool as PgPool, types, type PoolClient } from "pg";

export const isPg = /^postgres(ql)?:/i.test(process.env.DATABASE_URL ?? "");

// Postgres returns NUMERIC / BIGINT as strings; the app expects numbers.
types.setTypeParser(1700, (v) => parseFloat(v));
types.setTypeParser(20, (v) => parseInt(v, 10));

const g = globalThis as unknown as { __lwMy?: MyPool; __lwPg?: PgPool };

function url() {
  const u = process.env.DATABASE_URL;
  if (!u) throw new Error("DATABASE_URL is not set");
  return u;
}
const my = () =>
  (g.__lwMy ??= mysql.createPool({
    uri: url(),
    waitForConnections: true,
    connectionLimit: 8,
    decimalNumbers: true,
    charset: "utf8mb4",
    timezone: "+05:30",
  }));
const pg = () =>
  (g.__lwPg ??= new PgPool({
    connectionString: url(),
    max: Number(process.env.PG_POOL_MAX) || (process.env.VERCEL ? 3 : 8),
    ssl: /localhost|127\.0\.0\.1/.test(url()) ? undefined : { rejectUnauthorized: false },
  }));

/** Expands array params for IN (?) and converts ? -> $n for Postgres. */
function prep(sql: string, params: unknown[]): [string, unknown[]] {
  const out: unknown[] = [];
  let i = 0;
  const text = sql.replace(/\?/g, () => {
    const p = params[i++];
    if (Array.isArray(p)) {
      if (p.length === 0) {
        out.push(null);
        return isPg ? `$${out.length}` : "?";
      }
      return p
        .map((x) => {
          out.push(x);
          return isPg ? `$${out.length}` : "?";
        })
        .join(",");
    }
    out.push(p);
    return isPg ? `$${out.length}` : "?";
  });
  return [text, out];
}

export interface Tx {
  rows<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>;
  exec(sql: string, params?: unknown[]): Promise<void>;
  /** INSERT into a table with an `id` column; returns the new id. */
  insert(sql: string, params?: unknown[]): Promise<number>;
}

function pgExec(c: PgPool | PoolClient): Tx {
  return {
    async rows<T>(sql: string, params: unknown[] = []) {
      const [t, v] = prep(sql, params);
      return (await c.query(t, v)).rows as T[];
    },
    async exec(sql, params = []) {
      const [t, v] = prep(sql, params);
      await c.query(t, v);
    },
    async insert(sql, params = []) {
      const [t, v] = prep(sql, params);
      return (await c.query(`${t} RETURNING id`, v)).rows[0].id as number;
    },
  };
}

function myExec(c: MyPool | PoolConnection): Tx {
  return {
    async rows<T>(sql: string, params: unknown[] = []) {
      const [t, v] = prep(sql, params);
      const [r] = await c.query(t, v);
      return r as T[];
    },
    async exec(sql, params = []) {
      const [t, v] = prep(sql, params);
      await c.query(t, v);
    },
    async insert(sql, params = []) {
      const [t, v] = prep(sql, params);
      const [r] = await c.query(t, v);
      return (r as { insertId: number }).insertId;
    },
  };
}

const pool = (): Tx => (isPg ? pgExec(pg()) : myExec(my()));

export const rows = <T = Record<string, unknown>>(sql: string, params: unknown[] = []) => pool().rows<T>(sql, params);
export const exec = (sql: string, params: unknown[] = []) => pool().exec(sql, params);
export const insert = (sql: string, params: unknown[] = []) => pool().insert(sql, params);
export async function one<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T | null> {
  return (await rows<T>(sql, params))[0] ?? null;
}

export async function transaction<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  if (isPg) {
    const c = await pg().connect();
    try {
      await c.query("BEGIN");
      const r = await fn(pgExec(c));
      await c.query("COMMIT");
      return r;
    } catch (e) {
      await c.query("ROLLBACK").catch(() => {});
      throw e;
    } finally {
      c.release();
    }
  }
  const c = await my().getConnection();
  try {
    await c.beginTransaction();
    const r = await fn(myExec(c));
    await c.commit();
    return r;
  } catch (e) {
    await c.rollback().catch(() => {});
    throw e;
  } finally {
    c.release();
  }
}

/* ---- dialect helpers ---- */
export const LIKE = isPg ? "ILIKE" : "LIKE";
export const TODAY_SQL = isPg
  ? "(created_at AT TIME ZONE 'Asia/Colombo')::date = (now() AT TIME ZONE 'Asia/Colombo')::date"
  : "DATE(created_at)=CURDATE()";
export const THIS_MONTH_SQL = isPg
  ? "created_at >= date_trunc('month', now() AT TIME ZONE 'Asia/Colombo') AT TIME ZONE 'Asia/Colombo'"
  : "created_at >= DATE_FORMAT(NOW(),'%Y-%m-01')";

export const upsertSetting = (k: string, v: string) =>
  exec(
    isPg
      ? "INSERT INTO settings (k, v) VALUES (?, ?) ON CONFLICT (k) DO UPDATE SET v = EXCLUDED.v"
      : "INSERT INTO settings (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)",
    [k, v],
  );

export const insertCategory = (slug: string, name: string, sort: number) =>
  exec(
    isPg
      ? "INSERT INTO categories (slug, name, sort) VALUES (?, ?, ?) ON CONFLICT (slug) DO NOTHING"
      : "INSERT IGNORE INTO categories (slug, name, sort) VALUES (?, ?, ?)",
    [slug, name, sort],
  );

/** +qty back to stock for every line of an order (cancel). */
export const restockOrder = (orderId: number) =>
  exec(
    isPg
      ? "UPDATE product_variants v SET stock = v.stock + i.qty FROM order_items i WHERE i.variant_id = v.id AND i.order_id = ?"
      : "UPDATE product_variants v JOIN order_items i ON i.variant_id = v.id SET v.stock = v.stock + i.qty WHERE i.order_id = ?",
    [orderId],
  );

/** -qty from stock (order un-cancelled). */
export const unrestockOrder = (orderId: number) =>
  exec(
    isPg
      ? "UPDATE product_variants v SET stock = GREATEST(0, v.stock - i.qty) FROM order_items i WHERE i.variant_id = v.id AND i.order_id = ?"
      : "UPDATE product_variants v JOIN order_items i ON i.variant_id = v.id SET v.stock = GREATEST(0, v.stock - i.qty) WHERE i.order_id = ?",
    [orderId],
  );

export const insertSubscriber = (email: string) =>
  exec(
    isPg
      ? "INSERT INTO subscribers (email) VALUES (?) ON CONFLICT (email) DO NOTHING"
      : "INSERT IGNORE INTO subscribers (email) VALUES (?)",
    [email],
  );
