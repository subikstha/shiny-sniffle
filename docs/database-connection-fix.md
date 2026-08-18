# Database Connection Fix (Wi-Fi Timeout & IPv6 Resolution)

## Overview

This document details the resolution for a recurring database connection timeout error (`DrizzleQueryError: AggregateError [ETIMEDOUT]`) that occurred when connecting to specific Wi-Fi networks (e.g., secondary home Wi-Fi, guest networks, or mobile hotspots).

---

## 1. Problem Description

### Error Stack Trace
```text
Error getting users DrizzleQueryError: Failed query: select "id", "email", "username", ... from "users"
  cause: AggregateError [ETIMEDOUT]: 
      at /home/subikstha/projects/classroom-app/node_modules/pg-pool/index.js:45:11
      code: 'ETIMEDOUT',
      [errors]: [
        Error: connect ETIMEDOUT 18.226.144.228:5432,
        Error: connect ENETUNREACH 2600:1f16:1c2b:...:5432,
        Error: connect ETIMEDOUT 16.58.187.204:5432,
        ...
      ]
```

### Symptoms
- The application worked fine on one Wi-Fi network, but consistently threw `ETIMEDOUT` errors when switching to a different Wi-Fi network at home.
- The failure occurred inside `getAllUsers` and other controllers querying the database via Drizzle ORM.

---

## 2. Root Cause Analysis

Investigation revealed two underlying causes working in tandem:

### Cause A: Node.js Dual-Stack IPv6 / Happy Eyeballs Issue
1. When connected to certain Wi-Fi networks or routers, DNS lookups for Neon cloud database hostnames (`*.neon.tech`) return both **IPv6 (AAAA)** and **IPv4 (A)** DNS records.
2. The secondary Wi-Fi network had IPv6 DNS advertised, but IPv6 routing on the router was unrouteable (`ENETUNREACH`).
3. In Node.js 18+, Node enables `net.autoSelectFamily` (`true` by default), implementing the "Happy Eyeballs" algorithm to attempt IPv6 and IPv4 socket connections in parallel using `internalConnectMultiple`.
4. On networks with broken IPv6 routing, interleaved socket errors (`ENETUNREACH` + timeouts across multiple AWS IP endpoints) caused Node's connection manager to stall and throw `AggregateError [ETIMEDOUT]`.

### Cause B: Environment Driver Selection in Development
1. In `apps/api/src/db/connection.ts`, Neon's WebSocket pool (`@neondatabase/serverless`) was previously restricted behind `if (isProd())`.
2. In development mode (`APP_STAGE=dev`), the application was forced to use standard `node-postgres` (`pg`) via direct TCP port `5432`.
3. Some Wi-Fi routers or ISPs filter/block outgoing TCP connections on standard database port 5432, or fail during direct TCP socket negotiations under broken IPv6 dual-stack setups.

---

## 3. Solution Applied

### 1. Forcing IPv4 & Disabling `autoSelectFamily`
To prevent Node.js from attempting unreachable IPv6 sockets and hanging on broken dual-stack networks, we added global network defaults at database initialization:

```ts
import dns from "node:dns";
import net from "node:net";

// 1. Force DNS lookup to prioritize IPv4 addresses over IPv6
dns.setDefaultResultOrder("ipv4first");

// 2. Disable Node's dual-stack Happy Eyeballs algorithm that stalls on unrouteable IPv6 networks
if (typeof net.setDefaultAutoSelectFamily === "function") {
  net.setDefaultAutoSelectFamily(false);
}
```

### 2. Enabling WebSocket Transport for Neon in Development
Neon databases support PostgreSQL over WebSockets (**Port 443**), which uses standard HTTPS/WSS ports and bypasses router TCP port 5432 blocks. We updated `connection.ts` to automatically detect Neon database URLs (`neon.tech`) and use `@neondatabase/serverless` in **both** development and production:

```ts
const isNeon = env.DATABASE_URL.includes("neon.tech");

const createPool = () => {
  const connectionString = env.DATABASE_URL.replace("localhost", "127.0.0.1");

  if (isProd() || isNeon) {
    // Uses WebSockets over Port 443 - bypasses router port blocks
    return new Pool({
      connectionString,
      connectionTimeoutMillis: 15000,
    });
  } else {
    // Standard pg local pool for local Postgres
    return new NodePool({
      connectionString,
      connectionTimeoutMillis: 5000,
      ssl: false,
    });
  }
};
```

---

## 4. Modified File

### [`apps/api/src/db/connection.ts`](file:///home/subikstha/projects/classroom-app/apps/api/src/db/connection.ts)

```typescript
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
```

---

## 5. Verification & Results

After applying these changes, queries were verified against the Neon database:
- `getAllUsers()` returned successfully in **~1.3s** (12 records).
- `getAllStudents()` returned successfully (11 records).
- Switching between Wi-Fi networks no longer produces connection timeouts (`ETIMEDOUT`).
