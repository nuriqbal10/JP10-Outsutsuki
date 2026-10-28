import JSZip from "jszip";
import mammoth from "mammoth";

export interface ParsedQuestion {
  id: string | number;
  questionText: string;
  type: "mc" | "ox";
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answerKey: "a" | "b" | "c" | "d";
  explanation?: string;
  villageTheme?: string;
}

/**
 * Parsing teks umum (dari Word, copy-paste, notepad) dengan berbagai pola format:
 * Pola 1:
 * 1. Pertanyaan ...
 * A. Opsi A
 * B. Opsi B
 * C. Opsi C
 * D. Opsi D
 * Kunci: A (atau Jawaban: A / Answer: A)
 * Penjelasan: ...
 */
export function parseRawTextQuestions(rawText: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  if (!rawText || !rawText.trim()) return questions;

  // Normalisasi newline
  const text = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Pisahkan berdasarkan nomor soal atau pemisah blok
  const blocks = text.split(/\n(?=(?:Soal\s*)?\d+[\.\)]\s+)/i);

  let counter = 1;
  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Bersihkan awalan nomor soal
    const questionMatch = trimmed.match(/^(?:Soal\s*)?\d+[\.\)]\s*([\s\S]*?)(?=\n\s*(?:[A-Da-d][\.\)]|[OoXx][\.\)]|Kunci|Jawaban|Answer))/i);
    const questionText = questionMatch ? questionMatch[1].trim() : trimmed.split("\n")[0].replace(/^\d+[\.\)]\s*/, "").trim();

    // Deteksi O/X (True/False)
    const isOx = /\b(?:benar|salah|true|false|⭕|❌)\b/i.test(trimmed) && !/C[\.\)]/i.test(trimmed);

    // Ambil opsi
    let optA = "";
    let optB = "";
    let optC = "";
    let optD = "";
    let answerKey: "a" | "b" | "c" | "d" = "a";

    const matchA = trimmed.match(/(?:^|\n)\s*[Aa][\.\)]\s*([^\n]+)/);
    const matchB = trimmed.match(/(?:^|\n)\s*[Bb][\.\)]\s*([^\n]+)/);
    const matchC = trimmed.match(/(?:^|\n)\s*[Cc][\.\)]\s*([^\n]+)/);
    const matchD = trimmed.match(/(?:^|\n)\s*[Dd][\.\)]\s*([^\n]+)/);

    if (matchA) optA = matchA[1].trim();
    if (matchB) optB = matchB[1].trim();
    if (matchC) optC = matchC[1].trim();
    if (matchD) optD = matchD[1].trim();

    // Jika format O/X
    if (isOx || (!matchC && !matchD && (matchA || /O[\.\)]|X[\.\)]/i.test(trimmed)))) {
      optA = optA || "⭕ Benar (Maru / O)";
      optB = optB || "❌ Salah (Batsu / X)";
      optC = "";
      optD = "";
    }

    // Deteksi Kunci Jawaban
    const keyMatch = trimmed.match(/(?:Kunci|Jawaban|Answer|Key)[\s:=]+([A-Da-dOoXx1-4])/i);
    if (keyMatch) {
      const rawKey = keyMatch[1].toLowerCase();
      if (rawKey === "a" || rawKey === "1" || rawKey === "o") answerKey = "a";
      else if (rawKey === "b" || rawKey === "2" || rawKey === "x") answerKey = "b";
      else if (rawKey === "c" || rawKey === "3") answerKey = "c";
      else if (rawKey === "d" || rawKey === "4") answerKey = "d";
    }

    // Penjelasan
    const expMatch = trimmed.match(/(?:Penjelasan|Pembahasan|Explanation)[\s:=]+([^\n]+(?:\n[^\n]+)*)/i);
    const explanation = expMatch ? expMatch[1].trim() : undefined;

    if (questionText && (optA || optB)) {
      questions.push({
        id: `parsed_${counter++}`,
        questionText,
        type: isOx ? "ox" : "mc",
        optionA: optA || "Pilihan A",
        optionB: optB || "Pilihan B",
        optionC: optC || (isOx ? "" : "Pilihan C"),
        optionD: optD || (isOx ? "" : "Pilihan D"),
        answerKey,
        explanation,
      });
    }
  }

  return questions;
}

/**
 * Parsing dari berkas Word (.docx) menggunakan Mammoth
 */
export async function parseWordDocx(arrayBuffer: ArrayBuffer): Promise<ParsedQuestion[]> {
  try {
    const result = await mammoth.extractRawText({ arrayBuffer });
    const rawText = result.value || "";
    return parseRawTextQuestions(rawText);
  } catch (err: any) {
    console.error("Gagal membaca file Word docx:", err);
    throw new Error(`Format Word tidak terbaca: ${err.message}`);
  }
}

/**
 * Parsing dari berkas Blackboard ZIP (Export Pool / Quiz package)
 * Mendukung format Blackboard QTI XML dan Tab-Separated Text Pool
 */
export async function parseBlackboardZip(arrayBuffer: ArrayBuffer): Promise<ParsedQuestion[]> {
  const questions: ParsedQuestion[] = [];
  try {
    const zip = await JSZip.loadAsync(arrayBuffer);
    let counter = 1;

    // 1. Cari file .dat, .xml (QTI format) atau .txt di dalam zip
    const files = Object.keys(zip.files);

    for (const fileName of files) {
      const file = zip.files[fileName];
      if (file.dir) continue;

      // Cek apakah file teks / dat / xml
      if (fileName.endsWith(".dat") || fileName.endsWith(".xml") || fileName.endsWith(".txt")) {
        const content = await file.async("text");

        // Pola A: Blackboard Tab-Delimited text format (MC, TF)
        // MC <tab> Question text <tab> opt1 <tab> correct/incorrect <tab> opt2 <tab> ...
        if (content.includes("\t") && (content.includes("MC\t") || content.includes("TF\t") || content.includes("MA\t"))) {
          const lines = content.split(/\r?\n/);
          for (const line of lines) {
            const parts = line.split("\t");
            const qType = parts[0]?.trim();
            if (qType === "MC" && parts.length >= 6) {
              const qText = parts[1]?.trim();
              const choices: { text: string; correct: boolean }[] = [];
              for (let i = 2; i < parts.length; i += 2) {
                if (parts[i]) {
                  const optText = parts[i].trim();
                  const isCorrect = (parts[i + 1] || "").toLowerCase().includes("correct");
                  choices.push({ text: optText, correct: isCorrect });
                }
              }

              let key: "a" | "b" | "c" | "d" = "a";
              if (choices[1]?.correct) key = "b";
              else if (choices[2]?.correct) key = "c";
              else if (choices[3]?.correct) key = "d";

              questions.push({
                id: `bb_${counter++}`,
                questionText: qText,
                type: "mc",
                optionA: choices[0]?.text || "",
                optionB: choices[1]?.text || "",
                optionC: choices[2]?.text || "",
                optionD: choices[3]?.text || "",
                answerKey: key,
              });
            } else if (qType === "TF" && parts.length >= 3) {
              const qText = parts[1]?.trim();
              const isTrue = (parts[2] || "").toLowerCase().includes("true");
              questions.push({
                id: `bb_${counter++}`,
                questionText: qText,
                type: "ox",
                optionA: "⭕ Benar (True)",
                optionB: "❌ Salah (False)",
                optionC: "",
                optionD: "",
                answerKey: isTrue ? "a" : "b",
              });
            }
          }
        }

        // Pola B: Blackboard QTI XML format (<item ...>)
        if (content.includes("<questestinterop") || content.includes("<item")) {
          const itemRegex = /<item\s+[^>]*>([\s\S]*?)<\/item>/gi;
          let itemMatch: RegExpExecArray | null;

          while ((itemMatch = itemRegex.exec(content)) !== null) {
            const itemXml = itemMatch[1];

            // Question prompt
            const promptMatch = itemXml.match(/<presentation>[\s\S]*?<mattext[^>]*>([\s\S]*?)<\/mattext>/i);
            const rawPrompt = promptMatch ? promptMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim() : "";

            // Strip HTML tags
            const questionText = rawPrompt.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
            if (!questionText) continue;

            // Choices
            const choiceRegex = /<response_label\s+ident="([^"]+)">[\s\S]*?<mattext[^>]*>([\s\S]*?)<\/mattext>/gi;
            let choiceMatch: RegExpExecArray | null;
            const choicesMap: { id: string; text: string }[] = [];

            while ((choiceMatch = choiceRegex.exec(itemXml)) !== null) {
              const optId = choiceMatch[1];
              const optText = choiceMatch[2]
                .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
                .replace(/<[^>]+>/g, " ")
                .replace(/\s+/g, " ")
                .trim();
              choicesMap.push({ id: optId, text: optText });
            }

            // Correct choice
            const correctMatch = itemXml.match(/<varequal[^>]*>([^<]+)<\/varequal>/i);
            const correctId = correctMatch ? correctMatch[1].trim() : "";

            let key: "a" | "b" | "c" | "d" = "a";
            const correctIndex = choicesMap.findIndex((c) => c.id === correctId);
            if (correctIndex === 1) key = "b";
            else if (correctIndex === 2) key = "c";
            else if (correctIndex === 3) key = "d";

            const isOx = choicesMap.length === 2;

            if (choicesMap.length >= 2) {
              questions.push({
                id: `bb_xml_${counter++}`,
                questionText,
                type: isOx ? "ox" : "mc",
                optionA: choicesMap[0]?.text || "",
                optionB: choicesMap[1]?.text || "",
                optionC: choicesMap[2]?.text || "",
                optionD: choicesMap[3]?.text || "",
                answerKey: key,
              });
            }
          }
        }
      }
    }

    // Jika tidak ada format spesifik Blackboard tapi ada file teks biasa di dalam zip
    if (questions.length === 0) {
      for (const fileName of files) {
        if (fileName.endsWith(".txt") || fileName.endsWith(".csv")) {
          const content = await zip.files[fileName].async("text");
          const fallbackParsed = parseRawTextQuestions(content);
          if (fallbackParsed.length > 0) {
            return fallbackParsed;
          }
        }
      }
    }

    return questions;
  } catch (err: any) {
    console.error("Gagal membaca Blackboard ZIP:", err);
    throw new Error(`Berkas Blackboard ZIP tidak valid atau rusak: ${err.message}`);
  }
}
