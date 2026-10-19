import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  console.log("Setting up online_presence and battle_invitations tables in Neon Postgres...");

  await sql`
    CREATE TABLE IF NOT EXISTS online_presence (
      email TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar TEXT NOT NULL DEFAULT '🥷',
      status TEXT NOT NULL DEFAULT 'online',
      current_room_code TEXT,
      last_seen BIGINT NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS battle_invitations (
      id TEXT PRIMARY KEY,
      from_email TEXT NOT NULL,
      from_name TEXT NOT NULL,
      from_avatar TEXT NOT NULL DEFAULT '🥷',
      to_email TEXT NOT NULL,
      room_code TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at BIGINT NOT NULL
    );
  `;

  console.log("✓ Tables online_presence and battle_invitations ready in Neon Postgres!");
}

main().catch(console.error);
