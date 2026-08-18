import dns from "node:dns";
import net from "node:net";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";
import { Pool as NodePool } from "pg";
import ws from "ws";

import { remember } from "@epic-web/remember";
import { isProd, env } from "../../env.ts";
import * as schema from "./schema.ts";

// Fix for Node 18+ Happy Eyeballs IPv6 timeout issue on Wi-Fi networks with broken IPv6 routing
dns.setDefaultResultOrder("ipv4first");
if (typeof net.setDefaultAutoSelectFamily === "function") {
  net.setDefaultAutoSelectFamily(false);
}

// Configures Neon to use the 'ws' package for node environments
neonConfig.webSocketConstructor = ws;

const isNeon = env.DATABASE_URL.includes("neon.tech");

const createPool = () => {
  const connectionString = env.DATABASE_URL.replace("localhost", "127.0.0.1");

  if (isProd() || isNeon) {
    // Uses WebSockets over Port 443 - bypasses all Wi-Fi router blocks
    return new Pool({
      connectionString,
      connectionTimeoutMillis: 15000, // Raised to 15s to let Neon wake up safely
    });
  } else {
    // Keeps standard pg local pool for local Postgres development
    return new NodePool({
      connectionString,
      connectionTimeoutMillis: 5000,
      ssl: false,
    });
  }
};

let client: Pool | NodePool;

if (isProd()) {
  client = createPool();
} else {
  client = remember("dbPool", () => createPool());
}

// Dynamically use the correct drizzle initializer based on client type
export const db =
  isProd() || isNeon
    ? drizzle({ client: client as Pool, schema })
    : drizzleNode({ client: client as NodePool, schema });

export default db;

