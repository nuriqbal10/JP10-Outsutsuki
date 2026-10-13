import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Configure connection caching for serverless edge runtimes
neonConfig.fetchConnectionCache = true;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("WARNING: DATABASE_URL is not set. Database queries will fail.");
}

const sql = neon(connectionString || "postgresql://placeholder:placeholder@localhost/neondb");

export const db = drizzle(sql, { schema });
export * from "./schema";
