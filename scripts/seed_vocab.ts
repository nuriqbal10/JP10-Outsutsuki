import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { vocabularies } from "../src/db/schema";

dotenv.config({ path: ".env.local" });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("ERROR: DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const sql = neon(dbUrl);
const db = drizzle(sql);

async function seed() {
  console.log("🌸 Memulai Seeding Kosakata ke Neon PostgreSQL...");

  const dataPath = path.resolve(__dirname, "../../Flashcard Kosakata/vocab_irodori_all_data.json");
  if (!fs.existsSync(dataPath)) {
    console.error(`File data tidak ditemukan di: ${dataPath}`);
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const levels = ["A1", "A2.1", "A2.2"];
  let totalInserted = 0;

  for (const lvl of levels) {
    const chapters = raw.levels[lvl] || [];
    console.log(`\nMemproses Level ${lvl} (${chapters.length} Bab)...`);

    for (const ch of chapters) {
      const words = ch.words || [];
      if (words.length === 0) continue;

      const batch = words.map((w: any) => ({
        level: w.level || lvl,
        chapter: Number(w.chapter) || ch.chapter,
        midashi: w.midashi,
        yomi: w.yomi,
        accent: w.accent || null,
        romaji: w.romaji || null,
        idArti: w.id_arti,
        enMeaning: w.en || null,
        pos: w.pos || "N",
        info: w.info || null,
        audioR2Url: null,
      }));

      // Insert in chunks of 50 to respect serverless statement sizes
      for (let i = 0; i < batch.length; i += 50) {
        const chunk = batch.slice(i, i + 50);
        await db.insert(vocabularies).values(chunk);
      }

      totalInserted += words.length;
      console.log(`  ✓ Bab ${ch.chapter}: Berhasil memasukkan ${words.length} kata`);
    }
  }

  console.log(`\n🎉 SEEDING SELESAI! Total ${totalInserted} kosakata resmi IRODORI berhasil diimpor ke Neon.`);
}

seed().catch(err => {
  console.error("Gagal melakukan seeding:", err);
  process.exit(1);
});
