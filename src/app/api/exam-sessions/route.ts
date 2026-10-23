export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { examSessions, questions } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chapter = searchParams.get("chapter");

    let query = db.select().from(examSessions).orderBy(desc(examSessions.completedAt));

    let sessions;
    if (chapter) {
      sessions = await db
        .select()
        .from(examSessions)
        .where(eq(examSessions.chapter, parseInt(chapter, 10)))
        .orderBy(desc(examSessions.completedAt));
    } else {
      sessions = await query.limit(100);
    }

    return NextResponse.json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (err: any) {
    console.error("GET /api/exam-sessions error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id || crypto.randomUUID();
    const chapter = body.chapter ? parseInt(body.chapter, 10) : 1;
    const answersJson = (body.answersJson || {}) as Record<string | number, string>;

    // 1. Ambil seluruh kunci jawaban resmi dari database untuk bab yang bersangkutan
    const officialQuestions = await db
      .select({
        id: questions.id,
        section: questions.section,
        answerKey: questions.answerKey,
        explanation: questions.explanation,
      })
      .from(questions)
      .where(eq(questions.chapter, chapter));

    let verifiedTotalScore = 0;
    let scoreMojiGoi = 0;
    let scoreKaiwa = 0;
    let scoreChoukai = 0;
    let scoreDokkai = 0;
    let verifiedCorrectCount = 0;
    const totalQuestions = officialQuestions.length;

    const answerKeysMap: Record<number, { answerKey: string; explanation: string | null; isCorrect: boolean }> = {};

    if (totalQuestions > 0) {
      // Server-side grading: Bandingkan jawaban peserta dengan kunci jawaban database resmi
      for (const q of officialQuestions) {
        const studentAns = (answersJson[q.id] || answersJson[String(q.id)] || "").toLowerCase().trim();
        const correctAns = (q.answerKey || "").toLowerCase().trim();
        const isCorrect = studentAns === correctAns && studentAns !== "";

        if (isCorrect) {
          verifiedCorrectCount++;
          if (q.section === "moji_goi") scoreMojiGoi++;
          else if (q.section === "kaiwa") scoreKaiwa++;
          else if (q.section === "choukai") scoreChoukai++;
          else if (q.section === "dokkai") scoreDokkai++;
        }

        answerKeysMap[q.id] = {
          answerKey: q.answerKey,
          explanation: q.explanation,
          isCorrect,
        };
      }

      // Standar Skor JFT-Basic: Skala 250 poin (Ambang kelulusan: 200 poin / 80%)
      verifiedTotalScore = Math.round((verifiedCorrectCount / totalQuestions) * 250);
    } else {
      // Fallback jika database bank soal untuk bab tersebut belum terisi
      verifiedTotalScore = Number(body.totalScore) || 0;
      verifiedCorrectCount = Number(body.correctCount) || 0;
    }

    const isPassed = verifiedTotalScore >= 200;

    const newSession = {
      id,
      userId: body.userId || null,
      studentName: body.studentName || "Peserta CBT",
      examType: body.examType || "chapter_cbt",
      chapter,
      totalScore: verifiedTotalScore,
      maxScore: 250,
      scoreMojiGoi,
      scoreKaiwa,
      scoreChoukai,
      scoreDokkai,
      isPassed,
      answersJson,
      startedAt: body.startedAt ? new Date(body.startedAt) : new Date(),
      completedAt: new Date(),
    };

    await db.insert(examSessions).values(newSession);

    return NextResponse.json({
      success: true,
      message: "Ujian CBT berhasil dinilai secara aman dan disimpan ke database!",
      data: {
        ...newSession,
        verifiedCorrectCount,
        totalQuestions,
        answerKeys: answerKeysMap,
      },
    });
  } catch (err: any) {
    console.error("POST /api/exam-sessions error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
