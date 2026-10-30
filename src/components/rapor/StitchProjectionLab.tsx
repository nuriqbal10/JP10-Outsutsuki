"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  TrendingUp,
  Target,
  User,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  BarChart2,
  Layers,
  Award,
  Zap,
  BookOpen,
} from "lucide-react";
import { StudentRaporItem } from "@/types/rapor";

interface StitchProjectionLabProps {
  students: StudentRaporItem[];
  kkm: number;
  onSelectStudentPrint?: (student: StudentRaporItem) => void;
  onSelectStudentDetail?: (student: StudentRaporItem) => void;
}

export type HabitType =
  | "high_consistent"
  | "upward_momentum"
  | "stable_medium"
  | "choukai_reliant"
  | "dokkai_vulnerable"
  | "needs_intervention";

interface StudentProjectionProfile {
  student: StudentRaporItem;
  habit: {
    type: HabitType;
    label: string;
    description: string;
    badgeColor: string;
    icon: string;
  };
  // 6-Chapter Group Averages & 250 pt Review Projections
  avgBab1to6: number;
  projReview1: number; // 250 * (avg / 100)
  avgBab7to12: number;
  projReview2: number; // 250 * (avg / 100)
  avgBab13to18: number;
  projReview3: number; // 250 * (avg / 100)
  overall18Avg: number;
  projFinalExam: number; // 250 * (overall / 100)
  passPrometric: boolean; // projFinalExam >= 200
  isCaution: boolean; // 170 <= projFinalExam < 200
  // Chapter-by-chapter 18 scores (riil 1-11, projected 12-18)
  chapterCurve: {
    chapter: number;
    score: number;
    isProjected: boolean;
  }[];
}

export default function StitchProjectionLab({
  students,
  kkm,
  onSelectStudentPrint,
  onSelectStudentDetail,
}: StitchProjectionLabProps) {
  const [selectedStudentNo, setSelectedStudentNo] = useState<number>(students[0]?.no || 1);
  const [interventionDelta, setInterventionDelta] = useState<number>(0); // -5 to +15 pts
  const [activeViewMode, setActiveViewMode] = useState<"overview" | "students" | "whatif">("overview");

  // Pemodelan Proyeksi & Profil Kebiasaan Siswa Berdasarkan Data Riil Bab 1-11
  const projections: StudentProjectionProfile[] = useMemo(() => {
    return students.map((st) => {
      // 1. Ekstrak data riil Bab 1 - 11
      const realScores: number[] = [];
      const realDokkaiPct: number[] = [];
      const realChoukaiPct: number[] = [];

      for (let i = 0; i < 11; i++) {
        const h = st.harian?.[i];
        const dt = h?.daiTesuto || { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 };
        const tot = dt.total > 0 ? dt.total : 50; // fallback if missing
        realScores.push(tot);
        if (dt.total > 0) {
          realDokkaiPct.push((dt.dokkai / 28) * 100);
          realChoukaiPct.push((dt.choukai / 24) * 100);
        }
      }

      // Group 1: Bab 1-6 (Riil)
      const b1to6 = realScores.slice(0, 6);
      const avgBab1to6 = Math.round((b1to6.reduce((a, b) => a + b, 0) / 6) * 10) / 10;
      const projReview1 = Math.round((250 * (avgBab1to6 / 100)) * 10) / 10;

      // Group 2: Bab 7-11 (Riil) & Proyeksi Bab 12
      const b7to11 = realScores.slice(6, 11);
      const avgBab7to11 = Math.round((b7to11.reduce((a, b) => a + b, 0) / 5) * 10) / 10;

      // Hitung momentum tren belajar
      const momentum = (avgBab7to11 - avgBab1to6) / 5;
      const projBab12 = Math.min(98, Math.max(35, Math.round(avgBab7to11 + momentum + interventionDelta)));

      const avgBab7to12 = Math.round(((avgBab7to11 * 5 + projBab12) / 6) * 10) / 10;
      const projReview2 = Math.round((250 * (avgBab7to12 / 100)) * 10) / 10;

      // Group 3: Proyeksi Bab 13-18 (Berdasarkan baseline & momentum belajar)
      const projectedBab13to18: number[] = [];
      let runningScore = avgBab7to12;
      for (let ch = 13; ch <= 18; ch++) {
        const slightFluctuation = ((st.no * 7 + ch * 11) % 9) - 4;
        const projectedVal = Math.min(
          98,
          Math.max(35, Math.round(runningScore + momentum * 0.4 + slightFluctuation + interventionDelta))
        );
        projectedBab13to18.push(projectedVal);
        runningScore = projectedVal;
      }

      const avgBab13to18 = Math.round((projectedBab13to18.reduce((a, b) => a + b, 0) / 6) * 10) / 10;
      const projReview3 = Math.round((250 * (avgBab13to18 / 100)) * 10) / 10;

      // Overall 18-Chapter Projected Average
      const all18Scores = [...realScores.slice(0, 11), projBab12, ...projectedBab13to18];
      const overall18Avg = Math.round((all18Scores.reduce((a, b) => a + b, 0) / 18) * 10) / 10;
      const projFinalExam = Math.round((250 * (overall18Avg / 100)) * 10) / 10;

      // Deteksi Kebiasaan Belajar Siswa (Habit Persona)
      const avgDokkai = realDokkaiPct.length > 0 ? realDokkaiPct.reduce((a, b) => a + b, 0) / realDokkaiPct.length : 60;
      const avgChoukai = realChoukaiPct.length > 0 ? realChoukaiPct.reduce((a, b) => a + b, 0) / realChoukaiPct.length : 60;

      let habit: StudentProjectionProfile["habit"] = {
        type: "stable_medium",
        label: "Konsisten Stabil (中堅安定型)",
        description: "Menunjukkan ritme belajar konstan, membutuhkan dorongan ekstra untuk menembus ambang 200 pt.",
        badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/30",
        icon: "⚖️",
      };

      if (overall18Avg >= 80) {
        habit = {
          type: "high_consistent",
          label: "Juara Unggul Konsisten (優秀持続型)",
          description: "Penguasaan 4 aspek sangat solid, diproyeksikan lulus ujian CBT Prometric dengan skor meyakinkan.",
          badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
          icon: "👑",
        };
      } else if (momentum >= 1.5) {
        habit = {
          type: "upward_momentum",
          label: "Akselerasi Cepat (急伸型)",
          description: "Tren nilai bab 7-11 melesat naik tajam. Potensi besar lulus jika konsistensi dipertahankan.",
          badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
          icon: "🚀",
        };
      } else if (avgDokkai < 55 && avgChoukai >= 65) {
        habit = {
          type: "dokkai_vulnerable",
          label: "Rentan di Dokkai (読解弱点型)",
          description: "Listening dan percakapan baik, namun sering kehabisan waktu atau kesulitan pada teks bacaan panjang.",
          badgeColor: "bg-rose-500/10 text-rose-500 border-rose-500/30",
          icon: "📖",
        };
      } else if (avgChoukai > avgDokkai + 15) {
        habit = {
          type: "choukai_reliant",
          label: "Spesialis Audio (聴解得意型)",
          description: "Sangat mengandalkan nilai Choukai untuk mendongkrak total skor komulatif.",
          badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
          icon: "🎧",
        };
      } else if (overall18Avg < 60) {
        habit = {
          type: "needs_intervention",
          label: "Wajib Karantina Belajar (要集中指導型)",
          description: "Berada dalam zona risiko tinggi tidak lulus Prometric (<170 pt). Memerlukan drill intensif.",
          badgeColor: "bg-rose-600/15 text-rose-600 border-rose-600/40",
          icon: "⚠️",
        };
      }

      // 18-Chapter Curve (1-11 Riil, 12-18 Proyeksi)
      const chapterCurve = all18Scores.map((sc, idx) => ({
        chapter: idx + 1,
        score: sc,
        isProjected: idx >= 11, // Bab 12 s.d. 18
      }));

      return {
        student: st,
        habit,
        avgBab1to6,
        projReview1,
        avgBab7to12,
        projReview2,
        avgBab13to18,
        projReview3,
        overall18Avg,
        projFinalExam,
        passPrometric: projFinalExam >= 200,
        isCaution: projFinalExam >= 170 && projFinalExam < 200,
        chapterCurve,
      };
    });
  }, [students, interventionDelta]);

  // Selected Student Profile
  const selectedProfile = useMemo(() => {
    return projections.find((p) => p.student.no === selectedStudentNo) || projections[0];
  }, [projections, selectedStudentNo]);

  // Class Aggregates for Projection
  const classAverages = useMemo(() => {
    const total = projections.length || 28;
    const avgR1 = Math.round((projections.reduce((a, b) => a + b.projReview1, 0) / total) * 10) / 10;
    const avgR2 = Math.round((projections.reduce((a, b) => a + b.projReview2, 0) / total) * 10) / 10;
    const avgR3 = Math.round((projections.reduce((a, b) => a + b.projReview3, 0) / total) * 10) / 10;
    const avgFinal = Math.round((projections.reduce((a, b) => a + b.projFinalExam, 0) / total) * 10) / 10;

    const passCount = projections.filter((p) => p.passPrometric).length;
    const cautionCount = projections.filter((p) => p.isCaution).length;
    const remedialCount = projections.filter((p) => !p.passPrometric && !p.isCaution).length;
    const passRate = Math.round((passCount / total) * 100);

    return {
      avgR1,
      avgR2,
      avgR3,
      avgFinal,
      passCount,
      cautionCount,
      remedialCount,
      passRate,
      total,
    };
  }, [projections]);

  // SVG Trajectory Chart Metrics (Google Stitch Aesthetic)
  const chartHeight = 240;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;
  const usableWidth = 840 - paddingLeft - paddingRight;
  const usableHeight = chartHeight - paddingTop - paddingBottom;

  const getX = (ch: number) => paddingLeft + ((ch - 1) / 17) * usableWidth;
  const getY = (val: number) => paddingTop + usableHeight - (Math.max(0, Math.min(100, val)) / 100) * usableHeight;

  // Real vs Projected Division Line at Chapter 11.5
  const boundaryX = (getX(11) + getX(12)) / 2;

  // Polyline coordinates for Selected Student
  const studentPts = selectedProfile.chapterCurve.map((pt) => ({
    x: getX(pt.chapter),
    y: getY(pt.score),
    val: pt.score,
    isProj: pt.isProjected,
    ch: pt.chapter,
  }));

  const realPolyline = studentPts
    .slice(0, 11)
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  const projPolyline = studentPts
    .slice(10, 18) // starts from 11 to connect
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  const kkmY = getY(kkm);

  return (
    <div className="space-y-6">
      {/* ========================================================
          1. GOOGLE STITCH HERO BANNER (FORECASTING LAB)
          ======================================================== */}
      <section className="clay-card p-6 sm:p-8 rounded-3xl border border-current/10 relative overflow-hidden shadow-xl bg-gradient-to-br from-indigo-500/10 via-amber-500/5 to-transparent">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-500 text-white shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> GOOGLE STITCH FORECASTING LAB
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-black/5 dark:bg-white/10 opacity-80 border border-current/10">
                Data Riil: Bab 1–11 • Zona Prediksi: Bab 12–18
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
              Simulasi Proyeksi Nilai &amp; Kebiasaan Belajar Siswa
            </h2>
            <p className="text-xs sm:text-sm opacity-75 leading-relaxed">
              Memodelkan proyeksi nilai review per 6 bab dan ujian akhir (skala 250 poin) sesuai formula matematis resmi: <code className="font-mono text-amber-500 font-bold">Skor = 250 × (Rata-Rata 6 Bab / 100)</code>. Menganalisis kebiasaan belajar tiap siswa secara prediktif tanpa memanipulasi data riil master rapor.
            </p>
          </div>

          {/* Mode Switcher Segmented Pills */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 self-start lg:self-center shrink-0">
            <button
              onClick={() => setActiveViewMode("overview")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === "overview"
                  ? "bg-amber-500 text-stone-950 shadow-sm font-black"
                  : "opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Ikhtisar Proyeksi</span>
            </button>
            <button
              onClick={() => setActiveViewMode("students")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === "students"
                  ? "bg-amber-500 text-stone-950 shadow-sm font-black"
                  : "opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Matriks 28 Siswa</span>
            </button>
            <button
              onClick={() => setActiveViewMode("whatif")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === "whatif"
                  ? "bg-amber-500 text-stone-950 shadow-sm font-black"
                  : "opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Simulator &quot;What-If&quot;</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Projection Cards (Per 6 Bab Formula) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-6 relative z-10">
          {/* Card 1: Review 1 */}
          <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block">
              Proyeksi Review 1 (Bab 1–6)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-500 font-mono">
                {classAverages.avgR1}
              </span>
              <span className="text-xs opacity-60">/ 250 pt</span>
            </div>
            <p className="text-[10px] opacity-70">
              Formula: 250 × (Rata-rata 6 bab: <strong>{Math.round((classAverages.avgR1 / 250) * 100)}%</strong>)
            </p>
          </div>

          {/* Card 2: Review 2 */}
          <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block">
              Proyeksi Review 2 (Bab 7–12)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-blue-500 font-mono">
                {classAverages.avgR2}
              </span>
              <span className="text-xs opacity-60">/ 250 pt</span>
            </div>
            <p className="text-[10px] opacity-70">
              Formula: 250 × (Rata-rata 6 bab: <strong>{Math.round((classAverages.avgR2 / 250) * 100)}%</strong>)
            </p>
          </div>

          {/* Card 3: Review 3 */}
          <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block">
              Proyeksi Review 3 (Bab 13–18)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-purple-500 font-mono">
                {classAverages.avgR3}
              </span>
              <span className="text-xs opacity-60">/ 250 pt</span>
            </div>
            <p className="text-[10px] opacity-70">
              Formula: 250 × (Rata-rata 6 bab: <strong>{Math.round((classAverages.avgR3 / 250) * 100)}%</strong>)
            </p>
          </div>

          {/* Card 4: Final Exam Prometric */}
          <div className="p-4 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 block">
                Prediksi Kelulusan JFT
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                {classAverages.passRate}% Lulus
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-indigo-300 font-mono">
                {classAverages.avgFinal}
              </span>
              <span className="text-xs opacity-60">/ 250 pt</span>
            </div>
            <p className="text-[10px] opacity-75">
              {classAverages.passCount} dari {classAverages.total} siswa diproyeksikan lolos target $\ge 200$ pt.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. GOOGLE STITCH TRAJECTORY CHART (RIIL VS PROYEKSI)
          ======================================================== */}
      {activeViewMode === "overview" && (
        <section className="clay-card p-6 sm:p-8 rounded-3xl border border-current/10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-current/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  Dual-Zone Trajectory
                </span>
                <span className="text-xs font-mono font-bold opacity-70">
                  Garis Solid = Riil • Garis Putus-Putus = Proyeksi
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight font-serif mt-1 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                Lintasan Prediksi Belajar: {selectedProfile.student.name}
              </h3>
            </div>

            {/* Student Picker */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold opacity-70">Pilih Siswa:</span>
              <select
                value={selectedStudentNo}
                onChange={(e) => setSelectedStudentNo(Number(e.target.value))}
                className="px-3 py-2 rounded-xl text-xs font-bold border border-current/20 bg-[var(--background)] text-[var(--text-heading)] focus:outline-hidden focus:border-indigo-500 cursor-pointer shadow-sm"
              >
                {students.map((st) => (
                  <option key={st.no} value={st.no} className="bg-stone-900 text-white">
                    #{st.rank || st.no} - {st.name} ({st.grade || "B"})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SVG Canvas ala Google Stitch */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[760px]">
              <svg viewBox={`0 0 840 ${chartHeight}`} className="w-full h-auto select-none overflow-visible">
                {/* Background Shading for Projected Zone (Bab 12-18) */}
                <rect
                  x={boundaryX}
                  y={paddingTop}
                  width={840 - paddingRight - boundaryX}
                  height={usableHeight}
                  fill="currentColor"
                  fillOpacity={0.03}
                />

                {/* Vertical Divider Line marking Real vs Projected */}
                <line
                  x1={boundaryX}
                  y1={paddingTop - 10}
                  x2={boundaryX}
                  y2={paddingTop + usableHeight + 5}
                  stroke="#6366f1"
                  strokeWidth={1.5}
                  strokeDasharray="4,4"
                  strokeOpacity={0.6}
                />
                <text
                  x={boundaryX - 6}
                  y={paddingTop + 14}
                  textAnchor="end"
                  className="text-[9px] font-bold font-mono fill-current opacity-60"
                >
                  ← Data Riil (Bab 1–11)
                </text>
                <text
                  x={boundaryX + 6}
                  y={paddingTop + 14}
                  textAnchor="start"
                  className="text-[9px] font-bold font-mono fill-indigo-400"
                >
                  Zona Proyeksi Stitch (Bab 12–18) →
                </text>

                {/* Horizontal Grid lines */}
                {[0, 25, 50, 75, 100].map((gridVal) => {
                  const y = getY(gridVal);
                  return (
                    <g key={gridVal}>
                      <line
                        x1={paddingLeft}
                        y1={y}
                        x2={840 - paddingRight}
                        y2={y}
                        stroke="currentColor"
                        strokeOpacity={0.08}
                        strokeWidth={1}
                      />
                      <text
                        x={paddingLeft - 8}
                        y={y + 3}
                        textAnchor="end"
                        className="text-[9px] font-mono fill-current opacity-40"
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
                  x2={840 - paddingRight}
                  y2={kkmY}
                  stroke="#f43f5e"
                  strokeWidth={1.5}
                  strokeDasharray="4,4"
                  strokeOpacity={0.7}
                />
                <text
                  x={840 - paddingRight}
                  y={kkmY - 6}
                  textAnchor="end"
                  className="text-[9px] font-bold font-mono fill-rose-500"
                >
                  KKM {kkm} pt
                </text>

                {/* Solid Line for Real Chapters 1 to 11 */}
                <polyline
                  points={realPolyline}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Glowing Dashed Line for Projected Chapters 12 to 18 */}
                <polyline
                  points={projPolyline}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  strokeDasharray="5,4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {studentPts.map((pt, idx) => (
                  <g key={idx} className="cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={pt.isProj ? 5 : 4.5}
                      fill={pt.isProj ? "#6366f1" : "#f59e0b"}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                    <text
                      x={pt.x}
                      y={paddingTop + usableHeight + 16}
                      textAnchor="middle"
                      className={`text-[9.5px] font-mono font-bold ${
                        pt.isProj ? "fill-indigo-400 font-black" : "fill-current opacity-70"
                      }`}
                    >
                      B{pt.ch}
                    </text>
                    <text
                      x={pt.x}
                      y={paddingTop + usableHeight + 28}
                      textAnchor="middle"
                      className={`text-[8.5px] font-mono ${
                        pt.isProj ? "fill-indigo-400 font-bold" : "fill-current opacity-50"
                      }`}
                    >
                      {pt.val}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Student Persona & Stitch Habit Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Persona Habit Badge */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block">
                Profil Karakteristik &amp; Kebiasaan Belajar
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedProfile.habit.icon}</span>
                <div>
                  <h4 className="font-extrabold text-sm">{selectedProfile.habit.label}</h4>
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold border ${selectedProfile.habit.badgeColor}`}>
                    {selectedProfile.habit.type.toUpperCase()}
                  </span>
                </div>
              </div>
              <p className="text-[11px] opacity-75 leading-relaxed">
                {selectedProfile.habit.description}
              </p>
            </div>

            {/* Formula 250 pt Review Projection Breakdown */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block">
                Hasil Kalkulasi Formula Review (250 pt)
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="opacity-70 font-sans">Review 1 (Bab 1–6):</span>
                  <strong className="text-amber-500 font-black">
                    {selectedProfile.projReview1} pt <span className="opacity-50 text-[10px]">({selectedProfile.avgBab1to6}%)</span>
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70 font-sans">Review 2 (Bab 7–12):</span>
                  <strong className="text-blue-500 font-black">
                    {selectedProfile.projReview2} pt <span className="opacity-50 text-[10px]">({selectedProfile.avgBab7to12}%)</span>
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70 font-sans">Review 3 (Bab 13–18):</span>
                  <strong className="text-purple-500 font-black">
                    {selectedProfile.projReview3} pt <span className="opacity-50 text-[10px]">({selectedProfile.avgBab13to18}%)</span>
                  </strong>
                </div>
              </div>
              <div className="pt-2 border-t border-current/10 flex items-center justify-between text-xs">
                <span className="font-sans font-bold">Proyeksi Final:</span>
                <strong className="text-base font-black text-indigo-400 font-mono">
                  {selectedProfile.projFinalExam} / 250 pt
                </strong>
              </div>
            </div>

            {/* Prometric Readiness Forecast */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex flex-col justify-between space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block">
                Status Kesiapan Ujian JFT-Basic A2
              </span>
              <div className="my-1">
                {selectedProfile.passPrometric ? (
                  <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <div>
                      <span className="font-extrabold text-sm block">Diproyeksikan Lulus (≥200 pt)</span>
                      <span className="text-[10px] opacity-75">Probabilitas keberhasilan tinggi</span>
                    </div>
                  </div>
                ) : selectedProfile.isCaution ? (
                  <div className="flex items-center gap-2 text-amber-500">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div>
                      <span className="font-extrabold text-sm block">Zona Waspada (170–199 pt)</span>
                      <span className="text-[10px] opacity-75">Butuh penguatan pada Dokkai/Choukai</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-500">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <div>
                      <span className="font-extrabold text-sm block">Perlu Remedial Intensif (&lt;170 pt)</span>
                      <span className="text-[10px] opacity-75">Wajib bimbingan karantina materi</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="pt-2 border-t border-current/10 flex items-center justify-between">
                <span className="text-[10px] opacity-60">Ambang Kelulusan: 200 pt</span>
                <button
                  onClick={() => onSelectStudentDetail && onSelectStudentDetail(selectedProfile.student)}
                  className="text-indigo-400 hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  Detail Siswa →
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          3. MATRIKS 28 SISWA DENGAN FORMULA PROYEKSI RESMI
          ======================================================== */}
      {activeViewMode === "students" && (
        <section className="clay-card p-6 sm:p-8 rounded-3xl border border-current/10 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base font-serif flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                Matriks Proyeksi 28 Siswa (Formula Review 250 Poin)
              </h3>
              <p className="text-xs opacity-70">
                Formula: <code className="font-mono text-amber-500 font-bold">Review Score = 250 × (Rata-rata 6 Bab / 100)</code>
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-bold">
              Ambang Lolos: ≥200 pt
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-current/10 bg-black/5 dark:bg-white/5 opacity-80 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3 text-center w-12">No</th>
                  <th className="p-3">Nama Lengkap Siswa</th>
                  <th className="p-3">Karakteristik &amp; Kebiasaan</th>
                  <th className="p-3 text-center w-28">Proj Rev 1 (/250)</th>
                  <th className="p-3 text-center w-28">Proj Rev 2 (/250)</th>
                  <th className="p-3 text-center w-28">Proj Rev 3 (/250)</th>
                  <th className="p-3 text-center w-28">Proj Final (/250)</th>
                  <th className="p-3 text-center w-32">Status Prometric</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-current/10 font-medium">
                {projections.map((prof, idx) => (
                  <tr
                    key={prof.student.no}
                    onClick={() => {
                      setSelectedStudentNo(prof.student.no);
                      setActiveViewMode("overview");
                    }}
                    className="hover:bg-indigo-500/10 cursor-pointer transition"
                  >
                    <td className="p-3 text-center font-bold opacity-60">
                      #{idx + 1}
                    </td>
                    <td className="p-3 font-bold">
                      <div className="flex items-center gap-2">
                        <span>{prof.student.name}</span>
                        <span className="text-[9px] font-mono opacity-50 px-1 py-0.5 rounded bg-black/5 dark:bg-white/5">
                          {prof.student.nim || `#${prof.student.no}`}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${prof.habit.badgeColor}`}>
                        <span>{prof.habit.icon}</span>
                        <span>{prof.habit.label}</span>
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono text-amber-600 dark:text-amber-400 font-bold">
                      {prof.projReview1} <span className="text-[10px] opacity-50">({prof.avgBab1to6}%)</span>
                    </td>
                    <td className="p-3 text-center font-mono text-blue-600 dark:text-blue-400 font-bold">
                      {prof.projReview2} <span className="text-[10px] opacity-50">({prof.avgBab7to12}%)</span>
                    </td>
                    <td className="p-3 text-center font-mono text-purple-600 dark:text-purple-400 font-bold">
                      {prof.projReview3} <span className="text-[10px] opacity-50">({prof.avgBab13to18}%)</span>
                    </td>
                    <td className="p-3 text-center font-mono font-black text-sm text-indigo-400">
                      {prof.projFinalExam}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        prof.passPrometric
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : prof.isCaution
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
                      }`}>
                        {prof.passPrometric ? "✓ LOLOS" : prof.isCaution ? "⚠️ WASPADA" : "✕ REMEDIAL"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ========================================================
          4. SIMULATOR "WHAT-IF" (INTERVENSI BELAJAR INTERAKTIF)
          ======================================================== */}
      {activeViewMode === "whatif" && (
        <section className="clay-card p-6 sm:p-8 rounded-3xl border border-current/10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-current/10 pb-4">
            <div>
              <h3 className="font-extrabold text-base font-serif flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                Simulator Skenario Kebijakan Belajar (&quot;What-If&quot;)
              </h3>
              <p className="text-xs opacity-70">
                Uji dampak pemberian jam tambahan, drilling LKPD, atau program karantina terhadap proyeksi kelulusan ujian Prometric
              </p>
            </div>
            <button
              onClick={() => setInterventionDelta(0)}
              className="text-xs font-bold text-amber-500 hover:underline cursor-pointer"
            >
              Reset ke Normal (0 pt)
            </button>
          </div>

          {/* Slider Control ala Google Stitch */}
          <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider opacity-70">
                Tingkat Intervensi Pedagogis:
              </span>
              <span className="font-mono font-black text-base text-indigo-400">
                {interventionDelta > 0 ? `+${interventionDelta} pt` : `${interventionDelta} pt`} (Efek Belajar)
              </span>
            </div>

            <input
              type="range"
              min="-10"
              max="15"
              step="1"
              value={interventionDelta}
              onChange={(e) => setInterventionDelta(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />

            <div className="flex items-center justify-between text-[10px] opacity-60 font-mono">
              <span>-10 pt (Penurunan Disiplin)</span>
              <span>0 pt (Normal Baseline)</span>
              <span>+5 pt (Drilling Harian)</span>
              <span>+10 pt (Karantina Intensif)</span>
              <span>+15 pt (Camp Sukses 100%)</span>
            </div>
          </div>

          {/* Impact Simulation Outcomes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 text-center space-y-1">
              <span className="text-[10px] opacity-60 block font-bold uppercase tracking-wider">
                Proyeksi Rata-Rata Ujian Akhir
              </span>
              <span className="text-3xl font-black text-indigo-400 font-mono">
                {classAverages.avgFinal}
              </span>
              <span className="text-xs opacity-60 block">Skala 250 pt</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 text-center space-y-1">
              <span className="text-[10px] opacity-60 block font-bold uppercase tracking-wider">
                Tingkat Kelulusan Kelas (≥200 pt)
              </span>
              <span className="text-3xl font-black text-emerald-500 font-mono">
                {classAverages.passRate}%
              </span>
              <span className="text-xs opacity-60 block">{classAverages.passCount} dari {classAverages.total} Siswa Lolos</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 text-center space-y-1">
              <span className="text-[10px] opacity-60 block font-bold uppercase tracking-wider">
                Siswa Dalam Zona Resiko
              </span>
              <span className="text-3xl font-black text-rose-500 font-mono">
                {classAverages.remedialCount} Siswa
              </span>
              <span className="text-xs opacity-60 block">Waspada: {classAverages.cautionCount} Siswa</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
