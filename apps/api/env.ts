import { env as loadEnv } from "custom-env";
import { z } from "zod";

process.env.APP_STAGE = process.env.APP_STAGE || "dev";

const isProduction = process.env.APP_STAGE === "production";
const isDevelopment = process.env.APP_STAGE === "dev";
const isTesting = process.env.APP_STAGE === "test";

if (isDevelopment) {
  loadEnv();
} else {
  loadEnv("test");
}

const envSchema = z.object({
  APP_STAGE: z.enum(["dev", "test", "production"]).default("dev"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().positive().default(3005),
  DATABASE_URL: z
    .string({ message: "Database URL is required" })
    .startsWith("postgresql://"),
  BCRYPT_ROUNDS: z.coerce.number().min(10).max(20).default(12),
  JWT_SECRET: z.string().min(32, "Must be 32 chars"),
  JWT_EXPIRES_IN: z.string().default("7d"),
});

export type Env = z.infer<typeof envSchema>;
let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (e) {
  if (e instanceof z.ZodError) {
    console.log("Invalid env var");
    console.error(JSON.stringify(e.flatten().fieldErrors, null, 2));

    e.issues.forEach((err) => {
      const path = err.path.join(".");
      console.log(`${path}: ${err.message}`);
    });

    process.exit(1); // Stop the server with an error, 1 means error, and 0 means no error
  }

  throw e;
}

export const isProd = () => env.APP_STAGE === "production";
export const isDev = () => env.APP_STAGE === "dev";
export const isTest = () => env.APP_STAGE === "test";

export { env };
export default env;
