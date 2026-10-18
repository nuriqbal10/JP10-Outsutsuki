import JSZip from "jszip";

export interface ParsedQuestion {
  questionNumber?: number;
  questionText: string;
  stimulusText?: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD?: string;
  answerKey: string; // 'a', 'b', 'c', 'd'
  explanation?: string;
  section?: string; // 'moji_goi', 'kaiwa_hyougen', 'choukai', 'dokkai'
  rawSource?: string;
  hasDetectedKey: boolean;
  formatDetected: string;
}

/**
 * 1. AIKEN FORMAT PARSER (Moodle Standard)
 */
export function parseAikenFormat(text: string): ParsedQuestion[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  const questions: ParsedQuestion[] = [];
  let currentQText = "";
  let options: { [key: string]: string } = {};
  let currentKey = "";
  let lineIdx = 0;

  const flushQuestion = () => {
    if (currentQText && (options["a"] || options["A"])) {
      const optA = options["A"] || options["a"] || "";
      const optB = options["B"] || options["b"] || "";
      const optC = options["C"] || options["c"] || "";
      const optD = options["D"] || options["d"] || "";
      questions.push({
        questionNumber: questions.length + 1,
        questionText: currentQText,
        optionA: optA,
        optionB: optB,
        optionC: optC,
        optionD: optD || undefined,
        answerKey: (currentKey || "A").toLowerCase(),
        hasDetectedKey: Boolean(currentKey),
        formatDetected: "Aiken Text",
      });
    }
    currentQText = "";
    options = {};
    currentKey = "";
  };

  while (lineIdx < lines.length) {
    const line = lines[lineIdx];
    lineIdx++;
    if (!line) continue;

    // Check ANSWER line
    const ansMatch = line.match(/^ANSWER\s*:\s*([A-D])/i);
    if (ansMatch) {
      currentKey = ansMatch[1].toUpperCase();
      flushQuestion();
      continue;
    }

    // Check Option line (A. or A) or A)
    const optMatch = line.match(/^([A-D])[\.\)]\s*(.+)$/i);
    if (optMatch && currentQText) {
      const letter = optMatch[1].toUpperCase();
      options[letter] = optMatch[2].trim();
      continue;
    }

    // Otherwise, it's either question text or stimulus
    if (Object.keys(options).length > 0) {
      // We already collected options but hit a non-answer line, flush previous
      flushQuestion();
    }

    if (!currentQText) {
      // Remove leading number if present (e.g., "1. Soal...")
      currentQText = line.replace(/^\d+[\.\)]\s*/, "");
    } else {
      currentQText += "\n" + line;
    }
  }

  flushQuestion();
  return questions;
}

/**
 * 2. BLACKBOARD TAB-DELIMITED FORMAT PARSER
 */
export function parseBlackboardFormat(text: string): ParsedQuestion[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const questions: ParsedQuestion[] = [];

  for (const line of lines) {
    const parts = line.split("\t").map((p) => p.trim());
    if (parts.length < 5) continue;

    const qType = parts[0].toUpperCase();
    if (qType === "MC" || qType === "MULTIPLE CHOICE") {
      const qText = parts[1];
      // Remaining pairs: [OptionText, 'correct'/'incorrect', OptionText, 'correct'/'incorrect', ...]
      const rawOpts: { text: string; isCorrect: boolean }[] = [];
      for (let i = 2; i < parts.length; i += 2) {
        if (parts[i]) {
          const optText = parts[i];
          const status = (parts[i + 1] || "").toLowerCase();
          rawOpts.push({
            text: optText,
            isCorrect: status.includes("correct") && !status.includes("incorrect"),
          });
        }
      }

      if (rawOpts.length >= 3) {
        let correctKey = "a";
        const keys = ["a", "b", "c", "d"];
        rawOpts.forEach((opt, idx) => {
          if (opt.isCorrect && idx < 4) {
            correctKey = keys[idx];
          }
        });

        questions.push({
          questionNumber: questions.length + 1,
          questionText: qText,
          optionA: rawOpts[0]?.text || "",
          optionB: rawOpts[1]?.text || "",
          optionC: rawOpts[2]?.text || "",
          optionD: rawOpts[3]?.text || undefined,
          answerKey: correctKey,
          hasDetectedKey: rawOpts.some((o) => o.isCorrect),
          formatDetected: "Blackboard Tab-Delimited",
        });
      }
    }
  }

  return questions;
}

/**
 * 3. MICROSOFT WORD (.DOCX) PARSER WITH HIGHLIGHT / BOLD DETECTION
 */
export async function parseWordDocxWithHighlights(fileBuffer: ArrayBuffer | Uint8Array): Promise<ParsedQuestion[]> {
  const zip = await JSZip.loadAsync(fileBuffer);
  const docXmlFile = zip.file("word/document.xml");
  if (!docXmlFile) {
    throw new Error("Berkas Word tidak valid: file 'word/document.xml' tidak ditemukan.");
  }

  const xmlContent = await docXmlFile.async("string");

  // Simple and fast XML paragraph scanning
  // Extract all <w:p> paragraphs
  const pRegex = /<w:p(?:\s+[^>]*)?>([\s\S]*?)<\/w:p>/g;
  let pMatch: RegExpExecArray | null;

  interface ParagraphData {
    text: string;
    hasHighlight: boolean;
    isBold: boolean;
  }

  const paragraphs: ParagraphData[] = [];

  while ((pMatch = pRegex.exec(xmlContent)) !== null) {
    const pBody = pMatch[1];
    // Inside this paragraph, extract all runs <w:r>
    const rRegex = /<w:r(?:\s+[^>]*)?>([\s\S]*?)<\/w:r>/g;
    let rMatch: RegExpExecArray | null;

    let pText = "";
    let pHasHighlight = false;
    let pIsBold = false;

    while ((rMatch = rRegex.exec(pBody)) !== null) {
      const rBody = rMatch[1];

      // Check if run has highlight or bold
      const isRunHighlighted = /<w:highlight(?:\s+[^>]*)?\/>|<w:highlight[\s>]/i.test(rBody);
      const isRunBold = /<w:b(?:\s+[^>]*)?\/>|<w:b[\s>]/i.test(rBody);

      // Extract text content inside <w:t>
      const tRegex = /<w:t(?:\s+[^>]*)?>([\s\S]*?)<\/w:t>/g;
      let tMatch: RegExpExecArray | null;
      let runText = "";
      while ((tMatch = tRegex.exec(rBody)) !== null) {
        runText += tMatch[1];
      }

      if (runText) {
        pText += runText;
        if (isRunHighlighted) pHasHighlight = true;
        if (isRunBold) pIsBold = true;
      }
    }

    const cleanPText = pText.trim();
    if (cleanPText) {
      paragraphs.push({
        text: cleanPText,
        hasHighlight: pHasHighlight,
        isBold: pIsBold,
      });
    }
  }

  // Now process paragraphs into questions and options
  const questions: ParsedQuestion[] = [];
  let currentQText = "";
  let currentOptions: { letter: string; text: string; isHighlighted: boolean; isBold: boolean }[] = [];
  let currentExplicitKey = "";

  const flushQuestion = () => {
    if (currentQText && currentOptions.length >= 3) {
      let key = "a";
      let detected = false;

      // 1. Check explicit highlight
      const highlightedOpt = currentOptions.find((o) => o.isHighlighted);
      if (highlightedOpt) {
        key = highlightedOpt.letter.toLowerCase();
        detected = true;
      } else if (currentExplicitKey) {
        key = currentExplicitKey.toLowerCase();
        detected = true;
      } else {
        // 2. Check bold if no highlight
        const boldOpt = currentOptions.find((o) => o.isBold);
        if (boldOpt) {
          key = boldOpt.letter.toLowerCase();
          detected = true;
        }
      }

      const optA = currentOptions.find((o) => o.letter.toUpperCase() === "A")?.text || currentOptions[0]?.text || "";
      const optB = currentOptions.find((o) => o.letter.toUpperCase() === "B")?.text || currentOptions[1]?.text || "";
      const optC = currentOptions.find((o) => o.letter.toUpperCase() === "C")?.text || currentOptions[2]?.text || "";
      const optD = currentOptions.find((o) => o.letter.toUpperCase() === "D")?.text || currentOptions[3]?.text || "";

      questions.push({
        questionNumber: questions.length + 1,
        questionText: currentQText,
        optionA: optA,
        optionB: optB,
        optionC: optC,
        optionD: optD || undefined,
        answerKey: key,
        hasDetectedKey: detected,
        formatDetected: "Word (.docx) Highlight/Bold",
      });
    }

    currentQText = "";
    currentOptions = [];
    currentExplicitKey = "";
  };

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const text = p.text;

    // Check ANSWER line
    const ansMatch = text.match(/^(?:ANSWER|KUNCI|JAWABAN)\s*:\s*([A-D])/i);
    if (ansMatch) {
      currentExplicitKey = ansMatch[1].toUpperCase();
      flushQuestion();
      continue;
    }

    // Check Option pattern (e.g., A. teks, A) teks, *A. teks, a. teks)
    const optMatch = text.match(/^(\*?)\s*([A-D])[\.\)]\s*(.+)$/i);
    if (optMatch && currentQText) {
      const hasAsterisk = Boolean(optMatch[1]);
      const letter = optMatch[2].toUpperCase();
      const optText = optMatch[3].trim();
      currentOptions.push({
        letter,
        text: optText,
        isHighlighted: p.hasHighlight || hasAsterisk,
        isBold: p.isBold,
      });
      continue;
    }

    // If options are already collected and we encounter a new non-option line, flush!
    if (currentOptions.length > 0) {
      flushQuestion();
    }

    // Clean question number (e.g., "1. Soal" -> "Soal")
    const cleanedQ = text.replace(/^\d+[\.\)]\s*/, "");
    if (!currentQText) {
      currentQText = cleanedQ;
    } else {
      currentQText += "\n" + cleanedQ;
    }
  }

  flushQuestion();
  return questions;
}

/**
 * 4. CSV / EXCEL TSV PARSER
 */
export function parseCsvFormat(csvText: string): ParsedQuestion[] {
  const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  const questions: ParsedQuestion[] = [];
  const delimiter = csvText.includes("\t") ? "\t" : csvText.includes(";") ? ";" : ",";

  const startIndex = lines[0].toLowerCase().includes("soal") || lines[0].toLowerCase().includes("question") ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const cols = lines[i].split(delimiter).map((c) => c.replace(/^["']|["']$/g, "").trim());
    if (cols.length >= 5) {
      // Heuristic: [Soal, OpsiA, OpsiB, OpsiC, OpsiD, Kunci, ...]
      const qText = cols[0];
      const optA = cols[1];
      const optB = cols[2];
      const optC = cols[3];
      const optD = cols.length > 5 ? cols[4] : undefined;
      const keyCol = cols.length > 5 ? cols[5] : cols[4];
      const key = (keyCol || "a").toLowerCase().replace(/[^a-d]/g, "") || "a";

      questions.push({
        questionNumber: questions.length + 1,
        questionText: qText,
        optionA: optA,
        optionB: optB,
        optionC: optC,
        optionD: optD || undefined,
        answerKey: key,
        hasDetectedKey: Boolean(keyCol),
        formatDetected: "CSV/Excel",
      });
    }
  }

  return questions;
}
