import { db } from "../src/db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Checking / creating battle_rooms table in Neon Postgres...");
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS battle_rooms (
      id TEXT PRIMARY KEY,
      mode TEXT NOT NULL,
      room_code TEXT NOT NULL,
      required_count INT NOT NULL,
      status TEXT NOT NULL,
      countdown_seconds INT NOT NULL,
      topic_level TEXT NOT NULL,
      topic_chapter INT NOT NULL,
      topic_category TEXT NOT NULL,
      participants JSONB NOT NULL DEFAULT '[]'::jsonb,
      updated_at BIGINT NOT NULL,
      created_at BIGINT NOT NULL
    );
  `);
  console.log("✓ Table battle_rooms is ready in Neon Postgres!");
}

main().catch(console.error);
