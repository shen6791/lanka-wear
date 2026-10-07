import mysql, { type Pool } from "mysql2/promise";

const g = globalThis as unknown as { __lwPool?: Pool };

export function db(): Pool {
  if (!g.__lwPool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    g.__lwPool = mysql.createPool({
      uri: url,
      waitForConnections: true,
      connectionLimit: 8,
      decimalNumbers: true,
      charset: "utf8mb4",
      timezone: "+05:30",
    });
  }
  return g.__lwPool;
}

export async function rows<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  const [r] = await db().query(sql, params);
  return r as T[];
}

export async function one<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T | null> {
  return (await rows<T>(sql, params))[0] ?? null;
}
