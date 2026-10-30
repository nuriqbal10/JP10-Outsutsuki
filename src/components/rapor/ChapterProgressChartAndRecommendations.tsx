"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Target,
  BookOpen,
  Sparkles,
  ArrowRight,
  Filter,
  User,
  HelpCircle,
  Layers,
  ChevronRight,
  Printer,
} from "lucide-react";
import { StudentRaporItem } from "@/types/rapor";
import { CHAPTER_MODULES } from "@/data/chapterModules";

interface ChapterProgressChartAndRecommendationsProps {
  students: StudentRaporItem[];
  kkm: number;
  selectedStudentNo?: number;
  onSelectStudent?: (no: number) => void;
  onOpenStudentDetail?: (student: StudentRaporItem) => void;
}

export default function ChapterProgressChartAndRecommendations({
  students,
  kkm,
  selectedStudentNo,
  onSelectStudent,
  onOpenStudentDetail,
}: ChapterProgressChartAndRecommendationsProps) {
  const [filterStatus, setFilterStatus] = useState<"all" | "danger" | "warning" | "passed">("all");
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [compareStudentNo, setCompareStudentNo] = useState<number>(selectedStudentNo || students[0]?.no || 1);

  const selectedStudent = useMemo(() => {
    return students.find((s) => s.no === compareStudentNo) || students[0] || null;
  }, [students, compareStudentNo]);

  // Hitung Agregat Rata-Rata Kelas & Status Ketercapaian untuk 18 Bab
  const chapterStats = useMemo(() => {
    const totalStudents = students.length || 28;

    return Array.from({ length: 18 }, (_, idx) => {
      const chNum = idx + 1;
      const mod = CHAPTER_MODULES[chNum];
      const validStudents = students.filter((s) => {
        const h = s.harian?.[idx];
        return h && h.daiTesuto && h.daiTesuto.total > 0;
      });

      const hasData = validStudents.length > 0;
      const count = validStudents.length;
      let sumTot = 0, sumM = 0, sumK = 0, sumC = 0, sumD = 0, sumKanji = 0;
      let passCount = 0;

      if (hasData) {
        validStudents.forEach((s) => {
          const h = s.harian?.[idx];
          const dt = h?.daiTesuto || { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 };
          const kj = typeof h?.kanji === "number" ? h.kanji : 0;
          sumTot += dt.total;
          sumM += dt.mojiGoi;
          sumK += dt.kaiwa;
          sumC += dt.choukai;
          sumD += dt.dokkai;
          sumKanji += kj;

          if (dt.total >= kkm) {
            passCount++;
          }
        });
      }

      const avgTotal = hasData ? Math.round((sumTot / count) * 10) / 10 : 0;
      const avgMoji = hasData ? Math.round((sumM / count) * 10) / 10 : 0;
      const avgKaiwa = hasData ? Math.round((sumK / count) * 10) / 10 : 0;
      const avgChoukai = hasData ? Math.round((sumC / count) * 10) / 10 : 0;
      const avgDokkai = hasData ? Math.round((sumD / count) * 10) / 10 : 0;
      const avgKanji = hasData ? Math.round((sumKanji / count) * 10) / 10 : 0;

      const passRate = hasData ? Math.round((passCount / count) * 100) : 0;

      // Status Ketercapaian
      let status: "passed" | "warning" | "danger" | "empty" = "empty";
      if (!hasData) {
        status = "empty";
      } else if (passRate >= 70 || avgTotal >= kkm) {
        status = "passed";
      } else if (passRate >= 40 || avgTotal >= Math.max(50, kkm - 15)) {
        status = "warning";
      } else {
        status = "danger";
      }

      // Deteksi titik paling lemah (persentase terendah)
      const pM = hasData ? (avgMoji / 24) * 100 : 0;
      const pK = hasData ? (avgKaiwa / 24) * 100 : 0;
      const pC = hasData ? (avgChoukai / 24) * 100 : 0;
      const pD = hasData ? (avgDokkai / 28) * 100 : 0;
      const lowestPct = Math.min(pM, pK, pC, pD);

      let weakestAspect = hasData ? "読解 (Dokkai)" : "-";
      let rootCause = hasData
        ? "Siswa kesulitan memahami konteks bacaan instruksi praktis dan kosa kata kontekstual."
        : "Materi bab ini belum ditempuh / ujian harian belum diselenggarakan di kelas.";
      let teacherAction = hasData
        ? "Berikan bimbingan terfokus pada teknik scanning/skimming teks dan bedah pola kalimat kunci."
        : "Siapkan modul ajar dan lembar LKPD untuk persiapan sesi pembelajaran bab ini.";
      let studentAction = hasData
        ? "Kerjakan ulang lembar latihan Dokkai pada LKPD Bab ini dan hafalkan kosakata tematik terkait."
        : "Pelajari materi Can-do dan perbendaharaan kosakata awal pada buku Irodori Bab ini.";

      if (hasData) {
        if (lowestPct === pC) {
          weakestAspect = "聴解 (Choukai)";
          rootCause = "Kecepatan ujaran audio alami dan partikel cepat membingungkan pendengaran siswa.";
          teacherAction = "Lakukan sesi audio shadowing bersama Sensei, perdengarkan audio 2-3 kali dengan bedah transkrip percakapan.";
          studentAction = "Dengarkan kembali rekaman audio LKPD Bab ini secara mandiri minimal 3 putaran sambil menyimak naskah.";
        } else if (lowestPct === pK) {
          weakestAspect = "会話・表現 (Kaiwa)";
          rootCause = "Ragu-ragu dalam pemilihan respons situasional dan perubahan bentuk kata kerja/sopan.";
          teacherAction = "Adakan roleplay simulasi berpasangan di kelas untuk mempraktikkan ungkapan langsung.";
          studentAction = "Latihan berbicara mandiri (shadowing) menggunakan materi dialog Can-do Bab ini.";
        } else if (lowestPct === pM) {
          weakestAspect = "文字・語彙 (Moji-Goi)";
          rootCause = "Penguasaan perbendaharaan kata kunci bab ini belum tuntas dihafalkan.";
          teacherAction = "Berikan kuis kilat kosakata 5 menit sebelum kelas dimulai dan buat mind-map kosakata tematik.";
          studentAction = "Gunakan flashcard digital dan catat minimal 10 kosakata baru dari modul ini ke buku saku.";
        }
      }

      return {
        chapterNum: chNum,
        hasData,
        titleJa: mod?.titleJa || `第${chNum}課`,
        titleId: mod?.titleId || `Materi Bab ${chNum}`,
        topic: mod?.topic || "Kurikulum Irodori A2.2",
        avgTotal,
        avgMoji,
        avgKaiwa,
        avgChoukai,
        avgDokkai,
        avgKanji,
        passCount,
        totalCount: count,
        passRate,
        status,
        weakestAspect,
        rootCause,
        teacherAction,
        studentAction,
      };
    });
  }, [students, kkm]);

  // Filtered Chapters for recommendations
  const filteredChapters = useMemo(() => {
    if (filterStatus === "all") return chapterStats;
    return chapterStats.filter((c) => c.status === filterStatus);
  }, [chapterStats, filterStatus]);

  const activeChapterData = chapterStats.find((c) => c.chapterNum === selectedChapter) || chapterStats[0];

  // SVG Chart Dimensions & Scale
  const chartHeight = 220;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 35;
  const usableWidth = 800 - paddingLeft - paddingRight;
  const usableHeight = chartHeight - paddingTop - paddingBottom;

  const pointsCount = 18;
  const getX = (idx: number) => paddingLeft + (idx / (pointsCount - 1)) * usableWidth;
  const getY = (val: number) => paddingTop + usableHeight - (Math.max(0, Math.min(100, val)) / 100) * usableHeight;

  // Class Line Points & Area Fill (Hanya bab yang sudah ada data)
  const classCoords = chapterStats.map((ch, idx) => ({
    x: getX(idx),
    y: ch.hasData ? getY(ch.avgTotal) : getY(50),
    val: ch.avgTotal,
    chNum: ch.chapterNum,
    hasData: ch.hasData,
  }));

  const activeClassCoords = classCoords.filter((c) => c.hasData);
  const classPolyline = activeClassCoords.map((pt) => `${pt.x},${pt.y}`).join(" ");
  const lastActivePt = activeClassCoords[activeClassCoords.length - 1];
  const classArea = activeClassCoords.length > 0 && lastActivePt
    ? `${paddingLeft},${paddingTop + usableHeight} ${classPolyline} ${lastActivePt.x},${paddingTop + usableHeight}`
    : "";

  // Selected Student Line Points (Hanya bab yang sudah ada data)
  const activeStudentCoords = selectedStudent
    ? chapterStats
        .filter((ch) => ch.hasData)
        .map((ch) => {
          const h = selectedStudent.harian?.[ch.chapterNum - 1];
          const val = h?.daiTesuto?.total || 0;
          return {
            x: getX(ch.chapterNum - 1),
            y: getY(val),
            val,
            chNum: ch.chapterNum,
          };
        })
    : [];

  const studentPolyline = activeStudentCoords.map((pt) => `${pt.x},${pt.y}`).join(" ");

  // KKM line
  const kkmY = getY(kkm);

  return (
    <div className="space-y-6 pt-4">
      {/* ========================================================
          1. HEADER DASBOR DIAGNOSTIK KEMAJUAN BAB
          ======================================================== */}
      <div className="clay-card p-6 sm:p-8 rounded-3xl border border-current/10 shadow-xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-current/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400">
                Visual Diagnostic Matrix
              </span>
              <span className="text-xs font-mono font-bold opacity-70">
                Monitoring Progres 18 Bab
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight font-serif mt-1 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Grafik Kemajuan Belajar &amp; Ketercapaian Bab 1 s.d. 18
            </h3>
            <p className="text-xs opacity-75 mt-0.5 max-w-3xl">
              Visualisasi kurva pergerakan rata-rata kelas di setiap bab terhadap ambang regulasi KKM ({kkm} pt), dilengkapi pembanding siswa dan rekomendasi aksi perbaikan pedagogis terstruktur.
            </p>
          </div>

          {/* Student Compare Selector */}
          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <span className="text-xs font-bold opacity-70 whitespace-nowrap flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-cyan-500" /> Bandingkan Siswa:
            </span>
            <select
              value={compareStudentNo}
              onChange={(e) => {
                const no = Number(e.target.value);
                setCompareStudentNo(no);
                if (onSelectStudent) onSelectStudent(no);
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold border border-current/20 bg-[var(--background)] text-[var(--text-heading)] focus:outline-hidden focus:border-amber-500 cursor-pointer shadow-sm"
            >
              {students.map((st) => (
                <option key={st.no} value={st.no} className="bg-stone-900 text-white">
                  #{st.rank || st.no} - {st.name} ({st.grade || "B"})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ========================================================
            2. GRAFIK KEMAJUAN INTERAKTIF SVG (BAB 1–18)
            ======================================================== */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
                <span className="font-bold">🏛️ Rata-Rata Kelas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-rose-500 border border-rose-500 border-dashed" />
                <span className="font-bold text-rose-500">🎯 Target KKM ({kkm} pt)</span>
              </div>
              {selectedStudent && (
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm" />
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">
                    👤 {selectedStudent.name.split(" ")[0]} (#{selectedStudent.rank || selectedStudent.no})
                  </span>
                </div>
              )}
            </div>

            <span className="text-[11px] opacity-60 italic">
              *Klik pada titik bab mana saja untuk melihat rekomendasi perbaikan
            </span>
          </div>

          {/* SVG Trendline Canvas */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[700px]">
              <svg
                viewBox={`0 0 800 ${chartHeight}`}
                className="w-full h-auto select-none overflow-visible"
              >
                <defs>
                  <linearGradient id="classGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Grid horizontal lines (20, 40, 60, 80, 100) */}
                {[0, 25, 50, 75, 100].map((gridVal) => {
                  const y = getY(gridVal);
                  return (
                    <g key={gridVal}>
                      <line
                        x1={paddingLeft}
                        y1={y}
                        x2={800 - paddingRight}
                        y2={y}
                        stroke="currentColor"
                        strokeOpacity={0.1}
                        strokeWidth={1}
                        strokeDasharray={gridVal === 0 || gridVal === 100 ? "none" : "3,3"}
                      />
                      <text
                        x={paddingLeft - 8}
                        y={y + 3}
                        textAnchor="end"
                        className="text-[9px] font-mono fill-current opacity-50"
                      >
                        {gridVal}
                      </text>
                    </g>
                  );
                })}

                {/* KKM Horizontal Line */}
                <line
                  x1={paddingLeft}
                  y1={kkmY}
                  x2={800 - paddingRight}
                  y2={kkmY}
                  stroke="#f43f5e"
                  strokeWidth={1.5}
                  strokeDasharray="4,4"
                  strokeOpacity={0.8}
                />
                <text
                  x={800 - paddingRight - 4}
                  y={kkmY - 6}
                  textAnchor="end"
                  className="text-[9px] font-bold font-mono fill-rose-500"
                >
                  KKM {kkm} pt
                </text>

                {/* Class Area Gradient */}
                <polygon points={classArea} fill="url(#classGrad)" />

                {/* Class Polyline */}
                <polyline
                  points={classPolyline}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Student Polyline */}
                {selectedStudent && (
                  <polyline
                    points={studentPolyline}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    strokeDasharray="2,2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Class Data Points */}
                {classCoords.map((pt, idx) => {
                  const isSelected = selectedChapter === pt.chNum;
                  if (!pt.hasData) {
                    return (
                      <g
                        key={idx}
                        className="cursor-pointer group"
                        onClick={() => setSelectedChapter(pt.chNum)}
                      >
                        <circle
                          cx={pt.x}
                          cy={paddingTop + usableHeight - 8}
                          r={isSelected ? 6 : 4}
                          fill="none"
                          stroke="currentColor"
                          strokeOpacity={0.25}
                          strokeWidth={1.5}
                          strokeDasharray="2,2"
                        />
                      </g>
                    );
                  }
                  return (
                    <g
                      key={idx}
                      className="cursor-pointer group"
                      onClick={() => setSelectedChapter(pt.chNum)}
                    >
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? 7 : 4.5}
                        fill={isSelected ? "#f59e0b" : "#fff"}
                        stroke="#f59e0b"
                        strokeWidth={isSelected ? 3 : 2}
                        className="transition-all duration-200"
                      />
                      {isSelected && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={11}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth={1.5}
                          strokeOpacity={0.5}
                          className="animate-ping"
                        />
                      )}
                    </g>
                  );
                })}

                {/* Student Data Points */}
                {activeStudentCoords.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r={3.5}
                    fill="#06b6d4"
                    stroke="#fff"
                    strokeWidth={1.5}
                    className="pointer-events-none"
                  />
                ))}

                {/* X-Axis Chapter Labels */}
                {classCoords.map((pt) => {
                  const isSelected = selectedChapter === pt.chNum;
                  return (
                    <g
                      key={pt.chNum}
                      className="cursor-pointer"
                      onClick={() => setSelectedChapter(pt.chNum)}
                    >
                      <text
                        x={pt.x}
                        y={paddingTop + usableHeight + 16}
                        textAnchor="middle"
                        className={`text-[9.5px] font-mono font-bold transition-all ${
                          !pt.hasData ? "opacity-35" : isSelected ? "fill-amber-500 font-black text-[11px]" : "fill-current opacity-70"
                        }`}
                      >
                        B{pt.chNum}
                      </text>
                      <text
                        x={pt.x}
                        y={paddingTop + usableHeight + 28}
                        textAnchor="middle"
                        className={`text-[8px] font-mono ${
                          !pt.hasData ? "opacity-30" : isSelected ? "fill-amber-500 font-bold" : "fill-current opacity-40"
                        }`}
                      >
                        {pt.hasData ? pt.val : "-"}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. SPOTLIGHT DETAIL BAB AKTIF YANG DIPILIH
            ======================================================== */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-black/5 dark:via-white/5 to-transparent border border-amber-500/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-current/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-stone-950">
                  BAB {activeChapterData.chapterNum} TERPILIH
                </span>
                <span className="text-xs font-bold font-serif opacity-90">
                  {activeChapterData.titleJa}
                </span>
              </div>
              <h4 className="font-extrabold text-sm sm:text-base mt-0.5">
                {activeChapterData.titleId}
              </h4>
              <p className="text-[11px] opacity-70">
                Topik: {activeChapterData.topic}
              </p>
            </div>

            {/* Badges Status Bab */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                activeChapterData.status === "passed"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : activeChapterData.status === "warning"
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                  : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
              }`}>
                {activeChapterData.status === "passed"
                  ? "✓ Status: TUNTAS KKM"
                  : activeChapterData.status === "warning"
                  ? "⚠️ Status: WASPADA"
                  : "✕ Status: KRITIS / BUTUH REMEDIAL"}
              </span>

              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/10 border border-current/10">
                Rata-rata: <strong className="text-amber-500">{activeChapterData.avgTotal}</strong> / 100 pt
              </span>
            </div>
          </div>

          {/* Breakdown 4 Seksi Bab Terpilih */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-current/5">
              <span className="text-[10px] opacity-60 block">文字・語彙 (Moji)</span>
              <span className="font-mono font-black text-sm text-amber-600 dark:text-amber-400">
                {activeChapterData.avgMoji} <span className="text-[10px] opacity-50">/ 24 pt</span>
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-current/5">
              <span className="text-[10px] opacity-60 block">会話・表現 (Kaiwa)</span>
              <span className="font-mono font-black text-sm text-blue-600 dark:text-blue-400">
                {activeChapterData.avgKaiwa} <span className="text-[10px] opacity-50">/ 24 pt</span>
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-current/5">
              <span className="text-[10px] opacity-60 block">聴解 (Choukai)</span>
              <span className="font-mono font-black text-sm text-purple-600 dark:text-purple-400">
                {activeChapterData.avgChoukai} <span className="text-[10px] opacity-50">/ 24 pt</span>
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-current/5">
              <span className="text-[10px] opacity-60 block">読解 (Dokkai)</span>
              <span className="font-mono font-black text-sm text-rose-600 dark:text-rose-400">
                {activeChapterData.avgDokkai} <span className="text-[10px] opacity-50">/ 28 pt</span>
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-current/5 col-span-2 sm:col-span-1">
              <span className="text-[10px] opacity-60 block">漢字 (Kanji Harian)</span>
              <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                {activeChapterData.avgKanji} <span className="text-[10px] opacity-50">/ 100 pt</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. REKOMENDASI AKSI PEDAGOGIS SHIHAN PER BAB
          ======================================================== */}
      <div className="clay-card p-6 sm:p-8 rounded-3xl border border-current/10 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-current/10 pb-4">
          <div>
            <h4 className="text-base sm:text-lg font-extrabold tracking-tight font-serif flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Rekomendasi Aksi Perbaikan Pedagogis Shihan (指導改善計画)
            </h4>
            <p className="text-xs opacity-70 mt-0.5">
              Diagnosis spesifik kendala belajar siswa per bab dan panduan langkah perbaikan kurikulum terstruktur
            </p>
          </div>

          {/* Filter Status Ketercapaian */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-xs font-bold opacity-70 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter Bab:
            </span>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-current/10 text-xs font-bold">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  filterStatus === "all" ? "bg-amber-500 text-stone-950 font-black shadow-xs" : "opacity-70 hover:opacity-100"
                }`}
              >
                Semua ({chapterStats.length})
              </button>
              <button
                onClick={() => setFilterStatus("danger")}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  filterStatus === "danger" ? "bg-rose-500 text-white font-black shadow-xs" : "opacity-70 hover:opacity-100 text-rose-500"
                }`}
              >
                Kritis ({chapterStats.filter((c) => c.status === "danger").length})
              </button>
              <button
                onClick={() => setFilterStatus("warning")}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  filterStatus === "warning" ? "bg-amber-500 text-stone-950 font-black shadow-xs" : "opacity-70 hover:opacity-100 text-amber-500"
                }`}
              >
                Waspada ({chapterStats.filter((c) => c.status === "warning").length})
              </button>
              <button
                onClick={() => setFilterStatus("passed")}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  filterStatus === "passed" ? "bg-emerald-500 text-white font-black shadow-xs" : "opacity-70 hover:opacity-100 text-emerald-500"
                }`}
              >
                Tuntas ({chapterStats.filter((c) => c.status === "passed").length})
              </button>
            </div>
          </div>
        </div>

        {/* Cards Grid Rekomendasi Per Bab */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredChapters.map((ch) => {
            const isSelected = selectedChapter === ch.chapterNum;
            return (
              <div
                key={ch.chapterNum}
                onClick={() => setSelectedChapter(ch.chapterNum)}
                className={`p-5 rounded-2xl border transition space-y-3 cursor-pointer ${
                  isSelected
                    ? "bg-amber-500/10 border-amber-500/50 shadow-md ring-1 ring-amber-500/30"
                    : "bg-black/5 dark:bg-white/5 border-current/10 hover:border-amber-500/30 hover:bg-black/10 dark:hover:bg-white/10"
                }`}
              >
                {/* Header Bab Card */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">
                        BAB {ch.chapterNum}
                      </span>
                      <span className="text-[11px] font-serif opacity-75 font-bold">
                        {ch.titleJa}
                      </span>
                    </div>
                    <h5 className="font-extrabold text-sm mt-1 leading-snug">
                      {ch.titleId}
                    </h5>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black shrink-0 border ${
                    ch.status === "passed"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      : ch.status === "warning"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
                  }`}>
                    {ch.status === "passed" ? "✓ Tuntas KKM" : ch.status === "warning" ? "⚠️ Waspada" : "✕ Kritis"}
                  </span>
                </div>

                {/* Score Summary Metrics */}
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-current/5">
                  <div>
                    <span className="text-[10px] opacity-60 block">Rata-Rata Kelas</span>
                    <strong className="text-sm font-black font-mono text-amber-600 dark:text-amber-400">
                      {ch.avgTotal} pt
                    </strong>
                    <span className="text-[10px] opacity-60 ml-1">/ 100 pt</span>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-60 block">Ketuntasan KKM (≥{kkm})</span>
                    <strong className={`text-sm font-black font-mono ${
                      ch.passRate >= 70 ? "text-emerald-500" : ch.passRate >= 40 ? "text-amber-500" : "text-rose-500"
                    }`}>
                      {ch.passRate}%
                    </strong>
                    <span className="text-[10px] opacity-60 ml-1">({ch.passCount}/{ch.totalCount} siswa)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] opacity-60 block">Titik Terlemah</span>
                    <strong className="text-xs font-bold text-rose-500">
                      {ch.weakestAspect}
                    </strong>
                  </div>
                </div>

                {/* Root Cause & Actions */}
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-current/5">
                    <span className="font-bold text-[11px] text-amber-600 dark:text-amber-400 block mb-0.5">
                      🔍 Diagnosis Akar Kendala:
                    </span>
                    <p className="opacity-80 text-[11px] leading-relaxed">
                      {ch.rootCause}
                    </p>
                  </div>

                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <span className="font-bold text-[11px] text-amber-700 dark:text-amber-300 block mb-0.5">
                      👨‍🏫 Rekomendasi Aksi Pedagogis Guru:
                    </span>
                    <p className="opacity-85 text-[11px] leading-relaxed">
                      {ch.teacherAction}
                    </p>
                  </div>

                  <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-current/5">
                    <span className="font-bold text-[11px] text-blue-600 dark:text-blue-400 block mb-0.5">
                      ✍️ Tugas Mandiri &amp; Remedial Murid:
                    </span>
                    <p className="opacity-80 text-[11px] leading-relaxed">
                      {ch.studentAction}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
