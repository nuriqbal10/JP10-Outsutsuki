import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import mammoth from "mammoth";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
// @ts-ignore
import ws from "ws";
import { questions } from "../src/db/schema";
import { eq } from "drizzle-orm";

dotenv.config({ path: ".env.local" });

neonConfig.webSocketConstructor = ws;

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("ERROR: DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const sql = neon(dbUrl);
const db = drizzle(sql);

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

function parseMojiGoiOrKaiwa(lines: string[], level: string, chapter: number, section: string): ParsedQuestion[] {
  const items: ParsedQuestion[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const qMatch = line.match(/^(\d+)\.\s*(.*)/);
    if (qMatch) {
      const qNum = parseInt(qMatch[1], 10);
      let qText = qMatch[2].trim();

      i++;
      while (i < lines.length && !lines[i].match(/^\*?[a-d]\)/i) && !lines[i].match(/^\d+\.\s*/)) {
        qText += "\n" + lines[i];
        i++;
      }

      let optA = "", optB = "", optC = "", optD: string | null = null;
      let key = "a";

      while (i < lines.length && lines[i].match(/^\*?[a-d]\)/i)) {
        const oMatch = lines[i].match(/^(\*?)([a-d])\)\s*(.*)/i);
        if (oMatch) {
          const isCorrect = oMatch[1] === "*";
          const letter = oMatch[2].toLowerCase();
          const val = oMatch[3].trim();
          if (isCorrect) key = letter;
          if (letter === "a") optA = val;
          else if (letter === "b") optB = val;
          else if (letter === "c") optC = val;
          else if (letter === "d") optD = val;
        }
        i++;
      }

      items.push({
        level,
        chapter,
        section,
        questionNumber: qNum,
        stimulusText: null,
        audioR2Url: null,
        imageR2Url: null,
        questionText: qText,
        optionA: optA,
        optionB: optB,
        optionC: optC,
        optionD: optD,
        answerKey: key,
        explanation: null,
      });
      continue;
    }
    i++;
  }
  return items;
}

function parseDokkai(lines: string[], level: string, chapter: number): ParsedQuestion[] {
  const items: ParsedQuestion[] = [];
  let currentStimulus: string | null = null;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("【文章")) {
      const stimLines = [line];
      i++;
      while (i < lines.length && !lines[i].match(/^\d+\.\s*/)) {
        stimLines.push(lines[i]);
        i++;
      }
      currentStimulus = stimLines.join("\n");
      continue;
    }

    const qMatch = line.match(/^(\d+)\.\s*(.*)/);
    if (qMatch) {
      const qNum = parseInt(qMatch[1], 10);
      let qText = qMatch[2].trim();

      i++;
      while (i < lines.length && !lines[i].match(/^\*?[a-d]\)/i) && !lines[i].match(/^\d+\.\s*/) && !lines[i].startsWith("【文章")) {
        qText += "\n" + lines[i];
        i++;
      }

      let optA = "", optB = "", optC = "", optD: string | null = null;
      let key = "a";

      while (i < lines.length && lines[i].match(/^\*?[a-d]\)/i)) {
        const oMatch = lines[i].match(/^(\*?)([a-d])\)\s*(.*)/i);
        if (oMatch) {
          const isCorrect = oMatch[1] === "*";
          const letter = oMatch[2].toLowerCase();
          const val = oMatch[3].trim();
          if (isCorrect) key = letter;
          if (letter === "a") optA = val;
          else if (letter === "b") optB = val;
          else if (letter === "c") optC = val;
          else if (letter === "d") optD = val;
        }
        i++;
      }

      items.push({
        level,
        chapter,
        section: "dokkai",
        questionNumber: qNum,
        stimulusText: currentStimulus,
        audioR2Url: null,
        imageR2Url: null,
        questionText: qText,
        optionA: optA,
        optionB: optB,
        optionC: optC,
        optionD: optD,
        answerKey: key,
        explanation: null,
      });
      continue;
    }
    i++;
  }
  return items;
}

function parseChoukai(lines: string[], level: string, chapter: number): ParsedQuestion[] {
  const items: ParsedQuestion[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const match = line.match(/^(\d+)\.\s*【Kode Audio:\s*([^】]+)】/);
    if (match) {
      const qNum = parseInt(match[1], 10);
      const audioFileName = match[2].trim();
      const safeAudio = audioFileName.replace(/\[/g, "").replace(/\]/g, "");
      const audioUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/irodori-assets/audio/shokyu2/${safeAudio}`;

      i++;
      let script = "";
      if (i < lines.length && lines[i].startsWith("【スクリプト】")) {
        i++;
        const sLines = [];
        while (i < lines.length && !lines[i].startsWith("【質問】")) {
          sLines.push(lines[i]);
          i++;
        }
        script = sLines.join("\n");
      }

      let qText = "";
      if (i < lines.length && lines[i].startsWith("【質問】")) {
        qText = lines[i].replace("【質問】", "").trim();
        i++;
      }

      let optA = "", optB = "", optC = "", optD: string | null = null;
      let key = "a";

      while (i < lines.length && lines[i].match(/^\*?[a-d]\)/i)) {
        const oMatch = lines[i].match(/^(\*?)([a-d])\)\s*(.*)/i);
        if (oMatch) {
          const isCorrect = oMatch[1] === "*";
          const letter = oMatch[2].toLowerCase();
          const val = oMatch[3].trim();
          if (isCorrect) key = letter;
          if (letter === "a") optA = val;
          else if (letter === "b") optB = val;
          else if (letter === "c") optC = val;
          else if (letter === "d") optD = val;
        }
        i++;
      }

      items.push({
        level,
        chapter,
        section: "choukai",
        questionNumber: qNum,
        stimulusText: script ? `【スクリプト】\n${script}` : null,
        audioR2Url: audioUrl,
        imageR2Url: null,
        questionText: qText || `Soal Menyimak #${qNum}`,
        optionA: optA,
        optionB: optB,
        optionC: optC,
        optionD: optD,
        answerKey: key,
        explanation: null,
      });
      continue;
    }
    i++;
  }
  return items;
}

async function seedBab7() {
  console.log("🚀 Memulai import Bab 07 lengkap ke Neon PostgreSQL...\n");

  const folderPath = path.resolve(__dirname, "../../Bank Soal JFT-Basic A2/Bab 07");

  // 1. Moji Goi
  const pMojigoi = path.join(folderPath, "Latihan_JFT_A2_Bab7_Mojigoi.docx");
  const resMoji = await mammoth.extractRawText({ path: pMojigoi });
  const mojiQuestions = parseMojiGoiOrKaiwa(resMoji.value.split("\n").map(l => l.trim()).filter(Boolean), "A2.2", 7, "moji_goi");

  // 2. Kaiwa Hyougen
  const pKaiwa = path.join(folderPath, "Latihan_JFT_A2_Bab7_KaiwaHyougen.docx");
  const resKaiwa = await mammoth.extractRawText({ path: pKaiwa });
  const kaiwaQuestions = parseMojiGoiOrKaiwa(resKaiwa.value.split("\n").map(l => l.trim()).filter(Boolean), "A2.2", 7, "kaiwa_hyougen");

  // 3. Choukai
  const pChoukai = path.join(folderPath, "Latihan_JFT_A2_Bab7_Choukai.docx");
  const resChoukai = await mammoth.extractRawText({ path: pChoukai });
  const choukaiQuestions = parseChoukai(resChoukai.value.split("\n").map(l => l.trim()).filter(Boolean), "A2.2", 7);

  // 4. Dokkai
  const pDokkai = path.join(folderPath, "Latihan_JFT_A2_Bab7_Dokkai.docx");
  const resDokkai = await mammoth.extractRawText({ path: pDokkai });
  const dokkaiQuestions = parseDokkai(resDokkai.value.split("\n").map(l => l.trim()).filter(Boolean), "A2.2", 7);

  console.log(`📊 Hasil parsing Bab 07:`);
  console.log(`   - Moji Goi: ${mojiQuestions.length} butir`);
  console.log(`   - Kaiwa Hyougen: ${kaiwaQuestions.length} butir`);
  console.log(`   - Choukai: ${choukaiQuestions.length} butir`);
  console.log(`   - Dokkai: ${dokkaiQuestions.length} butir`);

  const allQuestions = [...mojiQuestions, ...kaiwaQuestions, ...choukaiQuestions, ...dokkaiQuestions];
  console.log(`   ➔ TOTAL: ${allQuestions.length} butir soal Bab 07\n`);

  // Retry wrapper for network resilience
  async function runWithRetry(fn: () => Promise<any>, maxRetries = 5) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err: any) {
        console.warn(`Attempt ${attempt} failed: ${err.message}. Retrying in 2s...`);
        if (attempt === maxRetries) throw err;
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  console.log("🧹 Membersihkan data Bab 7 lama di database...");
  await runWithRetry(() => db.delete(questions).where(eq(questions.chapter, 7)));

  console.log("📥 Mengimpor seluruh 90 butir soal Bab 7 dalam satu batch transaksi...");
  await runWithRetry(() => db.insert(questions).values(allQuestions));

  console.log(`\n🎉 SUKSES BESAR! Seluruh ${allQuestions.length} butir soal Bab 07 berhasil tersimpan di Neon PostgreSQL!`);
}

seedBab7().catch(err => {
  console.error("Gagal import:", err);
  process.exit(1);
});
