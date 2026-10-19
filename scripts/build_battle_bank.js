const fs = require("fs");
const path = require("path");

const inputPath = path.resolve(__dirname, "../../Flashcard Kosakata/vocab_irodori_all_data.json");
if (!fs.existsSync(inputPath)) {
  console.error("Input file not found:", inputPath);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
const levels = ["A1", "A2.1", "A2.2"];

function normalizePos(pos) {
  if (!pos) return "other";
  const p = pos.trim();
  if (p === "N" || p === "名" || p.includes("名詞")) return "noun";
  if (p === "イA" || p === "ナA" || p.includes("形")) return "adj";
  if (p === "V1" || p === "Ⅰ" || p.includes("1")) return "verb1";
  if (p === "V2" || p === "Ⅱ" || p.includes("2")) return "verb2";
  if (p === "V3" || p === "Ⅲ" || p.includes("3") || p.includes("スル")) return "verb3";
  if (p.includes("V")) return "verb1";
  return "other";
}

const allWords = [];
const seenJa = new Set();

for (const lvl of levels) {
  const chapters = raw.levels[lvl] || [];
  for (const ch of chapters) {
    const chNum = Number(ch.chapter) || 1;
    const words = ch.words || [];
    for (const w of words) {
      if (!w.midashi || !w.id_arti) continue;
      const cleanJa = w.midashi.replace(/\s+/g, " ").trim();
      const cleanArti = w.id_arti.replace(/\s+/g, " ").trim();
      const posCat = normalizePos(w.pos);

      if (cleanArti.length > 40 || cleanJa.length > 20) continue;
      if (seenJa.has(cleanJa)) continue;
      seenJa.add(cleanJa);

      allWords.push([
        cleanJa,
        w.yomi ? w.yomi.trim() : cleanJa,
        cleanArti,
        posCat,
        lvl,
        chNum
      ]);
    }
  }
}

console.log(`Compact bank items: ${allWords.length}`);

// Generate TypeScript
const tsContent = `// Auto-generated Authentic IRODORI Battle Question Bank (Compact & High Performance)
// Sourced from official IRODORI Japanese Online Course (A1, A2.1, A2.2)

export type VocabCategory = "all" | "noun" | "adj" | "verb1" | "verb2" | "verb3" | "other";
export type VocabLevel = "all" | "A1" | "A2.1" | "A2.2";

export interface VocabItem {
  ja: string;
  yomi: string;
  romaji?: string;
  arti: string;
  pos: string;
  level: string;
  chapter: number;
}

export interface BattleQuestion {
  ja: string;
  yomi?: string;
  romaji?: string;
  correct: string;
  options: string[];
  pos: string;
  level: string;
  chapter: number;
}

// Compact tuple schema: [ja, yomi, arti, pos, level, chapter]
type RawTuple = [string, string, string, string, string, number];

const RAW_BANK: RawTuple[] = ${JSON.stringify(allWords)};

export const VOCAB_BANK: VocabItem[] = RAW_BANK.map((r) => ({
  ja: r[0],
  yomi: r[1],
  arti: r[2],
  pos: r[3],
  level: r[4],
  chapter: r[5],
}));

// Fisher-Yates Shuffle
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateBattleQuestions(params: {
  level?: VocabLevel;
  chapter?: number; // 0 = all
  category?: VocabCategory;
  count?: number;
}): BattleQuestion[] {
  const { level = "all", chapter = 0, category = "all", count = 5 } = params;

  // 1. Filter pool
  let pool = VOCAB_BANK.filter((item) => {
    if (level !== "all" && item.level !== level) return false;
    if (chapter > 0 && item.chapter !== chapter) return false;
    if (category !== "all" && item.pos !== category) return false;
    return true;
  });

  // Fallback to broader pool if filter is too narrow (< 4 items)
  if (pool.length < 4) {
    pool = VOCAB_BANK.filter((item) => {
      if (category !== "all" && item.pos !== category) return false;
      return true;
    });
  }

  if (pool.length < 4) {
    pool = VOCAB_BANK;
  }

  // 2. Shuffle and pick target items
  const shuffledPool = shuffle(pool);
  const selectedItems = shuffledPool.slice(0, Math.min(count, pool.length));

  // 3. For each selected item, pick 3 distinct distractors from the pool
  return selectedItems.map((target) => {
    const distractorCandidates = VOCAB_BANK.filter(
      (cand) => cand.arti !== target.arti && (cand.pos === target.pos || cand.level === target.level)
    );

    const shuffledCandidates = shuffle(distractorCandidates.length >= 3 ? distractorCandidates : VOCAB_BANK);
    const chosenDistractors = shuffledCandidates
      .filter((c) => c.arti !== target.arti)
      .slice(0, 3)
      .map((c) => c.arti);

    // Ensure 4 unique options
    const uniqueOptions = Array.from(new Set([target.arti, ...chosenDistractors]));
    while (uniqueOptions.length < 4) {
      const fallback = VOCAB_BANK[Math.floor(Math.random() * VOCAB_BANK.length)].arti;
      if (!uniqueOptions.includes(fallback)) {
        uniqueOptions.push(fallback);
      }
    }

    // Shuffle options with Fisher-Yates so correct answer is NOT always 'A'
    const shuffledOptions = shuffle(uniqueOptions);

    return {
      ja: target.ja,
      yomi: target.yomi,
      correct: target.arti,
      options: shuffledOptions,
      pos: target.pos,
      level: target.level,
      chapter: target.chapter,
    };
  });
}
`;

const outputPath = path.resolve(__dirname, "../src/data/battleQuestionBank.ts");
fs.writeFileSync(outputPath, tsContent, "utf-8");
console.log(`Generated compact battleQuestionBank.ts at ${outputPath}`);
