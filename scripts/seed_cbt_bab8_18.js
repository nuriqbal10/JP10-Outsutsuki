const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL tidak ditemukan di .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

console.log('=== MEMULAI SEEDING CBT JFT-BASIC A2 BAB 8 S.D. BAB 18 ===\n');

// Convert 1-based index (1, 2, 3, 4) to 'a', 'b', 'c', 'd'
function toKey(ans) {
  if (typeof ans === 'string') return ans.toLowerCase();
  const map = { 1: 'a', 2: 'b', 3: 'c', 4: 'd' };
  return map[ans] || 'a';
}

// Format audio URL to standard public path
function formatAudio(ch, audioUrl) {
  if (!audioUrl) return null;
  if (audioUrl.startsWith('http')) return audioUrl;
  const filename = audioUrl.split('/').pop();
  return `/lkpd/bab${ch}/audio/${filename}`;
}

async function runSeed() {
  const chapters = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  let totalInserted = 0;

  for (const ch of chapters) {
    console.log(`\n--- Memproses Bab ${ch} ---`);
    const lkpdPath = path.join(__dirname, '..', 'public', 'lkpd', `bab${ch}`, 'data-soal.js');

    if (!fs.existsSync(lkpdPath)) {
      console.warn(`File data-soal.js Bab ${ch} tidak ditemukan di ${lkpdPath}`);
      continue;
    }

    // Load LKPD_DATA in sandbox
    const content = fs.readFileSync(lkpdPath, 'utf8');
    const sandbox = { window: {} };
    const vm = require('vm');
    vm.createContext(sandbox);
    vm.runInContext(content, sandbox);

    const lkpdData = sandbox.window.LKPD_DATA;
    if (!lkpdData || !lkpdData.tabs) {
      console.warn(`Data LKPD Bab ${ch} kosong.`);
      continue;
    }

    // Cari tabs
    const mojiTab = lkpdData.tabs.find(t => t.id === 'moji');
    const kaiwaTab = lkpdData.tabs.find(t => t.id === 'kaiwa');
    const choukaiTab = lkpdData.tabs.find(t => t.id === 'choikai');
    const dokkaiTab = lkpdData.tabs.find(t => t.id === 'dokkai');
    const kanjiTab = lkpdData.tabs.find(t => t.id === 'kanji');
    const kosakataTab = lkpdData.tabs.find(t => t.id === 'kosakata');

    const questionsList = [];
    let qNumber = 1;

    // 1. SECTION 1: MOJI & GOI (文字・語彙)
    // Gabungkan soal moji + kanji
    if (mojiTab && mojiTab.items) {
      mojiTab.items.forEach(item => {
        questionsList.push({
          level: 'A2.2',
          chapter: ch,
          section: 'moji_goi',
          questionNumber: qNumber++,
          stimulusText: null,
          audioR2Url: null,
          imageR2Url: null,
          questionText: item.prompt.replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, ''),
          optionA: item.options[0] || 'A',
          optionB: item.options[1] || 'B',
          optionC: item.options[2] || 'C',
          optionD: item.options[3] || null,
          answerKey: toKey(item.answer),
          explanation: `Pilihan jawaban yang tepat adalah (${toKey(item.answer).toUpperCase()}). Bab ${ch} 文字・語彙.`
        });
      });
    }

    if (kanjiTab && kanjiTab.items) {
      kanjiTab.items.forEach(item => {
        questionsList.push({
          level: 'A2.2',
          chapter: ch,
          section: 'moji_goi',
          questionNumber: qNumber++,
          stimulusText: null,
          audioR2Url: null,
          imageR2Url: null,
          questionText: item.prompt.replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, ''),
          optionA: item.options[0] || 'A',
          optionB: item.options[1] || 'B',
          optionC: item.options[2] || 'C',
          optionD: item.options[3] || null,
          answerKey: toKey(item.answer),
          explanation: `Cara baca kanji yang tepat adalah (${toKey(item.answer).toUpperCase()}).`
        });
      });
    }

    // 2. SECTION 2: KAIWA & HYOUGEN (会話・表現)
    if (kaiwaTab && kaiwaTab.items) {
      kaiwaTab.items.forEach(item => {
        questionsList.push({
          level: 'A2.2',
          chapter: ch,
          section: 'kaiwa_hyougen',
          questionNumber: qNumber++,
          stimulusText: null,
          audioR2Url: null,
          imageR2Url: null,
          questionText: item.prompt.replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, ''),
          optionA: item.options[0] || 'A',
          optionB: item.options[1] || 'B',
          optionC: item.options[2] || 'C',
          optionD: item.options[3] || null,
          answerKey: toKey(item.answer),
          explanation: `Ungkapan percakapan yang tepat untuk situasi ini adalah (${toKey(item.answer).toUpperCase()}).`
        });
      });
    }

    // 3. SECTION 3: CHOUKAI (聴解)
    // Sesuai regulasi JFT-Basic: stimulusText = null (naskah tidak ditampilkan), audioR2Url terisi, script di explanation
    if (choukaiTab && choukaiTab.items) {
      choukaiTab.items.forEach(item => {
        questionsList.push({
          level: 'A2.2',
          chapter: ch,
          section: 'choukai',
          questionNumber: qNumber++,
          stimulusText: null,
          audioR2Url: formatAudio(ch, item.audioUrl),
          imageR2Url: null,
          questionText: item.prompt.replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, ''),
          optionA: item.options[0] || 'A',
          optionB: item.options[1] || 'B',
          optionC: item.options[2] || 'C',
          optionD: item.options[3] || null,
          answerKey: toKey(item.answer),
          explanation: item.script
            ? `【Naskah Audio】\n${item.script}\n\nJawaban yang benar adalah (${toKey(item.answer).toUpperCase()}).`
            : `Jawaban yang benar adalah (${toKey(item.answer).toUpperCase()}).`
        });
      });
    }

    // 4. SECTION 4: DOKKAI (読解)
    // Sesuai regulasi: stimulusText memuat teks wacana bacaan, questionText memuat pertanyaan
    if (dokkaiTab && dokkaiTab.items) {
      let currentPassage = null;
      dokkaiTab.items.forEach(item => {
        if (item.passage) {
          currentPassage = item.passage.replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, '');
        }
        questionsList.push({
          level: 'A2.2',
          chapter: ch,
          section: 'dokkai',
          questionNumber: qNumber++,
          stimulusText: currentPassage || '【案内文】\n詳細を確認して質問に答えてください。',
          audioR2Url: null,
          imageR2Url: null,
          questionText: item.prompt.replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, ''),
          optionA: item.options[0] || 'A',
          optionB: item.options[1] || 'B',
          optionC: item.options[2] || 'C',
          optionD: item.options[3] || null,
          answerKey: toKey(item.answer),
          explanation: `Berdasarkan teks wacana bacaan, informasi yang benar adalah pilihan (${toKey(item.answer).toUpperCase()}).`
        });
      });
    }

    console.log(`Menyiapkan ${questionsList.length} butir soal untuk Bab ${ch}...`);

    // Hapus dulu data lama bab ini agar tidak duplikat
    await sql(`DELETE FROM questions WHERE chapter = ${ch}`);

    // Insert per butir ke tabel questions
    for (const q of questionsList) {
      await sql(
        `INSERT INTO questions 
          (level, chapter, section, question_number, stimulus_text, audio_r2_url, image_r2_url, question_text, option_a, option_b, option_c, option_d, answer_key, explanation)
         VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          q.level,
          q.chapter,
          q.section,
          q.questionNumber,
          q.stimulusText,
          q.audioR2Url,
          q.imageR2Url,
          q.questionText,
          q.optionA,
          q.optionB,
          q.optionC,
          q.optionD,
          q.answerKey,
          q.explanation
        ]
      );
    }

    console.log(`✓ Sukses insert ${questionsList.length} soal untuk Bab ${ch} ke Neon PostgreSQL!`);
    totalInserted += questionsList.length;
  }

  console.log(`\n======================================================`);
  console.log(`TOTAL SUKSES SEEDING: ${totalInserted} BUTIR SOAL (BAB 8 - 18)`);
  console.log(`======================================================\n`);
}

runSeed().catch(err => {
  console.error('Gagal menjalankan seeding:', err);
  process.exit(1);
});
