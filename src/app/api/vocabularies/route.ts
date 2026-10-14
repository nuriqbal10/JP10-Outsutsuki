export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { vocabularies } from "@/db/schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterStr = searchParams.get("chapter");
    const level = searchParams.get("level") || "初級2";

    let conditions = [eq(vocabularies.level, level)];
    if (chapterStr !== null) {
      const chapter = parseInt(chapterStr, 10);
      conditions.push(eq(vocabularies.chapter, chapter));
    }

    const result = await db
      .select({
        id: vocabularies.id,
        level: vocabularies.level,
        chapter: vocabularies.chapter,
        midashi: vocabularies.midashi,
        yomi: vocabularies.yomi,
        accent: vocabularies.accent,
        romaji: vocabularies.romaji,
        idArti: vocabularies.idArti,
        enMeaning: vocabularies.enMeaning,
        pos: vocabularies.pos,
        info: vocabularies.info,
        audioR2Url: vocabularies.audioR2Url,
      })
      .from(vocabularies)
      .where(and(...conditions))
      .orderBy(vocabularies.id);

    return NextResponse.json({
      success: true,
      total: result.length,
      data: result,
    });
  } catch (error: any) {
    console.error("Gagal mengambil kosakata dari Neon:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
