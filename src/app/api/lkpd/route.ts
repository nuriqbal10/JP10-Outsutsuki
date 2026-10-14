export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { lkpdSubmissions } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chapter = searchParams.get("chapter");

    let query = db.select().from(lkpdSubmissions).orderBy(desc(lkpdSubmissions.submittedAt));

    let data;
    if (chapter) {
      data = await db
        .select()
        .from(lkpdSubmissions)
        .where(eq(lkpdSubmissions.chapter, parseInt(chapter, 10)))
        .orderBy(desc(lkpdSubmissions.submittedAt));
    } else {
      data = await query.limit(100);
    }

    return NextResponse.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err: any) {
    console.error("GET /api/lkpd error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id || crypto.randomUUID();

    const parsedScore = body.score !== undefined && body.score !== null ? Math.round(Number(body.score)) : null;

    const newSubmission = {
      id,
      userId: body.userId || null,
      studentName: body.studentName || "Peserta Irodori",
      chapter: body.chapter ? parseInt(body.chapter, 10) : 1,
      answersJson: body.answersJson || {},
      fileAttachmentUrl: body.fileAttachmentUrl || null,
      status: body.status || "submitted",
      score: parsedScore,
      feedback: body.feedback || null,
      submittedAt: new Date(),
      gradedAt: parsedScore !== null ? new Date() : null,
    };

    await db.insert(lkpdSubmissions).values(newSubmission);

    return NextResponse.json({
      success: true,
      message: "Tugas LKPD berhasil dikumpulkan ke sistem LMS!",
      data: newSubmission,
    });
  } catch (err: any) {
    console.error("POST /api/lkpd error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, score, feedback } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID tugas diperlukan" }, { status: 400 });
    }

    const updated = await db
      .update(lkpdSubmissions)
      .set({
        score: typeof score === "number" ? score : parseInt(score, 10),
        feedback: feedback || "",
        status: "graded",
        gradedAt: new Date(),
      })
      .where(eq(lkpdSubmissions.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Penilaian & feedback LKPD berhasil disimpan oleh Sensei!",
      data: updated[0],
    });
  } catch (err: any) {
    console.error("PUT /api/lkpd error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
