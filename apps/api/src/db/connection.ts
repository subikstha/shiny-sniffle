import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { remember } from "@epic-web/remember";
import { isProd, env } from "../../env.ts";
import * as schema from "./schema.ts";

const createPool = () => {
  return new Pool({
    connectionString: env.DATABASE_URL,
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
