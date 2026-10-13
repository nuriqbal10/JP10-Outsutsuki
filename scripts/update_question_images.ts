import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const SUPABASE_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/irodori-assets/images/shokyu2/`;

const mappings = [
  // Bab 1
  { chapter: 1, qNum: 1, file: 'bab01/Z_01_3_05_mori.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 1, qNum: 2, file: 'bab01/Z_01_3_02_kawa.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 1, qNum: 3, file: 'bab01/Z_01_3_07_sabaku.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 1, qNum: 4, file: 'bab01/Z_01_3_04_shima.png', text: '絵を見て、正しいことばを選んでください。' },

  // Bab 2
  { chapter: 2, qNum: 1, file: 'bab02/Z_02_1_05_tatsu.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 2, qNum: 2, file: 'bab02/Z_02_1_01_kamiganagai.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 2, qNum: 3, file: 'bab02/Z_02_1_03_segatakai.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 2, qNum: 4, file: 'bab02/Z_02_2_02_mago.png', text: '絵を見て、正しいことばを選んでください。' },

  // Bab 3
  { chapter: 3, qNum: 1, file: 'bab03/Z_03_2_01_niku.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 3, qNum: 2, file: 'bab03/Z_03_2_02_sakana.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 3, qNum: 3, file: 'bab03/Z_03_2_07_negi.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 3, qNum: 4, file: 'bab03/Z_03_2_03_ebikani.png', text: '絵を見て、正しいことばを選んでください。' },

  // Bab 4
  { chapter: 4, qNum: 1, file: 'bab04/Z_04_2_02_mazeru1.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 4, qNum: 2, file: 'bab04/Z_04_2_04_ireru.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 4, qNum: 3, file: 'bab04/Z_04_2_03_kakeru.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 4, qNum: 4, file: 'bab04/Z_04_2_07_muku.png', text: '絵を見て、正しいことばを選んでください。' },

  // Bab 5
  { chapter: 5, qNum: 1, file: 'bab05/Z_05_1_02_umigakiree.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 5, qNum: 2, file: 'bab05/Z_05_3_02_ryokan.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 5, qNum: 3, file: 'bab05/Z_05_3_03_minshuku.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 5, qNum: 4, file: 'bab05/Z_05_3_14_mizugi.png', text: '絵を見て、正しいことばを選んでください。' },

  // Bab 6
  { chapter: 6, qNum: 1, file: 'bab06/Z_06_1_07_zaseki.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 6, qNum: 2, file: 'bab06/Z_06_1_09_jiko.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 6, qNum: 3, file: 'bab06/Z_06_2_01_domitorii.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 6, qNum: 4, file: 'bab06/Z_06_4_09_keeburukaa.png', text: '絵を見て、正しいことばを選んでください。' },

  // Bab 7
  { chapter: 7, qNum: 1, file: 'bab07/Z_07_1_01_keejiban.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 7, qNum: 2, file: 'bab07/Z_07_2_01_gasutenken.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 7, qNum: 3, file: 'bab07/Z_07_2_04_hanabitaikai.png', text: '絵を見て、正しいことばを選んでください。' },
  { chapter: 7, qNum: 4, file: 'bab07/Z_07_4_01_bon-odorinisasou.png', text: '絵を見て、正しいことばを選んでください。' },
];

async function updateImages() {
  console.log('🔄 Memperbarui image_r2_url untuk soal bergambar Bab 1 - 7...');
  for (const m of mappings) {
    const fullUrl = SUPABASE_BASE + m.file;
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        await sql`
          UPDATE questions 
          SET image_r2_url = ${fullUrl},
              question_text = ${m.text}
          WHERE chapter = ${m.chapter} 
            AND section = 'moji_goi' 
            AND question_number = ${m.qNum}
        `;
        console.log(`✓ Bab ${m.chapter} Q${m.qNum} -> ${m.file}`);
        break;
      } catch (err: any) {
        if (attempt === 5) throw err;
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  }
  console.log('🎉 Selesai memperbarui 100% URL gambar soal di database!');
}

updateImages().catch((err) => {
  console.error('Gagal update gambar:', err);
  process.exit(1);
});
