import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import mammoth from "mammoth";
import { neon } from "@neondatabase/serverless";

dotenv.config({ path: ".env.local" });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("ERROR: DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const sql = neon(dbUrl);

// Retry helper
async function runWithRetry<T>(fn: () => Promise<T>, retries = 5, delay = 2000): Promise<T> {
  let lastError: any;
  for (let i = 1; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.warn(`   ⚠️ DB Attempt ${i} gagal: ${(err as Error).message}. Menunggu ${delay}ms...`);
      if (i < retries) await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError;
}

interface ParsedQuestion {
  level: string;
  chapter: number;
  section: string;
  questionNumber: number;
  stimulusText: string | null;
  audioR2Url: string | null;
  imageR2Url: string | null;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string | null;
  answerKey: string;
  explanation: string | null;
}

// Map gambar visual untuk Bab 1-7
const imageMappings: Record<string, string> = {
  // Bab 1
  "1_1": "bab01/Z_01_3_05_mori.png",
  "1_2": "bab01/Z_01_3_02_kawa.png",
  "1_3": "bab01/Z_01_3_07_sabaku.png",
  "1_4": "bab01/Z_01_3_04_shima.png",
  // Bab 2
  "2_1": "bab02/Z_02_1_05_tatsu.png",
  "2_2": "bab02/Z_02_1_01_kamiganagai.png",
  "2_3": "bab02/Z_02_1_03_segatakai.png",
  "2_4": "bab02/Z_02_2_02_mago.png",
  // Bab 3
  "3_1": "bab03/Z_03_2_01_niku.png",
  "3_2": "bab03/Z_03_2_02_sakana.png",
  "3_3": "bab03/Z_03_2_07_negi.png",
  "3_4": "bab03/Z_03_2_03_ebikani.png",
  // Bab 4
  "4_1": "bab04/Z_04_2_02_mazeru1.png",
  "4_2": "bab04/Z_04_2_04_ireru.png",
  "4_3": "bab04/Z_04_2_03_kakeru.png",
  "4_4": "bab04/Z_04_2_07_muku.png",
  // Bab 5
  "5_1": "bab05/Z_05_1_02_umigakiree.png",
  "5_2": "bab05/Z_05_3_02_ryokan.png",
  "5_3": "bab05/Z_05_3_03_minshuku.png",
  "5_4": "bab05/Z_05_3_14_mizugi.png",
  // Bab 6
  "6_1": "bab06/Z_06_1_07_zaseki.png",
  "6_2": "bab06/Z_06_1_09_jiko.png",
  "6_3": "bab06/Z_06_2_01_domitorii.png",
  "6_4": "bab06/Z_06_4_09_keeburukaa.png",
  // Bab 7
  "7_1": "bab07/Z_07_1_01_keejiban.png",
  "7_2": "bab07/Z_07_2_01_gasutenken.png",
  "7_3": "bab07/Z_07_2_04_hanabitaikai.png",
  "7_4": "bab07/Z_07_4_01_bon-odorinisasou.png",
};

// Kunci jawaban default untuk Fukushuu 1 Mojigoi
const fukushuuMojiKeys: Record<number, string> = {
  1: "a", 2: "a", 3: "a", 4: "d", 5: "b", 6: "a", 7: "c", 8: "b", 9: "b", 10: "a",
  11: "c", 12: "b", 13: "b", 14: "c", 15: "b", 16: "a", 17: "b", 18: "c", 19: "a", 20: "b",
  21: "d", 22: "b", 23: "c", 24: "d", 25: "a"
};

function parseQuestionsFromLines(
  lines: string[],
  level: string,
  chapter: number,
  section: string,
  localAudioFiles: string[]
): ParsedQuestion[] {
  const items: ParsedQuestion[] = [];
  let currentStimulus: string | null = null;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Stimulus wacana / script detection
    if (
      line.startsWith("【文章") ||
      line.startsWith("［") ||
      line.startsWith("【トラック") ||
      line.startsWith("アナウンス：")
    ) {
      if (line.startsWith("【文章") || line.startsWith("［") || line.startsWith("【トラック")) {
        const stimLines = [line];
        i++;
        while (
          i < lines.length &&
          !lines[i].match(/^\d+\.\s*/) &&
          !lines[i].match(/^(\*?[a-d]\))/i) &&
          !lines[i].startsWith("【文章") &&
          !lines[i].startsWith("【トラック")
        ) {
          stimLines.push(lines[i]);
          i++;
        }
        currentStimulus = stimLines.join("\n");
        continue;
      }
    }

    // Numbered question detection
    const numMatch = line.match(/^(\d+)\.\s*(.*)/) || (line.match(/^(\d+)\.?$/) ? [line, line.replace(".", ""), ""] : null);
    if (numMatch) {
      const qNum = parseInt(numMatch[1], 10);
      let qText = numMatch[2] ? numMatch[2].trim() : "";
      let audioCode: string | null = null;

      // Extract Audio code
      const aMatch = (qText + " " + (currentStimulus || "")).match(
        /(?:Kode Audio:\s*|音声コード：\s*|\[Track\s*)([Z_\[\]\d\-a-zA-Z\.]+)/i
      );
      if (aMatch) {
        let code = aMatch[1].replace(/[\[\]]/g, "");
        if (!code.startsWith("Z_")) {
          code = "Z_" + code;
        }
        audioCode = code;
      }

      i++;
      // Gather question text lines
      while (
        i < lines.length &&
        !lines[i].match(/^(\*?[a-d]\))/i) &&
        !lines[i].match(/^(\d+)\.\s*/) &&
        !lines[i].startsWith("【文章") &&
        !lines[i].startsWith("【トラック")
      ) {
        if (lines[i].startsWith("【スクリプト】")) {
          const scriptLines = [lines[i]];
          i++;
          while (
            i < lines.length &&
            !lines[i].startsWith("【質問】") &&
            !lines[i].match(/^(\*?[a-d]\))/i)
          ) {
            scriptLines.push(lines[i]);
            i++;
          }
          currentStimulus = scriptLines.join("\n");
          if (i < lines.length && lines[i].startsWith("【質問】")) {
            qText = lines[i].replace("【質問】", "").trim();
            i++;
          }
          break;
        }
        if (qText) qText += "\n" + lines[i];
        else qText = lines[i];
        i++;
      }

      // Collect options
      let optA = "", optB = "", optC = "", optD: string | null = null;
      let key = "a";
      let keyFoundFromAsterisk = false;

      while (i < lines.length && lines[i].match(/^(\*?[a-d]\))/i)) {
        const oMatch = lines[i].match(/^(\*?)([a-d])\)\s*(.*)/i);
        if (oMatch) {
          const isCorrect = oMatch[1] === "*";
          const letter = oMatch[2].toLowerCase();
          const val = oMatch[3].trim();
          if (isCorrect) {
            key = letter;
            keyFoundFromAsterisk = true;
          }
          if (letter === "a") optA = val;
          else if (letter === "b") optB = val;
          else if (letter === "c") optC = val;
          else if (letter === "d") optD = val;
        }
        i++;
      }

      // Fallback key untuk Fukushuu 1 Mojigoi
      if (!keyFoundFromAsterisk && chapter === 0 && section === "moji_goi") {
        if (fukushuuMojiKeys[qNum]) {
          key = fukushuuMojiKeys[qNum];
        }
      }

      // Match Audio URL with Supabase
      let audioUrl: string | null = null;
      if (audioCode) {
        const cleanBase = audioCode.replace(/\.mp3$/i, "").replace(/[\[\]]/g, "");
        const found = localAudioFiles.find(
          (f) => {
            const cleanF = f.replace(/[\[\]]/g, "");
            return cleanF.startsWith(cleanBase) || cleanF.includes(cleanBase);
          }
        );
        if (found) {
          const safeFound = found.replace(/[\[\]]/g, "");
          audioUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/irodori-assets/audio/shokyu2/${safeFound}`;
        }
      }

      // Match Image URL
      let imageUrl: string | null = null;
      const imgKey = `${chapter}_${qNum}`;
      if (section === "moji_goi" && imageMappings[imgKey]) {
        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/irodori-assets/images/shokyu2/${imageMappings[imgKey]}`;
      }

      let finalQText = qText.trim();
      if (!finalQText) {
        if (section === "moji_goi") finalQText = "絵を見て、正しいことばを選んでください。";
        else if (section === "choukai") finalQText = "音声を聞いて、正しい答えを選んでください。";
        else finalQText = "正しいものをひとつ選んでください。";
      }

      if (optA || optB) {
        items.push({
          level,
          chapter,
          section,
          questionNumber: qNum,
          stimulusText: currentStimulus,
          audioR2Url: audioUrl,
          imageR2Url: imageUrl,
          questionText: finalQText,
          optionA: optA || "A",
          optionB: optB || "B",
          optionC: optC || "C",
          optionD: optD,
          answerKey: key,
          explanation: null,
        });
      }
      continue;
    }
    i++;
  }

  return items;
}

async function runCompleteSeeder() {
  console.log("=========================================================");
  console.log("   IMPORT KESELURUHAN BANK SOAL JFT-BASIC A2 (BAB 1 - 7 + FUKUSHUU 1)");
  console.log("=========================================================\n");

  const localAudioDir = path.resolve(__dirname, "../../Aset Audio & Gambar/Audio 初級2");
  let localAudioFiles: string[] = [];
  if (fs.existsSync(localAudioDir)) {
    localAudioFiles = fs.readdirSync(localAudioDir).filter((f) => f.endsWith(".mp3"));
    console.log(`✓ Terdeteksi ${localAudioFiles.length} file audio lokal.\n`);
  }

  const bankSoalDir = path.resolve(__dirname, "../../Bank Soal JFT-Basic A2");
  const folders = fs
    .readdirSync(bankSoalDir)
    .filter((f) => fs.statSync(path.join(bankSoalDir, f)).isDirectory());

  const allQuestionsToInsert: ParsedQuestion[] = [];

  for (const folder of folders) {
    let chapterNum = 0;
    if (folder.toLowerCase().includes("fukushuu")) {
      chapterNum = 0;
    } else if (folder.toLowerCase().includes("bab")) {
      const match = folder.match(/\d+/);
      if (match) chapterNum = parseInt(match[0], 10);
    }

    console.log(`📁 Membaca Folder: ${folder} (Chapter: ${chapterNum})`);
    const folderPath = path.join(bankSoalDir, folder);
    const files = fs
      .readdirSync(folderPath)
      .filter((f) => f.endsWith(".docx") && !f.startsWith("~$"));

    let folderCount = 0;
    for (const file of files) {
      let section = "moji_goi";
      if (file.includes("Kaiwa")) section = "kaiwa_hyougen";
      else if (file.includes("Choukai")) section = "choukai";
      else if (file.includes("Dokkai")) section = "dokkai";

      const filePath = path.join(folderPath, file);
      const res = await mammoth.extractRawText({ path: filePath });
      const lines = res.value.split("\n").map((l) => l.trim()).filter(Boolean);

      const parsed = parseQuestionsFromLines(
        lines,
        "A2.2",
        chapterNum,
        section,
        localAudioFiles
      );

      console.log(`   ✓ ${section.padEnd(14)} (${file}): ${parsed.length} soal terurai`);
      folderCount += parsed.length;
      allQuestionsToInsert.push(...parsed);
    }
    console.log(`   ➔ Subtotal ${folder}: ${folderCount} soal\n`);
  }

  console.log(`\n📊 TOTAL SOAL SIAP DISIMPAN KE DATABASE: ${allQuestionsToInsert.length}`);

  // Kosongkan database lama dengan retry
  console.log("🧹 Mengosongkan tabel questions lama di Neon DB...");
  await runWithRetry(async () => {
    await sql("TRUNCATE TABLE questions RESTART IDENTITY");
  });
  console.log("✓ Tabel questions berhasil dikosongkan.\n");

  // Simpan dalam batch 20 soal menggunakan query SQL murni dengan retry
  console.log("💾 Menyimpan seluruh data soal ke Neon Database...");
  const BATCH_SIZE = 20;
  for (let idx = 0; idx < allQuestionsToInsert.length; idx += BATCH_SIZE) {
    const chunk = allQuestionsToInsert.slice(idx, idx + BATCH_SIZE);
    
    // Construct multi-row insert query
    const valuePlaceholders: string[] = [];
    const params: any[] = [];
    
    chunk.forEach((q, cIdx) => {
      const base = cIdx * 12;
      valuePlaceholders.push(
        `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9}, $${base + 10}, $${base + 11}, $${base + 12})`
      );
      params.push(
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
        q.answerKey
      );
    });

    const query = `
      INSERT INTO questions (
        level, chapter, section, question_number, stimulus_text, 
        audio_r2_url, image_r2_url, question_text, option_a, option_b, 
        option_c, option_d, answer_key
      ) VALUES ${chunk.map((_, i) => {
        const offset = i * 13;
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10}, $${offset + 11}, $${offset + 12}, $${offset + 13})`;
      }).join(", ")}
    `;

    const flatParams: any[] = [];
    chunk.forEach((q) => {
      flatParams.push(
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
        q.answerKey
      );
    });

    await runWithRetry(async () => {
      await sql(query, flatParams);
    });

    process.stdout.write(`   ✓ Tersimpan ${Math.min(idx + BATCH_SIZE, allQuestionsToInsert.length)}/${allQuestionsToInsert.length} soal...\r`);
  }

  console.log(`\n\n🎉 SUKSES BESAR! Sebanyak ${allQuestionsToInsert.length} butir soal resmi masuk ke Neon DB tanpa ada yang tertukar!`);
}

runCompleteSeeder().catch((err) => {
  console.error("Fatal Error saat seeder:", err);
  process.exit(1);
});
