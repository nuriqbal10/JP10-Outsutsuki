import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import mammoth from "mammoth";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { questions } from "../src/db/schema";

dotenv.config({ path: ".env.local" });

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

function parseDocxContent(rawText: string, level: string, chapter: number, section: string): ParsedQuestion[] {
  const lines = rawText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  const items: ParsedQuestion[] = [];

  let currentStimulus: string | null = null;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check for stimulus header like 【文章 1】 or stimulus text blocks
    if (line.startsWith("【文章") || line.startsWith("［") || line.startsWith("件名：") || line.startsWith("会話を聞いて") || line.startsWith("文章を読んで")) {
      if (line.startsWith("【文章") || line.startsWith("［") || line.startsWith("件名：")) {
        // Collect stimulus lines until next numbered question
        const stimLines = [line];
        i++;
        while (i < lines.length && !lines[i].match(/^\d+\.\s*/)) {
          stimLines.push(lines[i]);
          i++;
        }
        currentStimulus = stimLines.join("\n");
        continue;
      }
      i++;
      continue;
    }

    // Match question start: "1." or "1. [Track 01-01]" or "1. Question text"
    const qMatch = line.match(/^(\d+)\.\s*(.*)/);
    if (qMatch) {
      const qNum = parseInt(qMatch[1], 10);
      let qText = qMatch[2];
      let trackInfo: string | null = null;

      // Extract Track info if present
      const trackMatch = qText.match(/\[Track\s*([\d-]+)\]/i);
      if (trackMatch) {
        trackInfo = trackMatch[1];
        qText = qText.replace(/\[Track\s*[\d-]+\]/i, "").trim();
      }

      // If qText was empty, check next line
      i++;
      if (!qText && i < lines.length && !lines[i].match(/^[a-d\*]\)/i)) {
        qText = lines[i];
        i++;
      }

      let optA = "";
      let optB = "";
      let optC = "";
      let optD: string | null = null;
      let key = "a";

      // Collect options a), b), c), d)
      while (i < lines.length && lines[i].match(/^(\*?[a-d]\))\s*(.*)/i)) {
        const optLine = lines[i];
        const match = optLine.match(/^(\*?)([a-d])\)\s*(.*)/i);
        if (match) {
          const isCorrect = match[1] === "*";
          const optLetter = match[2].toLowerCase();
          const optVal = match[3];

          if (isCorrect) key = optLetter;

          if (optLetter === "a") optA = optVal;
          else if (optLetter === "b") optB = optVal;
          else if (optLetter === "c") optC = optVal;
          else if (optLetter === "d") optD = optVal;
        }
        i++;
      }

      let audioUrl = null;
      if (trackInfo) {
        audioUrl = `audio/shokyu2/Z_[${trackInfo}]_kiku.mp3`;
      }

      items.push({
        level,
        chapter,
        section,
        questionNumber: qNum,
        stimulusText: currentStimulus,
        audioR2Url: audioUrl,
        imageR2Url: null,
        questionText: qText || `Soal ${qNum}`,
        optionA: optA || "A",
        optionB: optB || "B",
        optionC: optC || "C",
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

async function seedBankSoal() {
  console.log("🚀 Memulai Import Bank Soal JFT-Basic A2 ke Neon PostgreSQL...\n");

  const bankSoalDir = path.resolve(__dirname, "../../Bank Soal JFT-Basic A2");
  const folders = fs.readdirSync(bankSoalDir).filter(f => fs.statSync(path.join(bankSoalDir, f)).isDirectory());

  let totalQuestionsInserted = 0;

  for (const folder of folders) {
    let chapterNum = 0;
    if (folder.toLowerCase().includes("bab")) {
      const match = folder.match(/\d+/);
      if (match) chapterNum = parseInt(match[0], 10);
    } else if (folder.toLowerCase().includes("fukushuu")) {
      chapterNum = 0; // 0 indicates Fukushuu / Review
    }

    console.log(`📁 Memproses Folder: ${folder} (Chapter: ${chapterNum})`);

    const folderPath = path.join(bankSoalDir, folder);
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".docx") && !f.startsWith("~$"));

    for (const file of files) {
      let section = "other";
      if (file.includes("Mojigoi")) section = "moji_goi";
      else if (file.includes("KaiwaHyougen")) section = "kaiwa_hyougen";
      else if (file.includes("Choukai")) section = "choukai";
      else if (file.includes("Dokkai")) section = "dokkai";

      const filePath = path.join(folderPath, file);
      const res = await mammoth.extractRawText({ path: filePath });
      const parsed = parseDocxContent(res.value, "A2.2", chapterNum, section);

      if (parsed.length > 0) {
        // Insert parsed questions
        for (let j = 0; j < parsed.length; j += 25) {
          const chunk = parsed.slice(j, j + 25);
          await db.insert(questions).values(chunk);
        }
        totalQuestionsInserted += parsed.length;
        console.log(`   ✓ ${section.padEnd(14)} (${file}): Berhasil import ${parsed.length} soal`);
      } else {
        console.log(`   ⚠️ ${section.padEnd(14)} (${file}): Tidak ada soal yang terdeteksi`);
      }
    }
  }

  console.log(`\n🎉 SELESAI! Total ${totalQuestionsInserted} butir soal JFT-Basic A2 resmi masuk ke Database Neon.`);
}

seedBankSoal().catch(err => {
  console.error("Gagal melakukan import bank soal:", err);
  process.exit(1);
});
