import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Configure connection caching for serverless edge runtimes
neonConfig.fetchConnectionCache = true;

let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("WARNING: DATABASE_URL is not set. Using pooled connection fallback.");
  connectionString = "postgresql://neondb_owner:npg_IfJ7lCroQ8Ky@ep-withered-hat-b3wywrji-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";
} else if (connectionString.includes(".c-4.ap-southeast-1.aws.neon.tech") && !connectionString.includes("-pooler.c-4.ap-southeast-1.aws.neon.tech")) {
  connectionString = connectionString.replace(".c-4.ap-southeast-1.aws.neon.tech", "-pooler.c-4.ap-southeast-1.aws.neon.tech");
}

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
export * from "./schema";
