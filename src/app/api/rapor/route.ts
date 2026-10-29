export const runtime = "edge";

import { NextResponse } from "next/server";
import masterRaporDataRaw from "@/data/raporMasterData.json";
import { MasterRaporData, StudentRaporItem, LevelRaporData } from "@/types/rapor";

const masterRaporData = masterRaporDataRaw as unknown as MasterRaporData;

function calculateStudentMetrics(student: StudentRaporItem) {
  // Hitung rata-rata Dai-Test yang sudah terisi (> 0)
  const validDai = student.harian.filter((h) => h.daiTesuto && h.daiTesuto.total > 0);
  const avgDai = validDai.length > 0
    ? validDai.reduce((acc, cur) => acc + cur.daiTesuto.total, 0) / validDai.length
    : 0;

  // Hitung rata-rata kanji, kotoba
  const validKanji = student.harian.filter((h) => h.kanji > 0);
  const avgKanji = validKanji.length > 0
    ? validKanji.reduce((acc, cur) => acc + cur.kanji, 0) / validKanji.length
    : 0;

  const validKotoba = student.harian.filter((h) => h.kotoba > 0);
  const avgKotoba = validKotoba.length > 0
    ? validKotoba.reduce((acc, cur) => acc + cur.kotoba, 0) / validKotoba.length
    : 0;

  // Rata-rata 5 pilar (Moji-Goi, Kaiwa, Choukai, Dokkai, Kanji)
  // Bobot persentase dari skor maksimum
  // Dai-Test maks 100 (moji 24, kaiwa 24, choukai 24, dokkai 28)
  let sumMoji = 0, sumKaiwa = 0, sumChoukai = 0, sumDokkai = 0;
  if (validDai.length > 0) {
    validDai.forEach((h) => {
      sumMoji += (h.daiTesuto.mojiGoi / 24) * 100;
      sumKaiwa += (h.daiTesuto.kaiwa / 24) * 100;
      sumChoukai += (h.daiTesuto.choukai / 24) * 100;
      sumDokkai += (h.daiTesuto.dokkai / 28) * 100;
    });
  }

  const pilar = {
    mojiGoi: validDai.length > 0 ? Math.min(100, Math.round(sumMoji / validDai.length)) : 0,
    kaiwa: validDai.length > 0 ? Math.min(100, Math.round(sumKaiwa / validDai.length)) : 0,
    choukai: validDai.length > 0 ? Math.min(100, Math.round(sumChoukai / validDai.length)) : 0,
    dokkai: validDai.length > 0 ? Math.min(100, Math.round(sumDokkai / validDai.length)) : 0,
    kanji: Math.min(100, Math.round(avgKanji)),
  };

  // Composite Score
  const composite = Math.round(
    (pilar.mojiGoi * 0.2 +
      pilar.kaiwa * 0.2 +
      pilar.choukai * 0.25 +
      pilar.dokkai * 0.25 +
      pilar.kanji * 0.1) *
      10
  ) / 10;

  let grade = "D";
  if (composite >= 85) grade = "A";
  else if (composite >= 70) grade = "B";
  else if (composite >= 55) grade = "C";

  return {
    composite,
    grade,
    pilar,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const levelKey = (searchParams.get("level") || "A22") as "A1" | "A21" | "A22";

    const levelData: LevelRaporData = masterRaporData.levels[levelKey] || masterRaporData.levels.A22;

    // Enrich students with dynamic metrics and rankings
    const enrichedStudents = levelData.students.map((s) => {
      const metrics = calculateStudentMetrics(s);
      return {
        ...s,
        compositeScore: metrics.composite,
        grade: metrics.grade,
        pilar: metrics.pilar,
      };
    });

    // Urutkan ranking berdasarkan compositeScore descending
    const rankedStudents = [...enrichedStudents].sort((a, b) => (b.compositeScore || 0) - (a.compositeScore || 0));

    // Hitung rata-rata pilar kelas (%)
    const totalCount = rankedStudents.length || 1;
    const classPilarAvg = {
      mojiGoi: Math.round(rankedStudents.reduce((acc, s) => acc + s.pilar.mojiGoi, 0) / totalCount),
      kaiwa: Math.round(rankedStudents.reduce((acc, s) => acc + s.pilar.kaiwa, 0) / totalCount),
      choukai: Math.round(rankedStudents.reduce((acc, s) => acc + s.pilar.choukai, 0) / totalCount),
      dokkai: Math.round(rankedStudents.reduce((acc, s) => acc + s.pilar.dokkai, 0) / totalCount),
      kanji: Math.round(rankedStudents.reduce((acc, s) => acc + s.pilar.kanji, 0) / totalCount),
    };

    // Hitung rata-rata skor mentah per seksi (skala harian)
    const classRawSectionAvg = {
      mojiGoi: Math.round((rankedStudents.reduce((acc, s) => acc + (s.averages?.mojiGoi || 0), 0) / totalCount) * 10) / 10,
      kaiwa: Math.round((rankedStudents.reduce((acc, s) => acc + (s.averages?.kaiwa || 0), 0) / totalCount) * 10) / 10,
      choukai: Math.round((rankedStudents.reduce((acc, s) => acc + (s.averages?.choukai || 0), 0) / totalCount) * 10) / 10,
      dokkai: Math.round((rankedStudents.reduce((acc, s) => acc + (s.averages?.dokkai || 0), 0) / totalCount) * 10) / 10,
      kanji: Math.round((rankedStudents.reduce((acc, s) => acc + (s.averages?.kanji || 0), 0) / totalCount) * 10) / 10,
      kotoba: Math.round((rankedStudents.reduce((acc, s) => acc + (s.averages?.kotoba || 0), 0) / totalCount) * 10) / 10,
      honyaku: Math.round((rankedStudents.reduce((acc, s) => acc + (s.averages?.honyaku || 0), 0) / totalCount) * 10) / 10,
    };

    // Hitung rata-rata khusus Shiken 1 Buku (Final Exam / 総括終了試験 - 250 pt)
    const validFinal = rankedStudents.filter((s) => s.finalExam && (s.finalExam.test.total || 0) > 0);
    const finalCount = validFinal.length || 1;
    const finalAvgMoji = Math.round((validFinal.reduce((acc, s) => acc + (s.finalExam?.test.mojiGoi || 0), 0) / finalCount) * 10) / 10;
    const finalAvgKaiwa = Math.round((validFinal.reduce((acc, s) => acc + (s.finalExam?.test.kaiwa || 0), 0) / finalCount) * 10) / 10;
    const finalAvgChoukai = Math.round((validFinal.reduce((acc, s) => acc + (s.finalExam?.test.choukai || 0), 0) / finalCount) * 10) / 10;
    const finalAvgDokkai = Math.round((validFinal.reduce((acc, s) => acc + (s.finalExam?.test.dokkai || 0), 0) / finalCount) * 10) / 10;
    const finalAvgTotal = Math.round((validFinal.reduce((acc, s) => acc + (s.finalExam?.test.total || 0), 0) / finalCount) * 10) / 10;
    const finalAvgKanji = Math.round((validFinal.reduce((acc, s) => acc + (s.finalExam?.kanji || 0), 0) / finalCount) * 10) / 10;

    // Evaluasi persentase ketercapaian per seksi di Shiken Buku
    const pctMoji = Math.round((finalAvgMoji / 48) * 100);
    const pctKaiwa = Math.round((finalAvgKaiwa / 48) * 100);
    const pctChoukai = Math.round((finalAvgChoukai / 66) * 100);
    const pctDokkai = Math.round((finalAvgDokkai / 88) * 100);

    const sectionsRanked = [
      { id: "mojiGoi", name: "文字・語彙 (Moji-Goi)", pct: pctMoji, avg: finalAvgMoji, max: 48 },
      { id: "kaiwa", name: "会話・表現 (Kaiwa)", pct: pctKaiwa, avg: finalAvgKaiwa, max: 48 },
      { id: "choukai", name: "聴解 (Choukai)", pct: pctChoukai, avg: finalAvgChoukai, max: 66 },
      { id: "dokkai", name: "読解 (Dokkai)", pct: pctDokkai, avg: finalAvgDokkai, max: 88 },
    ].sort((a, b) => a.pct - b.pct);

    const passedFinalCount = validFinal.filter((s) => (s.finalExam?.test.total || 0) >= 200).length;

    const classFinalExamAvg = {
      mojiGoi: finalAvgMoji,
      kaiwa: finalAvgKaiwa,
      choukai: finalAvgChoukai,
      dokkai: finalAvgDokkai,
      total: finalAvgTotal,
      kanji: finalAvgKanji,
      pctMoji,
      pctKaiwa,
      pctChoukai,
      pctDokkai,
      passCount: passedFinalCount,
      totalStudents: validFinal.length,
      passRate: Math.round((passedFinalCount / finalCount) * 100),
      weakestSection: sectionsRanked[0],
      strongestSection: sectionsRanked[sectionsRanked.length - 1],
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          key: levelData.key,
          title: levelData.title,
          sub: levelData.sub,
          classSummary: levelData.classSummary,
          chapterClassAverages: levelData.chapterClassAverages,
          classPilarAvg,
          classRawSectionAvg,
          classFinalExamAvg,
          students: enrichedStudents,
          rankedStudents,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    console.error("Gagal memproses data rapor:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses data rapor: " + error.message },
      { status: 500 }
    );
  }
}
