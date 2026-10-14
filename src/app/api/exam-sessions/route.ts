export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { examSessions } from "@/db/schema";
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

    const newSession = {
      id,
      userId: body.userId || null,
      studentName: body.studentName || "Peserta CBT",
      examType: body.examType || "chapter_cbt",
      chapter: body.chapter ? parseInt(body.chapter, 10) : 1,
      totalScore: body.totalScore || 0,
      maxScore: body.maxScore || 250,
      scoreMojiGoi: body.scoreMojiGoi || 0,
      scoreKaiwa: body.scoreKaiwa || 0,
      scoreChoukai: body.scoreChoukai || 0,
      scoreDokkai: body.scoreDokkai || 0,
      isPassed: Boolean(body.isPassed),
      answersJson: body.answersJson || {},
      startedAt: body.startedAt ? new Date(body.startedAt) : new Date(),
      completedAt: new Date(),
    };

    await db.insert(examSessions).values(newSession);

    return NextResponse.json({
      success: true,
      message: "Sesi ujian berhasil disimpan ke database!",
      data: newSession,
    });
  } catch (err: any) {
    console.error("POST /api/exam-sessions error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
