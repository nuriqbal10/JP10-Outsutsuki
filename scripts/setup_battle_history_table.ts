import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  console.log("Setting up battle_match_history table and extending battle_rooms in Neon Postgres...");

  await sql`
    CREATE TABLE IF NOT EXISTS battle_match_history (
      id TEXT PRIMARY KEY,
      room_code TEXT NOT NULL,
      mode TEXT NOT NULL,
      topic_level TEXT NOT NULL,
      topic_chapter INT NOT NULL,
      topic_category TEXT NOT NULL,
      winner_email TEXT,
      winner_name TEXT,
      winner_avatar TEXT,
      winner_team TEXT,
      participants JSONB NOT NULL,
      total_questions INT NOT NULL DEFAULT 5,
      created_at BIGINT NOT NULL
    );
  `;

  await sql`
    ALTER TABLE battle_rooms ADD COLUMN IF NOT EXISTS questions JSONB;
  `;

  await sql`
    ALTER TABLE battle_rooms ADD COLUMN IF NOT EXISTS battle_log JSONB;
  `;

  console.log("✓ battle_match_history table created and battle_rooms extended successfully in Neon Postgres!");
}

main().catch(console.error);
