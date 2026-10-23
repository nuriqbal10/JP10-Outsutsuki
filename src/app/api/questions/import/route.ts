export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { questions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { verifyAdminRequest } from "@/lib/adminAuth";
import {
  parseWordDocxWithHighlights,
  parseAikenFormat,
  parseBlackboardFormat,
  parseCsvFormat,
  ParsedQuestion,
} from "@/lib/questionParsers";

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminRequest(request)) {
      return NextResponse.json(
        { error: "Akses ditolak: Otorisasi admin diperlukan untuk mengimpor bank soal." },
        { status: 401 }
      );
    }

    const contentType = request.headers.get("content-type") || "";

    // 1. JIKA MENERIMA JSON ARRAY SOAL TERVERIFIKASI UNTUK DISIMPAN KE NEON
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const { chapter, section, items } = body as {
        chapter: number;
        section: string;
        items: ParsedQuestion[];
      };

      if (chapter === undefined || !section || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json(
          { error: "Mohon sediakan parameter chapter, section, dan array items soal." },
          { status: 400 }
        );
      }

      // Cari nomor urut soal terakhir pada bab dan seksi ini
      const existing = await db
        .select({ qNum: questions.questionNumber })
        .from(questions)
        .where(and(eq(questions.chapter, chapter), eq(questions.section, section)))
        .orderBy(questions.questionNumber);

      let currentNum = existing.length > 0 ? (existing[existing.length - 1]?.qNum || 0) : 0;

      const toInsert = items.map((q) => {
        currentNum++;
        return {
          level: "A2.2",
          chapter,
          section,
          questionNumber: currentNum,
          questionText: q.questionText,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD || null,
          answerKey: (q.answerKey || "a").toLowerCase(),
          explanation: q.explanation || null,
          stimulusText: q.stimulusText || null,
        };
      });

      const inserted = await db.insert(questions).values(toInsert).returning();

      return NextResponse.json({
        success: true,
        totalInserted: inserted.length,
        data: inserted,
      });
    }

    // 2. JIKA MENERIMA FORMDATA (UPLOAD FILE WORD DOCX / TXT / CSV UNTUK DI-PARSE)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "File tidak ditemukan dalam form upload." }, { status: 400 });
      }

      const fileName = file.name.toLowerCase();
      const buffer = await file.arrayBuffer();

      let parsed: ParsedQuestion[] = [];
      let format = "unknown";

      if (fileName.endsWith(".docx")) {
        format = "Word (.docx) Highlight & Bold";
        parsed = await parseWordDocxWithHighlights(buffer);
      } else if (fileName.endsWith(".txt")) {
        const textDecoder = new TextDecoder("utf-8");
        const textContent = textDecoder.decode(buffer);

        // Check if Blackboard tab-delimited
        if (textContent.includes("\t") && /^(?:MC|MULTIPLE CHOICE)\b/im.test(textContent)) {
          format = "Blackboard Tab-Delimited";
          parsed = parseBlackboardFormat(textContent);
        } else {
          // Default to Aiken
          format = "Aiken Format";
          parsed = parseAikenFormat(textContent);
        }
      } else if (fileName.endsWith(".csv") || fileName.endsWith(".tsv")) {
        const textDecoder = new TextDecoder("utf-8");
        const textContent = textDecoder.decode(buffer);
        format = "CSV / Excel";
        parsed = parseCsvFormat(textContent);
      } else {
        return NextResponse.json(
          { error: "Format berkas tidak didukung. Harap unggah berkas .docx, .txt (Aiken/Blackboard), atau .csv." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        fileName: file.name,
        formatDetected: format,
        totalParsed: parsed.length,
        questions: parsed,
      });
    }

    return NextResponse.json({ error: "Content-Type tidak didukung." }, { status: 400 });
  } catch (error: any) {
    console.error("Gagal parse / simpan soal bulk:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan internal saat memproses soal." },
      { status: 500 }
    );
  }
}
