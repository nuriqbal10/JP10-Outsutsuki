import { neon } from '@neondatabase/serverless';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function matchAndSync() {
  const qAudio = await sql`SELECT DISTINCT audio_r2_url FROM questions WHERE audio_r2_url IS NOT NULL`;
  const { data: supaFiles } = await supabase.storage
    .from('irodori-assets')
    .list('audio/shokyu2', { limit: 500 });
  const supaFileNames = supaFiles ? supaFiles.map((f) => f.name) : [];
  console.log(`Supabase total audio files: ${supaFileNames.length}`);

  let updated = 0;
  for (const row of qAudio) {
    const raw = row.audio_r2_url as string;
    const match = raw.match(/Z_\[(\d+-\d+)\]/);
    if (match) {
      const code = 'Z_' + match[1];
      const found = supaFileNames.find((f) => f.startsWith(code));
      if (found) {
        const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/irodori-assets/audio/shokyu2/${found}`;
        console.log(`Matching: ${raw} -> ${found}`);
        await sql`UPDATE questions SET audio_r2_url = ${publicUrl} WHERE audio_r2_url = ${raw}`;
        updated++;
      } else {
        console.warn(`NOT FOUND: ${raw} (code: ${code})`);
      }
    }
  }
  console.log(`Successfully updated ${updated} audio URLs in questions table.`);
}

matchAndSync();
