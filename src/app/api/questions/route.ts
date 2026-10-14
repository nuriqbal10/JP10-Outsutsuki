export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { questions } from "@/db/schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterStr = searchParams.get("chapter");
    const section = searchParams.get("section");

    if (chapterStr === null) {
      return NextResponse.json({ error: "Parameter 'chapter' wajib diisi." }, { status: 400 });
    }

    const chapter = parseInt(chapterStr, 10);

    let conditions = [eq(questions.chapter, chapter)];
    if (section) {
      conditions.push(eq(questions.section, section));
    }

    const result = await db
      .select({
        id: questions.id,
        level: questions.level,
        chapter: questions.chapter,
        section: questions.section,
        questionNumber: questions.questionNumber,
        stimulusText: questions.stimulusText,
        audioR2Url: questions.audioR2Url,
        imageR2Url: questions.imageR2Url,
        questionText: questions.questionText,
        optionA: questions.optionA,
        optionB: questions.optionB,
        optionC: questions.optionC,
        optionD: questions.optionD,
        answerKey: questions.answerKey,
        explanation: questions.explanation,
      })
      .from(questions)
      .where(and(...conditions))
      .orderBy(questions.questionNumber);

    return NextResponse.json({
      success: true,
      chapter,
      section: section || "all",
      total: result.length,
      data: result,
    });
  } catch (error: any) {
    console.error("Gagal mengambil soal dari Neon:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, questionText, optionA, optionB, optionC, optionD, answerKey, explanation, stimulusText, imageR2Url, audioR2Url } = body;

    if (!id) {
      return NextResponse.json({ error: "Parameter 'id' wajib diisi." }, { status: 400 });
    }

    const updated = await db
      .update(questions)
      .set({
        ...(questionText !== undefined ? { questionText } : {}),
        ...(optionA !== undefined ? { optionA } : {}),
        ...(optionB !== undefined ? { optionB } : {}),
        ...(optionC !== undefined ? { optionC } : {}),
        ...(optionD !== undefined ? { optionD } : {}),
        ...(answerKey !== undefined ? { answerKey } : {}),
        ...(explanation !== undefined ? { explanation } : {}),
        ...(stimulusText !== undefined ? { stimulusText } : {}),
        ...(imageR2Url !== undefined ? { imageR2Url } : {}),
        ...(audioR2Url !== undefined ? { audioR2Url } : {}),
      })
      .where(eq(questions.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updated[0],
    });
  } catch (error: any) {
    console.error("Gagal update soal:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      level = "A2.2",
      chapter,
      section,
      questionNumber,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      answerKey,
      explanation,
      stimulusText,
      imageR2Url,
      audioR2Url,
    } = body;

    if (chapter === undefined || !section || !questionText || !optionA || !optionB || !optionC || !answerKey) {
      return NextResponse.json(
        { error: "Mohon lengkapi field wajib: chapter, section, questionText, opsi A/B/C, dan kunci jawaban." },
        { status: 400 }
      );
    }

    // Auto determine questionNumber if not provided
    let finalQNum = questionNumber;
    if (!finalQNum) {
      const existing = await db
        .select({ qNum: questions.questionNumber })
        .from(questions)
        .where(and(eq(questions.chapter, chapter), eq(questions.section, section)))
        .orderBy(questions.questionNumber);
      finalQNum = (existing[existing.length - 1]?.qNum || 0) + 1;
    }

    const inserted = await db
      .insert(questions)
      .values({
        level,
        chapter,
        section,
        questionNumber: finalQNum,
        questionText,
        optionA,
        optionB,
        optionC,
        optionD: optionD || null,
        answerKey: answerKey.toLowerCase(),
        explanation: explanation || null,
        stimulusText: stimulusText || null,
        imageR2Url: imageR2Url || null,
        audioR2Url: audioR2Url || null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: inserted[0],
    });
  } catch (error: any) {
    console.error("Gagal menambah soal:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");
    if (!idStr) {
      return NextResponse.json({ error: "Parameter 'id' wajib diisi." }, { status: 400 });
    }
    const id = parseInt(idStr, 10);
    const deleted = await db.delete(questions).where(eq(questions.id, id)).returning();
    return NextResponse.json({ success: true, data: deleted[0] });
  } catch (error: any) {
    console.error("Gagal menghapus soal:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
