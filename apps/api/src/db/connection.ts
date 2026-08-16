import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { remember } from "@epic-web/remember";
import { isProd, env } from "../../env.ts";
import * as schema from "./schema.ts";

const createPool = () => {
  // 1. Force IPv4 address if using local host
  const connectionString = env.DATABASE_URL.replace("localhost", "127.0.0.1");
  return new Pool({
    connectionString,
    // 2. Set explicit connection timeout so it fails fast (5s) rather than hanging
    connectionTimeoutMillis: 5000,
    // 3. Required for hosted DBs (Neon, Supabase, Render, Aven, RDS)
    ssl: isProd() ? { rejectUnauthorized: false } : false,
  });
};

let client;

if (isProd()) {
  // No need to account for memory leak due to HMR
  client = createPool();
} else {
  client = remember("dbPool", () => createPool()); // This creates a singleton, which is essentially a cached version of some value, so that you always reuse the value but not create a new one, adding it to global
}

export const db = drizzle({ client, schema });

export default db;
